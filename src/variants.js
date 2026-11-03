import * as stories from "./patterns/structured-data.stories.tsx";

// Hver variant peker på en story i structured-data.stories.tsx, som er
// formatet mønsterartiklene på designsystemet.no bruker (<Story story="..." />).

const statistikk = {
  eyebrow: "Statistikk om",
  heading: "Innenlandsk transport",
  intro:
    "Statistikken viser hvordan transport av personer og gods i Norge utvikler seg med tog, på veiene, i lufta og på sjøen.",
};

const saker = {
  eyebrow: "Min side",
  heading: "Oversikt over sakene dine",
  intro:
    "Her ser du sakene du har sendt inn. Velg en sak for å se detaljer og hva som skjer videre.",
};

export const groups = [
  {
    title: "Tabell med horisontal skroll",
    description:
      "Statistikktabell der brukeren skal sammenligne verdier på tvers av rader og kolonner.",
    variants: [
      {
        id: "1a",
        story: "TableHorizontalScroll",
        title: "Horisontal skroll",
        description:
          "Tabellen beholdes som den er og rulles sideveis. Når brukeren ruller, forsvinner radoverskriftene, og det blir uklart hva tallene beskriver. Brukeren kan bytte til listevisning, der hver rad vises med verdiene under og ingenting må rulles sideveis.",
        context: statistikk,
      },
      {
        id: "1b",
        story: "TableStickyFirstColumn",
        title: "Horisontal skroll med fast førstekolonne",
        description:
          "Radoverskriftene står fast mens tallkolonnene rulles. En skygge viser at det er innhold under. Kolonneoverskriftene forsvinner når siden rulles nedover.",
        context: statistikk,
      },
      {
        id: "1d",
        story: "TableStickyHeader",
        title: "Fast førstekolonne og sticky header",
        description:
          "Bruker stickyHeader fra Designsystemet. Tabellen får begrenset høyde og ruller begge veier i samme område, slik at både radoverskrifter og kolonneoverskrifter alltid er synlige.",
        context: statistikk,
      },
    ],
  },
  {
    title: "Tabell, liste og kort",
    description:
      "Samme oversikt over saker vist på fire måter. Hver sak er et objekt med navn, status og noen få metadata, og brukeren skal finne og åpne én sak.",
    variants: [
      {
        id: "2a",
        story: "CasesTable",
        title: "Tabell",
        description:
          "Gir god oversikt på stor skjerm. På mobil må brukeren rulle sideveis for å se metadataene, selv om det ikke er behov for å sammenligne dem.",
        context: saker,
      },
      {
        id: "2b",
        story: "CasesList",
        title: "Liste (ul)",
        description:
          "Objektnavn og litt metadata per oppføring. Rask å skanne og fungerer på alle skjermbredder uten tilpasninger. Mer informasjon vises når brukeren åpner saken.",
        context: saker,
      },
      {
        id: "2c",
        story: "CasesDescriptionList",
        title: "Liste med beskrivelsesliste (ul + dl)",
        description:
          "Hver oppføring har en beskrivelsesliste der etikett og verdi henger sammen i koden. Det gjør koblingen tydelig for skjermlesere og KI-agenter, slik kolonneoverskrifter gjør i en tabell.",
        context: saker,
      },
      {
        id: "2d",
        story: "CasesCards",
        title: "Kort (rik liste)",
        description:
          "Hvert kort er et listeelement med mer innhold og status. Hele kortet er klikkbart via lenken i overskriften. Bruker mer plass, men tilpasser seg skjermbredden.",
        context: saker,
      },
    ],
  },
];

export const variants = groups
  .flatMap((g) => g.variants)
  .map((v) => ({ ...v, Component: stories[v.story] }));
