// 🔵 STAN APLIKACJI
let mode = "learning"; // tylko learning teraz
let view = "books";
let currentMapData = null;

// 📚 DANE
const data = {
  books: [
    {
      id: "lalka",
      title: "Lalka",
      description: "Powieść o społeczeństwie",
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

// 🔵 MENU USTAWIENIA
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

// 🗺️ MAPA (LISTA)
function renderMap() {
  const list = document.getElementById("list");
  const title = document.getElementById("map-title");

  list.innerHTML = "";

  if (view === "books") {
    title.innerText = "📚 Lektury";

    data.books.forEach(b => {
      const div = document.createElement("div");
      div.innerHTML = `<b onclick="openBook('${b.id}')" style="cursor:pointer">${b.title}</b>`;
      list.appendChild(div);
    });
  }

  if (view === "motifs") {
    title.innerText = "🎯 Motywy";

    data.motifs.forEach(m => {
      const div = document.createElement("div");
      div.innerHTML = `<b onclick="openMotif('${m.id}')" style="cursor:pointer">${m.name}</b>`;
      list.appendChild(div);
    });
  }
}

// 📚 PROFIL LEKTURY
function openBook(id) {
  const book = data.books.find(b => b.id === id);

  document.getElementById("map").style.display = "none";
  document.getElementById("profile").style.display = "block";

  const el = document.getElementById("profile-content");

  el.innerHTML = `
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

  const el = document.getElementById("profile-content");

  el.innerHTML = `
    <h2>${motif.name}</h2>
    <p>${motif.description}</p>

    <h3>Lektury:</h3>
    ${motif.books.map(b =>
      `<p style="cursor:pointer;color:blue"
          onclick="openBook('${b}')">${b}</p>`
    ).join("")}
  `;
}

// 🔙 POWRÓT
function goMenu() {
  document.getElementById("map").style.display = "none";
  document.getElementById("profile").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function goMap() {
  document.getElementById("profile").style.display = "none";
  document.getElementById("map").style.display = "block";
  renderMap();
}
