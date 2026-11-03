export const intro =
  "Det er hovedsakelig tre alternative visningsformer som brukes til dette formålet: tabell, liste og kort. Ofte kan alle tre brukes for å presentere de samme dataene. Forskjellen ligger i hva brukeren skal gjøre. Tabeller egner seg best for sammenligning, lister for rask oversikt over mange oppføringer, mens kort egner seg når hver oppføring trenger mer plass, kontekst eller flere handlinger.";

export const structureNote =
  "Riktig struktur i koden er viktig uansett hvilken visningsform du velger. Semantisk HTML som tabell, liste og beskrivelsesliste gjør sammenhengene i dataene lesbare ikke bare for mennesker, men også for skjermlesere, søkemotorer og KI-agenter som skal tolke innholdet.";

export const alternatives = [
  {
    title: "Tabell",
    markup: "Tradisjonell tabell (<table>). Grid (role=\"grid\") kan vurderes for interaktive tabeller.",
    when: [
      "brukeren har behov for å sammenligne verdier på tvers av både rader og kolonner",
      "relasjonen mellom kolonneoverskrifter og celleinnhold er viktig for å forstå informasjonen",
      "hver rad representerer samme type objekt eller enhet, slik at sammenligning mellom radene gir mening",
      "antall kolonner er begrenset, slik at tabellen kan vises innenfor tilgjengelig bredde uten horisontal scrolling eller vesentlig redusert lesbarhet",
      "innholdet er kortfattet nok til at cellene ikke krever mye linjebryting",
      "tabellstrukturen gir mer verdi for brukeren enn alternative presentasjonsformer som liste eller kort.",
    ],
    caution: [
      "tabeller kan bli vanskelige å bruke på små skjermer når de inneholder mange kolonner eller mye tekst",
      "horisontal scrolling gjør sammenligning og orientering vanskeligere",
      "brukeren ser ofte bare deler av tabellen om gangen",
      "lange tekster i celler kan gi mye linjebryting og redusert lesbarhet",
      "mange kolonner kan kreve at innhold prioriteres eller presenteres på en annen måte",
      "dersom sammenligning ikke er en sentral oppgave, kan liste eller kort være bedre alternativer",
    ],
  },
  {
    title: "Liste",
    markup: "<ul>, <ol> eller <dl>. Kan fort bli løst som kort.",
    when: [
      "brukeren skal se gjennom mange oppføringer",
      "det er snakk om høy informasjonstetthet",
      "brukeren primært skal lese, finne eller skanne informasjon",
      "hver oppføring kan forstås uavhengig av hverandre",
      "innholdet har en naturlig rekkefølge, for eksempel kronologisk, alfabetisk eller prioritert",
      "det er få opplysninger knyttet til hver oppføring",
      "brukeren ikke har behov for å sammenligne mange egenskaper på tvers av flere oppføringer samtidig",
      "den viktigste informasjonen kan presenteres først i hver oppføring",
      "innholdet skal fungere godt på tvers av skjermstørrelser uten spesielle tilpasninger.",
    ],
    caution: [
      "lister fungerer dårlig når brukeren må sammenligne mange verdier mellom ulike oppføringer",
      "lange lister kan bli krevende å skanne uten søk, filtrering eller gruppering",
      "viktige sammenhenger mellom ulike datafelt kan bli mindre tydelige enn i en tabell",
    ],
  },
  {
    title: "Kort",
    markup: "Rik liste: en liste der hver oppføring har mer innhold.",
    when: [
      "hver oppføring inneholder flere egenskaper som bør presenteres samlet",
      "brukeren primært fokuserer på én oppføring om gangen",
      "informasjonen varierer i lengde eller innhold mellom oppføringene",
      "det er nødvendig å prioritere eller fremheve enkelte opplysninger",
      "hver oppføring inneholder handlinger, for eksempel rediger, slett eller åpne",
      "innholdet skal fungere godt på små skjermer og kunne tilpasses ulike skjermbredder",
      "visuelle elementer som status, kategorier, ikoner eller bilder bidrar til forståelsen.",
    ],
    caution: [
      "kort kan bruke betydelig mer plass enn lister og tabeller",
      "sammenligning mellom oppføringer blir ofte vanskeligere",
      "mange kort etter hverandre kan føre til mye scrolling",
      "ulikt innhold i hvert kort kan gjøre informasjonen mindre oversiktlig.",
    ],
  },
];
