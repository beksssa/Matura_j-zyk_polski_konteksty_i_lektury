// 🧠 STATE
let mode = "learning";
let view = "books";
let activeEpochs = new Set(["romantyzm", "pozytywizm"]);

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
// 🧭 NAVIGATION SYSTEM
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
  document.getElementById("screen-start").style.display = "none";
  document.getElementById("screen-mode").style.display = "none";
  document.getElementById("screen-epoch").style.display = "none";
  document.getElementById("map").style.display = "none";
  document.getElementById("quiz").style.display = "none";
  document.getElementById("profile").style.display = "none";
}

// =========================
// 🟢 SETTINGS
// =========================

function setMode(m) {
  mode = m;
}

function setView(v) {
  view = v;
}

// =========================
// 🚀 START APP
// =========================

function startApp() {
  hideAll();

  if (mode === "learning") {
    document.getElementById("map").style.display = "block";
    renderMap();
  }

  if (mode === "quiz") {
    document.getElementById("quiz").style.display = "block";
    document.getElementById("quiz-content").innerHTML = "QUIZ START (następny krok)";
  }
}

// =========================
// 🗺️ MAPA
// =========================

function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");

  list.innerHTML = "";

  // 📚 LEKTURY
  if (view === "books") {
    title.innerText = "📚 Lektury";

    getFilteredBooks().forEach(b => {
      const div = document.createElement("div");
      div.innerHTML = `
        <div style="padding:10px;margin:5px;border:1px solid #ccc;cursor:pointer"
             onclick="openBook('${b.id}')">
          📚 ${b.title}
        </div>
      `;
      list.appendChild(div);
    });
  }

  // 🎯 MOTYWY
  if (view === "motifs") {
    title.innerText = "🎯 Motywy";

    getFilteredMotifs().forEach(m => {
      const div = document.createElement("div");
      div.innerHTML = `
        <div style="padding:10px;margin:5px;border:1px solid #ccc;cursor:pointer"
             onclick="openMotif('${m.id}')">
          🎯 ${m.name}
        </div>
      `;
      list.appendChild(div);
    });
  }
}

// =========================
// 🌍 FILTER LOGIC
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
// 🌍 EPOCH FILTER UI
// =========================

function renderEpochFilter() {
  const el = document.getElementById("epochFilter");
  el.innerHTML = "";

  epochs.forEach(e => {
    const checked = activeEpochs.has(e);

    el.innerHTML += `
      <label style="margin-right:10px;">
        <input type="checkbox"
          ${checked ? "checked" : ""}
          onchange="toggleEpoch('${e}')">
        ${e}
      </label>
    `;
  });
}

function toggleEpoch(epoch) {
  if (activeEpochs.has(epoch)) {
    activeEpochs.delete(epoch);
  } else {
    activeEpochs.add(epoch);
  }
}

// =========================
// 📚 PROFILES
// =========================

function openBook(id) {
  const book = data.books.find(b => b.id === id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.description}</p>

    <h3>Motywy:</h3>
    ${book.motifs.map(m =>
      `<p style="cursor:pointer;color:blue" onclick="openMotif('${m}')">${m}</p>`
    ).join("")}
  `;
}

function openMotif(id) {
  const motif = data.motifs.find(m => m.id === id);

  hideAll();
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${motif.name}</h2>
    <p>${motif.description}</p>

    <h3>Lektury:</h3>
    ${motif.books.map(b =>
      `<p style="cursor:pointer;color:blue" onclick="openBook('${b}')">${b}</p>`
    ).join("")}
  `;
}

// =========================
// 🔙 NAV
// =========================

function goMap() {
  hideAll();
  document.getElementById("map").style.display = "block";
  renderMap();
}
