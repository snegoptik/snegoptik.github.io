(function () {
  const MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function daysInMonth(year, month) {
    if (!year || !month) return 31;
    return new Date(year, month, 0).getDate();
  }

  function yearOptions(selected) {
    const now = new Date().getFullYear();
    let html = "";
    for (let y = now; y >= 1920; y--) {
      html += '<option value="' + y + '"' + (String(y) === String(selected) ? " selected" : "") + ">" + y + "</option>";
    }
    return html;
  }

  function numOptions(from, to, selected, padded) {
    let html = "";
    for (let i = from; i <= to; i++) {
      const val = padded ? pad(i) : String(i);
      const cmp = padded ? pad(Number(selected) || selected) : String(selected);
      html += '<option value="' + val + '"' + (val === cmp || String(i) === String(selected) ? " selected" : "") + ">" + val + "</option>";
    }
    return html;
  }

  function parseDate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const p = iso.split("-");
    return { y: p[0], m: p[1], d: String(Number(p[2])) };
  }

  function parseTime(hm) {
    if (!hm || !/^\d{1,2}:\d{2}/.test(hm)) return null;
    const p = hm.split(":");
    return { h: pad(p[0]), min: pad(p[1]) };
  }

  function qs(root, part) {
    return root.querySelector('[data-part="' + part + '"]');
  }

  function rebuildDays(root, keepDay) {
    const y = Number(qs(root, "year").value);
    const m = Number(qs(root, "month").value);
    const max = daysInMonth(y, m);
    const daySel = qs(root, "day");
    const current = keepDay || daySel.value || "1";
    const next = Math.min(Number(current) || 1, max);
    daySel.innerHTML = numOptions(1, max, next, false);
    daySel.value = String(next);
  }

  function syncHidden(root) {
    const y = qs(root, "year").value;
    const m = qs(root, "month").value;
    const d = qs(root, "day").value;
    const unknown = qs(root, "notime").checked;
    qs(root, "date").value = y && m && d ? y + "-" + pad(m) + "-" + pad(d) : "";
    if (unknown) {
      qs(root, "time").value = "";
    } else {
      qs(root, "time").value = qs(root, "hour").value + ":" + qs(root, "minute").value;
    }
    root.classList.toggle("is-notime", unknown);
    qs(root, "hour").disabled = unknown;
    qs(root, "minute").disabled = unknown;
  }

  function fill(root, dateIso, timeHm) {
    if (!root) return;
    const parsed = parseDate(dateIso);
    if (parsed) {
      qs(root, "year").value = parsed.y;
      qs(root, "month").value = parsed.m;
      rebuildDays(root, parsed.d);
    }
    const tm = parseTime(timeHm);
    const unknown = !tm;
    qs(root, "notime").checked = unknown;
    if (tm) {
      qs(root, "hour").value = tm.h;
      qs(root, "minute").value = tm.min;
    }
    syncHidden(root);
  }

  function mount(root) {
    if (!root || root.dataset.ready) return;
    const dateName = root.getAttribute("data-date-name") || "date";
    const timeName = root.getAttribute("data-time-name") || "time";
    const uid = root.id || dateName;
    const initialDate = parseDate(root.getAttribute("data-date") || "");
    const initialTime = parseTime(root.getAttribute("data-time") || "");
    const y = initialDate ? initialDate.y : "1994";
    const m = initialDate ? initialDate.m : "08";
    const d = initialDate ? initialDate.d : "25";
    const h = initialTime ? initialTime.h : "12";
    const min = initialTime ? initialTime.min : "00";
    const maxDay = daysInMonth(Number(y), Number(m));

    root.innerHTML =
      '<p class="birth-label">Дата рождения</p>' +
      '<div class="birth-date">' +
        '<label class="birth-cell" for="' + uid + '-day">День' +
          '<select id="' + uid + '-day" data-part="day" autocomplete="bday-day">' + numOptions(1, maxDay, d, false) + "</select></label>" +
        '<label class="birth-cell" for="' + uid + '-month">Месяц' +
          '<select id="' + uid + '-month" data-part="month" autocomplete="bday-month">' +
            MONTHS.map(function (name, i) {
              const val = pad(i + 1);
              return '<option value="' + val + '"' + (val === m ? " selected" : "") + ">" + name + "</option>";
            }).join("") +
          "</select></label>" +
        '<label class="birth-cell" for="' + uid + '-year">Год' +
          '<select id="' + uid + '-year" data-part="year" autocomplete="bday-year">' + yearOptions(y) + "</select></label>" +
      "</div>" +
      '<p class="birth-label">Время</p>' +
      '<div class="birth-time">' +
        '<label class="birth-cell" for="' + uid + '-hour">Час' +
          '<select id="' + uid + '-hour" data-part="hour">' + numOptions(0, 23, h, true) + "</select></label>" +
        '<label class="birth-cell" for="' + uid + '-minute">Минута' +
          '<select id="' + uid + '-minute" data-part="minute">' + numOptions(0, 59, min, true) + "</select></label>" +
      "</div>" +
      '<label class="time-unknown" for="' + uid + '-notime">' +
        '<input id="' + uid + '-notime" data-part="notime" type="checkbox"' + (initialTime ? "" : " checked") + " />" +
        "<span>Не знаю точное время</span>" +
      "</label>" +
      '<input type="hidden" data-part="date" id="' + dateName + '" name="' + dateName + '" required />' +
      '<input type="hidden" data-part="time" id="' + timeName + '" name="' + timeName + '" />';

    root.dataset.ready = "1";
    ["day", "month", "year", "hour", "minute", "notime"].forEach(function (part) {
      qs(root, part).addEventListener("change", function () {
        if (part === "month" || part === "year") rebuildDays(root);
        syncHidden(root);
      });
    });
    fill(root, root.getAttribute("data-date") || "", root.getAttribute("data-time") || "");
  }

  function mountAll() {
    document.querySelectorAll("[data-birth]").forEach(mount);
  }

  window.BirthFields = {
    mountAll: mountAll,
    fill: fill,
    value: function (root) {
      return {
        date: qs(root, "date").value,
        time: qs(root, "time").value
      };
    }
  };

  mountAll();
})();
