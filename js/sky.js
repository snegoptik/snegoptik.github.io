(function () {
  var CHOICE_KEY = "zenit-sky-choice";
  var LEGACY_KEY = "zenit-sky";

  function systemSky() {
    try {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "paper" : "dusk";
    } catch (e) {
      return "dusk";
    }
  }

  function storedChoice() {
    try {
      var choice = localStorage.getItem(CHOICE_KEY);
      if (choice === "paper" || choice === "dusk") return choice;
      if (localStorage.getItem(LEGACY_KEY) === "paper") return "paper";
    } catch (e) {}
    return null;
  }

  function paintBoot(sky) {
    var node = document.getElementById("boot-theme");
    if (!node) return;
    var bg = sky === "paper" ? "#f3eee4" : "#110f0d";
    var fg = sky === "paper" ? "#1c1916" : "#fbf6ee";
    node.textContent = "html,body{background:" + bg + ";color:" + fg + "}";
  }

  function apply(sky) {
    var next = sky === "paper" ? "paper" : "dusk";
    document.documentElement.setAttribute("data-sky", next);
    var theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.setAttribute("content", next === "paper" ? "#f3eee4" : "#110f0d");
    paintBoot(next);
    try {
      document.documentElement.dispatchEvent(new Event("zenit-sky"));
    } catch (e) {}
    return next;
  }

  function toggle() {
    var next = document.documentElement.getAttribute("data-sky") === "paper" ? "dusk" : "paper";
    try { localStorage.setItem(CHOICE_KEY, next); } catch (e) {}
    return apply(next);
  }

  apply(storedChoice() || systemSky());

  var media = null;
  try { media = window.matchMedia("(prefers-color-scheme: light)"); } catch (e) {}
  if (media) {
    var onChange = function () {
      if (!storedChoice()) apply(systemSky());
    };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  window.ZenitSky = {
    current: function () {
      return document.documentElement.getAttribute("data-sky") === "paper" ? "paper" : "dusk";
    },
    toggle: toggle
  };
})();
