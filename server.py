#!/usr/bin/env python3
# Serves the site and sends tarot requests to Telegram.
import json
import os
import socket
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(ROOT, "telegram.json")
PORT = 8765
HOST = "0.0.0.0"
HIDDEN = {"/telegram.json", "/telegram.example.json"}


def lan_urls(port):
    urls = ["http://127.0.0.1:%s/" % port]
    seen = set()
    try:
        hostname = socket.gethostname()
        for info in socket.getaddrinfo(hostname, None, socket.AF_INET):
            ip = info[4][0]
            if ip.startswith("127.") or ip in seen:
                continue
            seen.add(ip)
            urls.append("http://%s:%s/" % (ip, port))
    except Exception:
        pass
    return urls


def load_config():
    if not os.path.isfile(CONFIG_PATH):
        return {}
    with open(CONFIG_PATH, encoding="utf-8") as handle:
        return json.load(handle)


def save_config(cfg):
    with open(CONFIG_PATH, "w", encoding="utf-8") as handle:
        json.dump(cfg, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def tg_api(token, method, payload=None, params=None):
    url = "https://api.telegram.org/bot%s/%s" % (token, method)
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json; charset=utf-8"
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def resolve_chat_id(cfg):
    token = (cfg.get("botToken") or "").strip()
    if cfg.get("chatId"):
        return str(cfg["chatId"])
    data = tg_api(token, "getUpdates", params={"limit": 50, "timeout": 0})
    for upd in reversed(data.get("result") or []):
        msg = upd.get("message") or upd.get("edited_message") or upd.get("channel_post") or {}
        chat = msg.get("chat") or {}
        if chat.get("id") is None:
            continue
        cfg["chatId"] = str(chat["id"])
        save_config(cfg)
        return cfg["chatId"]
    return None


def bot_username(token):
    try:
        me = tg_api(token, "getMe")
        return ((me.get("result") or {}).get("username") or "")
    except Exception:
        return ""


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in HIDDEN:
            self.send_error(404)
            return
        if parsed.path == "/api/telegram-status":
            cfg = load_config()
            token = (cfg.get("botToken") or "").strip()
            payload = {
                "configured": bool(token),
                "hasChat": bool((cfg.get("chatId") or "").strip()),
                "botUsername": "",
            }
            if token:
                payload["botUsername"] = bot_username(token)
                if not payload["hasChat"]:
                    try:
                        payload["hasChat"] = bool(resolve_chat_id(cfg))
                    except Exception:
                        pass
            return self.json(payload)
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/api/zayavka":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length)
        try:
            body = json.loads(raw.decode("utf-8"))
        except Exception:
            return self.json({"ok": False, "error": "bad_json"}, 400)

        cfg = load_config()
        token = (cfg.get("botToken") or "").strip()
        if not token:
            return self.json({"ok": False, "error": "not_configured"}, 503)

        try:
            chat_id = resolve_chat_id(cfg)
        except urllib.error.HTTPError as err:
            detail = err.read().decode("utf-8", "replace")
            return self.json({"ok": False, "error": "telegram", "detail": detail}, 502)
        except Exception as err:
            return self.json({"ok": False, "error": "telegram", "detail": str(err)}, 502)

        if not chat_id:
            return self.json({"ok": False, "error": "no_chat", "botUsername": bot_username(token)}, 409)

        name = str(body.get("name") or "").strip()[:200]
        contact = str(body.get("contact") or "").strip()[:200]
        question = str(body.get("question") or "").strip()[:4000]
        fmt = str(body.get("format") or "").strip()[:100]
        if not name or not contact or not question:
            return self.json({"ok": False, "error": "empty"}, 400)

        text = (
            "Заявка с Зенита\n"
            "Имя: %s\n"
            "Контакт: %s\n"
            "Формат: %s\n\n"
            "%s"
        ) % (name, contact, fmt, question)

        try:
            tg_api(token, "sendMessage", {
                "chat_id": chat_id,
                "text": text,
                "disable_web_page_preview": True,
            })
        except urllib.error.HTTPError as err:
            detail = err.read().decode("utf-8", "replace")
            return self.json({"ok": False, "error": "send_failed", "detail": detail}, 502)

        return self.json({"ok": True})

    def json(self, obj, status=200):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    os.chdir(ROOT)
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print("Зенит запущен. Пока окно открыто — сайт доступен.")
    print("  Этот ПК:     http://127.0.0.1:%s/" % PORT)
    for url in lan_urls(PORT)[1:]:
        print("  Другой человек: %s" % url)
    print("Если человек не в вашей сети — нужна временная ссылка (туннель). ПК не выключайте.")
    if not (load_config().get("botToken") or "").strip():
        print("Telegram ещё не подключен. Токен от @BotFather вставьте в telegram.json")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nstop")
