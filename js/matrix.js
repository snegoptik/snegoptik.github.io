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
    h: "Характер и задача",
    earth: "Земля, день и год",
    sky: "Небо, месяц и задача",
    own: "Своё, земля и небо",
    father: "Линия отца",
    mother: "Линия матери",
    love: "Отношения",
    money: "Дело"
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

  const CX = 200;
  const CY = 220;
  const OUTER = 126;
  const EDGE = 90;
  const MID = 56;

  function polar(deg, radius) {
    const rad = deg * Math.PI / 180;
    return {
      x: Math.round((CX + radius * Math.cos(rad)) * 10) / 10,
      y: Math.round((CY - radius * Math.sin(rad)) * 10) / 10
    };
  }

  function ray(outer, hub) {
    const mid = toArcana(outer + hub);
    return { mid: mid, edge: toArcana(outer + mid) };
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
    const hub = toArcana(e + f + g + h);
    const inner = {
      a: ray(a, center),
      b: ray(b, center),
      c: ray(c, center),
      d: ray(d, center),
      e: ray(e, hub),
      f: ray(f, hub),
      g: ray(g, hub),
      h: ray(h, hub)
    };
    const decades = [
      { age: 0, n: a },
      { age: 10, n: e },
      { age: 20, n: b },
      { age: 30, n: f },
      { age: 40, n: c },
      { age: 50, n: g },
      { age: 60, n: d },
      { age: 70, n: h }
    ];
    const ages = [];
    for (let i = 0; i < decades.length; i++) {
      const cur = decades[i];
      const next = decades[(i + 1) % decades.length];
      ages.push({ age: cur.age, n: cur.n, name: card(cur.n).name });
      const five = toArcana(cur.n + next.n);
      ages.push({ age: cur.age + 5, n: five, name: card(five).name });
    }
    const earth = toArcana(a + c);
    const sky = toArcana(b + d);
    const own = toArcana(earth + sky);
    const father = toArcana(e + g);
    const mother = toArcana(f + h);
    const x = toArcana(inner.c.mid + inner.d.mid);
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
      ],
      inner: inner,
      ages: ages,
      lines: [
        point("earth", earth),
        point("sky", sky),
        point("own", own),
        point("father", father),
        point("mother", mother)
      ],
      marks: [point("love", toArcana(inner.d.mid + x)), point("money", toArcana(inner.c.mid + x))]
    };
  }

  function dot(p, n, r, cls) {
    return '<g class="' + cls + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '"></circle>' +
      '<text x="' + p.x + '" y="' + p.y + '" dy="0.35em">' + n + "</text></g>";
  }

  function figure(matrix) {
    const m = {};
    matrix.points.forEach(function (p) { m[p.key] = p.n; });
    const corners = [
      { key: "a", deg: 180, lineage: false },
      { key: "e", deg: 135, lineage: true },
      { key: "b", deg: 90, lineage: false },
      { key: "f", deg: 45, lineage: true },
      { key: "c", deg: 0, lineage: false },
      { key: "g", deg: -45, lineage: true },
      { key: "d", deg: -90, lineage: false },
      { key: "h", deg: -135, lineage: true }
    ];
    const at = {};
    corners.forEach(function (item) { at[item.key] = polar(item.deg, OUTER); });
    function chain(keys) {
      return keys.map(function (key) { return at[key].x + "," + at[key].y; }).join(" ");
    }
    let svg = '<svg class="matrix-fig" viewBox="0 0 400 452" role="img" aria-label="Матрица по дате ' + matrix.pretty + '">';
    svg += '<polygon class="matrix-ring" points="' + chain(["a", "e", "b", "f", "c", "g", "d", "h"]) + '"></polygon>';
    svg += '<polygon points="' + chain(["a", "b", "c", "d"]) + '"></polygon>';
    svg += '<polygon points="' + chain(["e", "f", "g", "h"]) + '"></polygon>';
    svg += '<line class="matrix-father" x1="' + at.e.x + '" y1="' + at.e.y + '" x2="' + at.g.x + '" y2="' + at.g.y + '"></line>';
    svg += '<line class="matrix-mother" x1="' + at.f.x + '" y1="' + at.f.y + '" x2="' + at.h.x + '" y2="' + at.h.y + '"></line>';
    corners.forEach(function (item) {
      const cls = item.lineage ? "matrix-mini matrix-lineage" : "matrix-mini";
      svg += dot(polar(item.deg, EDGE), matrix.inner[item.key].edge, 10, cls);
      svg += dot(polar(item.deg, MID), matrix.inner[item.key].mid, 10, cls);
      svg += dot(at[item.key], m[item.key], 13, item.lineage ? "matrix-node matrix-lineage" : "matrix-node");
    });
    for (let i = 0; i < 8; i++) {
      const cur = corners[i];
      const next = corners[(i + 1) % 8];
      const p1 = at[cur.key];
      const p2 = at[next.key];
      const spot = {
        x: Math.round((p1.x + p2.x) / 2 * 10) / 10,
        y: Math.round((p1.y + p2.y) / 2 * 10) / 10
      };
      svg += dot(spot, matrix.ages[i * 2 + 1].n, 8, "matrix-five");
    }
    matrix.ages.forEach(function (item, index) {
      const p = polar(180 - index * 22.5, OUTER + 28);
      svg += '<text class="matrix-age" x="' + p.x + '" y="' + p.y + '" dy="0.35em">' + item.age + "</text>";
    });
    svg += dot({ x: 228, y: 292 }, matrix.marks[0].n, 8, "matrix-mark");
    svg += '<path class="matrix-heart" transform="translate(250 308) scale(0.72)" d="M0 3C0 3-6-2-6-6-6-10-1-10 0-6 1-10 6-10 6-6 6-2 0 3 0 3Z"></path>';
    svg += dot({ x: 270, y: 242 }, matrix.marks[1].n, 8, "matrix-mark matrix-lineage");
    svg += '<text class="matrix-caption matrix-mother-label" x="270" y="264">дело</text>';
    svg += '<text class="matrix-caption matrix-father-label" x="' + polar(160, 78).x + '" y="' + polar(160, 78).y + '">отец</text>';
    svg += '<text class="matrix-caption matrix-mother-label" x="' + polar(20, 78).x + '" y="' + polar(20, 78).y + '">мать</text>';
    svg += dot(polar(0, 0), matrix.center.n, 18, "matrix-node matrix-center");
    return svg + "</svg>";
  }

  function rows(list) {
    return list.map(function (p) {
      return '<div class="planet-row"><strong>' + p.role + " · " + p.n + " · " + p.name +
        "</strong><span class=\"meta\">" + p.text + "</span></div>";
    }).join("");
  }

  function render(matrix, root) {
    if (!root) return;
    if (!matrix) {
      root.innerHTML = "";
      root.hidden = true;
      return;
    }
    const ages = '<div class="matrix-ages">' + matrix.ages.map(function (item) {
      return "<span><b>" + item.age + "</b> " + item.n + " " + item.name + "</span>";
    }).join("") + "</div>";
    root.hidden = false;
    root.innerHTML =
      '<p class="kicker">Подарок к заявке</p>' +
      "<h2>Матрица " + matrix.pretty + "</h2>" +
      "<p>Центр — " + matrix.center.n + ", " + matrix.center.name + ". " + matrix.center.text + " Через этот аркан дата звучит целиком.</p>" +
      figure(matrix) +
      rows([matrix.center].concat(matrix.points)) +
      '<p class="kicker matrix-sub">По кругу лет</p>' +
      ages +
      '<p class="kicker matrix-sub">Линии</p>' +
      rows(matrix.lines) +
      '<p class="kicker matrix-sub">Отношения и дело</p>' +
      rows(matrix.marks) +
      '<p class="small">Числа больше 22 складываем по цифрам. 22 — Шут. На круге шаг пять лет: десяток стоит на углу, середина — на ребре. Меньший круг на луче — сумма края и центра. Линия отца идёт из левого верха в правый низ, линия матери — из правого верха в левый низ. Здоровье по этой схеме не считаем. Живой расклад по вопросу делает человек.</p>';
  }

  window.ZenitMatrix = {
    parseBirth: parseBirth,
    compute: compute,
    render: render,
    toArcana: toArcana
  };
})();
