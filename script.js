// =========================
// 🧠 STATE
// =========================

let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska", "pozytywizm", "romantyzm", "antyk", "współczesność", "renesans"]);
let score = 0;

let quizMode = "diagnostic";
let selectedBook = null;
let selectedMotif = null;
let scoredPairs = new Set();
let masteredPairs = new Set();

let answered = false;
let currentTaskType = null;
let currentTaskData = null;
let currentTask = null;

let quizSnapshot = null;
let profileReturnTarget = "map";
let profileHistoryStack = [];
let taskBag = [];

const ENGINE_TASK_TYPES = ["X", "Y1", "Y2"];
const ENGINE_TASK_ENABLED = { X: true, Y1: true, Y2: true };

// =========================
// 📚 DATA
// =========================

const data = {
  books: [
    {
      id: "wesele", title: "Wesele",
      description: "Diagnoza społeczeństwa polskiego (niemoc narodowa), symbolizm (zjawy jako uosobienie lęków i marzeń), marazm narodowy (chocholi taniec), rozbicie mitu ludomanii oraz prywata kontra sprawa narodowa",
      epoch: "młoda polska", motifs: ["motywnarodowy", "symbolizm", "ludomania"],
      coverEmoji: "🎭", aliases: ["Wesele Wyspiańskiego"],
      characters: ["Chochoł", "Gospodarz", "Pan Młody", "Rachel", "Stańczyk"],
      quotes: [], images: [{ src: "images/lektury/wesele/wesele_okładka.png" }]
    },
    {
      id: "chłopi", title: "Chłopi",
      description: "Realistyczna powieść ukazująca życie wiejskiej społeczności podporządkowane rytmowi natury, pracy i tradycji.",
      epoch: "młoda polska", motifs: ["naturalizm", "motywmiłości"],
      coverEmoji: "🌾", aliases: ["Chłopi Reymonta"],
      characters: ["Maciej Boryna", "Jagna", "Antek", "Hanka", "Kuba"],
      quotes: [], images: [{ src: "images/lektury/chłopi/Chlopi-plakat-204569-602x802-nobckgr.webp" }]
    },
    {
      id: "antygona", title: "Antygona",
      description: "Nierozwiązywalny konflikt między prawem boskim a prawem państwowym, prowadząca do nieuchronnej katastrofy bohatera.",
      epoch: "antyk", motifs: ["motywbuntu", "fatum"],
      coverEmoji: "🏛️", aliases: ["Antygona Sofoklesa"],
      characters: ["Antygona", "Kreon", "Ismena", "Hajmon", "Tejrezjasz"],
      quotes: [], images: [{ src: "images/lektury/antygona/productGfx_824_500_500.jpg" }]
    },
    {
      id: "tango", title: "Tango",
      description: "Analiza upadku tradycyjnych wartości, w której próba przywrócenia porządku przez młodego intelektualistę kończy się zwycięstwem brutalnej, prymitywnej siły.",
      epoch: "współczesność", motifs: ["motywbuntu", "groteska", "motywrodziny"],
      coverEmoji: "🪑", aliases: ["Tango Mrożka"],
      characters: ["Artur", "Ala", "Edek", "Stomil", "Eleonora"],
      quotes: [], images: [{ src: "images/lektury/tango/plakat-spektakl-Tango-2025.jpg" }]
    },
    {
      id: "magbet", title: "Makbet",
      description: "Studium destrukcyjnej siły ambicji i mechanizmu władzy, który popycha człowieka do zbrodni, skutkując całkowitym rozpadem jego psychiki.",
      epoch: "renesans", motifs: ["motywmiłości", "motywsumienia", "motywszalenstwa", "fatum"],
      coverEmoji: "👑", aliases: ["Macbeth", "Makbet Szekspira"],
      characters: ["Makbet", "Lady Makbet", "Banko", "Duncan", "Makduf", "Wiedźmy"],
      quotes: [], images: [{ src: "images/lektury/magbet/4e4421b6b18d205ec1e82cb4bb61ad53.jpg" }]
    },
    {
      id: "zbrodniaikara", title: "Zbrodnia i kara",
      description: "Psychologiczna opowieść o upadku i odkupieniu człowieka, który morderstwo uzasadnia ideologią, by ostatecznie ulec miażdżącej sile własnego sumienia.",
      epoch: "pozytywizm", motifs: ["motywmiłości", "motywsumienia"],
      coverEmoji: "🕯️", aliases: ["Zbrodnia i Kara", "Zbrodnia i kara Dostojewskiego"],
      characters: ["Raskolnikow", "Sonia", "Porfiry", "Dunia", "Swidrygajłow"],
      quotes: [],images: [{ src: "images/lektury/zbrodnia i kara/1198.-ZBRODNIA_i_KARA.jpg" }]
    },
    {
      id: "innyswiat", title: "Inny świat",
      description: "Świadectwo nieludzkiego systemu sowieckich łagrów, testującego granice człowieczeństwa w warunkach głodu, pracy ponad siły i wszechobecnego terroru.",
      epoch: "współczesność", motifs: ["totalitaryzm"],
      coverEmoji: "⛓️", aliases: ["Inny Świat Herlinga-Grudzińskiego"],
      characters: ["Narrator", "więźniowie łagru"],
      quotes: [], images: [{ src: "images/lektury/inny świat/images (2).jpeg" }]
    },
    {
      id: "1984", title: "Rok 1984",
      description: "Przerażająca wizja państwa totalitarnego, w którym Partia sprawuje absolutną kontrolę nad czynami, przeszłością, a nawet myślami i uczuciami jednostki.",
      epoch: "współczesność", motifs: ["totalitaryzm", "motywmiłości"],
      coverEmoji: "📕", aliases: ["1984", "Rok tysiąc dziewięćset osiemdziesiąty czwarty"],
      characters: ["Winston", "Julia", "O'Brien", "Wielki Brat", "Parsons"],
      quotes: [], images: [{ src: "images/lektury/1984/il_1080xN.5882175820_6how.webp" }]
    },
  ],
  motifs: [
    { id: "motywnarodowy", name: "Motyw Narodowy", description: "Problematyka kondycji narodu", books: ["wesele"], aliases: ["naród", "motyw narodu"], images: [{ src: "images/motywy/naród/wallpaperflare.com_wallpaper.jpg" }] },
    { id: "symbolizm", name: "Symbolizm", description: "Posługiwanie się wieloznacznymi obrazami do wyrażania stanów duszy i treści niewyrażalnych wprost", books: ["wesele"], aliases: ["symboliczność"], images: [{ src: "images/motywy/symbolizm/Bledne_kolo.jpg" }] },
    { id: "ludomania", name: "Ludomania", description: "Powierzchowna fascynacja wsią i życiem chłopów jako źródłem pierwotnej energii", books: ["wesele"], aliases: ["ludofilia"], images: [{ src: "images/motywy/ludomania/Włodzimierz_Tetmajer_-_Blessing_of_Easter_Food_-_MNK_II-b-9_-_National_Museum_Kraków.jpg" }] },
    { id: "naturalizm", name: "Naturalizm", description: "Ukazanie człowieka jako istoty zdeterminowanej przez biologię, instynkty i walkę o byt", books: ["chłopi"], aliases: ["naturalistyczny obraz świata"], images: [{ src: "images/motywy/naturalizm/Aleksander_Gierymski,_Żydówka_z_pomarańczami.jpg" }] },
    { id: "motywmiłości", name: "Motyw Miłości", description: "Przedstawienie relacji miłosnej", books: ["chłopi", "magbet", "zbrodniaikara", "1984"], aliases: ["miłość", "motyw miłości"], images: [{ src: "images/motywy/motyw_miłosci/960px-Gustav_Klimt_016.jpg" }] },
    { id: "motywbuntu", name: "Motyw Buntu", description: "Sprzeciw wobec zastanego porządku, losu lub władzy", books: ["wesele", "antygona", "tango"], aliases: ["bunt", "motyw buntu"] , images: [{ src: "images/motywy/bunt/Eugène_Delacroix_-_La_liberté_guidant_le_peuple.jpg" }]},
    { id: "fatum", name: "Fatum", description: "Personifikacja nieuchronnego, nieodwracalnego losu, nieodwołalnej woli bogów, na którą nikt nie ma wpływu.", books: ["antygona", "magbet"], aliases: ["los", "przeznaczenie"] , images: [{ src: "images/motywy/fatum/Francisco_de_Goya,_Saturno_devorando_a_su_hijo_(1819-1823).jpg" }]},
    { id: "groteska", name: "Groteska", description: "Połączenie w jednym dziele jednocześnie występujących pierwiastków przeciwstawnych", books: ["tango"], aliases: ["groteskowość"], images: [{ src: "images/motywy/groteska/El_jardín_de_las_Delicias,_de_El_Bosco.jpg" }] },
    { id: "motywrodziny", name: "Motyw Rodziny", description: "Przedstawienie i problematyka relacji rodzinnych", books: ["tango"], aliases: ["rodzina", "motyw rodziny"], images: [{ src: "images/motywy/rodzina/Jan_Matejko_-_Portret_trojga_dzieci_artysty.jpg" }] },
    { id: "motywsumienia", name: "Motyw Sumienia", description: "Wewnętrzny głos moralny, który staje się głównym sędzią i katem bohatera po dokonaniu zła", books: ["magbet", "zbrodniaikara"], aliases: ["sumienie", "wyrzuty sumienia"], images: [{ src: "images/motywy/sumienie/960px-Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg" }] },
    { id: "motywszalenstwa", name: "Motyw Szaleństwa", description: "Sposób przedstawienia bohatera, którego psychika ulega dezintegracji pod wpływem skrajnych emocji, poczucia winy lub traumy", books: ["magbet", "antygona"], aliases: ["szaleństwo", "obłęd"] , images: [{ src: "images/motywy/szaleństwo/Van_Gogh_-_Selbstbildnis_mit_verbundenem_Ohr.jpeg" }]},
    { id: "totalitaryzm", name: "Totalitaryzm", description: "System polityczny dążący do pełnej unifikacji społeczeństwa i zniszczenia indywidualizmu", books: ["magbet", "innyswiat", "1984"], aliases: ["motyw totalitaryzmu", "system totalitarny"] , images: [{ src: "images/motywy/totalitaryzm/Guernica_reproduction_on_tiled_wall,_Guernica,_Spain_(PPL3-Altered)_julesvernex2.jpg" }]},
  ]
};   

const epochs = ["młoda polska", "pozytywizm", "romantyzm", "antyk", "współczesność", "renesans"];

// =========================
// HELPERS
// =========================

function clone(v) { return v === null || v === undefined ? v : JSON.parse(JSON.stringify(v)); }
function pickRandom(items) { if (!items || !items.length) return null; return items[Math.floor(Math.random() * items.length)]; }
function makePairKey(bId, mId) { return [`book:${bId}`, `motif:${mId}`].sort().join("|"); }
function isMasteredPair(bId, mId) { return masteredPairs.has(makePairKey(bId, mId)); }
function isScoredPair(bId, mId) { return scoredPairs.has(makePairKey(bId, mId)); }
function getBookById(id) { return data.books.find(b => b.id === id) || null; }
function getMotifById(id) { return data.motifs.find(m => m.id === id) || null; }

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function uniqueStrings(items) { return [...new Set((items || []).map(v => String(v || "").trim()).filter(Boolean))]; }
function normalizeText(v) {
  return String(v ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function escapeHtml(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function truncateText(s, max = 140) { const t = String(s ?? ""); return t.length > max ? `${t.slice(0, max).trim()}…` : t; }
function setNextButtonVisible(v) { document.getElementById("nextBtn").style.display = v ? "inline-block" : "none"; }
function syncCurrentTaskData() { if (currentTask && currentTask.data) currentTaskData = clone(currentTask.data); }
function pointsForHints(n) { if (n <= 0) return 80; if (n === 1) return 60; return 40; }
function getBookAnswerVariants(book) { return uniqueStrings([book?.title, ...(book?.aliases || [])]); }
function getMotifAnswerVariants(motif) { return uniqueStrings([motif?.name, ...(motif?.aliases || [])]); }
function bookMatchesAnswer(book, answer) { const n = normalizeText(answer); return getBookAnswerVariants(book).some(v => normalizeText(v) === n); }
function motifMatchesAnswer(motif, answer) { const n = normalizeText(answer); return getMotifAnswerVariants(motif).some(v => normalizeText(v) === n); }

function formatCoverVisual(book) {
  const imgSrc = book?.images?.[0]?.src || book?.coverImage || null;
  if (imgSrc) {
    return `<div class="cover-visual"><img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(book?.title || "")}"></div>`;
  }
  return `<div class="cover-visual"><div class="cover-emoji">${escapeHtml(book?.coverEmoji || "📘")}</div></div>`;
}

// =========================
// PROFILE EXTRAS
// =========================

function renderBookExtras(book) {
  const characters = uniqueStrings(book?.characters || []);
  const quotes = uniqueStrings(book?.quotes || []);
  const images = book?.images || [];
  const motifObjects = (book?.motifs || []).map(getMotifById).filter(Boolean);

  // Buduj HTML zdjęć
  let imagesHtml = "";
  if (images.length) {
    const imgItems = images.map(img => {
      if (img?.src) {
        return `<img class="profile-image-item" src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.label || book.title)}">`;
      }
      const label = typeof img === "string" ? img : (img.label || img.alt || "");
      return label ? `<div class="profile-image-placeholder">📷</div>` : "";
    }).filter(Boolean).join("");
    if (imgItems) {
      imagesHtml = `<div class="profile-section"><h3>Obrazy</h3><div class="profile-image-grid">${imgItems}</div></div>`;
    }
  }

  return `
    ${motifObjects.length ? `<div class="profile-section"><h3>Motywy</h3><div class="profile-chip-list">${motifObjects.map(m => `<span class="profile-chip clickable" onclick="openMotifFromProfile('${m.id}')">🎯 ${escapeHtml(m.name)}</span>`).join("")}</div></div>` : ""}
    ${characters.length ? `<div class="profile-section"><h3>Bohaterowie</h3><div class="profile-chip-list">${characters.map(c => `<span class="profile-chip">${escapeHtml(c)}</span>`).join("")}</div></div>` : ""}
    ${quotes.length ? `<div class="profile-section"><h3>Fragmenty / cytaty</h3><div class="profile-media-list">${quotes.map(q => `<div class="profile-media-item">„${escapeHtml(q)}"</div>`).join("")}</div></div>` : ""}
    ${imagesHtml}
  `;
}

function renderMotifExtras(motif) {
  const bookObjects = (motif?.books || []).map(getBookById).filter(Boolean);
  const images = motif?.images || [];

  let imagesHtml = "";
  if (images.length) {
    const imgItems = images.map(img => {
      if (img?.src) {
        return `<img class="profile-image-item" src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.label || motif.name)}">`;
      }
      const label = typeof img === "string" ? img : (img.label || img.alt || "");
      return label ? `<div class="profile-image-placeholder">📷</div>` : "";
    }).filter(Boolean).join("");
    if (imgItems) {
      imagesHtml = `<div class="profile-section"><h3>Obrazy</h3><div class="profile-image-grid">${imgItems}</div></div>`;
    }
  }

  return `
    ${bookObjects.length ? `<div class="profile-section"><h3>Lektury z tym motywem</h3><div class="profile-chip-list">${bookObjects.map(b => `<span class="profile-chip clickable" onclick="openBookFromProfile('${b.id}')">📚 ${escapeHtml(b.title)}</span>`).join("")}</div></div>` : ""}
    ${imagesHtml}
  `;
}

// =========================
// SCREEN CONTROL
// =========================

function goScreen(n) {
  document.querySelectorAll(".onboard-screen").forEach(s => s.classList.remove("active"));
  ["map", "quiz", "profile"].forEach(id => document.getElementById(id).style.display = "none");

  if (n === 1) { document.getElementById("screen-start").classList.add("active"); }
  if (n === 2) { document.getElementById("screen-mode").classList.add("active"); }
  if (n === 3) { document.getElementById("screen-epoch").classList.add("active"); renderEpochFilter(); }
}

function hideAll() {
  document.querySelectorAll(".onboard-screen").forEach(s => s.classList.remove("active"));
  ["map", "quiz", "profile"].forEach(id => document.getElementById(id).style.display = "none");
}

// =========================
// SETTINGS — z wizualnym stanem przycisków
// =========================

function setMode(m) {
  mode = m;
  document.getElementById("btn-learning").classList.toggle("active", m === "learning");
  document.getElementById("btn-quiz").classList.toggle("active", m === "quiz");
}

function setView(v) {
  view = v;
  document.getElementById("btn-books").classList.toggle("active", v === "books");
  document.getElementById("btn-motifs").classList.toggle("active", v === "motifs");
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
  document.getElementById("quiz").style.display = "block";
  startQuiz();
}

// =========================
// QUIZ
// =========================

function startQuiz() {
  score = 0; quizMode = "diagnostic";
  selectedBook = null; selectedMotif = null;
  scoredPairs = new Set(); masteredPairs = new Set();
  answered = false; currentTaskType = null; currentTaskData = null; currentTask = null;
  document.getElementById("quiz-label").textContent = "Diagnostyka";
  renderScore();
  renderDiagnostic();
}

function renderDiagnostic() {
  const el = document.getElementById("quiz-content");
  setNextButtonVisible(true);
  el.innerHTML = `
    <p class="small-note">Połącz jak największą ilość zagadnień z lekturami</p>
    <div class="diagnostic-layout">
      <div><h3 style="font-family:var(--ff-sans);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;font-weight:400">Lektury</h3>${getFilteredBooks().map(renderDiagnosticBook).join("")}</div>
      <div><h3 style="font-family:var(--ff-sans);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;font-weight:400">Motywy</h3>${getFilteredMotifs().map(renderDiagnosticMotif).join("")}</div>
    </div>`;
}

function renderDiagnosticBook(book) {
  const sel = selectedBook === book.id ? "selected" : "";
  return `<div class="quiz-item ${sel}"><div class="item-main" onclick="selectDiagnosticBook('${book.id}')">📚 ${escapeHtml(book.title)}</div><button type="button" class="icon-btn" onclick="event.stopPropagation();openBook('${book.id}')">📖</button></div>`;
}

function renderDiagnosticMotif(motif) {
  const sel = selectedMotif === motif.id ? "selected" : "";
  return `<div class="quiz-item ${sel}"><div class="item-main" onclick="selectDiagnosticMotif('${motif.id}')">🎯 ${escapeHtml(motif.name)}</div><button type="button" class="icon-btn" onclick="event.stopPropagation();openMotif('${motif.id}')">📖</button></div>`;
}

function selectDiagnosticBook(id) { if (quizMode !== "diagnostic") return; selectedBook = id; tryDiagnosticMatch(); renderDiagnostic(); }
function selectDiagnosticMotif(id) { if (quizMode !== "diagnostic") return; selectedMotif = id; tryDiagnosticMatch(); renderDiagnostic(); }

function tryDiagnosticMatch() {
  if (!selectedBook || !selectedMotif) return;
  const book = getBookById(selectedBook);
  if (!book) return;
  const pairKey = makePairKey(selectedBook, selectedMotif);
  const isCorrect = book.motifs.includes(selectedMotif);
  if (!isScoredPair(selectedBook, selectedMotif)) {
    if (isCorrect) { score += 100; masteredPairs.add(pairKey); } else score -= 50;
    scoredPairs.add(pairKey);
  }
  selectedBook = null; selectedMotif = null;
  renderScore();
}

// =========================
// ENGINE
// =========================
function getTaskImage(taskData) {
  if (taskData.promptType === "book") {
    const book = getBookById(taskData.promptId);
    return book?.images?.[0] || null;
  } else {
    const motif = getMotifById(taskData.promptId);
    return motif?.images?.[0] || null;
  }
}

function availableTaskTypes() {
  return ENGINE_TASK_TYPES.filter(t => {
    if (!ENGINE_TASK_ENABLED[t]) return false;
    if (t === "Y1" && view !== "books") return false;
    if (t === "Y2" && view !== "motifs") return false;
    return true;
  });
}

function refillTaskBag() { taskBag = shuffle(availableTaskTypes()); }
function getNextTaskType() { if (!taskBag.length) refillTaskBag(); return taskBag.pop() || null; }

function startEngine() {
  quizMode = "engine";
  answered = false; currentTaskType = null; currentTaskData = null; currentTask = null; taskBag = [];
  document.getElementById("quiz-label").textContent = "Ćwiczenia";
  setNextButtonVisible(false);
  renderEngineNextTask();
}

function renderEngineNextTask() {
  answered = false; setNextButtonVisible(false);
  const type = getNextTaskType();
  if (!type) { document.getElementById("quiz-content").innerHTML = `<div class="task-card"><h2>Brak aktywnych typów zadań</h2></div>`; return; }
  currentTaskType = type;
  currentTask = createTaskByType(type);
  currentTaskData = clone(currentTask.data);
  currentTask.render();
}

function finishDiagnosticAndStartEngine() { startEngine(); }

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
  if (view === "motifs") { const m = getFilteredMotifs(); const av = m.filter(x => x.books.some(bId => !isMasteredPair(bId, x.id))); return av.length ? av : m; }
  const b = getFilteredBooks(); const av = b.filter(x => x.motifs.some(mId => !isMasteredPair(x.id, mId))); return av.length ? av : b;
}

function buildTaskXData() {
  if (view === "motifs") {
    const promptMotif = pickRandom(getTaskXPromptCandidates()); if (!promptMotif) return fallbackTaskXData();
    const cb = promptMotif.books.map(getBookById).filter(Boolean).filter(b => !isMasteredPair(b.id, promptMotif.id));
    const correctBook = pickRandom(cb.length ? cb : promptMotif.books.map(getBookById).filter(Boolean)); if (!correctBook) return fallbackTaskXData();
    let wb = getFilteredBooks().filter(b => !promptMotif.books.includes(b.id) && b.id !== correctBook.id);
    if (!wb.length) wb = getFilteredBooks().filter(b => b.id !== correctBook.id);
    const wrongBook = pickRandom(wb) || getFilteredBooks().find(b => b.id !== correctBook.id) || null;
    if (!wrongBook || wrongBook.id === correctBook.id) return fallbackTaskXData();
    const cl = Math.random() < .5;
    return { promptType: "motif", promptId: promptMotif.id, promptTitle: promptMotif.name, promptDescription: promptMotif.description, optionType: "book", leftId: cl ? correctBook.id : wrongBook.id, rightId: cl ? wrongBook.id : correctBook.id, correctSide: cl ? "left" : "right", correctBookId: correctBook.id };
  }
  const promptBook = pickRandom(getTaskXPromptCandidates()); if (!promptBook) return fallbackTaskXData();
  const cm = promptBook.motifs.map(getMotifById).filter(Boolean).filter(m => !isMasteredPair(promptBook.id, m.id));
  const correctMotif = pickRandom(cm.length ? cm : promptBook.motifs.map(getMotifById).filter(Boolean)); if (!correctMotif) return fallbackTaskXData();
  let wm = getFilteredMotifs().filter(m => !promptBook.motifs.includes(m.id) && m.id !== correctMotif.id);
  if (!wm.length) wm = getFilteredMotifs().filter(m => m.id !== correctMotif.id);
  const wrongMotif = pickRandom(wm) || getFilteredMotifs().find(m => m.id !== correctMotif.id) || null;
  if (!wrongMotif || wrongMotif.id === correctMotif.id) return fallbackTaskXData();
  const cl = Math.random() < .5;
  return { promptType: "book", promptId: promptBook.id, promptTitle: promptBook.title, promptDescription: promptBook.description, optionType: "motif", leftId: cl ? correctMotif.id : wrongMotif.id, rightId: cl ? wrongMotif.id : correctMotif.id, correctSide: cl ? "left" : "right", correctMotifId: correctMotif.id };
}

function fallbackTaskXData() {
  const book = getFilteredBooks()[0]; const motif = getFilteredMotifs()[0];
  return { promptType: view === "motifs" ? "motif" : "book", promptId: view === "motifs" ? (motif ? motif.id : null) : (book ? book.id : null), promptTitle: view === "motifs" ? (motif ? motif.name : "Brak motywu") : (book ? book.title : "Brak lektury"), promptDescription: "", optionType: view === "motifs" ? "book" : "motif", leftId: null, rightId: null, correctSide: "left", correctBookId: null, correctMotifId: null, fallback: true };
}

function createTaskX(presetData = null) {
  const dataObj = presetData || buildTaskXData();
  return {
    type: "X", data: dataObj,
    render() { renderTaskX(this.data); attachTaskXSwipeHandlers(); },
    submit(side) {
      this.data._chosenSide = side;
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

  const leftItem = taskData.optionType === "motif"
    ? getMotifById(taskData.leftId)
    : getBookById(taskData.leftId);
  const rightItem = taskData.optionType === "motif"
    ? getMotifById(taskData.rightId)
    : getBookById(taskData.rightId);

  const leftLabel  = leftItem?.name  || leftItem?.title  || "?";
  const rightLabel = rightItem?.name || rightItem?.title || "?";

  // Obrazek pytanego elementu
  const promptItem = taskData.promptType === "book"
    ? getBookById(taskData.promptId)
    : getMotifById(taskData.promptId);

  const imgSrc = promptItem?.images?.[0]?.src || null;
  const imgHtml = imgSrc
    ? `<img class="tinder-card-img" src="${escapeHtml(imgSrc)}" alt="${escapeHtml(promptItem?.title || promptItem?.name || "")}">`
    : `<div class="tinder-card-img-placeholder">${escapeHtml(promptItem?.coverEmoji || (taskData.promptType === "book" ? "📚" : "🎯"))}</div>`;

  const profileBtn = answeredState
    ? `<button class="icon-btn" style="font-size:14px" onclick="openCurrentTaskProfile()">📖</button>`
    : "";

  // Stan odpowiedzi — kolorowanie choices
  let leftClass = "", rightClass = "";
  if (answeredState) {
    const correctSide = taskData.correctSide;
    leftClass  = correctSide === "left"  ? "reveal-correct" : (taskData._chosenSide === "left"  ? "chosen-wrong" : "");
    rightClass = correctSide === "right" ? "reveal-correct" : (taskData._chosenSide === "right" ? "chosen-wrong" : "");
  }

  el.innerHTML = `
    <div class="tinder-wrap" id="tinderWrap">
      <div class="tinder-label">${taskData.promptType === "book" ? "Lektura" : "Motyw"} ${profileBtn}</div>
      <div class="tinder-question">${escapeHtml(taskData.promptTitle)}</div>

      <div class="tinder-card-stage">
        <div class="tinder-card" id="tinderCard">
          ${imgHtml}
          <div class="tinder-card-name">${escapeHtml(taskData.promptTitle)}</div>
          <div class="tinder-overlay tinder-overlay-left"  id="overlayLeft">← Nie</div>
          <div class="tinder-overlay tinder-overlay-right" id="overlayRight">Tak →</div>
        </div>
      </div>

      <div class="tinder-hint">${answeredState ? "" : "← przeciągnij lub kliknij →"}</div>

      <div class="tinder-choices">
        <div class="tinder-choice ${leftClass}"
          onclick="${answeredState ? "" : "handleAnswer('left')"}"
          style="${answeredState ? "cursor:default" : ""}">
          ${escapeHtml(leftLabel)}
        </div>
        <div class="tinder-choice ${rightClass}"
          onclick="${answeredState ? "" : "handleAnswer('right')"}"
          style="${answeredState ? "cursor:default" : ""}">
          ${escapeHtml(rightLabel)}
        </div>
      </div>
    </div>`;

  if (!answeredState) attachTaskXSwipeHandlers();
}

// =========================
// TASK Y1
// =========================

function buildY1Candidates() {
  const filteredMotifIds = new Set(getFilteredMotifs().map(m => m.id));
  const candidates = [];
  getFilteredBooks().forEach(book => { (book.motifs || []).forEach(motifId => { if (filteredMotifIds.has(motifId)) candidates.push({ bookId: book.id, motifId }); }); });
  return candidates;
}

function buildY1HintPool(book, motif) {
  const pool = [];
  if (book?.characters?.length) pool.push(`W utworze pojawia się postać: ${book.characters.slice(0, 2).join(", ")}`);
  if (book?.images?.length) { const img = book.images[0]; const label = typeof img === "string" ? img : (img.label || img.alt || img.caption || ""); if (label) pool.push(`Obraz / symbol: ${label}`); }
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
  const book = getBookById(candidate.bookId); const motif = getMotifById(candidate.motifId);
  if (!book || !motif) return { fallback: true, type: "Y1" };
  const visibleHint = `Motyw: ${motif.description || motif.name}`;
  const hiddenPool = buildY1HintPool(book, motif).filter(h => normalizeText(h) !== normalizeText(visibleHint));
  return { fallback: false, type: "Y1", motifId: motif.id, targetBookId: book.id, acceptedBookIds: uniqueStrings([...(motif.books || []).filter(id => getBookById(id))]), visibleHint, hiddenHints: [hiddenPool[0] || `Epoka utworu: ${book.epoch || "nieznana"}`, hiddenPool[1] || `Jednym z tropów są bohaterowie i świat przedstawiony.`], revealedHints: 0, userAnswer: "", submitted: false, feedback: "", feedbackType: "", pointsAwarded: 0, correctAnswerLabel: "" };
}

function createTaskY1(presetData = null) {
  const dataObj = presetData ? clone(presetData) : buildTaskY1Data();
  return {
    type: "Y1", data: dataObj,
    render() { renderTaskY1(this.data); },
    revealHint(index) {
      if (this.data.submitted) return;
      if (index === 0 && this.data.revealedHints < 1) this.data.revealedHints = 1;
      if (index === 1 && this.data.revealedHints < 2 && this.data.revealedHints >= 1) this.data.revealedHints = 2;
      syncCurrentTaskData(); this.render();
    },
    setAnswer(value) { if (this.data.submitted) return; this.data.userAnswer = value; syncCurrentTaskData(); },
    submit() {
      if (this.data.submitted) return;
      const normalized = normalizeText(this.data.userAnswer || "");
      if (!normalized) { this.data.feedback = "Wpisz odpowiedź."; this.data.feedbackType = "bad"; syncCurrentTaskData(); this.render(); return; }
      const matchedBook = this.data.acceptedBookIds.map(getBookById).find(b => b && bookMatchesAnswer(b, normalized));
      const points = pointsForHints(this.data.revealedHints);
      this.data.submitted = true; this.data.pointsAwarded = 0;
      if (matchedBook) { this.data.pointsAwarded = points; score += points; masteredPairs.add(makePairKey(matchedBook.id, this.data.motifId)); this.data.feedback = `✅ Dobrze! +${points} pkt`; this.data.feedbackType = "ok"; }
      else { const labels = this.data.acceptedBookIds.map(getBookById).filter(Boolean).map(b => b.title); this.data.feedback = `❌ Nie tym razem. Poprawna: ${labels.join(" / ")}`; this.data.feedbackType = "bad"; }
      answered = true; syncCurrentTaskData(); renderScore(); this.render(); setNextButtonVisible(true);
    }
  };
}

function renderTaskY1(taskData) {
  const el = document.getElementById("quiz-content");
  if (taskData.fallback) { el.innerHTML = `<div class="task-card"><h2>Brak dostępnych zadań Y1</h2><p>W obecnym filtrze nie ma pary motyw–lektura.</p></div>`; setNextButtonVisible(true); return; }
  const h1v = taskData.revealedHints >= 1, h2v = taskData.revealedHints >= 2;
  const profileBtn = taskData.submitted ? `<button class="icon-btn" onclick="openMotif('${escapeHtml(taskData.motifId)}')">📖</button>` : "";
  el.innerHTML = `
    <div class="task-card ${taskData.submitted ? "answered" : ""}"><div class="open-task-shell">
      <div class="open-task-topline">Y1 · Lektury ${profileBtn}</div>
      <h2 class="open-task-title">Podaj tytuł lektury</h2>
      <div class="open-task-visible-hint"><div class="hint-title">Podpowiedź 1</div><div class="hint-text">${escapeHtml(taskData.visibleHint)}</div></div>
      <div class="open-task-hidden-grid">
        <div class="hint-card ${h1v ? "revealed" : ""}"><div class="hint-title">Podpowiedź 2</div><div class="hint-text">${h1v ? escapeHtml(taskData.hiddenHints[0]) : "Zakryta podpowiedź"}</div><div class="hint-actions"><button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(0)" ${taskData.submitted || h1v ? "disabled" : ""}>Odkryj</button></div></div>
        <div class="hint-card ${h2v ? "revealed" : ""}"><div class="hint-title">Podpowiedź 3</div><div class="hint-text">${h2v ? escapeHtml(taskData.hiddenHints[1]) : "Zakryta podpowiedź"}</div><div class="hint-actions"><button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(1)" ${taskData.submitted || !h1v || h2v ? "disabled" : ""}>Odkryj</button></div></div>
      </div>
      <div class="open-task-input-wrap"><label for="y1-answer">Twoja odpowiedź</label><input id="y1-answer" class="open-task-input" type="text" placeholder="Wpisz tytuł lektury" value="${escapeHtml(taskData.userAnswer || "")}" oninput="updateCurrentOpenTaskAnswer(this.value)" ${taskData.submitted ? "disabled" : ""}></div>
      <div class="open-task-actions"><button type="button" onclick="submitCurrentOpenTask()" ${taskData.submitted ? "disabled" : ""}>Sprawdź</button></div>
      <div class="task-feedback ${taskData.feedbackType || ""}">${escapeHtml(taskData.feedback || "")}</div>
    </div></div>`;
  setNextButtonVisible(!!taskData.submitted);
}

// =========================
// TASK Y2
// =========================

function buildY2Candidates() {
  const filteredBookIds = new Set(getFilteredBooks().map(b => b.id));
  const candidates = [];
  getFilteredMotifs().forEach(motif => {
    const books = (motif.books || []).map(getBookById).filter(b => b && filteredBookIds.has(b.id));
    if (books.length < 2) return;
    for (let i = 0; i < books.length; i++) for (let j = i + 1; j < books.length; j++) candidates.push({ motifId: motif.id, bookAId: books[i].id, bookBId: books[j].id });
  });
  return candidates;
}

function buildY2HintPool(motif, bookA, bookB) {
  const pool = [];
  if (motif?.description) pool.push(`Wspólny motyw wiąże się z: ${truncateText(motif.description, 120)}`);
  const chars = uniqueStrings([...(bookA?.characters || []), ...(bookB?.characters || [])]);
  if (chars.length) pool.push(`W jednej z lektur pojawia się: ${chars.slice(0, 2).join(", ")}`);
  if (bookA?.images?.length) { const img = bookA.images[0]; const label = typeof img === "string" ? img : (img.label || img.alt || img.caption || ""); if (label) pool.push(`Na jednym obrazie/symbolu ważne jest: ${label}`); }
  if (bookB?.images?.length) { const img = bookB.images[0]; const label = typeof img === "string" ? img : (img.label || img.alt || img.caption || ""); if (label) pool.push(`Druga lektura podpowiada przez obraz: ${label}`); }
  if (bookA?.epoch && bookB?.epoch) pool.push(`Epoki utworów: ${bookA.epoch} / ${bookB.epoch}`);
  return uniqueStrings(pool);
}

function buildTaskY2Data() {
  const candidates = buildY2Candidates();
  if (!candidates.length) return { fallback: true, type: "Y2" };
  const candidate = pickRandom(candidates);
  const motif = getMotifById(candidate.motifId); const bookA = getBookById(candidate.bookAId); const bookB = getBookById(candidate.bookBId);
  if (!motif || !bookA || !bookB) return { fallback: true, type: "Y2" };
  const hiddenPool = buildY2HintPool(motif, bookA, bookB);
  return { fallback: false, type: "Y2", motifId: motif.id, bookAId: bookA.id, bookBId: bookB.id, visibleHint: "Dwie okładki łączy jeden wspólny motyw. Wpisz jego nazwę.", hiddenHints: [hiddenPool[0] || "Zwróć uwagę na sens obu utworów.", hiddenPool[1] || "Spróbuj połączyć bohaterów, konflikt i temat przewodni."], revealedHints: 0, userAnswer: "", submitted: false, feedback: "", feedbackType: "", pointsAwarded: 0, correctAnswerLabel: "" };
}

function createTaskY2(presetData = null) {
  const dataObj = presetData ? clone(presetData) : buildTaskY2Data();
  return {
    type: "Y2", data: dataObj,
    render() { renderTaskY2(this.data); },
    revealHint(index) {
      if (this.data.submitted) return;
      if (index === 0 && this.data.revealedHints < 1) this.data.revealedHints = 1;
      if (index === 1 && this.data.revealedHints < 2 && this.data.revealedHints >= 1) this.data.revealedHints = 2;
      syncCurrentTaskData(); this.render();
    },
    setAnswer(value) { if (this.data.submitted) return; this.data.userAnswer = value; syncCurrentTaskData(); },
    submit() {
      if (this.data.submitted) return;
      const normalized = normalizeText(this.data.userAnswer || "");
      if (!normalized) { this.data.feedback = "Wpisz odpowiedź."; this.data.feedbackType = "bad"; syncCurrentTaskData(); this.render(); return; }
      const motif = getMotifById(this.data.motifId);
      const points = pointsForHints(this.data.revealedHints);
      this.data.submitted = true; this.data.pointsAwarded = 0;
      if (motif && motifMatchesAnswer(motif, normalized)) { this.data.pointsAwarded = points; score += points; masteredPairs.add(makePairKey(this.data.bookAId, motif.id)); masteredPairs.add(makePairKey(this.data.bookBId, motif.id)); this.data.feedback = `✅ Dobrze! +${points} pkt`; this.data.feedbackType = "ok"; }
      else { const labels = getMotifAnswerVariants(motif); this.data.feedback = `❌ Nie tym razem. Poprawna: ${labels.join(" / ")}`; this.data.feedbackType = "bad"; }
      answered = true; syncCurrentTaskData(); renderScore(); this.render(); setNextButtonVisible(true);
    }
  };
}

function renderTaskY2(taskData) {
  const el = document.getElementById("quiz-content");
  if (taskData.fallback) { el.innerHTML = `<div class="task-card"><h2>Brak dostępnych zadań Y2</h2><p>W obecnym filtrze nie ma pary lektur z wspólnym motywem.</p></div>`; setNextButtonVisible(true); return; }
  const bookA = getBookById(taskData.bookAId); const bookB = getBookById(taskData.bookBId);
  const h1v = taskData.revealedHints >= 1, h2v = taskData.revealedHints >= 2;
  const profileBtn = taskData.submitted ? `<button class="icon-btn" onclick="openMotif('${escapeHtml(taskData.motifId)}')">📖</button>` : "";
  el.innerHTML = `
    <div class="task-card ${taskData.submitted ? "answered" : ""}"><div class="open-task-shell">
      <div class="open-task-topline">Y2 · Motywy ${profileBtn}</div>
      <h2 class="open-task-title">Jaki motyw łączy te dwie lektury?</h2>
      <div class="cover-grid">
        <div class="cover-card">${formatCoverVisual(bookA)}<div class="cover-label">${escapeHtml(bookA?.title || "Lektura 1")}</div></div>
        <div class="cover-card">${formatCoverVisual(bookB)}<div class="cover-label">${escapeHtml(bookB?.title || "Lektura 2")}</div></div>
      </div>
      <div class="open-task-visible-hint"><div class="hint-title">Instrukcja</div><div class="hint-text">${escapeHtml(taskData.visibleHint)}</div></div>
      <div class="open-task-hidden-grid">
        <div class="hint-card ${h1v ? "revealed" : ""}"><div class="hint-title">Podpowiedź 1</div><div class="hint-text">${h1v ? escapeHtml(taskData.hiddenHints[0]) : "Zakryta podpowiedź"}</div><div class="hint-actions"><button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(0)" ${taskData.submitted || h1v ? "disabled" : ""}>Odkryj</button></div></div>
        <div class="hint-card ${h2v ? "revealed" : ""}"><div class="hint-title">Podpowiedź 2</div><div class="hint-text">${h2v ? escapeHtml(taskData.hiddenHints[1]) : "Zakryta podpowiedź"}</div><div class="hint-actions"><button type="button" class="hint-reveal-btn" onclick="revealCurrentHint(1)" ${taskData.submitted || !h1v || h2v ? "disabled" : ""}>Odkryj</button></div></div>
      </div>
      <div class="open-task-input-wrap"><label for="y2-answer">Twoja odpowiedź</label><input id="y2-answer" class="open-task-input" type="text" placeholder="Wpisz nazwę motywu" value="${escapeHtml(taskData.userAnswer || "")}" oninput="updateCurrentOpenTaskAnswer(this.value)" ${taskData.submitted ? "disabled" : ""}></div>
      <div class="open-task-actions"><button type="button" onclick="submitCurrentOpenTask()" ${taskData.submitted ? "disabled" : ""}>Sprawdź</button></div>
      <div class="task-feedback ${taskData.feedbackType || ""}">${escapeHtml(taskData.feedback || "")}</div>
    </div></div>`;
  setNextButtonVisible(!!taskData.submitted);
}

// =========================
// ANSWER HANDLERS
// =========================

function handleAnswer(side) { if (quizMode !== "engine") return; if (!currentTask || answered) return; answered = true; currentTask.submit(side); }

function attachTaskXSwipeHandlers() {
  const card = document.getElementById("tinderCard");
  if (!card || quizMode !== "engine" || currentTaskType !== "X") return;

  const overlayL = document.getElementById("overlayLeft");
  const overlayR = document.getElementById("overlayRight");

  let startX = null, currentX = 0, dragging = false;

  function applyDrag(dx) {
    const rot = dx * 0.08;
    card.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
    card.style.boxShadow = Math.abs(dx) > 10 ? "0 8px 32px rgba(0,0,0,.12)" : "";
    const ratio = Math.min(Math.abs(dx) / 100, 1);
    if (dx < 0) {
      overlayL.style.opacity = ratio;
      overlayR.style.opacity = 0;
    } else {
      overlayR.style.opacity = ratio;
      overlayL.style.opacity = 0;
    }
  }

  function snapBack() {
    card.style.transition = "transform .35s cubic-bezier(.4,0,.2,1), box-shadow .2s";
    card.style.transform = "translateX(0) rotate(0deg)";
    card.style.boxShadow = "";
    overlayL.style.opacity = 0;
    overlayR.style.opacity = 0;
    setTimeout(() => { card.style.transition = ""; }, 360);
  }

  function flyOut(direction) {
    const tx = direction === "left" ? -500 : 500;
    card.style.transition = "transform .38s cubic-bezier(.4,0,.2,1), opacity .38s";
    card.style.transform = `translateX(${tx}px) rotate(${direction === "left" ? -20 : 20}deg)`;
    card.style.opacity = "0";
  }

  card.onpointerdown = (e) => {
    if (answered) return;
    startX = e.clientX;
    currentX = 0;
    dragging = true;
    card.style.transition = "";
    card.setPointerCapture(e.pointerId);
  };

  card.onpointermove = (e) => {
    if (!dragging || startX === null) return;
    currentX = e.clientX - startX;
    applyDrag(currentX);
  };

  card.onpointerup = () => {
    if (!dragging || answered) return;
    dragging = false;
    if (Math.abs(currentX) > 70) {
      const side = currentX < 0 ? "left" : "right";
      flyOut(side);
      setTimeout(() => handleAnswer(side), 200);
    } else {
      snapBack();
    }
    startX = null;
  };

  card.onpointercancel = () => { dragging = false; snapBack(); startX = null; };
}

function openCurrentTaskProfile() {
  if (!currentTaskData || quizMode !== "engine") return;
  if (currentTaskData.promptType === "book") openBook(currentTaskData.promptId);
  else openMotif(currentTaskData.promptId);
}

function revealCurrentHint(index) { if (!currentTask) return; if (typeof currentTask.revealHint === "function") currentTask.revealHint(index); }
function updateCurrentOpenTaskAnswer(value) { if (!currentTask) return; if (typeof currentTask.setAnswer === "function") currentTask.setAnswer(value); }
function submitCurrentOpenTask() { if (!currentTask || answered) return; if (typeof currentTask.submit === "function") currentTask.submit(); }

document.addEventListener("keydown", (e) => {
  if (mode !== "quiz" || quizMode !== "engine" || !currentTask || answered || currentTaskType !== "X") return;
  if (e.key === "ArrowLeft") handleAnswer("left");
  if (e.key === "ArrowRight") handleAnswer("right");
});

// =========================
// SCORE
// =========================

function renderScore() { document.getElementById("score").innerText = `Score: ${score}`; }

// =========================
// FILTERS
// =========================

function getFilteredBooks() { return data.books.filter(b => activeEpochs.has(b.epoch)); }

function getFilteredMotifs() {
  const map = new Map();
  getFilteredBooks().forEach(book => { book.motifs.forEach(id => { const m = getMotifById(id); if (m) map.set(m.id, m); }); });
  return [...map.values()];
}

function renderEpochFilter() {
  const el = document.getElementById("epochFilter");
  el.innerHTML = "";
  epochs.forEach(e => {
    const active = activeEpochs.has(e) ? "active" : "";
    el.innerHTML += `<button class="epoch-btn ${active}" onclick="toggleEpoch('${e}', this)">${e}</button>`;
  });
}

function toggleEpoch(epoch, btn) {
  if (activeEpochs.has(epoch)) { activeEpochs.delete(epoch); btn.classList.remove("active"); }
  else { activeEpochs.add(epoch); btn.classList.add("active"); }
}

// =========================
// MAP
// =========================

function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");
  list.innerHTML = "";
  if (view === "books") {
    title.innerText = "Lektury";
    getFilteredBooks().forEach(b => { list.innerHTML += `<div class="map-item" onclick="openBook('${b.id}')"><span class="item-main">📚 ${escapeHtml(b.title)}</span></div>`; });
  }
  if (view === "motifs") {
    title.innerText = "Motywy";
    getFilteredMotifs().forEach(m => { list.innerHTML += `<div class="map-item" onclick="openMotif('${m.id}')"><span class="item-main">🎯 ${escapeHtml(m.name)}</span></div>`; });
  }
}

// =========================
// PROFILE
// =========================

function openBook(id) {
  const book = getBookById(id); if (!book) return;
  if (document.getElementById("profile").style.display !== "block") {
    profileHistoryStack = [];
    profileReturnTarget = mode === "quiz" ? "quiz" : "map";
    if (mode === "quiz") quizSnapshot = captureQuizState();
  } else {
    profileHistoryStack.push({ html: document.getElementById("profile-content").innerHTML });
  }
  hideAll();
  document.getElementById("profile").style.display = "block";
  renderBookProfile(book);
}

function openMotif(id) {
  const motif = getMotifById(id); if (!motif) return;
  if (document.getElementById("profile").style.display !== "block") {
    profileHistoryStack = [];
    profileReturnTarget = mode === "quiz" ? "quiz" : "map";
    if (mode === "quiz") quizSnapshot = captureQuizState();
  } else {
    profileHistoryStack.push({ html: document.getElementById("profile-content").innerHTML });
  }
  hideAll();
  document.getElementById("profile").style.display = "block";
  renderMotifProfile(motif);
}

function openBookFromProfile(id) { openBook(id); }
function openMotifFromProfile(id) { openMotif(id); }

function renderBookProfile(book) {
  const canGoBack = profileHistoryStack.length > 0;
  document.getElementById("profile-content").innerHTML = `
    <h2 style="font-family:var(--ff-serif);font-size:2rem;font-weight:300;margin-bottom:.5rem">📚 ${escapeHtml(book.title)}</h2>
    <p style="color:var(--muted);font-size:14px;line-height:1.7;margin-bottom:.5rem">${escapeHtml(book.description || "")}</p>
    <div class="profile-section"><h3>Epoka</h3><div class="profile-chip-list"><span class="profile-chip">${escapeHtml(book.epoch || "")}</span></div></div>
    ${renderBookExtras(book)}
    <br>
    ${canGoBack
      ? `<button class="btn-ghost" onclick="goBackInProfile()">⬅ Wstecz</button>`
      : `<button class="btn-ghost" onclick="returnFromProfile()">${profileReturnTarget === "quiz" ? "⬅ Powrót do ćwiczeń" : "⬅ Powrót"}</button>`}`;
}

function renderMotifProfile(motif) {
  const canGoBack = profileHistoryStack.length > 0;
  document.getElementById("profile-content").innerHTML = `
    <h2 style="font-family:var(--ff-serif);font-size:2rem;font-weight:300;margin-bottom:.5rem">🎯 ${escapeHtml(motif.name)}</h2>
    <p style="color:var(--muted);font-size:14px;line-height:1.7;margin-bottom:.5rem">${escapeHtml(motif.description || "")}</p>
    ${renderMotifExtras(motif)}
    <br>
    ${canGoBack
      ? `<button class="btn-ghost" onclick="goBackInProfile()">⬅ Wstecz</button>`
      : `<button class="btn-ghost" onclick="returnFromProfile()">${profileReturnTarget === "quiz" ? "⬅ Powrót do ćwiczeń" : "⬅ Powrót"}</button>`}`;
}

function goBackInProfile() {
  if (!profileHistoryStack.length) { returnFromProfile(); return; }
  document.getElementById("profile-content").innerHTML = profileHistoryStack.pop().html;
}

function returnFromProfile() {
  profileHistoryStack = [];
  hideAll();
  if (profileReturnTarget === "quiz") { document.getElementById("quiz").style.display = "block"; restoreQuizState(); return; }
  goMap();
}

function goMap() { hideAll(); document.getElementById("map").style.display = "block"; renderMap(); }

// =========================
// SNAPSHOT
// =========================

function captureQuizState() {
  return { score, quizMode, selectedBook, selectedMotif, scoredPairs: [...scoredPairs], masteredPairs: [...masteredPairs], answered, currentTaskType, currentTaskData: clone(currentTaskData), profileReturnTarget };
}

function restoreQuizState() {
  if (!quizSnapshot) return;
  score = quizSnapshot.score; quizMode = quizSnapshot.quizMode;
  selectedBook = quizSnapshot.selectedBook; selectedMotif = quizSnapshot.selectedMotif;
  scoredPairs = new Set(quizSnapshot.scoredPairs || []); masteredPairs = new Set(quizSnapshot.masteredPairs || []);
  answered = quizSnapshot.answered; currentTaskType = quizSnapshot.currentTaskType;
  currentTaskData = clone(quizSnapshot.currentTaskData); profileReturnTarget = quizSnapshot.profileReturnTarget || "quiz";
  renderScore();
  if (quizMode === "diagnostic") { document.getElementById("quiz-label").textContent = "Diagnostyka"; renderDiagnostic(); return; }
  if (quizMode === "engine") {
    document.getElementById("quiz-label").textContent = "Ćwiczenia";
    if (currentTaskType && currentTaskData) { currentTask = createTaskByType(currentTaskType, currentTaskData); currentTask.render(); setNextButtonVisible(answered); }
    else renderEngineNextTask();
  }
}
