console.log("JS działa");

let selectedMode = null;
let currentView = "menu";

const data = {
  books: [
    {
      id: "lalka",
      title: "Lalka",
      description: "Powieść o społeczeństwie warszawskim",
      motifs: ["milosc", "spoleczenstwo"]
    }
  ],

  motifs: [
    {
      id: "milosc",
      name: "Miłość",
      description: "Motyw miłości romantycznej i niespełnionej",
      books: ["lalka"]
    }
  ]
};


function showLearning() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("modeSelect").style.display = "block";
}


function showQuiz() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    generateQuestion();
}

function goBack() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("learning").style.display = "none";
    document.getElementById("quiz").style.display = "none";
}


function renderBooks() {
    const container = document.getElementById("learning-content");
    container.innerHTML = "<h3>Lektury</h3>";

    data.books.forEach(book => {
        const div = document.createElement("div");

        div.innerHTML = `
            <b onclick="openBook('${book.id}')" style="cursor:pointer;">
                ${book.title}
            </b>
        `;

        container.appendChild(div);
    });

    document.getElementById("learning").style.display = "block";
}


function generateQuestion() {
    const random = data.books[Math.floor(Math.random() * data.books.length)];
    currentQuestion = random;

    document.getElementById("question").innerText =
        `Podaj motywy dla: ${random.title}`;

    document.getElementById("result").innerText = "";
}

function checkAnswer() {
    const userAnswer = document.getElementById("answer").value.toLowerCase();

    const correct = currentQuestion.motifs.some(m =>
        userAnswer.includes(m)
    );

    if (correct) {
        document.getElementById("result").innerText = "✅ Dobrze!";
    } else {
        document.getElementById("result").innerText =
            "❌ Spróbuj jeszcze raz. Poprawne: " +
            currentQuestion.motifs.join(", ");
    }
}

function selectMode(mode) {
    selectedMode = mode;
}
function startMode() {
    document.getElementById("modeSelect").style.display = "none";
    document.getElementById("learning").style.display = "none";

    if (selectedMode === "books") {
        renderBooks();
    }

    if (selectedMode === "motifs") {
        renderMotifs();
    }
}


function openBook(id) {
    const book = data.books.find(b => b.id === id);

    const container = document.getElementById("learning-content");

    container.innerHTML = `
        <h2>${book.title}</h2>
        <p>${book.description}</p>

        <h3>Motywy:</h3>
        ${book.motifs.map(m =>
            `<span onclick="openMotif('${m}')" style="cursor:pointer;color:blue;">
                ${m}
            </span>`
        ).join(", ")}
    `;
}

function openMotif(id) {
    const motif = data.motifs.find(m => m.id === id);

    const container = document.getElementById("learning-content");

    container.innerHTML = `
        <h2>${motif.name}</h2>
        <p>${motif.description}</p>

        <h3>Lektury:</h3>
        ${motif.books.map(b =>
            `<span onclick="openBook('${b}')" style="cursor:pointer;color:blue;">
                ${b}
            </span>`
        ).join(", ")}
    `;
}

function renderMotifs() {
    const container = document.getElementById("learning-content");
    container.innerHTML = "<h3>Motywy</h3>";

    data.motifs.forEach(motif => {
        const div = document.createElement("div");

        div.innerHTML = `
            <b onclick="openMotif('${motif.id}')" style="cursor:pointer;">
                ${motif.name}
            </b>
        `;

        container.appendChild(div);
    });

    document.getElementById("learning").style.display = "block";
}
