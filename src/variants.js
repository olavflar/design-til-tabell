import * as stories from "./patterns/structured-data.stories.tsx";

// Hver variant peker på en story i structured-data.stories.tsx, som er
// formatet mønsterartiklene på designsystemet.no bruker (<Story story="..." />).
// Gruppene følger brukerscenarioene i mønsterartikkelen.

const saker = {
  eyebrow: "Min side",
  heading: "Oversikt over sakene dine",
  intro:
    "Her ser du sakene du har sendt inn. Velg en sak for å se detaljer og hva som skjer videre.",
};

const innboks = {
  eyebrow: "Min side",
  heading: "Innboks",
  intro:
    "Her finner du meldinger og brev fra kommunen. Velg en melding for å lese den.",
};

const statistikk = {
  eyebrow: "Statistikk om",
  heading: "Innenlandsk transport",
  intro:
    "Statistikken viser hvordan transport av personer og gods i Norge utvikler seg med tog, på veiene, i lufta og på sjøen.",
};

const forerkort = {
  eyebrow: "Førerkort",
  heading: "Hvilken førerkortklasse trenger du?",
  intro:
    "Klassen bestemmer hvor tung bil og tilhenger du kan kjøre. Sammenlign klassene for å se hva som passer deg.",
};

const soknad = {
  eyebrow: "Søknad om tilskudd · Steg 2 av 4",
  heading: "Søknad om tilskudd",
  intro: "Fyll ut søknaden. Du kan gå tilbake og endre før du sender inn.",
};

const scenarios = [
  {
    id: "1",
    title: "Scenario 1: Brukeren skal finne et bestemt objekt i en større oversikt",
    need: "Brukeren skal utføre en handling eller sjekke en tilstand. Brukeren skal ikke sammenligne verdier på tvers av enhetene.",
    examples: [
      "Innboks",
      "Oversikt over byggesaker e.l.",
    ],
    recommendations: [
      "Bruk listevisning eller rik liste/kort",
      "Skap et tydelig hierarki som gjør at den viktigste informasjonen er lett å finne",
      "Bruk kollaps/ekspander dersom innholdet (brukerne trenger for å finne frem) er omfattende og ikke alle har behov for å lese alt",
    ],
    variants: [
      {
        id: "1a",
        story: "CasesList",
        title: "Liste (ul)",
        description:
          "Objektnavn og litt metadata per oppføring. Rask å skanne og fungerer på alle skjermbredder uten tilpasninger. Mer informasjon vises når brukeren åpner saken.",
        context: saker,
      },
      {
        id: "1b",
        story: "CasesKeyValueList",
        title: "Liste med etikett og verdi",
        description:
          "Hver oppføring har en tabell med to kolonner der etiketten er radoverskrift. Det gjør koblingen mellom etikett og verdi tydelig for skjermlesere og KI-agenter. Designsystemet har ingen komponent for beskrivelseslister (dl), så tabellen tar den rollen.",
        context: saker,
      },
      {
        id: "1c",
        story: "CasesCards",
        title: "Kort (rik liste)",
        description:
          "Hvert kort er et listeelement med mer innhold og status. Hele kortet er klikkbart via lenken i overskriften. Bruker mer plass, men tilpasser seg skjermbredden.",
        context: saker,
      },
      {
        id: "1d",
        story: "CasesExpandable",
        title: "Liste med ekspanderbare detaljer",
        description:
          "Navn og status er alltid synlige. Saksnummer, dato og hvem som behandler saken ligger bak «Flere detaljer», fordi brukeren sjelden trenger dem for å finne riktig sak.",
        context: saker,
      },
      {
        id: "1e",
        story: "CasesSearchableCards",
        title: "Tabell som blir kort, med søk og sortering",
        description:
          "På full bredde vises sakene som tabell. Når tabellen ikke får plass, blir hver rad et kort med saksnummer og handlinger øverst og kolonnene som etikett og verdi. Søk, statusfilter og sortering virker likt i begge, og antall treff leses opp når listen endres.",
        context: saker,
      },
      {
        id: "1f",
        story: "Inbox",
        title: "Innboks",
        description:
          "Hver melding er et kort i en liste, med avsender og dato øverst, emnet som lenke og en kort forhåndsvisning. Søk, filterbrikker for uleste og vedlegg og et avsendervalg gjør det lett å finne én melding, og antall treff leses opp når listen endres. Uleste meldinger har uthevet emne og en «Ulest»-merkelapp, så det ikke bare vises med utheving.",
        context: innboks,
      },
      {
        id: "1g",
        story: "CasesTableToRichList",
        title: "Tabell som blir rik liste",
        description:
          "Samme tabell som i 1e, men på smale skjermer prioriteres innholdet i stedet for at alle kolonnene tas med. Saksnavnet står først som lenke, saksnummer, behandler og mottatt-dato under, og status, sist oppdatert og handlinger nederst. Velg «Dynamisk» og dra i bredden for å se når tabellen blir til en liste.",
        context: saker,
      },
      {
        id: "1h",
        story: "CasesTableToStackedList",
        title: "Tabell som blir stablet liste",
        description:
          "Etter «stacked list» fra UX Movement. Hver rad har fire faste plasser: saksnavnet øverst til venstre, sist oppdatert øverst til høyre, saksnummer, behandler og mottatt-dato nederst til venstre i dempet tekst, og status nederst til høyre. Det er ingen etiketter, men verdiene som ikke forklarer seg selv, har et ord foran. Flere detaljer får brukeren ved å åpne saken, ikke ved å ekspandere raden. Det er mer kompakt enn kort, så flere saker får plass på skjermen.",
        context: saker,
      },
    ],
  },
  {
    id: "2",
    title: "Scenario 2: Sammenligne mange datapunkter",
    need: "Brukeren må se data i sammenheng med i rader og kolonner. Behovene kan være å sammenligne, oppdage mønstre, finne avvik eller historisk utvikling.",
    examples: [
      "Tidsserie- og måledata: Endringer i verdier over tid for flere enheter eller steder (for eksempel temperaturer, luftkvalitet eller vannstand gjennom døgnet).",
      "Pris- og takstmatriser: Tabeller der to variable faktorer bestemmer sluttsummen (for eksempel sone basert på tidspunkt, eller gebyrsatser basert på størrelse og type).",
      "Statistiske oversikter: Sammenstilling av nøkkeltall fordelt på fylker, kommuner eller årsperioder.",
    ],
    recommendations: [
      "Behold (/Bruk gjerne) tabellstruktur, og gjør tabellen horisontalt rullbar hvis det trengs.",
      "Lås første kolonne slik at objektets tittel eller navn alltid er synlig mens brukeren ruller resten av dataene sidelengs.",
      "Lås kolonneoverskriftene i toppen dersom tabellen er lang vertikalt.",
      "Gi en visuell indikator på at tabellen er utfallende og kan scrolles.",
    ],
    variants: [
      {
        id: "2a",
        story: "TableHorizontalScroll",
        title: "Horisontal rulling",
        description:
          "Tabellen beholdes og ruller sideveis når den ikke får plass. Designsystemet har ikke fast førstekolonne eller en indikator for at tabellen kan rulles, så radoverskriftene forsvinner når brukeren ruller. Det er et behov mønsteret bør melde inn til Designsystemet.",
        context: statistikk,
      },
      {
        id: "2b",
        story: "TableStickyHeader",
        title: "Faste kolonneoverskrifter",
        description:
          "Bruker stickyHeader fra Designsystemet. Tabellen får begrenset høyde og ruller begge veier i samme område, slik at kolonneoverskriftene alltid er synlige.",
        context: statistikk,
      },
    ],
  },
  {
    id: "3",
    title: "Scenario 3: Sammenligne få alternativer med mange egenskaper",
    need: "Brukeren står overfor et valg mellom noen få alternativer på grunnlag av en mange egenskaper.",
    examples: [
      "Valg av avtale- eller ytelsesmodell: Sammenligning av to utbetalings- eller dekningsgrader der sum, varighet og vilkår varierer.",
      "Kriterier for tjenester eller ordninger: Sammenligning av to til fire rettighetsgrupper, tillatelser eller søknadskategorier for å se hvilken man oppfyller kravene til.",
      "Produkt- eller studiekataloger: Sammenligning av et utvalg av 2-3 spesifikke tilbud på tvers av opptakskrav, omfang og plassering.",
    ],
    recommendations: [
      "Bytt om på aksene (transponering) slik at alle egenskapene gå vertikalt nedover siden som rader.",
      "Plasser de 2 til 3 alternativene ved siden av hverandre i smale kolonner til høyre, slik at brukeren kan lese og sammenligne horisontalt fra venstre til høyre per egenskap.",
      "Dersom det finnes flere enn 2 til 3 alternativer totalt, la brukeren velge hvilke alternativer som skal stå side om side via en velger eller nedtrekksmeny på toppen av hver kolonne.",
    ],
    variants: [
      {
        id: "3a",
        story: "CompareTransposed",
        title: "Transponert tabell",
        description:
          "Tre førerkortklasser står side om side, og egenskapene går nedover som rader. Brukeren leser fra venstre mot høyre per egenskap, uten å rulle sideveis.",
        context: forerkort,
      },
      {
        id: "3b",
        story: "CompareWithPicker",
        title: "Transponert tabell med velger per kolonne",
        description:
          "Det finnes fem klasser, men bare to får plass side om side på mobil. En nedtrekksliste øverst i hver kolonne lar brukeren velge hvilke klasser som sammenlignes.",
        context: forerkort,
      },
    ],
  },
  {
    id: "4",
    title: "Scenario 4: Utføre en handling på en rad (utkast)",
    need: "Brukeren skal gjøre noe med én bestemt rad, for eksempel åpne, redigere eller slette den. Ofte er det rader brukeren har lagt inn selv i et skjema, som kostnader i en søknad. Feil og advarsler må vises ved raden de gjelder.",
    examples: [
      "kostnader eller budsjettposter i en søknad",
      "familiemedlemmer, arbeidsforhold eller eiendommer i et skjema",
    ],
    recommendations: [
      "Vis hver oppføring som et kort når tabellen ikke får plass.",
      "Samle handlingene for oppføringen i en egen rad nederst i kortet, med knapper som er store nok å treffe.",
      "Vis feilene inne i kortet de gjelder, og ikke bare med farge.",
      "Vis advarsler og opplysninger som et antall som kan åpnes, så de ikke tar plass fra feilene.",
    ],
    variants: [
      {
        id: "4a",
        story: "CostsWithActionRow",
        title: "Kort med handlingsrad",
        description:
          "På full bredde vises kostnadene som tabell, og feilene står i en egen rad under kostnaden de gjelder. Når tabellen ikke får plass, blir hver kostnad et kort med Rediger og Slett i en egen rad nederst. Kort med feil får rød bakgrunn og feilteksten under beløpet. Advarsler og opplysninger vises som et tall som åpner en popover. Slett ber om bekreftelse i en popover. Trykker du «Neste steg» mens det er feil, vises en feiloppsummering like over knappen, med lenker til kostnadene. «Neste steg» står før «Forrige steg», og under hverandre på mobil, slik mønsteret for plassering av knapper sier. Velg «Dynamisk» for å se overgangen.",
        context: soknad,
      },
    ],
  },
];

export const groups = scenarios.map((g) => ({
  ...g,
  variants: g.variants.map((v) => ({ ...v, Component: stories[v.story] })),
}));
