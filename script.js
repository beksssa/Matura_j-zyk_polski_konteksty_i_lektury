// =========================
// 🧠 STATE
// =========================

let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska", "pozytywizm", "romantyzm", "antyk", "współczesność", "renesans"]);
let score = 0;

// diagnostic state
let quizMode = "diagnostic";
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
let profileStack = []; // stos historii profili
let taskBag = [];

// engine task registry
const ENGINE_TASK_TYPES = ["X", "Y1", "Y2"];
const ENGINE_TASK_ENABLED = {
  X: true,
  Y1: true,
  Y2: true,
};

// =========================
// 📚 DATA
// =========================

const data = {
  books: [
    {
      id: "wesele",
      title: "Wesele",
      description: "Diagnoza społeczeństwa polskiego (niemoc narodowa), symbolizm (zjawy jako uosobienie lęków i marzeń), marazm narodowy (chocholi taniec), rozbicie mitu ludomanii oraz prywata kontra sprawa narodowa",
      epoch: "młoda polska",
      motifs: ["motywnarodowy", "symbolizm", "ludomania"],
      coverEmoji: "🎭",
      aliases: ["Wesele Wyspiańskiego"],
      characters: ["Chochoł", "Gospodarz", "Pan Młody", "Rachel", "Stańczyk"],
      quotes: [],
      images: [{ label: "Chocholi taniec", alt: "Symbol marazmu i bezwładu" }]
    },
    {
      id: "chłopi",
      title: "Chłopi",
      description: "Realistyczna powieść ukazująca życie wiejskiej społeczności podporządkowane rytmowi natury, pracy i tradycji.",
      epoch: "młoda polska",
      motifs: ["naturalizm", "motywmiłości"],
      coverEmoji: "🌾",
      aliases: ["Chłopi Reymonta"],
      characters: ["Maciej Boryna", "Jagna", "Antek", "Hanka", "Kuba"],
      quotes: [],
      images: [{ label: "Wiejska społeczność", alt: "Rytm natury i pracy" }]
    },
    {
      id: "antygona",
      title: "Antygona",
      description: "Nierozwiązywalny konflikt między prawem boskim a prawem państwowym, prowadząca do nieuchronnej katastrofy bohatera.",
      epoch: "antyk",
      motifs: ["motywbuntu", "fatum"],
      coverEmoji: "🏛️",
      aliases: ["Antygona Sofoklesa"],
      characters: ["Antygona", "Kreon", "Ismena", "Hajmon", "Tejrezjasz"],
      quotes: [],
      images: [{ label: "Grób Polinejkesa", alt: "Konflikt prawa boskiego i państwowego" }]
    },
    {
      id: "tango",
      title: "Tango",
      description: "Analiza upadku tradycyjnych wartości, w której próba przywrócenia porządku przez młodego intelektualistę kończy się zwycięstwem brutalnej, prymitywnej siły.",
      epoch: "współczesność",
      motifs: ["motywbuntu", "groteska", "motywrodziny"],
      coverEmoji: "🪑",
      aliases: ["Tango Mrożka"],
      characters: ["Artur", "Ala", "Edek", "Stomil", "Eleonora"],
      quotes: [],
      images: [{ label: "Dom pełen chaosu", alt: "Rozpad porządku rodzinnego" }]
    },
    {
      id: "magbet",
      title: "Makbet",
      description: "Studium destrukcyjnej siły ambicji i mechanizmu władzy, który popycha człowieka do zbrodni, skutkując całkowitym rozpadem jego psychiki.",
      epoch: "renesans",
      motifs: ["motywmiłości", "motywsumienia", "motywszalenstwa", "fatum"],
      coverEmoji: "👑",
      aliases: ["Macbeth", "Makbet Szekspira"],
      characters: ["Makbet", "Lady Makbet", "Banko", "Duncan", "Makduf", "Wiedźmy"],
      quotes: [],
      images: [{ label: "Krwawa korona", alt: "Ambicja i władza" }]
    },
    {
      id: "zbrodniaikara",
      title: "Zbrodnia i kara",
      description: "Psychologiczna opowieść o upadku i odkupieniu człowieka, który morderstwo uzasadnia ideologią, by ostatecznie ulec miażdżącej sile własnego sumienia.",
      epoch: "pozytywizm",
      motifs: ["motywmiłości", "motywsumienia"],
      coverEmoji: "🕯️",
      aliases: ["Zbrodnia i Kara", "Zbrodnia i kara Dostojewskiego"],
      characters: ["Raskolnikow", "Sonia", "Porfiry", "Dunia", "Swidrygajłow"],
      quotes: [],
      images: [{ label: "Mroczne ulice Petersburga", alt: "Poczucie winy i rozpad psychiki" }]
    },
    {
      id: "innyswiat",
      title: "Inny świat",
      description: "Świadectwo nieludzkiego systemu sowieckich łagrów, testującego granice człowieczeństwa w warunkach głodu, pracy ponad siły i wszechobecnego terroru.",
      epoch: "współczesność",
      motifs: ["totalitaryzm"],
      coverEmoji: "⛓️",
      aliases: ["Inny Świat Herlinga-Grudzińskiego"],
      characters: ["Narrator", "więźniowie łagru"],
      quotes: [],
      images: [{ label: "Łagier", alt: "System odczłowieczający" }]
    },
    {
      id: "1984",
      title: "Rok 1984",
      description: "Przerażająca wizja państwa totalitarnego, w którym Partia sprawuje absolutną kontrolę nad czynami, przeszłością, a nawet myślami i uczuciami jednostki.",
      epoch: "współczesność",
      motifs: ["totalitaryzm", "motywmiłości"],
      coverEmoji: "📕",
      aliases: ["1984", "Rok tysiąc dziewięćset osiemdziesiąty czwarty"],
      characters: ["Winston", "Julia", "O'Brien", "Wielki Brat", "Parsons"],
      quotes: [],
      images: [{ label: "Wielki Brat", alt: "Totalitarna kontrola" }]
    },
  ],
  motifs: [
    {
      id: "motywnarodowy",
      name: "Motyw Narodowy",
      description: "Problematyka kondycji narodu",
      books: ["wesele"],
      aliases: ["naród", "motyw narodu"]
    },
    {
      id: "symbolizm",
      name: "Symbolizm",
      description: "Posługiwanie się wieloznacznymi obrazami do wyrażania stanów duszy i treści niewyrażalnych wprost",
      books: ["wesele"],
      aliases: ["symboliczność"]
    },
    {
      id: "ludomania",
      name: "Ludomania",
      description: "Powierzchowna fascynacja wsią i życiem chłopów jako źródłem pierwotnej energii",
      books: ["wesele"],
      aliases: ["ludofilia"]
    },
    {
      id: "naturalizm",
      name: "Naturalizm",
      description: "Ukazanie człowieka jako istoty zdeterminowanej przez biologię, instynkty i walkę o byt",
      books: ["chłopi"],
      aliases: ["naturalistyczny obraz świata"]
    },
    {
      id: "motywmiłości",
      name: "Motyw Miłości",
      description: "Przedstawienie relacji miłosnej",
      books: ["chłopi", "magbet", "zbrodniaikara", "1984"],
      aliases: ["miłość", "motyw miłości"]
    },
    {
      id: "motywbuntu",
      name: "Motyw Buntu",
      description: "Sprzeciw wobec zastanego porządku, losu lub władzy",
      books: ["wesele", "antygona", "tango"],
      aliases: ["bunt", "motyw buntu"]
    },
    {
      id: "fatum",
      name: "Fatum",
      description: "Personifikacja nieuchronnego, nieodwracalnego losu, nieodwołalnej woli bogów, na którą nikt nie ma wpływu.",
      books: ["antygona", "magbet"],
      aliases: ["los", "przeznaczenie"]
    },
    {
      id: "groteska",
      name: "Groteska",
      description: "Połączenie w jednym dziele jednocześnie występujących pierwiastków przeciwstawnych",
      books: ["tango"],
      aliases: ["groteskowość"]
    },
    {
      id: "motywrodziny",
      name: "Motyw Rodziny",
      description: "Przedstawienie i problematyka relacji rodzinnych",
      books: ["tango"],
      aliases: ["rodzina", "motyw rodziny"]
    },
    {
      id: "motywsumienia",
      name: "Motyw Sumienia",
      description: "Wewnętrzny głos moralny, który staje się głównym sędzią i katem bohatera po dokonaniu zła",
      books: ["magbet", "zbrodniaikara"],
      aliases: ["sumienie", "wyrzuty sumienia"]
    },
    {
      id: "motywszalenstwa",
      name: "Motyw Szaleństwa",
      description: "Sposób przedstawienia bohatera, którego psychika ulega dezintegracji pod wpływem skrajnych emocji, poczucia winy lub traumy",
      books: ["magbet", "antygona"],
      aliases: ["szaleństwo", "obłęd"]
    },
    {
      id: "totalitaryzm",
      name: "Totalitaryzm",
      description: "System polityczny dążący do pełnej unifikacji społeczeństwa i zniszczenia indywidualizmu",
      books: ["magbet", "innyswiat", "1984"],
      aliases: ["motyw totalitaryzmu", "system totalitarny"]
    },
  ]
};

const epochs = ["młoda polska", "pozytywizm", "romantyzm", "antyk", "współczesność", "renesans"];

// =========================
// HELPERS
// =========================

function clone(v) {
  return v === null || v === undefined ? v : JSON.parse(JSON.stringify(v));
}

function pickRandom(items) {
  if (!items || !items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function makePairKey(bId, mId) {
  return [`book:${bId}`, `motif:${mId}`].sort().join("|");
}

function isMasteredPair(bId, mId) {
  return masteredPairs.has(makePairKey(bId, mId));
}

function isScoredPair(bId, mId) {
  return scoredPairs.has(makePairKey(bId, mId));
}

function getBookById(id) {
  return data.books.find(b => b.id === id) || null;
}

function getMotifById(id) {
  return data.motifs.find(m => m.id === id) || null;
}

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueStrings(items) {
  return [...new Set((items || []).map(v => String(v || "").trim()).filter(Boolean))];
}

function normalizeText(v) {
  return String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncateText(s, max = 140) {
  const t = String(s ?? "");
  return t.length > max ? `${t.slice(0, max).trim()}…` : t;
}

function setNextButtonVisible(v) {
  document.getElementById("nextBtn").style.display = v ? "inline-block" : "none";
}

function syncCurrentTaskData() {
  if (currentTask && currentTask.data) currentTaskData = clone(currentTask.data);
}

function pointsForHints(n) {
  if (n <= 0) return 80;
  if (n === 1) return 60;
  return 40;
}

function getBookAnswerVariants(book) {
  return uniqueStrings([book?.title, ...(book?.aliases || [])]);
}

function getMotifAnswerVariants(motif) {
  return uniqueStrings([motif?.name, ...(motif?.aliases || [])]);
}

function bookMatchesAnswer(book, answer) {
  const n = normalizeText(answer);
  return getBookAnswerVariants(book).some(v => normalizeText(v) === n);
}

function motifMatchesAnswer(motif, answer) {
  const n = normalizeText(answer);
  return getMotifAnswerVariants(motif).some(v => normalizeText(v) === n);
}

function formatCoverVisual(book) {
  if (book?.coverImage) {
    return `<div class="cover-visual"><img src="${escapeHtml(book.coverImage)}" alt="${escapeHtml(book.title)}"></div>`;
  }
  return `<div class="cover-visual"><div class="cover-emoji">${escapeHtml(book?.coverEmoji || "📘")}</div></div>`;
}

// =========================
// PROFILE EXTRAS (z klikalnymi chipami)
// =========================

function renderBookExtras(book) {
  const aliases = uniqueStrings(book?.aliases || []);
  const characters = uniqueStrings(book?.characters || []);
  const quotes = uniqueStrings(book?.quotes || []);
  const images = book?.images || [];
  const motifObjects = (book?.motifs || []).map(getMotifById).filter(Boolean);

  return `
    ${motifObjects.length ? `
      <div class="profile-section">
        <h3>Motywy</h3>
        <div class="profile-chip-list">
          ${motifObjects.map(m => `<span class="profile-chip clickable" onclick="openMotifFromProfile('${m.id}')">🎯 ${escapeHtml(m.name)}</span>`).join("")}
        </div>
      </div>` : ""}
    ${aliases.length ? `
      <div class="profile-section">
        <h3>Akceptowane warianty tytułu</h3>
        <div class="profile-chip-list">
          ${aliases.map(a => `<span class="profile-chip">${escapeHtml(a)}</span>`).join("")}
        </div>
      </div>` : ""}
    ${characters.length ? `
      <div class="profile-section">
        <h3>Bohaterowie</h3>
        <div class="profile-chip-list">
          ${characters.map(c => `<span class="profile-chip">${escapeHtml(c)}</span>`).join("")}
        </div>
      </div>` : ""}
    ${quotes.length ? `
      <div class="profile-section">
        <h3>Fragmenty / cytaty</h3>
        <div class="profile-media-list">
          ${quotes.map(q => `<div class="profile-media-item">„${escapeHtml(q)}"</div>`).join("")}
        </div>
      </div>` : ""}
    ${images.length ? `
      <div class="profile-section">
        <h3>Obrazy / symbole</h3>
        <div class="profile-media-list">
          ${images.map(img => {
            const label = typeof img === "string" ? img : (img.label || img.alt || img.caption || "");
            return `<div class="profile-media-item">${escapeHtml(label)}</div>`;
          }).join("")}
        </div>
      </div>` : ""}
  `;
}

function renderMotifExtras(motif) {
  const aliases = uniqueStrings(motif?.aliases || []);
  const bookObjects = (motif?.books || []).map(getBookById).filter(Boolean);

  return `
    ${bookObjects.length ? `
      <div class="profile-section">
        <h3>Lektury z tym motywem</h3>
        <div class="profile-chip-list">
          ${bookObjects.map(b => `<span class="profile-chip clickable" onclick="openBookFromProfile('${b.id}')">📚 ${escapeHtml(b.title)}</span>`).join("")}
        </div>
      </div>` : ""}
    ${aliases.length ? `
      <div class="profile-section">
        <h3>Akceptowane warianty odpowiedzi</h3>
        <div class="profile-chip-list">
          ${aliases.map(a => `<span class="profile-chip">${escapeHtml(a)}</span>`).join("")}
        </div>
      </div>` : ""}
  `;
}

// =========================
// SCREEN CONTROL
// =========================

function goScreen(n) {
  hideAll();
  if (n === 1) sceneTransition("start");
  if (n === 2) document.getElementById("screen-mode").style.display = "block";
  if (n === 3) {
    document.getElementById("screen-epoch").style.display = "block";
    renderEpochFilter();
  }
}
function sceneTransition(sceneName) {
  const scene = document.getElementById("scene-layer");

  scene.style.opacity = 0;
  scene.style.transform = "scale(0.98)";

  setTimeout(() => {
    renderScene(sceneName); // tu Twój switch-case UI
    scene.style.opacity = 1;
    scene.style.transform = "scale(1)";
  }, 300);
}

function hideAll() {
  ["screen-start", "screen-mode", "screen-epoch", "map", "quiz", "profile"]
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
  setNextButtonVisible(true);
  el.innerHTML = `
    <p class="small-note">Połącz jak największą ilość zagadnień z lekturami</p>
    <div class="diagnostic-layout">
      <div><h3>Lektury</h3>${books.map(renderDiagnosticBook).join("")}</div>
      <div><h3>Motywy</h3>${motifs.map(renderDiagnosticMotif).join("")}</div>
    </div>`;
}

function renderDiagnosticBook(book) {
  const sel = selectedBook === book.id ? "selected" : "";
  return `<div class="quiz-item ${sel}">
    <div class="item-main" onclick="selectDiagnosticBook('${book.id}')">📚 ${escapeHtml(book.title)}</div>
    <button type="button" class="icon-btn" onclick="event.stopPropagation();openBook('${book.id}')">📖</button>
  </div>`;
}

function renderDiagnosticMotif(motif) {
  const sel = selectedMotif === motif.id ? "selected" : "";
  return `<div class="quiz-item ${sel}">
    <div class="item-main" onclick="selectDiagnosticMotif('${motif.id}')">🎯 ${escapeHtml(motif.name)}</div>
    <button type="button" class="icon-btn" onclick="event.stopPropagation();openMotif('${motif.id}')">📖</button>
  </div>`;
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
    if (isCorrect) { score += 100; masteredPairs.add(pairKey); }
    else score -= 50;
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

function availableTaskTypes() {
  return ENGINE_TASK_TYPES.filter(t => {
    if (!ENGINE_TASK_ENABLED[t]) return false;
    // Y1 tylko w trybie lektur, Y2 tylko w trybie motywów
    if (t === "Y1" && view !== "books") return false;
    if (t === "Y2" && view !== "motifs") return false;
    return true;
  });
}

function refillTaskBag() {
  taskBag = shuffle(availableTaskTypes());
}

function getNextTaskType() {
  if (!taskBag.length) refillTaskBag();
  return taskBag.pop() || null;
}

function startEngine() {
  quizMode = "engine";
  answered = false;
  currentTaskType = null;
  currentTaskData = null;
  currentTask = null;
  taskBag = [];
  setNextButtonVisible(false);
  renderEngineNextTask();
}

function renderEngineNextTask() {
  answered = false;
  setNextButtonVisible(false);
  const type = getNextTaskType();
  if (!type) {
    document.getElementById("quiz-content").innerHTML = `<div class="task-card"><h2>Brak aktywnych typów zadań</h2></div>`;
    return;
  }
  currentTaskType = type;
  currentTask = createTaskByType(type);
  currentTaskData = clone(currentTask.data);
  currentTask.render();
}

function nextTask() {
  if (quizMode === "diagnostic") { finishDiagnosticAndStartEngine(); return; }
  if (quizMode === "engine") renderEngineNextTask();
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
    const av = motifs.filter(m => m.books.some(bId => !isMasteredPair(bId, m.id)));
    return av.length ? av : motifs;
  }
  const books = getFilteredBooks();
  const av = books.filter(b => b.motifs.some(mId => !isMasteredPair(b.id, mId)));
  return av.length ? av : books;
}

function buildTaskXData() {
  if (view === "motifs") {
    const promptMotif = pickRandom(getTaskXPromptCandidates());
    if (!promptMotif) return fallbackTaskXData();
    const correctBooks = promptMotif.books.map(getBookById).filter(Boolean).filter(b => !isMasteredPair(b.id, promptMotif.id));
    const allCorrectBooks = promptMotif.books.map(getBookById).filter(Boolean);
    const correctBook = pickRandom(correctBooks.length ? correctBooks : allCorrectBooks);
    if (!correctBook) return fallbackTaskXData();
    let wrongBooks = getFilteredBooks().filter(b => !promptMotif.books.includes(b.id) && b.id !== correctBook.id);
    if (!wrongBooks.length) wrongBooks = getFilteredBooks().filter(b => b.id !== correctBook.id);
    const wrongBook = pickRandom(wrongBooks) || getFilteredBooks().find(b => b.id !== correctBook.id) || null;
    if (!wrongBook || wrongBook.id === correctBook.id) return fallbackTaskXData();
    const correctLeft = Math.random() < 0.5;
    return {
      promptType: "motif", promptId: promptMotif.id, promptTitle: promptMotif.name,
      promptDescription: promptMotif.description, optionType: "book",
      leftId: correctLeft ? correctBook.id : wrongBook.id,
      rightId: correctLeft ? wrongBook.id : correctBook.id,
      correctSide: correctLeft ? "left" : "right", correctBookId: correctBook.id
    };
  }
  const promptBook = pickRandom(getTaskXPromptCandidates());
  if (!promptBook) return fallbackTaskXData();
  const correctMotifs = promptBook.motifs.map(getMotifById).filter(Boolean).filter(m => !isMasteredPair(promptBook.id, m.id));
  const allCorrectMotifs = promptBook.motifs.map(getMotifById).filter(Boolean);
  const correctMotif = pickRandom(correctMotifs.length ? correctMotifs : allCorrectMotifs);
  if (!correctMotif) return fallbackTaskXData();
  let wrongMotifs = getFilteredMotifs().filter(m => !promptBook.motifs.includes(m.id) && m.id !== correctMotif.id);
  if (!wrongMotifs.length) wrongMotifs = getFilteredMotifs().filter(m => m.id !== correctMotif.id);
  const wrongMotif = pickRandom(wrongMotifs) || getFilteredMotifs().find(m => m.id !== correctMotif.id) || null;
  if (!wrongMotif || wrongMotif.id === correctMotif.id) return fallbackTaskXData();
  const correctLeft = Math.random() < 0.5;
  return {
    promptType: "book", promptId: promptBook.id, promptTitle: promptBook.title,
    promptDescription: promptBook.description, optionType: "motif",
    leftId: correctLeft ? correctMotif.id : wrongMotif.id,
    rightId: correctLeft ? wrongMotif.id : correctMotif.id,
    correctSide: correctLeft ? "left" : "right", correctMotifId: correctMotif.id
  };
}

function fallbackTaskXData() {
  const book = getFilteredBooks()[0];
  const motif = getFilteredMotifs()[0];
  return {
    promptType: view === "motifs" ? "motif" : "book",
    promptId: view === "motifs" ? (motif ? motif.id : null) : (book ? book.id : null),
    promptTitle: view === "motifs" ? (motif ? motif.name : "Brak motywu") : (book ? book.title : "Brak lektury"),
    promptDescription: "", optionType: view === "motifs" ? "book" : "motif",
    leftId: null, rightId: null, correctSide: "left",
    correctBookId: null, correctMotifId: null, fallback: true
  };
}

function createTaskX(presetData = null) {
  const dataObj = presetData || buildTaskXData();
  return {
    type: "X",
    data: dataObj,
    render() { renderTaskX(this.data); attachTaskXSwipeHandlers(); },
    submit(side) {
      const correct = side === this.data.correctSide;
      if (correct) {
        score += 25;
        if (this.data.promptType === "book" && this.data.correctMotifId)
          masteredPairs.add(makePairKey(this.data.promptId, this.data.correctMotifId));
        if (this.data.promptType === "motif" && this.data.correctBookId)
          masteredPairs.add(makePairKey(this.data.correctBookId, this.data.promptId));
      }
      renderScore();
      setNextButtonVisible(true);
      renderTaskX(this.data, true);
    }
  };
}

function renderTaskX(taskData, answeredState = false) {
  const el = document.getElementById("quiz-content");
  if (taskData.fallback) {
    el.innerHTML = `<div class="task-card"><h2>Brak dostępnych par</h2><p>W wybranym zakresie nie ma już sensownej pary do pokazania.</p></div>`;
    return;
  }

  // Ikonka 📖 przenosi do profilu PYTANEGO elementu
  // (jeśli pytamy o lekturę → otwieramy lekturę, jeśli o motyw → otwieramy motyw)
  const profileBtnHtml = answeredState
    ? `<button class="icon-btn task-profile-icon" title="Dowiedz się więcej" onclick="openCurrentTaskProfile()">📖</button>`
    : "";

  const promptHtml = `<div class="task-head">
    ${taskData.promptType === "book" ? "📚" : "🎯"} ${escapeHtml(taskData.promptTitle)}
    ${profileBtnHtml}
  </div>`;

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
      <div class="task-image"><span>📷</span><span>miejsce na obraz</span></div>
      <div class="task-row">
        <div class="task-choice" onclick="handleAnswer('left')">${escapeHtml(leftLabel)}</div>
        <div class="task-choice" onclick="handleAnswer('right')">${escapeHtml(rightLabel)}</div>
      </div>
    </div>`;
  attachTaskXSwipeHandlers();
}

// =========================
// TASK Y1 (tylko tryb lektur)
// =========================

function buildY1Candidates() {
  const filteredBooks = getFilteredBooks();
  const filteredMotifIds = new Set(getFilteredMotifs().map(m => m.id));
  const candidates = [];
  filteredBooks.forEach(book => {
    (book.motifs || []).forEach(motifId => {
      if (filteredMotifIds.has(motifId)) candidates.push({ bookId: book.id, motifId });
    });
  });
  return candidates;
}

function buildY1HintPool(book, motif) {
  const pool = [];
  if (book?.characters?.length) pool.push(`W utworze pojawia się postać: ${book.characters.slice(0, 2).join(", ")}`);
  if (book?.images?.length) {
    const img = book.images[0];
    const label = typeof img === "string" ? img : (img.label || img.alt || img.caption || "");
    if (label) pool.push(`Obraz / symbol: ${label}`);
  }
  if (book?.quotes?.length) pool.push(`Fragment: ${book.quotes[0]}`);
  if (book?.epoch) pool.push(`Epoka: ${book.epoch}`);
  if (book?.description) pool.push(`Opis utworu: ${truncateText(book.description, 130)}`);
  if (motif?.description) pool.push(`To motyw związany z: ${truncateText(motif.description, 110)}`);
  return uniqueStrings(pool);
}

function buildTaskY1Data() {
  const candidates = buildY1Candidates();
  if (!candidates.length) return { fallback: true, type: "Y1" };
  const candidate = pickRandom(candidates);
  const book = getBookById(candidate.bookId);
  const motif = getMotifById(candidate.motifId);
  if (!book || !motif) return { fallback: true, type: "Y1" };
  const visibleHint = `Motyw: ${motif.description || motif.name}`;
  const hiddenPool = buildY1HintPool(book, motif).filter(h => normalizeText(h) !== normalizeText(visibleHint));
  return {
    fallback: false, type: "Y1",
    motifId: motif.id, targetBookId: book.id,
    acceptedBookIds: uniqueStrings([...(motif.books || []).filter(id => getBookById(id))]),
    visibleHint,
    hiddenHints: [
      hiddenPool[0] || `Epoka utworu: ${book.epoch || "nieznana"}`,
      hiddenPool[1] || `Jednym z tropów są bohaterowie i świat przedstawiony.`,
    ],
    revealedHints: 0, userAnswer: "", submitted: false,
    feedback: "", feedbackType: "", pointsAwarded: 0, correctAnswerLabel: ""
  };
}

function createTaskY1(presetData = null) {
  const dataObj = presetData ? clone(presetData) : buildTaskY1Data();
  return {
    type: "Y1",
    data: dataObj,
    render() { renderTaskY1(this.data); },
    revealHint(index) {
      if (this.data.submitted) return;
      if (index === 0 && this.data.revealedHints < 1) this.data.revealedHints = 1;
      if (index === 1 && this.data.revealedHints < 2 && this.data.revealedHints >= 1) this.data.revealedHints = 2;
      syncCurrentTaskData();
      this.render();
    },
    setAnswer(value) {
      if (this.data.submitted) return;
      this.data.userAnswer = value;
      syncCurrentTaskData();
    },
    submit() {
      if (this.data.submitted) return;
      const normalized = normalizeText(this.data.userAnswer || "");
      if (!normalized) {
        this.data.feedback = "Wpisz odpowiedź.";
        this.data.feedbackType = "bad";
        syncCurrentTaskData();
        this.render();
        return;
      }
      const matchedBook = this.data.acceptedBookIds.map(getBookById).find(b => b && bookMatchesAnswer(b, normalized));
      const points = pointsForHints(this.data.revealedHints);
      this.data.submitted = true;
      this.data.pointsAwarded = 0;
      if (matchedBook) {
        this.data.pointsAwarded = points;
        score += points;
        masteredPairs.add(makePairKey(matchedBook.id, this.data.motifId));
        this.data.feedback = `✅ Dobrze! +${points} pkt`;
        this.data.feedbackType = "ok";
      } else {
        const labels = this.data.acceptedBookIds.map(getBookById).filter(Boolean).map(b => b.title);
        this.data.feedback = `❌ Nie tym razem. Poprawna: ${labels.join(" / ")}`;
        this.data.feedbackType = "bad";
      }
      answered = true;
      syncCurrentTaskData();
      renderScore();
      this.render();
      setNextButtonVisible(true);
    }
  };
}

function renderTaskY1(taskData) {
  const el = document.getElementById("quiz-content");
  if (taskData.fallback) {
    el.innerHTML = `<div class="task-card"><h2>Brak dostępnych zadań Y1</h2><p>W obecnym filtrze nie ma pary motyw–lektura.</p></div>`;
    setNextButtonVisible(true);
    return;
  }
  const h1v = taskData.revealedHints >= 1;
  const h2v = taskData.revealedHints >= 2;
  // Ikonka 📖 po sprawdzeniu → otwiera profil MOTYWU (bo odpowiadamy na pytanie o lekturę danego motywu)
  const profileBtnHtml = taskData.submitted
    ? `<button class="icon-btn" title="Profil motywu" onclick="openMotif('${escapeHtml(taskData.motifId)}')">📖</button>`
    : "";
  el.innerHTML = `
    <div class="task-card ${taskData.submitted ? "answered" : ""}">
      <div class="open-task-shell">
        <div class="open-task-topline">Y1 • Lektury ${profileBtnHtml}</div>
        <h2 class="open-task-title">Podaj tytuł lektury</h2>
        <div class="open-task-visible-hint">
          <div class="hint-title">Podpowiedź 1</div>
          <div class="hint-text">${escapeHtml(taskData.visibleHint)}</div>
        </div>
        <div class="open-task-hidden-grid">
          <div class="hint-card ${h1v ? "revealed" : ""}">
            <div class="hint-title">Podpowiedź 2</div>
            <div class="hint-text">${h1v ? escapeHtml(taskData.hiddenHints[0]) : "Zakryta podpowiedź"}</div>
            <div class="hint-actions">
              <button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(0)" ${taskData.submitted || h1v ? "disabled" : ""}>Odkryj</button>
            </div>
          </div>
          <div class="hint-card ${h2v ? "revealed" : ""}">
            <div class="hint-title">Podpowiedź 3</div>
            <div class="hint-text">${h2v ? escapeHtml(taskData.hiddenHints[1]) : "Zakryta podpowiedź"}</div>
            <div class="hint-actions">
              <button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(1)" ${taskData.submitted || !h1v || h2v ? "disabled" : ""}>Odkryj</button>
            </div>
          </div>
        </div>
        <div class="open-task-input-wrap">
          <label for="y1-answer"><strong>Twoja odpowiedź</strong></label>
          <input id="y1-answer" class="open-task-input" type="text" placeholder="Wpisz tytuł lektury"
            value="${escapeHtml(taskData.userAnswer || "")}"
            oninput="updateCurrentOpenTaskAnswer(this.value)"
            ${taskData.submitted ? "disabled" : ""}>
        </div>
        <div class="open-task-actions">
          <button type="button" onclick="submitCurrentOpenTask()" ${taskData.submitted ? "disabled" : ""}>Sprawdź</button>
        </div>
        <div class="task-feedback ${taskData.feedbackType || ""}">${escapeHtml(taskData.feedback || "")}</div>
      </div>
    </div>`;
  setNextButtonVisible(!!taskData.submitted);
}

// =========================
// TASK Y2 (tylko tryb motywów)
// =========================

function buildY2Candidates() {
  const filteredBooks = getFilteredBooks();
  const filteredBookIds = new Set(filteredBooks.map(b => b.id));
  const candidates = [];
  getFilteredMotifs().forEach(motif => {
    const books = (motif.books || []).map(getBookById).filter(b => b && filteredBookIds.has(b.id));
    if (books.length < 2) return;
    for (let i = 0; i < books.length; i++)
      for (let j = i + 1; j < books.length; j++)
        candidates.push({ motifId: motif.id, bookAId: books[i].id, bookBId: books[j].id });
  });
  return candidates;
}

function buildY2HintPool(motif, bookA, bookB) {
  const pool = [];
  if (motif?.description) pool.push(`Wspólny motyw wiąże się z: ${truncateText(motif.description, 120)}`);
  const chars = uniqueStrings([...(bookA?.characters || []), ...(bookB?.characters || [])]);
  if (chars.length) pool.push(`W jednej z lektur pojawia się: ${chars.slice(0, 2).join(", ")}`);
  if (bookA?.images?.length) {
    const img = bookA.images[0];
    const label = typeof img === "string" ? img : (img.label || img.alt || img.caption || "");
    if (label) pool.push(`Na jednym obrazie/symbolu ważne jest: ${label}`);
  }
  if (bookB?.images?.length) {
    const img = bookB.images[0];
    const label = typeof img === "string" ? img : (img.label || img.alt || img.caption || "");
    if (label) pool.push(`Druga lektura podpowiada przez obraz: ${label}`);
  }
  if (bookA?.epoch && bookB?.epoch) pool.push(`Epoki utworów: ${bookA.epoch} / ${bookB.epoch}`);
  return uniqueStrings(pool);
}

function buildTaskY2Data() {
  const candidates = buildY2Candidates();
  if (!candidates.length) return { fallback: true, type: "Y2" };
  const candidate = pickRandom(candidates);
  const motif = getMotifById(candidate.motifId);
  const bookA = getBookById(candidate.bookAId);
  const bookB = getBookById(candidate.bookBId);
  if (!motif || !bookA || !bookB) return { fallback: true, type: "Y2" };
  const hiddenPool = buildY2HintPool(motif, bookA, bookB);
  return {
    fallback: false, type: "Y2",
    motifId: motif.id, bookAId: bookA.id, bookBId: bookB.id,
    visibleHint: "Dwie okładki łączy jeden wspólny motyw. Wpisz jego nazwę.",
    hiddenHints: [
      hiddenPool[0] || "Zwróć uwagę na sens obu utworów.",
      hiddenPool[1] || "Spróbuj połączyć bohaterów, konflikt i temat przewodni.",
    ],
    revealedHints: 0, userAnswer: "", submitted: false,
    feedback: "", feedbackType: "", pointsAwarded: 0, correctAnswerLabel: ""
  };
}

function createTaskY2(presetData = null) {
  const dataObj = presetData ? clone(presetData) : buildTaskY2Data();
  return {
    type: "Y2",
    data: dataObj,
    render() { renderTaskY2(this.data); },
    revealHint(index) {
      if (this.data.submitted) return;
      if (index === 0 && this.data.revealedHints < 1) this.data.revealedHints = 1;
      if (index === 1 && this.data.revealedHints < 2 && this.data.revealedHints >= 1) this.data.revealedHints = 2;
      syncCurrentTaskData();
      this.render();
    },
    setAnswer(value) {
      if (this.data.submitted) return;
      this.data.userAnswer = value;
      syncCurrentTaskData();
    },
    submit() {
      if (this.data.submitted) return;
      const normalized = normalizeText(this.data.userAnswer || "");
      if (!normalized) {
        this.data.feedback = "Wpisz odpowiedź.";
        this.data.feedbackType = "bad";
        syncCurrentTaskData();
        this.render();
        return;
      }
      const motif = getMotifById(this.data.motifId);
      const points = pointsForHints(this.data.revealedHints);
      this.data.submitted = true;
      this.data.pointsAwarded = 0;
      if (motif && motifMatchesAnswer(motif, normalized)) {
        this.data.pointsAwarded = points;
        score += points;
        masteredPairs.add(makePairKey(this.data.bookAId, motif.id));
        masteredPairs.add(makePairKey(this.data.bookBId, motif.id));
        this.data.feedback = `✅ Dobrze! +${points} pkt`;
        this.data.feedbackType = "ok";
      } else {
        const labels = getMotifAnswerVariants(motif);
        this.data.feedback = `❌ Nie tym razem. Poprawna: ${labels.join(" / ")}`;
        this.data.feedbackType = "bad";
      }
      answered = true;
      syncCurrentTaskData();
      renderScore();
      this.render();
      setNextButtonVisible(true);
    }
  };
}

function renderTaskY2(taskData) {
  const el = document.getElementById("quiz-content");
  if (taskData.fallback) {
    el.innerHTML = `<div class="task-card"><h2>Brak dostępnych zadań Y2</h2><p>W obecnym filtrze nie ma pary lektur z wspólnym motywem.</p></div>`;
    setNextButtonVisible(true);
    return;
  }
  const bookA = getBookById(taskData.bookAId);
  const bookB = getBookById(taskData.bookBId);
  const h1v = taskData.revealedHints >= 1;
  const h2v = taskData.revealedHints >= 2;
  // Ikonka 📖 po sprawdzeniu → otwiera profil MOTYWU (bo odpowiadamy na pytanie o motyw łączący lektury)
  const profileBtnHtml = taskData.submitted
    ? `<button class="icon-btn" title="Profil motywu" onclick="openMotif('${escapeHtml(taskData.motifId)}')">📖</button>`
    : "";
  el.innerHTML = `
    <div class="task-card ${taskData.submitted ? "answered" : ""}">
      <div class="open-task-shell">
        <div class="open-task-topline">Y2 • Motywy ${profileBtnHtml}</div>
        <h2 class="open-task-title">Jaki motyw łączy te dwie lektury?</h2>
        <div class="cover-grid">
          <div class="cover-card">${formatCoverVisual(bookA)}<div class="cover-label">${escapeHtml(bookA?.title || "Lektura 1")}</div></div>
          <div class="cover-card">${formatCoverVisual(bookB)}<div class="cover-label">${escapeHtml(bookB?.title || "Lektura 2")}</div></div>
        </div>
        <div class="open-task-visible-hint">
          <div class="hint-title">Instrukcja</div>
          <div class="hint-text">${escapeHtml(taskData.visibleHint)}</div>
        </div>
        <div class="open-task-hidden-grid">
          <div class="hint-card ${h1v ? "revealed" : ""}">
            <div class="hint-title">Podpowiedź 1</div>
            <div class="hint-text">${h1v ? escapeHtml(taskData.hiddenHints[0]) : "Zakryta podpowiedź"}</div>
            <div class="hint-actions">
              <button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(0)" ${taskData.submitted || h1v ? "disabled" : ""}>Odkryj</button>
            </div>
          </div>
          <div class="hint-card ${h2v ? "revealed" : ""}">
            <div class="hint-title">Podpowiedź 2</div>
            <div class="hint-text">${h2v ? escapeHtml(taskData.hiddenHints[1]) : "Zakryta podpowiedź"}</div>
            <div class="hint-actions">
              <button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(1)" ${taskData.submitted || !h1v || h2v ? "disabled" : ""}>Odkryj</button>
            </div>
          </div>
        </div>
        <div class="open-task-input-wrap">
          <label for="y2-answer"><strong>Twoja odpowiedź</strong></label>
          <input id="y2-answer" class="open-task-input" type="text" placeholder="Wpisz nazwę motywu"
            value="${escapeHtml(taskData.userAnswer || "")}"
            oninput="updateCurrentOpenTaskAnswer(this.value)"
            ${taskData.submitted ? "disabled" : ""}>
        </div>
        <div class="open-task-actions">
          <button type="button" onclick="submitCurrentOpenTask()" ${taskData.submitted ? "disabled" : ""}>Sprawdź</button>
        </div>
        <div class="task-feedback ${taskData.feedbackType || ""}">${escapeHtml(taskData.feedback || "")}</div>
      </div>
    </div>`;
  setNextButtonVisible(!!taskData.submitted);
}

// =========================
// ANSWER HANDLERS
// =========================

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
  card.onpointerdown = (e) => { startX = e.clientX; try { card.setPointerCapture(e.pointerId); } catch (_) {} };
  card.onpointerup = (e) => {
    if (startX === null || answered) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 55) handleAnswer(diff < 0 ? "left" : "right");
    startX = null;
  };
  card.onpointercancel = () => { startX = null; };
}

// Otwiera profil pytanego elementu w zadaniu X
function openCurrentTaskProfile() {
  if (!currentTaskData || quizMode !== "engine") return;
  if (currentTaskData.promptType === "book") openBook(currentTaskData.promptId);
  else openMotif(currentTaskData.promptId);
}

function revealCurrentHint(index) {
  if (!currentTask) return;
  if (typeof currentTask.revealHint === "function") currentTask.revealHint(index);
}

function updateCurrentOpenTaskAnswer(value) {
  if (!currentTask) return;
  if (typeof currentTask.setAnswer === "function") currentTask.setAnswer(value);
}

function submitCurrentOpenTask() {
  if (!currentTask || answered) return;
  if (typeof currentTask.submit === "function") currentTask.submit();
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
    el.innerHTML += `<label><input type="checkbox" ${activeEpochs.has(e) ? "checked" : ""} onchange="toggleEpoch('${e}')"> ${e}</label><br>`;
  });
}

function toggleEpoch(epoch) {
  activeEpochs.has(epoch) ? activeEpochs.delete(epoch) : activeEpochs.add(epoch);
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
      list.innerHTML += `<div class="map-item" onclick="openBook('${b.id}')">📚 ${escapeHtml(b.title)}</div>`;
    });
  }
  if (view === "motifs") {
    title.innerText = "🎯 Motywy";
    getFilteredMotifs().forEach(m => {
      list.innerHTML += `<div class="map-item" onclick="openMotif('${m.id}')">🎯 ${escapeHtml(m.name)}</div>`;
    });
  }
}

// =========================
// PROFILE — stos nawigacji
// =========================

// Otwiera profil lektury. Zapamiętuje poprzedni widok na stosie.
function openBook(id) {
  const book = getBookById(id);
  if (!book) return;

  // Zapamiętaj aktualny stan przed wejściem w profil
  if (document.getElementById("profile").style.display === "block") {
    // Już jesteśmy w profilu — dokładamy do stosu
    profileStack.push({ type: "profile" });
  } else {
    // Wchodzimy z mapy lub quizu
    profileStack = [];
    profileReturnTarget = mode === "quiz" ? "quiz" : "map";
    if (mode === "quiz") quizSnapshot = captureQuizState();
  }

  hideAll();
  document.getElementById("profile").style.display = "block";
  renderBookProfile(book);
}

// Otwiera profil motywu. Zapamiętuje poprzedni widok na stosie.
function openMotif(id) {
  const motif = getMotifById(id);
  if (!motif) return;

  if (document.getElementById("profile").style.display === "block") {
    profileStack.push({ type: "profile" });
  } else {
    profileStack = [];
    profileReturnTarget = mode === "quiz" ? "quiz" : "map";
    if (mode === "quiz") quizSnapshot = captureQuizState();
  }

  hideAll();
  document.getElementById("profile").style.display = "block";
  renderMotifProfile(motif);
}

// Pomocnicze: otwiera lekturę będąc już w profilu (klik na chip)
function openBookFromProfile(id) {
  openBook(id);
}

// Pomocnicze: otwiera motyw będąc już w profilu (klik na chip)
function openMotifFromProfile(id) {
  openMotif(id);
}

function renderBookProfile(book) {
  const canGoBack = profileStack.length > 0;
  document.getElementById("profile-content").innerHTML = `
    <h2>📚 ${escapeHtml(book.title)}</h2>
    <p>${escapeHtml(book.description || "")}</p>
    <div class="profile-section">
      <h3>Epoka</h3>
      <div class="profile-chip-list">
        ${book.epoch ? `<span class="profile-chip">${escapeHtml(book.epoch)}</span>` : ""}
      </div>
    </div>
    ${renderBookExtras(book)}
    <br>
    ${canGoBack
      ? `<button onclick="goBackInProfile()">⬅ Wstecz</button>`
      : `<button onclick="returnFromProfile()">${profileReturnTarget === "quiz" ? "⬅ Powrót do ćwiczeń" : "⬅ Powrót"}</button>`
    }`;
}

function renderMotifProfile(motif) {
  const canGoBack = profileStack.length > 0;
  document.getElementById("profile-content").innerHTML = `
    <h2>🎯 ${escapeHtml(motif.name)}</h2>
    <p>${escapeHtml(motif.description || "")}</p>
    ${renderMotifExtras(motif)}
    <br>
    ${canGoBack
      ? `<button onclick="goBackInProfile()">⬅ Wstecz</button>`
      : `<button onclick="returnFromProfile()">${profileReturnTarget === "quiz" ? "⬅ Powrót do ćwiczeń" : "⬅ Powrót"}</button>`
    }`;
}

// Cofnięcie o jeden krok w stosie profili — uproszczone przez przeładowanie historii przeglądarki
// W tej implementacji "wstecz" po prostu wraca do miejsca startowego,
// bo stos śledzi tylko głębokość, nie konkretne ID.
// Dla pełnej historii forward/back przechowujemy ID na stosie:
let profileHistoryStack = [];

function openBook(id) {
  const book = getBookById(id);
  if (!book) return;

  if (document.getElementById("profile").style.display !== "block") {
    profileHistoryStack = [];
    profileReturnTarget = mode === "quiz" ? "quiz" : "map";
    if (mode === "quiz") quizSnapshot = captureQuizState();
  } else {
    profileHistoryStack.push({ kind: "currentContent", html: document.getElementById("profile-content").innerHTML });
  }

  hideAll();
  document.getElementById("profile").style.display = "block";
  renderBookProfile(book);
}

function openMotif(id) {
  const motif = getMotifById(id);
  if (!motif) return;

  if (document.getElementById("profile").style.display !== "block") {
    profileHistoryStack = [];
    profileReturnTarget = mode === "quiz" ? "quiz" : "map";
    if (mode === "quiz") quizSnapshot = captureQuizState();
  } else {
    profileHistoryStack.push({ kind: "currentContent", html: document.getElementById("profile-content").innerHTML });
  }

  hideAll();
  document.getElementById("profile").style.display = "block";
  renderMotifProfile(motif);
}

function openBookFromProfile(id) { openBook(id); }
function openMotifFromProfile(id) { openMotif(id); }

function goBackInProfile() {
  if (!profileHistoryStack.length) { returnFromProfile(); return; }
  const prev = profileHistoryStack.pop();
  document.getElementById("profile-content").innerHTML = prev.html;
}

function returnFromProfile() {
  profileHistoryStack = [];
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
    score, quizMode, selectedBook, selectedMotif,
    scoredPairs: [...scoredPairs], masteredPairs: [...masteredPairs],
    answered, currentTaskType, currentTaskData: clone(currentTaskData), profileReturnTarget
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
  if (quizMode === "diagnostic") { renderDiagnostic(); return; }
  if (quizMode === "engine") {
    if (currentTaskType && currentTaskData) {
      currentTask = createTaskByType(currentTaskType, currentTaskData);
      currentTask.render();
      setNextButtonVisible(answered);
    } else {
      renderEngineNextTask();
    }
  }
}
