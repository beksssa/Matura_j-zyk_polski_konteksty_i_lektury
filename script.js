// ════════════════════════════════════════════════════════════════════════════
// 🧠 STATE — Wszystkie dane zmieniające się podczas sesji
// ════════════════════════════════════════════════════════════════════════════
const state = {
    mode: null,                    // 'learning' lub 'quiz'
    view: null,                    // 'books' lub 'motifs' (tylko dla learning)
    activeEpochs: new Set(['romantyzm', 'pozytywizm', 'młoda polska']),
    solvedPairs: new Set(),        // "bookId|motifId" — pary które już rozwiązano
    score: 0,
    quizTaskNumber: 0,             // 0 = test diagnostyczny, 1+ = inne zadania
    currentSelectedBook: null,
    currentSelectedMotif: null,
    previousScreen: null           // Aby wiedzieć dokąd wracać
};
 
// ════════════════════════════════════════════════════════════════════════════
// 📚 DATA — TU DODAJESZ LEKTURY I MOTYWY
// ════════════════════════════════════════════════════════════════════════════
const data = {
    books: [
        {
            id: "wesele",
            title: "Wesele",
            author: "Stanisław Wyspiański",
            year: 1901,
            description: "Diagnoza społeczeństwa polskiego (niemoc narodowa), symbolizm (zjawy jako uosobienie lęków i marzeń), marazm narodowy (chocholi taniec), rozbicie mitu ludomanii oraz prywata kontra sprawa narodowa",
            epoch: "młoda polska",
            motifs: ["motywnarodowy", "symbolizm", "ludomania"]
        },
        {
            id: "chłopi",
            title: "Chłopi",
            author: "Władysław Stanisław Reymont",
            year: 1904,
            description: "Realistyczna powieść ukazująca życie wiejskiej społeczności podporządkowane rytmowi natury, pracy i tradycji.",
            epoch: "młoda polska",
            motifs: ["naturalizm", "motywmiłości"]
        },
        {
            id: "lalka",
            title: "Lalka",
            author: "Bolesław Prus",
            year: 1890,
            description: "Powieść realizmu pozytywistycznego. Historia warszawskiego kupca Stanisława Wokulskiego.",
            epoch: "pozytywizm",
            motifs: ["realizm", "motywmiłości"]
        },
        {
            id: "pan-tadeusz",
            title: "Pan Tadeusz",
            author: "Adam Mickiewicz",
            year: 1834,
            description: "Epos narodowy. Historia rodu Sopliców na Litwie, spoń o walkach o niepodległość i miłości.",
            epoch: "romantyzm",
            motifs: ["motywnarodowy", "tradycja"]
        }
    ],
    motifs: [
        {
            id: "motywnarodowy",
            name: "Motyw Narodowy",
            description: "Problematyka kondycji narodu, walka o niepodległość, mesjanizm polski.",
            books: ["wesele", "pan-tadeusz"]
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
            books: ["wesele", "chłopi"]
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
            books: ["chłopi", "lalka"]
        },
        {
            id: "realizm",
            name: "Realizm",
            description: "Bezpośrednie odwzorowanie rzeczywistości bez upiększania",
            books: ["lalka"]
        },
        {
            id: "tradycja",
            name: "Tradycja",
            description: "Zakorzenienie w przeszłości, więzi rodzinne, zwyczaje",
            books: ["pan-tadeusz"]
        }
    ],
    epochs: ["romantyzm", "pozytywizm", "młoda polska"]
};
 
// ════════════════════════════════════════════════════════════════════════════
// 🧭 NAWIGACJA
// ════════════════════════════════════════════════════════════════════════════
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.remove('hidden');
}
 
// ════════════════════════════════════════════════════════════════════════════
// 🎯 FILTERING — Zwraca lektury/motywy z wybranych epok,
// ale BEZ już rozwiązanych par
// ════════════════════════════════════════════════════════════════════════════
function getFilteredBooks() {
    return data.books.filter(b => state.activeEpochs.has(b.epoch));
}
 
function getFilteredMotifs() {
    const books = getFilteredBooks();
    const motifMap = new Map();
    
    books.forEach(book => {
        book.motifs.forEach(motifId => {
            const motif = data.motifs.find(m => m.id === motifId);
            if (motif) {
                motifMap.set(motifId, motif);
            }
        });
    });
    
    return [...motifMap.values()];
}
 
// Zwraca motywy które są nadal dostępne (nie wszystkie rozwiązane dla danej lektury)
function getAvailableMotifs() {
    const books = getFilteredBooks();
    const motifMap = new Map();
 
    books.forEach(book => {
        book.motifs.forEach(motifId => {
            const key = `${book.id}|${motifId}`;
            // Tylko jeśli nie rozwiązano
            if (!state.solvedPairs.has(key)) {
                const motif = data.motifs.find(m => m.id === motifId);
                if (motif) {
                    motifMap.set(motifId, motif);
                }
            }
        });
    });
 
    return [...motifMap.values()];
}
 
// Zwraca lektury które są nadal dostępne (mają co najmniej jeden nierozwiązany motyw)
function getAvailableBooks() {
    const books = getFilteredBooks();
    return books.filter(book => {
        return book.motifs.some(motifId => {
            const key = `${book.id}|${motifId}`;
            return !state.solvedPairs.has(key);
        });
    });
}
 
// ════════════════════════════════════════════════════════════════════════════
// 🎚️ EPOCH FILTER
// ════════════════════════════════════════════════════════════════════════════
function renderEpochFilter() {
    const container = document.getElementById('epoch-filter');
    container.innerHTML = '';
    
    data.epochs.forEach(epoch => {
        const checked = state.activeEpochs.has(epoch);
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.onchange = () => {
            if (state.activeEpochs.has(epoch)) {
                state.activeEpochs.delete(epoch);
            } else {
                state.activeEpochs.add(epoch);
            }
        };
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + epoch));
        container.appendChild(label);
    });
}
 
// ════════════════════════════════════════════════════════════════════════════
// 📚 BROWSE (Tryb Nauka) — Lista lektur lub motywów
// ════════════════════════════════════════════════════════════════════════════
function renderBrowseList() {
    const title = document.getElementById('list-title');
    const container = document.getElementById('list-container');
    container.innerHTML = '';
 
    if (state.view === 'books') {
        title.textContent = '📚 Lektury';
        const books = getFilteredBooks();
        
        books.forEach(book => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>${book.author}</strong> (${book.year})</p>
                <p>Epoka: ${book.epoch}</p>
                <button onclick="openBookProfile('${book.id}', 'list')">Przeczytaj więcej</button>
            `;
            container.appendChild(div);
        });
    } else {
        title.textContent = '🎯 Motywy';
        const motifs = getFilteredMotifs();
        
        motifs.forEach(motif => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <h3>${motif.name}</h3>
                <button onclick="openMotifProfile('${motif.id}', 'list')">Przeczytaj więcej</button>
            `;
            container.appendChild(div);
        });
    }
}
 
// ════════════════════════════════════════════════════════════════════════════
// 📖 PROFILE (Tryb Nauka)
// ════════════════════════════════════════════════════════════════════════════
function openBookProfile(bookId, fromScreen) {
    const book = data.books.find(b => b.id === bookId);
    state.previousScreen = fromScreen === 'list' ? 'screen-4a-list' : 'screen-6-quiz';
    
    const content = document.getElementById(fromScreen === 'list' ? 'profile-content' : 'profile-quiz-content');
    
    content.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Autor:</strong> ${book.author}</p>
        <p><strong>Rok:</strong> ${book.year}</p>
        <p><strong>Epoka:</strong> ${book.epoch}</p>
        <hr>
        <p>${book.description}</p>
        <h3>🎯 Motywy w tej lekturze:</h3>
        <ul>
            ${book.motifs.map(motifId => {
                const motif = data.motifs.find(m => m.id === motifId);
                return `<li><a href="#" onclick="openMotifProfile('${motifId}', '${fromScreen}'); return false;">${motif.name}</a></li>`;
            }).join('')}
        </ul>
    `;
    
    const screenId = fromScreen === 'list' ? 'screen-5-profile' : 'screen-7-profile-from-quiz';
    goToScreen(screenId);
}
 
function openMotifProfile(motifId, fromScreen) {
    const motif = data.motifs.find(m => m.id === motifId);
    state.previousScreen = fromScreen === 'list' ? 'screen-4a-list' : 'screen-6-quiz';
    
    const content = document.getElementById(fromScreen === 'list' ? 'profile-content' : 'profile-quiz-content');
    
    content.innerHTML = `
        <h2>${motif.name}</h2>
        <hr>
        <p>${motif.description}</p>
        <h3>📚 Pojawia się w lekturach:</h3>
        <ul>
            ${motif.books.map(bookId => {
                const book = data.books.find(b => b.id === bookId);
                return `<li><a href="#" onclick="openBookProfile('${bookId}', '${fromScreen}'); return false;">${book.title}</a></li>`;
            }).join('')}
        </ul>
    `;
    
    const screenId = fromScreen === 'list' ? 'screen-5-profile' : 'screen-7-profile-from-quiz';
    goToScreen(screenId);
}
 
// ════════════════════════════════════════════════════════════════════════════
// ✏️ QUIZ — Test diagnostyczny
// Pokazuje wszystkie lektury i motywy z wybranych epok
// Można łączyć cokolwiek z czymkolwiek
// ════════════════════════════════════════════════════════════════════════════
function renderDiagnosticTest() {
    const books = getFilteredBooks();
    const motifs = getFilteredMotifs();
 
    // Update progress
    const totalPairs = books.reduce((sum, b) => sum + b.motifs.length, 0);
    document.getElementById('solved-count').textContent = state.solvedPairs.size;
    document.getElementById('total-count').textContent = totalPairs;
 
    // Render task
    const taskDiv = document.getElementById('quiz-task');
    taskDiv.innerHTML = `
        <p>Połącz lektury z pasującymi do nich motywami. Możesz łączyć cokolwiek z czymkolwiek.</p>
        
        <div style="display: flex; gap: 40px;">
            <div>
                <h3>📚 Lektury</h3>
                <div id="books-list">
                    ${books.map(book => `
                        <div class="quiz-item book-item" onclick="selectBook('${book.id}')">
                            ${book.title}
                            <button class="btn-info" onclick="event.stopPropagation(); openBookProfile('${book.id}', 'quiz')">Dowiedz się więcej</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h3>🎯 Motywy</h3>
                <div id="motifs-list">
                    ${motifs.map(motif => `
                        <div class="quiz-item motif-item" onclick="selectMotif('${motif.id}')">
                            ${motif.name}
                            <button class="btn-info" onclick="event.stopPropagation(); openMotifProfile('${motif.id}', 'quiz')">Dowiedz się więcej</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
 
    // Highlight selected items
    updateQuizSelection();
}
 
function selectBook(bookId) {
    state.currentSelectedBook = state.currentSelectedBook === bookId ? null : bookId;
    updateQuizSelection();
}
 
function selectMotif(motifId) {
    state.currentSelectedMotif = state.currentSelectedMotif === motifId ? null : motifId;
    updateQuizSelection();
}
 
function updateQuizSelection() {
    document.querySelectorAll('.quiz-item').forEach(item => {
        item.style.backgroundColor = '';
        item.style.border = '1px solid #ccc';
    });
 
    if (state.currentSelectedBook) {
        const bookItem = document.querySelector(`[onclick="selectBook('${state.currentSelectedBook}')"]`);
        if (bookItem) {
            bookItem.style.backgroundColor = '#ffffcc';
            bookItem.style.border = '2px solid orange';
        }
    }
 
    if (state.currentSelectedMotif) {
        const motifItem = document.querySelector(`[onclick="selectMotif('${state.currentSelectedMotif}')"]`);
        if (motifItem) {
            motifItem.style.backgroundColor = '#ccffcc';
            motifItem.style.border = '2px solid green';
        }
    }
}
 
function tryMatch() {
    if (!state.currentSelectedBook || !state.currentSelectedMotif) {
        alert('⚠️ Zaznacz najpierw lekturę i motyw!');
        return;
    }
 
    const book = data.books.find(b => b.id === state.currentSelectedBook);
    const isCorrect = book.motifs.includes(state.currentSelectedMotif);
    const key = `${state.currentSelectedBook}|${state.currentSelectedMotif}`;
 
    if (isCorrect) {
        if (!state.solvedPairs.has(key)) {
            state.score += 100;
            state.solvedPairs.add(key);
            alert('✅ Dobrze! +100 punktów');
        } else {
            alert('⚠️ Już rozwiązałeś tę parę!');
        }
    } else {
        state.score = Math.max(0, state.score - 50);
        alert('❌ Błędnie! -50 punktów');
    }
 
    document.getElementById('score').textContent = state.score;
    state.currentSelectedBook = null;
    state.currentSelectedMotif = null;
    renderDiagnosticTest();
}
 
// ════════════════════════════════════════════════════════════════════════════
// 🎮 EVENT LISTENERS
// ════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // EKRAN 1: Wybór trybu
    document.getElementById('btn-mode-learning').onclick = () => {
        state.mode = 'learning';
        goToScreen('screen-2-scope');
    };
 
    document.getElementById('btn-mode-quiz').onclick = () => {
        state.mode = 'quiz';
        goToScreen('screen-3-epochs');
        renderEpochFilter();
    };
 
    // EKRAN 2: Wybór zakresu (tylko dla Nauki)
    document.getElementById('btn-scope-books').onclick = () => {
        state.view = 'books';
        goToScreen('screen-3-epochs');
        renderEpochFilter();
    };
 
    document.getElementById('btn-scope-motifs').onclick = () => {
        state.view = 'motifs';
        goToScreen('screen-3-epochs');
        renderEpochFilter();
    };
 
    document.getElementById('btn-back-to-mode').onclick = () => {
        goToScreen('screen-1-mode');
    };
 
    // EKRAN 3: Filtr epok
    document.getElementById('btn-apply-epochs').onclick = () => {
        if (state.mode === 'learning') {
            goToScreen('screen-4a-list');
            renderBrowseList();
        } else {
            goToScreen('screen-6-quiz');
            state.quizTaskNumber = 0;
            renderDiagnosticTest();
        }
    };
 
    document.getElementById('btn-back-from-epochs').onclick = () => {
        if (state.mode === 'learning') {
            goToScreen('screen-2-scope');
        } else {
            goToScreen('screen-1-mode');
        }
    };
 
    // EKRAN 4A: Lista (Nauka)
    document.getElementById('btn-back-to-epochs-from-list').onclick = () => {
        goToScreen('screen-3-epochs');
    };
 
    document.getElementById('btn-home-from-list').onclick = () => {
        goToScreen('screen-1-mode');
    };
 
    // EKRAN 5: Profil (Nauka)
    document.getElementById('btn-back-to-list-from-profile').onclick = () => {
        goToScreen('screen-4a-list');
        renderBrowseList();
    };
 
    document.getElementById('btn-home-from-profile').onclick = () => {
        goToScreen('screen-1-mode');
    };
 
    // EKRAN 6: Quiz
    document.getElementById('btn-match').onclick = tryMatch;
 
    document.getElementById('btn-end-quiz').onclick = () => {
        if (confirm('Czy na pewno chcesz zakończyć? Twoje postępy będą zapisane.')) {
            // Reset dla następnej sesji
            state.quizTaskNumber = 0;
            state.currentSelectedBook = null;
            state.currentSelectedMotif = null;
            goToScreen('screen-1-mode');
        }
    };
 
    // EKRAN 7: Profil z quiz-a
    document.getElementById('btn-back-to-quiz-from-profile').onclick = () => {
        goToScreen('screen-6-quiz');
        renderDiagnosticTest();
    };
});
