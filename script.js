// =========================
//  Baza
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
// Dane
// =========================

const data = {
  books: [
    {
      id: "wesele", title: "Wesele",
      description: "Dramat Stanisława Wyspiańskiego ukazujący niemoc polskiego społeczeństwa niezdolnego do zrywu narodowego, w którym symboliczne zjawy obnażają wewnętrzne lęki i marzenia bohaterów. Motyw buntu pojawia się w pragnieniu walki o niepodległość, które ostatecznie zostaje uśpione. Motyw tańca — tytułowe wesele i chocholi taniec — symbolizuje marazm i bezwład zbiorowy. Motyw artysty ukazany jest przez inteligencję fascynującą się wsią bez prawdziwego jej rozumienia. Motyw wsi pokazuje przepaść między wyidealizowanym obrazem chłopstwa a jego rzeczywistością. Motyw patriotyzmu wybrzmiewa w wizji walki o niepodległość, której nie udaje się zrealizować. Motyw konfliktu pokoleń i klas społecznych przenika całą strukturę dramatu.",
      epoch: "młoda polska",
      motifs: ["motywbuntu", "motywtanca", "motywartysty", "motywwsi", "motywpatriotyzmu", "motywkonfliktupokolen", "motywpolskiipolakow"],
      coverEmoji: "🎭", aliases: ["Wesele Wyspiańskiego"],
      characters: ["chochol", "poeta", "mlody", "gospodarz"],
      quotes: [], images: [{ src: "images/lektury/wesele/wesele_okładka.png" }]
    },
    {
      id: "chlopi", title: "Chłopi",
      description: "Epopeja chłopska Władysława Reymonta ukazująca życie wsi Lipce podporządkowane rytmowi natury, pracy i odwiecznej tradycji. Motyw wsi jest centralny — wieś jawi się jako świat rządzący się własnymi surowymi prawami. Motyw pracy ukazuje trud codziennego życia chłopów jako fundament ich egzystencji. Motyw miłości przejawia się w namiętnym i zakazanym uczuciu między Jagną a Antkiem. Motyw rodziny pokazuje skomplikowane relacje w rodzinie Borynów. Motyw ojca widoczny jest w postaci Macieja Boryny — patriarchy rządzącego gospodarstwem twardą ręką. Motyw przyrody i natury przenika całą narrację, wyznaczając rytm życia i śmierci.",
      epoch: "młoda polska",
      motifs: ["motywwsi", "motywpracy", "motywmilosci", "motywrodziny", "motywojca", "motywprzyrodynatury", "motywkobiety", "motywtanca"],
      coverEmoji: "🌾", aliases: ["Chłopi Reymonta"],
      characters: ["boryna", "jagna", "antoni"],
      quotes: [], images: [{ src: "images/lektury/chłopi/Chlopi-plakat-204569-602x802-nobckgr.webp" }]
    },
    {
      id: "antygona", title: "Antygona",
      description: "Tragedia Sofoklesa ukazująca nierozwiązywalny konflikt między prawem boskim a ludzkim, w którym bohaterka ginie, pozostając wierna własnemu sumieniu. Motyw buntu uosabia Antygona, która wbrew rozkazowi króla postanawia pochować brata. Motyw fatum i przeznaczenia ciąży nad całym rodem Edypa, prowadząc do nieuchronnej katastrofy. Motyw władcy widoczny jest w postaci Kreona, którego pycha niszczy jego rodzinę. Motyw śmierci przenika dramat od początku — śmierć Polinika uruchamia całą tragedię. Motyw konfliktu pokazuje starcie dwóch równorzędnych racji: boskiej i państwowej. Motyw poświęcenia wyraża się w gotowości Antygony do oddania życia za wyższe wartości.",
      epoch: "antyk",
      motifs: ["motywbuntu", "motywfatumprzeznaczenia", "motywwladcy", "motywsmierci", "motywkonfliktu", "motywposwiecenia", "motywwladzy"],
      coverEmoji: "🏛️", aliases: ["Antygona Sofoklesa"],
      characters: ["antygona", "kreon", "ismena"],
      quotes: [], images: [{ src: "images/lektury/antygona/productGfx_824_500_500.jpg" }]
    },
    {
      id: "tango", title: "Tango",
      description: "Dramat Sławomira Mrożka ukazujący upadek tradycyjnych wartości i zwycięstwo prymitywnej siły nad intelektem i porządkiem. Motyw buntu przejawia się paradoksalnie — Artur buntuje się przeciwko anarchii własnej rodziny, próbując przywrócić dawny ład. Motyw rodziny ukazuje zdegenerowaną strukturę, w której rodzice odrzucili wszelkie normy i autorytet. Motyw konfliktu pokoleń stanowi oś dramatu — młody Artur pragnie porządku, którego jego rodzice się wyrzekli. Motyw tradycji i obyczajów jest obecny jako wartość, o którą walczy i którą przegrywa główny bohater. Motyw władzy kończy się jej przejęciem przez prymitywnego Edka. Motyw Polski i Polaków pojawia się jako groteska na temat narodowych wad i niemożności reform.",
      epoch: "współczesność",
      motifs: ["motywbuntu", "motywrodziny", "motywkonfliktupokolen", "motywobyczajowitradycji", "motywwladzy", "motywpolskiipolakow", "motywkonfliktu"],
      coverEmoji: "🪑", aliases: ["Tango Mrożka"],
      characters: ["artur", "edek"],
      quotes: [], images: [{ src: "images/lektury/tango/plakat-spektakl-Tango-2025.jpg" }]
    },
    {
      id: "magbet", title: "Makbet",
      description: "Tragedia Szekspira ukazująca destrukcyjną siłę ambicji, która popycha człowieka do zbrodni i prowadzi do całkowitego rozpadu jego psychiki. Motyw zbrodni jest centralny — morderstwo Dunkana otwiera spiralę kolejnych zabójstw. Motyw władzy ukazuje, jak pragnienie panowania niszczy człowieczeństwo bohatera. Motyw przepowiedni uruchamia całą akcję — słowa czarownic stają się samospełniającą się przepowiednią. Motyw fatum i przeznaczenia przenika los Makbeta, który nie może uciec przed przepowiednią. Motyw szaleństwa dotyka Lady Makbet, którą wyrzuty sumienia doprowadzają do obłędu. Motyw winy i kary domyka tragedię — Makbet ponosi karę za swoje zbrodnie. Motyw spisku towarzyszy planowaniu i wykonaniu każdego morderstwa.",
      epoch: "renesans",
      motifs: ["motywzbrodni", "motywwladzy", "motywprzepowiedni", "motywfatumprzeznaczenia", "motywszalenstwa", "motywwinyikary", "motywspisku", "motywzla"],
      coverEmoji: "👑", aliases: ["Macbeth", "Makbet Szekspira"],
      characters: ["makbet", "lmakbet"],
      quotes: [], images: [{ src: "images/lektury/magbet/4e4421b6b18d205ec1e82cb4bb61ad53.jpg" }]
    },
    {
      id: "zbrodniaikara", title: "Zbrodnia i kara",
      description: "Powieść psychologiczna Dostojewskiego śledząca upadek i odkupienie człowieka, który morderstwem chce udowodnić swoją wyższość nad zwykłymi ludźmi. Motyw zbrodni i motyw winy i kary są ze sobą nierozerwalnie splecione — Raskolnikow nie może uciec przed własnym sumieniem. Motyw biedy ukazuje środowisko petersburskiej nędzy jako tło moralnego upadku bohatera. Motyw miasta — Petersburg jawi się jako przestrzeń alienacji i moralnego zepsucia. Motyw miłości przejawia się w relacji Raskolnikowa z Sonią, która prowadzi go ku odkupieniu. Motyw poświęcenia uosabia Sonia, która wyrzeka się własnego dobra dla rodziny i ukochanego. Motyw przemiany zamyka powieść — bohater przez cierpienie dochodzi do duchowego odrodzenia.",
      epoch: "pozytywizm",
      motifs: ["motywzbrodni", "motywwinyikary", "motywbiedy", "motywmiasta", "motywmilosci", "motywposwiecenia", "motywprzemiany", "motywszalenstwa"],
      coverEmoji: "🕯️", aliases: ["Zbrodnia i Kara", "Zbrodnia i kara Dostojewskiego"],
      characters: ["raskolnikow", "sonia"],
      quotes: [], images: [{ src: "images/lektury/zbrodnia i kara/1198.-ZBRODNIA_i_KARA.jpg" }]
    },
    {
      id: "innyswiat", title: "Inny świat",
      description: "Autobiograficzny reportaż Gustawa Herlinga-Grudzińskiego będący świadectwem pobytu w sowieckim łagrze, gdzie system totalitarny testuje granice człowieczeństwa. Motyw totalitaryzmu ukazuje mechanizmy sowieckiego systemu, który niszczy jednostkę fizycznie i psychicznie. Motyw cierpienia przenika każdą stronę — głód, zimno i praca ponad siły są codziennością więźniów. Motyw wolności objawia się przez jej całkowite pozbawienie i tęsknotę za nią. Motyw poświęcenia i solidarności między więźniami bywa jedynym ratunkiem dla człowieczeństwa. Motyw zła ukazuje system obozowy jako wcielenie zorganizowanego zła. Motyw samotności dotyka każdego więźnia odizolowanego od bliskich i normalnego świata.",
      epoch: "współczesność",
      motifs: ["motywtotalitaryzmu", "motywcierpienia", "motywwolnosci", "motywposwiecenia", "motywzla", "motywsamotnosci"],
      coverEmoji: "⛓️", aliases: ["Inny Świat Herlinga-Grudzińskiego"],
      characters: [],
      quotes: [], images: [{ src: "images/lektury/inny świat/images (2).jpeg" }]
    },
    {
      id: "1984", title: "Rok 1984",
      description: "Antyutopia George'a Orwella ukazująca totalitarne państwo Oceania, w którym Partia kontroluje każdy aspekt życia obywateli, włącznie z myślami i uczuciami. Motyw totalitaryzmu jest centralny — Partia stosuje inwigilację, nowomowę i przepisywanie historii jako narzędzia kontroli. Motyw buntu przejawia się w próbie Winstona zachowania własnej tożsamości i podjęcia walki z systemem. Motyw miłości między Winstonem a Julią staje się aktem oporu wobec Partii zakazującej prawdziwych uczuć. Motyw wolności ukazany jest przez jej całkowity brak i marzenie o świecie bez Wielkiego Brata. Motyw władzy analizuje mechanizmy utrzymywania absolutnej kontroli nad społeczeństwem. Motyw zdrady — O'Brien zdradza Winstona — ostatecznie łamie bohatera.",
      epoch: "współczesność",
      motifs: ["motywtotalitaryzmu", "motywbuntu", "motywmilosci", "motywwolnosci", "motywwladzy", "motywzdrady"],
      coverEmoji: "📕", aliases: ["1984", "Rok tysiąc dziewięćset osiemdziesiąty czwarty"],
      characters: ["winston", "brat"],
      quotes: [], images: [{ src: "images/lektury/1984/il_1080xN.5882175820_6how.webp" }]
    },
    {
      id: "skapiec", title: "Skąpiec",
      description: "Komedia Moliera ukazująca obraz człowieka opętanego żądzą pieniądza, której skutkiem jest zniszczenie relacji rodzinnych i społecznych. Motyw pieniądza jest osią całej komedii — Harpagon przedkłada majątek nad szczęście własnych dzieci. Motyw rodziny ukazuje, jak skąpstwo niszczy więzi — ojciec staje się wrogiem własnych dzieci. Motyw konfliktu pokoleń przejawia się w starciu Harpagona z dziećmi pragnącymi miłości i normalnego życia. Motyw miłości pojawia się jako wartość, której pieniądz nie jest w stanie zastąpić. Motyw mieszczaństwa portretuje środowisko paryskiej klasy średniej i jej obsesję na punkcie majątku.",
      epoch: "barok",
      motifs: ["motywpieniadza", "motywrodziny", "motywkonfliktupokolen", "motywmilosci", "motywmieszczanstwa"],
      coverEmoji: "💰", aliases: ["Skąpiec Moliera"],
      characters: ["harpagon"],
      quotes: [], images: [{ src: "images/lektury/skapiec/PLAKAT SKAPIEC_mały do NETA.jpg" }]
    },
    {
      id: "lalka", title: "Lalka",
      description: "Powieść Bolesława Prusa ukazująca przekrój społeczeństwa polskiego epoki pozytywizmu przez pryzmat losów kupca Wokulskiego, który poświęca wszystko dla nieosiągalnej miłości. Motyw miłości — obsesyjna miłość Wokulskiego do Izabeli Łęckiej — jest motorem całej fabuły. Motyw kariery ukazuje drogę bohatera od ubogiego studenta do zamożnego kupca. Motyw arystokracji portretuje zdegenerowaną szlachtę niezdolną do pracy i pogardzającą ludźmi niższego stanu. Motyw filantropii przejawia się w działalności Wokulskiego na rzecz ubogich. Motyw mieszczaństwa i pracy pokazuje nową warstwę społeczną jako rzeczywistą siłę napędową kraju. Motyw przemijania dotyka Rzeckiego — starego idealisty, który nie rozumie nowego świata.",
      epoch: "pozytywizm",
      motifs: ["motywmilosci", "motywkariery", "motywarystokracji", "motywfilantropii", "motywmieszczanstwa", "motywpracy", "motywprzemijania", "motywkobiety"],
      coverEmoji: "🪆", aliases: ["Lalka Prusa"],
      characters: ["wokulski", "rzecki", "lecka"],
      quotes: [], images: [{ src: "images/lektury/lalka/2823.jpg" }]
    },
    {
      id: "potop", title: "Potop",
      description: "Powieść historyczna Henryka Sienkiewicza ukazująca czasy potopu szwedzkiego i moralną przemianę awanturnika Kmicica w bohatera walczącego za ojczyznę. Motyw patriotyzmu jest centralny — walka ze Szwedami staje się testem miłości do ojczyzny. Motyw przemiany ukazuje drogę Kmicica od człowieka skłóconego z prawem do bohatera narodowego. Motyw rycerza uosabia Wołodyjowski — wzór honoru, odwagi i wierności ideałom. Motyw miłości — uczucie Kmicica do Oleńki — mobilizuje go do zmiany i walki o honor. Motyw zdrady pojawia się jako pokusa, której niektórzy bohaterowie ulegają, stając po stronie Szwedów. Motyw wiary i Boga przenika postawę bohaterów, którzy widzą wojnę jako sprawę religijną.",
      epoch: "pozytywizm",
      motifs: ["motywpatriotyzmu", "motywprzemiany", "motywrycerza", "motywmilosci", "motywzdrady", "motywboga", "motywwojny"],
      coverEmoji: "⚔️", aliases: ["Potop Sienkiewicza"],
      characters: ["kmicic", "michal"],
      quotes: [], images: [{ src: "images/lektury/potop/potop.jpg" }]
    },
    {
      id: "przedwiosnie", title: "Przedwiośnie",
      description: "Powieść Stefana Żeromskiego ukazująca rozterki ideowe młodego Polaka powracającego do odrodzonej ojczyzny i zderzającego się z brutalną rzeczywistością społeczną. Motyw przemiany ukazuje ewolucję Cezarego Baryki od człowieka bez tożsamości do kogoś, kto musi wybrać swoją drogę. Motyw rewolucji kusi bohatera ideą radykalnej zmiany, którą widział w Baku. Motyw buntu przejawia się w niezgodzie Cezarego na niesprawiedliwość społeczną odrodzonej Polski. Motyw ojca — Seweryn Baryka wpaja synowi ideę szklanych domów i miłość do Polski. Motyw patriotyzmu jest problematyczny — Polska nie spełnia idealnych wyobrażeń bohatera. Motyw konfliktu społecznego ukazuje przepaść między biedotą a uprzywilejowanymi.",
      epoch: "młoda polska",
      motifs: ["motywprzemiany", "motywrewolucji", "motywbuntu", "motywojca", "motywpatriotyzmu", "motywkonfliktu", "motywbiedy"],
      coverEmoji: "🌱", aliases: ["Przedwiośnie Żeromskiego"],
      characters: ["baryka", "starybaryka"],
      quotes: [], images: [{ src: "images/lektury/przedwiosnie/przedwiosnie.jpg" }]
    },
    {
      id: "ferdydurke", title: "Ferdydurke",
      description: "Groteskowa powieść Witolda Gombrowicza o zniewoleniu człowieka przez społeczne formy i role, którym nie jest w stanie się oprzeć. Motyw buntu przejawia się w desperackiej próbie Józia wyrwania się z narzucanych mu przez społeczeństwo masek. Motyw szkoły ukazuje edukację jako instytucję produkującą niedojrzałość i konformizm. Motyw domu — stancja Młodziaków i wieś Miętusa — to kolejne przestrzenie, w których bohater konfrontuje się z różnymi formami zniewolenia. Motyw dworku portretuje polską szlachtę i jej przywiązanie do tradycji jako kolejną pułapkę. Motyw konfliktu pokoleń widoczny jest w relacjach między nauczycielami a uczniami. Motyw przemiany jest pozorny — bohater zmienia otoczenie, ale nie może uciec przed Formą.",
      epoch: "współczesność",
      motifs: ["motywbuntu", "motywszkoly", "motywdomu", "motywdworku", "motywkonfliktupokolen", "motywprzemiany", "motywszlachty"],
      coverEmoji: "🎭", aliases: ["Ferdydurke Gombrowicza"],
      characters: ["jozek", "mietus"],
      quotes: [], images: [{ src: "images/lektury/ferdydurke/ferdydurke.jpg" }]
    },
    {
      id: "gaz", title: "Proszę państwa do gazu",
      description: "Opowiadanie Tadeusza Borowskiego ukazujące rzeczywistość obozu koncentracyjnego z perspektywy więźnia funkcyjnego, w której dehumanizacja staje się warunkiem przeżycia. Motyw wojny i zbrodni ukazuje obóz jako skrajny wyraz bestialstwa wojennego. Motyw cierpienia jest wszechobecny — śmierć i ból stają się codziennością, wobec której bohater musi stać się obojętny. Motyw zła — system obozowy jako wcielenie zorganizowanego, biurokratycznego zła. Motyw przemiany człowieka ukazuje, jak ekstremalny system niszczy moralność i człowieczeństwo. Motyw samotności — każdy więzień jest sam wobec machiny zagłady.",
      epoch: "współczesność",
      motifs: ["motywwojny", "motywzbrodni", "motywcierpienia", "motywzla", "motywprzemiany", "motywsamotnosci"],
      coverEmoji: "🔥", aliases: ["Proszę państwa do gazu Borowskiego"],
      characters: [],
      quotes: [], images: [{ src: "images/lektury/gaz/gaz.jpg" }]
    },
    {
      id: "getto", title: "Zdążyć przed Panem Bogiem",
      description: "Reportaż Hanny Krall oparty na rozmowach z Markiem Edelmanem, ostatnim dowódcą powstania w getcie warszawskim, ukazujący granice człowieczeństwa w ekstremalnych warunkach. Motyw buntu — powstanie w getcie jako świadomy wybór śmierci z bronią w ręku zamiast biernej zagłady. Motyw śmierci przenika każdą rozmowę — lekarz i powstaniec nieustannie obcują ze śmiercią. Motyw poświęcenia ukazuje gotowość do oddania życia za godność i symbolicznie — za pozostałych. Motyw Żyda jest centralny — tożsamość żydowska i jej zagłada stanowią oś narracji. Motyw boga i sensu cierpienia pojawia się w filozoficznych refleksjach Edelmana. Motyw wojny ukazuje mechanizmy eksterminacji i heroicznego oporu.",
      epoch: "współczesność",
      motifs: ["motywbuntu", "motywsmierci", "motywposwiecenia", "motywzyda", "motywboga", "motywwojny"],
      coverEmoji: "✡️", aliases: ["Zdążyć przed Panem Bogiem Krall"],
      characters: [],
      quotes: [], images: [{ src: "images/lektury/getto/getto.jpg" }]
    },
    {
      id: "dzuma", title: "Dżuma",
      description: "Powieść Alberta Camusa ukazująca epidemię dżumy w algierskim Oranie jako alegorię zła, wobec którego człowiek musi dokonać moralnego wyboru. Motyw poświęcenia jest centralny — doktor Rieux i jego towarzysze rezygnują z osobistego szczęścia, by walczyć z epidemią. Motyw przyjaźni łączy bohaterów walczących ramię w ramię ze wspólnym wrogiem. Motyw cierpienia ukazuje masową śmierć i ból jako doświadczenie zbiorowe. Motyw boga i sensu cierpienia — postać księdza Paneloux pyta, dlaczego Bóg dopuszcza takie nieszczęście. Motyw buntu — postawa Rieux jest buntem przeciwko złu, nawet bez nadziei na ostateczne zwycięstwo. Motyw śmierci nieustannie towarzyszy postaciom, kształtując ich wybory moralne.",
      epoch: "współczesność",
      motifs: ["motywposwiecenia", "motywprzyjazni", "motywcierpienia", "motywboga", "motywbuntu", "motywsmierci"],
      coverEmoji: "🦠", aliases: ["Dżuma Camusa"],
      characters: ["rieux"],
      quotes: [], images: [{ src: "images/lektury/dzuma/dzuma.jpg" }]
    },
    {
      id: "edek", title: "Górą Edek",
      description: "Dramat Miroslava Srnki ukazujący zderzenie inteligencji z prymitywną siłą w przestrzeni postkomunistycznej rzeczywistości. Motyw władzy — Edek zdobywa władzę nie przez intelekt, lecz przez brutalną siłę i bezczelność. Motyw konfliktu pokoleń ukazuje starcie starych wartości z nową, cyniczną rzeczywistością. Motyw Polski i Polaków pojawia się jako refleksja nad kondycją społeczeństwa po transformacji.",
      epoch: "współczesność",
      motifs: ["motywwladzy", "motywkonfliktupokolen", "motywpolskiipolakow"],
      coverEmoji: "👊", aliases: ["Górą Edek"],
      characters: [],
      quotes: [], images: [{ src: "images/lektury/edek/edek.jpg" }]
    },
    {
      id: "miejsce", title: "Miejsce",
      description: "Opowiadanie Sławomira Mrożka eksplorujące absurd i groteską codzienności oraz pytanie o to, jak człowiek odnajduje swoje miejsce w świecie. Motyw tożsamości i przynależności przenika narrację. Motyw konfliktu społecznego ujawnia się w zderzeniu jednostki z otaczającą ją rzeczywistością.",
      epoch: "współczesność",
      motifs: ["motywkonfliktu", "motywsamotnosci"],
      coverEmoji: "📍", aliases: ["Miejsce Mrożka"],
      characters: [],
      quotes: [], images: [{ src: "images/lektury/miejsce/miejsce.jpg" }]
    },
    {
      id: "andrews", title: "Profesor Andrews w Warszawie",
      description: "Opowiadanie Olgi Tokarczuk ukazujące zderzenie zachodniej wrażliwości z postkomunistyczną Warszawą lat dziewięćdziesiątych. Motyw podróży i wędrówki — profesor Andrews przemierza Warszawę, odkrywając jej chaos i specyficzny rytm. Motyw miasta ukazuje Warszawę jako przestrzeń obcości i fascynacji zarazem. Motyw konfliktu kultur ujawnia się w zderzeniu porządku akademickiego świata Zachodu z polską rzeczywistością.",
      epoch: "współczesność",
      motifs: ["motywpodrozywedrowki", "motywmiasta", "motywkonfliktu"],
      coverEmoji: "🏙️", aliases: ["Profesor Andrews w Warszawie Tokarczuk"],
      characters: [],
      quotes: [], images: [{ src: "images/lektury/andrews/andrews.jpg" }]
    },
    {
      id: "iliada", title: "Iliada",
      description: "Epos Homera ukazujący ostatni rok wojny trojańskiej, w którym bohaterowie stają wobec odwiecznych pytań o honor, śmierć i sens walki. Motyw wojny jest centralny — Iliada to opowieść o wojnie jako przestrzeni zarówno chwały, jak i tragedii. Motyw patriotyzmu uosabia Hektor, który walczy w obronie Troi i swojej rodziny. Motyw fatum i przeznaczenia ciąży nad bohaterami — bogowie ingerują w los ludzi. Motyw śmierci nieustannie towarzyszy bohaterom, którzy godzą się z nią jako nieuchronną ceną chwały. Motyw honoru i rycerza widoczny jest w kodeksie postępowania wojowników. Motyw zemsty uruchamia kluczowe wątki — zemsta Achillesa za śmierć Patroklosa.",
      epoch: "antyk",
      motifs: ["motywwojny", "motywpatriotyzmu", "motywfatumprzeznaczenia", "motywsmierci", "motywrycerza", "motywzemsty"],
      coverEmoji: "🛡️", aliases: ["Iliada Homera"],
      characters: ["hektor", "parys", "achilles"],
      quotes: [], images: [{ src: "images/lektury/iliada/iliada.jpg" }]
    },
    {
      id: "polikarp", title: "Rozmowa Mistrza Polikarpa ze Śmiercią",
      description: "Średniowieczny utwór dydaktyczny ukazujący dialog uczonego ze spersonifikowaną Śmiercią, będący refleksją nad przemijaniem i równością wszystkich ludzi wobec śmierci. Motyw śmierci jest absolutnie centralny — Śmierć jako postać rozmawia z człowiekiem i objaśnia swą nieuchronną władzę. Motyw przemijania ukazuje nietrwałość życia i wszystkiego, co ziemskie. Motyw ucznia i mistrza przejawia się w dydaktycznym charakterze dialogu. Motyw boga — rozmowa ze Śmiercią jest jednocześnie refleksją nad Bożym porządkiem świata. Motyw równości wobec śmierci — Śmierć zabiera bogatych i biednych, możnych i prostych.",
      epoch: "średniowiecze",
      motifs: ["motywsmierci", "motywprzemijania", "motywuczniaimistrza", "motywboga"],
      coverEmoji: "💀", aliases: ["Rozmowa Mistrza Polikarpa ze Śmiercią"],
      characters: ["polikarp", "smierc"],
      quotes: [], images: [{ src: "images/lektury/polikarp/polikarp.jpg" }]
    },
    {
      id: "genesis",
      title: "Księga Rodzaju",
      description: "Księga Rodzaju opisuje stworzenie świata, początki ludzkości oraz pierwsze relacje człowieka z Bogiem. Motyw Boga ukazuje akt stworzenia i ustanowienie porządku świata jako fundament istnienia człowieka. Motyw rodziny ujawnia się w historiach pierwszych ludzi i ich potomków, pokazując narodziny więzi i konfliktów międzyludzkich.",
      epoch: "starożytność",
      motifs: ["motywboga", "motywrodziny"],
      coverEmoji: "📖",
      aliases: ["Genesis", "Biblia Księga Rodzaju"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "job",
      title: "Księga Hioba",
      description: "Księga Hioba przedstawia historię sprawiedliwego człowieka wystawionego na próbę cierpienia i utraty wszystkiego, co posiada. Motyw cierpienia ukazuje ból niewinnego człowieka i pytanie o sens bólu. Motyw Boga pokazuje relację człowieka z absolutem i próbę zrozumienia boskiej sprawiedliwości. Motyw winy i kary zostaje zakwestionowany poprzez los niewinnego Hioba.",
      epoch: "starożytność",
      motifs: ["motywcierpienia", "motywboga", "motywwinyikary"],
      coverEmoji: "🕊️",
      aliases: ["Hiob", "Księga Hioba Biblia"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "ecclesiastes",
      title: "Księga Koheleta",
      description: "Księga Koheleta jest refleksją nad sensem życia, jego ulotnością i nieuchronnym przemijaniem wszystkiego, co ludzkie. Motyw przemijania ukazuje marność i nietrwałość ludzkich działań oraz dóbr. Motyw Boga wskazuje na poszukiwanie sensu istnienia w relacji z absolutem.",
      epoch: "starożytność",
      motifs: ["motywprzemijania", "motywboga"],
      coverEmoji: "⏳",
      aliases: ["Kohelet", "Eklezjastes"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "psalms",
      title: "Księga Psalmów",
      description: "Księga Psalmów to zbiór modlitw, hymnów i lamentacji wyrażających pełne spektrum ludzkich emocji wobec Boga. Motyw Boga ukazuje bliską relację człowieka z absolutem poprzez modlitwę i uwielbienie. Motyw cierpienia pojawia się w lamentacjach i prośbach o ratunek w sytuacjach granicznych.",
      epoch: "starożytność",
      motifs: ["motywboga", "motywcierpienia"],
      coverEmoji: "🎶",
      aliases: ["Psalmy", "Psalterz"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "apocalypse_john",
      title: "Apokalipsa św. Jana",
      description: "Apokalipsa św. Jana przedstawia wizję końca świata, ostatecznej walki dobra ze złem oraz triumfu boskiego porządku. Motyw Boga ukazuje ostateczne zwycięstwo absolutu nad chaosem. Motyw zła przedstawia destrukcyjne siły działające przeciwko światu. Motyw wojny ujawnia się jako kosmiczny konflikt sił duchowych. Motyw władzy ukazuje sąd i ustanowienie nowego porządku.",
      epoch: "starożytność",
      motifs: ["motywboga", "motywzla", "motywwojny", "motywwladzy"],
      coverEmoji: "🔥",
      aliases: ["Apokalipsa", "Apokalipsa Jana"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "orpheus",
      title: "Mit o Orfeuszu i Eurydyce",
      description: "Mit opowiada o Orfeuszu, który schodzi do świata zmarłych, by odzyskać ukochaną Eurydykę, lecz traci ją przez własne zwątpienie. Motyw miłości ukazuje siłę uczucia przekraczającego granice życia i śmierci. Motyw śmierci przedstawia nieodwracalność losu i granicę między światami. Motyw przemijania podkreśla kruchość ludzkiego szczęścia.",
      epoch: "starożytność",
      motifs: ["motywmilosci", "motywsmierci", "motywprzemijania"],
      coverEmoji: "🎻",
      aliases: ["Orfeusz", "Orfeusz i Eurydyka"],
      characters: ["orfeusz"],
      quotes: [],
      images: []
    },
    
    {
      id: "sisyphus",
      title: "Mit o Syzyfie",
      description: "Mit o Syzyfie przedstawia karę wiecznego wtaczania głazu pod górę, który zawsze spada tuż przed celem. Motyw cierpienia ukazuje absurdalny i niekończący się wysiłek jednostki. Motyw buntu ujawnia się w próbie sprytu i sprzeciwie wobec bogów. Motyw przemijania podkreśla cykliczność i bezsens powtarzalnego losu.",
      epoch: "starożytność",
      motifs: ["motywcierpienia", "motywbuntu", "motywprzemijania"],
      coverEmoji: "🪨",
      aliases: ["Syzyf", "Syzyfowa praca"],
      characters: ["syzyf"],
      quotes: [],
      images: []
    },
    
    {
      id: "prometheus",
      title: "Mit o Prometeuszu",
      description: "Mit o Prometeuszu opowiada o tytanie, który stworzył lub wspierał ludzi i został za to surowo ukarany przez bogów. Motyw buntu ukazuje sprzeciw wobec boskiego porządku. Motyw poświęcenia przedstawia oddanie dobra ludzkości kosztem własnego cierpienia. Motyw cierpienia ujawnia wieczną karę jako konsekwencję sprzeciwu wobec władzy.",
      epoch: "starożytność",
      motifs: ["motywbuntu", "motywposwiecenia", "motywcierpienia"],
      coverEmoji: "🔥",
      aliases: ["Prometeusz"],
      characters: ["prometeusz"],
      quotes: [],
      images: []
    },
    
    {
      id: "narcissus",
      title: "Mit o Narcyzie",
      description: "Mit o Narcyzie przedstawia młodzieńca zakochanego we własnym odbiciu, który nie potrafi oderwać się od siebie samego. Motyw miłości ukazuje uczucie skierowane ku własnej osobie jako formę destrukcji. Motyw samotności pokazuje całkowite wyobcowanie jednostki. Motyw przemiany ujawnia się w przemianie Narcyza w kwiat.",
      epoch: "starożytność",
      motifs: ["motywmilosci", "motywsamotnosci", "motywprzemiany"],
      coverEmoji: "🌸",
      aliases: ["Narcyz"],
      characters: ["narcyz"],
      quotes: [],
      images: []
    },
    
    {
      id: "theseus",
      title: "Mit o Tezeuszu",
      description: "Mit o Tezeuszu opowiada o herosie, który pokonuje Minotaura i odnajduje drogę z labiryntu dzięki pomocy Ariadny. Motyw podróży i wędrówki ukazuje drogę bohatera przez nieznane i niebezpieczne przestrzenie. Motyw rycerza przedstawia odwagę i heroizm jednostki. Motyw miłości pojawia się w relacji z Ariadną jako element prowadzący do zwycięstwa.",
      epoch: "starożytność",
      motifs: ["motywpodrozywedrowki", "motywrycerza", "motywmilosci"],
      coverEmoji: "🧵",
      aliases: ["Tezeusz", "Minotaur"],
      characters: ["tezeusz"],
      quotes: [],
      images: []
    },
    
    {
      id: "heracles",
      title: "Mit o Heraklesie",
      description: "Mit o Heraklesie przedstawia bohatera wykonującego dwanaście prac jako pokutę i drogę do oczyszczenia. Motyw pracy ukazuje wysiłek i próbę przekroczenia ludzkich ograniczeń. Motyw poświęcenia ujawnia cenę heroizmu i cierpienia. Motyw rycerza pokazuje idealizację siły i odwagi.",
      epoch: "starożytność",
      motifs: ["motywpracy", "motywposwiecenia", "motywrycerza"],
      coverEmoji: "🦁",
      aliases: ["Herakles", "Herkules"],
      characters: ["herakles"],
      quotes: [],
      images: []
    },
    
    {
      id: "daedalus_icarus",
      title: "Mit o Dedalu i Ikarze",
      description: "Mit opowiada o ucieczce Dedala i Ikara z Krety przy użyciu skrzydeł, zakończonej tragicznym upadkiem Ikara. Motyw marzycielstwa ukazuje dążenie do przekraczania granic ludzkich możliwości. Motyw podróży i wędrówki przedstawia ucieczkę jako drogę ku wolności. Motyw przemiany ujawnia dojrzewanie i konsekwencje wyborów.",
      epoch: "starożytność",
      motifs: ["motywmarzycielstwa", "motywpodrozywedrowki", "motywprzemiany"],
      coverEmoji: "🕊️",
      aliases: ["Dedal i Ikar"],
      characters: ["dedal", "ikar"],
      quotes: [],
      images: []
    },
    
    {
      id: "oedipus",
      title: "Mit o Edypie",
      description: "Mit o Edypie opowiada o królu, który nieświadomie spełnia tragiczną przepowiednię o zabiciu ojca i poślubieniu matki. Motyw fatum/przeznaczenia ukazuje nieuchronność losu człowieka. Motyw szaleństwa przedstawia rozpad tożsamości i psychiczne załamanie bohatera. Motyw winy i kary ukazuje konsekwencje czynów niezależnych od świadomości.",
      epoch: "starożytność",
      motifs: ["motywfatumprzeznaczenia", "motywszalenstwa", "motywwinyikary"],
      coverEmoji: "👁️",
      aliases: ["Edyp", "Król Edyp"],
      characters: ["edyp"],
      quotes: [],
      images: []
    },
    
    {
      id: "trojan_war",
      title: "Wojna trojańska",
      description: "Wojna trojańska przedstawia wieloletni konflikt między Grekami a Troją wywołany porwaniem Heleny. Motyw wojny ukazuje destrukcyjny wpływ konfliktu na jednostki i społeczeństwa. Motyw patriotyzmu przedstawia walkę o honor i ojczyznę. Motyw zdrady ujawnia konsekwencje nielojalności. Motyw zemsty napędza działania bohaterów po obu stronach konfliktu.",
      epoch: "starożytność",
      motifs: ["motywwojny", "motywpatriotyzmu", "motywzdrady", "motywzemsty"],
      coverEmoji: "⚔️",
      aliases: ["Iliada", "wojna o Troję"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "lament_swietokrzyski",
      title: "Lament świętokrzyski",
      description: "Lament świętokrzyski to średniowieczny monolog Matki Boskiej opłakującej mękę i śmierć Chrystusa. Motyw matki ukazuje cierpienie rodzicielskie i bezradność wobec losu dziecka. Motyw cierpienia przedstawia ból emocjonalny i duchowy. Motyw Boga ujawnia religijny wymiar tragedii.",
      epoch: "średniowiecze",
      motifs: ["motywmatki", "motywcierpienia", "motywboga"],
      coverEmoji: "💔",
      aliases: ["Posłuchajcie bracia miła"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "roland",
      title: "Pieśń o Rolandzie",
      description: "Pieśń o Rolandzie to średniowieczny epos rycerski opisujący bohaterską śmierć Rolanda w walce z Saracenami. Motyw rycerza ukazuje ideał honoru i odwagi. Motyw patriotyzmu przedstawia lojalność wobec władcy i ojczyzny. Motyw poświęcenia ujawnia gotowość do śmierci za wartości. Motyw wojny pokazuje brutalność konfliktu.",
      epoch: "średniowiecze",
      motifs: ["motywrycerza", "motywpatriotyzmu", "motywposwiecenia", "motywwojny"],
      coverEmoji: "🛡️",
      aliases: ["Roland"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "dziady_ii",
      title: "Dziady cz. II",
      description: "Dziady cz. II przedstawiają obrzęd wywoływania duchów i kontaktu ze światem zmarłych. Motyw winy i kary ukazuje konsekwencje moralne czynów po śmierci. Motyw Boga pojawia się jako element porządku metafizycznego. Motyw śmierci podkreśla granicę między światem żywych i umarłych.",
      epoch: "romantyzm",
      motifs: ["motywwinyikary", "motywboga", "motywsmierci"],
      coverEmoji: "🕯️",
      aliases: ["Dziady II"],
      characters: [],
      quotes: [],
      images: []
    },
    
    {
      id: "dziady_iii",
      title: "Dziady cz. III",
      description: "Dziady cz. III ukazują walkę jednostki i narodu z opresyjną władzą zaborcy. Motyw buntu przedstawia sprzeciw wobec tyranii. Motyw patriotyzmu ukazuje cierpienie i poświęcenie Polaków. Motyw władzy pokazuje mechanizmy opresji. Motyw cierpienia ujawnia doświadczenie zesłania i represji.",
      epoch: "romantyzm",
      motifs: ["motywbuntu", "motywpatriotyzmu", "motywwladzy", "motywcierpienia"],
      coverEmoji: "🇵🇱",
      aliases: ["Dziady III"],
      characters: ["konrad"],
      quotes: [],
      images: []
    },
    
    {
      id: "pan_tadeusz",
      title: "Pan Tadeusz",
      description: "Pan Tadeusz przedstawia historię szlacheckiego Soplicowa i konfliktów oraz pojednania jego mieszkańców. Motyw patriotyzmu ukazuje tęsknotę za ojczyzną i nadzieję na jej odrodzenie. Motyw tradycji i obyczajów przedstawia świat szlachty i jego rytuały. Motyw miłości ukazuje relacje bohaterów jako siłę jednoczącą. Motyw natury ukazuje harmonię świata przyrody i człowieka. Motyw dworku idealizuje życie szlacheckie.",
      epoch: "romantyzm",
      motifs: ["motywpatriotyzmu", "motywobyczajowitradycji", "motywmilosci", "motywprzyrodynatury", "motywdworku"],
      coverEmoji: "🌿",
      aliases: ["Pan Tadeusz Mickiewicz"],
      characters: ["tadek"],
      quotes: [],
      images: []
    }
    
  ],

  motifs: [
    { id: "motywsmierci", name: "Motyw Śmierci", description: "Nieuchronność kresu życia i refleksja nad sensem istnienia", books: ["antygona", "getto", "dzuma", "iliada", "polikarp"], aliases: ["śmierć", "smierc", "motyw śmierci", "motyw smierci"], images: [{ src: "images/motywy/smierc/smierc-marata-david.jpg" }], poems: [] },
    { id: "motywzyda", name: "Motyw Żyda", description: "Obraz mniejszości żydowskiej oraz problem uprzedzeń i asymilacji", books: ["getto"], aliases: ["żyd", "zyd", "motyw żyda", "motyw zyda"], images: [{ src: "images/motywy//zyda/images (2).jpg" }], poems: [] },
    { id: "motywartysty", name: "Motyw Artysty", description: "Wyjątkowość twórcy i konflikt między sztuką a społeczeństwem", books: ["wesele"], aliases: ["artysta", "motyw artysty", "twórca", "tworca"], images: [{ src: "images/motywy/artysta/panny_dworskie-jpg.jpg" }], poems: [] },
    { id: "motywarystokracji", name: "Motyw Arystokracji", description: "Krytyka uprzywilejowanych warstw i ich oderwania od rzeczywistości", books: ["lalka"], aliases: ["arystokracja", "motyw arystokracji", "arystokraci"], images: [{ src: "images/motywy/arystokracja/Portret holenderskiego patrycjusza.jpg" }], poems: [] },
    { id: "motywbiedy", name: "Motyw Biedy", description: "Degradacja człowieka wynikająca z ubóstwa i nierówności społecznych", books: ["zbrodniaikara", "przedwiosnie"], aliases: ["bieda", "motyw biedy", "ubóstwo", "ubostwo"], images: [{ src: "images/motywy/bieda/matula_pomarli-jpg.jpg" }], poems: [] },
    { id: "motywboga", name: "Motyw Boga", description: "Poszukiwanie sensu życia i relacji człowieka z absolutem", books: ["potop", "getto", "dzuma", "polikarp"], aliases: ["bóg", "bog", "motyw boga"], images: [{ src: "images/motywy/bog/laskami-slynacy-obraz-boga-ojca-kielce.jpg" }], poems: [] },
    { id: "motywbohateraromantycznego", name: "Motyw Bohatera Romantycznego", description: "Indywidualizm, samotność i bunt jednostki wobec świata", books: [], aliases: ["bohater romantyczny", "motyw bohatera romantycznego", "romantyk"], images: [{ src: "images/motywy/bohater_romantyczny/Wańkowicz_Adam_Mickiewicz.jpg" }], poems: [] },
    { id: "motywbuntu", name: "Motyw Buntu", description: "Sprzeciw wobec norm społecznych, władzy lub przeznaczenia", books: ["wesele", "antygona", "tango", "1984", "innyswiat", "przedwiosnie", "ferdydurke", "getto", "dzuma"], aliases: ["bunt", "motyw buntu", "sprzeciw"], images: [{ src: "images/motywy/bunt/Eugène_Delacroix_-_La_liberté_guidant_le_peuple.jpg" }], poems: [] },
    { id: "motywcorki", name: "Motyw Córki", description: "Relacje rodzinne oraz emocjonalna więź dziecka z rodzicami", books: [], aliases: ["córka", "corka", "motyw córki", "motyw corki"], images: [{ src: "images/motywy/corka/Mattia_Preti_-_Lot_and_his_Daughters_ca_1675-1680_-_(MeisterDrucke-763198).jpg" }], poems: [] },
    { id: "motywcierpienia", name: "Motyw Cierpienia", description: "Ból fizyczny lub psychiczny jako doświadczenie kształtujące człowieka", books: ["innyswiat", "gaz", "dzuma"], aliases: ["cierpienie", "motyw cierpienia", "ból", "bol"], images: [{ src: "images/motywy/cierpienie/hieronim_bosch_sad_ostateczny-jpg.jpg" }], poems: [] },
    { id: "motywdomu", name: "Motyw Domu", description: "Dom jako symbol bezpieczeństwa, tradycji i tożsamości", books: ["ferdydurke"], aliases: ["dom", "motyw domu", "ognisko domowe"], images: [{ src: "images/motywy/dom/ferdynand_ruszyc_stary_dom-jpg.jpg" }], poems: [] },
    { id: "motywdworku", name: "Motyw Dworku", description: "Idealizacja życia szlacheckiego i przywiązania do tradycji", books: ["ferdydurke"], aliases: ["dworek", "motyw dworku", "dwór", "dwor"], images: [{ src: "images/motywy/dworek/jozef_szermentowski_poddanstwo-jpg.jpg" }], poems: [] },
    { id: "motywdziecka", name: "Motyw Dziecka", description: "Niewinność, wrażliwość i dojrzewanie młodego człowieka", books: [], aliases: ["dziecko", "motyw dziecka", "dzieciństwo", "dziecinstwo"], images: [{ src: "images/motywy/dziecko/jan_matejko__dzieci-jpg.jpg" }], poems: [] },
    { id: "motywfatumprzeznaczenia", name: "Motyw Fatum/Przeznaczenia", description: "Nieuchronność losu determinującego życie bohatera", books: ["antygona", "magbet", "iliada"], aliases: ["fatum", "przeznaczenie", "motyw fatum", "motyw przeznaczenia"], images: [{ src: "images/motywy/fatum/Francisco_de_Goya,_Saturno_devorando_a_su_hijo_(1819-1823).jpg" }], poems: [] },
    { id: "motywfilantropii", name: "Motyw Filantropii", description: "Bezinteresowna pomoc innym jako wyraz humanizmu", books: ["lalka"], aliases: ["filantropia", "motyw filantropii", "pomoc innym"], images: [{ src: "images/motywy/filantropia/filantropia.jpg" }], poems: [] },
    { id: "motywkariery", name: "Motyw Kariery", description: "Dążenie do sukcesu społecznego i zawodowego", books: ["lalka"], aliases: ["kariera", "motyw kariery", "awans społeczny", "awans spoleczny"], images: [{ src: "images/motywy/kariera/Courbet_-_Kamieniarze.jpg" }], poems: [] },
    { id: "motywkobiety", name: "Motyw Kobiety", description: "Różnorodne role kobiet i społeczne wyobrażenia o kobiecości", books: ["chlopi", "lalka", "magbet"], aliases: ["kobieta", "motyw kobiety", "kobiecość", "kobiecosc"], images: [{ src: "images/motywy/kobieta/monalisa.jpg" }], poems: [] },
    { id: "motywkonfliktu", name: "Motyw Konfliktu", description: "Starcie przeciwstawnych racji, wartości lub interesów", books: ["antygona", "tango", "przedwiosnie", "andrews", "miejsce"], aliases: ["konflikt", "motyw konfliktu", "spór", "spor"], images: [{ src: "images/motywy/konflikt/jan-moniuszko-pojedynek-w-karczmie-mnw.jpg" }], poems: [] },
    { id: "motywkonfliktupokolen", name: "Motyw Konfliktu Pokoleń", description: "Różnice światopoglądowe między młodymi a starszymi", books: ["wesele", "tango", "skapiec", "ferdydurke", "edek"], aliases: ["konflikt pokoleń", "konflikt pokolen", "motyw konfliktu pokoleń", "motyw konfliktu pokolen"], images: [{ src: "images/motywy/konflikt_pokolen/rembrandt_van_rijn_powrot_syna_marnotrawnego-jpg.jpg" }], poems: [] },
    { id: "motywmarzycielstwa", name: "Motyw Marzycielstwa", description: "Ucieczka w świat wyobrażeń i idealistycznych wizji", books: [], aliases: ["marzycielstwo", "motyw marzycielstwa", "marzenia"], images: [{ src: "images/motywy/marzycielstwo/53796_1_zoom.jpg" }], poems: [] },
    { id: "motywmatki", name: "Motyw Matki", description: "Miłość macierzyńska, troska i poświęcenie dla dziecka", books: [], aliases: ["matka", "motyw matki", "macierzyństwo", "macierzynstwo"], images: [{ src: "images/motywy/matka/Whistler-matka-whistlera.jpg" }], poems: [] },
    { id: "motywmilosci", name: "Motyw Miłości", description: "Uczucie jako źródło szczęścia, cierpienia lub przemiany bohatera", books: ["chlopi", "zbrodniaikara", "1984", "skapiec", "lalka", "potop"], aliases: ["miłość", "milosc", "motyw miłości", "motyw milosci"], images: [{ src: "images/motywy/milosc/Edmund-Leighton-Tristan_and_Isolde-1902.jpg" }], poems: [] },
    { id: "motywmiasta", name: "Motyw Miasta", description: "Miasto jako przestrzeń rozwoju, anonimowości i zepsucia", books: ["zbrodniaikara", "andrews"], aliases: ["miasto", "motyw miasta", "metropolia"], images: [{ src: "images/motywy/miasto/bernardo_bellotto_widok_na_warszawe-jpg.jpg" }], poems: [] },
    { id: "motywmieszczanstwa", name: "Motyw Mieszczaństwa", description: "Obraz klasy średniej oraz jej aspiracji i ograniczeń", books: ["skapiec", "lalka"], aliases: ["mieszczaństwo", "mieszczanstwo", "motyw mieszczaństwa", "motyw mieszczanstwa"], images: [{ src: "images/motywy/mieszczanstwo/0.0.IMG_3947.jpg" }], poems: [] },
    { id: "motywmogily", name: "Motyw Mogiły", description: "Pamięć o zmarłych i narodowa tradycja pamięci", books: [], aliases: ["mogiła", "mogila", "motyw mogiły", "motyw mogily"], images: [{ src: "images/motywy/mogila/unnamed.jpg" }], poems: [] },
    { id: "motywobyczajowitradycji", name: "Motyw Obyczajów i Tradycji", description: "Znaczenie norm społecznych i kulturowego dziedzictwa", books: ["tango"], aliases: ["obyczaje", "tradycja", "motyw obyczajów i tradycji", "motyw obyczajow i tradycji"], images: [{ src: "images/motywy/obyczaje_tradycja/8._Lithuanian_Girl.jpg" }], poems: [] },
    { id: "motywojca", name: "Motyw Ojca", description: "Autorytet rodzicielski i relacje ojca z dzieckiem", books: ["chlopi", "przedwiosnie"], aliases: ["ojciec", "motyw ojca", "ojcostwo"], images: [{ src: "images/motywy/ojciec/2662.jpg" }], poems: [] },
    { id: "motywpatriotyzmu", name: "Motyw Patriotyzmu", description: "Miłość do ojczyzny i gotowość do poświęceń dla narodu", books: ["wesele", "potop", "przedwiosnie", "iliada"], aliases: ["patriotyzm", "motyw patriotyzmu", "ojczyzna"], images: [{ src: "images/motywy/patriotyzm/jacek-malczewski-melancholia-palac-rogalin.jpg" }], poems: [] },
    { id: "motywpieniadza", name: "Motyw Pieniądza", description: "Wpływ majątku na relacje międzyludzkie i moralność", books: ["skapiec"], aliases: ["pieniądz", "pieniadz", "motyw pieniądza", "motyw pieniadza"], images: [{ src: "images/motywy/pieniedzy/pieniadz4.jpg" }], poems: [] },
    { id: "motywposwiecenia", name: "Motyw Poświęcenia", description: "Rezygnacja z własnego dobra dla wyższych wartości", books: ["antygona", "zbrodniaikara", "innyswiat", "getto", "dzuma"], aliases: ["poświęcenie", "poswiecenie", "motyw poświęcenia", "motyw poswiecenia"], images: [{ src: "images/motywy/poswiecenie/Sacrifice_of_Isaac-Caravaggio_(Uffizi).jpg" }], poems: [] },
    { id: "motywpodrozywedrowki", name: "Motyw Podróży/Wędrówki", description: "Poszukiwanie sensu życia i dojrzewanie bohatera", books: ["andrews"], aliases: ["podróż", "podroz", "wędrówka", "wedrowka", "motyw podróży"], images: [{ src: "images/motywy/podroz_wedrowka/Caspar-David-Friedrich_Wedrowiec-nad-morzem-mgly_ok.-1817-315x400.jpg" }], poems: [] },
    { id: "motywpoezjiipoety", name: "Motyw Poezji i Poety", description: "Rola poety i znaczenie twórczości w społeczeństwie", books: [], aliases: ["poeta", "poezja", "motyw poezji i poety", "motyw poety"], images: [{ src: "images/motywy/pozeja_poeta/nicolas_poussin_natchnienie_poety-jpg.jpg" }], poems: [] },
    { id: "motywpojedynku", name: "Motyw Pojedynku", description: "Honorowe rozstrzyganie konfliktów i walka o godność", books: [], aliases: ["pojedynek", "motyw pojedynku", "walka honorowa"], images: [{ src: "images/motywy/pojedynek/pojedynek-mnw.jpg" }], poems: [] },
    { id: "motywpolskiipolakow", name: "Motyw Polski i Polaków", description: "Refleksja nad tożsamością narodową i kondycją społeczeństwa", books: ["wesele", "tango", "edek"], aliases: ["polska", "polacy", "motyw polski i polaków", "motyw polski i polakow"], images: [{ src: "images/motywy/polska_polacy/Jan_Matejko_-_Upadek_Polski_(Reytan).jpg" }], poems: [] },
    { id: "motywpowstania", name: "Motyw Powstania", description: "Walka narodowowyzwoleńcza i jej konsekwencje", books: ["getto"], aliases: ["powstanie", "motyw powstania", "walka narodowowyzwoleńcza"], images: [{ src: "images/motywy/powstanie/artur-grottger_pozar-dworu-pod-miechowem_3020_tile.jpg" }], poems: [] },
    { id: "motywpracy", name: "Motyw Pracy", description: "Praca jako wartość budująca człowieka i społeczeństwo", books: ["chlopi", "lalka"], aliases: ["praca", "motyw pracy", "wysiłek", "wysilek"], images: [{ src: "images/motywy/praca/images.jpg" }], poems: [] },
    { id: "motywprzemiany", name: "Motyw Przemiany", description: "Wewnętrzna metamorfoza bohatera pod wpływem doświadczeń", books: ["zbrodniaikara", "potop", "przedwiosnie", "ferdydurke", "gaz"], aliases: ["przemiana", "motyw przemiany", "metamorfoza"], images: [{ src: "images/motywy/przemiana/60fad2ea3263a.jpg" }], poems: [] },
    { id: "motywprzemijania", name: "Motyw Przemijania", description: "Ulotność życia i nieuchronność upływu czasu", books: ["lalka", "polikarp"], aliases: ["przemijanie", "motyw przemijania", "upływ czasu", "uplyw czasu"], images: [{ src: "images/motywy/przemijanie/250px-Pieter_Claeszoon-_Vanitas_-_Still_Life_(1625,_29,5_x_34,5_cm).jpg" }], poems: [] },
    { id: "motywprzepowiedni", name: "Motyw Przepowiedni", description: "Zapowiedź przyszłych wydarzeń wpływająca na los bohatera", books: ["magbet"], aliases: ["przepowiednia", "motyw przepowiedni", "proroctwo"], images: [{ src: "images/motywy/przepowiednia/Vittore_Carpaccio_-_The_Prediction_of_St_Stephen_in_Jerusalem_Painting_part_of_a_series_executed_for_-_(MeisterDrucke-998982).jpg
" }], poems: [] },
    { id: "motywprzyjazni", name: "Motyw Przyjaźni", description: "Więź oparta na lojalności, wsparciu i zaufaniu", books: ["dzuma"], aliases: ["przyjaźń", "przyjazn", "motyw przyjaźni", "motyw przyjazni"], images: [{ src: "images/motywy/przyjazn/Breslau_-_Friends.jpg" }], poems: [] },
    { id: "motywprzyrodynatury", name: "Motyw Przyrody/Natury", description: "Natura jako odbicie emocji i harmonii świata", books: ["chlopi"], aliases: ["przyroda", "natura", "motyw przyrody", "motyw natury"], images: [{ src: "images/motywy/przyroda_natura/henri_rousseau_tygrys_podczas_burzy_tropikalnej-jpg.jpg" }], poems: [] },
    { id: "motywrewolucji", name: "Motyw Rewolucji", description: "Gwałtowne przemiany społeczne i polityczne", books: ["przedwiosnie"], aliases: ["rewolucja", "motyw rewolucji", "przewrót", "przewrot"], images: [{ src: "images/motywy/rewolucja/La_Liberté_guidant_le_peuple_-_Eugène_Delacroix_-_Musée_du_Louvre_Peintures_RF_129_-_après_restauration_2024.jpg" }], poems: [] },
    { id: "motywrodziny", name: "Motyw Rodziny", description: "Relacje rodzinne jako źródło wsparcia lub konfliktów", books: ["chlopi", "tango", "skapiec"], aliases: ["rodzina", "motyw rodziny", "więzi rodzinne", "wiezi rodzinne"], images: [{ src: "images/motywy/rodzina/Jan_Matejko_-_Portret_trojga_dzieci_artysty.jpg" }], poems: [] },
    { id: "motywrusyfikacji", name: "Motyw Rusyfikacji", description: "Wynaradawianie społeczeństwa pod wpływem zaborcy rosyjskiego", books: [], aliases: ["rusyfikacja", "motyw rusyfikacji", "wynaradawianie"], images: [{ src: "images/motywy/rusyfikacja/Edvard_Isto.jpg" }], poems: [] },
    { id: "motywrycerza", name: "Motyw Rycerza", description: "Honor, odwaga i wierność ideałom", books: ["potop", "iliada"], aliases: ["rycerz", "motyw rycerza", "rycerskość", "rycerskosc"], images: [{ src: "images/motywy/rycerz/images (1).jpg" }], poems: [] },
    { id: "motywrzeki", name: "Motyw Rzeki", description: "Symbol życia, przemijania i nieustannego ruchu", books: [], aliases: ["rzeka", "motyw rzeki", "nurt rzeki"], images: [{ src: "images/motywy/rzeka/D-Gromacki_Rzeki-Puszczy-Bialowieskiej-Braszcza_90x60_olej-na-plotnie_2024-scaled.jpg
" }], poems: [] },
    { id: "motywsamobojstwa", name: "Motyw Samobójstwa", description: "Tragiczna ucieczka od cierpienia lub konfliktu wewnętrznego", books: [], aliases: ["samobójstwo", "samobojstwo", "motyw samobójstwa", "motyw samobojstwa"], images: [{ src: "images/motywy/samobojstwo/1040px-edouard_manet_-_le_suicide-1024x886.jpg" }], poems: [] },
    { id: "motywsamotnosci", name: "Motyw Samotności", description: "Osamotnienie jednostki i wyobcowanie ze społeczeństwa", books: ["innyswiat", "gaz", "miejsce"], aliases: ["samotność", "samotnosc", "motyw samotności", "motyw samotnosci"], images: [{ src: "images/motywy/samotnosc/Van_Gogh_Trauernder_alter_Mann.jpg" }], poems: [] },
    { id: "motywsnu", name: "Motyw Snu", description: "Sen jako przestrzeń wizji, proroctwa lub podświadomości", books: [], aliases: ["sen", "motyw snu", "marzenie senne"], images: [{ src: "images/motywy/sen/fussli-nocna-mara-detroit.jpg" }], poems: [] },
    { id: "motywspisku", name: "Motyw Spisku", description: "Tajne działania prowadzące do zmiany politycznej lub społecznej", books: ["magbet"], aliases: ["spisek", "motyw spisku", "konspiracja"], images: [{ src: "images/motywy/spisek/Durer_chrystus.jpg" }], poems: [] },
    { id: "motywstarosci", name: "Motyw Starości", description: "Refleksja nad przemijaniem i doświadczeniem życiowym", books: [], aliases: ["starość", "starosc", "motyw starości", "motyw starosci"], images: [{ src: "images/motywy/starosc/2bBWO6g7dXBUn0Gkpd63LWb4HW9cL6x4.jpg" }], poems: [] },
    { id: "motywsyna", name: "Motyw Syna", description: "Relacja syna z rodziną oraz proces dojrzewania", books: ["chlopi"], aliases: ["syn", "motyw syna", "dziecko"], images: [{ src: "images/motywy/syn/Ritorno_del_figliol_prodigo_Guercino_ante_1617_Galleria_Sabauda.jpg" }], poems: [] },
    { id: "motywszalenstwa", name: "Motyw Szaleństwa", description: "Utrata kontroli nad rozumem i emocjami", books: ["magbet", "zbrodniaikara"], aliases: ["szaleństwo", "szalenstwo", "motyw szaleństwa", "motyw szalenstwa"], images: [{ src: "images/motywy/szalenstwo/Van_Gogh_-_Selbstbildnis_mit_verbundenem_Ohr.jpeg" }], poems: [] },
    { id: "motywszatana", name: "Motyw Szatana", description: "Uosobienie zła i pokusy prowadzącej do upadku", books: [], aliases: ["szatan", "motyw szatana", "diabeł", "diabel"], images: [{ src: "images/motywy/szatan/diabel26.jpg" }], poems: [] },
    { id: "motywszczesciaarkadii", name: "Motyw Szczęścia/Arkadii", description: "Wizja idealnego świata pełnego harmonii i spokoju", books: [], aliases: ["arkadia", "szczęście", "szczescie", "motyw arkadii"], images: [{ src: "images/motywy/szczescie_arkadia/z16280579IER,-Ogrod-rozkoszy-ziemskich--Hieronima-Boscha.jpg" }], poems: [] },
    { id: "motywszkoly", name: "Motyw Szkoły", description: "Edukacja jako narzędzie rozwoju lub zniewolenia", books: ["ferdydurke"], aliases: ["szkoła", "szkola", "motyw szkoły", "motyw szkoly"], images: [{ src: "images/motywy/szkola/henri_toulouse-lautrec-jpg.jpg
" }], poems: [] },
    { id: "motywszlachty", name: "Motyw Szlachty", description: "Obraz warstwy szlacheckiej i jej tradycji", books: ["ferdydurke"], aliases: ["szlachta", "motyw szlachty", "szlachcic"], images: [{ src: "images/motywy/szlachta/m gierymski zajazd na soplicowo.jpg" }], poems: [] },
    { id: "motywtanca", name: "Motyw Tańca", description: "Taniec jako symbol relacji społecznych lub emocji zbiorowych", books: ["wesele", "chlopi"], aliases: ["taniec", "motyw tańca", "motyw tanca"], images: [{ src: "images/motywy/taniec/danse-macabre-bernardyni-3-892x1200.jpg" }], poems: [] },
    { id: "motywtotalitaryzmu", name: "Motyw Totalitaryzmu", description: "Zniewolenie jednostki przez system polityczny", books: ["innyswiat", "1984"], aliases: ["totalitaryzm", "motyw totalitaryzmu", "dyktatura"], images: [{ src: "images/motywy/totalitaryzm/Guernica_reproduction_on_tiled_wall,_Guernica,_Spain_(PPL3-Altered)_julesvernex2.jpg
" }], poems: [] },
    { id: "motywuczniaimistrza", name: "Motyw Ucznia i Mistrza", description: "Relacja oparta na przekazywaniu wiedzy i doświadczenia", books: ["polikarp"], aliases: ["uczeń i mistrz", "uczen i mistrz", "motyw ucznia i mistrza"], images: [{ src: "images/motywy/uczen_mistrz/artur_grottger_szkola_szlachcica_polskiego-jpg.jpg" }], poems: [] },
    { id: "motywwladcy", name: "Motyw Władcy", description: "Obraz rządzącego i odpowiedzialności za państwo", books: ["antygona"], aliases: ["władca", "wladca", "motyw władcy", "motyw wladcy"], images: [{ src: "images/motywy/wladca/David-Bonaparte.jpg" }], poems: [] },
    { id: "motywwladzy", name: "Motyw Władzy", description: "Mechanizmy sprawowania kontroli i wpływu na ludzi", books: ["antygona", "magbet", "tango", "1984", "edek"], aliases: ["władza", "wladza", "motyw władzy", "motyw wladzy"], images: [{ src: "images/motywy/wladza/Koronacja-Napoleona-2.jpg" }], poems: [] },
    { id: "motywwinyikary", name: "Motyw Winy i Kary", description: "Moralne konsekwencje popełnionych czynów", books: ["magbet", "zbrodniaikara"], aliases: ["wina i kara", "motyw winy i kary", "kara", "wina"], images: [{ src: "images/motywy/wina_kara/benjamin_west_wenus_oplakujaca_adonisa-jpg.jpg" }], poems: [] },
    { id: "motywwojny", name: "Motyw Wojny", description: "Tragizm konfliktów zbrojnych i ich wpływ na człowieka", books: ["potop", "gaz", "getto", "iliada"], aliases: ["wojna", "motyw wojny", "konflikt zbrojny"], images: [{ src: "images/motywy/wojna/francisco_goya_kolos-jpg.jpg" }], poems: [] },
    { id: "motywwolnosci", name: "Motyw Wolności", description: "Dążenie jednostki lub narodu do niezależności", books: ["innyswiat", "1984"], aliases: ["wolność", "wolnosc", "motyw wolności", "motyw wolnosci"], images: [{ src: "images/motywy/wolnosc/eugene-delacroix-wolnosc-wiodaca-na-barykady.jpg" }], poems: [] },
    { id: "motywwsi", name: "Motyw Wsi", description: "Idealizacja lub krytyka życia wiejskiego i chłopstwa", books: ["wesele", "chlopi"], aliases: ["wieś", "wies", "motyw wsi", "życie na wsi"], images: [{ src: "images/motywy/wies/teodor_axentowicz_kolomyjka-jpg.jpg" }], poems: [] },
    { id: "motywzla", name: "Motyw Zła", description: "Obecność destrukcyjnych sił w świecie i człowieku", books: ["magbet", "innyswiat", "gaz"], aliases: ["zło", "zlo", "motyw zła", "motyw zla"], images: [{ src: "images/motywy/zlo/eugene_delacroix-jpg.jpg" }], poems: [] },
    { id: "motywzbrodni", name: "Motyw Zbrodni", description: "Przekroczenie norm moralnych i jego konsekwencje", books: ["magbet", "zbrodniaikara", "gaz"], aliases: ["zbrodnia", "motyw zbrodni", "przestępstwo", "przestepstwo"], images: [{ src: "images/motywy/zbrodnia/pierre_paul_prudhon-jpg.jpg" }], poems: [] },
    { id: "motywzdrady", name: "Motyw Zdrady", description: "Złamanie lojalności wobec bliskich, idei lub ojczyzny", books: ["1984", "potop"], aliases: ["zdrada", "motyw zdrady", "nielojalność", "nielojalnosc"], images: [{ src: "images/motywy/zdrada/DoVFE8egCJ7xf03wXkXAPEb9puV8AzDk.jpeg" }], poems: [] },
    { id: "motywzemsty", name: "Motyw Zemsty", description: "Pragnienie odwetu prowadzące do konfliktu i destrukcji", books: ["iliada"], aliases: ["zemsta", "motyw zemsty", "odwet"], images: [{ src: "images/motywy/zemsta/artemisia-gentileschi_judyta-holofernes.jpg" }], poems: [] },
  ],

  characters: [
    {
      id: "chochol",
      name: "Chochoł",
      description: "Symbol marazmu narodowego i uśpienia społeczeństwa polskiego. Pojawia się jako zjawa na weselu i prowadzi chocholi taniec — symbol narodowego letargu i niemożności działania.",
      motifs: ["motywtanca", "motywpolskiipolakow", "motywbuntu"]
    },
    {
      id: "poeta",
      name: "Poeta",
      description: "Krakowski inteligent obecny na weselu, negatywnie nastawiony do chłopomanii. Nawiedza go zjawa Rycerza, która budzi w nim chwilową nadzieję i chęć walki o niepodległość — ta jednak znika wraz z nadejściem poranka.",
      motifs: ["motywartysty", "motywpatriotyzmu", "motywbuntu"]
    },
    {
      id: "mlody",
      name: "Pan Młody",
      description: "Krakowski artysta, który bierze chłopkę za żonę. Idealizuje wieś i życie chłopskie, nie mając o nich żadnego pojęcia — uosabia powierzchowną fascynację ludu.",
      motifs: ["motywartysty", "motywwsi"]
    },
    {
      id: "gospodarz",
      name: "Gospodarz",
      description: "Artysta od dawna mieszkający na wsi. Nawiedza go zjawa Wernyhory, który każe mu zebrać chłopów do walki i wręcza złoty róg. Gospodarz przekazuje go Jaśkowi, który go gubi — motyw straconej szansy na zryw narodowy.",
      motifs: ["motywpatriotyzmu", "motywpolskiipolakow"]
    },
    {
      id: "antygona",
      name: "Antygona",
      description: "Córka Edypa, siostra Eteokla i Polinika. Staje przed tragiczną decyzją: posłuchać rozkazu króla i nie pochować Polinika, czy postąpić zgodnie z prawem boskim i oddać bratu należny mu pogrzeb. Wybiera prawo boskie, płacąc za to życiem.",
      motifs: ["motywbuntu", "motywposwiecenia", "motywfatumprzeznaczenia"]
    },
    {
      id: "kreon",
      name: "Kreon",
      description: "Król Teb, który zakazuje pochowania Polinika uznając go za zdrajcę ojczyzny. Nie przyjmuje żadnych sprzeciwów, a jego upór i pycha prowadzą do śmierci syna, żony i bratanicy.",
      motifs: ["motywwladcy", "motywwladzy", "motywkonfliktu"]
    },
    {
      id: "ismena",
      name: "Ismena",
      description: "Siostra Antygony. Rozumie racje siostry, lecz boi się konsekwencji złamania królewskiego rozkazu i odmawia udziału w pochówku. Uosabia postawę uległości wobec prawa państwowego.",
      motifs: ["motywkonfliktu"]
    },
    {
      id: "raskolnikow",
      name: "Raskolnikow",
      description: "Student przekonany o własnej wyjątkowości, który morderstwem lichwiarki próbuje udowodnić swoją teorię nadczłowieka — że wielkie jednostki mają prawo przekraczać moralne granice. Jednak nie jest w stanie udźwignąć ciężaru winy.",
      motifs: ["motywzbrodni", "motywwinyikary", "motywmiasta", "motywbiedy", "motywszalenstwa"]
    },
    {
      id: "sonia",
      name: "Sonia Marmieładowa",
      description: "Młoda dziewczyna zmuszona do prostytucji, by utrzymać rodzinę. Głęboko wierząca, symbolizuje miłosierdzie i przebaczenie. Zakochuje się w Raskolnikowie i towarzyszy mu na zesłaniu, będąc katalizatorem jego przemiany.",
      motifs: ["motywmilosci", "motywposwiecenia", "motywboga"]
    },
    {
      id: "makbet",
      name: "Makbet",
      description: "Dzielny rycerz i kuzyn króla Dunkana. Po usłyszeniu przepowiedni czarownic budzi się w nim żądza władzy. Podstępem morduje króla i przejmuje tron, po czym wpada w spiralę kolejnych zbrodni, nękany strachem i wyrzutami sumienia.",
      motifs: ["motywfatumprzeznaczenia", "motywprzepowiedni", "motywwladzy", "motywspisku", "motywzbrodni", "motywwinyikary"]
    },
    {
      id: "lmakbet",
      name: "Lady Makbet",
      description: "Żona Makbeta, która obmyśla plan zabójstwa Dunkana i nakłania do niego męża. Zimna i bezwzględna na początku, stopniowo traci kontrolę nad umysłem — lunatykuje i ostatecznie popada w obłęd z powodu wyrzutów sumienia.",
      motifs: ["motywkobiety", "motywszalenstwa", "motywspisku", "motywwinyikary"]
    },
    {
      id: "artur",
      name: "Artur",
      description: "Młody student, syn Stomila i Eleonory. Paradoksalnie buntuje się przeciwko anarchii rodziny, pragnąc przywrócić tradycyjne wartości i porządek. Jego próba kończy się klęską — władzę przejmuje prymitywny Edek.",
      motifs: ["motywbuntu", "motywobyczajowitradycji", "motywrodziny", "motywkonfliktupokolen"]
    },
    {
      id: "edek",
      name: "Edek",
      description: "Nieuczony i pozbawiony zasad kochanek matki Artura. Uznawany przez Stomila za reprezentanta prawdziwego, autentycznego życia. Triumfuje nad intelektualizmem Artura, ukazując zwycięstwo brutalnej siły nad rozumem.",
      motifs: ["motywwladzy", "motywpolskiipolakow"]
    },
    {
      id: "winston",
      name: "Winston Smith",
      description: "Pracownik Ministerstwa Prawdy, który potajemnie buntuje się przeciwko reżimowi Partii. Prowadzi pamiętnik, nawiązuje zakazany romans z Julią i szuka kontaktu z opozycją. Zostaje schwytany, złamany i przeprogramowany przez system.",
      motifs: ["motywbuntu", "motywwolnosci", "motywmilosci"]
    },
    {
      id: "brat",
      name: "Wielki Brat",
      description: "Tajemniczy, prawdopodobnie fikcyjny przywódca Oceanii. Jego wizerunek jest wszechobecny — symbolizuje absolutną, bezosobową władzę Partii. Samo jego istnienie jest niepewne, co czyni go jeszcze potężniejszym narzędziem kontroli.",
      motifs: ["motywtotalitaryzmu", "motywwladzy"]
    },
    {
      id: "harpagon",
      name: "Harpagon",
      description: "Bogaty paryski mieszczanin i lichwiarz, opętany obsesją gromadzenia pieniędzy. Skąpstwo rządzi każdą jego decyzją — sprzeciwia się małżeństwom dzieci, które nie przynoszą mu zysku, i przedkłada szkatułkę ze złotem nad szczęście rodziny.",
      motifs: ["motywpieniadza", "motywrodziny", "motywmieszczanstwa"]
    },
    {
      id: "wokulski",
      name: "Stanisław Wokulski",
      description: "Zamożny kupiec, który dorobił się majątku handlem. Zakochany bez wzajemności w arystokratce Izabeli Łęckiej, podporządkowuje jej temu uczuciu całe życie. Jednocześnie prowadzi działalność filantropijną na rzecz ubogich.",
      motifs: ["motywmilosci", "motywfilantropii", "motywkariery", "motywmieszczanstwa"]
    },
    {
      id: "rzecki",
      name: "Ignacy Rzecki",
      description: "Starszy przyjaciel i pracownik Wokulskiego, prowadzący sklep. Wierny ideałom napoleońskim i dawnym wartościom, prowadzi pamiętnik będący kroniką epoki. Uosabia człowieka, który nie odnajduje się w nowej rzeczywistości.",
      motifs: ["motywstarosci", "motywmieszczanstwa", "motywprzemijania"]
    },
    {
      id: "lecka",
      name: "Izabela Łęcka",
      description: "Piękna arystokratka ze zubożałej rodziny. Powierzchownie interesuje się sztuką i kulturą, traktuje Wokulskiego instrumentalnie. Jej postawa uosabia degenerację i próżność klasy szlacheckiej niezdolnej do adaptacji.",
      motifs: ["motywkobiety", "motywarystokracji"]
    },
    {
      id: "kmicic",
      name: "Andrzej Kmicic",
      description: "Młody szlachcic zaręczony z Oleńką Billewiczówną. Z początku awanturnik skłonny do przemocy, przechodzi głęboką przemianę moralną — pod przybranym nazwiskiem Babinicz walczy za ojczyznę i odzyskuje honor.",
      motifs: ["motywprzemiany", "motywpatriotyzmu", "motywmilosci", "motywrycerza"]
    },
    {
      id: "michal",
      name: "Michał Wołodyjowski",
      description: "Legendarny polski pułkownik, wzór rycerskich cnót. Uczciwy, skromny i niezrównany w walce. Całkowicie oddany obronie ojczyzny przed Szwedami, Turkami i Tatarami. Ginie bohaterską śmiercią, wysadzając twierdzę.",
      motifs: ["motywpatriotyzmu", "motywrycerza", "motywposwiecenia"]
    },
    {
      id: "baryka",
      name: "Cezary Baryka",
      description: "Syn polskiego urzędnika, wychowany w Baku. Po odzyskaniu przez Polskę niepodległości wraca do kraju i zderzа się z brutalną rzeczywistością społeczną, rozdarty między ideałami ojca, ideami rewolucji a polskim patriotyzmem.",
      motifs: ["motywprzemiany", "motywbuntu", "motywrewolucji", "motywpatriotyzmu"]
    },
    {
      id: "starybaryka",
      name: "Seweryn Baryka",
      description: "Ojciec Cezarego, carski urzędnik. Głęboki patriota, który przez lata na obczyźnie idealizuje Polskę i opowiada synowi o kraju szklanych domów. Umiera w drodze do ojczyzny, nie doczekawszy powrotu.",
      motifs: ["motywojca", "motywpatriotyzmu", "motywmarzycielstwa"]
    },
    {
      id: "jozek",
      name: "Józio Kowalski",
      description: "Trzydziestoletni mężczyzna, który za sprawą profesora Pimki zostaje cofnięty do roli szesnastolatka i odesłany do szkoły. Wędruje przez kolejne środowiska — szkołę, stancję Młodziaków, wieś — wszędzie konfrontując się z narzucanymi mu rolami społecznymi.",
      motifs: ["motywbuntu", "motywszkoly", "motywdomu", "motywdworku", "motywpodrozywedrowki"]
    },
    {
      id: "mietus",
      name: "Miętus",
      description: "Kolega Józia ze szkoły, przedstawiciel grupy chłopców starających się udowodnić swoją dorosłość przez wulgarność i prymitywizm. Marzy o autentycznym kontakcie z prostym człowiekiem — chłopem — co realizuje w groteskowy sposób.",
      motifs: ["motywszkoly", "motywdworku", "motywbuntu"]
    },
    {
      id: "rieux",
      name: "Bernard Rieux",
      description: "Lekarz mieszkający w Oranie, który od pierwszych objawów epidemii poświęca się walce z dżumą. Oddziela osobiste uczucia od obowiązku zawodowego. Uosabia postawę aktywnego humanizmu — działania pomimo braku pewności sensu.",
      motifs: ["motywposwiecenia", "motywprzyjazni", "motywbuntu", "motywsmierci"]
    },
    {
      id: "boryna",
      name: "Maciej Boryna",
      description: "Najbogatszy chłop w Lipcach, twardy i pracowity gospodarz. Poślubia młodą Jagnę, kierując się w dużej mierze interesem. Patriarcha rządzący rodziną żelazną ręką, co rodzi konflikt z synem Antkiem.",
      motifs: ["motywojca", "motywpracy", "motywwsi"]
    },
    {
      id: "jagna",
      name: "Jagna",
      description: "Młoda, piękna chłopka wydana za bogatego Borynę wbrew własnym uczuciom. Wchodzi w romans z Antkiem i innymi mężczyznami ze wsi. Staje się ofiarą społecznego ostracyzmu — zostaje wygoniona ze wsi przez tę samą społeczność, która ją pożądała.",
      motifs: ["motywkobiety", "motywmilosci", "motywwsi"]
    },
    {
      id: "antoni",
      name: "Antoni Boryna",
      description: "Syn Macieja, pracowity i porywczy. Czuje się niesprawiedliwie traktowany przez ojca w kwestii dziedziczenia ziemi. Wchodzi w zakazany romans z Jagną, żoną ojca, co staje się źródłem rodzinnego konfliktu.",
      motifs: ["motywsyna", "motywmilosci", "motywkonfliktu"]
    },
    {
      id: "hektor",
      name: "Hektor",
      description: "Najstarszy syn króla Priama, najdzielniejszy wojownik Troi. Walczy w obronie ojczyzny i rodziny, choć przeczuwa własną śmierć. Uosabia ideał rycerza, który spełnia obowiązek nawet wobec nieuchronnej klęski.",
      motifs: ["motywpatriotyzmu", "motywrycerza", "motywfatumprzeznaczenia", "motywsmierci"]
    },
    {
      id: "parys",
      name: "Parys",
      description: "Młodszy syn Priama. Porywa Helenę ze Sparty, wywołując tym samym wojnę trojańską. Piękny, lecz pozbawiony odwagi — w przeciwieństwie do Hektora unika bezpośredniej walki.",
      motifs: ["motywmilosci", "motywwojny"]
    },
    {
      id: "achilles",
      name: "Achilles",
      description: "Najsłynniejszy grecki heros, niemal niepokonany w walce. Świadomie wybiera krótkie lecz pełne chwały życie zamiast długiego spokojnego istnienia. Po śmierci przyjaciela Patroklosa wraca do boju, by pomścić go i zabić Hektora.",
      motifs: ["motywzemsty", "motywrycerza", "motywfatumprzeznaczenia"]
    },
    {
      id: "polikarp",
      name: "Mistrz Polikarp",
      description: "Uczony teolog, który prosi Boga o możliwość ujrzenia Śmierci. W rozmowie z nią dowiaduje się o nieuchronności i równości śmierci wobec wszystkich — bogatych i biednych, możnych i prostych.",
      motifs: ["motywuczniaimistrza", "motywsmierci", "motywboga"]
    },
    {
      id: "smierc",
      name: "Śmierć",
      description: "Spersonifikowana Śmierć — pojawia się przed Mistrzem Polikarpem jako rozkładające się ciało kobiety z kosą. Głosi nieuchronność i demokratyczność śmierci, która nie oszczędza nikogo bez względu na stan i majątek.",
      motifs: ["motywsmierci", "motywprzemijania"]
    },
  ]
};


const epochs = ["średniowiecze", "antyk", "renesans", "barok", "romantyzm", "pozytywizm", "młoda polska", "współczesność"];
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

// =========================
// HELPERS — powiązania
// =========================

function getCharacterById(id) { return data.characters.find(c => c.id === id) || null; }

function getBookByCharacter(characterId) {
  return data.books.find(b => (b.characters || []).includes(characterId)) || null;
}

function getCharactersByMotif(motifId) {
  return (data.characters || []).filter(c => (c.motifs || []).includes(motifId));
}

function getBooksByMotif(motifId) {
  return data.books.filter(b => (b.motifs || []).includes(motifId));
}

// =========================
// PROFILE EXTRAS
// =========================

function renderBookExtras(book) {
  const characterObjects = (book?.characters || []).map(getCharacterById).filter(Boolean);
  const quotes = uniqueStrings(book?.quotes || []);
  const images = book?.images || [];
  const motifObjects = (book?.motifs || []).map(getMotifById).filter(Boolean);

  let imagesHtml = "";
  if (images.length) {
    const imgItems = images.map(img => {
      if (img?.src) {
        return `<img class="profile-image-item" src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.label || book.title)}">`;
      }
      return "";
    }).filter(Boolean).join("");
    if (imgItems) {
      imagesHtml = `<div class="profile-section"><h3>Obrazy</h3><div class="profile-image-grid">${imgItems}</div></div>`;
    }
  }

  return `
    ${motifObjects.length ? `
      <div class="profile-section">
        <h3>Motywy</h3>
        <div class="profile-chip-list">
          ${motifObjects.map(m => `
            <span class="profile-chip clickable" onclick="openMotifFromProfile('${m.id}')">
              🎯 ${escapeHtml(m.name)}
            </span>
          `).join("")}
        </div>
      </div>` : ""}
    ${characterObjects.length ? `
      <div class="profile-section">
        <h3>Bohaterowie</h3>
        <div class="profile-chip-list">
          ${characterObjects.map(c => `
            <span class="profile-chip clickable" onclick="openCharacterFromProfile('${c.id}')">
              👤 ${escapeHtml(c.name)}
            </span>
          `).join("")}
        </div>
      </div>` : ""}
    ${quotes.length ? `
      <div class="profile-section">
        <h3>Cytaty</h3>
        <div class="profile-media-list">
          ${quotes.map(q => `<div class="profile-media-item">„${escapeHtml(q)}"</div>`).join("")}
        </div>
      </div>` : ""}
    ${imagesHtml}
  `;
}

function renderMotifExtras(motif) {
  const bookObjects = getBooksByMotif(motif.id);
  const characterObjects = getCharactersByMotif(motif.id);
  const images = motif?.images || [];

  let imagesHtml = "";
  if (images.length) {
    const imgItems = images.map(img => {
      if (img?.src) {
        return `<img class="profile-image-item" src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.label || motif.name)}">`;
      }
      return "";
    }).filter(Boolean).join("");
    if (imgItems) {
      imagesHtml = `<div class="profile-section"><h3>Obrazy</h3><div class="profile-image-grid">${imgItems}</div></div>`;
    }
  }

  return `
    ${bookObjects.length ? `
      <div class="profile-section">
        <h3>Lektury</h3>
        <div class="profile-chip-list">
          ${bookObjects.map(b => `
            <span class="profile-chip clickable" onclick="openBookFromProfile('${b.id}')">
              📚 ${escapeHtml(b.title)}
            </span>
          `).join("")}
        </div>
      </div>` : ""}
    ${characterObjects.length ? `
      <div class="profile-section">
        <h3>Bohaterowie z tym motywem</h3>
        <div class="profile-chip-list">
          ${characterObjects.map(c => `
            <span class="profile-chip clickable" onclick="openCharacterFromProfile('${c.id}')">
              👤 ${escapeHtml(c.name)}
            </span>
          `).join("")}
        </div>
      </div>` : ""}
    ${imagesHtml}
  `;
}

async function renderCharacterExtras(character) {
  const book = getBookByCharacter(character.id);
  const motifObjects = (character?.motifs || []).map(getMotifById).filter(Boolean);

  const poems = await loadPoems(character.poems || []);
  const poemsHtml = renderPoemsHtml(poems);

  return `
    ${book ? `
      <div class="profile-section">
        <h3>Lektura</h3>
        <div class="profile-chip-list">
          <span class="profile-chip clickable" onclick="openBookFromProfile('${book.id}')">
            📚 ${escapeHtml(book.title)}
          </span>
        </div>
      </div>` : ""}
    ${motifObjects.length ? `
      <div class="profile-section">
        <h3>Motywy</h3>
        <div class="profile-chip-list">
          ${motifObjects.map(m => `
            <span class="profile-chip clickable" onclick="openMotifFromProfile('${m.id}')">
              🎯 ${escapeHtml(m.name)}
            </span>
          `).join("")}
        </div>
      </div>` : ""}
    ${poemsHtml}
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
// SETTINGS — przyciski
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
  hideLearnMoreBox();
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

function createTaskX(presetData = null) {
  const dataObj = presetData || buildTaskXData();
  return {
    type: "X",
    data: dataObj,
    render() {
      renderTaskX(this.data);
      attachTaskXSwipeHandlers();
    },
    submit(side) {
      this.data._chosenSide = side;
      const correct = side === this.data.correctSide;
      if (correct) {
        score += 25;
        if (this.data.promptType === "book" && this.data.correctMotifId) {
          masteredPairs.add(
            makePairKey(this.data.promptId, this.data.correctMotifId)
          );
        }
        if (this.data.promptType === "motif" && this.data.correctBookId) {
          masteredPairs.add(
            makePairKey(this.data.correctBookId, this.data.promptId)
          );
        }
      }
      renderScore();
      setNextButtonVisible(true);
      renderTaskX(this.data, true);
      if (this.data.promptType === "book") {
        showLearnMoreBox("book", this.data.promptId);
      } else {
        showLearnMoreBox("motif", this.data.promptId);
      }
    }
  };
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
// POEMS
// =========================

async function loadPoems(poems) {
  if (!poems || !poems.length) return [];
  const results = await Promise.all(
    poems.map(async (poem) => {
      try {
        const res = await fetch(poem.src);
        if (!res.ok) return null;
        const text = await res.text();
        return { ...poem, text };
      } catch { return null; }
    })
  );
  return results.filter(Boolean);
}

function renderPoemsHtml(poems) {
  if (!poems || !poems.length) return "";
  return `<div class="profile-section">
    <h3>Fragmenty i wiersze</h3>
    <div class="profile-poems-list">
      ${poems.map(p => `
        <div class="profile-poem">
          <div class="profile-poem-meta">
            ${escapeHtml(p.author || "")}${p.author && p.title ? " — " : ""}${escapeHtml(p.title || "")}
          </div>
          <div class="profile-poem-text">${escapeHtml(p.text || "")}</div>
        </div>
      `).join("")}
    </div>
  </div>`;
}

// =========================
// PROFILE RENDERERS
// =========================

function renderSmartImages(images, entityTitle) {
  if (!images || !images.length) return '';
  const img = images[0];
  if (!img?.src) return '';
  return `
    <div class="profile-section">
      <h3>Obraz</h3>
      <img 
        src="${escapeHtml(img.src)}" 
        alt="${escapeHtml(img.alt || img.label || entityTitle || '')}"
        style="width:100%;max-width:340px;display:block;border:1px solid var(--line);margin-top:6px"
        onerror="this.parentElement.style.display='none'"
      >
    </div>`;
}

function renderBookProfile(book) {
  const canGoBack = profileHistoryStack.length > 0;
  const motifObjs = (book.motifs || []).map(getMotifById).filter(Boolean);
  const characterObjs = (book.characters || []).map(getCharacterById).filter(Boolean);
  const quotes = uniqueStrings(book.quotes || []);
  document.getElementById('profile-content').innerHTML = `
    <h2 style="font-family:var(--ff-serif);font-size:2rem;font-weight:300;margin-bottom:.5rem">
      📚 ${escapeHtml(book.title)}
    </h2>
    <p style="color:var(--muted);font-size:13px;line-height:1.7;margin-bottom:.5rem">
      ${escapeHtml(book.description || '')}
    </p>
    <div class="profile-section">
      <h3>Epoka</h3>
      <div class="profile-chip-list">
        <span class="profile-chip">${escapeHtml(book.epoch || '')}</span>
      </div>
    </div>
    ${motifObjs.length ? `
      <div class="profile-section">
        <h3>Motywy</h3>
        <div class="profile-chip-list">
          ${motifObjs.map(m => `
            <span class="profile-chip clickable" onclick="window.openMotifFromProfile('${m.id}')">
              🎯 ${escapeHtml(m.name)}
            </span>
          `).join('')}
        </div>
      </div>` : ''}
    ${characterObjs.length ? `
      <div class="profile-section">
        <h3>Bohaterowie</h3>
        <div class="profile-chip-list">
          ${characterObjs.map(c => `
            <span class="profile-chip clickable" onclick="window.openCharacterFromProfile('${c.id}')">
              👤 ${escapeHtml(c.name)}
            </span>
          `).join('')}
        </div>
      </div>` : ''}
    ${quotes.length ? `
      <div class="profile-section">
        <h3>Cytaty</h3>
        <div class="profile-media-list">
          ${quotes.map(q => `<div class="profile-media-item">„${escapeHtml(q)}"</div>`).join('')}
        </div>
      </div>` : ''}
    ${renderSmartImages(book.images, book.title)}
    <br>
    <button class="btn-end" onclick="${canGoBack ? 'goBackInProfile()' : 'returnFromProfile()'}">
      ⬅ ${profileReturnTarget === 'quiz' ? 'Powrót do ćwiczeń' : 'Powrót'}
    </button>`;
}

function renderMotifProfile(motif) {
  const canGoBack = profileHistoryStack.length > 0;
  const bookObjs = getBooksByMotif(motif.id);
  const characterObjs = getCharactersByMotif(motif.id);
  document.getElementById('profile-content').innerHTML = `
    <h2 style="font-family:var(--ff-serif);font-size:2rem;font-weight:300;margin-bottom:.5rem">
      🎯 ${escapeHtml(motif.name)}
    </h2>
    <p style="color:var(--muted);font-size:13px;line-height:1.7;margin-bottom:.5rem">
      ${escapeHtml(motif.description || '')}
    </p>
    ${bookObjs.length ? `
      <div class="profile-section">
        <h3>Lektury z tym motywem</h3>
        <div class="profile-chip-list">
          ${bookObjs.map(b => `
            <span class="profile-chip clickable" onclick="window.openBookFromProfile('${b.id}')">
              📚 ${escapeHtml(b.title)}
            </span>
          `).join('')}
        </div>
      </div>` : ''}
    ${characterObjs.length ? `
      <div class="profile-section">
        <h3>Bohaterowie z tym motywem</h3>
        <div class="profile-chip-list">
          ${characterObjs.map(c => `
            <span class="profile-chip clickable" onclick="window.openCharacterFromProfile('${c.id}')">
              👤 ${escapeHtml(c.name)}
            </span>
          `).join('')}
        </div>
      </div>` : ''}
    ${renderSmartImages(motif.images, motif.name)}
    <br>
    <button class="btn-end" onclick="${canGoBack ? 'goBackInProfile()' : 'returnFromProfile()'}">
      ⬅ ${profileReturnTarget === 'quiz' ? 'Powrót do ćwiczeń' : 'Powrót'}
    </button>`;
}

async function renderCharacterProfile(character) {
  const canGoBack = profileHistoryStack.length > 0;
  const book = getBookByCharacter(character.id);
  const motifObjs = (character.motifs || []).map(getMotifById).filter(Boolean);
  document.getElementById('profile-content').innerHTML = `
    <h2 style="font-family:var(--ff-serif);font-size:2rem;font-weight:300;margin-bottom:.5rem">
      👤 ${escapeHtml(character.name)}
    </h2>
    <p style="color:var(--muted);font-size:13px;line-height:1.7;margin-bottom:.5rem">
      ${escapeHtml(character.description || '')}
    </p>
    ${book ? `
      <div class="profile-section">
        <h3>Lektura</h3>
        <div class="profile-chip-list">
          <span class="profile-chip clickable" onclick="window.openBookFromProfile('${book.id}')">
            📚 ${escapeHtml(book.title)}
          </span>
        </div>
      </div>` : ''}
    ${motifObjs.length ? `
      <div class="profile-section">
        <h3>Motywy</h3>
        <div class="profile-chip-list">
          ${motifObjs.map(m => `
            <span class="profile-chip clickable" onclick="window.openMotifFromProfile('${m.id}')">
              🎯 ${escapeHtml(m.name)}
            </span>
          `).join('')}
        </div>
      </div>` : ''}
    <div id="poems-placeholder"></div>
    <br>
    <button class="btn-end" onclick="${canGoBack ? 'goBackInProfile()' : 'returnFromProfile()'}">
      ⬅ ${profileReturnTarget === 'quiz' ? 'Powrót do ćwiczeń' : 'Powrót'}
    </button>`;
  const poems = await loadPoems(character.poems || []);
  const placeholder = document.getElementById('poems-placeholder');
  if (placeholder) placeholder.innerHTML = renderPoemsHtml(poems);
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
