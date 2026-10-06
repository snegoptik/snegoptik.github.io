import { Resvg, initWasm } from "@resvg/resvg-wasm";
import wasmModule from "@resvg/resvg-wasm/index_bg.wasm";
import { fontBase64 } from "./font.js";
import { matrixChart, matrixSvg } from "./matrix-fig.js";

let resvgReady = null;

function ensureResvg() {
  if (!resvgReady) {
    resvgReady = initWasm(wasmModule).catch(function (err) {
      resvgReady = null;
      throw err;
    });
  }
  return resvgReady;
}

export class Queue {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetch(request) {
    const body = await request.json();
    if (body.op === "create") {
      await this.ctx.storage.put(body.row.id, body.row);
      return Response.json({ ok: true, row: body.row });
    }
    if (body.op === "attach") {
      const row = await this.ctx.storage.get(body.id);
      if (!row) return Response.json({ ok: false });
      row.message_id = body.message_id;
      if (body.hasPhoto) row.hasPhoto = true;
      await this.ctx.storage.put(row.id, row);
      return Response.json({ ok: true, row: row });
    }
    if (body.op === "drop") {
      await this.ctx.storage.delete(body.id);
      return Response.json({ ok: true });
    }
    if (body.op === "take") {
      const row = await this.ctx.storage.get(body.id);
      if (!row) return Response.json({ ok: false, error: "missing" });
      if (row.status !== "new") return Response.json({ ok: false, error: "taken", row: row });
      row.status = "work";
      row.owner_id = body.owner_id;
      row.owner_name = body.owner_name;
      await this.ctx.storage.put(row.id, row);
      return Response.json({ ok: true, row: row });
    }
    if (body.op === "done") {
      const row = await this.ctx.storage.get(body.id);
      if (!row) return Response.json({ ok: false, error: "missing" });
      if (row.status === "done") return Response.json({ ok: false, error: "done", row: row });
      if (row.status !== "work") return Response.json({ ok: false, error: "new", row: row });
      row.status = "done";
      row.done_name = body.owner_name;
      await this.ctx.storage.put(row.id, row);
      return Response.json({ ok: true, row: row });
    }
    return Response.json({ ok: false }, { status: 400 });
  }
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const list = String(env.ALLOW_ORIGIN || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  return list.indexOf(origin) !== -1 ? origin : "";
}

function corsHeaders(origin) {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "Origin"
  };
}

function json(data, status, origin) {
  const headers = { "content-type": "application/json; charset=utf-8" };
  if (origin) Object.assign(headers, corsHeaders(origin));
  return new Response(JSON.stringify(data), { status: status, headers: headers });
}

function clean(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function parseBirth(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
  const parts = iso.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (y < 1920 || m < 1 || m > 12 || d < 1) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  const now = new Date();
  const limit = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  if (dt > limit) return null;
  return { y: y, m: m, d: d, iso: iso };
}

async function matrixPng(chart) {
  await ensureResvg();
  const binary = atob(fontBase64);
  const font = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) font[i] = binary.charCodeAt(i);
  const resvg = new Resvg(matrixSvg(chart), {
    font: {
      fontBuffers: [font],
      defaultFontFamily: "PT Sans",
      sansSerifFamily: "PT Sans"
    },
    fitTo: { mode: "width", value: 900 },
    background: "#fbf7f0"
  });
  try {
    return resvg.render().asPng();
  } finally {
    resvg.free();
  }
}

function newId() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
}

function personName(from) {
  if (!from) return "таролог";
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  if (from.username) return (name || from.username) + " (@" + from.username + ")";
  return name || "таролог";
}

function cardText(row) {
  let status = "Новая";
  if (row.status === "work") status = "В работе у " + row.owner_name;
  if (row.status === "done") status = "Обработана · " + (row.done_name || row.owner_name);
  const lines = [
    "Заявка " + row.id,
    "Имя: " + row.name,
    "Связь: " + row.contact
  ];
  if (row.birthPretty) lines.push("Дата: " + row.birthPretty);
  lines.push("", row.question, "", status);
  let text = lines.join("\n");
  if (row.hasPhoto && text.length > 1024) text = text.slice(0, 1020) + "…";
  if (!row.hasPhoto && text.length > 4096) text = text.slice(0, 4090) + "…";
  return text;
}

function keyboard(row) {
  if (row.status === "new") {
    return { inline_keyboard: [[{ text: "Взять в работу", callback_data: "t:" + row.id }]] };
  }
  if (row.status === "work") {
    return { inline_keyboard: [[{ text: "Обработана", callback_data: "d:" + row.id }]] };
  }
  return { inline_keyboard: [] };
}

async function tg(env, method, payload) {
  const res = await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/" + method, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json().catch(function () { return { ok: false }; });
}

async function queue(env, body) {
  const id = env.QUEUE.idFromName("requests");
  const stub = env.QUEUE.get(id);
  const res = await stub.fetch("https://queue.internal/", {
    method: "POST",
    body: JSON.stringify(body)
  });
  return res.json();
}

async function sendPhoto(env, png, caption, markup) {
  const form = new FormData();
  form.append("chat_id", String(env.CHAT_ID || "").trim());
  form.append("caption", caption);
  form.append("reply_markup", JSON.stringify(markup));
  form.append("photo", new Blob([png], { type: "image/png" }), "matrix.png");
  const res = await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendPhoto", {
    method: "POST",
    body: form
  });
  return res.json().catch(function () { return { ok: false }; });
}

async function editCard(env, row) {
  if (!row.message_id) return;
  const markup = keyboard(row);
  const chatId = String(env.CHAT_ID || "").trim();
  if (row.hasPhoto) {
    await tg(env, "editMessageCaption", {
      chat_id: chatId,
      message_id: row.message_id,
      caption: cardText(row),
      reply_markup: markup
    });
    return;
  }
  await tg(env, "editMessageText", {
    chat_id: chatId,
    message_id: row.message_id,
    text: cardText(row),
    reply_markup: markup
  });
}

async function createRequest(request, env, origin) {
  let body = {};
  try { body = await request.json(); } catch (e) { body = {}; }
  if (clean(body.website, 80)) {
    return json({ ok: false, error: "Заявка не отправилась. Напишите вопрос ещё раз." }, 400, origin);
  }
  const name = clean(body.name, 60);
  const contact = clean(body.contact, 80);
  const question = String(body.question || "").trim().slice(0, 1500);
  const birthRaw = clean(body.birth, 10);
  const birth = birthRaw ? parseBirth(birthRaw) : null;
  if (name.length < 2) return json({ ok: false, error: "Напишите, как к вам обращаться." }, 400, origin);
  if (contact.length < 5) return json({ ok: false, error: "Укажите Telegram или телефон, куда ответить." }, 400, origin);
  if (question.length < 15) return json({ ok: false, error: "Напишите вопрос чуть подробнее." }, 400, origin);
  if (birthRaw && !birth) return json({ ok: false, error: "Проверьте дату рождения." }, 400, origin);

  const chart = birth ? matrixChart(birth) : null;
  const row = {
    id: newId(),
    name: name,
    contact: contact,
    question: question,
    birth: birth ? birth.iso : "",
    birthPretty: chart ? chart.pretty : "",
    hasPhoto: false,
    status: "new",
    created_at: new Date().toISOString()
  };
  let png = null;
  if (chart) {
    try { png = await matrixPng(chart); } catch (e) { png = null; }
  }
  await queue(env, { op: "create", row: row });
  let sent = null;
  if (png) {
    row.hasPhoto = true;
    sent = await sendPhoto(env, png, cardText(row), keyboard(row));
    if (!sent.ok || !sent.result) {
      row.hasPhoto = false;
      sent = null;
    }
  }
  if (!sent) {
    sent = await tg(env, "sendMessage", {
      chat_id: String(env.CHAT_ID || "").trim(),
      text: cardText(row),
      reply_markup: keyboard(row)
    });
  }
  if (!sent.ok || !sent.result) {
    await queue(env, { op: "drop", id: row.id });
    return json({ ok: false, error: "Заявка не ушла тарологам. Попробуйте ещё раз чуть позже." }, 502, origin);
  }
  await queue(env, {
    op: "attach",
    id: row.id,
    message_id: sent.result.message_id,
    hasPhoto: row.hasPhoto
  });
  return json({ ok: true }, 200, origin);
}

async function onCallback(env, cq) {
  const data = String(cq.data || "");
  const kind = data.slice(0, 2);
  const id = data.slice(2);
  const chatId = cq.message && cq.message.chat && String(cq.message.chat.id);
  if (!chatId || chatId !== String(env.CHAT_ID || "").trim() || (kind !== "t:" && kind !== "d:")) {
    await tg(env, "answerCallbackQuery", { callback_query_id: cq.id });
    return;
  }
  const owner = personName(cq.from);
  const ownerId = cq.from ? String(cq.from.id) : "";
  const result = kind === "t:"
    ? await queue(env, { op: "take", id: id, owner_id: ownerId, owner_name: owner })
    : await queue(env, { op: "done", id: id, owner_id: ownerId, owner_name: owner });
  if (!result.ok) {
    const text = result.error === "taken"
      ? "Эту заявку уже взяли"
      : result.error === "done"
        ? "Заявка уже обработана"
        : result.error === "new"
          ? "Сначала заявку нужно взять в работу"
          : "Заявка не найдена";
    await tg(env, "answerCallbackQuery", { callback_query_id: cq.id, text: text, show_alert: true });
    if (result.row) await editCard(env, result.row);
    return;
  }
  await editCard(env, result.row);
  await tg(env, "answerCallbackQuery", {
    callback_query_id: cq.id,
    text: kind === "t:" ? "Заявка у вас в работе" : "Отмечено: обработана"
  });
}

async function connectWebhook(request, env) {
  const auth = request.headers.get("Authorization") || "";
  if (!env.WEBHOOK_SECRET || auth !== "Bearer " + env.WEBHOOK_SECRET) {
    return new Response("no", { status: 401 });
  }
  const hook = new URL(request.url);
  hook.pathname = "/telegram";
  hook.search = "";
  const data = await tg(env, "setWebhook", {
    url: hook.toString(),
    secret_token: env.WEBHOOK_SECRET,
    allowed_updates: ["callback_query"]
  });
  return Response.json({ ok: !!data.ok });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/telegram" && request.method === "POST") {
      if (!env.WEBHOOK_SECRET || request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.WEBHOOK_SECRET) {
        return new Response("no", { status: 401 });
      }
      let update = {};
      try { update = await request.json(); } catch (e) { update = {}; }
      if (update.callback_query) await onCallback(env, update.callback_query);
      return new Response("ok");
    }
    if (url.pathname === "/admin/webhook" && request.method === "POST") {
      return connectWebhook(request, env);
    }
    const origin = allowedOrigin(request, env);
    if (request.method === "OPTIONS") {
      if (!origin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (url.pathname === "/api/zayavka" && request.method === "POST") {
      if (!origin) return json({ ok: false, error: "Этот адрес не принимает заявку." }, 403, "");
      if (!env.BOT_TOKEN || !env.CHAT_ID) {
        return json({ ok: false, error: "Заявку пока некому отправить: бот тарологов ещё не подключён." }, 503, origin);
      }
      return createRequest(request, env, origin);
    }
    return new Response("not found", { status: 404 });
  }
};
