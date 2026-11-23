export const intro =
  "Det er hovedsakelig tre alternative visningsformer som brukes til dette formålet: tabell, liste og kort. Ofte kan alle tre brukes for å presentere de samme dataene. Forskjellen ligger i hva brukeren skal gjøre. Tabeller egner seg best for sammenligning, lister for rask oversikt over mange oppføringer, mens kort egner seg når hver oppføring trenger mer plass, kontekst eller flere handlinger.";

export const structureNote =
  "Riktig struktur i koden er viktig uansett hvilken visningsform du velger. Semantisk HTML som tabell, liste og beskrivelsesliste gjør sammenhengene i dataene lesbare ikke bare for mennesker, men også for skjermlesere, søkemotorer og KI-agenter som skal tolke innholdet.";

export const alternatives = [
  {
    title: "Tabell",
    markup: "Tradisjonell tabell (<table>). Grid (role=\"grid\") kan vurderes for interaktive tabeller.",
    when: [
      "brukeren har behov for å sammenligne verdier på tvers av flere informasjonselementer",
      "relasjonen mellom ledetekst og innhold er viktig for å forstå informasjonen",
      "hver rad representerer samme type objekt eller enhet, slik at sammenligning mellom radene gir mening",
      "antall kolonner er begrenset, slik at tabellen kan vises innenfor tilgjengelig bredde uten horisontal scrolling eller vesentlig redusert lesbarhet",
      "innholdet er kortfattet nok til at det ikke krever mye linjebryting",
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

export const sources = [
  {
    title: "GitHub-diskusjonen om strukturerte data på små skjermer",
    author: "Designsystemet, github.com/digdir/designsystemet/discussions/3703",
    href: "https://github.com/digdir/designsystemet/discussions/3703",
    points: [
      "Utgangspunktet for arbeidsgruppen. Innspill og eksempler fra etatene samles her.",
      "Et innspill der: start med brukeroppgaven. Skal brukeren sammenligne på tvers, sortere og filtrere, eller lete etter ett element? Da kan svaret være en liste eller kort, ikke en responsiv tabell.",
    ],
  },
  {
    title:
      "How to make tables fit on small screens (spoiler: you probably can’t and maybe you shouldn’t)",
    author: "Litsa Babalis, Medium",
    points: [
      "Å stable tabellcellene med CSS fjerner tabellrollen og gjentar overskriftene i hver rad. Bytt heller til en annen komponent, for eksempel en liste, når konteksten endrer seg.",
      "Brukeren på mobil har ofte et annet behov enn på desktop, for eksempel en rask handling i stedet for å sammenligne. Da kan listen vise færre opplysninger.",
    ],
  },
  {
    title: "Stacked List: The Best Way to Fit Tables on Mobile Screens",
    author: "UX Movement, Medium",
    points: [
      "Fire faste plasser per rad: det viktigste øverst til venstre, det nest viktigste øverst til høyre, status nederst til høyre og det minst viktige nederst til venstre i dempet tekst.",
      "Har tabellen mer enn fem kolonner, vis resten på en egen detaljside.",
      "Artikkelen fraråder trekkspill (Details), fordi åpne rader skyver de andre ut av syne og gjør det lett å blande radene. Det er verdt å vurdere for eksempel 1d.",
    ],
  },
];

export const ingress = [
  "Strukturerte data kan være krevende å presentere på små skjermer, særlig når datamengden og kompleksiteten øker.",
  "Dette mønsteret hjelper deg å finne frem til gode løsninger, med fokus på formål, brukerbehov og tilgjengelighet.",
];

export const preparations = {
  intro:
    "Start med å brukerens oppgave/behov, ikke med komponenten. For å finne frem til gode løsninger bør du vurdere datamengde, kompleksitet, gjenkjennelighet.",
  questions: [
    "Skal brukeren kun lese/finne informasjon?",
    "Skal brukeren sammenligne informasjon?",
    "Skal brukeren bearbeide (endre, velge, flytte, slette, legge til) innholdet?",
    "Hvilken informasjonsbit (typisk første kolonnen i en tabell) er den mest sentrale (objektet)?",
    "Hvilke egenskaper er viktigst?",
    "Hvilke opplysninger må være synlige samtidig?",
    "Trenger brukeren søk, filtrering eller sortering?",
    "Må alle opplysningene vises i samme visning/komponent?",
  ],
};

export const designText = [
  "Når presentasjonen av strukturerte data tilpasses små skjermer, handler designjobben om å bevare sammenhengen i dataene, sikre god lesbarhet og gi store nok trykkflater.",
  "Plassmangel på små skjermer skal aldri være en begrunnelse for å fjerne nødvendig informasjon vilkårlig. Vurder hvilke opplysninger brukeren må se umiddelbart for å løse sine oppgaver, og hvilke som kan legges bak en sekundær handling, for eksempel i en ekspanderbar visning. Den viktigste informasjonen bør tydeliggjøres ved hjelp av plassering og utforming.",
  "Pass på at det er tilstrekkelig avstand mellom elementer, så innholdet blir lesbart, til tross for begrenset skjermstørrelse.",
  "Når en tabell endres til kort eller liste på mobil, må sammenhengen mellom opplysningene bestå. Brukeren skal aldri være i tvil om hva en enkeltverdi beskriver, eller hvilke datafelt som tilhører samme oppføring. Sørg for at tilhørende ledetekster følger verdiene på en entydig måte.",
];

export const language = [
  {
    title: "Forkortelser",
    text: [
      "Plassmangel på små skjermer gjør det fristende å forkorte ord og ledetekster. Unødvendige eller ukjente forkortelser svekker lesbarheten, særlig for brukere med nedsatt kognitiv funksjon, synshemninger eller annet førstespråk.",
    ],
    points: [
      "Bruk kun allment kjente forkortelser: Begrens bruken til etablerte standarder som org.nr., tlf. og kr.",
      "Unngå interne fagbegreper: Saksbehandlerbegreper eller fagsjargon (som s-beh. eller jfr.) bør ikke brukes.",
      "Forenkle fremfor å forkorte: Velg kortere synonymer der det er mulig, for eksempel Dato i stedet for Reg.dato.",
      "Etabler ukjente forkortelser: Dersom en mindre kjent forkortelse er nødvendig, skal begrepet skrives fullt ut ved første forekomst, med forkortelsen i parentes.",
    ],
  },
  {
    title: "Avkorting av tekst (trunkering)",
    text: [
      "Avkorting av tekst innebærer å erstatte deler av teksten med en ellipse (…) for å spare plass. Dette skjuler innhold og bør regnes som en nødløsning. Vurder heller linjebryting fremfor avkorting av tekst.",
      "Dersom trunkering er absolutt nødvendig, må plasseringen tilpasses innholdstypen:",
    ],
    points: [
      "Avkorting i slutten kan benyttes ved ordinær løpende tekst eller titler der det meningsbærende innholdet står først. Unngå at gjentakende standardfraser i starten gjør oppføringer visuelt identiske.",
      "Avkorting på midten bør velges for filnavn, referansenumre og unike koder, slik at både innledende identifikator og avsluttende filtype eller sifferrekke forblir synlige (f.eks. vedtak_…_endelig.pdf).",
    ],
    after:
      "Dersom man benytter avkorting så må man passe på å at brukeren kan lese ha mulighet til å hele teksten ved en bevisst handling. Ikke baser løsningen på hover, da dette ikke fungerer på berøringsskjermer. For skjermlesere må man tilby den fullstendige teksten.",
  },
];
