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

const scenarios = [
  {
    id: "1",
    title: "Scenario 1: Finne en bestemt rad eller enhet i en større oversikt",
    need: "Brukeren skal finne én bestemt rad eller enhet i en større oversikt, for å utføre en handling eller sjekke en tilstand. Brukeren skal ikke sammenligne verdier på tvers av enhetene.",
    examples: ["innboks", "oversikt over byggesaker"],
    recommendations: [
      "Bruk listevisning eller rik liste/kort.",
      "Skap et tydelig hierarki som gjør at den viktigste informasjonen er lett å finne.",
      "Skjul sekundær informasjon i et ekspanderbart felt dersom det sjelden er behov for den.",
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
    ],
  },
  {
    id: "2",
    title: "Scenario 2: Sammenligne verdier på tvers av mange datapunkter",
    need: "Brukeren må se data i sammenheng i rader og kolonner, for å sammenligne, oppdage mønstre, finne avvik eller se historisk utvikling.",
    examples: [
      "tidsserie- og måledata",
      "pris- og takstmatriser",
      "statistiske oversikter",
    ],
    recommendations: [
      "Behold tabellstrukturen, men gjør tabellen horisontalt rullbar hvis det trengs.",
      "Lås første kolonne slik at objektets navn alltid er synlig mens brukeren ruller sideveis.",
      "Lås kolonneoverskriftene i toppen dersom tabellen er lang vertikalt.",
      "Gi en visuell indikator på at tabellen er utfallende og kan rulles.",
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
    need: "Brukeren skal velge mellom noen få alternativer på grunnlag av mange egenskaper.",
    examples: [
      "valg av avtale- eller ytelsesmodell",
      "kriterier for tjenester eller ordninger",
      "produkt- eller studiekataloger",
    ],
    recommendations: [
      "Bytt om på aksene (transponer) slik at egenskapene går nedover siden som rader.",
      "Plasser de 2 til 3 alternativene ved siden av hverandre i smale kolonner til høyre.",
      "Er det flere enn 2 til 3 alternativer, la brukeren velge hva som skal stå i hver kolonne.",
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
];

export const groups = scenarios.map((g) => ({
  ...g,
  variants: g.variants.map((v) => ({ ...v, Component: stories[v.story] })),
}));
