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
    document.getElementById("learning").style.display = "block";
    renderLearning();
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

function renderLearning() {
    const container = document.getElementById("learning-content");
    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `<b>${item.title}</b> → ${item.motifs.join(", ")}`;
        container.appendChild(div);
    });
}

let currentQuestion = null;

function generateQuestion() {
    const random = data[Math.floor(Math.random() * data.length)];
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
