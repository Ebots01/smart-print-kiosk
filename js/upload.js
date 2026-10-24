/* ============================================================
   ONETAPPRINT — UPLOAD.JS
   Second way to print: upload from the website (after scanning the kiosk QR).

   Privacy: the server gives THIS browser a secret token for each upload.
   The PIN is released only to the browser that holds that token, and only
   after the kiosk confirmed it received the file. Other visitors using the
   site at the same time can never see it.
   ============================================================ */

"use strict";

(function () {
  const C = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG.upload : null;
  const drop   = document.getElementById("upload-drop");
  const input  = document.getElementById("upload-input");
  const list   = document.getElementById("upload-list");
  const errBox = document.getElementById("upload-error");
  const hint   = document.getElementById("upload-hint");
  if (!C || !drop || !input || !list) return;

  const MAX_BYTES  = C.maxMB * 1024 * 1024;
  const ALLOWED    = C.allowedExt.map(e => e.toLowerCase());
  const POLL_MS    = 1500;
  const WAIT_MS    = C.waitSeconds * 1000;
  const STORE_KEY  = "otp_uploads_v1";
  const MAX_AGE_MS = 4 * 60 * 1000;

  /** item = { key, name, state, progress, file, id, token, pin, readyUntil, waitStart, error, els } */
  let items = [];
  let seq = 0;
  let pollTimer = null;
  let polling = false;
  let tickTimer = null;

  hint.textContent =
    `${ALLOWED.map(e => e.slice(1).toUpperCase()).join(", ")} · up to ${C.maxMB} MB each · max ${C.maxFiles} files at a time`;
  input.setAttribute("accept", ALLOWED.join(","));

  /* ── helpers ─────────────────────────────────────────────── */
  const extOf = name => { const i = name.lastIndexOf("."); return i < 0 ? "" : name.slice(i).toLowerCase(); };
  const showError  = msg => { errBox.textContent = msg; errBox.hidden = false; };
  const clearError = () => { errBox.hidden = true; errBox.textContent = ""; };
  const isLive = i => i.state === "uploading" || i.state === "waiting" || i.state === "ready";

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;   // textContent only: file names are never parsed as HTML
    return e;
  }

  /* ── persistence (this tab only), so a refresh does not lose the PIN ── */
  function save() {
    try {
      const keep = items
        .filter(i => (i.state === "waiting" || i.state === "ready") && i.id)
        .map(i => ({ id: i.id, token: i.token, name: i.name, state: i.state, pin: i.pin,
                     readyUntil: i.readyUntil, waitStart: i.waitStart }));
      sessionStorage.setItem(STORE_KEY, JSON.stringify(keep));
    } catch (_) { /* storage blocked: fine */ }
  }

  function restore() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
      const now = Date.now();
      saved.forEach(s => {
        if (!s.id || !s.token) return;
        if (now - (s.waitStart || 0) > MAX_AGE_MS) return;
        if (s.state === "ready" && s.readyUntil && s.readyUntil <= now) return;
        const item = newItem(s.name);
        Object.assign(item, { state: s.state, id: s.id, token: s.token, pin: s.pin,
                              readyUntil: s.readyUntil, waitStart: s.waitStart });
        items.push(item);
        list.appendChild(buildEl(item));
        update(item);
      });
      if (items.length) { startPolling(); startTick(); }
    } catch (_) { /* ignore */ }
  }

  /* ── one list row per file ───────────────────────────────── */
  function newItem(name) {
    return { key: ++seq, name, state: "uploading", progress: 0, file: null, id: null, token: null,
             pin: null, readyUntil: 0, waitStart: 0, error: "", els: {} };
  }

  function buildEl(item) {
    const li = el("li", "upload-item");
    const row = el("div", "ui-row");
    const icon = el("span", "ui-icon", "📄");
    const main = el("div", "ui-main");
    const name = el("div", "ui-name", item.name);
    const status = el("div", "ui-status");
    main.append(name, status);
    const close = el("button", "ui-close", "✕");
    close.type = "button";
    close.setAttribute("aria-label", "Remove from list");
    close.addEventListener("click", () => removeItem(item));
    row.append(icon, main, close);

    const bar = el("div", "ui-bar");
    const fill = el("div", "ui-bar-fill");
    bar.appendChild(fill);

    const pinBox = el("div", "ui-pin");
    pinBox.hidden = true;
    const pinLabel = el("div", "ui-pin-label", "Your PIN — enter it on the kiosk");
    const pinDigits = el("div", "ui-pin-digits");
    const pinTimer = el("div", "ui-pin-timer");
    pinBox.append(pinLabel, pinDigits, pinTimer);

    li.append(row, bar, pinBox);
    item.els = { li, status, bar, fill, close, pinBox, pinDigits, pinTimer };
    return li;
  }

  function update(item) {
    const e = item.els;
    if (!e.li) return;
    e.li.className = "upload-item state-" + item.state;
    e.bar.hidden = !(item.state === "uploading" || item.state === "waiting");
    e.close.hidden = item.state === "uploading";
    e.pinBox.hidden = item.state !== "ready";

    switch (item.state) {
      case "uploading":
        e.status.textContent = `Uploading… ${item.progress}%`;
        e.fill.style.width = item.progress + "%";
        e.bar.classList.remove("indeterminate");
        break;
      case "waiting":
        e.status.textContent = "Sending to the kiosk… keep this page open";
        e.fill.style.width = "";
        e.bar.classList.add("indeterminate");
        break;
      case "ready":
        e.status.textContent = "Received by the kiosk ✔";
        e.pinDigits.textContent = item.pin || "";
        tickOne(item);
        break;
      case "expired":
        e.status.textContent = "PIN expired. Upload the file again if you still need a print.";
        break;
      case "error":
        e.status.textContent = item.error || "Something went wrong. Please try again.";
        break;
    }
  }

  function removeItem(item) {
    items = items.filter(i => i !== item);
    item.els.li?.remove();
    save();
  }

  function fail(item, message) {
    item.state = "error";
    item.error = message;
    item.token = null;
    item.file = null;
    update(item);
    save();
  }

  /* ── adding files ────────────────────────────────────────── */
  function addFiles(fileList) {
    clearError();
    const files = Array.from(fileList);
    const room = C.maxFiles - items.filter(isLive).length;

    if (room <= 0) { showError(`You can upload up to ${C.maxFiles} files at a time. Remove one first.`); return; }
    if (files.length > room) showError(`Only ${room} more file(s) can be added right now.`);

    files.slice(0, room).forEach(f => {
      if (!ALLOWED.includes(extOf(f.name))) { showError(`"${f.name}" is not supported. Use ${ALLOWED.join(", ")}.`); return; }
      if (f.size === 0)        { showError(`"${f.name}" is empty.`); return; }
      if (f.size > MAX_BYTES)  { showError(`"${f.name}" is larger than ${C.maxMB} MB.`); return; }

      const item = newItem(f.name);
      item.file = f;
      items.unshift(item);
      list.prepend(buildEl(item));
      update(item);
      upload(item);
    });
  }

  /* ── upload (XHR so we get a real progress bar) ──────────── */
  function upload(item) {
    const fd = new FormData();
    fd.append("file", item.file, item.name);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", C.uploadUrl);
    xhr.timeout = 120000;

    xhr.upload.onprogress = ev => {
      if (!ev.lengthComputable) return;
      item.progress = Math.min(99, Math.round((ev.loaded / ev.total) * 100));
      update(item);
    };
    xhr.onload = () => {
      let body = {};
      try { body = JSON.parse(xhr.responseText); } catch (_) { /* not JSON */ }
      if (xhr.status === 200 && body.id && body.token) {
        item.id = body.id;
        item.token = body.token;
        item.file = null;
        item.state = "waiting";
        item.waitStart = Date.now();
        update(item);
        save();
        startPolling();
      } else {
        fail(item, body.message || "Upload failed. Please try again.");
      }
    };
    xhr.onerror   = () => fail(item, "No connection. Check your internet and try again.");
    xhr.ontimeout = () => fail(item, "Upload timed out. Please try again.");
    xhr.send(fd);
  }

  /* ── ask the server if the kiosk has the file (only waiting items) ── */
  function startPolling() {
    if (pollTimer) return;
    pollTimer = setInterval(poll, POLL_MS);
    poll();
  }

  async function poll() {
    const watching = items.filter(i => i.state === "waiting" && i.id);
    if (!watching.length) { clearInterval(pollTimer); pollTimer = null; return; }
    if (polling) return;
    polling = true;

    try {
      const res = await fetch(C.statusUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: watching.map(i => ({ id: i.id, token: i.token })) }),
      });
      if (res.ok) {
        const data = await res.json();
        (data.results || []).forEach(r => {
          const it = items.find(i => i.id === r.id);
          if (!it || it.state !== "waiting") return;
          if (r.state === "ready") {
            it.state = "ready";
            it.pin = r.pin;
            it.readyUntil = Date.now() + r.expiresInSeconds * 1000;
            update(it);
            startTick();
          } else if (r.state === "gone") {
            fail(it, "The kiosk did not receive your file in time. Please upload it again.");
          }
        });
      }
    } catch (_) {
      /* short network problem: just try again on the next tick */
    } finally {
      polling = false;
    }

    const now = Date.now();
    items.forEach(it => {
      if (it.state === "waiting" && now - it.waitStart > WAIT_MS) {
        fail(it, "The kiosk did not respond in time. Please try again.");
      }
    });
    save();
  }

  /* ── PIN countdown ───────────────────────────────────────── */
  function tickOne(item) {
    if (item.state !== "ready") return;
    const left = Math.ceil((item.readyUntil - Date.now()) / 1000);
    if (left <= 0) { item.state = "expired"; update(item); save(); return; }
    item.els.pinTimer.textContent = `Valid for ${left}s`;
  }

  function startTick() {
    if (tickTimer) return;
    tickTimer = setInterval(() => {
      const ready = items.filter(i => i.state === "ready");
      ready.forEach(tickOne);
      if (!items.some(i => i.state === "ready")) { clearInterval(tickTimer); tickTimer = null; }
    }, 1000);
  }

  /* ── drop zone wiring ────────────────────────────────────── */
  drop.addEventListener("click", () => input.click());
  drop.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
  });
  input.addEventListener("change", () => { addFiles(input.files); input.value = ""; });

  ["dragenter", "dragover"].forEach(t =>
    drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add("dragging"); }));
  ["dragleave", "drop"].forEach(t =>
    drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove("dragging"); }));
  drop.addEventListener("drop", e => { if (e.dataTransfer?.files) addFiles(e.dataTransfer.files); });

  restore();
})();
