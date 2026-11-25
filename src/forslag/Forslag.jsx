import { useEffect, useState } from "react";
import { PencilLineIcon } from "@navikt/aksel-icons";
import {
  Button,
  Card,
  Divider,
  Heading,
  Link,
  List,
  Paragraph,
  Table,
} from "@digdir/designsystemet-react";
import HifiNav from "../components/HifiNav.jsx";
import { CASES, byNewest, Example, Small } from "../components/cases.jsx";
import { extract, cssBetween } from "../components/CodeExample.jsx";
import { SearchableCases, DetailsList, Mapping } from "../liste/Liste.jsx";
import { Costs } from "../kort/Kort.jsx";
import { StatTable, SmallScreen, Intro as ElbilIntro, rows as elbilRows } from "../tabell/Tabell.jsx";
import { CompareStudies, CompareSideBySide, AirQuality, BulkCases, UnknownTask } from "./eksempler.jsx";
import listeSrc from "../liste/Liste.jsx?raw";
import listeCss from "../liste/liste.css?raw";
import kortSrc from "../kort/Kort.jsx?raw";
import kortCss from "../kort/kort.css?raw";
import tabellSrc from "../tabell/Tabell.jsx?raw";
import tabellCss from "../tabell/tabell.css?raw";
import eksSrc from "./eksempler.jsx?raw";
import eksCss from "./forslag.css?raw";

/* Forslag til hele artikkelen «Strukturert informasjon». Oppsettet følger
   mønsterartiklene på designsystemet.no: tittel, ingress, samarbeidspartnere og
   dato øverst, innholdsfortegnelse ved siden av, situasjoner med eksempler,
   språk, oppsummering, kilder og bidragsytere til slutt. Alt er utkast. */

const PARTNERS = ["Digdir", "Nav", "Oslo kommune", "Skatteetaten", "Politiet", "Brønnøysundregistrene", "Entur"];
const DISCUSSION = "https://github.com/digdir/designsystemet/discussions/3703";

const SECTIONS = [
  ["definisjon", "Definisjon"],
  ["forberedelser", "Forberedelser"],
  ["design", "Design og opplevelse"],
  ["visualiseringer", "Visualiseringer"],
  ["brukeroppgaver", "Brukeroppgaver"],
  ["komponenter", "Komponenter"],
  ["sprak", "Språk"],
  ["kode", "Kode"],
  ["kilder", "Kilder og annen relevant informasjon"],
  ["avklaring", "Til avklaring i arbeidsgruppen"],
];

const sorted = [...CASES].sort(byNewest);

/* Når siden sist ble bygd og lagt ut, i norsk tid, for eksempel «25. november 2026 kl. 14.50» */
const UPDATED = (() => {
  const d = new Date(__BUILD_TIME__);
  const opts = { timeZone: "Europe/Oslo" };
  const date = d.toLocaleDateString("nb-NO", { ...opts, day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("nb-NO", { ...opts, hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  return `${date} kl. ${time}`;
})();

/** Komponentnavn som lenke til dokumentasjonen, slik mønsterartiklene gjør */
const C = ({ slug, children }) => (
  <Link href={`https://designsystemet.no/no/components/docs/${slug}/overview`}><code>{children}</code></Link>
);

const Bullets = ({ items }) => (
  <List.Unordered>{items.map((t, i) => <List.Item key={i}>{t}</List.Item>)}</List.Unordered>
);

/** «Bruk» og «Unngå», med skillelinje, som i språkdelen til representasjonsmønsteret */
const UseAvoid = ({ use, avoid, children }) => (
  <>
    <Divider />
    <Paragraph>
      <strong>Bruk: {use}</strong>
      {avoid && <><br />Unngå: {avoid}</>}
    </Paragraph>
    {children}
  </>
);

/* Rammen rundt artikkelen etterligner designsystemet.no, så det er lett å se hvordan
   artikkelen vil se ut der. Lenkene går til de ekte sidene. */
const SITE = "https://designsystemet.no/no";
const SITE_NAV = [["Intro", "intro"], ["Kom i gang", "fundamentals"], ["Komponenter", "components"], ["Mønstre", "patterns"], ["God praksis", "best-practices"], ["Blogg", "blog"]];
const PATTERNS = [
  ["Grunnleggende mønstre", [["Plassering av knapper", "button-placement-and-order"], ["Obligatoriske felt", "required-and-optional-fields"], ["Merking av lenker", "external-links"], ["Feilmeldinger", "errors"], ["Systemvarsler", "systemnotifications"], ["Representasjon", "representation"]]],
  ["Spør brukerne om …", [["Dato og klokkeslett", "date-and-time"], ["Samtykke til å lagre informasjon", "consent-banner"]]],
  ["Kommende mønstre", [["Språkvalg", "language-choice"], ["Strukturert informasjon", "structured-data"]]],
];

function SiteHeader() {
  return (
    <header className="ds-site-header">
      <Link href={SITE} className="ds-site-header__name">Designsystemet</Link>
      <nav aria-label="Hovedmeny">
        <ul>
          {SITE_NAV.map(([label, path]) => (
            <li key={path}>
              <Link href={`${SITE}/${path}`} aria-current={path === "patterns" ? "page" : undefined}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function PatternMenu() {
  return (
    <nav className="pattern-menu" aria-label="Mønstre">
      {PATTERNS.map(([group, items]) => (
        <div key={group}>
          <Paragraph data-size="sm" className="pattern-menu__group">{group}</Paragraph>
          <ul>
            {items.map(([label, slug]) => (
              <li key={slug}>
                {slug === "structured-data"
                  ? <a href="#" aria-current="page">{label}</a>
                  : <a href={`${SITE}/patterns/${slug}`}>{label}</a>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Innholdsfortegnelse som markerer delen brukeren leser */
function Toc() {
  const [active, setActive] = useState("");
  useEffect(() => {
    // Den aktive delen er den siste overskriften som er passert øverste del av vinduet
    const update = () => {
      const passed = SECTIONS.filter(([id]) => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top < window.innerHeight * 0.4;
      });
      setActive(passed.length ? passed[passed.length - 1][0] : "");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <aside className="article-toc" aria-labelledby="toc-title">
      <Heading level={2} data-size="2xs" id="toc-title">På denne siden</Heading>
      <ol>
        {SECTIONS.map(([id, title]) => (
          <li key={id}>
            <Link href={`#${id}`} aria-current={active === id ? "location" : undefined}>{title}</Link>
          </li>
        ))}
      </ol>
      <div className="article-toc__feedback">
        <Paragraph data-size="sm">Har du innspill til denne siden?</Paragraph>
        <Button data-color="neutral" data-size="sm" variant="secondary" asChild>
          <a href={DISCUSSION}><PencilLineIcon aria-hidden /> Send innspill på GitHub</a>
        </Button>
      </div>
    </aside>
  );
}

export default function Forslag() {
  return (
    <div className="forslag">
      <div className="forslag__proto"><HifiNav current="Forslag til artikkel" /></div>
      <SiteHeader />

      <div className="site-body">
        <PatternMenu />

      <main className="forslag-article">
      <header className="article-header">
        <Heading data-size="xs" asChild><p className="article-header__eyebrow">Mønstre</p></Heading>
        <Heading level={1} data-size="lg">Strukturerte data på små skjermer</Heading>
        <Paragraph data-size="lg">
          Strukturerte data kan være krevende å presentere på små skjermer, særlig når datamengden og kompleksiteten
          øker. Dette mønsteret hjelper deg å finne frem til gode løsninger, med fokus på formål, brukerbehov og
          tilgjengelighet.
        </Paragraph>
        <Paragraph data-size="sm" className="article-header__meta">
          {PARTNERS.join(", ")} · Oppdatert <time dateTime={__BUILD_TIME__}>{UPDATED}</time>
        </Paragraph>
      </header>

        <Toc />

        <div className="article-content">
          <Card data-color="warning" variant="tinted">
            <Paragraph variant="long">
              Dette er arbeidsgruppens forslag til hele artikkelen. Teksten og eksemplene er utkast og har ikke gått
              gjennom den samme samarbeidsprosessen som de ferdige mønstrene. Spørsmål gruppen ikke har landet, står
              samlet under <Link href="#avklaring">Til avklaring i arbeidsgruppen</Link>.
            </Paragraph>
          </Card>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="definisjon">Definisjon</Heading>
          <Paragraph variant="long">
            Strukturerte data er informasjon som følger et definert oppsett, som rader og kolonner. Ifølge{" "}
            <Link href="https://data.norge.no">Felles datakatalog</Link> er det data der informasjonselementer og
            relasjoner mellom dem er definert.
          </Paragraph>
          <Paragraph variant="long">
            Til presentasjon av strukturerte data brukes blant annet tabeller og lister, men også andre organiserte
            visninger. Eksempler på strukturerte data er saker med saksnummer, dato og status, målinger fra flere steder
            og tidspunkter, og studietilbud med opptakskrav og poenggrense.
          </Paragraph>
          <Heading level={3} data-size="sm">Begreper vi bruker</Heading>
          <Bullets items={[
            <><strong>Data:</strong> i dette mønsteret er data oppføringer med én eller flere egenskaper.</>,
            <><strong>Oppføring:</strong> én sak, én måling, ett studietilbud. I en tabell er det en rad.</>,
            <><strong>Egenskap:</strong> det alle oppføringene har, som status eller dato. I en tabell er det en kolonne.</>,
          ]} />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="forberedelser">Forberedelser</Heading>
          <Paragraph variant="long">
            Alle designsystemer har flere komponenter laget for å strukturere data. De vanligste er tabell, liste, grid
            og kort. Utfordringen er at komponentene har overlappende egenskaper, så det er ikke rett frem å velge
            hvilken som passer best til et formål. Avklar derfor først hvilke brukeroppgaver som skal løses, og hvordan
            dataene ser ut.
          </Paragraph>
          <Paragraph variant="long">Start med å kartlegge brukerens oppgaver og behov:</Paragraph>
          <Bullets items={[
            "Skal brukeren bare lese eller finne informasjon?",
            "Skal brukeren sammenligne informasjon?",
            "Skal brukeren bearbeide innholdet, altså endre, velge, flytte, slette eller legge til?",
            "Hvilken informasjon er den mest sentrale, altså selve oppføringen?",
            "Hvilke egenskaper er viktigst?",
            "Hvilke opplysninger må være synlige samtidig?",
            "Trenger brukeren søk, filtrering eller sortering?",
            "Må alle opplysningene vises i samme visning?",
          ]} />
          <Paragraph variant="long">Kartlegg deretter dataene som skal presenteres:</Paragraph>
          <Bullets items={[
            "mengde",
            "egenskaper",
            "interaksjon",
            "vekting og prioritering",
            "avsenders formål",
            "ønsket effekt",
          ]} />
          <Paragraph variant="long">
            Det beste er å tilpasse visningen til det brukeren først og fremst bruker den til.
          </Paragraph>

          <Heading level={3} data-size="sm">Når du ikke vet hva som er brukerens viktigste oppgave</Heading>
          <Paragraph variant="long">
            Noen ganger bruker brukerne visningen til mye forskjellig. Det gjelder særlig store datamengder, der det er
            vanskelig å gjøre et godt utvalg av innhold uten brukerens input. Et eksempel er værdata fordelt på dager:
            Vi har dataene, men det er vanskelig å vite hva brukeren skal bruke dem til.
          </Paragraph>
          <Bullets items={[
            "Vurder å lage to ulike visninger som møter hvert sitt viktigste behov.",
            "Spør hva brukeren er mest interessert i før visningen kommer, for eksempel når brukeren tar i bruk tjenesten.",
            "Gjør en antakelse: vis et utvalg av dataene, og la brukeren skru på mer.",
            <>Vurder å bruke liste eller kort, eller bruk <C slug="table">Table</C> hvis det er den mest hensiktsmessige presentasjonen.</>,
          ]} />

          <Heading level={3} data-size="sm">Når virksomheten vil dele data uten å vite hva de skal brukes til</Heading>
          <Paragraph variant="long">
            Det kan for eksempel være rådata, der virksomheten ikke vil bruke lang tid på å finne ut hva brukerne skal
            gjøre.
          </Paragraph>
          <Bullets items={[
            "Siden brukeren kan ønske å bruke dataene til mye ulikt, bør du tilby løsninger for det meste: søk, filtrering, sortering, valg av kolonner og nedlasting av dataene.",
            "Lag noen forslag til visninger som er tilpasset det dataene kan brukes til, og tilby en knapp for å se alle dataene eller laste dem ned. Tydelige spørsmål er enklere å vise på liten skjerm enn rådata. For eksempel: «Se utviklingen i drivstoffprisene i Troms så langt i 2026».",
            "Å vise dataene helt rått er ikke tilpasset liten skjerm, og gir som regel sideveis rulling.",
            "Vurder om dataene i det hele tatt skal vises for brukeren, eller bare deles som nedlasting.",
          ]} />
          <Example
            id="ukjent"
            smallLabel="Ferdige visninger og alle data, liten skjerm"
            large={<UnknownTask />}
            caption="Tre visninger svarer på hvert sitt spørsmål: hvor er det billigst nå, hvordan har prisene utviklet seg, og alle data. Når det er god plass, står visningene side om side. På liten skjerm blir de faner (Tabs). «Alle data» er en tabell som ruller sideveis med fast første kolonne, og alle data kan lastes ned."
            render={() => <UnknownTask />}
            code={[
              { label: "Visninger", code: extract(eksSrc, "UnknownTask", "useWide", "MiniChart", "downloadCsv") },
              { label: "CSS", code: cssBetween(eksCss, "Småbilder") },
            ]}
          />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="design">Design og opplevelse</Heading>
          <Paragraph variant="long">
            Når strukturerte data skal tilpasses små skjermer, handler designjobben om å bevare sammenhengen i dataene,
            sikre god lesbarhet og gi store nok trykkflater.
          </Paragraph>
          <Paragraph variant="long">
            Vurder hvilke opplysninger brukeren må se med en gang for å løse oppgaven sin, og hvilke som kan legges bak
            en sekundær handling, for eksempel i en ekspanderbar visning. Gjør den viktigste informasjonen tydelig med
            plassering og utforming.
          </Paragraph>
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
          <Paragraph variant="long">
            Pass på at det er nok avstand mellom elementene, så innholdet blir lesbart selv om skjermen er liten.
          </Paragraph>
          <Paragraph variant="long">
            Når en tabell blir til kort eller liste på mobil, må sammenhengen mellom opplysningene bestå. Brukeren skal
            aldri være i tvil om hva en verdi beskriver, eller hvilke opplysninger som hører til samme oppføring. Sørg
            for at ledetekstene følger verdiene sine på en entydig måte.
          </Paragraph>
          <Mapping />
          <Heading level={3} data-size="sm">Hjelp brukeren å finne frem</Heading>
          <Bullets items={[
            <><strong>Søk</strong> når listen er lang og brukeren leter etter noe bestemt. Bruk <C slug="search">Search</C>.</>,
            <><strong>Filtrering</strong> når det er få, kjente kategorier, for eksempel status. Bruk <C slug="chip">Chip</C> i en <C slug="fieldset">Fieldset</C>.</>,
            <><strong>Sortering</strong> når rekkefølgen hjelper oppgaven, for eksempel for å finne høyeste eller laveste verdi.</>,
            <><strong>Gruppering</strong> når oppføringene har en naturlig inndeling. Gi hver gruppe en overskrift.</>,
            <><strong>Paginering</strong> når listen blir tung å bla i. Bruk <C slug="pagination">Pagination</C>.</>,
          ]} />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="visualiseringer">Visualiseringer</Heading>
          <Paragraph variant="long">
            På små skjermer er det sjelden plass til tradisjonelle visualiseringer. Her handler visualisering om
            kompakte figurer som kan stå rett i en tabellcelle eller et listeelement. Da slipper brukeren å hoppe
            mellom en tabell med tall og en visualisering på en annen skjerm.
          </Paragraph>
          <Heading level={3} data-size="sm">Trendgraf</Heading>
          <Paragraph variant="long">
            En trendgraf (på engelsk «sparkline») er en enkel datalinje som står rett ved siden av et tall eller i en
            tabellkolonne. Den tar ikke mer plass enn noen få bokstaver, men viser likevel en hel serie med datapunkter.
            Når formen på utviklingen vises sammen med den nøyaktige verdien i dag, unngår brukeren å legge for mye vekt
            på de siste målingene. Si også utviklingen med ord. Se eksempelet under{" "}
            <Link href="#oppgave-avvik">Oppdage mønstre og avvik</Link>.
          </Paragraph>
          <Heading level={3} data-size="sm">Piktogrammer og symboler</Heading>
          <Paragraph variant="long">
            Piktogrammer og symboler, som værikoner eller statusindikatorer, sparer plass og kan tolkes med ett blikk.
            De fungerer best når de oppfører seg som tegn i teksten og er lette å forstå. Eksempler er farevarsler og
            «5 av 5 stjerner». Symboler skal alltid ha tekst, for eksempel en merkelapp eller et skjult navn.
          </Paragraph>
          <Heading level={3} data-size="sm">Små repetisjoner</Heading>
          <Paragraph variant="long">
            Små repetisjoner (på engelsk «small multiples») er en serie små, like figurer med samme skala, format og
            akser. Rammen er lik fra figur til figur, så brukeren slipper å tolke designet på nytt og kan se bare på
            endringene i dataene. Det gjør dem gode til sammenligning. Se «Utvikling» i eksempelet under{" "}
            <Link href="#forberedelser">Forberedelser</Link>.
          </Paragraph>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="brukeroppgaver">Brukeroppgaver</Heading>
          <Paragraph variant="long">
            Brukeroppgavene her er valgt for å vise situasjoner der du må ta stilling til om det er best å bruke liste
            eller tabell. Generelt brukes tabell når brukeren trenger å skanne, sammenligne eller få oversikt over
            informasjonen. Likevel kan en liste ofte presentere informasjonen i en enklere struktur, og en tabell kan
            bli til en liste på små skjermer.
          </Paragraph>
          <Paragraph variant="long">
            Tabeller har en rekke utfordringer på små skjermer. Ved å se på hva brukeren skal gjøre, vil du ofte finne
            gode alternativer. Du kan alltid presentere dataene enklere og gi brukeren mulighet til å se hele tabellen
            etterpå. Vurder hvor sammensatte dataene er, og hvor mye av dem brukeren trenger å se.
          </Paragraph>

          <Heading level={3} data-size="sm" id="oppgave-finne">1. Finne en oppføring</Heading>
          <Paragraph variant="long">
            Brukeren skal finne én eller noen få oppføringer, ikke sammenligne dem. Eksempler er en innboks, en
            oversikt over søknader eller nyheter.
          </Paragraph>
          <Paragraph variant="long">
            <strong>Anbefaling:</strong> Bruk en variant av liste eller kort. Her er det ekstra relevant å tilby
            søk.
          </Paragraph>
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

          <Heading level={3} data-size="sm" id="oppgave-fa">2. Sammenligne et mindre utvalg</Heading>
          <Paragraph variant="long">
            Brukeren står overfor et valg mellom noen få alternativer. Eksempler er studietilbud, værmelding for
            forskjellige tidspunkter eller steder, og avtaler der sum, varighet og vilkår varierer. Dette passer ikke
            når det bare er én egenskap brukeren reelt sett vurderer.
          </Paragraph>
          <Paragraph variant="long"><strong>Anbefalinger:</strong></Paragraph>
          <Bullets items={[
            <>Bruk <C slug="table">Table</C>.</>,
            "På liten skjerm: list egenskapene nedover i rader, og 2–3 alternativer i kolonner til høyre.",
            "Finnes det flere alternativer, la brukeren velge hvilke som skal sammenlignes.",
            "Fremhev egenskapene som skiller alternativene.",
          ]} />
          <Example
            id="fa"
            smallLabel="Snudd tabell med to valgte studier, liten skjerm"
            large={<CompareStudies large />}
            caption="På stor skjerm står hver studie på sin rad. På liten skjerm er tabellen snudd: egenskapene går nedover, og brukeren velger to studier med nedtrekkslistene over kolonnene. Bryteren skjuler egenskapene som er like, så forskjellene kommer frem."
            render={() => <CompareStudies />}
            code={[
              { label: "Tabell", code: extract(eksSrc, "CompareStudies", "differing") },
              { label: "CSS", code: cssBetween(eksCss, "Snudd tabell", "Trendgraf") },
            ]}
          />
          <Paragraph variant="long">
            Studiene velges med <C slug="select">Select</C> fordi det er sju å velge mellom. Er det færre enn sju
            alternativer, bruk heller <C slug="chip">Chip</C>.
          </Paragraph>
          <Paragraph variant="long">
            Mange produktsider viser i stedet alternativene side om side, med egenskapene i grupper og ledeteksten
            under hver verdi. Det gir mer plass til hver verdi, og hver kolonne kan leses for seg. Er det mange
            egenskaper, hjelper det at navnene på alternativene står fast øverst når brukeren ruller.
          </Paragraph>
          <Example
            id="fa-side"
            smallLabel="To studier side om side i grupper, liten skjerm"
            large={<CompareSideBySide large />}
            caption="Hver kolonne er én studie, valgt med en nedtrekksliste øverst. Egenskapene står i grupper med overskrift, og ledeteksten står under hver verdi. Når brukeren ruller forbi toppen, står navnene fast øverst. I koden er hver gruppe en tabell med rad- og kolonneoverskrifter, så skjermlesere får vite hvilken egenskap og studie hver verdi gjelder."
            render={() => <CompareSideBySide />}
            code={[
              { label: "Visning", code: extract(eksSrc, "CompareSideBySide") },
              { label: "CSS", code: cssBetween(eksCss, "Side om side", "Trendgraf") },
            ]}
          />

          <Heading level={3} data-size="sm" id="oppgave-mange">3. Sammenligne et større utvalg</Heading>
          <Paragraph variant="long">
            Brukeren må se data i sammenheng, i rader og kolonner. Behovet kan være å sammenligne, oppdage mønstre,
            finne avvik eller se historisk utvikling. Eksempler:
          </Paragraph>
          <Bullets items={[
            <><strong>Tidsserier og måledata:</strong> endringer i verdier over tid for flere enheter eller steder, for eksempel temperatur, luftkvalitet eller vannstand gjennom døgnet.</>,
            <><strong>Pris- og takstmatriser:</strong> tabeller der to faktorer bestemmer summen, for eksempel sone og tidspunkt, eller gebyrsatser etter størrelse og type.</>,
            <><strong>Statistiske oversikter:</strong> nøkkeltall fordelt på fylker, kommuner eller år.</>,
            "Opptakskrav for alle skoler som tilbyr studiespesialisering i Bergensområdet, eller prissammenligning.",
          ]} />
          <Paragraph variant="long">
            <strong>Anbefaling:</strong> Vurder om du kan bruke liste eller kort. Har oppføringene mange egenskaper,
            kan en tabell med flere kolonner være mer egnet. Da bør du
          </Paragraph>
          <Bullets items={[
            "beholde tabellstrukturen, og gjøre tabellen rullbar sideveis hvis det trengs",
            "låse første kolonne, så navnet på oppføringen alltid er synlig mens brukeren ruller resten sidelengs",
            "låse kolonneoverskriftene øverst hvis tabellen er lang",
            "vise tydelig at tabellen fortsetter og kan rulles",
          ]} />
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

          <Heading level={3} data-size="sm" id="oppgave-avvik">4. Oppdage mønstre og avvik</Heading>
          <Paragraph variant="long">
            Brukeren vil finne informasjon som samsvarer eller skiller seg ut på tvers av oppføringer og egenskaper.
            Brukeren leter etter én eller flere ting, men vet ikke hva. Det kan være måleverdier over en grense,
            utgifter som er høyere enn budsjett, eller saker som har ligget lenge.
          </Paragraph>
          <Bullets items={[
            "Helst bør systemet hjelpe brukeren å finne avviket, og si det i klartekst over visningen.",
            <>Må et menneske gjøre jobben, merk verdiene som skiller seg ut, for eksempel med <C slug="tag">Tag</C> når en verdi bryter en grense. Bruk tekst, ikke bare farge.</>,
            "Vis verdiene som skal sammenlignes, nær hverandre.",
            "Vis utviklingen ved siden av verdien, for eksempel med en trendgraf.",
          ]} />
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
          <Paragraph variant="long">
            Designsystemet har ingen komponent for trendgrafer. Trendgrafen i eksempelet er laget for prototypen.
          </Paragraph>

          <Heading level={3} data-size="sm" id="oppgave-endre">5. Bearbeide oppføringer</Heading>
          <Paragraph variant="long">
            Brukeren skal redigere, fjerne eller legge til oppføringer, én om gangen eller flere samtidig. Et eksempel
            er å endre status på flere saker samtidig.
          </Paragraph>
          <Bullets items={[
            <>Én om gangen: bruk <C slug="card">Card</C> med handlingene nederst i kortet.</>,
            <>Flere samtidig: la brukeren merke flere oppføringer med <C slug="checkbox">Checkbox</C> i en kort skjemaflyt. Designsystemet har ingen data grid.</>,
            "Ikke deaktiver knapper. Si i stedet hva brukeren må gjøre.",
          ]} />
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

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="komponenter">Komponenter</Heading>
          <Paragraph variant="long">
            Det er hovedsakelig tre visningsformer som brukes til dette formålet: tabell, liste og kort. Ofte kan alle
            tre presentere de samme dataene. Forskjellen ligger i hva brukeren skal gjøre. Tabeller egner seg best for
            sammenligning, lister for rask oversikt over mange oppføringer, og kort når hver oppføring trenger mer
            plass, kontekst eller flere handlinger.
          </Paragraph>

          <Heading level={3} data-size="sm">Tabell kan være greit når …</Heading>
          <Bullets items={[
            "formålet først og fremst er å sammenligne verdier på tvers av oppføringene",
            "sammenhengen mellom ledetekst og innhold er viktig for å forstå informasjonen",
            "hver rad er samme type innhold, så det gir mening å sammenligne radene",
            "det er få nok kolonner til at tabellen får plass uten sideveis rulling eller dårligere lesbarhet",
            "innholdet er kort nok til at det ikke gir mye linjebryting",
            "tabellen gir brukeren mer enn en liste eller kort ville gjort",
          ]} />
          <Paragraph variant="long"><strong>Vær oppmerksom på at</strong></Paragraph>
          <Bullets items={[
            "tabeller kan bli vanskelige å bruke på små skjermer når de har mange kolonner eller mye tekst",
            "sideveis rulling gjør det vanskeligere å sammenligne og orientere seg",
            "lange tekster i celler kan gi mye linjebryting og dårligere lesbarhet",
            "mange kolonner kan kreve at innholdet prioriteres eller presenteres på en annen måte",
            "liste eller kort kan være bedre hvis sammenligning ikke er en sentral oppgave",
          ]} />

          <Paragraph variant="long">
            Se flere eksempler på tabeller i prototypen <Link href="tabell.html">Tabell</Link>.
          </Paragraph>

          <Heading level={3} data-size="sm">Liste kan være greit når …</Heading>
          <Bullets items={[
            "brukeren skal se gjennom mange oppføringer",
            "hver oppføring er enkel og avgrenset, med få eller ingen ekstra egenskaper",
            "brukeren først og fremst skal lese, finne eller skanne informasjon",
            "hver oppføring kan forstås for seg",
            "innholdet har en naturlig rekkefølge, for eksempel kronologisk, alfabetisk eller etter prioritet",
            "brukeren ikke trenger å sammenligne mange egenskaper på tvers av oppføringene",
            "den viktigste informasjonen kan stå først i hver oppføring",
          ]} />
          <Paragraph variant="long"><strong>Vær oppmerksom på at</strong></Paragraph>
          <Bullets items={[
            "lister fungerer dårlig når brukeren skal sammenligne mange verdier mellom oppføringer",
            "lange lister kan bli krevende å skanne uten søk, filtrering eller gruppering",
            "sammenhenger mellom egenskaper kan bli mindre tydelige enn i en tabell",
          ]} />

          <Paragraph variant="long">
            Se flere eksempler på lister i prototypen <Link href="liste.html">Liste</Link>.
          </Paragraph>

          <Heading level={3} data-size="sm">Kort kan være greit når …</Heading>
          <Bullets items={[
            "hver oppføring har flere egenskaper som bør presenteres samlet",
            "brukeren først og fremst skal se på én oppføring om gangen",
            "informasjonen varierer i lengde eller innhold mellom oppføringene",
            "du vil fremheve enkelte opplysninger",
            "hver oppføring har handlinger, for eksempel rediger, slett eller åpne",
            "visuelle elementer som status, kategorier, ikoner eller bilder hjelper brukeren å forstå",
          ]} />
          <Paragraph variant="long"><strong>Vær oppmerksom på at</strong></Paragraph>
          <Bullets items={[
            "kort bruker mye mer plass enn lister og tabeller",
            "det ofte blir vanskeligere å sammenligne oppføringer",
            "mange kort etter hverandre kan gi mye rulling",
            "ulikt innhold i hvert kort kan gjøre informasjonen mindre oversiktlig",
          ]} />

          <Paragraph variant="long">
            Se flere eksempler på kort i prototypen <Link href="kort.html">Kort</Link>.
          </Paragraph>

          <Heading level={3} data-size="sm">Utforming av liste og kort</Heading>
          <Paragraph variant="long">
            Det er en glidende overgang fra enkle lister til komplekse kort, og de kan utformes på mange måter.
          </Paragraph>
          <Bullets items={[
            "Vurder om ledetekstene skal stå i hvert kort, eller som beskrivende kolonnetitler over kortene, slik Yr gjør.",
            "Oppføringen kan være klikkbar eller ikke. Tilpass det til behovet.",
            "Skjul sekundær informasjon.",
            "Lag et tydelig hierarki, så den viktigste informasjonen er lett å finne.",
            <>Bruk <C slug="details">Details</C> når innholdet er omfattende og ikke alle trenger å lese alt.</>,
          ]} />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="sprak">Språk</Heading>
          <Heading level={3} data-size="sm">Forkortelser</Heading>
          <Paragraph variant="long">
            Plassmangel på små skjermer gjør det fristende å forkorte ord og ledetekster. Unngå forkortelser som er
            unødvendige eller ukjente for brukeren, og som gjør teksten vanskeligere å lese.
          </Paragraph>
          <UseAvoid use="Allment kjente forkortelser, som org.nr., tlf. og kr." avoid="Interne fagbegreper og sjargong, som s-beh. og jfr.">
            <Paragraph variant="long">Begrens forkortelsene til etablerte standarder.</Paragraph>
          </UseAvoid>
          <UseAvoid use="Dato" avoid="Reg.dato">
            <Paragraph variant="long">Velg et kortere ord der det er mulig, i stedet for å forkorte.</Paragraph>
          </UseAvoid>
          <Divider />
          <Paragraph variant="long">
            Må du bruke en forkortelse som ikke er kjent, kan du merke den med en stjerne og forklare den under
            tabellen.
          </Paragraph>
          <Heading level={3} data-size="sm">Avkorting av tekst</Heading>
          <Paragraph variant="long">
            Avkorting betyr å erstatte deler av teksten med en ellipse (…) for å spare plass. Det skjuler innhold og
            bør være en nødløsning. La heller teksten bryte over flere linjer.
          </Paragraph>
          <Bullets items={[
            "Avkorter du, må brukeren kunne lese hele teksten med en bevisst handling. Skjermlesere skal alltid få hele teksten.",
            "Som hovedregel avkorter du i slutten.",
            "Avkort i midten når oppføringene gjentar seg og lett kan forveksles med hverandre.",
            "Avkort i midten når oppføringen er et filnavn, så filtypen synes.",
          ]} />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="kode">Kode</Heading>
          <Paragraph variant="long">
            Kod innholdet etter hva det er, ikke etter hvordan det ser ut. Utseendet skal ikke love mer struktur enn
            koden har. Vises kolonneoverskrifter, skal det være en tabell.
          </Paragraph>
          <Table data-size="sm" zebra className="article-table">
            <caption>Hvilket element passer til innholdet</caption>
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
          <Bullets items={[
            <><strong>Tabell:</strong> følg spesifikasjonen, og vær oppmerksom hvis det blir mange tomme celler.</>,
            <><strong>Beskrivelsesliste (<code>dl</code>):</strong> følg spesifikasjonen, men vær oppmerksom på at skjermlesere ikke alltid leser opp sammenhengen mellom etikett og verdi.</>,
            <><strong>Punktliste og nummerert liste (<code>ul</code>, <code>ol</code>):</strong> følg spesifikasjonen. Lister der kulepunktene er fjernet med CSS, trenger <code>role="list"</code> for å bli lest som liste i Safari.</>,
            <><strong>Sortering:</strong> rekkefølgen i innholdet endres. Gi beskjed om endringen med <code>role="status"</code>.</>,
            <><strong>Filtrering:</strong> det som vises, endres. Gi beskjed om endringen, for eksempel «Viser 3 av 8 saker».</>,
            <><strong>Sideveis rulling og fast kolonne:</strong> rulleflaten må kunne nås og rulles med tastatur. Se <C slug="table">Table</C>.</>,
            <><strong>Når tabellen blir en liste:</strong> vis ulik kode på stor og liten skjerm. Ikke gjør om en tabell med CSS, for <code>display: block</code> på tabellelementer fjerner tabellstrukturen for skjermlesere i flere nettlesere.</>,
          ]} />
          <Paragraph variant="long">
            Følg komponentdokumentasjonen for detaljene, og lenk dit i stedet for å gjenta den.
          </Paragraph>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="kilder">Kilder og annen relevant informasjon</Heading>
          <Bullets items={[
            <Link key="tab" href="https://www.uutilsynet.no/veiledning/tabeller/225">Tabeller (uutilsynet.no)</Link>,
            <Link key="131" href="https://www.uutilsynet.no/wcag-standarden/131-informasjon-og-relasjoner-niva/90">WCAG-standarden 1.3.1 Informasjon og relasjoner, nivå A (uutilsynet.no)</Link>,
            <Link key="131v" href="https://www.uutilsynet.no/veiledning/131-informasjon-og-relasjoner/1234">Veiledning og løsningsforslag til 1.3.1 (uutilsynet.no)</Link>,
            <Link key="fdk" href="https://data.norge.no">Felles datakatalog (data.norge.no)</Link>,
          ]} />

          <Card data-color="warning" variant="tinted">
            <Paragraph variant="long">
              <strong>Mer innsikt ønskes</strong>
              <br />
              Har du erfaringer, brukertesting eller andre funn om strukturerte data på små skjermer? Del dem gjerne i{" "}
              <Link href={DISCUSSION}>diskusjonstråden på github.com</Link>.
            </Paragraph>
          </Card>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="avklaring">Til avklaring i arbeidsgruppen</Heading>
          <Paragraph variant="long">Denne delen er bare med i forslaget og fjernes før artikkelen publiseres.</Paragraph>
          <Bullets items={[
            <>Hvilket ord skal vi bruke for det oppføringene har: detaljer, verdier, egenskaper eller attributter? Forslaget bruker «egenskaper». Se <Link href="#definisjon">Definisjon</Link>.</>,
            <>Skal Forberedelser flyttes under <Link href="#design">Design og opplevelse</Link>?</>,
            "Skal vi anbefale et chatgrensesnitt med forslag over visningen når vi ikke vet hva brukeren skal gjøre?",
            <>Hva skal vi kalle liste og kort? Utviklere bruker «liste» om mer, for eksempel en liste med kort. Alternativer er panel, flis eller innholdselement, eller å velge mellom bare liste og tabell. Se <Link href="#komponenter">Komponenter</Link>.</>,
            <>Er det riktig å anbefale tabell med sideveis rulling når oppføringene har mange egenskaper, eller bør vi først anbefale liste eller kort? Det må begrunnes ut fra WCAG 1.4.10. Se <Link href="#oppgave-mange">Sammenligne et større utvalg</Link>.</>,
            <>Hvilke eksempler skal vi bruke for å oppdage mønstre og avvik, og hvilken komponent anbefaler vi? Se <Link href="#oppgave-avvik">Oppdage mønstre og avvik</Link>.</>,
            <>Overlapper bearbeiding av én oppføring med å finne en oppføring, og passer bearbeiding inn i et mønster om strukturerte data? Se <Link href="#oppgave-endre">Bearbeide oppføringer</Link>.</>,
            "Skal komponenten grid eller data grid med? Designsystemet har ingen data grid i dag.",
            "Finnes det et bedre norsk ord for «small multiples» enn «små repetisjoner»?",
            "Hvilke piktogrammer er gode eksempler? Farevarsel, terningkast og stedsikon er nevnt.",
            "Skal vi ta med noe om stolpediagram og linjediagram når brukeren sammenligner et mindre utvalg?",
          ]} />

          <section className="contributors" aria-labelledby="bidragsytere">
            <Heading level={2} data-size="2xs" id="bidragsytere">Bidragsytere</Heading>
            <List.Unordered data-size="sm" className="contributors__list">
              {PARTNERS.map((p) => <List.Item key={p}>{p}</List.Item>)}
            </List.Unordered>
          </section>
        </div>
      </main>
      </div>
    </div>
  );
}
