// 🧠 STATE
let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska"]);

let score = 0;
let selectedBook = null;
let selectedMotif = null;
let solvedPairs = new Set();
let scoredPairs = new Set();
let masteredPairs = new Set();
let quizSnapshot = null;

let taskQueue = [];
let currentTask = null;
const taskTypes = ["X", "Y", "Z"];



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
  ["screen-start", "screen-mode", "screen-epoch", "map", "quiz", "profile"]
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
// START APP
// =========================

function startApp() {
  hideAll();

  if (mode === "learning") {
    document.getElementById("map").style.display = "block";
    renderMap();
  }

  if (mode === "quiz") {
    document.getElementById("quiz").style.display = "block";
    startQuiz();
  }
}


// =========================
// QUIZ START
// =========================

function startQuiz() {
  score = 0;
  selectedBook = null;
  selectedMotif = null;
  solvedPairs = new Set();
  scoredPairs = new Set();

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
    el.innerHTML += `
      <div style="padding:8px;border:1px solid black;margin:5px;display:flex;justify-content:space-between;align-items:center">

        <span onclick="selectBook('${b.id}')">
          📚 ${b.title}
        </span>

        <span title="Dowiedz się więcej"
              style="cursor:pointer"
              onclick="openBook('${b.id}')">
          📖
        </span>

      </div>
    `;
  });

  el.innerHTML += `<hr>`;

  // 🎯 MOTIFS
  motifs.forEach(m => {
    el.innerHTML += `
      <div style="padding:8px;border:1px solid blue;margin:5px;display:flex;justify-content:space-between;align-items:center">

        <span onclick="selectMotif('${m.id}')">
          🎯 ${m.name}
        </span>

        <span title="Dowiedz się więcej"
              style="cursor:pointer"
              onclick="openMotif('${m.id}')">
          📖
        </span>

      </div>
    `;
  });
}


// =========================
// MATCH LOGIC
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

  const pairKey = `${selectedBook}-${selectedMotif}`;
  const reverseKey = `${selectedMotif}-${selectedBook}`;

  const book = data.books.find(b => b.id === selectedBook);
  const isCorrect = book.motifs.includes(selectedMotif);

  if (!scoredPairs.has(pairKey) && !scoredPairs.has(reverseKey)) {

    if (isCorrect) {
      score += 100;
      masteredPairs.add(pairKey);
    } else {
      score -= 50;
    }

    scoredPairs.add(pairKey);
    scoredPairs.add(reverseKey);
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
// MAP (optional learning mode)
// =========================

function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");

  list.innerHTML = "";

  if (view === "books") {
    title.innerText = "📚 Lektury";

    getFilteredBooks().forEach(b => {
      list.innerHTML += `<div>${b.title}</div>`;
    });
  }

  if (view === "motifs") {
    title.innerText = "🎯 Motywy";

    getFilteredMotifs().forEach(m => {
      list.innerHTML += `<div>${m.name}</div>`;
    });
  }
}


// =========================
// PROFILE
// =========================

function openBook(id) {
  quizSnapshot = saveQuizState();

  const book = data.books.find(b => b.id === id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.description}</p>
    <button onclick="returnToQuiz()">⬅ Powrót do ćwiczeń</button>
  `;
}

function openMotif(id) {
  quizSnapshot = saveQuizState();

  const motif = data.motifs.find(m => m.id === id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${motif.name}</h2>
    <p>${motif.description}</p>
    <button onclick="returnToQuiz()">⬅ Powrót do ćwiczeń</button>
  `;
}

function returnToQuiz() {
  hideAll();
  document.getElementById("quiz").style.display = "block";
  restoreQuizState();
}


// =========================
// STATE SAVE/RESTORE
// =========================

function saveQuizState() {
  return {
    score,
    selectedBook,
    selectedMotif,
    solvedPairs: new Set([...solvedPairs]),
    scoredPairs: new Set([...scoredPairs]),
    masteredPairs: new Set([...masteredPairs])
  };
}

function restoreQuizState() {
  if (!quizSnapshot) return;

  score = quizSnapshot.score;
  selectedBook = quizSnapshot.selectedBook;
  selectedMotif = quizSnapshot.selectedMotif;
  solvedPairs = new Set(quizSnapshot.solvedPairs);
  scoredPairs = new Set(quizSnapshot.scoredPairs);
  masteredPairs = new Set(quizSnapshot.masteredPairs);

  renderScore();
  renderQuiz();
}


// =========================
// BLOCK CHECK
// =========================

function isBlockedPair(bookId, motifId) {
  return masteredPairs.has(`${bookId}-${motifId}`);
}


// =========================
// MAP RETURN
// =========================

function goMap() {
  hideAll();
  document.getElementById("map").style.display = "block";
  renderMap();
}

function generateTaskQueue() {
  taskQueue = shuffle([...taskTypes]); // np. X,Y,Z w losowej kolejności
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function nextTask() {
  currentTask = taskQueue.shift();

  if (!currentTask) {
    generateTaskQueue(); // restart pętli
    currentTask = taskQueue.shift();
  }

  renderTask();
}
