/* =========================================================
   CONFIGURACIÓN — edita aquí lo que falta 👇
   ========================================================= */
const CONFIG = {
  // Fecha y hora (hora de Chile en diciembre = UTC-3)
  inicio: "2026-12-05T18:00:00-03:00",
  fin: "2026-12-06T03:00:00-03:00",

  // Lugar (si lo dejas vacío, se muestra "por confirmar")
  lugar: "El Tranque 174",
  direccion: "Chicureo, Colina",

  // WhatsApp que recibe las confirmaciones (formato internacional, sin + ni espacios)
  whatsapp: "56956220216",

  // URL de la "Aplicación web" de Google Apps Script (ver apps-script.gs). Vacío = no guarda.
  sheetUrl: "https://script.google.com/macros/s/AKfycbxR1iTua8_md_1aJ_p7srTV4ks0eVCy3hmh6ipl9q7EkeqisvcCmL9k3ZhiPQnFJvk-Ww/exec",

  // Datos de transferencia: van cifrados (private/bank.json → img/bank.bin, ver encrypt.py)

  // Regalos (precios en CLP)
  regalos: [
    { ico: "🛠️", t: "A workshop for Nata", d: "Her own space to build whatever she dreams up.", p: 300000 },
    { ico: "🏄", t: "A surfboard", d: "Waves, here we come.", p: 350000 },
    { ico: "⛷️", t: "A family ski week", d: "The girls in ski school, us on the slopes.", p: 900000 },
    { ico: "🧘", t: "Tickets to Mind & Life", d: "To keep exploring the mind (and the world).", p: 1200000 },
    { ico: "👨‍🌾", t: "A gardener for a year", d: "The pisco sour lemon tree thanks you.", p: 2400000 },
    { ico: "😅", t: "…or a gardener for a month", d: "Still helps. Still grateful.", p: 200000 },
    { ico: "🏊", t: "A clean pool all summer", d: "No leaves, no bugs, just splashing.", p: 400000 },
    { ico: "🌸", t: "New plants for the garden", d: "More lilac flowers, like the ones on the invitation.", p: 80000 },
    { ico: "🏔️", t: "One meter of Everest", d: "Only 8,849 to go. If we all chip in, we reach the summit.", p: 10000 },
    { ico: "🍦", t: "Ice cream for the girls", d: "Official bribe so they walk the rings in nicely.", p: 10000 },
    { ico: "💌", t: "Any amount", d: "You choose how much.", p: 0, libre: true },
  ],
};

/* Fotos: archivo + texto de la polaroid */
const HERO = "f09.jpg";
const FOTOS = [
  ["f22.jpg", "Footprints at sunset"],
  ["f21.jpg", "Hand in hand in the Andes"],
  ["f19.jpg", "A castle at night"],
  ["f18.jpg", "Hugs among giant trees"],
  ["f13.jpg", "Summit reached"],
  ["f20.jpg", "Nata, Javi and the girls in the hot tub"],
  ["f11.jpg", "That tree was HUGE"],
  ["f12.jpg", "Water, hills and us"],
  ["f16.jpg", "💍 Yes!"],
  ["f02.jpg", "Seeing the world"],
  ["f15.jpg", "The whole team 😛"],
  ["f07.jpg", "Family in bloom"],
  ["f01.jpg", "Make a wish"],
  ["f06.jpg", "Dressed up"],
  ["f17.jpg", "Perfect Sunday"],
  ["f10.jpg", "Forest and fog"],
];
const MEMORICE = ["f02.jpg", "f21.jpg", "f22.jpg", "f08.jpg", "f19.jpg", "f12.jpg", "f14.jpg", "f17.jpg"];

/* ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
const clp = n => "$" + Math.round(n).toLocaleString("en-US");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2800);
}

function party(opts = {}) {
  if (!window.confetti || reduced) return;
  const colors = ["#b98bd0", "#d8b8e8", "#efe2f5", "#8fa07a", "#b8327e", "#ffffff"];
  confetti({ particleCount: 120, spread: 80, origin: { y: .7 }, colors, ...opts });
}

/* ---------- guardar en Google Sheet ---------- */
function guardar(data) {
  if (!CONFIG.sheetUrl) return;
  fetch(CONFIG.sheetUrl, {
    method: "POST", mode: "no-cors", keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  }).catch(() => {});
}

/* ---------- pétalos ---------- */
function fallingPetals(container, n = 18) {
  if (reduced) return () => {};
  let alive = true;
  const spawn = () => {
    if (!alive) return;
    const p = document.createElement("span");
    p.className = "petal";
    const x = Math.random() * innerWidth, dur = 6 + Math.random() * 6, drift = (Math.random() - .5) * 240, s = .6 + Math.random() * .8;
    p.style.left = x + "px";
    p.style.transform = `scale(${s})`;
    container.appendChild(p);
    p.animate([
      { transform: `translate(0,0) rotate(0) scale(${s})` },
      { transform: `translate(${drift}px, ${innerHeight + 60}px) rotate(${Math.random() * 720 - 360}deg) scale(${s})` },
    ], { duration: dur * 1000, easing: "linear" }).onfinish = () => p.remove();
    setTimeout(spawn, 6000 / n + Math.random() * 300);
  };
  spawn();
  return () => { alive = false; };
}

function burst(x, y, n = 10) {
  if (reduced) return;
  for (let i = 0; i < n; i++) {
    const b = document.createElement("span");
    b.className = "burst";
    b.style.left = x + "px"; b.style.top = y + "px";
    document.body.appendChild(b);
    const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 60;
    b.animate([
      { transform: "translate(-50%,-50%) scale(1) rotate(0)", opacity: 1 },
      { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 30}px) scale(.4) rotate(${Math.random() * 360}deg)`, opacity: 0 },
    ], { duration: 800 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => b.remove();
  }
}

/* ---------- clave: las fotos están cifradas (AES-CBC + PBKDF2) ---------- */
const URLS = {};
let BANCO = [];
const BANK_EN = { Nombre: "Name", RUT: "RUT (Chilean tax ID)", Banco: "Bank", Tipo: "Account type", Cuenta: "Account number", Mail: "Email" };
const BANK_VAL_EN = { "Cuenta Corriente": "Checking account (Cuenta Corriente)" };
const photo = src => URLS[src.replace(/\.\w+$/, "")] || "";
const normPw = p => p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
const hex = h => new Uint8Array(h.match(/../g).map(b => parseInt(b, 16)));

async function deriveKey(pw) {
  const sec = await (await fetch("secure.json")).json();
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(normPw(pw)), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: hex(sec.salt), iterations: sec.iter, hash: "SHA-256" },
    base, { name: "AES-CBC", length: 256 }, false, ["decrypt"]);
}
async function decryptFile(key, path) {
  const buf = await (await fetch(path)).arrayBuffer();
  return crypto.subtle.decrypt({ name: "AES-CBC", iv: buf.slice(0, 16) }, key, buf.slice(16));
}
async function unlock(pw) {
  const key = await deriveKey(pw);
  let ok = false;
  try { ok = new TextDecoder().decode(await decryptFile(key, "img/check.bin")) === "nata&javi"; } catch {}
  if (!ok) return false;
  const names = [...new Set([HERO, ...FOTOS.map(f => f[0]), ...MEMORICE])].map(f => f.replace(/\.\w+$/, ""));
  await Promise.all(names.map(async n => {
    URLS[n] = URL.createObjectURL(new Blob([await decryptFile(key, `img/${n}.bin`)], { type: "image/jpeg" }));
  }));
  try { BANCO = JSON.parse(new TextDecoder().decode(await decryptFile(key, "img/bank.bin"))); } catch {}
  return true;
}

/* ---------- intro: el sobre ---------- */
function setupIntro() {
  const intro = $("#intro"), form = $("#unlock"), input = $("#pw"), msg = $("#unlockMsg"), hint = $("#introHint");
  let stop = fallingPetals($(".intro-petals"), 14);
  let unlocked = false, contentReady = false;

  const open = () => {
    if (!unlocked) { form.classList.remove("bad"); void form.offsetWidth; form.classList.add("bad"); input.focus(); return; }
    if (intro.classList.contains("opened")) return;
    intro.classList.add("opened");
    setTimeout(() => party({ particleCount: 160, spread: 100, origin: { y: .55 } }), 900);
    setTimeout(() => {
      intro.classList.add("gone");
      document.body.classList.remove("is-locked");
      document.body.classList.add("ready");
      stop();
      setupPolaroids.layout && setupPolaroids.layout(false);
    }, 2600);
  };

  const onUnlocked = pw => {
    unlocked = true;
    form.hidden = true; hint.hidden = false;
    if (!contentReady) {
      contentReady = true;
      const hero = $("#heroImg");
      hero.onload = () => hero.classList.add("loaded");
      hero.src = photo(HERO);
      setupPolaroids(); setupMemory(); renderBank();
    }
  };

  const tryPw = async (pw, auto) => {
    form.classList.add("busy"); msg.textContent = auto ? "" : "Abriendo…";
    let ok = false;
    try { ok = await unlock(pw); } catch (e) { console.error(e); }
    form.classList.remove("busy");
    if (ok) { msg.textContent = ""; onUnlocked(pw); if (!auto) setTimeout(open, 250); }
    else if (!auto) {
      msg.textContent = "Hmm, that's not it. Check the message your invitation came in 💌";
      form.classList.remove("bad"); void form.offsetWidth; form.classList.add("bad");
    }
  };

  form.addEventListener("submit", e => { e.preventDefault(); if (input.value.trim()) tryPw(input.value, false); });
  $("#seal").addEventListener("click", e => { e.stopPropagation(); open(); });
  $("#envelope").addEventListener("click", open);
  $("#replay").addEventListener("click", () => {
    scrollTo({ top: 0 });
    intro.classList.remove("opened", "gone");
    document.body.classList.add("is-locked");
    document.body.classList.remove("ready");
    stop = fallingPetals($(".intro-petals"), 14);
  });

  // siempre se pide la clave: no se acepta por URL ni se recuerda entre visitas
  store.del && store.del("nj-pw");
}

/* ---------- cuenta regresiva ---------- */
function setupCountdown() {
  const target = new Date(CONFIG.inicio).getTime();
  const els = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
  const set = (el, v) => { if (el.textContent !== v) { el.textContent = v; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } };
  const tick = () => {
    let diff = Math.max(0, target - Date.now());
    if (diff === 0) {
      $("#countdown").hidden = true;
      $("#countdownNote").textContent = "Today's the day! 🎉";
      return;
    }
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    set(els.d, String(d)); set(els.h, String(h).padStart(2, "0"));
    set(els.m, String(m).padStart(2, "0")); set(els.s, String(s).padStart(2, "0"));
    setTimeout(tick, 1000);
  };
  tick();
}

/* ---------- easter egg en el "&" ---------- */
function setupAmp() {
  if (!$("#amp")) return;
  let clicks = 0;
  const msgs = ["💜", "Again?", "Keep going…", "Almost!", "🎉 You found the surprise! A dance with the newlyweds is guaranteed."];
  $("#amp").addEventListener("click", e => {
    burst(e.clientX, e.clientY, 14);
    toast(msgs[Math.min(clicks, msgs.length - 1)]);
    clicks++;
    if (clicks === 5) {
      const heart = window.confetti && confetti.shapeFromText ? confetti.shapeFromText({ text: "💜", scalar: 2 }) : null;
      party(heart ? { shapes: [heart], scalar: 2, particleCount: 60 } : {});
    }
  });
}

/* ---------- nav ---------- */
function setupNav() {
  const nav = $("#nav");
  const links = $$("a", nav);
  const onScroll = () => nav.classList.toggle("show", scrollY > innerHeight * .6);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => io.observe(s));
}

/* ---------- polaroids arrastrables ---------- */
function setupPolaroids() {
  const table = $("#polaroids");
  let z = 10;
  const cards = FOTOS.map(([src, cap]) => {
    const f = document.createElement("figure");
    f.className = "polaroid";
    f.innerHTML = `<img src="${photo(src)}" alt="${cap}">`;
    f.style.margin = "0";
    table.appendChild(f);
    return f;
  });

  const layout = (random) => {
    const W = table.clientWidth, H = table.clientHeight;
    const cw = cards[0].offsetWidth, ch = cards[0].offsetHeight;
    const cols = Math.max(2, Math.round(W / (cw * .85)));
    const rows = Math.ceil(cards.length / cols);
    cards.forEach((c, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const inRow = Math.min(cols, cards.length - row * cols);
      const step = cols > 1 ? (W - cw) / (cols - 1) : 0;
      const cx = (cols - inRow) * step / 2 + step * col;
      const cy = rows > 1 ? (H - ch) * row / (rows - 1) : 0;
      const jx = random ? (Math.random() - .5) * cw * .5 : (i % 3 - 1) * 10;
      const jy = random ? (Math.random() - .5) * ch * .3 : ((i * 7) % 5 - 2) * 8;
      const x = Math.min(Math.max(0, cx + jx), W - cw), y = Math.min(Math.max(0, cy + jy), H - ch);
      const r = random ? (Math.random() - .5) * 24 : ((i * 37) % 17) - 8;
      c.style.left = x + "px"; c.style.top = y + "px";
      c.style.transform = `rotate(${r}deg)`;
      c.dataset.r = r;
    });
  };
  setupPolaroids.layout = layout;
  requestAnimationFrame(() => layout(false));
  addEventListener("resize", () => layout(false));
  $("#shuffle").addEventListener("click", e => { layout(true); burst(e.clientX, e.clientY); });

  cards.forEach(c => {
    let sx, sy, ox, oy, moved = false, active = false;
    c.addEventListener("pointerdown", e => {
      active = true; moved = false;
      sx = e.clientX; sy = e.clientY; ox = c.offsetLeft; oy = c.offsetTop;
      c.setPointerCapture(e.pointerId);
      c.style.zIndex = ++z;
      c.classList.add("dragging");
      c.style.transform = `rotate(${c.dataset.r}deg) scale(1.06)`;
    });
    c.addEventListener("pointermove", e => {
      if (!active) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      const W = table.clientWidth - c.offsetWidth, H = table.clientHeight - c.offsetHeight;
      c.style.left = Math.min(Math.max(-20, ox + dx), W + 20) + "px";
      c.style.top = Math.min(Math.max(-20, oy + dy), H + 20) + "px";
    });
    const end = () => {
      if (!active) return;
      active = false;
      c.classList.remove("dragging");
      c.style.transform = `rotate(${c.dataset.r}deg)`;
      if (!moved) openLightbox(c.querySelector("img").src);
    };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", () => { active = false; c.classList.remove("dragging"); });
  });
}

function openLightbox(src) {
  const lb = $("#lightbox");
  $("img", lb).src = src;
  lb.hidden = false;
}
function setupLightbox() {
  const lb = $("#lightbox");
  lb.addEventListener("click", e => { if (e.target !== $("img", lb)) lb.hidden = true; });
  addEventListener("keydown", e => { if (e.key === "Escape") lb.hidden = true; });
}

/* ---------- coordenadas ---------- */
function setupDetails() {
  if (CONFIG.lugar) $('[data-cfg="lugar"]').textContent = CONFIG.lugar;
  if (CONFIG.direccion) $('[data-cfg="direccion"]').textContent = CONFIG.direccion;

  $$(".card.flip").forEach(c => {
    const flip = () => c.classList.toggle("flipped");
    c.addEventListener("click", flip);
    c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
  });

  const fmt = iso => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const where = [CONFIG.lugar, CONFIG.direccion].filter(Boolean).join(", ");
  const title = "Nata & Javi's Wedding 💍";
  const details = "We're getting married! Pisco sours, ceremony, spit-roasted lamb and dancing. " + location.href.split("#")[0];
  $("#gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(title) +
    "&dates=" + fmt(CONFIG.inicio) + "/" + fmt(CONFIG.fin) +
    "&details=" + encodeURIComponent(details) +
    "&location=" + encodeURIComponent(where);

  const maps = $("#maps");
  if (where) maps.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(where);
  else maps.addEventListener("click", e => { e.preventDefault(); toast("Address coming soon 📍"); });

  $("#ics").addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NataJavi//ES", "BEGIN:VEVENT",
      "UID:nata-javi-20261205@matri", "DTSTAMP:" + fmt(new Date().toISOString()),
      "DTSTART:" + fmt(CONFIG.inicio), "DTEND:" + fmt(CONFIG.fin),
      "SUMMARY:" + title, "DESCRIPTION:" + details, "LOCATION:" + where,
      "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", "DESCRIPTION:One week to go until the wedding!", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "matri-nata-javi.ics";
    a.click();
    toast("📅 Saved! You'll get a reminder a week before.");
  });
}

/* ---------- animaciones al hacer scroll ---------- */
function setupReveal() {
  $$(".heading, .cards, .menu, .rsvp, .bank, .memory").forEach(el => el.classList.add("reveal-on-scroll"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .15 });
  $$(".reveal-on-scroll, .timeline li").forEach(el => io.observe(el));

  const tl = $("#timeline");
  const onScroll = () => {
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / r.height));
    tl.style.setProperty("--progress", p);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- memorice ---------- */
function setupMemory() {
  const board = $("#memory");
  const movesEl = $("#moves"), timeEl = $("#time"), bestEl = $("#best"), win = $("#gameWin");
  let first = null, lock = false, moves = 0, found = 0, t0 = 0, timer = null;
  const best = () => { const b = store.get("nj-best"); bestEl.textContent = b ? b + " moves" : "—"; };
  best();

  const start = () => {
    board.innerHTML = ""; win.hidden = true;
    first = null; lock = false; moves = 0; found = 0; t0 = 0;
    clearInterval(timer); movesEl.textContent = 0; timeEl.textContent = "0:00";
    const deck = [...MEMORICE, ...MEMORICE].sort(() => Math.random() - .5);
    deck.forEach(src => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "mcard"; b.dataset.src = src;
      b.setAttribute("aria-label", "Card");
      b.innerHTML = `<div class="mi"><div class="mf"><svg viewBox="-115 -115 230 230"><use href="#flower"/></svg></div><div class="mb"><img src="${photo(src)}" alt=""></div></div>`;
      b.addEventListener("click", () => flip(b));
      board.appendChild(b);
    });
  };

  const flip = b => {
    if (lock || b === first || b.classList.contains("done")) return;
    if (!t0) { t0 = Date.now(); timer = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); timeEl.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }, 500); }
    b.classList.add("open");
    if (!first) { first = b; return; }
    moves++; movesEl.textContent = moves;
    if (first.dataset.src === b.dataset.src) {
      first.classList.add("done"); b.classList.add("done");
      const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 8);
      first = null; found++;
      if (found === MEMORICE.length) finish();
    } else {
      lock = true;
      const a = first; first = null;
      setTimeout(() => { a.classList.remove("open"); b.classList.remove("open"); lock = false; }, 850);
    }
  };

  const finish = () => {
    clearInterval(timer);
    const prev = +store.get("nj-best") || Infinity;
    if (moves < prev) store.set("nj-best", moves);
    best();
    win.hidden = false;
    win.textContent = moves <= 30
      ? `🎉 ${moves} moves in ${timeEl.textContent}! Show this to the couple and claim your pisco sour.`
      : `🎉 You did it in ${moves} moves! Under 30 wins a pisco sour… one more try?`;
    party({ particleCount: 200, spread: 120 });
  };

  $("#restart").addEventListener("click", start);
  start();
}

/* ---------- RSVP ---------- */
function setupRsvp() {
  const form = $("#rsvpForm");
  const sync = () => form.classList.toggle("not-going", form.va.value === "no");
  $$('input[name="va"]', form).forEach(r => r.addEventListener("change", () => { sync(); if (form.va.value === "si") party({ particleCount: 60 }); }));
  sync();

  $$(".stepper button", form).forEach(btn => btn.addEventListener("click", () => {
    const inp = btn.parentElement.querySelector("input");
    inp.value = Math.min(+inp.max, Math.max(+inp.min, (+inp.value || 0) + +btn.dataset.step));
  }));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    if (!nombre) { form.nombre.classList.add("invalid"); form.nombre.focus(); setTimeout(() => form.nombre.classList.remove("invalid"), 600); return; }
    const va = form.va.value === "si";
    const lines = va ? [
      `💍 *RSVP Nata & Javi's wedding* (EN)`,
      `✅ We're coming!`,
      `👤 ${nombre}`,
      `🧑 Adults: ${form.adultos.value}  ·  🧒 Kids: ${form.ninos.value}`,
      form.comida.value.trim() && `🍽️ Diet: ${form.comida.value.trim()}`,
      form.cancion.value.trim() && `🎶 Song: ${form.cancion.value.trim()}`,
      form.mensaje.value.trim() && `💌 ${form.mensaje.value.trim()}`,
    ] : [
      `💍 *RSVP Nata & Javi's wedding* (EN)`,
      `❌ ${nombre} can't make it 😢`,
      form.mensaje.value.trim() && `💌 ${form.mensaje.value.trim()}`,
    ];
    const text = lines.filter(Boolean).join("\n");
    guardar({
      tipo: "rsvp", nombre, va,
      adultos: va ? +form.adultos.value : 0, ninos: va ? +form.ninos.value : 0,
      comida: va ? form.comida.value.trim() : "", cancion: va ? form.cancion.value.trim() : "",
      mensaje: form.mensaje.value.trim(),
    });
    if (va) party({ particleCount: 220, spread: 120 });
    toast(va ? "Yay! Opening WhatsApp…" : "We'll miss you 💜");
    setTimeout(() => open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank"), 700);
  });
}

/* ---------- regalos ---------- */
function setupGifts() {
  const wrap = $("#gifts");
  const qty = CONFIG.regalos.map(() => 0);
  let libre = 0;

  CONFIG.regalos.forEach((g, i) => {
    const el = document.createElement("article");
    el.className = "gift";
    el.innerHTML = g.libre
      ? `<span class="g-ico">${g.ico}</span><h3>${g.t}</h3><p>${g.d}</p>
         <input class="free" type="text" inputmode="numeric" placeholder="$ amount in CLP" aria-label="Amount">`
      : `<span class="g-ico">${g.ico}</span><h3>${g.t}</h3><p>${g.d}</p>
         <div class="g-foot"><span class="price">${clp(g.p)}</span>
         <div class="qty"><button type="button" data-d="-1" aria-label="Remove">−</button><b>0</b><button type="button" data-d="1" aria-label="Add">+</button></div></div>`;
    wrap.appendChild(el);
    if (g.libre) {
      const inp = $("input", el);
      inp.addEventListener("input", () => {
        libre = +inp.value.replace(/\D/g, "") || 0;
        inp.value = libre ? libre.toLocaleString("en-US") : "";
        el.classList.toggle("sel", libre > 0);
        update();
      });
    } else {
      $$("button", el).forEach(b => b.addEventListener("click", e => {
        qty[i] = Math.max(0, qty[i] + +b.dataset.d);
        $("b", el).textContent = qty[i];
        el.classList.toggle("sel", qty[i] > 0);
        if (+b.dataset.d > 0) burst(e.clientX, e.clientY, 6);
        update();
      }));
    }
  });

  const update = () => {
    const total = CONFIG.regalos.reduce((s, g, i) => s + g.p * qty[i], 0) + libre;
    $("#giftTotal").textContent = clp(total);
    $("#giftSend").disabled = total === 0;
    return total;
  };

  $("#giftSend").addEventListener("click", () => {
    const items = CONFIG.regalos.map((g, i) => qty[i] ? `• ${g.ico} ${g.t} x${qty[i]}` : null).filter(Boolean);
    if (libre) items.push(`• 💌 Any amount ${clp(libre)}`);
    const nameEl = $("#giftName"), nombre = nameEl.value.trim();
    if (!nombre) { nameEl.classList.remove("invalid"); void nameEl.offsetWidth; nameEl.classList.add("invalid"); nameEl.focus(); toast("Tell us who you are 😊"); return; }
    const total = update();
    const text = `🎁 *Gift for Nata & Javi* (EN)\nFrom: ${nombre}\n${items.join("\n")}\nTotal: ${clp(total)} CLP\n\n(Sending the transfer!)`;
    guardar({ tipo: "regalo", nombre, regalos: items.join("\n").replace(/• /g, ""), total, mensaje: "" });
    party({ particleCount: 120 });
    open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  });

  $("#copyBank").addEventListener("click", async () => {
    const txt = BANCO.map(([k, v]) => `${BANK_EN[k] || k}: ${BANK_VAL_EN[v] || v}`).join("\n");
    try { await navigator.clipboard.writeText(txt); toast("📋 Details copied"); }
    catch { toast("Couldn't copy, please copy them by hand 🙏"); }
  });
}

function renderBank() {
  $("#bankData").innerHTML = BANCO.map(([k, v]) => `<dt>${BANK_EN[k] || k}</dt><dd>${BANK_VAL_EN[v] || v}</dd>`).join("");
}

/* ---------- pétalos al tocar ---------- */
function setupClickPetals() {
  document.addEventListener("click", e => {
    if (e.target.closest("button, a, input, textarea, label, .polaroid, .mcard, .lightbox")) return;
    burst(e.clientX, e.clientY, 7);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupIntro();
  setupCountdown();
  setupAmp();
  setupNav();
  setupLightbox();
  setupDetails();
  setupReveal();
  setupRsvp();
  setupGifts();
  setupClickPetals();
});
