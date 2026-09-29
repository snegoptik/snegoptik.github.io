(function (global) {
  const SIGNS = [
    { key: "aries", name: "Овен", abbr: "Ов", element: "огонь", quality: "кардинальный" },
    { key: "taurus", name: "Телец", abbr: "Те", element: "земля", quality: "фиксированный" },
    { key: "gemini", name: "Близнецы", abbr: "Бл", element: "воздух", quality: "мутабельный" },
    { key: "cancer", name: "Рак", abbr: "Ра", element: "вода", quality: "кардинальный" },
    { key: "leo", name: "Лев", abbr: "Лв", element: "огонь", quality: "фиксированный" },
    { key: "virgo", name: "Дева", abbr: "Дв", element: "земля", quality: "мутабельный" },
    { key: "libra", name: "Весы", abbr: "Ве", element: "воздух", quality: "кардинальный" },
    { key: "scorpio", name: "Скорпион", abbr: "Ск", element: "вода", quality: "фиксированный" },
    { key: "sagittarius", name: "Стрелец", abbr: "Ст", element: "огонь", quality: "мутабельный" },
    { key: "capricorn", name: "Козерог", abbr: "Ко", element: "земля", quality: "кардинальный" },
    { key: "aquarius", name: "Водолей", abbr: "Во", element: "воздух", quality: "фиксированный" },
    { key: "pisces", name: "Рыбы", abbr: "Ры", element: "вода", quality: "мутабельный" }
  ];

  const SIGN_GLYPH = {
    aries: '<path d="M-6.4 5.2C-6.4-2.8-3.2-6.8 0 .2C3.2-6.8 6.4-2.8 6.4 5.2"/>',
    taurus: '<circle cx="0" cy="2.4" r="4.1"/><path d="M-6.3-4Q0-8.6 6.3-4"/>',
    gemini: '<path d="M-4.1-6.4V6.4M4.1-6.4V6.4M-5.8-6.4H5.8M-5.8 6.4H5.8"/>',
    cancer: '<path d="M-1.4-2.6a2.7 2.7 0 1 0-2.6 2.6"/><path d="M-1.4-2.6q5.8.4 6.2 4.4"/><path d="M1.4 2.6a2.7 2.7 0 1 0 2.6-2.6"/><path d="M1.4 2.6q-5.8-.4-6.2-4.4"/>',
    leo: '<circle cx="-1.6" cy=".4" r="3.5"/><path d="M1.6.2q4.8-4 4.6 3.6q-1.2 3.6-4.6 2.2"/>',
    virgo: '<path d="M-6.4 6.4V-6.4L-2.1 3.1 2.2-6.4V6.4"/><path d="M2.2.6q5.1 0 5.1 4.3q-1.5 2.7-5.1 1.6"/>',
    libra: '<path d="M-4.7-1.4A4.7 4.7 0 0 1 4.7-1.4"/><path d="M-7 2.5H7M-7 6H7"/>',
    scorpio: '<path d="M-6.4 6.4V-6.4L-2.1 3.1 2.2-6.4V6.4H5.2V2.4L8.2-.8M5.2 2.4L8.1 5"/>',
    sagittarius: '<path d="M-5.4 5.4L5.8-5.8M1.4-5.8H5.8V-1.4M-2 .6L.8-2.2"/>',
    capricorn: '<path d="M-6.5-5.4L-1.6 6.5 2.6-1.1q5.2 0 4.8 5.2q-1.8 3.2-4.8 1.6"/>',
    aquarius: '<path d="M-7-2.2L-3.4 1.4 0-2.2 3.4 1.4 7-2.2M-7 3.4L-3.4 7 0 3.4 3.4 7 7 3.4"/>',
    pisces: '<path d="M-3.1-6.5Q-8.4 0-3.1 6.5M3.1-6.5Q8.4 0 3.1 6.5M-6.4 0H6.4"/>'
  };

  const PLANETS = [
    { key: "Sun", ru: "Солнце", abbr: "Со", body: "Sun" },
    { key: "Moon", ru: "Луна", abbr: "Лу", body: "Moon" },
    { key: "Mercury", ru: "Меркурий", abbr: "Ме", body: "Mercury" },
    { key: "Venus", ru: "Венера", abbr: "Ве", body: "Venus" },
    { key: "Mars", ru: "Марс", abbr: "Ма", body: "Mars" },
    { key: "Jupiter", ru: "Юпитер", abbr: "Юп", body: "Jupiter" },
    { key: "Saturn", ru: "Сатурн", abbr: "Са", body: "Saturn" },
    { key: "Uranus", ru: "Уран", abbr: "Ур", body: "Uranus" },
    { key: "Neptune", ru: "Нептун", abbr: "Не", body: "Neptune" },
    { key: "Pluto", ru: "Плутон", abbr: "Пл", body: "Pluto" }
  ];

  const ASPECTS = [
    { key: "conjunction", ru: "соединение", angle: 0, orb: 8 },
    { key: "sextile", ru: "секстиль", angle: 60, orb: 5 },
    { key: "square", ru: "квадрат", angle: 90, orb: 6 },
    { key: "trine", ru: "тригон", angle: 120, orb: 7 },
    { key: "opposition", ru: "оппозиция", angle: 180, orb: 8 }
  ];

  function norm(lon) {
    return ((lon % 360) + 360) % 360;
  }

  function lonToSign(lon) {
    const n = norm(lon);
    const i = Math.floor(n / 30);
    return Object.assign({ degree: n % 30, lon: n, index: i }, SIGNS[i]);
  }

  function formatDeg(d) {
    const deg = Math.floor(d);
    let min = Math.round((d - deg) * 60);
    if (min === 60) return (deg + 1) + "°00′";
    return deg + "°" + String(min).padStart(2, "0") + "′";
  }

  function civilToUtc(dateStr, timeStr, tzHours, unknownTime) {
    const parts = dateStr.split("-").map(Number);
    const y = parts[0], m = parts[1], d = parts[2];
    let hh = 12, mm = 0;
    if (!unknownTime && timeStr) {
      const t = timeStr.split(":").map(Number);
      hh = t[0]; mm = t[1] || 0;
    }
    return new Date(Date.UTC(y, m - 1, d, hh, mm) - tzHours * 3600000);
  }

  function geoLon(body, date) {
    if (body === "Sun") return Astronomy.SunPosition(date).elon;
    if (body === "Moon") return Astronomy.EclipticGeoMoon(date).lon;
    const vec = Astronomy.GeoVector(body, date, true);
    return Astronomy.Ecliptic(vec).elon;
  }

  function wrappedDelta(a, b) {
    let d = b - a;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  function isRetrograde(body, date) {
    if (body === "Sun" || body === "Moon") return false;
    const later = new Date(date.getTime() + 86400000);
    return wrappedDelta(geoLon(body, date), geoLon(body, later)) < 0;
  }

  function meanObliquity(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525;
    return 23.43929111 - 0.01300416667 * T - 1.638888e-7 * T * T;
  }

  function ramcDeg(date, lonDeg) {
    const gast = Astronomy.SiderealTime(date);
    let lst = gast + lonDeg / 15;
    lst = ((lst % 24) + 24) % 24;
    return lst * 15;
  }

  function ascendant(date, latDeg, lonDeg) {
    const ramc = ramcDeg(date, lonDeg) * Math.PI / 180;
    const eps = meanObliquity(date) * Math.PI / 180;
    const lat = latDeg * Math.PI / 180;
    const y = Math.cos(ramc);
    const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps));
    return norm(Math.atan2(y, x) * 180 / Math.PI);
  }

  function midheaven(date, lonDeg) {
    const ramc = ramcDeg(date, lonDeg) * Math.PI / 180;
    const eps = meanObliquity(date) * Math.PI / 180;
    return norm(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * 180 / Math.PI);
  }

  function angleDelta(a, b) {
    return Math.abs(((a - b + 540) % 360) - 180);
  }

  function wholeSignHouse(planetIndex, ascIndex) {
    return ((planetIndex - ascIndex + 12) % 12) + 1;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function minutesLabel(mins) {
    if (mins >= 24 * 60) return "24:00";
    return pad2(Math.floor(mins / 60)) + ":" + pad2(mins % 60);
  }

  const TIME_PERIODS = {};
  for (let hour = 0; hour < 24; hour++) {
    const id = pad2(hour);
    const next = hour === 23 ? "24:00" : pad2(hour + 1) + ":00";
    TIME_PERIODS[id] = {
      id: id,
      from: hour * 60,
      to: (hour + 1) * 60,
      mid: id + ":30",
      label: id + ":00–" + next
    };
  }

  function ascendantWindows(dateStr, city, periodId) {
    const tzHours = typeof tzAt === "function" ? tzAt(city, dateStr) : city.tz;
    const step = 10;
    const points = [];
    for (let mins = 0; mins <= 24 * 60; mins += step) {
      let when;
      if (mins >= 24 * 60) {
        const start = civilToUtc(dateStr, "00:00", tzHours, false);
        when = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      } else {
        when = civilToUtc(dateStr, minutesLabel(mins), tzHours, false);
      }
      points.push({ mins: mins, sign: lonToSign(ascendant(when, city.lat, city.lon)).index });
    }
    let ranges = [];
    let start = 0;
    let sign = points[0].sign;
    for (let i = 1; i < points.length; i++) {
      if (points[i].sign !== sign) {
        ranges.push({ from: start, to: points[i].mins, sign: sign });
        start = points[i].mins;
        sign = points[i].sign;
      }
    }
    ranges.push({ from: start, to: 24 * 60, sign: sign });
    const period = TIME_PERIODS[periodId];
    if (period) {
      ranges = ranges.map(function (r) {
        return { from: Math.max(r.from, period.from), to: Math.min(r.to, period.to), sign: r.sign };
      });
    }
    return ranges.filter(function (r) { return r.to > r.from; }).map(function (r) {
      return {
        from: minutesLabel(r.from),
        to: minutesLabel(r.to),
        sign: SIGNS[r.sign]
      };
    });
  }

  function chartSketch(chart) {
    const planets = {};
    chart.positions.forEach(function (p) { planets[p.key] = p.sign.key; });
    return {
      sun: chart.sun.sign.key,
      moon: chart.moon.sign.key,
      asc: chart.asc ? chart.asc.key : "",
      planets: planets
    };
  }

  function downloadShareCard(chart, when) {
    const canvas = document.createElement("canvas");
    const w = 900;
    const h = 1200;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#6e3b32";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    ctx.textAlign = "center";
    ctx.fillStyle = "#6e3b32";
    ctx.font = "600 20px Segoe UI, sans-serif";
    ctx.fillText("ЗЕНИТ", w / 2, 120);
    ctx.fillStyle = "#1c1916";
    ctx.font = "600 52px Georgia, Times New Roman, serif";
    ctx.fillText("Не общее небо.", w / 2, 200);

    const cx = w / 2;
    const cy = 520;
    const r = 200;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#c4b6a4";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#1c1916";
    ctx.fill();

    function dot(index, color) {
      const ang = ((index * 30) - 90) * Math.PI / 180;
      const x = cx + Math.cos(ang) * (r - 28);
      const y = cy + Math.sin(ang) * (r - 28);
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    dot(chart.sun.sign.index, "#c4a15a");
    dot(chart.moon.sign.index, "#7f93a3");
    if (chart.asc) dot(chart.asc.index, "#6e3b32");

    const rows = [
      ["Солнце", chart.sun.sign.name],
      ["Луна", chart.moon.sign.name],
      ["Асцендент", chart.asc ? chart.asc.name : "час не указан"]
    ];
    rows.forEach(function (row, i) {
      const x = 180 + i * 270;
      ctx.fillStyle = "#6b625b";
      ctx.font = "600 16px Segoe UI, sans-serif";
      ctx.fillText(row[0].toUpperCase(), x, 820);
      ctx.fillStyle = "#1c1916";
      ctx.font = "600 32px Georgia, Times New Roman, serif";
      ctx.fillText(row[1], x, 868);
    });

    ctx.fillStyle = "#6b625b";
    ctx.font = "22px Segoe UI, sans-serif";
    ctx.fillText(when || "", w / 2, 980);
    ctx.font = "18px Segoe UI, sans-serif";
    ctx.fillText("Натальная карта", w / 2, 1040);

    canvas.toBlob(function (blob) {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "zenit-karta.png";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    }, "image/png");
  }

  function lifePath(dateStr) {
    const digits = dateStr.replace(/\D/g, "").split("").map(Number);
    let n = digits.reduce(function (s, x) { return s + x; }, 0);
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = String(n).split("").reduce(function (s, x) { return s + Number(x); }, 0);
    }
    return n;
  }

  function computeChart(input) {
    const city = input.cityObj;
    const period = !input.time && TIME_PERIODS[input.period] ? TIME_PERIODS[input.period] : null;
    const unknownTime = !input.time;
    const tzHours = typeof tzAt === "function" ? tzAt(city, input.date) : city.tz;
    const date = civilToUtc(input.date, period ? period.mid : input.time, tzHours, unknownTime && !period);
    const positions = PLANETS.map(function (p) {
      const lon = geoLon(p.body, date);
      const sign = lonToSign(lon);
      return {
        key: p.key,
        ru: p.ru,
        abbr: p.abbr,
        lon: sign.lon,
        sign: sign,
        retrograde: isRetrograde(p.body, date)
      };
    });

    const sun = positions[0];
    const moon = positions[1];
    const ascLon = unknownTime ? null : ascendant(date, city.lat, city.lon);
    const mcLon = unknownTime ? null : midheaven(date, city.lon);
    const asc = ascLon == null ? null : lonToSign(ascLon);
    const mc = mcLon == null ? null : lonToSign(mcLon);
    const ascIndex = asc ? asc.index : sun.sign.index;

    positions.forEach(function (p) {
      p.house = wholeSignHouse(p.sign.index, ascIndex);
    });

    const aspects = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const delta = angleDelta(positions[i].lon, positions[j].lon);
        for (let k = 0; k < ASPECTS.length; k++) {
          const asp = ASPECTS[k];
          const orb = Math.abs(delta - asp.angle);
          if (orb <= asp.orb) {
            aspects.push({
              a: positions[i],
              b: positions[j],
              type: asp,
              orb: orb
            });
            break;
          }
        }
      }
    }
    aspects.sort(function (x, y) { return x.orb - y.orb; });

    return {
      input: input,
      city: city,
      date: date,
      tzHours: tzHours,
      tzNote: city.zone === "msk" && input.date < "2014-10-26"
        ? "Для московского пояса взят час на дату рождения, а не «как сейчас»."
        : (input.date < "2014-10-26"
          ? "Для этого города учтён текущий часовой пояс. На датах до 2014 года асцендент может отличаться примерно на час."
          : null),
      unknownTime: unknownTime,
      period: period,
      positions: positions,
      sun: sun,
      moon: moon,
      asc: asc,
      mc: mc,
      aspects: aspects,
      lifePath: lifePath(input.date),
      houseSystem: "whole-sign"
    };
  }

  function drawWheel(svg, chart) {
    const cx = 170, cy = 170, rRim = 158, rOuter = 151, rInner = 116, rOrbit = 84, rGlyph = 9.2;
    const ascLon = chart.asc ? chart.asc.lon : chart.sun.lon;
    const elementFill = {
      "огонь": "#f4d9cc",
      "земля": "#e2eadf",
      "воздух": "#f1e8d6",
      "вода": "#dce6ed"
    };
    const planetFill = {
      Sun: "#c4a35a", Moon: "#7d8e9c", Mercury: "#5f8464", Venus: "#b56b5a",
      Mars: "#9a4336", Jupiter: "#6e3b32", Saturn: "#4a5348",
      Uranus: "#3d6b66", Neptune: "#4a6578", Pluto: "#5a3f3c"
    };
    const aspectStroke = {
      conjunction: null,
      sextile: { color: "#3d5c56", width: 0.9, opacity: 0.38, dash: "3 2.5" },
      trine: { color: "#2f4f4a", width: 1.15, opacity: 0.42, dash: "" },
      square: { color: "#9a4336", width: 1.05, opacity: 0.4, dash: "" },
      opposition: { color: "#9a4336", width: 1.2, opacity: 0.48, dash: "5 3" }
    };
    const sans = "Manrope, Segoe UI, sans-serif";
    const serif = "Cormorant Garamond, Palatino, Times New Roman, serif";

    function xy(lon, r) {
      const deg = 180 - (lon - ascLon);
      const rad = deg * Math.PI / 180;
      return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
    }
    function pair(p) {
      return p.x.toFixed(2) + " " + p.y.toFixed(2);
    }
    function sector(lon0, lon1, r0, r1) {
      const a = xy(lon0, r1);
      const b = xy(lon1, r1);
      const c = xy(lon1, r0);
      const d = xy(lon0, r0);
      return "M" + pair(a) + " A" + r1 + " " + r1 + " 0 0 1 " + pair(b) +
        " L" + pair(c) + " A" + r0 + " " + r0 + " 0 0 0 " + pair(d) + " Z";
    }
    function line(p1, p2, stroke, width, opacity, dash) {
      return '<line x1="' + p1.x.toFixed(2) + '" y1="' + p1.y.toFixed(2) +
        '" x2="' + p2.x.toFixed(2) + '" y2="' + p2.y.toFixed(2) +
        '" stroke="' + stroke + '" stroke-width="' + width + '" opacity="' + opacity + '"' +
        (dash ? ' stroke-dasharray="' + dash + '"' : "") + ' stroke-linecap="round"/>';
    }

    let html = '<circle cx="' + cx + '" cy="' + cy + '" r="' + rRim + '" fill="none" stroke="#c4a35a" stroke-width="1.1" opacity="0.5"/>';
    for (let i = 0; i < 12; i++) {
      html += '<path d="' + sector(i * 30, i * 30 + 30, rInner, rOuter) + '" fill="' + elementFill[SIGNS[i].element] + '"/>';
    }
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuter + '" fill="none" stroke="#b08948" stroke-width="1.25" opacity="0.75"/>';
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInner + '" fill="#fbf7f0" stroke="#d4c6b4" stroke-width="1"/>';

    html += '<g pointer-events="none">';
    for (let i = 0; i < 36; i++) {
      const lon = i * 10;
      const major = i % 3 === 0;
      html += line(
        xy(lon, major ? rInner + 1 : rOuter - 6),
        xy(lon, rOuter - 1),
        major ? "#b08948" : "#8a7a68",
        major ? 0.95 : 0.55,
        major ? 0.5 : 0.28
      );
    }
    html += "</g>";

    if (chart.mc) {
      html += line(xy(chart.mc.lon, rInner - 1), xy(chart.mc.lon, rOuter + 5), "#4a6578", 1.25, 0.6);
      const mcLab = xy(chart.mc.lon, rRim + 10);
      html += '<text x="' + mcLab.x.toFixed(2) + '" y="' + (mcLab.y + 3).toFixed(2) +
        '" text-anchor="middle" font-size="8" letter-spacing="0.1em" fill="#4a6578" font-family="' + sans + '">MC</text>';
    }

    html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOrbit + '" fill="none" stroke="#e2d6c6" stroke-width="0.7" stroke-dasharray="1.6 2.4"/>';
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="13" fill="none" stroke="#e6d3b4" stroke-width="0.75"/>';
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="2.4" fill="#b08948"/>';

    const levels = [];
    const pts = {};
    chart.positions.forEach(function (p, i) {
      let level = 0;
      for (let j = 0; j < i; j++) {
        if (angleDelta(p.lon, chart.positions[j].lon) < 16) {
          level = Math.max(level, levels[j] + 1);
        }
      }
      levels[i] = level;
      pts[p.key] = xy(p.lon, rOrbit - level * 19);
    });

    (chart.aspects || []).slice(0, 8).forEach(function (a) {
      const style = a.type && aspectStroke[a.type.key];
      if (!style) return;
      const p1 = pts[a.a && a.a.key];
      const p2 = pts[a.b && a.b.key];
      if (!p1 || !p2) return;
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const cut = rGlyph + 1.5;
      html += line(
        { x: p1.x + dx / len * cut, y: p1.y + dy / len * cut },
        { x: p2.x - dx / len * cut, y: p2.y - dy / len * cut },
        style.color, style.width, style.opacity, style.dash
      );
    });

    if (chart.asc) {
      html += line(xy(ascLon, rInner - 1), xy(ascLon, rOuter + 5), "#9a4336", 1.4, 0.9);
      const tip = xy(ascLon, rOuter - 1);
      const a = xy(ascLon - 2.4, rOuter + 8);
      const b = xy(ascLon + 2.4, rOuter + 8);
      html += '<polygon points="' + pair(tip) + " " + pair(a) + " " + pair(b) + '" fill="#9a4336"/>';
      html += '<text x="' + (cx - rRim - 2) + '" y="' + (cy + 3) +
        '" text-anchor="end" font-size="8" letter-spacing="0.12em" fill="#9a4336" font-family="' + sans + '">ASC</text>';
    }

    chart.positions.forEach(function (p) {
      const pt = pts[p.key];
      const fill = planetFill[p.key] || "#1c1916";
      if (p.retrograde) {
        html += '<circle cx="' + pt.x.toFixed(2) + '" cy="' + pt.y.toFixed(2) + '" r="' + (rGlyph + 2.8) +
          '" fill="none" stroke="#b08948" stroke-width="0.85" stroke-dasharray="1.5 1.7"/>';
      }
      html += '<circle cx="' + pt.x.toFixed(2) + '" cy="' + pt.y.toFixed(2) + '" r="' + rGlyph +
        '" fill="' + fill + '" stroke="#fbf7f0" stroke-width="1.5"/>';
      html += '<text x="' + pt.x.toFixed(2) + '" y="' + (pt.y + 3).toFixed(2) +
        '" text-anchor="middle" font-size="8" font-weight="600" fill="#fbf7f0" font-family="' + sans + '">' +
        p.abbr + "</text>";
    });

    for (let i = 0; i < 12; i++) {
      const sign = SIGNS[i];
      const mid = xy(i * 30 + 15, (rOuter + rInner) / 2);
      html += '<g class="wheel-sign" data-sign="' + sign.key + '" tabindex="0" role="button" aria-label="' + sign.name + '" aria-expanded="false">';
      html += '<path class="wheel-sign-hit" d="' + sector(i * 30, i * 30 + 30, rInner, rOuter) + '" fill="transparent"/>';
      html += '<g class="wheel-glyph" transform="translate(' + mid.x.toFixed(2) + " " + mid.y.toFixed(2) +
        ') scale(1.12)" fill="none" stroke="#3a342e" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">' +
        (SIGN_GLYPH[sign.key] || "") + "</g>";
      html += "</g>";
    }

    svg.setAttribute("viewBox", "-14 -14 368 368");
    svg.innerHTML = html;
    bindWheelSigns(svg);
  }

  function bindWheelSigns(svg) {
    const wrap = svg.closest(".wheel-wrap") || svg.parentNode;
    let pop = wrap.querySelector(".wheel-tip");
    if (!pop) {
      pop = document.createElement("div");
      pop.className = "wheel-tip";
      pop.hidden = true;
      pop.setAttribute("role", "tooltip");
      wrap.appendChild(pop);
    }

    let openKey = null;
    let pinned = false;

    function closePop() {
      openKey = null;
      pinned = false;
      pop.hidden = true;
      svg.querySelectorAll(".wheel-sign.is-on").forEach(function (g) {
        g.classList.remove("is-on");
        g.setAttribute("aria-expanded", "false");
      });
    }

    function placePop(g) {
      const wr = wrap.getBoundingClientRect();
      const r = g.querySelector(".wheel-glyph").getBoundingClientRect();
      pop.hidden = false;
      const tw = pop.offsetWidth;
      const th = pop.offsetHeight;
      let left = r.left + r.width / 2 - wr.left - tw / 2;
      let top = r.top - wr.top - th - 10;
      if (top < 4) top = r.bottom - wr.top + 10;
      left = Math.max(6, Math.min(left, wr.width - tw - 6));
      pop.style.left = left + "px";
      pop.style.top = top + "px";
    }

    function showPop(g, pin) {
      const key = g.getAttribute("data-sign");
      const sign = SIGNS.filter(function (s) { return s.key === key; })[0];
      if (!sign) return;
      pop.innerHTML = "<b>" + sign.name + "</b><span class=\"wheel-tip-meta\">" + sign.element + "</span>";
      svg.querySelectorAll(".wheel-sign.is-on").forEach(function (el) {
        el.classList.remove("is-on");
        el.setAttribute("aria-expanded", "false");
      });
      g.classList.add("is-on");
      g.setAttribute("aria-expanded", "true");
      openKey = key;
      pinned = !!pin;
      placePop(g);
    }

    wrap._zenitCloseTip = closePop;

    function isMouse(e) {
      return e.pointerType === "mouse";
    }

    svg.querySelectorAll(".wheel-sign").forEach(function (g) {
      g.addEventListener("pointerenter", function (e) {
        if (isMouse(e) && !pinned) showPop(g, false);
      });
      g.addEventListener("pointerleave", function (e) {
        if (isMouse(e) && !pinned) closePop();
      });
      g.addEventListener("click", function (e) {
        e.stopPropagation();
        if (pinned && openKey === g.getAttribute("data-sign")) closePop();
        else showPop(g, true);
      });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (pinned && openKey === g.getAttribute("data-sign")) closePop();
          else showPop(g, true);
        }
      });
    });

    svg.addEventListener("click", function (e) {
      if (!e.target.closest(".wheel-sign")) closePop();
    });

    if (!wrap._zenitTipBound) {
      wrap._zenitTipBound = true;
      document.addEventListener("click", function (e) {
        if (wrap._zenitCloseTip && !wrap.contains(e.target)) wrap._zenitCloseTip();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && wrap._zenitCloseTip) wrap._zenitCloseTip();
      });
    }
  }

  function natalTransits(natal, now) {
    const when = now || new Date();
    const transits = PLANETS.map(function (p) {
      const lon = geoLon(p.body, when);
      return {
        key: p.key,
        ru: p.ru,
        lon: lon,
        sign: lonToSign(lon),
        retrograde: isRetrograde(p.body, when)
      };
    });
    const natalPts = natal.positions.filter(function (p) {
      return p.key === "Sun" || p.key === "Moon" || p.key === "Mercury" || p.key === "Venus" || p.key === "Mars" || p.key === "Saturn";
    }).map(function (p) {
      return { key: p.key, ru: p.ru, lon: p.lon };
    });
    if (natal.asc) natalPts.push({ key: "Asc", ru: "асцендент", lon: natal.asc.lon });

    const hits = [];
    transits.forEach(function (t) {
      natalPts.forEach(function (n) {
        const delta = angleDelta(t.lon, n.lon);
        ASPECTS.forEach(function (asp) {
          const orb = Math.abs(delta - asp.angle);
          const maxOrb = t.key === "Moon" ? 1.5 : 1.4;
          if (orb <= maxOrb) {
            hits.push({ transit: t, natal: n, type: asp, orb: orb });
          }
        });
      });
    });
    hits.sort(function (a, b) { return a.orb - b.orb; });
    return { transits: transits, hits: hits, moon: transits[1] };
  }

  global.ZENIT_SIGNS = SIGNS;
  global.ZENIT_PLANETS = PLANETS;
  global.computeChart = computeChart;
  global.drawWheel = drawWheel;
  global.lonToSign = lonToSign;
  global.formatDeg = formatDeg;
  global.lifePathNumber = lifePath;
  global.natalTransits = natalTransits;
  global.TIME_PERIODS = TIME_PERIODS;
  global.ascendantWindows = ascendantWindows;
  global.chartSketch = chartSketch;
  global.downloadShareCard = downloadShareCard;
})(window);
