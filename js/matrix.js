(function () {
  const ROLES = {
    center: "Вся дата целиком",
    a: "Как вас встречают",
    b: "Чем легко светить",
    c: "Где строится опора",
    d: "К чему сводится дата",
    e: "Характер и талант",
    f: "Талант и опора",
    g: "Опора и задача",
    h: "Характер и задача"
  };

  const LINES = {
    1: "Умение собрать дело из того, что уже есть.",
    2: "Пауза и своё знание раньше чужого совета.",
    3: "Рост, тело, забота. Опора, которую можно вырастить.",
    4: "Рамка, срок, взрослый порядок.",
    5: "Путь через договор, учителя, понятное правило.",
    6: "Выбор, в котором участвует сердце.",
    7: "Своё направление и вожжи в своих руках.",
    8: "Мягкая устойчивость, без войны с собой.",
    9: "Свой свет и право на тишину.",
    10: "Поворот, который не держит вчерашний расклад.",
    11: "Честный счёт: слова, долги, решения.",
    12: "Другой ракурс, когда прямой нажим не двигает.",
    13: "Конец формы, после которого есть место.",
    14: "Мера, ритм, середина между крайностями.",
    15: "Привязка, которую полезно назвать вслух.",
    16: "Правда, которую уже поздно красить.",
    17: "Тихая надежда и один бережный шаг.",
    18: "Неясность. Не всё ночное существует днём.",
    19: "Ясность и тепло без обязательной драмы.",
    20: "То, что давно ждало решения.",
    21: "Закрытый круг и право выдохнуть.",
    22: "Начало без полной карты, если понятно, что оставляете."
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toArcana(n) {
    let v = Math.abs(Number(n) || 0);
    while (v > 22) {
      v = String(v).split("").reduce(function (s, d) { return s + Number(d); }, 0);
    }
    return v;
  }

  function card(n) {
    const deck = window.ZENIT_TAROT || [];
    if (n === 22) return deck[0] || { n: 0, name: "Шут" };
    return deck[n] || { n: n, name: String(n) };
  }

  function point(key, n) {
    const arc = card(n);
    return {
      key: key,
      n: n,
      name: arc.name,
      role: ROLES[key],
      text: LINES[n] || ""
    };
  }

  function parseBirth(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const parts = iso.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    if (y < 1920 || m < 1 || m > 12 || d < 1) return null;
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
    const now = new Date();
    const today = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    if (iso > today) return null;
    return { y: y, m: m, d: d, iso: iso };
  }

  function compute(iso) {
    const birth = parseBirth(iso);
    if (!birth) return null;
    const a = toArcana(birth.d);
    const b = toArcana(birth.m);
    const c = toArcana(String(birth.y).split("").reduce(function (s, d) { return s + Number(d); }, 0));
    const d = toArcana(a + b + c);
    const e = toArcana(a + b);
    const f = toArcana(b + c);
    const g = toArcana(c + d);
    const h = toArcana(a + d);
    const center = toArcana(a + b + c + d);
    return {
      iso: birth.iso,
      pretty: pad(birth.d) + "." + pad(birth.m) + "." + birth.y,
      center: point("center", center),
      points: [
        point("a", a),
        point("b", b),
        point("c", c),
        point("d", d),
        point("e", e),
        point("f", f),
        point("g", g),
        point("h", h)
      ]
    };
  }

  function node(x, y, n, label, centerNode, labelY) {
    const cls = centerNode ? " matrix-node matrix-center" : " matrix-node";
    const tagY = labelY == null ? y + 34 : labelY;
    return '<g class="' + cls.trim() + '">' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (centerNode ? 28 : 20) + '"></circle>' +
      '<text x="' + x + '" y="' + (y + 5) + '">' + n + "</text>" +
      (label ? '<text class="matrix-tag" x="' + x + '" y="' + tagY + '">' + label + "</text>" : "") +
      "</g>";
  }

  function render(matrix, root) {
    if (!root) return;
    if (!matrix) {
      root.innerHTML = "";
      root.hidden = true;
      return;
    }
    const by = {};
    matrix.points.forEach(function (p) { by[p.key] = p; });
    const svg = '<svg class="matrix-fig" viewBox="0 0 320 340" role="img" aria-label="Матрица по дате ' + matrix.pretty + '">' +
      "<line x1=\"48\" y1=\"160\" x2=\"160\" y2=\"48\"></line>" +
      "<line x1=\"160\" y1=\"48\" x2=\"272\" y2=\"160\"></line>" +
      "<line x1=\"272\" y1=\"160\" x2=\"160\" y2=\"272\"></line>" +
      "<line x1=\"160\" y1=\"272\" x2=\"48\" y2=\"160\"></line>" +
      "<line x1=\"78\" y1=\"78\" x2=\"242\" y2=\"78\"></line>" +
      "<line x1=\"242\" y1=\"78\" x2=\"242\" y2=\"242\"></line>" +
      "<line x1=\"242\" y1=\"242\" x2=\"78\" y2=\"242\"></line>" +
      "<line x1=\"78\" y1=\"242\" x2=\"78\" y2=\"78\"></line>" +
      "<line x1=\"48\" y1=\"160\" x2=\"272\" y2=\"160\"></line>" +
      "<line x1=\"160\" y1=\"48\" x2=\"160\" y2=\"272\"></line>" +
      node(160, 160, matrix.center.n, "", true) +
      node(48, 160, by.a.n, "день") +
      node(160, 48, by.b.n, "месяц", false, 22) +
      node(272, 160, by.c.n, "год") +
      node(160, 272, by.d.n, "задача") +
      node(78, 78, by.e.n, "") +
      node(242, 78, by.f.n, "") +
      node(242, 242, by.g.n, "") +
      node(78, 242, by.h.n, "") +
      "</svg>";
    const rows = [matrix.center].concat(matrix.points).map(function (p) {
      return '<div class="planet-row"><strong>' + p.role + " · " + p.n + " · " + p.name +
        "</strong><span class=\"meta\">" + p.text + "</span></div>";
    }).join("");
    root.hidden = false;
    root.innerHTML =
      '<p class="kicker">Подарок к заявке</p>' +
      "<h2>Матрица " + matrix.pretty + "</h2>" +
      "<p>Центр — " + matrix.center.n + ", " + matrix.center.name + ". " + matrix.center.text + " Через этот аркан дата звучит целиком.</p>" +
      svg +
      rows +
      '<p class="small">Числа больше 22 складываем по цифрам. 22 — Шут. Это схема по дате, живой расклад по вопросу делает человек.</p>';
  }

  window.ZenitMatrix = {
    parseBirth: parseBirth,
    compute: compute,
    render: render,
    toArcana: toArcana
  };
})();
