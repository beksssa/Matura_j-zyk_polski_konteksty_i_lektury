// =========================
// 🧠 STATE
// =========================

let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska"]);

let score = 0;

let currentTask = null;
let answered = false;

const taskTypes = ["X"]; // 🔥 na razie tylko X


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

function setMode(m) { mode = m; }
function setView(v) { view = v; }


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

  renderScore();
  nextTask();
}


// =========================
// 🧠 ENGINE
// =========================

function getNextTaskType() {
  return taskTypes[Math.floor(Math.random() * taskTypes.length)];
}

function nextTask() {
  answered = false;
  document.getElementById("nextBtn").style.display = "none";

  const type = getNextTaskType();

  if (type === "X") {
    currentTask = createTaskX();
  }

  currentTask.render();
}


// =========================
// 🟦 TASK X (SWIPE)
// =========================

function createTaskX() {

  const books = getFilteredBooks();
  const motifs = getFilteredMotifs();

  const book = books[Math.floor(Math.random() * books.length)];

  const correctMotif = data.motifs.find(m => book.motifs.includes(m.id));

  const wrongMotifs = motifs.filter(m => !book.motifs.includes(m.id));
  const wrongMotif = wrongMotifs[Math.floor(Math.random() * wrongMotifs.length)];

  const correctLeft = Math.random() < 0.5;

  const left = correctLeft ? correctMotif : wrongMotif;
  const right = correctLeft ? wrongMotif : correctMotif;

  return {
    type: "X",

    data: {
      book,
      left,
      right,
      correctSide: correctLeft ? "left" : "right"
    },

    render() {
      const el = document.getElementById("quiz-content");

      el.innerHTML = `
        <div style="text-align:center;font-size:20px;">
          ← →
        </div>

        <h2 style="text-align:center">${book.title}</h2>

        <div style="display:flex;justify-content:space-between;margin-top:20px;">
          <div onclick="handleAnswer('left')" style="cursor:pointer">
            ${left.name}
          </div>

          <div>📖</div>

          <div onclick="handleAnswer('right')" style="cursor:pointer">
            ${right.name}
          </div>
        </div>
      `;
    },

    submit(side) {
      const correct = side === this.data.correctSide;

      if (correct) score += 25; // 🔥 zmienione

      renderScore();

      showProfileIcon(this.data.book);

      document.getElementById("nextBtn").style.display = "block";
    }
  };
}


// =========================
// ANSWER HANDLER
// =========================

function handleAnswer(side) {
  if (answered) return;

  answered = true;

  currentTask.submit(side);
}


// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown", (e) => {
  if (!currentTask || answered) return;

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
// PROFILE (stub)
// =========================

function showProfileIcon(context) {
  console.log("📖 profile:", context);
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
// MAP
// =========================

function renderMap() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  getFilteredBooks().forEach(b => {
    list.innerHTML += `<div>${b.title}</div>`;
  });
}
window.nextTask = nextTaskHandler;
