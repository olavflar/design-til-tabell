import {
  Alert,
  Card,
  Heading,
  Link,
  List,
  Paragraph,
  Table,
  Tag,
} from "@digdir/designsystemet-react";
import {
  ExclamationmarkTriangleFillIcon,
  LocationPinIcon,
  StarFillIcon,
  StarIcon,
} from "@navikt/aksel-icons";
import { groups } from "../variants.js";
import { BrowserFrame, PhoneFrame } from "../components/DeviceFrame.jsx";

/* Mønsterartikkelen «Strukturerte data på små skjermer», bygget med
   Designsystemets komponenter. Eksemplene er de levende prototypene fra
   structured-data.stories.tsx, vist i mobil- og nettleserramme. */

const variants = Object.fromEntries(
  groups.flatMap((g) => g.variants).map((v) => [v.story, v]),
);

function Prototype({ story }) {
  const v = variants[story];
  return (
    <div className="frame__content">
      <section className="article">
        <Paragraph data-size="sm" className="eyebrow">{v.context.eyebrow}</Paragraph>
        <Heading level={2} data-size="lg">{v.context.heading}</Heading>
        <Paragraph>{v.context.intro}</Paragraph>
        <v.Component />
      </section>
    </div>
  );
}

/** Eksempel: liten skjerm, og eventuelt stor skjerm ved siden av */
function Example({ story, wide = false, caption }) {
  const label = variants[story].title;
  return (
    <div className="examples">
      {wide && (
        <figure className="wide">
          <figcaption>Stor skjerm</figcaption>
          <BrowserFrame height={600} label={`${label}, stor skjerm`}>
            <Prototype story={story} />
          </BrowserFrame>
        </figure>
      )}
      <figure>
        <figcaption>Liten skjerm</figcaption>
        <PhoneFrame width={390} height={720} label={`${label}, liten skjerm`}>
          <Prototype story={story} />
        </PhoneFrame>
      </figure>
      {caption && <Paragraph data-size="sm">{caption}</Paragraph>}
    </div>
  );
}

/** Små eksempler som ikke finnes som story ennå */
function MiniExample({ title, label, caption, children }) {
  return (
    <div className="examples">
      <figure>
        <figcaption>Liten skjerm</figcaption>
        <PhoneFrame width={390} height={640} label={label}>
          <div className="frame__content mini">
            <Heading level={2} data-size="sm">{title}</Heading>
            {children}
          </div>
        </PhoneFrame>
      </figure>
      {caption && <Paragraph data-size="sm">{caption}</Paragraph>}
    </div>
  );
}

const Spark = ({ points, label }) => {
  const max = Math.max(...points), min = Math.min(...points);
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 96 + 2},${22 - ((p - min) / (max - min || 1)) * 18}`)
    .join(" ");
  const [lx, ly] = d.split(" ").at(-1).split(",");
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" role="img" aria-label={label}>
      <polyline points={d} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r="2.2" fill="currentColor" />
    </svg>
  );
};

const AIR = [
  ["Bergen", [8, 7, 9, 8, 10, 12, 11, 13, 14, 16]],
  ["Oslo", [14, 13, 13, 12, 11, 11, 10, 9, 9, 8]],
  ["Trondheim", [10, 11, 9, 10, 10, 11, 10, 9, 10, 10]],
  ["Stavanger", [4, 5, 7, 6, 9, 11, 10, 14, 13, 17]],
  ["Tromsø", [12, 10, 13, 11, 12, 9, 10, 8, 11, 9]],
  ["Kristiansand", [15, 14, 12, 13, 11, 10, 8, 7, 6, 4]],
];

const TEMP = [
  ["Oslo", [-3, -2, 2, 7, 12, 16, 17, 15, 10, 5]],
  ["Bergen", [2, 3, 5, 8, 12, 14, 15, 14, 11, 7]],
  ["Trondheim", [-2, -1, 2, 6, 10, 13, 15, 14, 10, 5]],
  ["Tromsø", [-4, -4, -2, 1, 5, 10, 12, 11, 7, 2]],
  ["Stavanger", [3, 3, 5, 8, 11, 14, 15, 15, 12, 8]],
  ["Bodø", [-1, -1, 1, 4, 8, 11, 13, 13, 9, 5]],
];

const Multiple = ({ points }) => {
  // Samme skala i alle: −10 til 20 °C
  const d = points.map((p, i) => `${(i / 9) * 96 + 2},${38 - ((p + 10) / 30) * 34}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
      <line x1="2" y1="38" x2="98" y2="38" stroke="currentColor" strokeOpacity=".35" vectorEffect="non-scaling-stroke" />
      <polyline points={d} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Stars = ({ n }) => (
  <span role="img" aria-label={`${n} av 5 stjerner`} style={{ display: "inline-flex" }}>
    {[0, 1, 2, 3, 4].map((i) =>
      i < n ? <StarFillIcon key={i} aria-hidden /> : <StarIcon key={i} aria-hidden />,
    )}
  </span>
);

const Open = ({ children }) => (
  <Alert data-color="warning" data-size="sm">
    <Paragraph data-size="sm"><strong>Åpent spørsmål:</strong> {children}</Paragraph>
  </Alert>
);

const DoDont = ({ good, bad }) => (
  <div className="cols">
    <div>
      <Heading level={3} data-size="2xs"><span className="dot-do" aria-hidden />{good.title}</Heading>
      <List.Unordered>{good.items.map((t) => <List.Item key={t}>{t}</List.Item>)}</List.Unordered>
    </div>
    <div>
      <Heading level={3} data-size="2xs"><span className="dot-dont" aria-hidden />{bad.title}</Heading>
      <List.Unordered>{bad.items.map((t) => <List.Item key={t}>{t}</List.Item>)}</List.Unordered>
    </div>
  </div>
);

const Bullets = ({ items }) => (
  <List.Unordered>{items.map((t, i) => <List.Item key={i}>{t}</List.Item>)}</List.Unordered>
);

export default function Artikkel() {
  return (
    <main className="art">
      <header style={{ display: "flex", flexDirection: "column", gap: "var(--ds-size-4)" }}>
        <Paragraph data-size="sm" className="eyebrow">
          Mønster · <Tag data-color="warning" data-size="sm">Utkast</Tag>
        </Paragraph>
        <Heading level={1} data-size="xl">Strukturerte data på små skjermer</Heading>
        <Paragraph variant="long" data-size="lg">
          Strukturerte data kan være krevende å presentere på små skjermer, særlig når datamengden og kompleksiteten øker.
        </Paragraph>
        <Paragraph>
          Dette mønsteret hjelper deg å finne frem til gode løsninger, med fokus på formål, brukerbehov og tilgjengelighet.
          Eksemplene er levende prototyper bygget med Designsystemets komponenter.
        </Paragraph>
        <nav className="toc" aria-label="Innhold">
          {[
            ["definisjon", "Definisjon"], ["forberedelser", "Forberedelser"], ["tilnaerming", "Oppgave og innhold"],
            ["alternativer", "Hva er alternativene?"], ["design", "Design og opplevelse"], ["visualiseringer", "Visualiseringer"],
            ["scenarioer", "Brukerscenarioer"], ["sprak", "Språk"], ["kode", "Kode"], ["kilder", "Kilder"],
          ].map(([id, t]) => <Link key={id} href={`#${id}`}>{t}</Link>)}
        </nav>
      </header>

      <section id="definisjon" aria-labelledby="h-def">
        <Heading id="h-def" level={2} data-size="md">Definisjon</Heading>
        <Paragraph>
          Strukturerte data er informasjon som følger en definert og gjentakende struktur. Det kan for eksempel være en samling
          verdier som har de samme egenskapene, som saker med saksnummer, dato og status, eller målinger fra flere tidspunkter.
          Dataene kan vises som tabell, liste eller andre organiserte visninger i et brukergrensesnitt. Se også begrepet i
          Felles datakatalog.
        </Paragraph>
      </section>

      <section id="forberedelser" aria-labelledby="h-forb">
        <Heading id="h-forb" level={2} data-size="md">Forberedelser</Heading>
        <Paragraph>
          Start med brukerens oppgave og behov. For å finne frem til gode løsninger bør du vurdere datamengde, kompleksitet og
          gjenkjennelighet.
        </Paragraph>
        <Bullets items={[
          "Skal brukeren kun lese eller finne informasjon?",
          "Skal brukeren sammenligne informasjon?",
          "Skal brukeren bearbeide (endre, velge, flytte, slette, legge til) innholdet?",
          "Hvilken informasjonsbit er den mest sentrale (objektet)?",
          "Hvilke egenskaper er viktigst?",
          "Hvilke opplysninger må være synlige samtidig?",
          "Trenger brukeren søk, filtrering eller sortering?",
          "Må alle opplysningene vises i samme visning?",
        ]} />
      </section>

      <section id="tilnaerming" aria-labelledby="h-tiln">
        <Heading id="h-tiln" level={2} data-size="md">Start med oppgaven, sjekk så innholdet</Heading>
        <Paragraph>
          Det finnes to måter å velge visning på. Med en <strong>brukeroppgavetilnærming</strong> spør du hva brukeren skal
          gjøre: finne, sammenligne eller bearbeide. Med en <strong>komponenttilnærming</strong> ser du på dataene: hvor mange
          oppføringer og egenskaper det er, og hva slags innhold hver egenskap har.
        </Paragraph>
        <Paragraph>
          Du trenger begge. Brukeroppgaven avgjør hva visningen skal få til. Innholdet avgjør om visningen får plass på en
          liten skjerm.
        </Paragraph>
        <Paragraph>
          To datasett med like mange oppføringer og egenskaper kan derfor trenge ulik løsning. Korte tall og datoer kan stå i en
          tabell også på mobil. Lange setninger kan ikke det, selv om brukeroppgaven er den samme. Da blir tabellen en liste
          eller kort på liten skjerm.
        </Paragraph>
        <Table border data-size="sm" style={{ maxWidth: "44rem" }}>
          <caption>Slik påvirker innholdet i egenskapene visningen på liten skjerm</caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Innhold i egenskapene</Table.HeaderCell>
              <Table.HeaderCell>På liten skjerm</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {[
              ["Korte verdier", "Tall, datoer, beløp og korte ord. Tabellen kan ofte beholdes, med fast førstekolonne hvis den må rulle."],
              ["Lange tekster", "Setninger og beskrivelser gir smale kolonner med mye linjebryting. Gjør hver rad om til en oppføring i en liste eller et kort, med etiketten over teksten."],
              ["Symboler og status", "Sparer plass og kan stå i en tabellcelle. Symbolet trenger tekst ved siden av, eller en forklaring."],
              ["Grafer", "Trendgrafer kan stå i en celle eller en listeoppføring. Større grafer trenger egen plass, og da passer kort bedre enn tabell."],
              ["Blandet innhold", "Når egenskapene er svært ulike, får hver oppføring ofte et eget kort. Plasser det viktigste først."],
            ].map(([a, b]) => (
              <Table.Row key={a}>
                <Table.HeaderCell scope="row">{a}</Table.HeaderCell>
                <Table.Cell>{b}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Example
          story="CasesTableToRichList"
          wide
          caption="Samme data og samme oppgave. Fordi innholdet ikke får plass i kolonner, blir tabellen en rik liste på liten skjerm. Koden følger med: listen er en liste, og tabellen er en tabell."
        />
      </section>

      <section id="alternativer" aria-labelledby="h-alt">
        <Heading id="h-alt" level={2} data-size="md">Hva er alternativene?</Heading>
        <Paragraph>
          Det er hovedsakelig tre visningsformer som brukes til dette formålet: tabell, liste og kort. Ofte kan alle tre
          brukes for å presentere de samme dataene. Forskjellen ligger i hva brukeren skal gjøre. Tabeller egner seg best for
          sammenligning, lister for rask oversikt over mange oppføringer, mens kort egner seg når hver oppføring trenger mer
          plass, kontekst eller flere handlinger.
        </Paragraph>

        <Heading level={3} data-size="sm" id="tabell">Tabell</Heading>
        <Example story="CompareTransposed" caption="Få og korte kolonner: tabellen får plass uten rulling på mobil." />
        <DoDont
          good={{ title: "Tabell kan være greit når …", items: [
            "formålet primært er å sammenligne verdier på tvers av flere informasjonselementer",
            "relasjonen mellom ledetekst og innhold er viktig for å forstå informasjonen",
            "hver rad representerer samme type innhold, slik at sammenligning mellom radene gir mening",
            "antall kolonner er begrenset, slik at tabellen kan vises innenfor tilgjengelig bredde uten horisontal scrolling eller vesentlig redusert lesbarhet",
            "innholdet er kortfattet nok til at det ikke krever mye linjebryting",
            "tabellstrukturen gir mer verdi for brukeren enn alternative presentasjonsformer som liste eller kort.",
          ] }}
          bad={{ title: "Vær oppmerksom på:", items: [
            "tabeller kan bli vanskelige å bruke på små skjermer når de inneholder mange kolonner eller mye tekst",
            "horisontal scrolling gjør sammenligning og orientering vanskeligere",
            "lange tekster i celler kan gi mye linjebryting og redusert lesbarhet",
            "mange kolonner kan kreve at innhold prioriteres eller presenteres på en annen måte",
            "dersom sammenligning ikke er en sentral oppgave, kan liste eller kort være bedre alternativer.",
          ] }}
        />

        <Heading level={3} data-size="sm" id="liste">Liste</Heading>
        <Example story="CasesTableToStackedList" wide caption="Fem kolonner blir to linjer per oppføring, med det viktigste først." />
        <DoDont
          good={{ title: "Liste kan være greit når …", items: [
            "brukeren skal se gjennom mange oppføringer",
            "hver oppføring er enkel og avgrenset, med få eller ingen ekstra egenskaper",
            "brukeren primært skal lese, finne eller skanne informasjon",
            "hver oppføring kan forstås uavhengig av de andre",
            "innholdet har en naturlig rekkefølge, for eksempel kronologisk, alfabetisk eller prioritert",
            "det er få opplysninger knyttet til hver oppføring",
            "brukeren ikke har behov for å sammenligne mange egenskaper på tvers av flere oppføringer samtidig",
            "den viktigste informasjonen kan presenteres først i hver oppføring",
            "innholdet skal fungere godt på tvers av skjermstørrelser uten spesielle tilpasninger.",
          ] }}
          bad={{ title: "Vær oppmerksom på:", items: [
            "lister fungerer dårlig når brukeren skal sammenligne mange verdier mellom ulike oppføringer",
            "lange lister kan bli krevende å skanne uten søk, filtrering eller gruppering",
            "viktige sammenhenger mellom ulike datafelt kan bli mindre tydelige enn i en tabell.",
          ] }}
        />

        <Heading level={3} data-size="sm" id="kort">Kort</Heading>
        <Example story="CostsWithActionRow" wide caption="Hvert kort samler én oppføring med handlingene sine. Feil vises inne i kortet de gjelder." />
        <DoDont
          good={{ title: "Kort kan være greit når …", items: [
            "hver oppføring inneholder flere egenskaper som bør presenteres samlet",
            "brukeren primært skal fokusere på én oppføring om gangen",
            "informasjonen varierer i lengde eller innhold mellom oppføringene",
            "det er ønskelig å fremheve enkelte opplysninger",
            "hver oppføring inneholder handlinger, for eksempel rediger, slett eller åpne",
            "innholdet skal fungere godt på tvers av skjermstørrelser uten spesielle tilpasninger",
            "visuelle elementer som status, kategorier, ikoner eller bilder bidrar til forståelsen.",
          ] }}
          bad={{ title: "Vær oppmerksom på:", items: [
            "kort kan bruke betydelig mer plass enn lister og tabeller",
            "sammenligning mellom oppføringer blir ofte vanskeligere",
            "mange kort etter hverandre kan føre til mye scrolling",
            "ulikt innhold i hvert kort kan gjøre informasjonen mindre oversiktlig.",
          ] }}
        />
      </section>

      <section id="design" aria-labelledby="h-design">
        <Heading id="h-design" level={2} data-size="md">Design og opplevelse</Heading>
        <Paragraph>
          Når presentasjonen av strukturerte data tilpasses små skjermer, handler designjobben om å bevare sammenhengen i
          dataene, sikre god lesbarhet og gi store nok trykkflater.
        </Paragraph>
        <Paragraph>
          Vurder hvilke opplysninger brukeren må se umiddelbart for å løse sine oppgaver, og hvilke som kan legges bak en
          sekundær handling, for eksempel i en ekspanderbar visning. Den viktigste informasjonen bør tydeliggjøres ved hjelp av
          plassering og utforming.
        </Paragraph>
        <Example story="CasesExpandable" caption="Navn og status vises med en gang. Saksnummer, dato og behandler ligger bak «Flere detaljer»." />
        <Paragraph>
          Pass på at det er tilstrekkelig avstand mellom elementer, så innholdet blir lesbart til tross for begrenset
          skjermstørrelse.
        </Paragraph>
        <Paragraph>
          Når en tabell endres til kort eller liste på mobil, må sammenhengen mellom opplysningene bestå. Brukeren skal aldri
          være i tvil om hva en enkeltverdi beskriver, eller hvilke datafelt som tilhører samme oppføring. Sørg for at
          tilhørende ledetekster følger verdiene på en entydig måte.
        </Paragraph>
        <Example story="CasesKeyValueList" caption="Hver verdi har sin ledetekst. Ledeteksten er radoverskrift, så sammenhengen er tydelig også for skjermlesere og KI-agenter." />
      </section>

      <section id="visualiseringer" aria-labelledby="h-vis">
        <Heading id="h-vis" level={2} data-size="md">Visualiseringer</Heading>
        <Paragraph>
          På små skjermer er det sjelden plass til tradisjonelle visualiseringer. Her handler visualisering om kompakte
          visualiseringer som kan integreres rett i en tabellcelle eller et listeelement. På denne måten slipper brukeren å
          hoppe mellom en tabell med tall og en visualisering på en annen skjerm.
        </Paragraph>

        <Heading level={3} data-size="sm">Trendgraf (eng. «sparkline»)</Heading>
        <Paragraph>
          En trendgraf er en enkel datalinje som plasseres rett ved siden av et tall eller i en tabellkolonne. Den krever ikke
          mer plass enn bredden til noen få bokstaver, men viser likevel en hel serie med datapunkter. Ved å vise formen på
          utviklingen sammen med den nøyaktige nåtidsverdien unngår man «recency bias», tendensen til å overvurdere de aller
          siste målingene fordi man mangler referanser.
        </Paragraph>
        <MiniExample title="Svevestøv i dag" label="Eksempel: trendgraf i en liste"
          caption="Trendgrafen står ved siden av dagens verdi, så brukeren ser både tallet og utviklingen de siste 30 dagene.">
          <Paragraph data-size="sm" className="eyebrow">Siste 30 dager · µg/m³ i dag</Paragraph>
          <List.Unordered style={{ listStyle: "none", padding: 0 }}>
            {AIR.map(([sted, pts]) => (
              <List.Item key={sted} className="spark-row">
                <span>{sted}</span>
                <Spark points={pts} label={`Utvikling i ${sted}, fra ${pts[0] * 3} til ${pts.at(-1) * 3}`} />
                <strong>{pts.at(-1) * 3}</strong>
              </List.Item>
            ))}
          </List.Unordered>
        </MiniExample>

        <Heading level={3} data-size="sm">Piktogrammer og symboler</Heading>
        <Paragraph>
          Piktogrammer og symboler, som værikoner eller statusindikatorer, er effektive fordi de sparer tekstplass og kan
          tolkes i ett enkelt blikk. De fungerer best når de oppfører seg som typografiske tegn som er integrert med resten av
          innholdet, og er intuitivt forståelige for brukeren.
        </Paragraph>
        <MiniExample title="Oversikt" label="Eksempel: symboler i en oversikt"
          caption="Symbolene erstatter ord som «Sted», men nivået i farevarselet står fortsatt i tekst.">
          <Alert data-color="warning" data-size="sm">
            <Paragraph data-size="sm" style={{ display: "flex", gap: "var(--ds-size-2)", alignItems: "center" }}>
              <ExclamationmarkTriangleFillIcon aria-hidden /> <strong>Gult nivå:</strong> kraftig vind
            </Paragraph>
          </Alert>
          <div>
            {[["Kafé Lunden", 4, "Bergen"], ["Bakeriet", 5, "Tromsø"], ["Hjørnet", 3, "Oslo"]].map(([n, s, p]) => (
              <div key={n} className="sym-row">
                <Link href="#visualiseringer">{n}</Link>
                <Stars n={s} />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                  <LocationPinIcon aria-hidden /> {p}
                </span>
              </div>
            ))}
          </div>
        </MiniExample>
        <Open>
          Er farevarsel egentlig forenkling av strukturerte data? Er terningkast en god analogi, når terningen er tilfeldig?
          Sparer et stedsikon nok plass til at vi slipper å skrive «Sted»? Blir piktogrammenes betydning viktigere på små
          skjermer?
        </Open>

        <Heading level={3} data-size="sm">Små repetisjoner (eng. «small multiples»)</Heading>
        <Paragraph>
          Små repetisjoner er en serie små, identisk oppbygde miniatyrfigurer som gjentas etter hverandre med samme skala,
          format og akser. Den visuelle rammen er helt lik fra bilde til bilde. Det fungerer godt til sammenligning, siden
          hjernen slipper å tolke designet på nytt og kan fokusere på endringene i selve dataene. Mens tradisjonelle tabeller
          organiserer data i rader og kolonner, er små repetisjoner visuelt sammenlignbare enheter innenfor samme synsfelt.
        </Paragraph>
        <MiniExample title="Temperatur per by" label="Eksempel: små repetisjoner"
          caption="Seks byer med samme skala, fra −10 til 20 °C. Det er formen på kurvene brukeren sammenligner.">
          <Paragraph data-size="sm" className="eyebrow">Gjennomsnitt per måned, januar–oktober</Paragraph>
          <div className="multiples">
            {TEMP.map(([by, pts]) => (
              <Card key={by} data-size="sm" aria-label={`${by}: fra ${pts[0]} til ${Math.max(...pts)} grader`}>
                <Paragraph data-size="sm"><strong>{by}</strong></Paragraph>
                <Multiple points={pts} />
              </Card>
            ))}
          </div>
        </MiniExample>
        <Open>Finnes det et godt norsk uttrykk for «small multiples»?</Open>
      </section>

      <section id="scenarioer" aria-labelledby="h-scen">
        <Heading id="h-scen" level={2} data-size="md">Brukerscenarioer</Heading>
        <Paragraph>
          Tabeller har en rekke utfordringer på små skjermer. Ved å gå inn i det aktuelle scenarioet vil du oppdage at det
          antakelig finnes gode alternativer til tabell. Det er alltid mulig å presentere dataene på en forenklet måte, og
          tilby brukeren å se dem i en full tabell etterpå.
        </Paragraph>
        <Open>Hvordan skal lenken til full tabell se ut?</Open>

        {[
          {
            id: "1", story: "Inbox",
            caption: "Innboksen: hver melding er et kort med avsender, dato og emne. Søk og filtre hjelper brukeren å finne én melding.",
          },
          {
            id: "3", story: "CompareWithPicker",
            caption: "Tabellen er snudd: egenskapene går nedover, og brukeren velger hvilke to klasser som står side om side.",
          },
          {
            id: "2", story: "TableHorizontalScroll",
            caption: "Tabellen beholdes og ruller sideveis. Designsystemet har ennå ikke fast førstekolonne eller rulleindikator.",
          },
        ].map(({ id, story, caption }) => {
          const g = groups.find((x) => x.id === id);
          return (
            <div className="scen" key={id}>
              <Heading level={3} data-size="sm">{g.title.replace(/^Scenario \d: /, "")}</Heading>
              <Heading level={4} data-size="2xs">Kontekst og behov</Heading>
              <Paragraph>{g.need}</Paragraph>
              <Heading level={4} data-size="2xs">Eksempler</Heading>
              <Bullets items={g.examples} />
              <Heading level={4} data-size="2xs">Anbefalinger</Heading>
              <Bullets items={g.recommendations} />
              <Example story={story} caption={caption} />
            </div>
          );
        })}

        <Heading level={3} data-size="sm">Generelle tips</Heading>
        <Bullets items={[
          "Skal brukeren finne høyeste eller laveste verdi, tilby sortering.",
          "Skal brukeren finne objekter som oppfyller bestemte kriterier, tilby filtrering.",
        ]} />
        <Example story="CasesSearchableCards" caption="Søk, statusfilter og sortering virker likt i tabellen og kortene, og antall treff leses opp når listen endres." />
      </section>

      <section id="sprak" aria-labelledby="h-sprak">
        <Heading id="h-sprak" level={2} data-size="md">Språk</Heading>
        <div className="cols">
          <div>
            <Heading level={3} data-size="xs">Forkortelser</Heading>
            <Paragraph>
              Plassmangel på små skjermer gjør det fristende å forkorte ord og ledetekster. Unngå unødvendige eller ukjente
              forkortelser som svekker lesbarheten.
            </Paragraph>
            <Bullets items={[
              <><strong>Bruk kun allment kjente forkortelser.</strong> Begrens bruken til etablerte standarder som org.nr., tlf. og kr.</>,
              <><strong>Unngå interne fagbegreper.</strong> Saksbehandlerbegreper eller fagsjargong, som s-beh. eller jfr., bør ikke brukes.</>,
              <><strong>Forenkle fremfor å forkorte.</strong> Velg kortere synonymer der det er mulig, for eksempel «Dato» i stedet for «Reg.dato».</>,
              "Trenger du likevel en ukjent forkortelse, forklar den med en hjelpetekst eller en stjerne og forklaring under tabellen.",
            ]} />
          </div>
          <div>
            <Heading level={3} data-size="xs">Avkorting av tekst (trunkering)</Heading>
            <Paragraph>
              Avkorting betyr å erstatte deler av teksten med en ellipse (…) for å spare plass. Det skjuler innhold og bør
              regnes som en nødløsning. Vurder heller linjebryting.
            </Paragraph>
            <Paragraph>
              Avkorter du, må brukeren kunne lese hele teksten ved en bevisst handling. Skjermlesere må alltid få hele teksten.
              Som hovedregel avkorter du i slutten, men det finnes unntak:
            </Paragraph>
            <Table border data-size="sm">
              <Table.Head>
                <Table.Row><Table.HeaderCell>Når</Table.HeaderCell><Table.HeaderCell>Eksempel</Table.HeaderCell></Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row><Table.HeaderCell scope="row">Hovedregel: i slutten</Table.HeaderCell><Table.Cell><code>Søknad om tilskudd til ombygging av…</code></Table.Cell></Table.Row>
                <Table.Row><Table.HeaderCell scope="row">Like oppføringer: i midten</Table.HeaderCell><Table.Cell><code>Vedtak i sak 24/1832 … Storgata 12</code></Table.Cell></Table.Row>
                <Table.Row><Table.HeaderCell scope="row">Filnavn: i midten, så filtypen vises</Table.HeaderCell><Table.Cell><code>vedtak_2026_…_endelig.pdf</code></Table.Cell></Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </section>

      <section id="kode" aria-labelledby="h-kode">
        <Heading id="h-kode" level={2} data-size="md">Kode</Heading>
        <Table border data-size="sm" style={{ maxWidth: "44rem" }}>
          <Table.Head>
            <Table.Row><Table.HeaderCell>Struktur</Table.HeaderCell><Table.HeaderCell>Husk</Table.HeaderCell></Table.Row>
          </Table.Head>
          <Table.Body>
            {[
              [<>Tabell (<code>table</code>)</>, "Følg spesifikasjonen. Vær obs hvis det blir mange tomme celler."],
              [<>Beskrivelsesliste (<code>dl</code>)</>, "Følg spesifikasjonen, men vær obs på en svakhet i den."],
              [<>Lister (<code>ol</code>, <code>ul</code>)</>, "Følg spesifikasjonen."],
              ["Sortering", "Rekkefølgen i innholdet endres. Husk å gi informasjon om endringen."],
              ["Filtrering", "Det som vises, endres. Husk å gi informasjon om endringen."],
            ].map(([a, b], i) => (
              <Table.Row key={i}><Table.HeaderCell scope="row">{a}</Table.HeaderCell><Table.Cell>{b}</Table.Cell></Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Open>
          Temaer som bør omtales: horisontal scrolling i tabell og fast kolonne, hva som skjer teknisk når presentasjonen endres
          mellom tabell og liste, og trendgrafer og piler opp og ned. Lenk til komponentdokumentasjonen i stedet for å
          duplisere den, og lenk til Uutilsynet der det er relevant.
        </Open>
      </section>

      <section id="kilder" aria-labelledby="h-kilder">
        <Heading id="h-kilder" level={2} data-size="xs">Kilder og annen relevant informasjon</Heading>
        <Bullets items={[
          "Uutilsynet: Tabeller",
          "WCAG 1.3.1 Informasjon og relasjoner (nivå A), Uutilsynet",
          "Veiledning og løsningsforslag til 1.3.1, Uutilsynet",
        ]} />
      </section>
    </main>
  );
}
