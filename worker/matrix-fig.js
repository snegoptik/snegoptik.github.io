const ARCANA = [
  "", "Маг", "Верховная Жрица", "Императрица", "Император", "Иерофант", "Влюблённые",
  "Колесница", "Сила", "Отшельник", "Колесо Фортуны", "Справедливость", "Повешенный",
  "Смерть", "Умеренность", "Дьявол", "Башня", "Звезда", "Луна", "Солнце", "Суд", "Мир", "Шут"
];

const SENSE = {
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

const CX = 200;
const CY = 220;
const OUTER = 126;
const EDGE = 90;
const MID = 56;

function toArcana(n) {
  let v = Math.abs(Number(n) || 0);
  while (v > 22) {
    v = String(v).split("").reduce(function (s, d) { return s + Number(d); }, 0);
  }
  return v;
}

function polar(deg, radius, cx, cy) {
  const rad = deg * Math.PI / 180;
  const x = (cx == null ? CX : cx) + radius * Math.cos(rad);
  const y = (cy == null ? CY : cy) - radius * Math.sin(rad);
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10
  };
}

function ray(outer, hub) {
  const mid = toArcana(outer + hub);
  return { mid: mid, edge: toArcana(outer + mid) };
}

export function matrixChart(birth) {
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
    ages.push(cur);
    ages.push({ age: cur.age + 5, n: toArcana(cur.n + next.n) });
  }
  const earth = toArcana(a + c);
  const sky = toArcana(b + d);
  const own = toArcana(earth + sky);
  const father = toArcana(e + g);
  const mother = toArcana(f + h);
  const x = toArcana(inner.c.mid + inner.d.mid);
  const model = {
    a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, center: center,
    inner: inner,
    ages: ages,
    earth: earth, sky: sky, own: own, father: father, mother: mother,
    love: toArcana(inner.d.mid + x),
    money: toArcana(inner.c.mid + x)
  };
  function named(role, n) {
    return { role: role, n: n, name: ARCANA[n] || "", text: SENSE[n] || "" };
  }
  const pad = function (v) { return String(v).padStart(2, "0"); };
  const corners = [
    named("Вся дата целиком", center),
    named("Как вас встречают", a),
    named("Чем легко светить", b),
    named("Где строится опора", c),
    named("К чему сводится дата", d),
    named("Характер и талант", e),
    named("Талант и опора", f),
    named("Опора и задача", g),
    named("Характер и задача", h)
  ];
  const lines = [
    named("Земля, день и год", earth),
    named("Небо, месяц и задача", sky),
    named("Своё, земля и небо", own),
    named("Линия отца", father),
    named("Линия матери", mother)
  ];
  const marks = [
    named("Отношения", model.love),
    named("Дело", model.money)
  ];
  const note = "Числа больше 22 складываем по цифрам. 22 — Шут. На круге шаг пять лет: десяток стоит на углу, середина — на ребре. Меньший круг на луче — сумма края и центра. Линия отца идёт из левого верха в правый низ, линия матери — из правого верха в левый низ. Здоровье по этой схеме не считаем. Живой расклад по вопросу делает человек.";
  function rowText(item) {
    return item.role + " — " + item.n + ", " + item.name + ". " + item.text;
  }
  const textLines = ["Центр — " + center + ", " + (ARCANA[center] || "") + ". " + (SENSE[center] || "") + " Через этот аркан дата звучит целиком."];
  corners.forEach(function (item) { textLines.push(rowText(item)); });
  textLines.push("По кругу лет");
  ages.forEach(function (item) {
    textLines.push(item.age + " — " + item.n + ", " + (ARCANA[item.n] || ""));
  });
  textLines.push("Линии");
  lines.forEach(function (item) { textLines.push(rowText(item)); });
  textLines.push("Отношения и дело");
  marks.forEach(function (item) { textLines.push(rowText(item)); });
  textLines.push(note);
  return {
    pretty: pad(birth.d) + "." + pad(birth.m) + "." + birth.y,
    line: center + " " + (ARCANA[center] || ""),
    lines: textLines,
    nums: { center: center, a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h },
    model: model,
    sheet: { corners: corners, ages: ages, lines: lines, marks: marks, note: note }
  };
}

function circle(p, r, fill, stroke) {
  return '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.3"/>';
}

function num(p, n, size, fill) {
  return '<text x="' + p.x + '" y="' + p.y + '" dy="0.35em" fill="' + fill + '" font-size="' + size + '">' + n + "</text>";
}

function caption(p, text, fill) {
  return '<text class="matrix-caption" x="' + p.x + '" y="' + p.y + '" fill="' + (fill || "#5a534b") + '" font-size="8" stroke="#fbf7f0" stroke-width="3" paint-order="stroke">' + text + "</text>";
}

export function matrixSvg(chart) {
  const m = chart.model;
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
  const ink = "#1c1916";
  const cream = "#fbf7f0";
  const line = "#d7cec0";
  const father = "#9a4336";
  const mother = "#2f4f4a";
  function chain(keys) {
    return keys.map(function (key) { return at[key].x + "," + at[key].y; }).join(" ");
  }
  let body = "";
  body += '<polygon points="' + chain(["a", "e", "b", "f", "c", "g", "d", "h"]) + '" fill="none" stroke="' + line + '" stroke-width="1.2"/>';
  body += '<polygon points="' + chain(["a", "b", "c", "d"]) + '" fill="none" stroke="' + line + '" stroke-width="1.2"/>';
  body += '<polygon points="' + chain(["e", "f", "g", "h"]) + '" fill="none" stroke="' + line + '" stroke-width="1.2"/>';
  body += '<line x1="' + at.e.x + '" y1="' + at.e.y + '" x2="' + at.g.x + '" y2="' + at.g.y + '" stroke="' + father + '" stroke-width="1.6"/>';
  body += '<line x1="' + at.f.x + '" y1="' + at.f.y + '" x2="' + at.h.x + '" y2="' + at.h.y + '" stroke="' + mother + '" stroke-width="1.6"/>';

  const nodes = [];
  corners.forEach(function (item) {
    const stroke = item.lineage ? mother : father;
    const edge = polar(item.deg, EDGE);
    const mid = polar(item.deg, MID);
    nodes.push(circle(edge, 10, cream, stroke) + num(edge, m.inner[item.key].edge, 9, ink));
    nodes.push(circle(mid, 10, cream, stroke) + num(mid, m.inner[item.key].mid, 9, ink));
    nodes.push(circle(at[item.key], 13, cream, stroke) + num(at[item.key], m[item.key], 12, ink));
  });

  for (let i = 0; i < 8; i++) {
    const cur = corners[i];
    const next = corners[(i + 1) % 8];
    const p1 = at[cur.key];
    const p2 = at[next.key];
    const spot = { x: Math.round((p1.x + p2.x) / 2 * 10) / 10, y: Math.round((p1.y + p2.y) / 2 * 10) / 10 };
    const five = m.ages[i * 2 + 1];
    nodes.push(circle(spot, 8, cream, line) + num(spot, five.n, 8, ink));
  }

  m.ages.forEach(function (item, index) {
    const deg = 180 - index * 22.5;
    const p = polar(deg, OUTER + 28);
    nodes.push('<text class="matrix-age" x="' + p.x + '" y="' + p.y + '" dy="0.35em" fill="#5a534b" font-size="8">' + item.age + "</text>");
  });

  const love = { x: 228, y: 292 };
  const money = { x: 270, y: 242 };
  nodes.push(circle(love, 8, cream, father) + num(love, m.love, 8, ink));
  nodes.push('<path fill="' + father + '" transform="translate(250 308) scale(0.72)" d="M0 3C0 3-6-2-6-6-6-10-1-10 0-6 1-10 6-10 6-6 6-2 0 3 0 3Z"/>');
  nodes.push(circle(money, 8, cream, mother) + num(money, m.money, 8, ink));
  nodes.push(caption({ x: money.x, y: money.y + 22 }, "дело", mother));
  nodes.push(caption(polar(160, 78), "отец", father));
  nodes.push(caption(polar(20, 78), "мать", mother));

  const center = polar(0, 0);
  nodes.push(circle(center, 18, father, father) + num(center, m.center, 14, cream));

  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1017" viewBox="0 0 400 452">' +
    '<rect width="400" height="452" fill="' + cream + '"/>' +
    '<text x="200" y="28" fill="' + ink + '" font-size="13" font-family="PT Sans" text-anchor="middle">' + chart.pretty + "</text>" +
    '<g font-family="PT Sans" text-anchor="middle">' + body + nodes.join("") + "</g></svg>";
}
