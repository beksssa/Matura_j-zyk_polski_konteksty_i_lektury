// ═══════════════════════════════════════════════════════
//  CORE STATE
// ═══════════════════════════════════════════════════════
let mode = "learning";
let view = "books";
let activeEpochs = new Set(["młoda polska","pozytywizm","romantyzm","antyk","współczesność","renesans"]);
let score = 0;

let quizMode = "diagnostic";
let scoredPairs = new Set();
let masteredPairs = new Set();

window.quizAnswered = false; // exposed for UI layer
let currentTaskType = null;
let currentTaskData = null;
let currentTask = null;
let quizSnapshot = null;
let profileReturnTarget = "map";
let taskBag = [];

const ENGINE_TASK_TYPES = ["X","Y1","Y2"];

// ═══════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════
const data = {
  books: [
    { id:"wesele",title:"Wesele",description:"Dramat Wyspiańskiego ukazujący niemoc polskiego społeczeństwa niezdolnego do zrywu narodowego. Symboliczne zjawy obnażają wewnętrzne lęki i marzenia bohaterów. Chocholi taniec symbolizuje marazm i bezwład zbiorowy.",epoch:"młoda polska",motifs:["motywbuntu","motywtanca","motywartysty","motywwsi","motywpatriotyzmu","motywkonfliktupokolen","motywpolskiipolakow"],coverEmoji:"🎭",aliases:["Wesele Wyspiańskiego"],characters:["chochol","poeta","mlody","gospodarz"],quotes:[],images:[{src:"images/lektury/wesele/wesele_okładka.png"}]},
    { id:"chlopi",title:"Chłopi",description:"Epopeja chłopska Reymonta ukazująca życie wsi Lipce podporządkowane rytmowi natury i tradycji. Motyw wsi, pracy i miłości splatają się w panoramicznym obrazie polskiej wsi.",epoch:"młoda polska",motifs:["motywwsi","motywpracy","motywmilosci","motywrodziny","motywojca","motywprzyrodynatury","motywkobiety","motywtanca"],coverEmoji:"🌾",aliases:["Chłopi Reymonta"],characters:["boryna","jagna","antoni"],quotes:[],images:[{src:"images/lektury/chlopi/Chlopi-plakat-204569-602x802-nobckgr.webp"}]},
    { id:"antygona",title:"Antygona",description:"Tragedia Sofoklesa ukazująca konflikt między prawem boskim a ludzkim. Antygona ginie wierna własnemu sumieniu, a pycha Kreona niszczy jego rodzinę.",epoch:"antyk",motifs:["motywbuntu","motywfatumprzeznaczenia","motywwladcy","motywsmierci","motywkonfliktu","motywposwiecenia","motywwladzy"],coverEmoji:"🏛️",aliases:["Antygona Sofoklesa"],characters:["antygona","kreon","ismena"],quotes:[],images:[{src:"images/lektury/antygona/productGfx_824_500_500.jpg"}]},
    { id:"tango",title:"Tango",description:"Dramat Mrożka o upadku tradycyjnych wartości i zwycięstwie prymitywnej siły. Artur buntuje się paradoksalnie przeciwko anarchii własnej rodziny — i przegrywa.",epoch:"współczesność",motifs:["motywbuntu","motywrodziny","motywkonfliktupokolen","motywobyczajowitradycji","motywwladzy","motywpolskiipolakow","motywkonfliktu"],coverEmoji:"🪑",aliases:["Tango Mrożka"],characters:["artur","edek"],quotes:[],images:[{src:"images/lektury/tango/plakat-spektakl-Tango-2025.jpg"}]},
    { id:"magbet",title:"Makbet",description:"Tragedia Szekspira o destrukcyjnej sile ambicji. Makbet przez morderstwo sięga po władzę, lecz wpada w spiralę kolejnych zbrodni i traci psychikę.",epoch:"renesans",motifs:["motywzbrodni","motywwladzy","motywprzepowiedni","motywfatumprzeznaczenia","motywszalenstwa","motywwinyikary","motywspisku","motywzla"],coverEmoji:"👑",aliases:["Macbeth","Makbet Szekspira"],characters:["makbet","lmakbet"],quotes:[],images:[{src:"images/lektury/magbet/4e4421b6b18d205ec1e82cb4bb61ad53.jpg"}]},
    { id:"zbrodniaikara",title:"Zbrodnia i kara",description:"Powieść Dostojewskiego o upadku i odkupieniu. Raskolnikow morduje lichwiarkę by udowodnić teorię nadczłowieka, lecz nie może uciec przed własnym sumieniem.",epoch:"pozytywizm",motifs:["motywzbrodni","motywwinyikary","motywbiedy","motywmiasta","motywmilosci","motywposwiecenia","motywprzemiany","motywszalenstwa"],coverEmoji:"🕯️",aliases:["Zbrodnia i Kara","Zbrodnia i kara Dostojewskiego"],characters:["raskolnikow","sonia"],quotes:[],images:[{src:"images/lektury/zbrodnia i kara/1198.-ZBRODNIA_i_KARA.jpg"}]},
    { id:"innyswiat",title:"Inny świat",description:"Autobiograficzny reportaż Herlinga-Grudzińskiego ze sowieckiego łagru. System totalitarny testuje granice człowieczeństwa w warunkach głodu i terroru.",epoch:"współczesność",motifs:["motywtotalitaryzmu","motywcierpienia","motywwolnosci","motywposwiecenia","motywzla","motywsamotnosci"],coverEmoji:"⛓️",aliases:["Inny Świat Herlinga-Grudzińskiego"],characters:[],quotes:[],images:[{src:"images/lektury/inny świat/images (2).jpeg"}]},
    { id:"1984",title:"Rok 1984",description:"Antyutopia Orwella o totalitarnym państwie Oceania. Partia kontroluje myśli i uczucia obywateli — Winston Smith próbuje oprzeć się systemowi i przegrywa.",epoch:"współczesność",motifs:["motywtotalitaryzmu","motywbuntu","motywmilosci","motywwolnosci","motywwladzy","motywzdrady"],coverEmoji:"📕",aliases:["1984","Rok tysiąc dziewięćset osiemdziesiąty czwarty"],characters:["winston","brat"],quotes:[],images:[{src:"images/lektury/1984/il_1080xN.5882175820_6how.webp"}]},
    { id:"skapiec",title:"Skąpiec",description:"Komedia Moliera o człowieku opętanym żądzą pieniądza. Harpagon niszczy relacje rodzinne, przedkładając majątek nad szczęście dzieci.",epoch:"barok",motifs:["motywpieniadza","motywrodziny","motywkonfliktupokolen","motywmilosci","motywmieszczanstwa"],coverEmoji:"💰",aliases:["Skąpiec Moliera"],characters:["harpagon"],quotes:[],images:[{src:"images/lektury/skapiec/PLAKAT SKAPIEC_mały do NETA.jpg"}]},
    { id:"lalka",title:"Lalka",description:"Powieść Prusa o Wokulskim, który poświęca wszystko dla nieosiągalnej miłości do arystokratki. Panorama społeczeństwa polskiego epoki pozytywizmu.",epoch:"pozytywizm",motifs:["motywmilosci","motywkariery","motywarystokracji","motywfilantropii","motywmieszczanstwa","motywpracy","motywprzemijania","motywkobiety"],coverEmoji:"🪆",aliases:["Lalka Prusa"],characters:["wokulski","rzecki","lecka"],quotes:[],images:[{src:"images/lektury/lalka/2823.jpg"}]},
    { id:"potop",title:"Potop",description:"Powieść Sienkiewicza o potopie szwedzkim i moralnej przemianie Kmicica — od awanturnika do bohatera walczącego za ojczyznę.",epoch:"pozytywizm",motifs:["motywpatriotyzmu","motywprzemiany","motywrycerza","motywmilosci","motywzdrady","motywboga","motywwojny"],coverEmoji:"⚔️",aliases:["Potop Sienkiewicza"],characters:["kmicic","michal"],quotes:[],images:[{src:"images/lektury/potop/potop.jpg"}]},
    { id:"przedwiosnie",title:"Przedwiośnie",description:"Powieść Żeromskiego o roztertach ideowych Cezarego Baryki, który wraca do odrodzonej Polski i zderza się z brutalną rzeczywistością społeczną.",epoch:"młoda polska",motifs:["motywprzemiany","motywrewolucji","motywbuntu","motywojca","motywpatriotyzmu","motywkonfliktu","motywbiedy"],coverEmoji:"🌱",aliases:["Przedwiośnie Żeromskiego"],characters:["baryka","starybaryka"],quotes:[],images:[{src:"images/lektury/przedwiosnie/przedwiosnie.jpg"}]},
    { id:"ferdydurke",title:"Ferdydurke",description:"Groteskowa powieść Gombrowicza o zniewoleniu przez społeczne formy. Józio wędruje przez kolejne środowiska, wszędzie konfrontując się z narzucanymi rolami.",epoch:"współczesność",motifs:["motywbuntu","motywszkoly","motywdomu","motywdworku","motywkonfliktupokolen","motywprzemiany","motywszlachty"],coverEmoji:"🎭",aliases:["Ferdydurke Gombrowicza"],characters:["jozek","mietus"],quotes:[],images:[{src:"images/lektury/ferdydurke/ferdydurke.jpg"}]},
    { id:"gaz",title:"Proszę państwa do gazu",description:"Opowiadanie Borowskiego z perspektywy więźnia obozowego. Dehumanizacja staje się warunkiem przeżycia w machinie zagłady.",epoch:"współczesność",motifs:["motywwojny","motywzbrodni","motywcierpienia","motywzla","motywprzemiany","motywsamotnosci"],coverEmoji:"🔥",aliases:["Proszę państwa do gazu Borowskiego"],characters:[],quotes:[],images:[{src:"images/lektury/gaz/gaz.jpg"}]},
    { id:"getto",title:"Zdążyć przed Panem Bogiem",description:"Reportaż Krall oparty na rozmowach z Markiem Edelmanem, ostatnim dowódcą powstania w getcie. Pytanie o granice człowieczeństwa wobec zagłady.",epoch:"współczesność",motifs:["motywbuntu","motywsmierci","motywposwiecenia","motywzyda","motywboga","motywwojny"],coverEmoji:"✡️",aliases:["Zdążyć przed Panem Bogiem Krall"],characters:[],quotes:[],images:[{src:"images/lektury/getto/getto.jpg"}]},
    { id:"dzuma",title:"Dżuma",description:"Powieść Camusa — epidemia dżumy jako alegoria zła. Doktor Rieux i jego towarzysze rezygnują z osobistego szczęścia, by walczyć z chorobą.",epoch:"współczesność",motifs:["motywposwiecenia","motywprzyjazni","motywcierpienia","motywboga","motywbuntu","motywsmierci"],coverEmoji:"🦠",aliases:["Dżuma Camusa"],characters:["rieux"],quotes:[],images:[{src:"images/lektury/dzuma/dzuma.jpg"}]},
    { id:"edek",title:"Górą Edek",description:"Dramat ukazujący zderzenie inteligencji z prymitywną siłą w postkomunistycznej rzeczywistości. Edek zdobywa władzę nie intelektem, lecz brutalną siłą.",epoch:"współczesność",motifs:["motywwladzy","motywkonfliktupokolen","motywpolskiipolakow"],coverEmoji:"👊",aliases:["Górą Edek"],characters:[],quotes:[],images:[{src:"images/lektury/edek/edek.jpg"}]},
    { id:"miejsce",title:"Miejsce",description:"Opowiadanie Mrożka eksplorujące absurd codzienności i pytanie o przynależność jednostki w świecie.",epoch:"współczesność",motifs:["motywkonfliktu","motywsamotnosci"],coverEmoji:"📍",aliases:["Miejsce Mrożka"],characters:[],quotes:[],images:[{src:"images/lektury/miejsce/miejsce.jpg"}]},
    { id:"andrews",title:"Profesor Andrews w Warszawie",description:"Opowiadanie Tokarczuk o zderzeniu zachodniej wrażliwości z postkomunistyczną Warszawą lat 90. Warszawa jako przestrzeń obcości i fascynacji.",epoch:"współczesność",motifs:["motywpodrozywedrowki","motywmiasta","motywkonfliktu"],coverEmoji:"🏙️",aliases:["Profesor Andrews w Warszawie Tokarczuk"],characters:[],quotes:[],images:[{src:"images/lektury/andrews/andrews.jpg"}]},
    { id:"iliada",title:"Iliada",description:"Epos Homera o ostatnim roku wojny trojańskiej. Bohaterowie stają wobec pytań o honor, śmierć i sens walki — Hektor ginie za ojczyznę, Achilles za zemstę.",epoch:"antyk",motifs:["motywwojny","motywpatriotyzmu","motywfatumprzeznaczenia","motywsmierci","motywrycerza","motywzemsty"],coverEmoji:"🛡️",aliases:["Iliada Homera"],characters:["hektor","parys","achilles"],quotes:[],images:[{src:"images/lektury/iliada/iliada.jpg"}]},
    { id:"polikarp",title:"Rozmowa Mistrza Polikarpa ze Śmiercią",description:"Średniowieczny dialog uczonego ze spersonifikowaną Śmiercią. Refleksja nad przemijaniem i równością wszystkich wobec śmierci.",epoch:"średniowiecze",motifs:["motywsmierci","motywprzemijania","motywuczniaimistrza","motywboga"],coverEmoji:"💀",aliases:["Rozmowa Mistrza Polikarpa ze Śmiercią"],characters:["polikarp","smierc"],quotes:[],images:[{src:"images/lektury/polikarp/polikarp.jpg"}]},
  ],
  motifs: [
    { id:"motywsmierci",name:"Motyw Śmierci",description:"Nieuchronność kresu życia i refleksja nad sensem istnienia",books:["antygona","getto","dzuma","iliada","polikarp"],aliases:["śmierć","smierc","motyw śmierci","motyw smierci"],images:[],poems:[]},
    { id:"motywzyda",name:"Motyw Żyda",description:"Obraz mniejszości żydowskiej i problem uprzedzeń",books:["getto"],aliases:["żyd","zyd","motyw żyda"],images:[],poems:[]},
    { id:"motywartysty",name:"Motyw Artysty",description:"Wyjątkowość twórcy i konflikt między sztuką a społeczeństwem",books:["wesele"],aliases:["artysta","motyw artysty","twórca"],images:[],poems:[]},
    { id:"motywarystokracji",name:"Motyw Arystokracji",description:"Krytyka uprzywilejowanych warstw i ich oderwania od rzeczywistości",books:["lalka"],aliases:["arystokracja","motyw arystokracji"],images:[],poems:[]},
    { id:"motywbiedy",name:"Motyw Biedy",description:"Degradacja człowieka wynikająca z ubóstwa i nierówności",books:["zbrodniaikara","przedwiosnie"],aliases:["bieda","motyw biedy","ubóstwo"],images:[],poems:[]},
    { id:"motywboga",name:"Motyw Boga",description:"Poszukiwanie sensu życia i relacji człowieka z absolutem",books:["potop","getto","dzuma","polikarp"],aliases:["bóg","bog","motyw boga"],images:[],poems:[]},
    { id:"motywbuntu",name:"Motyw Buntu",description:"Sprzeciw wobec norm społecznych, władzy lub przeznaczenia",books:["wesele","antygona","tango","1984","innyswiat","przedwiosnie","ferdydurke","getto","dzuma"],aliases:["bunt","motyw buntu"],images:[],poems:[]},
    { id:"motywcierpienia",name:"Motyw Cierpienia",description:"Ból fizyczny lub psychiczny jako doświadczenie kształtujące człowieka",books:["innyswiat","gaz","dzuma"],aliases:["cierpienie","motyw cierpienia"],images:[],poems:[]},
    { id:"motywdomu",name:"Motyw Domu",description:"Dom jako symbol bezpieczeństwa, tradycji i tożsamości",books:["ferdydurke"],aliases:["dom","motyw domu"],images:[],poems:[]},
    { id:"motywdworku",name:"Motyw Dworku",description:"Idealizacja życia szlacheckiego i przywiązania do tradycji",books:["ferdydurke"],aliases:["dworek","motyw dworku"],images:[],poems:[]},
    { id:"motywfatumprzeznaczenia",name:"Motyw Fatum/Przeznaczenia",description:"Nieuchronność losu determinującego życie bohatera",books:["antygona","magbet","iliada"],aliases:["fatum","przeznaczenie","motyw fatum"],images:[],poems:[]},
    { id:"motywfilantropii",name:"Motyw Filantropii",description:"Bezinteresowna pomoc innym jako wyraz humanizmu",books:["lalka"],aliases:["filantropia","motyw filantropii"],images:[],poems:[]},
    { id:"motywkariery",name:"Motyw Kariery",description:"Dążenie do sukcesu społecznego i zawodowego",books:["lalka"],aliases:["kariera","motyw kariery"],images:[],poems:[]},
    { id:"motywkobiety",name:"Motyw Kobiety",description:"Różnorodne role kobiet i wyobrażenia o kobiecości",books:["chlopi","lalka","magbet"],aliases:["kobieta","motyw kobiety"],images:[],poems:[]},
    { id:"motywkonfliktu",name:"Motyw Konfliktu",description:"Starcie przeciwstawnych racji, wartości lub interesów",books:["antygona","tango","przedwiosnie","andrews","miejsce"],aliases:["konflikt","motyw konfliktu"],images:[],poems:[]},
    { id:"motywkonfliktupokolen",name:"Motyw Konfliktu Pokoleń",description:"Różnice światopoglądowe między młodymi a starszymi",books:["wesele","tango","skapiec","ferdydurke","edek"],aliases:["konflikt pokoleń","motyw konfliktu pokoleń"],images:[],poems:[]},
    { id:"motywmilosci",name:"Motyw Miłości",description:"Uczucie jako źródło szczęścia, cierpienia lub przemiany",books:["chlopi","zbrodniaikara","1984","skapiec","lalka","potop"],aliases:["miłość","milosc","motyw miłości"],images:[],poems:[]},
    { id:"motywmiasta",name:"Motyw Miasta",description:"Miasto jako przestrzeń rozwoju, anonimowości i zepsucia",books:["zbrodniaikara","andrews"],aliases:["miasto","motyw miasta"],images:[],poems:[]},
    { id:"motywmieszczanstwa",name:"Motyw Mieszczaństwa",description:"Obraz klasy średniej oraz jej aspiracji i ograniczeń",books:["skapiec","lalka"],aliases:["mieszczaństwo","motyw mieszczaństwa"],images:[],poems:[]},
    { id:"motywobyczajowitradycji",name:"Motyw Obyczajów i Tradycji",description:"Znaczenie norm społecznych i kulturowego dziedzictwa",books:["tango"],aliases:["obyczaje","tradycja","motyw obyczajów i tradycji"],images:[],poems:[]},
    { id:"motywojca",name:"Motyw Ojca",description:"Autorytet rodzicielski i relacje ojca z dzieckiem",books:["chlopi","przedwiosnie"],aliases:["ojciec","motyw ojca"],images:[],poems:[]},
    { id:"motywpatriotyzmu",name:"Motyw Patriotyzmu",description:"Miłość do ojczyzny i gotowość do poświęceń dla narodu",books:["wesele","potop","przedwiosnie","iliada"],aliases:["patriotyzm","motyw patriotyzmu"],images:[],poems:[]},
    { id:"motywpieniadza",name:"Motyw Pieniądza",description:"Wpływ majątku na relacje i moralność",books:["skapiec"],aliases:["pieniądz","motyw pieniądza"],images:[],poems:[]},
    { id:"motywposwiecenia",name:"Motyw Poświęcenia",description:"Rezygnacja z własnego dobra dla wyższych wartości",books:["antygona","zbrodniaikara","innyswiat","getto","dzuma"],aliases:["poświęcenie","motyw poświęcenia"],images:[],poems:[]},
    { id:"motywpodrozywedrowki",name:"Motyw Podróży/Wędrówki",description:"Poszukiwanie sensu życia i dojrzewanie przez doświadczenie",books:["andrews"],aliases:["podróż","wędrówka","motyw podróży"],images:[],poems:[]},
    { id:"motywpolskiipolakow",name:"Motyw Polski i Polaków",description:"Refleksja nad tożsamością narodową i kondycją społeczeństwa",books:["wesele","tango","edek"],aliases:["polska","polacy","motyw polski i polaków"],images:[],poems:[]},
    { id:"motywpracy",name:"Motyw Pracy",description:"Praca jako wartość budująca człowieka i społeczeństwo",books:["chlopi","lalka"],aliases:["praca","motyw pracy"],images:[],poems:[]},
    { id:"motywprzemiany",name:"Motyw Przemiany",description:"Wewnętrzna metamorfoza bohatera pod wpływem doświadczeń",books:["zbrodniaikara","potop","przedwiosnie","ferdydurke","gaz"],aliases:["przemiana","motyw przemiany"],images:[],poems:[]},
    { id:"motywprzemijania",name:"Motyw Przemijania",description:"Ulotność życia i nieuchronność upływu czasu",books:["lalka","polikarp"],aliases:["przemijanie","motyw przemijania"],images:[],poems:[]},
    { id:"motywprzepowiedni",name:"Motyw Przepowiedni",description:"Zapowiedź przyszłych wydarzeń wpływająca na los bohatera",books:["magbet"],aliases:["przepowiednia","motyw przepowiedni"],images:[],poems:[]},
    { id:"motywprzyjazni",name:"Motyw Przyjaźni",description:"Więź oparta na lojalności, wsparciu i zaufaniu",books:["dzuma"],aliases:["przyjaźń","motyw przyjaźni"],images:[],poems:[]},
    { id:"motywprzyrodynatury",name:"Motyw Przyrody/Natury",description:"Natura jako odbicie emocji i harmonii świata",books:["chlopi"],aliases:["przyroda","natura","motyw przyrody"],images:[],poems:[]},
    { id:"motywrewolucji",name:"Motyw Rewolucji",description:"Gwałtowne przemiany społeczne i polityczne",books:["przedwiosnie"],aliases:["rewolucja","motyw rewolucji"],images:[],poems:[]},
    { id:"motywrodziny",name:"Motyw Rodziny",description:"Relacje rodzinne jako źródło wsparcia lub konfliktów",books:["chlopi","tango","skapiec"],aliases:["rodzina","motyw rodziny"],images:[],poems:[]},
    { id:"motywrycerza",name:"Motyw Rycerza",description:"Honor, odwaga i wierność ideałom",books:["potop","iliada"],aliases:["rycerz","motyw rycerza"],images:[],poems:[]},
    { id:"motywsamotnosci",name:"Motyw Samotności",description:"Osamotnienie jednostki i wyobcowanie ze społeczeństwa",books:["innyswiat","gaz","miejsce"],aliases:["samotność","motyw samotności"],images:[],poems:[]},
    { id:"motywspisku",name:"Motyw Spisku",description:"Tajne działania prowadzące do zmiany władzy",books:["magbet"],aliases:["spisek","motyw spisku"],images:[],poems:[]},
    { id:"motywszalenstwa",name:"Motyw Szaleństwa",description:"Utrata kontroli nad rozumem i emocjami",books:["magbet","zbrodniaikara"],aliases:["szaleństwo","motyw szaleństwa"],images:[],poems:[]},
    { id:"motywszkoly",name:"Motyw Szkoły",description:"Edukacja jako narzędzie rozwoju lub zniewolenia",books:["ferdydurke"],aliases:["szkoła","motyw szkoły"],images:[],poems:[]},
    { id:"motywszlachty",name:"Motyw Szlachty",description:"Obraz warstwy szlacheckiej i jej tradycji",books:["ferdydurke"],aliases:["szlachta","motyw szlachty"],images:[],poems:[]},
    { id:"motywtanca",name:"Motyw Tańca",description:"Taniec jako symbol relacji społecznych lub emocji zbiorowych",books:["wesele","chlopi"],aliases:["taniec","motyw tańca"],images:[],poems:[]},
    { id:"motywtotalitaryzmu",name:"Motyw Totalitaryzmu",description:"Zniewolenie jednostki przez system polityczny",books:["innyswiat","1984"],aliases:["totalitaryzm","motyw totalitaryzmu"],images:[],poems:[]},
    { id:"motywuczniaimistrza",name:"Motyw Ucznia i Mistrza",description:"Relacja oparta na przekazywaniu wiedzy i doświadczenia",books:["polikarp"],aliases:["uczeń i mistrz","motyw ucznia i mistrza"],images:[],poems:[]},
    { id:"motywwladcy",name:"Motyw Władcy",description:"Obraz rządzącego i odpowiedzialności za państwo",books:["antygona"],aliases:["władca","motyw władcy"],images:[],poems:[]},
    { id:"motywwladzy",name:"Motyw Władzy",description:"Mechanizmy sprawowania kontroli i wpływu na ludzi",books:["antygona","magbet","tango","1984","edek"],aliases:["władza","motyw władzy"],images:[],poems:[]},
    { id:"motywwinyikary",name:"Motyw Winy i Kary",description:"Moralne konsekwencje popełnionych czynów",books:["magbet","zbrodniaikara"],aliases:["wina i kara","motyw winy i kary"],images:[],poems:[]},
    { id:"motywwojny",name:"Motyw Wojny",description:"Tragizm konfliktów zbrojnych i ich wpływ na człowieka",books:["potop","gaz","getto","iliada"],aliases:["wojna","motyw wojny"],images:[],poems:[]},
    { id:"motywwolnosci",name:"Motyw Wolności",description:"Dążenie jednostki lub narodu do niezależności",books:["innyswiat","1984"],aliases:["wolność","motyw wolności"],images:[],poems:[]},
    { id:"motywwsi",name:"Motyw Wsi",description:"Idealizacja lub krytyka życia wiejskiego i chłopstwa",books:["wesele","chlopi"],aliases:["wieś","motyw wsi"],images:[],poems:[]},
    { id:"motywzla",name:"Motyw Zła",description:"Obecność destrukcyjnych sił w świecie i człowieku",books:["magbet","innyswiat","gaz"],aliases:["zło","motyw zła"],images:[],poems:[]},
    { id:"motywzbrodni",name:"Motyw Zbrodni",description:"Przekroczenie norm moralnych i jego konsekwencje",books:["magbet","zbrodniaikara","gaz"],aliases:["zbrodnia","motyw zbrodni"],images:[],poems:[]},
    { id:"motywzdrady",name:"Motyw Zdrady",description:"Złamanie lojalności wobec bliskich, idei lub ojczyzny",books:["1984","potop"],aliases:["zdrada","motyw zdrady"],images:[],poems:[]},
    { id:"motywzemsty",name:"Motyw Zemsty",description:"Pragnienie odwetu prowadzące do destrukcji",books:["iliada"],aliases:["zemsta","motyw zemsty"],images:[],poems:[]},
  ],
  characters: [
    { id:"chochol",name:"Chochoł",description:"Symbol marazmu narodowego. Prowadzi chocholi taniec — symbol niemożności działania i narodowego letargu.",motifs:["motywtanca","motywpolskiipolakow","motywbuntu"]},
    { id:"poeta",name:"Poeta",description:"Krakowski inteligent na weselu. Nawiedza go Rycerz budząc nadzieję walki o niepodległość — lecz ta znika z nadejściem poranka.",motifs:["motywartysty","motywpatriotyzmu","motywbuntu"]},
    { id:"mlody",name:"Pan Młody",description:"Artysta biorący chłopkę za żonę. Idealizuje wieś — symbol powierzchownej fascynacji ludu bez jej rozumienia.",motifs:["motywartysty","motywwsi"]},
    { id:"gospodarz",name:"Gospodarz",description:"Artysta mieszkający na wsi. Nawiedza go Wernyhora — motyw straconej szansy na narodowy zryw.",motifs:["motywpatriotyzmu","motywpolskiipolakow"]},
    { id:"antygona",name:"Antygona",description:"Córka Edypa. Wybiera prawo boskie ponad królewskie — pochowuje brata wbrew zakazowi Kreona, płacąc życiem.",motifs:["motywbuntu","motywposwiecenia","motywfatumprzeznaczenia"]},
    { id:"kreon",name:"Kreon",description:"Król Teb. Jego upór i pycha prowadzą do śmierci syna, żony i bratanicy.",motifs:["motywwladcy","motywwladzy","motywkonfliktu"]},
    { id:"ismena",name:"Ismena",description:"Siostra Antygony. Rozumie jej racje, lecz nie ma odwagi się sprzeciwić. Uosabia uległość wobec prawa państwowego.",motifs:["motywkonfliktu"]},
    { id:"raskolnikow",name:"Raskolnikow",description:"Student przekonany o własnej wyjątkowości. Morduje lichwiarkę by udowodnić teorię nadczłowieka — lecz nie wytrzymuje ciężaru winy.",motifs:["motywzbrodni","motywwinyikary","motywmiasta","motywbiedy","motywszalenstwa"]},
    { id:"sonia",name:"Sonia Marmieładowa",description:"Głęboko wierząca, zmuszona do prostytucji by utrzymać rodzinę. Symbolizuje miłosierdzie i przebaczenie — prowadzi Raskolnikowa ku odkupieniu.",motifs:["motywmilosci","motywposwiecenia","motywboga"]},
    { id:"makbet",name:"Makbet",description:"Dzielny rycerz, który po słowach czarownic morduje króla Dunkana. Wpada w spiralę kolejnych zbrodni, nękany wyrzutami sumienia.",motifs:["motywfatumprzeznaczenia","motywprzepowiedni","motywwladzy","motywspisku","motywzbrodni","motywwinyikary"]},
    { id:"lmakbet",name:"Lady Makbet",description:"Żona Makbeta. Obmyśla plan zbrodni, lecz stopniowo traci rozum — lunatykuje i popada w obłęd z wyrzutów sumienia.",motifs:["motywkobiety","motywszalenstwa","motywspisku","motywwinyikary"]},
    { id:"artur",name:"Artur",description:"Buntuje się paradoksalnie przeciwko anarchii własnej rodziny. Próbuje przywrócić tradycyjne wartości — i przegrywa z prymitywnym Edkiem.",motifs:["motywbuntu","motywobyczajowitradycji","motywrodziny","motywkonfliktupokolen"]},
    { id:"edek",name:"Edek",description:"Nieuczony kochanek matki Artura. Triumfuje siłą i bezwzględnością — uosabia zwycięstwo prymitywizmu nad intelektem.",motifs:["motywwladzy","motywpolskiipolakow"]},
    { id:"winston",name:"Winston Smith",description:"Pracownik Ministerstwa Prawdy. Potajemnie buntuje się, prowadzi pamiętnik, nawiązuje zakazany romans. Zostaje schwytany i złamany przez Partię.",motifs:["motywbuntu","motywwolnosci","motywmilosci"]},
    { id:"brat",name:"Wielki Brat",description:"Tajemniczy przywódca Oceanii. Symbolizuje absolutną, bezosobową władzę Partii — istnieje lub nie, co czyni go jeszcze potężniejszym.",motifs:["motywtotalitaryzmu","motywwladzy"]},
    { id:"harpagon",name:"Harpagon",description:"Bogaty paryski mieszczanin opętany obsesją pieniądza. Sprzeciwia się szczęściu dzieci — szkatułka ze złotem ważniejsza niż rodzina.",motifs:["motywpieniadza","motywrodziny","motywmieszczanstwa"]},
    { id:"wokulski",name:"Stanisław Wokulski",description:"Zamożny kupiec zakochany bez wzajemności w Izabeli Łęckiej. Podporządkowuje temu uczuciu całe życie, prowadząc jednocześnie działalność filantropijną.",motifs:["motywmilosci","motywfilantropii","motywkariery","motywmieszczanstwa"]},
    { id:"rzecki",name:"Ignacy Rzecki",description:"Starszy przyjaciel Wokulskiego. Wierny ideałom napoleońskim, prowadzi pamiętnik — kronikę epoki, której nie rozumie nowy świat.",motifs:["motywmieszczanstwa","motywprzemijania"]},
    { id:"lecka",name:"Izabela Łęcka",description:"Piękna arystokratka ze zubożałej rodziny. Traktuje Wokulskiego instrumentalnie — uosabia degenerację klasy szlacheckiej.",motifs:["motywkobiety","motywarystokracji"]},
    { id:"kmicic",name:"Andrzej Kmicic",description:"Młody szlachcic, z początku awanturnik. Przechodzi głęboką przemianę — pod przybranym nazwiskiem Babinicz walczy za ojczyznę i odzyskuje honor.",motifs:["motywprzemiany","motywpatriotyzmu","motywmilosci","motywrycerza"]},
    { id:"michal",name:"Michał Wołodyjowski",description:"Legendarny pułkownik — wzór rycerskich cnót. Ginie bohaterską śmiercią, wysadzając twierdzę w obronie ojczyzny.",motifs:["motywpatriotyzmu","motywrycerza","motywposwiecenia"]},
    { id:"baryka",name:"Cezary Baryka",description:"Syn polskiego urzędnika, wychowany w Baku. Wraca do Polski i zderza się z brutalną rzeczywistością — między ideałami ojca a ideami rewolucji.",motifs:["motywprzemiany","motywbuntu","motywrewolucji","motywpatriotyzmu"]},
    { id:"starybaryka",name:"Seweryn Baryka",description:"Ojciec Cezarego. Głęboki patriota idealizujący Polskę szklanych domów. Umiera w drodze do ojczyzny.",motifs:["motywojca","motywpatriotyzmu"]},
    { id:"jozek",name:"Józio Kowalski",description:"Trzydziestolatek cofnięty do roli ucznia. Wędruje przez szkołę, stancję, wieś — wszędzie konfrontując się z narzucanymi Formami.",motifs:["motywbuntu","motywszkoly","motywdomu","motywdworku"]},
    { id:"mietus",name:"Miętus",description:"Kolega Józia. Marzy o autentycznym kontakcie z prostym chłopem — realizuje to w groteskowy sposób.",motifs:["motywszkoly","motywdworku","motywbuntu"]},
    { id:"rieux",name:"Bernard Rieux",description:"Lekarz w Oranie. Od pierwszych objawów epidemii walczy z dżumą. Uosabia aktywny humanizm — działanie pomimo braku pewności sensu.",motifs:["motywposwiecenia","motywprzyjazni","motywbuntu","motywsmierci"]},
    { id:"boryna",name:"Maciej Boryna",description:"Najbogatszy chłop w Lipcach. Patriarcha rządzący rodziną żelazną ręką. Poślubia młodą Jagnę i rodzi konflikt z synem Antkiem.",motifs:["motywojca","motywpracy","motywwsi"]},
    { id:"jagna",name:"Jagna",description:"Młoda chłopka wydana za Borynę wbrew woli. Wchodzi w romans z Antkiem. Staje się ofiarą ostracyzmu — wygnana przez społeczność, która ją pożądała.",motifs:["motywkobiety","motywmilosci","motywwsi"]},
    { id:"antoni",name:"Antoni Boryna",description:"Syn Macieja. Czuje się niesprawiedliwie traktowany przez ojca — wchodzi w romans z Jagną, żoną ojca.",motifs:["motywmilosci","motywkonfliktu"]},
    { id:"hektor",name:"Hektor",description:"Najdzielniejszy wojownik Troi. Walczy w obronie ojczyzny, choć przeczuwa śmierć. Wzór rycerza spełniającego obowiązek wobec nieuchronnej klęski.",motifs:["motywpatriotyzmu","motywrycerza","motywfatumprzeznaczenia","motywsmierci"]},
    { id:"parys",name:"Parys",description:"Młodszy syn Priama. Porywa Helenę wywołując wojnę trojańską. Piękny, lecz pozbawiony odwagi — unika bezpośredniej walki.",motifs:["motywmilosci","motywwojny"]},
    { id:"achilles",name:"Achilles",description:"Najsłynniejszy grecki heros. Wybiera krótkie lecz pełne chwały życie. Po śmierci Patroklosa wraca do walki by pomścić przyjaciela.",motifs:["motywzemsty","motywrycerza","motywfatumprzeznaczenia"]},
    { id:"polikarp",name:"Mistrz Polikarp",description:"Uczony teolog rozmawiający ze Śmiercią. Dowiaduje się o nieuchronności i demokratyczności śmierci wobec wszystkich ludzi.",motifs:["motywuczniaimistrza","motywsmierci","motywboga"]},
    { id:"smierc",name:"Śmierć",description:"Spersonifikowana Śmierć jako rozkładające się ciało kobiety z kosą. Głosi, że zabiera wszystkich — bogatych i biednych.",motifs:["motywsmierci","motywprzemijania"]},
  ]
};

const epochs = ["średniowiecze","antyk","renesans","barok","romantyzm","pozytywizm","młoda polska","współczesność"];

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
const clone = v => v == null ? v : JSON.parse(JSON.stringify(v));
const pickRandom = arr => arr?.length ? arr[Math.floor(Math.random()*arr.length)] : null;
const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const uniqueStr = arr => [...new Set((arr||[]).map(v=>String(v||'').trim()).filter(Boolean))];

function normalizeText(v){
  return String(v??'').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function escapeHtml(s){
  return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
const truncateText = (s,max=140) => { const t=String(s??''); return t.length>max?t.slice(0,max).trim()+'…':t; };

const makePairKey = (bId,mId) => [`book:${bId}`,`motif:${mId}`].sort().join('|');
const isMastered = (bId,mId) => masteredPairs.has(makePairKey(bId,mId));

const getBookById = id => data.books.find(b=>b.id===id)||null;
const getMotifById = id => data.motifs.find(m=>m.id===id)||null;
const getCharacterById = id => data.characters.find(c=>c.id===id)||null;
const getBookByCharacter = cId => data.books.find(b=>(b.characters||[]).includes(cId))||null;
const getBooksByMotif = mId => data.books.filter(b=>(b.motifs||[]).includes(mId));
const getCharactersByMotif = mId => (data.characters||[]).filter(c=>(c.motifs||[]).includes(mId));

const getBookAnswerVariants = b => uniqueStr([b?.title,...(b?.aliases||[])]);
const getMotifAnswerVariants = m => uniqueStr([m?.name,...(m?.aliases||[])]);
const bookMatchesAnswer = (b,ans) => getBookAnswerVariants(b).some(v=>normalizeText(v)===normalizeText(ans));
const motifMatchesAnswer = (m,ans) => getMotifAnswerVariants(m).some(v=>normalizeText(v)===normalizeText(ans));

function getFilteredBooks(){ return data.books.filter(b=>activeEpochs.has(b.epoch)); }
function getFilteredMotifs(){
  const map=new Map();
  getFilteredBooks().forEach(b=>b.motifs.forEach(id=>{const m=getMotifById(id);if(m) map.set(m.id,m);}));
  return [...map.values()];
}

function pointsForHints(n){ return n<=0?80:n===1?60:40; }

function formatCoverVisual(book){
  const src=book?.images?.[0]?.src;
  if(src) return `<div class="cover-visual"><img src="${escapeHtml(src)}" alt="${escapeHtml(book?.title||'')}"></div>`;
  return `<div class="cover-visual"><div class="cover-emoji">${escapeHtml(book?.coverEmoji||'📘')}</div></div>`;
}

// ═══════════════════════════════════════════════════════
//  MODE / VIEW SETTERS
// ═══════════════════════════════════════════════════════
function setMode(m){ mode=m; }
function setView(v){ view=v; }
function renderEpochFilter(){ /* delegated to UI */ }

// ═══════════════════════════════════════════════════════
//  QUIZ — START
// ═══════════════════════════════════════════════════════
function startQuiz(){
  score=0; quizMode='diagnostic';
  scoredPairs=new Set(); masteredPairs=new Set();
  window.quizAnswered=false; currentTaskType=null; currentTaskData=null; currentTask=null;
  document.getElementById('quiz-label').textContent='Diagnostyka';
  renderScore();
  renderDiagnostic(); // defined in index.html UI controller
}

function finishDiagnosticAndStartEngine(){
  quizMode='engine';
  window.quizAnswered=false; currentTaskType=null; currentTaskData=null; currentTask=null; taskBag=[];
  document.getElementById('quiz-label').textContent='Ćwiczenia';
  setNextButtonVisible(false);
  renderEngineNextTask();
}

// ═══════════════════════════════════════════════════════
//  ENGINE
// ═══════════════════════════════════════════════════════
function availableTypes(){
  return ENGINE_TASK_TYPES.filter(t=>{
    if(t==='Y1'&&view!=='books') return false;
    if(t==='Y2'&&view!=='motifs') return false;
    return true;
  });
}

function nextTypeFromBag(){
  if(!taskBag.length) taskBag=shuffle(availableTypes());
  return taskBag.pop()||null;
}

function renderEngineNextTask(){
  hideLearnMoreBox();
  window.quizAnswered=false;
  setNextButtonVisible(false);
  const type=nextTypeFromBag(); if(!type) return;
  currentTaskType=type;
  currentTask=createTask(type);
  currentTaskData=clone(currentTask.data);
  currentTask.render();
}

function createTask(type,preset=null){
  if(type==='X') return createTaskX(preset);
  if(type==='Y1') return createTaskY1(preset);
  if(type==='Y2') return createTaskY2(preset);
  return createTaskX(preset);
}

// ═══════════════════════════════════════════════════════
//  TASK X — swipe card
// ═══════════════════════════════════════════════════════
function buildTaskXData(){
  const books=getFilteredBooks(), motifs=getFilteredMotifs();
  if(view==='motifs'){
    const av=motifs.filter(m=>m.books.some(bId=>!isMastered(bId,m.id)));
    const pm=pickRandom(av.length?av:motifs); if(!pm) return {fallback:true};
    const cb=pm.books.map(getBookById).filter(Boolean).filter(b=>!isMastered(b.id,pm.id));
    const correct=pickRandom(cb.length?cb:pm.books.map(getBookById).filter(Boolean)); if(!correct) return {fallback:true};
    const pool=books.filter(b=>!pm.books.includes(b.id)&&b.id!==correct.id);
    const wrong=pickRandom(pool.length?pool:books.filter(b=>b.id!==correct.id)); if(!wrong||wrong.id===correct.id) return {fallback:true};
    const cl=Math.random()<.5;
    return {promptType:'motif',promptId:pm.id,promptTitle:pm.name,optionType:'book',leftId:cl?correct.id:wrong.id,rightId:cl?wrong.id:correct.id,correctSide:cl?'left':'right',correctBookId:correct.id};
  }
  const av=books.filter(b=>b.motifs.some(mId=>!isMastered(b.id,mId)));
  const pb=pickRandom(av.length?av:books); if(!pb) return {fallback:true};
  const cm=pb.motifs.map(getMotifById).filter(Boolean).filter(m=>!isMastered(pb.id,m.id));
  const correct=pickRandom(cm.length?cm:pb.motifs.map(getMotifById).filter(Boolean)); if(!correct) return {fallback:true};
  const pool=motifs.filter(m=>!pb.motifs.includes(m.id)&&m.id!==correct.id);
  const wrong=pickRandom(pool.length?pool:motifs.filter(m=>m.id!==correct.id)); if(!wrong||wrong.id===correct.id) return {fallback:true};
  const cl=Math.random()<.5;
  return {promptType:'book',promptId:pb.id,promptTitle:pb.title,optionType:'motif',leftId:cl?correct.id:wrong.id,rightId:cl?wrong.id:correct.id,correctSide:cl?'left':'right',correctMotifId:correct.id};
}

function createTaskX(preset=null){
  const d=preset||buildTaskXData();
  return {
    type:'X', data:d,
    render(){ renderTaskX(this.data,false); },
    submit(side){
      this.data._chosenSide=side;
      const ok=side===this.data.correctSide;
      if(ok){
        score+=25;
        if(this.data.promptType==='book'&&this.data.correctMotifId) masteredPairs.add(makePairKey(this.data.promptId,this.data.correctMotifId));
        if(this.data.promptType==='motif'&&this.data.correctBookId) masteredPairs.add(makePairKey(this.data.correctBookId,this.data.promptId));
      }
      renderScore(); setNextButtonVisible(true);
      renderTaskX(this.data,true);
      if(this.data.promptType==='book') showLearnMoreBox('book',this.data.promptId);
      else showLearnMoreBox('motif',this.data.promptId);
    }
  };
}

// ═══════════════════════════════════════════════════════
//  TASK Y1 — guess book from motif desc
// ═══════════════════════════════════════════════════════
function buildTaskY1Data(){
  const motifIds=new Set(getFilteredMotifs().map(m=>m.id));
  const cands=[];
  getFilteredBooks().forEach(b=>b.motifs.forEach(mId=>{if(motifIds.has(mId)) cands.push({bookId:b.id,motifId:mId});}));
  if(!cands.length) return {fallback:true};
  const c=pickRandom(cands);
  const book=getBookById(c.bookId), motif=getMotifById(c.motifId);
  if(!book||!motif) return {fallback:true};
  const pool=[];
  if(book.characters?.length) pool.push(`W utworze pojawia się postać: ${book.characters.slice(0,2).join(', ')}`);
  if(book.epoch) pool.push(`Epoka: ${book.epoch}`);
  if(book.description) pool.push(`Opis: ${truncateText(book.description,120)}`);
  return {
    fallback:false, type:'Y1', motifId:motif.id, targetBookId:book.id,
    acceptedBookIds:uniqueStr([...(motif.books||[]).filter(id=>getBookById(id))]),
    visibleHint:`Motyw: ${motif.description||motif.name}`,
    hiddenHints:[pool[0]||`Epoka: ${book.epoch||'nieznana'}`,pool[1]||'Zwróć uwagę na bohaterów i świat przedstawiony.'],
    revealedHints:0, userAnswer:'', submitted:false, feedback:'', feedbackType:'', pointsAwarded:0
  };
}

function createTaskY1(preset=null){
  const d=preset?clone(preset):buildTaskY1Data();
  return {
    type:'Y1', data:d,
    render(){ renderTaskY1(this.data); },
    revealHint(i){
      if(this.data.submitted) return;
      if(i===0&&this.data.revealedHints<1) this.data.revealedHints=1;
      if(i===1&&this.data.revealedHints<2&&this.data.revealedHints>=1) this.data.revealedHints=2;
      if(currentTask) currentTaskData=clone(currentTask.data);
      this.render();
    },
    setAnswer(v){ if(!this.data.submitted){this.data.userAnswer=v;if(currentTask) currentTaskData=clone(currentTask.data);} },
    submit(){
      if(this.data.submitted) return;
      const n=normalizeText(this.data.userAnswer||'');
      if(!n){this.data.feedback='Wpisz odpowiedź.';this.data.feedbackType='bad';this.render();return;}
      const match=this.data.acceptedBookIds.map(getBookById).find(b=>b&&bookMatchesAnswer(b,n));
      const pts=pointsForHints(this.data.revealedHints);
      this.data.submitted=true; this.data.pointsAwarded=0;
      if(match){
        this.data.pointsAwarded=pts; score+=pts;
        masteredPairs.add(makePairKey(match.id,this.data.motifId));
        this.data.feedback=`✅ Dobrze! +${pts} pkt`; this.data.feedbackType='ok';
      } else {
        const labels=this.data.acceptedBookIds.map(getBookById).filter(Boolean).map(b=>b.title);
        this.data.feedback=`❌ Nie tym razem. Poprawna: ${labels.join(' / ')}`; this.data.feedbackType='bad';
      }
      window.quizAnswered=true;
      if(currentTask) currentTaskData=clone(currentTask.data);
      renderScore(); this.render(); setNextButtonVisible(true);
    }
  };
}

// ═══════════════════════════════════════════════════════
//  TASK Y2 — guess shared motif from two books
// ═══════════════════════════════════════════════════════
function buildTaskY2Data(){
  const bookIds=new Set(getFilteredBooks().map(b=>b.id));
  const cands=[];
  getFilteredMotifs().forEach(motif=>{
    const bs=(motif.books||[]).map(getBookById).filter(b=>b&&bookIds.has(b.id));
    for(let i=0;i<bs.length;i++) for(let j=i+1;j<bs.length;j++) cands.push({motifId:motif.id,bookAId:bs[i].id,bookBId:bs[j].id});
  });
  if(!cands.length) return {fallback:true};
  const c=pickRandom(cands);
  const motif=getMotifById(c.motifId),bA=getBookById(c.bookAId),bB=getBookById(c.bookBId);
  if(!motif||!bA||!bB) return {fallback:true};
  const pool=[];
  if(motif.description) pool.push(`Wspólny motyw wiąże się z: ${truncateText(motif.description,120)}`);
  if(bA.epoch&&bB.epoch) pool.push(`Epoki: ${bA.epoch} / ${bB.epoch}`);
  return {
    fallback:false, type:'Y2', motifId:motif.id, bookAId:bA.id, bookBId:bB.id,
    visibleHint:'Dwie okładki łączy jeden wspólny motyw. Wpisz jego nazwę.',
    hiddenHints:[pool[0]||'Zwróć uwagę na sens obu utworów.',pool[1]||'Rozważ temat, bohaterów i konflikt.'],
    revealedHints:0, userAnswer:'', submitted:false, feedback:'', feedbackType:'', pointsAwarded:0
  };
}

function createTaskY2(preset=null){
  const d=preset?clone(preset):buildTaskY2Data();
  return {
    type:'Y2', data:d,
    render(){ renderTaskY2(this.data); },
    revealHint(i){
      if(this.data.submitted) return;
      if(i===0&&this.data.revealedHints<1) this.data.revealedHints=1;
      if(i===1&&this.data.revealedHints<2&&this.data.revealedHints>=1) this.data.revealedHints=2;
      if(currentTask) currentTaskData=clone(currentTask.data);
      this.render();
    },
    setAnswer(v){ if(!this.data.submitted){this.data.userAnswer=v;if(currentTask) currentTaskData=clone(currentTask.data);} },
    submit(){
      if(this.data.submitted) return;
      const n=normalizeText(this.data.userAnswer||'');
      if(!n){this.data.feedback='Wpisz odpowiedź.';this.data.feedbackType='bad';this.render();return;}
      const motif=getMotifById(this.data.motifId);
      const pts=pointsForHints(this.data.revealedHints);
      this.data.submitted=true; this.data.pointsAwarded=0;
      if(motif&&motifMatchesAnswer(motif,n)){
        this.data.pointsAwarded=pts; score+=pts;
        masteredPairs.add(makePairKey(this.data.bookAId,motif.id));
        masteredPairs.add(makePairKey(this.data.bookBId,motif.id));
        this.data.feedback=`✅ Dobrze! +${pts} pkt`; this.data.feedbackType='ok';
      } else {
        const labels=getMotifAnswerVariants(motif);
        this.data.feedback=`❌ Nie tym razem. Poprawna: ${labels.join(' / ')}`; this.data.feedbackType='bad';
      }
      window.quizAnswered=true;
      if(currentTask) currentTaskData=clone(currentTask.data);
      renderScore(); this.render(); setNextButtonVisible(true);
    }
  };
}

// ═══════════════════════════════════════════════════════
//  ANSWER HANDLERS
// ═══════════════════════════════════════════════════════
function handleAnswer(side){
  if(quizMode!=='engine') return;
  if(!currentTask||window.quizAnswered) return;
  window.quizAnswered=true;
  currentTask.submit(side);
}

function revealCurrentHint(i){ if(currentTask?.revealHint) currentTask.revealHint(i); }
function updateCurrentOpenTaskAnswer(v){ if(currentTask?.setAnswer) currentTask.setAnswer(v); }
function submitCurrentOpenTask(){ if(!currentTask||window.quizAnswered) return; if(currentTask?.submit) currentTask.submit(); }
function openCurrentTaskProfile(){ if(!currentTaskData||quizMode!=='engine') return; if(currentTaskData.promptType==='book') window.openBook(currentTaskData.promptId); else window.openMotif(currentTaskData.promptId); }

// ═══════════════════════════════════════════════════════
//  QUIZ STATE SNAPSHOT
// ═══════════════════════════════════════════════════════
function captureQuizState(){
  return {
    score, quizMode,
    scoredPairs:[...scoredPairs], masteredPairs:[...masteredPairs],
    answered:window.quizAnswered, currentTaskType, currentTaskData:clone(currentTaskData),
    profileReturnTarget, taskBag:[...taskBag]
  };
}

function restoreQuizState(snap){
  if(!snap) return;
  score=snap.score; quizMode=snap.quizMode;
  scoredPairs=new Set(snap.scoredPairs||[]);
  masteredPairs=new Set(snap.masteredPairs||[]);
  window.quizAnswered=snap.answered||false;
  currentTaskType=snap.currentTaskType;
  currentTaskData=clone(snap.currentTaskData);
  profileReturnTarget=snap.profileReturnTarget||'quiz';
  taskBag=snap.taskBag||[];
  renderScore();
  if(quizMode==='diagnostic'){
    document.getElementById('quiz-label').textContent='Diagnostyka';
    renderDiagnostic();
    return;
  }
  document.getElementById('quiz-label').textContent='Ćwiczenia';
  if(currentTaskType&&currentTaskData){
    currentTask=createTask(currentTaskType,currentTaskData);
    currentTask.render();
    setNextButtonVisible(window.quizAnswered);
  } else {
    renderEngineNextTask();
  }
}

// ═══════════════════════════════════════════════════════
//  SCORE
// ═══════════════════════════════════════════════════════
function renderScore(){
  const el=document.getElementById('score');
  if(el) el.textContent=score+' pkt';
}
