(function () {
  function fillCityLists() {
    const lists = document.querySelectorAll("datalist[data-cities]");
    if (!lists.length || !window.ZENIT_CITIES) return;
    const html = window.ZENIT_CITIES.map(function (c) {
      let o = '<option value="' + c.name + '"></option>';
      (c.aliases || []).forEach(function (a) {
        o += '<option value="' + a + '"></option>';
      });
      return o;
    }).join("");
    lists.forEach(function (el) { el.innerHTML = html; });
  }

  const PERIOD_LABEL = {};
  for (let hour = 0; hour < 24; hour++) {
    const id = (hour < 10 ? "0" : "") + hour;
    const next = hour === 23 ? "24:00" : ((hour + 1 < 10 ? "0" : "") + (hour + 1) + ":00");
    PERIOD_LABEL[id] = id + ":00–" + next;
  }

  function periodId(entry) {
    if (!entry || entry.time) return "";
    return PERIOD_LABEL[entry.period] ? entry.period : "";
  }

  function saveNatal(params) {
    try { localStorage.setItem("zenit-natal", JSON.stringify(params)); } catch (e) {}
  }

  function loadNatal() {
    try { return JSON.parse(localStorage.getItem("zenit-natal") || "null"); } catch (e) { return null; }
  }

  function formatRuDate(iso) {
    if (!iso) return "";
    const p = iso.split("-");
    return p[2] + "." + p[1] + "." + p[0];
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function loadCharts() {
    try { return JSON.parse(localStorage.getItem("zenit-charts") || "[]"); } catch (e) { return []; }
  }

  function writeCharts(list) {
    try { localStorage.setItem("zenit-charts", JSON.stringify(list.slice(0, 24))); } catch (e) {}
  }

  function findSameChart(list, entry) {
    if (entry.id) {
      const byId = list.findIndex(function (c) { return c.id === entry.id; });
      if (byId !== -1) return byId;
    }
    return list.findIndex(function (c) {
      return c.date === entry.date && (c.time || "") === (entry.time || "") && c.city === entry.city;
    });
  }

  function upsertChart(entry) {
    const list = loadCharts();
    const i = findSameChart(list, entry);
    const row = {
      id: i === -1 ? (entry.id || uid()) : list[i].id,
      name: (entry.name || (i === -1 ? "Я" : list[i].name) || "Я").trim(),
      date: entry.date,
      time: entry.time || "",
      period: entry.time ? "" : (PERIOD_LABEL[entry.period] ? entry.period : (i === -1 ? "" : (list[i].period || ""))),
      city: entry.city,
      savedAt: new Date().toISOString()
    };
    if (i === -1) list.unshift(row);
    else list[i] = row;
    writeCharts(list);
    const prev = loadNatal();
    const same = prev && prev.date === row.date && (prev.time || "") === (row.time || "") && prev.city === row.city;
    saveNatal({
      date: row.date,
      time: row.time,
      period: row.period || "",
      city: row.city,
      name: row.name,
      id: row.id,
      sketch: same ? prev.sketch : undefined
    });
    return row;
  }

  function deleteChart(id) {
    writeCharts(loadCharts().filter(function (c) { return c.id !== id; }));
  }

  function exportPayload() {
    return {
      zenit: 1,
      charts: loadCharts().map(function (c) {
        return {
          id: c.id,
          name: c.name,
          date: c.date,
          time: c.time || "",
          period: c.time ? "" : (c.period || ""),
          city: c.city,
          savedAt: c.savedAt
        };
      })
    };
  }

  function importCharts(payload) {
    if (!payload || payload.zenit !== 1 || !Array.isArray(payload.charts)) return { ok: false, added: 0 };
    const list = loadCharts();
    let added = 0;
    payload.charts.forEach(function (raw) {
      if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw.date || "") || !raw.city) return;
      const entry = {
        date: raw.date,
        time: raw.time || "",
        period: raw.time ? "" : (PERIOD_LABEL[raw.period] ? raw.period : ""),
        city: String(raw.city).slice(0, 80)
      };
      if (findSameChart(list, entry) !== -1) return;
      let id = raw.id || uid();
      if (list.some(function (c) { return c.id === id; })) id = uid();
      list.unshift({
        id: id,
        name: String(raw.name || "Я").trim().slice(0, 40) || "Я",
        date: entry.date,
        time: entry.time,
        period: entry.period || "",
        city: entry.city,
        savedAt: raw.savedAt || new Date().toISOString()
      });
      added += 1;
    });
    writeCharts(list);
    if (!loadNatal() && list[0]) {
      saveNatal({ date: list[0].date, time: list[0].time, period: list[0].period || "", city: list[0].city, name: list[0].name, id: list[0].id });
    }
    return { ok: true, added: added, total: Math.min(list.length, 24) };
  }

  function natalQuery(entry) {
    const q = new URLSearchParams();
    q.set("date", entry.date);
    if (entry.time) q.set("time", entry.time);
    else if (periodId(entry)) q.set("period", entry.period);
    q.set("city", entry.city || "Москва");
    return q.toString();
  }

  window.Zenit = {
    fillCityLists: fillCityLists,
    saveNatal: saveNatal,
    loadNatal: loadNatal,
    loadCharts: loadCharts,
    upsertChart: upsertChart,
    deleteChart: deleteChart,
    natalQuery: natalQuery,
    exportPayload: exportPayload,
    importCharts: importCharts,
    formatRuDate: formatRuDate,
    periodLabel: function (id) { return PERIOD_LABEL[id] || ""; },
    todayISO: function () {
      const d = new Date();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return d.getFullYear() + "-" + m + "-" + day;
    }
  };

  function applySky(name) {
    const sky = name === "paper" ? "paper" : "dusk";
    document.documentElement.setAttribute("data-sky", sky);
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.setAttribute("content", sky === "paper" ? "#f3eee4" : "#110f0d");
    try { localStorage.setItem("zenit-sky", sky); } catch (e) {}
  }

  function mountSkyToggle() {
    const bar = document.querySelector(".topbar");
    if (!bar || document.getElementById("sky-toggle")) return;
    const btn = document.createElement("button");
    btn.id = "sky-toggle";
    btn.className = "sky-toggle";
    btn.type = "button";
    function sync() {
      const paper = document.documentElement.getAttribute("data-sky") === "paper";
      btn.textContent = paper ? "Ночь" : "День";
      btn.setAttribute("aria-label", paper ? "Включить ночное небо" : "Включить светлую бумагу");
    }
    btn.addEventListener("click", function () {
      applySky(document.documentElement.getAttribute("data-sky") === "paper" ? "dusk" : "paper");
      sync();
    });
    const nav = bar.querySelector(".top-nav");
    bar.insertBefore(btn, nav || bar.lastChild);
    sync();
  }

  try {
    applySky(localStorage.getItem("zenit-sky") || "dusk");
  } catch (e) {
    applySky("dusk");
  }
  mountSkyToggle();
  fillCityLists();
})();
