(function () {
  const SIGNS = [
    { key: "aries", name: "Овен" },
    { key: "taurus", name: "Телец" },
    { key: "gemini", name: "Близнецы" },
    { key: "cancer", name: "Рак" },
    { key: "leo", name: "Лев" },
    { key: "virgo", name: "Дева" },
    { key: "libra", name: "Весы" },
    { key: "scorpio", name: "Скорпион" },
    { key: "sagittarius", name: "Стрелец" },
    { key: "capricorn", name: "Козерог" },
    { key: "aquarius", name: "Водолей" },
    { key: "pisces", name: "Рыбы" }
  ];

  function signName(key) {
    const row = SIGNS.filter(function (s) { return s.key === key; })[0];
    return row ? row.name : "";
  }

  function houseName(ascKey, house) {
    const i = SIGNS.findIndex(function (s) { return s.key === ascKey; });
    if (i < 0) return "";
    return SIGNS[(i + house - 1) % 12].name;
  }

  const PLANET_RU = {
    Sun: "Солнце", Moon: "Луна", Mercury: "Меркурий", Venus: "Венера",
    Mars: "Марс", Jupiter: "Юпитер", Saturn: "Сатурн", Uranus: "Уран",
    Neptune: "Нептун", Pluto: "Плутон"
  };
  const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

  function place(html, parent) {
    const main = document.querySelector("main");
    if (!main) return;
    const old = document.getElementById("dict-mine");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = "card";
    el.id = "dict-mine";
    el.innerHTML = html;
    if (parent) {
      parent.insertBefore(el, parent.firstChild);
      return;
    }
    const cta = main.querySelector(".dict-cta");
    if (cta) main.insertBefore(el, cta);
    else main.appendChild(el);
  }

  function planetsInHouse(sketch, house, baseKey) {
    const baseI = SIGNS.findIndex(function (s) { return s.key === baseKey; });
    if (baseI < 0 || !sketch.planets) return [];
    return PLANET_ORDER.filter(function (key) {
      const sign = sketch.planets[key];
      const pi = SIGNS.findIndex(function (s) { return s.key === sign; });
      if (pi < 0) return false;
      return ((pi - baseI + 12) % 12) + 1 === house;
    }).map(function (key) { return PLANET_RU[key]; });
  }

  const saved = window.Zenit && Zenit.loadNatal ? Zenit.loadNatal() : null;
  const sketch = saved && saved.sketch;
  if (!sketch || !sketch.sun) return;

  const sun = signName(sketch.sun);
  const moon = signName(sketch.moon);
  const asc = sketch.asc ? signName(sketch.asc) : "";
  const mercury = signName(sketch.planets && sketch.planets.Mercury);
  const file = location.pathname.split("/").pop();
  let html = "";

  if (file === "luna-v-rake.html") {
    html = sketch.moon === "cancer"
      ? "<p style=\"margin:0\">В сохранённой карте Луна тоже в Раке. Солнце при этом в знаке «" + sun + "» — это уже другой слой.</p>"
      : "<p style=\"margin:0\">В сохранённой карте Луна в знаке «" + moon + "». Эта страница про Рак. <a href=\"../natal.html\">Открыть карту</a></p>";
  } else if (file === "ascendent.html") {
    html = asc
      ? "<p style=\"margin:0\">В сохранённой карте асцендент — " + asc + ".</p>"
      : "<p style=\"margin:0\">В сохранённой карте час не указан, поэтому асцендент не назван.</p>";
  } else if (file === "solnce-luna-ascendent.html" || file === "natalnaya-karta.html") {
    html = "<p style=\"margin:0\">В сохранённой карте: Солнце в знаке «" + sun + "», Луна в знаке «" + moon + "», асцендент — " + (asc || "не назван, час не указан") + ".</p>";
  } else if (file === "7-dom.html") {
    html = asc
      ? "<p style=\"margin:0\">В сохранённой карте седьмой дом — знак «" + houseName(sketch.asc, 7) + "». Это поле другого человека. Брак отсюда не выводится.</p>"
      : "<p style=\"margin:0\">Без часа седьмой дом не назначается: он считается от асцендента.</p>";
  } else if (file === "bez-vremeni.html") {
    html = asc
      ? "<p style=\"margin:0\">В сохранённой карте час указан. Асцендент — " + asc + ".</p>"
      : "<p style=\"margin:0\">В сохранённой карте час не указан. Солнце — " + sun + ", Луна — " + moon + ".</p>";
  } else if (file === "merkurij.html" || file === "rtogradnyj-merkurij.html") {
    html = mercury
      ? "<p style=\"margin:0\">В сохранённой карте Меркурий в знаке «" + mercury + "».</p>"
      : "";
  } else if (file === "doma.html") {
    function showHouse() {
      const match = /^#dom-(\d+)$/.exec(location.hash || "");
      const house = match ? Number(match[1]) : 0;
      const baseKey = sketch.asc || sketch.sun;
      let note = "";
      let parent = null;
      if (house >= 1 && house <= 12 && baseKey) {
        const sign = houseName(baseKey, house);
        const who = planetsInHouse(sketch, house, baseKey);
        const here = who.length ? who.join(", ") : "планет нет";
        note = sketch.asc
          ? "<p style=\"margin:0\">В этом расчёте " + house + " дом — знак «" + sign + "». Сейчас здесь: " + here + ".</p>"
          : "<p style=\"margin:0\">Час не указан, дома отсчитаны от Солнца. " + house + " дом — знак «" + sign + "». Сейчас здесь: " + here + ".</p>";
        parent = document.getElementById("dom-" + house);
      } else {
        note = asc
          ? "<p style=\"margin:0\">В сохранённой карте первый дом — " + asc + ": целый знак асцендента. Нажмите номер дома выше.</p>"
          : "<p style=\"margin:0\">Час не указан, дома отсчитаны от Солнца. Нажмите номер дома выше.</p>";
      }
      place(note, parent);
    }
    showHouse();
    window.addEventListener("hashchange", showHouse);
    return;
  } else if (file === "aspekty.html") {
    html = "<p style=\"margin:0\">Аспекты сохранённой карты уже собраны в <a href=\"../otchet.html\">подробном разборе</a>.</p>";
  } else if (file === "tranzit.html") {
    html = "<p style=\"margin:0\">Личный акцент на сегодня считается от сохранённой карты. <a href=\"../den.html\">Открыть сегодня</a></p>";
  } else if (file === "sinastriya.html") {
    html = "<p style=\"margin:0\">Две карты сравнивают на странице пары. <a href=\"../para.html\">Открыть пару</a></p>";
  }

  if (html) place(html);
})();
