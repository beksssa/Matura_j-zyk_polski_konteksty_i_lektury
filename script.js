// =========================
// STATE
// =========================
let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska","pozytywizm","romantyzm","antyk","współczesność","renesans"]);

const focus = document.getElementById("focus-layer");

// =========================
// SCREENS (RENDER)
// =========================

function renderStart() {
  focus.innerHTML = `
  <div class="screen">
    <h2>📚 Matura Polski</h2>
    <p>Wybierz tryb</p>
    <button onclick="setMode('learning')">Nauka</button>
    <button onclick="setMode('quiz')">Ćwiczenia</button>
    <br><br>
    <button onclick="renderMode()">Dalej</button>
  </div>`;
}

function renderMode() {
  focus.innerHTML = `
  <div class="screen">
    <h2>Zakres</h2>
    <button onclick="setView('books')">Lektury</button>
    <button onclick="setView('motifs')">Motywy</button>
    <br><br>
    <button onclick="renderEpoch()">Dalej</button>
    <button class="secondary" onclick="renderStart()">Wstecz</button>
  </div>`;
}

function renderEpoch() {
  focus.innerHTML = `
  <div class="screen">
    <h2>Filtr epok</h2>
    ${renderEpochCheckboxes()}
    <br><br>
    <button onclick="startApp()">START</button>
    <button class="secondary" onclick="renderMode()">Wstecz</button>
  </div>`;
}

function renderEpochCheckboxes() {
  const epochs = ["młoda polska","pozytywizm","romantyzm","antyk","współczesność","renesans"];
  return epochs.map(e => `
    <label>
      <input type="checkbox" ${activeEpochs.has(e) ? "checked" : ""}
      onchange="toggleEpoch('${e}')"> ${e}
    </label><br>
  `).join("");
}

function renderMap() {
  focus.innerHTML = `
  <div class="screen">
    <h2>${view === "books" ? "📚 Lektury" : "🎯 Motywy"}</h2>
    <p>(tu później wstawimy listę)</p>
    <button onclick="renderStart()">Menu</button>
  </div>`;
}

function renderQuiz() {
  focus.innerHTML = `
  <div class="screen">
    <h2>Ćwiczenia</h2>
    <p>(tu silnik quizu)</p>
    <button onclick="renderStart()">Koniec</button>
  </div>`;
}

// =========================
// FLOW
// =========================

function setMode(m) {
  mode = m;
}

function setView(v) {
  view = v;
}

function toggleEpoch(e) {
  activeEpochs.has(e) ? activeEpochs.delete(e) : activeEpochs.add(e);
}

function startApp() {
  if (mode === "learning") renderMap();
  else renderQuiz();
}

// =========================
// BACKGROUND
// =========================

const bgLayer = document.getElementById("bg-layer");
const bgItems = [];

function initBackground() {
  const words = ["Wesele","Antygona","Motyw","Symbolizm","Fatum","Miłość","Naród"];

  words.forEach(word => {
    const el = document.createElement("div");
    el.className = "bg-item";
    el.innerText = word;

    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let vx = (Math.random() - 0.5) * 0.2;
    let vy = (Math.random() - 0.5) * 0.2;

    bgItems.push({el,x,y,vx,vy});
    bgLayer.appendChild(el);
  });

  animateBG();
}

function animateBG() {
  bgItems.forEach(i => {
    i.x += i.vx;
    i.y += i.vy;

    if (i.x < 0 || i.x > window.innerWidth) i.vx *= -1;
    if (i.y < 0 || i.y > window.innerHeight) i.vy *= -1;

    i.el.style.transform = `translate(${i.x}px,${i.y}px)`;
  });

  requestAnimationFrame(animateBG);
}

// =========================
// INIT
// =========================

window.onload = () => {
  initBackground();
  renderStart();
};
