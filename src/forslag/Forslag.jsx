import {
  Alert,
  Card,
  Details,
  Heading,
  Link,
  List,
  Paragraph,
  Table,
  Tag,
} from "@digdir/designsystemet-react";
import HifiNav from "../components/HifiNav.jsx";
import { CASES, byNewest, Example, Small } from "../components/cases.jsx";
import { extract, cssBetween } from "../components/CodeExample.jsx";
import { SearchableCases, DetailsList, Mapping } from "../liste/Liste.jsx";
import { Costs } from "../kort/Kort.jsx";
import { StatTable, SmallScreen, Intro as ElbilIntro, rows as elbilRows } from "../tabell/Tabell.jsx";
import { CompareStudies, AirQuality, BulkCases, UnknownTask } from "./eksempler.jsx";
import listeSrc from "../liste/Liste.jsx?raw";
import listeCss from "../liste/liste.css?raw";
import kortSrc from "../kort/Kort.jsx?raw";
import kortCss from "../kort/kort.css?raw";
import tabellSrc from "../tabell/Tabell.jsx?raw";
import tabellCss from "../tabell/tabell.css?raw";
import eksSrc from "./eksempler.jsx?raw";
import eksCss from "./forslag.css?raw";

/* Forslag til ny oppbygging av artikkelen «Strukturert informasjon på små
   skjermer». Tekstene bygger på gruppas utkast. Alt er utkast. */

const sorted = [...CASES].sort(byNewest);

const Open = ({ children }) => (
  <Alert data-color="warning" data-size="sm">
    <Paragraph data-size="sm"><strong>Til avklaring i gruppa:</strong> {children}</Paragraph>
  </Alert>
);

const Bullets = ({ items }) => (
  <List.Unordered>{items.map((t, i) => <List.Item key={i}>{t}</List.Item>)}</List.Unordered>
);

/** Samme oppsett for hver brukeroppgave: når, eksempler, anbefaling og komponenter */
function Task({ n, id, title, when, examples, advice, components, children }) {
  return (
    <section className="task" aria-labelledby={id}>
      <Heading level={3} data-size="sm" id={id}>{n}. {title}</Heading>
      <Paragraph>{when}</Paragraph>
      <div className="task__facts">
        <div>
          <Heading level={4} data-size="2xs">Eksempler</Heading>
          <Bullets items={examples} />
        </div>
        <div>
          <Heading level={4} data-size="2xs">Anbefaling</Heading>
          <Bullets items={advice} />
        </div>
      </div>
      <Paragraph data-size="sm" className="meta">
        Komponenter: {components.map((c, i) => <code key={c}>{c}{i < components.length - 1 ? "" : ""}</code>)}
      </Paragraph>
      {children}
    </section>
  );
}

const TASKS = [
  ["1", "Finne én oppføring", "Liste, eller kort når oppføringene har handlinger", "#oppgave-finne"],
  ["2", "Sammenligne få alternativer", "Snudd tabell der brukeren velger alternativene", "#oppgave-fa"],
  ["3", "Sammenligne mange oppføringer", "Tabell som ruller sideveis, med fast første kolonne", "#oppgave-mange"],
  ["4", "Se nøkkelinformasjon, med detaljer ved behov", "Liste eller kort med detaljer bak en handling", "#oppgave-detaljer"],
  ["5", "Oppdage mønstre og avvik", "Tabell eller liste som markerer avvik, med trendgraf og sortering", "#oppgave-avvik"],
  ["6", "Endre oppføringer", "Kort med handlinger, og avkryssing når flere skal endres samtidig", "#oppgave-endre"],
];

export default function Forslag() {
  return (
    <main className="art forslag">
      <HifiNav current="Forslag" />
      <header>
        <Paragraph data-size="sm" className="eyebrow">
          Mønster · <Tag data-size="sm" data-color="warning">Forslag til ny oppbygging</Tag>
        </Paragraph>
        <Heading level={1} data-size="lg">Strukturert informasjon på små skjermer</Heading>
        <Paragraph data-size="lg">
          Mønsteret hjelper deg å velge mellom tabell, liste og kort, og å tilpasse visningen til små skjermer uten at
          sammenhengen i informasjonen går tapt.
        </Paragraph>
        <nav aria-label="Innhold" className="toc">
          {[["#definisjon", "Definisjon"], ["#bruk", "Slik bruker du mønsteret"], ["#forberedelser", "Forberedelser"],
            ["#oppgaver", "Velg visning"], ["#liten-skjerm", "Tilpass til liten skjerm"], ["#visualiseringer", "Små visualiseringer"],
            ["#sprak", "Språk"], ["#kode", "Kode"], ["#kilder", "Kilder"]].map(([h, t]) => <Link key={h} href={h}>{t}</Link>)}
        </nav>
      </header>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="definisjon">
        <Heading level={2} data-size="md" id="definisjon">Definisjon</Heading>
        <Paragraph>
          Strukturert informasjon er en samling <strong>oppføringer</strong> av samme type, der hver oppføring har de
          samme <strong>egenskapene</strong>. Saker med saksnummer, dato og status er strukturert informasjon. Det er
          også målinger fra flere steder og tidspunkter, og studietilbud med opptakskrav og poenggrense.
        </Paragraph>
        <Card data-color="accent" variant="tinted" className="rule">
          <Heading level={3} data-size="xs">Regneark-testen</Heading>
          <Paragraph>
            Kunne informasjonen stått i et regneark, med én rad per oppføring og én kolonne per egenskap? Da hører den
            til dette mønsteret. Er det bare én kolonne, er det en vanlig liste, og da gjelder retningslinjene for{" "}
            <Link href="https://designsystemet.no/no/components/docs/list/overview">List</Link>.
          </Paragraph>
        </Card>
        <div className="cols">
          <div>
            <Heading level={3} data-size="2xs">Begreper</Heading>
            <Bullets items={[
              <><strong>Oppføring:</strong> én sak, én måling, ett studietilbud. I en tabell er det en rad.</>,
              <><strong>Egenskap:</strong> det alle oppføringene har, som status eller dato. I en tabell er det en kolonne.</>,
              <><strong>Verdi:</strong> egenskapen for én oppføring, som «Under behandling». I en tabell er det en celle.</>,
            ]} />
          </div>
          <div>
            <Heading level={3} data-size="2xs">Ikke med i mønsteret</Heading>
            <Bullets items={[
              "Punktlister med tekst, som råd eller steg i en veiledning. Se List.",
              "Menyer og navigasjon.",
              "Skjemaer.",
              "Grafer som egne visninger, som linjediagram og stolpediagram. Det hører til et eget mønster for datavisualisering.",
            ]} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="bruk">
        <Heading level={2} data-size="md" id="bruk">Slik bruker du mønsteret</Heading>
        <Paragraph>Mønsteret følger tre spørsmål. Resten av artikkelen er bygd opp etter dem.</Paragraph>
        <List.Ordered className="steps">
          <List.Item><strong>Er det strukturert informasjon?</strong> Bruk regneark-testen. Hvis nei, se komponentene.</List.Item>
          <List.Item><strong>Hva skal brukeren gjøre?</strong> Brukeroppgaven avgjør om du velger tabell, liste eller kort. Se <Link href="#oppgaver">Velg visning</Link>.</List.Item>
          <List.Item><strong>Hva skjer på liten skjerm?</strong> Behold tabellen, eller gjør den om til liste eller kort uten at sammenhengen går tapt. Se <Link href="#liten-skjerm">Tilpass til liten skjerm</Link>.</List.Item>
        </List.Ordered>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="forberedelser">
        <Heading level={2} data-size="md" id="forberedelser">Forberedelser</Heading>
        <Heading level={3} data-size="sm">Kartlegg brukeroppgaven</Heading>
        <Bullets items={[
          "Skal brukeren finne, sammenligne, oppdage avvik eller endre noe?",
          "Hvilken egenskap kjenner brukeren igjen oppføringen på?",
          "Hvilke egenskaper må være synlige samtidig, og hvilke kan ligge bak en handling?",
          "Hvor mange oppføringer er det, og trenger brukeren søk, filter eller sortering?",
        ]} />
        <Heading level={3} data-size="sm">Utfordre dataene</Heading>
        <Paragraph>
          En database har ofte mange flere egenskaper enn brukeren trenger. Vis ikke alle kolonnene fordi de finnes.
          Velg egenskapene ut fra brukeroppgaven, og la resten ligge bak en handling. Mange tabeller som er vanskelige
          på mobil, er egentlig en utskrift av databasen som ingen har prioritert.
        </Paragraph>
        <Heading level={3} data-size="sm">Når du ikke kjenner brukeroppgaven</Heading>
        <Paragraph>
          Noen ganger brukes visningen til mye forskjellig, eller virksomheten vil dele data uten å vite hva de skal
          brukes til. Da kan du lage noen ferdige visninger for de vanligste spørsmålene, og gi tilgang til alle
          dataene og nedlasting for dem som trenger mer. Ferdige visninger er lettere å tilpasse liten skjerm enn
          rådata.
        </Paragraph>
        <Example
          id="ukjent"
          smallLabel="Ferdige visninger og alle data, liten skjerm"
          large={<UnknownTask />}
          caption="Tre visninger svarer på hvert sitt spørsmål: hvor er det billigst nå, hvordan har prisene utviklet seg, og alle data. Visningene byttes med ToggleGroup. «Alle data» er en tabell som ruller sideveis med fast første kolonne, og alle data kan lastes ned."
          render={() => <UnknownTask />}
          code={[
            { label: "Visninger", code: extract(eksSrc, "UnknownTask", "MiniChart", "downloadCsv") },
            { label: "CSS", code: cssBetween(eksCss, "Småbilder") },
          ]}
        />
        <Open>
          Utkastet foreslår også et chatgrensesnitt i stedet for visningen, og å la være å dele dataene. Skal det
          anbefales?
        </Open>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="oppgaver">
        <Heading level={2} data-size="md" id="oppgaver">Velg visning etter brukeroppgave</Heading>
        <Paragraph>
          De samme dataene kan ofte vises som tabell, liste eller kort. Det er brukeroppgaven som avgjør hva som er
          best.
        </Paragraph>
        <div className="overview">
          <Table data-size="sm" zebra>
            <caption>Brukeroppgaver og anbefalt visning</caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope="col">Brukeroppgave</Table.HeaderCell>
                <Table.HeaderCell scope="col">Anbefalt visning</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {TASKS.map(([n, t, v, h]) => (
                <Table.Row key={n}>
                  <Table.HeaderCell scope="row"><Link href={h}>{n}. {t}</Link></Table.HeaderCell>
                  <Table.Cell>{v}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <Task n="1" id="oppgave-finne" title="Finne én oppføring"
          when="Brukeren skal finne og kjenne igjen én eller noen få oppføringer, ikke sammenligne dem."
          examples={["Innboks", "Mine søknader", "Nyheter"]}
          advice={[
            "Bruk en liste. Velg kort hvis hver oppføring har handlinger.",
            "Sett det brukeren kjenner igjen oppføringen på først, som lenke.",
            "Gi søk når listen er lang, og filter når det er få, kjente kategorier.",
          ]}
          components={["List", "Heading", "Link", "Tag", "Input type=\"search\"", "Chip"]}
        >
          <Example
            id="finne"
            smallLabel="Liste med søk og filter, liten skjerm"
            large={<SearchableCases id="finne-large" large />}
            caption="På stor skjerm er det en tabell, på liten skjerm en liste. Søk, sortering og filter virker likt i begge, og antall treff leses opp av skjermleser."
            render={(id) => <SearchableCases id={id} />}
            code={[
              { label: "Liste", code: extract(listeSrc, "SearchableCases") },
              { label: "CSS", code: cssBetween(listeCss, "Søk og filter", "Dialog-knapp") },
            ]}
          />
        </Task>

        <Task n="2" id="oppgave-fa" title="Sammenligne få alternativer"
          when="Brukeren skal velge mellom noen få alternativer og sammenligne flere egenskaper. Passer ikke når brukeren bare vurderer én egenskap."
          examples={["Studietilbud", "Avtaler der pris, varighet og vilkår varierer", "Værmelding for noen få steder"]}
          advice={[
            "Bruk tabell. Snu den, så egenskapene går nedover og alternativene står i kolonner.",
            "Er det flere enn to eller tre alternativer, la brukeren velge hvilke som sammenlignes.",
            "Gjør det lett å se det som skiller alternativene.",
          ]}
          components={["Table", "Chip", "Switch"]}
        >
          <Example
            id="fa"
            smallLabel="Snudd tabell, liten skjerm"
            large={<CompareStudies initial={["uib", "uio", "hvl", "ntnu"]} />}
            caption="Egenskapene går nedover, og studiene står i kolonner. På liten skjerm velger brukeren to eller tre. Bryteren skjuler egenskapene som er like for alle, så forskjellene kommer frem. Blir tabellen bredere enn skjermen, står første kolonne fast."
            render={() => <CompareStudies />}
            code={[
              { label: "Tabell", code: extract(eksSrc, "CompareStudies") },
              { label: "CSS", code: cssBetween(tabellCss, "Fast førstekolonne", "Toning") },
            ]}
          />
        </Task>

        <Task n="3" id="oppgave-mange" title="Sammenligne mange oppføringer"
          when="Brukeren skal se mange oppføringer og egenskaper i sammenheng: sammenligne, finne høyeste og laveste verdi eller se utvikling over tid."
          examples={["Tidsserier og måledata", "Pris- og takstmatriser", "Nøkkeltall per fylke eller kommune"]}
          advice={[
            "Behold tabellen og la den rulle sideveis.",
            "Lås første kolonne, så navnet på oppføringen alltid er synlig.",
            "Lås overskriftsraden når tabellen er lang.",
            "Vis tydelig at tabellen fortsetter til siden.",
          ]}
          components={["Table"]}
        >
          <Example
            id="mange"
            smallLabel="Tabell som ruller sideveis, liten skjerm"
            large={
              <div className="frame__content hifi">
                <ElbilIntro id="mange-large" />
                <StatTable data={elbilRows} captionId="mange-large" />
              </div>
            }
            caption="Første kolonne og overskriftsraden står fast, og resten ruller sideveis. Skygge ved den faste kolonnen og en toning til høyre viser at det er mer innhold."
            render={(id) => <SmallScreen id={id} />}
            code={[
              { label: "Tabell", code: extract(tabellSrc, "StatTable", "ScrollArea") },
              { label: "CSS", code: cssBetween(tabellCss, "Rulleflaten", "Snudd tabell") },
            ]}
          />
          <Open>
            Er det riktig å anbefale tabell med sideveis rulling når oppføringene har mange egenskaper, eller bør vi
            først anbefale å prøve liste eller kort? Det må begrunnes ut fra WCAG 1.4.10.
          </Open>
        </Task>

        <Task n="4" id="oppgave-detaljer" title="Se nøkkelinformasjon, med detaljer ved behov"
          when="Brukeren trenger noen få egenskaper for å finne oppføringen, og resten bare av og til."
          examples={["Saker med mange felt", "Vedtak", "Fakturaer"]}
          advice={[
            "Vis det viktigste i listen, og legg resten bak en handling.",
            "Bruk Details når detaljene er korte, og Dialog når de er mange.",
            "Fjern ikke informasjon. Legg den ett trykk unna.",
          ]}
          components={["List", "Details", "Dialog", "Table"]}
        >
          <Example
            id="detaljer"
            smallLabel="Liste med detaljer ved behov, liten skjerm"
            caption="Navn og status er alltid synlige. Resten ligger under «Detaljer om saken», som etikett og verdi."
            render={(id) => <Small id={id}><DetailsList items={sorted} labelledBy={id} /></Small>}
            code={[
              { label: "Liste", code: extract(listeSrc, "DetailsList") },
              { label: "CSS", code: cssBetween(listeCss, "Detaljer ved behov", "Søk og filter") },
            ]}
          />
        </Task>

        <Task n="5" id="oppgave-avvik" title="Oppdage mønstre og avvik"
          when="Brukeren leter etter det som skiller seg ut, men vet ikke hva det er på forhånd."
          examples={["Måleverdier over en grense", "Utgifter som er høyere enn budsjett", "Saker som har ligget lenge"]}
          advice={[
            "La løsningen finne avvikene når den kan, og si det i klartekst over visningen.",
            "Merk avvik med tekst, ikke bare farge.",
            "Sorter så avvikene kommer først.",
            "Vis utviklingen ved siden av verdien, for eksempel med en trendgraf.",
          ]}
          components={["Table", "List", "Tag", "Chip"]}
        >
          <Example
            id="avvik"
            smallLabel="Liste med avvik og trendgraf, liten skjerm"
            large={<AirQuality large />}
            caption="Teksten over sier hvor mange som er over grenseverdien. De er sortert først og har en merkelapp med tekst. Trendgrafen viser utviklingen, og ordet ved siden av sier den med tekst. På stor skjerm sorterer brukeren med kolonneoverskriftene."
            render={() => <AirQuality />}
            code={[
              { label: "Visning", code: extract(eksSrc, "AirQuality", "Sparkline", "Level") },
              { label: "CSS", code: cssBetween(eksCss, "Trendgraf", "Avkryssing") },
            ]}
          />
        </Task>

        <Task n="6" id="oppgave-endre" title="Endre oppføringer"
          when="Brukeren skal endre, slette eller legge til oppføringer, én om gangen eller flere samtidig."
          examples={["Kostnader i en søknad", "Endre status på flere saker", "Arkivere meldinger"]}
          advice={[
            "Én om gangen: bruk kort med handlingene nederst i kortet.",
            "Flere samtidig: la brukeren krysse av og velge én handling for alle de valgte.",
            "Vis feil inne i kortet eller raden de gjelder.",
            "Ikke deaktiver knapper. Si i stedet hva brukeren må gjøre.",
          ]}
          components={["Card", "Button", "Popover", "ValidationMessage", "ErrorSummary", "Checkbox"]}
        >
          <Example
            id="endre"
            smallLabel="Kort med handlinger, liten skjerm"
            large={<Costs large />}
            caption="Endre og Slett står nederst i kortet. Feilen står der beløpet skulle stått. Slett ber om bekreftelse. Endre og «Legg til kostnad» åpner et skjema i en dialog. Feil vises ved feltet de gjelder. Når brukeren lagrer, oppdateres tabellen eller kortet, en melding sier hva som skjedde, og fokus går tilbake til knappen."
            render={() => <Costs />}
            code={[
              { label: "Kort", code: extract(kortSrc, "CostCards", "EditButton", "DeleteButton") },
              { label: "Skjema", code: extract(kortSrc, "CostForm", "parseKr") },
              { label: "Siden", code: extract(kortSrc, "Costs") },
              { label: "Tabell", code: extract(kortSrc, "CostTable") },
              { label: "CSS", code: cssBetween(kortCss, "Med handlinger", "Stor skjerm") },
            ]}
          />
          <Example
            id="flere"
            smallLabel="Velg flere og arkiver, liten skjerm"
            large={<BulkCases large />}
            caption="Hver oppføring har en avkrysningsboks, og «Velg alle» står øverst. Handlingen står fast nederst og sier hvor mange som er valgt. Knappen er aldri deaktivert: uten valg sier teksten hva brukeren må gjøre."
            render={() => <BulkCases />}
            code={[
              { label: "Visning", code: extract(eksSrc, "BulkCases") },
              { label: "CSS", code: cssBetween(eksCss, "Avkryssing", "Småbilder") },
            ]}
          />
          <Open>
            Designsystemet har ingen data grid. Er avkryssing og én handling for de valgte godt nok, eller skal endring
            av flere oppføringer samtidig holdes utenfor mønsteret?
          </Open>
        </Task>

        <Heading level={3} data-size="sm">Tabell, liste eller kort</Heading>
        <Paragraph>
          Det er en glidende overgang fra enkle lister til kort med mye innhold. Mengden innhold per oppføring avgjør:
        </Paragraph>
        <div className="cols">
          {[
            ["Tabell", ["Brukeren sammenligner verdier på tvers av oppføringene.", "Hver rad er samme type innhold.", "Verdiene er korte."]],
            ["Liste", ["Brukeren finner eller skanner.", "Få egenskaper per oppføring.", "Oppføringen er en vei videre."]],
            ["Kort", ["Mange egenskaper, eller handlinger.", "Brukeren jobber med én oppføring om gangen.", "Innholdet varierer i lengde."]],
          ].map(([t, items]) => (
            <Details key={t}>
              <Details.Summary>{t} kan være greit når …</Details.Summary>
              <Details.Content><Bullets items={items} /></Details.Content>
            </Details>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="liten-skjerm">
        <Heading level={2} data-size="md" id="liten-skjerm">Tilpass til liten skjerm</Heading>
        <Paragraph>
          Når en tabell blir en liste eller kort, må sammenhengen bestå. Brukeren skal aldri være i tvil om hva en
          verdi beskriver, eller hvilke verdier som hører til samme oppføring.
        </Paragraph>
        <Heading level={3} data-size="sm">Fire faste plasser per oppføring</Heading>
        <Mapping />
        <Heading level={3} data-size="sm">Hjelp brukeren å finne frem</Heading>
        <div className="cols">
          {[
            ["Søk", "Når listen er lang og brukeren vet hva de leter etter.", "Input type=\"search\""],
            ["Filter", "Når det er få, kjente kategorier, for eksempel status.", "Chip.Checkbox i Fieldset"],
            ["Sortering", "Når rekkefølgen hjelper oppgaven, for eksempel høyest først.", "Chip.Radio, Select fra 7 valg"],
            ["Gruppering", "Når oppføringene har en naturlig inndeling.", "Overskrift og liste per gruppe"],
            ["Oppdeling i sider", "Når listen er så lang at den blir tung å bla i.", "Pagination"],
            ["Fast overskrift og kolonne", "Når tabellen beholdes og ruller.", "Table stickyHeader"],
          ].map(([t, d, c]) => (
            <div key={t}>
              <Heading level={4} data-size="2xs">{t}</Heading>
              <Paragraph data-size="sm">{d}</Paragraph>
              <Paragraph data-size="sm" className="meta"><code>{c}</code></Paragraph>
            </div>
          ))}
        </div>
        <Paragraph>
          Endringer fra søk, filter og sortering skal meldes til skjermlesere, for eksempel «Viser 3 av 8 saker».
        </Paragraph>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="visualiseringer">
        <Heading level={2} data-size="md" id="visualiseringer">Små visualiseringer</Heading>
        <Paragraph>
          På små skjermer er det sjelden plass til store grafer. Små visualiseringer kan stå rett i en celle eller en
          listeoppføring, så brukeren slipper å hoppe mellom tall og graf.
        </Paragraph>
        <Bullets items={[
          <><strong>Trendgraf:</strong> en linje ved siden av verdien, som viser utviklingen. Si også utviklingen med ord. Se eksempelet under <Link href="#oppgave-avvik">Oppdage mønstre og avvik</Link>.</>,
          <><strong>Symboler:</strong> sparer plass, men skal alltid ha tekst, for eksempel en merkelapp eller et skjult navn.</>,
          <><strong>Småbilder</strong> (small multiples): samme lille figur med samme skala for hver oppføring, så bare dataene endrer seg. Se «Utvikling» i eksempelet under <Link href="#forberedelser">Forberedelser</Link>.</>,
        ]} />
        <Paragraph>
          Store grafer hører til et eget mønster. Har du en graf, bør dataene også finnes som tabell, for skjermlesere,
          KI-agenter og alle som trenger de nøyaktige tallene.
        </Paragraph>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="sprak">
        <Heading level={2} data-size="md" id="sprak">Språk</Heading>
        <Heading level={3} data-size="sm">Forkortelser</Heading>
        <Bullets items={[
          "Bruk bare allment kjente forkortelser, som org.nr., tlf. og kr.",
          "Unngå interne fagbegreper og saksbehandlerbegreper.",
          "Velg et kortere ord fremfor å forkorte, for eksempel «Dato» i stedet for «Reg.dato».",
        ]} />
        <Heading level={3} data-size="sm">Avkorting av tekst</Heading>
        <Bullets items={[
          "La teksten bryte over flere linjer i stedet for å kutte den.",
          "Kutter du likevel, må hele teksten kunne leses, og skjermlesere skal alltid få hele teksten.",
          "Kutt i slutten. Kutt i midten når oppføringene ligner hverandre, eller når det er filnavn, så filtypen synes.",
        ]} />
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="kode">
        <Heading level={2} data-size="md" id="kode">Kode</Heading>
        <Card data-color="accent" variant="tinted" className="rule">
          <Heading level={3} data-size="xs">Kod innholdet etter hva det er, ikke etter hvordan det ser ut</Heading>
          <Paragraph>
            Velg element ut fra strukturen i innholdet, og style det etterpå. Utseendet skal ikke love mer struktur enn
            koden har. Vises kolonneoverskrifter, skal det være en tabell.
          </Paragraph>
        </Card>
        <Table data-size="sm" zebra>
          <caption>Hvilket element passer</caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope="col">Innhold</Table.HeaderCell>
              <Table.HeaderCell scope="col">Element</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {[
              ["Rader og kolonner som sammenlignes", "table, med caption og th"],
              ["Oppføringer som står hver for seg", "ul"],
              ["Oppføringer der rekkefølgen betyr noe, som kø, steg eller rangering", "ol"],
              ["Etikett og verdi", "dl, eller table med radoverskrifter"],
              ["Navnet på en oppføring", "Overskrift, som regel med lenke"],
            ].map(([a, b]) => (
              <Table.Row key={a}>
                <Table.HeaderCell scope="row">{a}</Table.HeaderCell>
                <Table.Cell><code>{b}</code></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Heading level={3} data-size="sm">Når tabellen blir en liste</Heading>
        <Bullets items={[
          "Vis ulik kode på stor og liten skjerm: en tabell der det er en tabell, og en liste der det er en liste.",
          <>Ikke gjør om en tabell med CSS. <code>display: block</code> på tabellelementer fjerner tabellstrukturen for skjermlesere i flere nettlesere.</>,
          "Mål bredden på flaten tabellen står i, ikke bare vinduet.",
          <>En sortert liste er fortsatt en <code>ul</code>. Rekkefølgen endrer seg når brukeren sorterer på nytt.</>,
          <>Lister der kulepunktene er fjernet med CSS, trenger <code>role="list"</code> for å bli lest som liste i Safari.</>,
          <>Meld endringer fra søk, filter og sortering med <code>role="status"</code>.</>,
        ]} />
        <Paragraph>
          Følg komponentdokumentasjonen for detaljene, og lenk dit i stedet for å gjenta den.
        </Paragraph>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="kilder">
        <Heading level={2} data-size="md" id="kilder">Kilder</Heading>
        <Bullets items={[
          "Uutilsynet: Tabeller",
          "WCAG 1.3.1 Informasjon og relasjoner (Uutilsynet)",
          "WCAG 1.4.10 Dynamisk tilpasning (Uutilsynet)",
          <Link key="fdk" href="https://data.norge.no">Felles datakatalog</Link>,
        ]} />
        <Paragraph data-size="sm" className="meta">Lenkene til Uutilsynet legges inn.</Paragraph>
        <Paragraph data-size="sm" className="meta">
          Arbeidsgruppe: Digdir, Nav, Oslo kommune, Skatteetaten, Politiet, Brønnøysundregistrene og Entur.
        </Paragraph>
      </section>
    </main>
  );
}
