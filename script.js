// 🧠 STATE
let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska"]);

let score = 0;
let selectedBook = null;
let selectedMotif = null;
let solvedPairs = new Set();
let quizInitialized = false;

// 📚 DATA
const data = {
  books: [
    {
      id: "wesele",
      title: "Wesele",
      description: "Diagnoza społeczeństwa polskiego (niemoc narodowa), symbolizm (zjawy jako uosobienie lęków i marzeń), marazm narodowy (chocholi taniec), rozbicie mitu ludomanii oraz prywata kontra sprawa narodowa",
      epoch: "młoda polska",
      motifs: ["motywnarodowy", "symbolizm", "ludomania"]
    },
    {
      id: "chłopi",
      title: "Chłopi",
      description: "realistyczna powieść ukazująca życie wiejskiej społeczności podporządkowane rytmowi natury, pracy i tradycji.",
      epoch: "młoda polska",
      motifs: ["naturalizm", "motywmiłości"]
    }
  ],

  motifs: [
    {
      id: "motywnarodowy",
      name: "Motyw Narodowy",
      description: "Promlematyka kondycji narodu",
      books: ["wesele"]
    },
    {
      id: "symbolizm",
      name: "Symbolizm",
      description: "Posługiwanie się wieloznacznymi obrazami do wyrażania stanów duszy i treści niewyrażalnych wprost",
      books: ["wesele"]
    },
    {
      id: "ludomania",
      name: "Ludomania",
      description: "Powierzchowna fascynacja wsią i życiem chłopów jako źródłem pierwotnej energii",
      books: ["wesele"]
    },
    {
      id: "naturalizm",
      name: "Naturalizm",
      description: "Ukazanie człowieka jako istoty zdeterminowanej przez biologię, instynkty i walkę o byt",
      books: ["chłopi"]
    },
    {
      id: "motywmiłości",
      name: "Motyw Miłości",
      description: "przestawienie relacji miłosnej",
      books: ["chłopi"]
    }
  ]
};

const epochs = ["młoda polska", "pozytywizm", "romantyzm"];

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

function setMode(m) {
  mode = m;
}

function setView(v) {
  view = v;
}

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

    if (!quizInitialized) {
      initQuiz();
      quizInitialized = true;
    } else {
      renderQuiz();
    }
  }
}

// =========================
// QUIZ INIT
// =========================

function initQuiz() {
  score = 0;
  solvedPairs = new Set();
  selectedBook = null;
  selectedMotif = null;

  renderScore();
  renderQuiz();
}

// =========================
// SCORE
// =========================

function renderScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}

// =========================
// QUIZ RENDER
// =========================

function renderQuiz() {
  const el = document.getElementById("quiz-content");
  el.innerHTML = "";

  const books = getFilteredBooks();
  const motifs = getFilteredMotifs();

  // 📚 BOOKS
  books.forEach(b => {
    if (solvedPairs.has(b.id)) return;

    const div = document.createElement("div");
    div.innerHTML = `
      <div style="padding:8px;border:1px solid black;margin:5px;cursor:pointer"
           onclick="selectBook('${b.id}')">
        📚 ${b.title}
      </div>
    `;
    el.appendChild(div);
  });

  // 🎯 MOTIFS
  motifs.forEach(m => {
    if (solvedPairs.has(m.id)) return;

    const div = document.createElement("div");
    div.innerHTML = `
      <div style="padding:8px;border:1px solid blue;margin:5px;cursor:pointer"
           onclick="selectMotif('${m.id}')">
        🎯 ${m.name}
      </div>
    `;
    el.appendChild(div);
  });
}

// =========================
// MATCHING
// =========================

function selectBook(id) {
  selectedBook = id;
  tryMatch();
}

function selectMotif(id) {
  selectedMotif = id;
  tryMatch();
}

function tryMatch() {
  if (!selectedBook || !selectedMotif) return;

  const book = data.books.find(b => b.id === selectedBook);

  if (book.motifs.includes(selectedMotif)) {
    score += 100;
    solvedPairs.add(selectedBook);
    solvedPairs.add(selectedMotif);
  } else {
    score -= 50;
  }

  selectedBook = null;
  selectedMotif = null;

  renderScore();
  renderQuiz();
}

// =========================
// FILTERS
// =========================

function getFilteredBooks() {
  return data.books.filter(b => activeEpochs.has(b.epoch));
}

function getFilteredMotifs() {
  const books = getFilteredBooks();
  const map = new Map();

  books.forEach(book => {
    book.motifs.forEach(id => {
      const m = data.motifs.find(x => x.id === id);
      if (m) map.set(m.id, m);
    });
  });

  return [...map.values()];
}

// =========================
// EPOCH FILTER
// =========================

function renderEpochFilter() {
  const el = document.getElementById("epochFilter");
  el.innerHTML = "";

  epochs.forEach(e => {
    el.innerHTML += `
      <label>
        <input type="checkbox"
          ${activeEpochs.has(e) ? "checked" : ""}
          onchange="toggleEpoch('${e}')">
        ${e}
      </label>
      <br>
    `;
  });
}

function toggleEpoch(epoch) {
  activeEpochs.has(epoch)
    ? activeEpochs.delete(epoch)
    : activeEpochs.add(epoch);
}

// =========================
// MAPA + PROFILE (bez zmian logicznych)
// =========================

function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");

  list.innerHTML = "";

  if (view === "books") {
    title.innerText = "📚 Lektury";

    getFilteredBooks().forEach(b => {
      list.innerHTML += `
        <div onclick="openBook('${b.id}')" style="padding:10px;border:1px solid #ccc;cursor:pointer">
          📚 ${b.title}
        </div>
      `;
    });
  }

  if (view === "motifs") {
    title.innerText = "🎯 Motywy";

    getFilteredMotifs().forEach(m => {
      list.innerHTML += `
        <div onclick="openMotif('${m.id}')" style="padding:10px;border:1px solid #ccc;cursor:pointer">
          🎯 ${m.name}
        </div>
      `;
    });
  }
}

function openBook(id) {
  const book = data.books.find(b => b.id === id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.description}</p>
  `;
}

function openMotif(id) {
  const motif = data.motifs.find(m => m.id === id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${motif.name}</h2>
    <p>${motif.description}</p>
  `;
}

function goMap() {
  hideAll();
  document.getElementById("map").style.display = "block";
  renderMap();
}
