// =========================
// 🧠 STATE
// =========================

let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska"]);

let score = 0;

// diagnostic state
let quizMode = "diagnostic"; // "diagnostic" or "engine"
let selectedBook = null;
let selectedMotif = null;
let scoredPairs = new Set();
let masteredPairs = new Set();

// engine state
let answered = false;
let currentTaskType = null;
let currentTaskData = null;
let currentTask = null;

// profile / snapshot state
let quizSnapshot = null;
let profileReturnTarget = "map";

// engine task registry
const ENGINE_TASK_TYPES = ["X", "Y1", "Y2"];
const ENGINE_TASK_ENABLED = {
  X: true,
  Y1: false,
  Y2: false,
};

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
      description: "Realistyczna powieść ukazująca życie wiejskiej społeczności podporządkowane rytmowi natury, pracy i tradycji.",
      epoch: "młoda polska",
      motifs: ["naturalizm", "motywmiłości"]
    }
  ],

  motifs: [
    {
      id: "motywnarodowy",
      name: "Motyw Narodowy",
      description: "Problematyka kondycji narodu",
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
      description: "Przedstawienie relacji miłosnej",
      books: ["chłopi"]
    }
  ]
};

const epochs = ["młoda polska", "pozytywizm", "romantyzm"];

// =========================
// HELPERS
// =========================

function clone(value) {
  return value === null || value === undefined
    ? value
    : JSON.parse(JSON.stringify(value));
}

function pickRandom(items) {
  if (!items || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function makePairKey(bookId, motifId) {
  return [`book:${bookId}`, `motif:${motifId}`].sort().join("|");
}

function isMasteredPair(bookId, motifId) {
  return masteredPairs.has(makePairKey(bookId, motifId));
}

function isScoredPair(bookId, motifId) {
  return scoredPairs.has(makePairKey(bookId, motifId));
}

function getBookById(id) {
  return data.books.find(b => b.id === id) || null;
}

function getMotifById(id) {
  return data.motifs.find(m => m.id === id) || null;
}

function availableTaskTypes() {
  return ENGINE_TASK_TYPES.filter(type => ENGINE_TASK_ENABLED[type]);
}

// =========================
// SCREEN CONTROL
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
    return;
  }

  if (mode === "quiz") {
    document.getElementById("quiz").style.display = "block";
    startQuiz();
  }
}

// =========================
// QUIZ START (DIAGNOSTIC FIRST)
// =========================

function startQuiz() {
  score = 0;

  quizMode = "diagnostic";
  selectedBook = null;
  selectedMotif = null;
  scoredPairs = new Set();
  masteredPairs = new Set();

  answered = false;
  currentTaskType = null;
  currentTaskData = null;
  currentTask = null;

  renderScore();
  renderDiagnostic();
}

// =========================
// DIAGNOSTIC
// =========================

function renderDiagnostic() {
  const el = document.getElementById("quiz-content");
  const books = getFilteredBooks();
  const motifs = getFilteredMotifs();

  document.getElementById("nextBtn").style.display = "inline-block";

  el.innerHTML = `
    <p class="small-note">Połącz jak największą ilość zagadnień z lekturami</p>

    <div class="diagnostic-layout">
      <div>
        <h3>Lektury</h3>
        ${books.map(renderDiagnosticBook).join("")}
      </div>

      <div>
        <h3>Motywy</h3>
        ${motifs.map(renderDiagnosticMotif).join("")}
      </div>
    </div>
  `;
}

function renderDiagnosticBook(book) {
  const selectedClass = selectedBook === book.id ? "selected" : "";
  return `
    <div class="quiz-item ${selectedClass}">
      <div class="item-main" onclick="selectDiagnosticBook('${book.id}')">
        📚 ${book.title}
      </div>

      <button
        type="button"
        class="icon-btn"
        title="Dowiedz się więcej"
        onclick="event.stopPropagation(); openBook('${book.id}')">
        📖
      </button>
    </div>
  `;
}

function renderDiagnosticMotif(motif) {
  const selectedClass = selectedMotif === motif.id ? "selected" : "";
  return `
    <div class="quiz-item ${selectedClass}">
      <div class="item-main" onclick="selectDiagnosticMotif('${motif.id}')">
        🎯 ${motif.name}
      </div>

      <button
        type="button"
        class="icon-btn"
        title="Dowiedz się więcej"
        onclick="event.stopPropagation(); openMotif('${motif.id}')">
        📖
      </button>
    </div>
  `;
}

function selectDiagnosticBook(id) {
  if (quizMode !== "diagnostic") return;
  selectedBook = id;
  tryDiagnosticMatch();
  renderDiagnostic();
}

function selectDiagnosticMotif(id) {
  if (quizMode !== "diagnostic") return;
  selectedMotif = id;
  tryDiagnosticMatch();
  renderDiagnostic();
}

function tryDiagnosticMatch() {
  if (!selectedBook || !selectedMotif) return;

  const book = getBookById(selectedBook);
  if (!book) return;

  const pairKey = makePairKey(selectedBook, selectedMotif);
  const isCorrect = book.motifs.includes(selectedMotif);

  if (!isScoredPair(selectedBook, selectedMotif)) {
    if (isCorrect) {
      score += 100;
      masteredPairs.add(pairKey);
    } else {
      score -= 50;
    }

    scoredPairs.add(pairKey);
  }

  selectedBook = null;
  selectedMotif = null;

  renderScore();
}

function finishDiagnosticAndStartEngine() {
  startEngine();
}

// =========================
// ENGINE
// =========================

function startEngine() {
  quizMode = "engine";
  answered = false;
  currentTaskType = null;
  currentTaskData = null;
  currentTask = null;

  document.getElementById("nextBtn").style.display = "none";
  renderEngineNextTask();
}

function renderEngineNextTask() {
  answered = false;
  document.getElementById("nextBtn").style.display = "none";

  const type = getNextTaskType();
  if (!type) {
    document.getElementById("quiz-content").innerHTML = `
      <div class="task-card">
        <h2>Brak aktywnych typów zadań</h2>
        <p>Włącz przynajmniej jeden typ w ENGINE_TASK_ENABLED.</p>
      </div>
    `;
    return;
  }

  currentTaskType = type;
  currentTask = createTaskByType(type);
  currentTaskData = clone(currentTask.data);

  currentTask.render();
}

function getNextTaskType() {
  const types = availableTaskTypes();
  return pickRandom(types);
}

function nextTask() {
  if (quizMode === "diagnostic") {
    finishDiagnosticAndStartEngine();
    return;
  }

  if (quizMode === "engine") {
    renderEngineNextTask();
  }
}

function createTaskByType(type, presetData = null) {
  if (type === "X") return createTaskX(presetData);
  if (type === "Y1") return createTaskY1(presetData);
  if (type === "Y2") return createTaskY2(presetData);
  return createTaskX(presetData);
}

// =========================
// TASK X
// =========================

function getTaskXPromptCandidates() {
  if (view === "motifs") {
    const motifs = getFilteredMotifs();
    const available = motifs.filter(motif => motif.books.some(bookId => !isMasteredPair(bookId, motif.id)));
    return available.length ? available : motifs;
  }

  const books = getFilteredBooks();
  const available = books.filter(book => book.motifs.some(motifId => !isMasteredPair(book.id, motifId)));
  return available.length ? available : books;
}

function createTaskX(presetData = null) {
  const dataObj = presetData || buildTaskXData();
  return {
    type: "X",
    data: dataObj,
    render() {
      renderTaskX(this.data);
      attachTaskXSwipeHandlers();
    },
    submit(side) {
      const correct = side === this.data.correctSide;

      if (correct) {
        score += 25;
        if (this.data.promptType === "book" && this.data.correctMotifId) {
          masteredPairs.add(makePairKey(this.data.promptId, this.data.correctMotifId));
        }
        if (this.data.promptType === "motif" && this.data.correctBookId) {
          masteredPairs.add(makePairKey(this.data.correctBookId, this.data.promptId));
        }
      }

      renderScore();
      document.getElementById("nextBtn").style.display = "inline-block";
      renderTaskX(this.data, true);
    }
  };
}

function buildTaskXData() {
  if (view === "motifs") {
    const motifCandidates = getTaskXPromptCandidates();
    const promptMotif = pickRandom(motifCandidates);
    if (!promptMotif) {
      return fallbackTaskXData();
    }

    const correctBooks = promptMotif.books
      .map(getBookById)
      .filter(Boolean)
      .filter(book => !isMasteredPair(book.id, promptMotif.id));

    const allCorrectBooks = promptMotif.books
      .map(getBookById)
      .filter(Boolean);

    const correctBook = pickRandom(correctBooks.length ? correctBooks : allCorrectBooks);
    if (!correctBook) {
      return fallbackTaskXData();
    }

    let wrongBooks = getFilteredBooks().filter(book => !promptMotif.books.includes(book.id) && book.id !== correctBook.id);
    if (!wrongBooks.length) {
      wrongBooks = getFilteredBooks().filter(book => book.id !== correctBook.id);
    }

    let wrongBook = pickRandom(wrongBooks);
    if (!wrongBook) {
      const anyOtherBook = getFilteredBooks().find(book => book.id !== correctBook.id);
      wrongBook = anyOtherBook || null;
    }

    if (!wrongBook || wrongBook.id === correctBook.id) {
      return fallbackTaskXData();
    }

    const correctLeft = Math.random() < 0.5;

    return {
      promptType: "motif",
      promptId: promptMotif.id,
      promptTitle: promptMotif.name,
      promptDescription: promptMotif.description,
      optionType: "book",
      leftId: correctLeft ? correctBook.id : wrongBook.id,
      rightId: correctLeft ? wrongBook.id : correctBook.id,
      correctSide: correctLeft ? "left" : "right",
      correctBookId: correctBook.id,
    };
  }

  const bookCandidates = getTaskXPromptCandidates();
  const promptBook = pickRandom(bookCandidates);
  if (!promptBook) {
    return fallbackTaskXData();
  }

  const correctMotifs = promptBook.motifs
    .map(getMotifById)
    .filter(Boolean)
    .filter(motif => !isMasteredPair(promptBook.id, motif.id));

  const allCorrectMotifs = promptBook.motifs
    .map(getMotifById)
    .filter(Boolean);

  const correctMotif = pickRandom(correctMotifs.length ? correctMotifs : allCorrectMotifs);
  if (!correctMotif) {
    return fallbackTaskXData();
  }

  let wrongMotifs = getFilteredMotifs().filter(motif => !promptBook.motifs.includes(motif.id) && motif.id !== correctMotif.id);
  if (!wrongMotifs.length) {
    wrongMotifs = getFilteredMotifs().filter(motif => motif.id !== correctMotif.id);
  }

  let wrongMotif = pickRandom(wrongMotifs);
  if (!wrongMotif) {
    const anyOtherMotif = getFilteredMotifs().find(motif => motif.id !== correctMotif.id);
    wrongMotif = anyOtherMotif || null;
  }

  if (!wrongMotif || wrongMotif.id === correctMotif.id) {
    return fallbackTaskXData();
  }

  const correctLeft = Math.random() < 0.5;

  return {
    promptType: "book",
    promptId: promptBook.id,
    promptTitle: promptBook.title,
    promptDescription: promptBook.description,
    optionType: "motif",
    leftId: correctLeft ? correctMotif.id : wrongMotif.id,
    rightId: correctLeft ? wrongMotif.id : correctMotif.id,
    correctSide: correctLeft ? "left" : "right",
    correctMotifId: correctMotif.id,
  };
}

function fallbackTaskXData() {
  const book = getFilteredBooks()[0];
  const motif = getFilteredMotifs()[0];

  return {
    promptType: view === "motifs" ? "motif" : "book",
    promptId: view === "motifs" ? (motif ? motif.id : null) : (book ? book.id : null),
    promptTitle: view === "motifs" ? (motif ? motif.name : "Brak motywu") : (book ? book.title : "Brak lektury"),
    promptDescription: "",
    optionType: view === "motifs" ? "book" : "motif",
    leftId: null,
    rightId: null,
    correctSide: "left",
    correctBookId: null,
    correctMotifId: null,
    fallback: true
  };
}

function renderTaskX(taskData, answeredState = false) {
  const el = document.getElementById("quiz-content");

  if (taskData.fallback) {
    el.innerHTML = `
      <div class="task-card">
        <h2>Brak dostępnych par</h2>
        <p>W wybranym zakresie nie ma już sensownej pary do pokazania.</p>
      </div>
    `;
    return;
  }

  const promptHtml = `
    <div class="task-head">
      ${taskData.promptType === "book" ? "📚" : "🎯"} ${taskData.promptTitle}
      ${
        answeredState
          ? `<button class="icon-btn task-profile-icon" title="Dowiedz się więcej" onclick="openCurrentTaskProfile()">📖</button>`
          : ""
      }
    </div>
  `;

  const imagePlaceholder = `
    <div class="task-image">
      <span>📷</span>
      <span>miejsce na obraz</span>
    </div>
  `;

  const leftLabel = taskData.optionType === "motif"
    ? getMotifById(taskData.leftId)?.name || "?"
    : getBookById(taskData.leftId)?.title || "?";

  const rightLabel = taskData.optionType === "motif"
    ? getMotifById(taskData.rightId)?.name || "?"
    : getBookById(taskData.rightId)?.title || "?";

  el.innerHTML = `
    <div class="task-card ${answeredState ? "answered" : ""}">
      <div class="task-swipe-instruction">← →</div>
      ${promptHtml}
      ${imagePlaceholder}

      <div class="task-row">
        <div class="task-choice" onclick="handleAnswer('left')">
          ${leftLabel}
        </div>

        <div class="task-choice" onclick="handleAnswer('right')">
          ${rightLabel}
        </div>
      </div>
    </div>
  `;

  attachTaskXSwipeHandlers();
}

function createTaskY1() {
  return {
    type: "Y1",
    data: { stub: true },
    render() {
      document.getElementById("quiz-content").innerHTML = `
        <div class="task-card">
          <h2>Y1 w przygotowaniu</h2>
          <p>To zadanie otwarte z podpowiedziami dodamy później.</p>
        </div>
      `;
      document.getElementById("nextBtn").style.display = "inline-block";
    },
    submit() {}
  };
}

function createTaskY2() {
  return {
    type: "Y2",
    data: { stub: true },
    render() {
      document.getElementById("quiz-content").innerHTML = `
        <div class="task-card">
          <h2>Y2 w przygotowaniu</h2>
          <p>To zadanie otwarte z dwiema okładkami dodamy później.</p>
        </div>
      `;
      document.getElementById("nextBtn").style.display = "inline-block";
    },
    submit() {}
  };
}

function handleAnswer(side) {
  if (quizMode !== "engine") return;
  if (!currentTask || answered) return;

  answered = true;
  currentTask.submit(side);
}

function attachTaskXSwipeHandlers() {
  const card = document.querySelector(".task-card");
  if (!card || quizMode !== "engine" || currentTaskType !== "X") return;

  let startX = null;

  card.onpointerdown = (e) => {
    startX = e.clientX;
    try {
      card.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  card.onpointerup = (e) => {
    if (startX === null || answered) return;
    const diff = e.clientX - startX;

    if (Math.abs(diff) > 55) {
      handleAnswer(diff < 0 ? "left" : "right");
    }

    startX = null;
  };

  card.onpointercancel = () => {
    startX = null;
  };
}

function openCurrentTaskProfile() {
  if (!currentTaskData || quizMode !== "engine") return;

  if (currentTaskData.promptType === "book") {
    openBook(currentTaskData.promptId);
  } else {
    openMotif(currentTaskData.promptId);
  }
}

// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown", (e) => {
  if (mode !== "quiz") return;
  if (quizMode !== "engine") return;
  if (!currentTask || answered) return;
  if (currentTaskType !== "X") return;

  if (e.key === "ArrowLeft") handleAnswer("left");
  if (e.key === "ArrowRight") handleAnswer("right");
});

// =========================
// SCORE
// =========================

function renderScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
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
      const m = getMotifById(id);
      if (m) map.set(m.id, m);
    });
  });

  return [...map.values()];
}

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
// MAP
// =========================

function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");

  list.innerHTML = "";

  if (view === "books") {
    title.innerText = "📚 Lektury";
    getFilteredBooks().forEach(b => {
      list.innerHTML += `
        <div class="map-item" onclick="openBook('${b.id}')">
          📚 ${b.title}
        </div>
      `;
    });
  }

  if (view === "motifs") {
    title.innerText = "🎯 Motywy";
    getFilteredMotifs().forEach(m => {
      list.innerHTML += `
        <div class="map-item" onclick="openMotif('${m.id}')">
          🎯 ${m.name}
        </div>
      `;
    });
  }
}

// =========================
// PROFILE
// =========================

function openBook(id) {
  profileReturnTarget = mode === "quiz" ? "quiz" : "map";

  if (mode === "quiz") {
    quizSnapshot = captureQuizState();
  }

  const book = getBookById(id);
  if (!book) return;

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.description}</p>
    <button onclick="returnFromProfile()">
      ${profileReturnTarget === "quiz" ? "⬅ Powrót do ćwiczeń" : "⬅ Powrót"}
    </button>
  `;
}

function openMotif(id) {
  profileReturnTarget = mode === "quiz" ? "quiz" : "map";

  if (mode === "quiz") {
    quizSnapshot = captureQuizState();
  }

  const motif = getMotifById(id);
  if (!motif) return;

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${motif.name}</h2>
    <p>${motif.description}</p>
    <button onclick="returnFromProfile()">
      ${profileReturnTarget === "quiz" ? "⬅ Powrót do ćwiczeń" : "⬅ Powrót"}
    </button>
  `;
}

function returnFromProfile() {
  hideAll();

  if (profileReturnTarget === "quiz") {
    document.getElementById("quiz").style.display = "block";
    restoreQuizState();
    return;
  }

  goMap();
}

function goMap() {
  hideAll();
  document.getElementById("map").style.display = "block";
  renderMap();
}

// =========================
// SNAPSHOT
// =========================

function captureQuizState() {
  return {
    score,
    quizMode,
    selectedBook,
    selectedMotif,
    scoredPairs: [...scoredPairs],
    masteredPairs: [...masteredPairs],
    answered,
    currentTaskType,
    currentTaskData: clone(currentTaskData),
    profileReturnTarget
  };
}

function restoreQuizState() {
  if (!quizSnapshot) return;

  score = quizSnapshot.score;
  quizMode = quizSnapshot.quizMode;
  selectedBook = quizSnapshot.selectedBook;
  selectedMotif = quizSnapshot.selectedMotif;
  scoredPairs = new Set(quizSnapshot.scoredPairs || []);
  masteredPairs = new Set(quizSnapshot.masteredPairs || []);
  answered = quizSnapshot.answered;
  currentTaskType = quizSnapshot.currentTaskType;
  currentTaskData = clone(quizSnapshot.currentTaskData);
  profileReturnTarget = quizSnapshot.profileReturnTarget || "quiz";

  renderScore();

  if (quizMode === "diagnostic") {
    renderDiagnostic();
    return;
  }

  if (quizMode === "engine") {
    if (currentTaskType && currentTaskData) {
      currentTask = createTaskByType(currentTaskType, currentTaskData);
      currentTask.render();
      document.getElementById("nextBtn").style.display = answered ? "inline-block" : "none";
    } else {
      renderEngineNextTask();
    }
  }
}

// =========================
// BUTTON HOOK
// =========================

window.nextTask = nextTask;
