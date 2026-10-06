(function () {
  const form = document.getElementById("zayavka-form");
  const note = document.getElementById("zayavka-note");
  const gift = document.getElementById("matrix-gift");
  if (!form || !note) return;

  const MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  const daySel = document.getElementById("z-day");
  const monthSel = document.getElementById("z-month");
  const yearSel = document.getElementById("z-year");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function fillDate() {
    if (!daySel || !monthSel || !yearSel) return;
    const now = new Date();
    monthSel.innerHTML = '<option value="">месяц</option>' + MONTHS.map(function (name, i) {
      return '<option value="' + (i + 1) + '">' + name + "</option>";
    }).join("");
    let years = '<option value="">год</option>';
    for (let y = now.getFullYear(); y >= 1920; y--) years += '<option value="' + y + '">' + y + "</option>";
    yearSel.innerHTML = years;
    rebuildDays();
  }

  function rebuildDays(keep) {
    const year = Number(yearSel.value);
    const month = Number(monthSel.value);
    const max = year && month ? daysInMonth(year, month) : 31;
    const current = keep || daySel.value || "";
    const next = current && Number(current) <= max ? String(Number(current)) : "";
    let html = '<option value="">день</option>';
    for (let d = 1; d <= max; d++) html += '<option value="' + d + '">' + d + "</option>";
    daySel.innerHTML = html;
    daySel.value = next;
  }

  function birthIso() {
    if (!daySel || !monthSel || !yearSel) return "";
    if (!daySel.value || !monthSel.value || !yearSel.value) return "";
    return yearSel.value + "-" + pad(monthSel.value) + "-" + pad(daySel.value);
  }

  if (daySel && monthSel && yearSel) {
    fillDate();
    monthSel.addEventListener("change", function () { rebuildDays(); });
    yearSel.addEventListener("change", function () { rebuildDays(); });
  }

  function show(text, ok) {
    note.hidden = false;
    note.textContent = text;
    note.className = ok ? "ok-note" : "notice";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const endpoint = (window.ZENIT_ZAYAVKA && window.ZENIT_ZAYAVKA.endpoint) || "";
    const name = form.name.value.replace(/\s+/g, " ").trim();
    const contact = form.contact.value.replace(/\s+/g, " ").trim();
    const question = form.question.value.trim();
    const birth = birthIso();
    const wantGift = document.getElementById("z-gift") && document.getElementById("z-gift").checked;
    const matrix = window.ZenitMatrix ? ZenitMatrix.compute(birth) : null;
    if (name.length < 2) {
      show("Напишите, как к вам обращаться.");
      return;
    }
    if (contact.length < 5) {
      show("Укажите Telegram или телефон, куда ответить.");
      return;
    }
    if (!matrix) {
      show("Укажите дату рождения: без неё матрицу не посчитать.");
      return;
    }
    if (question.length < 15) {
      show("Напишите вопрос чуть подробнее.");
      return;
    }
    if (!form.consent || !form.consent.checked) {
      show("Нужно согласие на обработку данных из заявки.");
      return;
    }
    if (!endpoint) {
      show("Заявку пока некому отправить: бот тарологов ещё не подключён.");
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    note.hidden = true;
    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name,
        contact: contact,
        question: question,
        birth: birth,
        website: form.website ? form.website.value : ""
      })
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { ok: res.ok && data.ok, error: data.error };
      });
    }).then(function (result) {
      btn.disabled = false;
      if (!result.ok) {
        show(result.error || "Заявка не ушла. Попробуйте ещё раз.");
        return;
      }
      form.reset();
      fillDate();
      show("Заявка ушла. Ответ придёт туда, куда вы указали для связи.", true);
      if (window.ZenitMatrix && gift) {
        ZenitMatrix.render(wantGift ? matrix : null, gift);
        if (wantGift) gift.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }).catch(function () {
      btn.disabled = false;
      show("Заявка не ушла. Проверьте связь и попробуйте ещё раз.");
    });
  });
})();
