// 🧠 STAN APLIKACJI
let mode = "learning";
let view = "books";
let activeEpochs = new Set(["romantyzm", "pozytywizm"]);
let currentItem = null;

// 📚 DANE
const data = {
  books: [
    {
      id: "lalka",
      title: "Lalka",
      description: "Powieść o społeczeństwie warszawskim",
      epoch: "pozytywizm",
      motifs: ["milosc", "spoleczenstwo"]
    }
  ],

  motifs: [
    {
      id: "milosc",
      name: "Miłość",
      description: "Motyw miłości",
      books: ["lalka"]
    }
  ]
};

const epochs = ["romantyzm", "pozytywizm"];

// 🟢 USTAWIENIA
function setMode(m) {
  mode = m;
}

function setView(v) {
  view = v;
}

// 🚀 START
function startApp() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("map").style.display = "block";

  renderMap();
}

// 🗺️ MAPA
function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");

  list.innerHTML = "";

  // 📚 LEKTURY
  if (view === "books") {
    title.innerText = "📚 Lektury";

    renderEpochFilter();

    data.books
      .filter(b => activeEpochs.has(b.epoch))
      .forEach(b => {
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

    data.motifs.forEach(m => {
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

// 🌍 FILTR EPOK
function renderEpochFilter() {
  const container = document.getElementById("epochFilter");
  container.innerHTML = "";

  epochs.forEach(e => {
    const checked = activeEpochs.has(e);

    container.innerHTML += `
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

  renderMap();
}

// 📚 PROFIL LEKTURY
function openBook(id) {
  const book = data.books.find(b => b.id === id);

  document.getElementById("map").style.display = "none";
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${book.title}</h2>
    <p>${book.description}</p>

    <h3>Motywy:</h3>
    ${book.motifs.map(m =>
      `<p style="cursor:pointer;color:blue"
          onclick="openMotif('${m}')">${m}</p>`
    ).join("")}
  `;
}

// 🎯 PROFIL MOTYWU
function openMotif(id) {
  const motif = data.motifs.find(m => m.id === id);

  document.getElementById("map").style.display = "none";
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-content").innerHTML = `
    <h2>${motif.name}</h2>
    <p>${motif.description}</p>

    <h3>Lektury:</h3>
    ${motif.books.map(b =>
      `<p style="cursor:pointer;color:blue"
          onclick="openBook('${b}')">${b}</p>`
    ).join("")}
  `;
}

// 🔙 NAWIGACJA
function goMenu() {
  document.getElementById("map").style.display = "none";
  document.getElementById("profile").style.display = "none";
  document.getElementById("quiz").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function goMap() {
  document.getElementById("profile").style.display = "none";
  document.getElementById("map").style.display = "block";
  renderMap();
}
