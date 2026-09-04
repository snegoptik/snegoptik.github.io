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
      city: entry.city,
      savedAt: new Date().toISOString()
    };
    if (i === -1) list.unshift(row);
    else list[i] = row;
    writeCharts(list);
    saveNatal({ date: row.date, time: row.time, city: row.city, name: row.name, id: row.id });
    return row;
  }

  function deleteChart(id) {
    writeCharts(loadCharts().filter(function (c) { return c.id !== id; }));
  }

  function natalQuery(entry) {
    const q = new URLSearchParams();
    q.set("date", entry.date);
    if (entry.time) q.set("time", entry.time);
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
    formatRuDate: formatRuDate,
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
