// =========================
// 🧠 STATE
// =========================

let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska"]);

let score = 0;

let quizSnapshot = null;

// task system
let taskQueue = [];
let currentTask = null;
let answered = false;

const taskTypes = ["X", "Y", "Z"];

// swipe state
let swipeIndex = 0;
let swipeOptions = [];
let swipeCorrectSide = null;

let currentTaskData = null;
let currentTaskType = null;


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
  answered = false;

  generateTaskQueue();
  nextTask();

  renderScore();
}


// =========================
// TASK SYSTEM
// =========================

function generateTaskQueue() {
  taskQueue = shuffle([...taskTypes]);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function nextTask() {
  answered = false;
  document.getElementById("nextBtn").style.display = "none";

  currentTask = taskQueue.shift();

  if (!currentTask) {
    generateTaskQueue();
    currentTask = taskQueue.shift();
  }

  renderTask();
}


// =========================
// TASK RENDER (SWIPE UI)
// =========================

function renderTask() {
  const el = document.getElementById("quiz-content");

  const books = getFilteredBooks();
  const motifs = getFilteredMotifs();

  const book = books[Math.floor(Math.random() * books.length)];
  const motifCorrect = motifs[Math.floor(Math.random() * motifs.length)];
  const motifWrong = motifs.find(m => m.id !== motifCorrect.id);

  swipeOptions = Math.random() > 0.5
    ? [motifCorrect, motifWrong]
    : [motifWrong, motifCorrect];

  swipeCorrectSide = swipeOptions.indexOf(motifCorrect);

  el.innerHTML = `
    <div style="text-align:center; font-size:20px;">
      ←  →
    </div>

    <h2 style="text-align:center">${book.title}</h2>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">

      <div onclick="chooseSwipe(0)" style="cursor:pointer">
        ${swipeOptions[0].name}
      </div>

      <div>
        📖
      </div>

      <div onclick="chooseSwipe(1)" style="cursor:pointer">
        ${swipeOptions[1].name}
      </div>

    </div>
  `;
}


// =========================
// SWIPE LOGIC
// =========================

function chooseSwipe(index) {
  if (answered) return;

  answered = true;

  const correct = index === swipeCorrectSide;

  if (correct) {
    score += 100;
  }

  renderScore();

  document.getElementById("nextBtn").style.display = "block";

  const context = swipeOptions[swipeCorrectSide];
  showProfileIcon(context);
}


// =========================
// KEYBOARD SWIPE
// =========================

document.addEventListener("keydown", (e) => {
  if (answered === false) return;

  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    nextTask();
  }
});


// =========================
// SCORE
// =========================

function renderScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}


// =========================
// NEXT BUTTON
// =========================

function nextTaskHandler() {
  nextTask();
}


// =========================
// PROFILE ICON (stub)
// =========================

function showProfileIcon(context) {
  console.log("📖 open profile:", context);
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
      </label><br>
    `;
  });
}

function toggleEpoch(e) {
  activeEpochs.has(e)
    ? activeEpochs.delete(e)
    : activeEpochs.add(e);
}


// =========================
// MAP (optional)
// =========================

function renderMap() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  if (view === "books") {
    getFilteredBooks().forEach(b => {
      list.innerHTML += `<div>${b.title}</div>`;
    });
  }
}

function getNextTaskType() {
  return taskTypes[Math.floor(Math.random() * taskTypes.length)];
}

function nextTask() {
  answered = false;
  document.getElementById("nextBtn").style.display = "none";

  const type = getNextTaskType();

  if (type === "X") generateTaskX();
  if (type === "Y") generateTaskY();
  if (type === "Z") generateTaskZ();
}



// =========================
// HTML BUTTON HOOK FIX
// =========================

window.nextTask = nextTaskHandler;
