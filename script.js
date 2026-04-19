// =========================
// 🧠 STATE
// =========================
let mode = "learning";
let view = "books";

let activeEpochs = new Set(["młoda polska", "romantyzm", "pozytywizm"]);

let score = 0;
let selectedBook = null;
let selectedMotif = null;
let solvedPairs = new Set();
let quizStarted = false;

// =========================
// 📚 DATA
// =========================
const data = {
  books: [
    {
      id: "wesele",
      title: "Wesele",
      description: "Symboliczny dramat Wyspiańskiego",
      epoch: "młoda polska",
      motifs: ["motywnarodowy", "symbolizm", "ludomania"]
    },
    {
      id: "chłopi",
      title: "Chłopi",
      description: "Powieść Reymonta",
      epoch: "młoda polska",
      motifs: ["naturalizm", "motywmiłości"]
    }
  ],

  motifs: [
    {
      id: "motywnarodowy",
      name: "Motyw Narodowy",
      description: "Kondycja narodu",
      books: ["wesele"]
    },
    {
      id: "symbolizm",
      name: "Symbolizm",
      description: "Znaczenia ukryte",
      books: ["wesele"]
    },
    {
      id: "ludomania",
      name: "Ludomania",
      description: "Fascynacja wsią",
      books: ["wesele"]
    },
    {
      id: "naturalizm",
      name: "Naturalizm",
      description: "Determinacja biologiczna",
      books: ["chłopi"]
    },
    {
      id: "motywmiłości",
      name: "Motyw Miłości",
      description: "Relacje miłosne",
      books: ["chłopi"]
    }
  ]
};

const epochs = ["młoda polska", "pozytywizm", "romantyzm"];

// =========================
// 🧭 NAV
// =========================
function goScreen(n) {
  hideAll();
  if (n === 1) document.getElementById("screen-start").style.display = "block";
  if (n === 2) document.getElementById("screen-mode").style.display = "block";
  if (n === 3) {
    document.getElementById("screen-epoch").style.display = "block";
    renderEpochFilter();
  }
}

function hideAll() {
  ["screen-start","screen-mode","screen-epoch","map","quiz","profile"]
    .forEach(id => document.getElementById(id).style.display = "none");
}

// =========================
// SETTINGS
// =========================
function setMode(m){ mode = m; }
function setView(v){ view = v; }

// =========================
// START
// =========================
function startApp() {
  hideAll();

  if (mode === "learning") {
    document.getElementById("map").style.display = "block";
    renderMap();
  }

  if (mode === "quiz") {
    document.getElementById("quiz").style.display = "block";

    if (!quizStarted) {
      quizStarted = true;
      renderQuiz();
    }
  }
}

// =========================
// MAPA
// =========================
function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");

  list.innerHTML = "";

  const books = getFilteredBooks();

  if (view === "books") {
    title.innerText = "📚 Lektury";

    books.forEach(b => {
      list.innerHTML += `
        <div onclick="openBook('${b.id}')"
             style="padding:10px;margin:5px;border:1px solid #ccc;cursor:pointer">
          ${b.title}
        </div>
      `;
    });
  }

  if (view === "motifs") {
    title.innerText = "🎯 Motywy";

    getFilteredMotifs().forEach(m => {
      list.innerHTML += `
        <div onclick="openMotif('${m.id}')"
             style="padding:10px;margin:5px;border:1px solid #ccc;cursor:pointer">
          ${m.name}
        </div>
      `;
    });
  }
}

// =========================
// FILTERS
// =========================
function getFilteredBooks() {
  return data.books.filter(b => activeEpochs.has(b.epoch));
}

function getFilteredMotifs() {
  const map = new Map();

  getFilteredBooks().forEach(book => {
    book.motifs.forEach(id => {
      const key = `${book.id}|${id}`;
      if (solvedPairs.has(key)) return;

      const m = data.motifs.find(x => x.id === id);
      if (m) map.set(m.id, m);
    });
  });

  return [...map.values()];
}

// =========================
// QUIZ
// =========================
function renderQuiz() {
  const books = getFilteredBooks();
  const motifs = getFilteredMotifs();

  const el = document.getElementById("quiz-content");

  el.innerHTML = `
    <h3>Score: ${score}</h3>

    <div style="display:flex; gap:40px;">
      <div id="q-books"></div>
      <div id="q-motifs"></div>
    </div>
  `;

  const bEl = document.getElementById("q-books");
  const mEl = document.getElementById("q-motifs");

  books.forEach(b => {
    bEl.innerHTML += `
      <div onclick="selectBook('${b.id}')"
           style="padding:10px;border:1px solid #ccc;margin:5px">
        ${b.title}
      </div>
    `;
  });

  motifs.forEach(m => {
    mEl.innerHTML += `
      <div onclick="selectMotif('${m.id}')"
           style="padding:10px;border:1px solid #ccc;margin:5px">
        ${m.name}
      </div>
    `;
  });
}

function selectBook(id){
  selectedBook = id;
  tryMatch();
}

function selectMotif(id){
  selectedMotif = id;
  tryMatch();
}

function tryMatch(){
  if(!selectedBook || !selectedMotif) return;

  const book = data.books.find(b => b.id === selectedBook);

  const ok = book.motifs.includes(selectedMotif);
  const key = `${selectedBook}|${selectedMotif}`;

  if(ok && !solvedPairs.has(key)){
    score += 100;
    solvedPairs.add(key);
  } else {
    score -= 50;
  }

  selectedBook = null;
  selectedMotif = null;

  renderQuiz();
}

// =========================
// PROFILE
// =========================
function openBook(id){
  const b = data.books.find(x=>x.id===id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${b.title}</h2>
    <p>${b.description}</p>
  `;
}

function openMotif(id){
  const m = data.motifs.find(x=>x.id===id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${m.name}</h2>
    <p>${m.description}</p>
  `;
}

function backToQuiz(){
  hideAll();
  document.getElementById("quiz").style.display = "block";
  renderQuiz();
}

// =========================
// EPOCHS
// =========================
function renderEpochFilter(){
  const el = document.getElementById("epochFilter");
  el.innerHTML = "";

  epochs.forEach(e=>{
    el.innerHTML += `
      <label>
        <input type="checkbox"
          ${activeEpochs.has(e) ? "checked":""}
          onchange="toggleEpoch('${e}')">
        ${e}
      </label>
    `;
  });
}

function toggleEpoch(e){
  activeEpochs.has(e)
    ? activeEpochs.delete(e)
    : activeEpochs.add(e);
}

