import { useEffect, useState } from "react";
import { PencilLineIcon } from "@navikt/aksel-icons";
import {
  Button,
  Card,
  Details,
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
import { CompareStudies, AirQuality, BulkCases, UnknownTask } from "./eksempler.jsx";
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
  ["hva", "Hva er strukturert informasjon?"],
  ["forberedelser", "Forberedelser"],
  ["velg-visning", "Velg visning etter hva brukerne skal gjøre"],
  ["liten-skjerm", "Tilpass visningen til små skjermer"],
  ["visualiseringer", "Små visualiseringer"],
  ["sprak", "Språk"],
  ["kode", "Koding og tilgjengelighet"],
  ["oppsummering", "Oppsummering"],
  ["kilder", "Kilder og relevant informasjon"],
  ["avklaring", "Til avklaring i arbeidsgruppen"],
];

const sorted = [...CASES].sort(byNewest);

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
        <Heading level={1} data-size="lg">Strukturert informasjon</Heading>
        <Paragraph data-size="lg">
          Det skal være enkelt å lese og sammenligne strukturert informasjon, også på små skjermer. Mønsteret hjelper
          deg å velge mellom tabell, liste og kort, og å tilpasse visningen uten at sammenhengen i informasjonen går
          tapt.
        </Paragraph>
        <Paragraph data-size="sm" className="article-header__meta">
          {PARTNERS.join(", ")} · Oppdatert 24. november 2026
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

          <Paragraph variant="long">
            Mange offentlige løsninger bruker tabeller for å presentere strukturert informasjon. På store skjermer gir
            tabeller ofte god oversikt og gjør det enkelt å sammenligne. På små skjermer er plassen mer begrenset, og
            det samme oppsettet kan bli vanskelig å lese og bruke.
          </Paragraph>
          <Paragraph variant="long">Mønsteret er bygd opp etter tre spørsmål:</Paragraph>
          <List.Ordered>
            <List.Item><strong>Er det strukturert informasjon?</strong> Se <Link href="#hva">Hva er strukturert informasjon?</Link></List.Item>
            <List.Item><strong>Hva skal brukerne gjøre?</strong> Oppgaven avgjør om du velger tabell, liste eller kort. Se <Link href="#velg-visning">Velg visning etter hva brukerne skal gjøre</Link>.</List.Item>
            <List.Item><strong>Hva skjer på en liten skjerm?</strong> Behold tabellen, eller gjør den om til liste eller kort uten at sammenhengen går tapt. Se <Link href="#liten-skjerm">Tilpass visningen til små skjermer</Link>.</List.Item>
          </List.Ordered>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="hva">Hva er strukturert informasjon?</Heading>
          <Paragraph variant="long">
            Strukturert informasjon er en samling <strong>oppføringer</strong> av samme type, der hver oppføring har de
            samme <strong>egenskapene</strong>. Saker med saksnummer, dato og status er strukturert informasjon. Det er
            også målinger fra flere steder og tidspunkter, og studietilbud med opptakskrav og poenggrense.
          </Paragraph>
          <Paragraph variant="long">
            En enkel test er å spørre om informasjonen kunne stått i et regneark, med én rad per oppføring og én kolonne
            per egenskap. Da hører den til dette mønsteret. Er det bare én kolonne, er det en vanlig liste, og da
            gjelder retningslinjene for <C slug="list">List</C>.
          </Paragraph>
          <Heading level={3} data-size="sm">Begreper vi bruker</Heading>
          <Bullets items={[
            <><strong>Oppføring:</strong> én sak, én måling, ett studietilbud. I en tabell er det en rad.</>,
            <><strong>Egenskap:</strong> det alle oppføringene har, som status eller dato. I en tabell er det en kolonne.</>,
            <><strong>Verdi:</strong> egenskapen for én oppføring, som «Under behandling». I en tabell er det en celle.</>,
          ]} />
          <Heading level={3} data-size="sm">Dette er ikke med i mønsteret</Heading>
          <Bullets items={[
            <>Punktlister med tekst, som råd eller steg i en veiledning. Se <C slug="list">List</C>.</>,
            "Menyer og navigasjon.",
            "Skjemaer.",
            "Store grafer, som linjediagram og stolpediagram. De hører til et eget mønster for datavisualisering.",
          ]} />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="forberedelser">Forberedelser</Heading>
          <Heading level={3} data-size="sm">Finn ut hva brukerne skal gjøre</Heading>
          <Paragraph variant="long">Før du velger visning, må du vite hva brukerne skal bruke informasjonen til. Tenk over</Paragraph>
          <Bullets items={[
            "om brukerne skal finne, sammenligne, oppdage avvik eller endre noe",
            "hvilken egenskap brukerne kjenner igjen oppføringen på",
            "hvilke egenskaper som må være synlige samtidig, og hvilke som kan ligge bak en handling",
            "hvor mange oppføringer det er, og om brukerne trenger søk, filter eller sortering",
          ]} />
          <Heading level={3} data-size="sm">Utfordre dataene</Heading>
          <Paragraph variant="long">
            En database har ofte mange flere egenskaper enn brukerne trenger. Ikke vis alle kolonnene fordi de finnes.
            Velg egenskapene ut fra hva brukerne skal gjøre, og la resten ligge bak en handling. Mange tabeller som er
            vanskelige på mobil, er egentlig en utskrift av databasen som ingen har prioritert.
          </Paragraph>
          <Heading level={3} data-size="sm">Hvis du ikke vet hva brukerne skal gjøre</Heading>
          <Paragraph variant="long">
            Noen ganger brukes visningen til mye forskjellig, eller virksomheten vil dele data uten å vite hva de skal
            brukes til. Da kan du lage noen ferdige visninger for de vanligste spørsmålene, og gi tilgang til alle
            dataene og nedlasting for dem som trenger mer. Ferdige visninger er lettere å tilpasse små skjermer enn
            rådata.
          </Paragraph>
          <Example
            id="ukjent"
            smallLabel="Ferdige visninger og alle data, liten skjerm"
            large={<UnknownTask />}
            caption="Tre visninger svarer på hvert sitt spørsmål: hvor er det billigst nå, hvordan har prisene utviklet seg, og alle data. Visningene byttes med faner (Tabs). «Alle data» er en tabell som ruller sideveis med fast første kolonne, og alle data kan lastes ned."
            render={() => <UnknownTask />}
            code={[
              { label: "Visninger", code: extract(eksSrc, "UnknownTask", "MiniChart", "downloadCsv") },
              { label: "CSS", code: cssBetween(eksCss, "Småbilder") },
            ]}
          />
          <Paragraph variant="long">
            Visningene byttes med <C slug="tabs">Tabs</C>. Hver visning svarer på ett spørsmål, så den kan tilpasses
            små skjermer for seg.
          </Paragraph>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="velg-visning">Velg visning etter hva brukerne skal gjøre</Heading>
          <Paragraph variant="long">
            De samme dataene kan ofte vises som tabell, liste eller kort. Det er oppgaven brukerne skal løse, som
            avgjør hva som fungerer best.
          </Paragraph>

          <Heading level={3} data-size="sm" id="oppgave-finne">Når brukerne skal finne én oppføring</Heading>
          <Paragraph variant="long">
            Brukerne skal finne og kjenne igjen én eller noen få oppføringer, ikke sammenligne dem. Det kan for
            eksempel være en innboks, en oversikt over søknader eller nyheter.
          </Paragraph>
          <Bullets items={[
            <>Bruk en <C slug="list">List</C>. Velg <C slug="card">Card</C> hvis hver oppføring har handlinger.</>,
            "Sett det brukerne kjenner igjen oppføringen på, først og som lenke.",
            <>Gi <C slug="search">Search</C> når listen er lang, og filter med <C slug="chip">Chip</C> når det er få, kjente kategorier.</>,
          ]} />
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

          <Heading level={3} data-size="sm" id="oppgave-fa">Når brukerne skal sammenligne noen få alternativer</Heading>
          <Paragraph variant="long">
            Brukerne skal velge mellom noen få alternativer og sammenligne flere egenskaper, for eksempel studietilbud
            eller avtaler der pris, varighet og vilkår varierer. Dette passer ikke når brukerne bare vurderer én
            egenskap.
          </Paragraph>
          <Bullets items={[
            <>Bruk en <C slug="table">Table</C>, og snu den, så egenskapene går nedover og alternativene står i kolonner.</>,
            "Er det flere enn to eller tre alternativer, la brukerne velge hvilke som skal sammenlignes.",
            "Gjør det lett å se det som skiller alternativene.",
          ]} />
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
          <Paragraph variant="long">
            Alternativene velges med <C slug="chip">Chip</C>, og en <C slug="switch">Switch</C> skjuler egenskapene som
            er like for alle.
          </Paragraph>

          <Heading level={3} data-size="sm" id="oppgave-mange">Når brukerne skal sammenligne mange oppføringer</Heading>
          <Paragraph variant="long">
            Brukerne skal se mange oppføringer og egenskaper i sammenheng: sammenligne, finne høyeste og laveste verdi
            eller se utvikling over tid. Det kan være tidsserier, prismatriser eller nøkkeltall per kommune.
          </Paragraph>
          <Bullets items={[
            <>Behold <C slug="table">Table</C>, og la den rulle sideveis.</>,
            "Lås første kolonne, så navnet på oppføringen alltid er synlig.",
            "Lås overskriftsraden når tabellen er lang.",
            "Vis tydelig at tabellen fortsetter til siden.",
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

          <Heading level={3} data-size="sm" id="oppgave-detaljer">Når brukerne trenger detaljer bare av og til</Heading>
          <Paragraph variant="long">
            Brukerne trenger noen få egenskaper for å finne oppføringen, og resten bare av og til. Det kan være saker
            med mange felt, vedtak eller fakturaer.
          </Paragraph>
          <Bullets items={[
            "Vis det viktigste i listen, og legg resten bak en handling.",
            <>Bruk <C slug="details">Details</C> når detaljene er korte, og <C slug="dialog">Dialog</C> når de er mange.</>,
            "Ikke fjern informasjon. Legg den ett trykk unna.",
          ]} />
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

          <Heading level={3} data-size="sm" id="oppgave-avvik">Når brukerne skal oppdage mønstre og avvik</Heading>
          <Paragraph variant="long">
            Brukerne leter etter det som skiller seg ut, men vet ikke hva det er på forhånd. Det kan være måleverdier
            over en grense, utgifter som er høyere enn budsjett, eller saker som har ligget lenge.
          </Paragraph>
          <Bullets items={[
            "La løsningen finne avvikene når den kan, og si det i klartekst over visningen.",
            <>Merk avvik med tekst, for eksempel med <C slug="tag">Tag</C>, ikke bare med farge.</>,
            "Sorter så avvikene kommer først.",
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

          <Heading level={3} data-size="sm" id="oppgave-endre">Når brukerne skal endre oppføringer</Heading>
          <Paragraph variant="long">
            Brukerne skal endre, slette eller legge til oppføringer, én om gangen eller flere samtidig. Det kan være
            kostnader i en søknad, status på flere saker eller meldinger som skal arkiveres.
          </Paragraph>
          <Bullets items={[
            <>Én om gangen: bruk <C slug="card">Card</C> med handlingene nederst i kortet.</>,
            <>Flere samtidig: la brukerne krysse av med <C slug="checkbox">Checkbox</C> og velge én handling for alle de valgte.</>,
            <>Vis feil inne i kortet eller raden de gjelder, med <C slug="validation-message">ValidationMessage</C>.</>,
            "Ikke deaktiver knapper. Si i stedet hva brukerne må gjøre.",
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

          <Heading level={3} data-size="sm">Tabell, liste eller kort?</Heading>
          <Paragraph variant="long">
            Det er en glidende overgang fra enkle lister til kort med mye innhold. Mengden innhold per oppføring
            avgjør.
          </Paragraph>
          <Card data-color="neutral">
            {[
              ["Tabell", ["Brukerne sammenligner verdier på tvers av oppføringene.", "Hver rad er samme type innhold.", "Verdiene er korte."]],
              ["Liste", ["Brukerne finner eller skanner.", "Det er få egenskaper per oppføring.", "Oppføringen er en vei videre."]],
              ["Kort", ["Det er mange egenskaper, eller handlinger.", "Brukerne jobber med én oppføring om gangen.", "Innholdet varierer i lengde."]],
            ].map(([t, items]) => (
              <Details key={t}>
                <Details.Summary>{t} kan være et godt valg når …</Details.Summary>
                <Details.Content><Bullets items={items} /></Details.Content>
              </Details>
            ))}
          </Card>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="liten-skjerm">Tilpass visningen til små skjermer</Heading>
          <Paragraph variant="long">
            Når en tabell blir en liste eller kort, må sammenhengen bestå. Brukerne skal aldri være i tvil om hva en
            verdi beskriver, eller hvilke verdier som hører til samme oppføring.
          </Paragraph>
          <Heading level={3} data-size="sm">Gi hver oppføring fire faste plasser</Heading>
          <Mapping />
          <Heading level={3} data-size="sm">Hjelp brukerne å finne frem</Heading>
          <Bullets items={[
            <><strong>Søk</strong> når listen er lang og brukerne vet hva de leter etter. Bruk <C slug="search">Search</C>.</>,
            <><strong>Filter</strong> når det er få, kjente kategorier, for eksempel status. Bruk <C slug="chip">Chip</C> i en <C slug="fieldset">Fieldset</C>.</>,
            <><strong>Sortering</strong> når rekkefølgen hjelper oppgaven, for eksempel høyest først. Bruk <C slug="chip">Chip</C>, og <C slug="select">Select</C> fra sju valg.</>,
            <><strong>Gruppering</strong> når oppføringene har en naturlig inndeling. Gi hver gruppe en overskrift og en egen liste.</>,
            <><strong>Oppdeling i sider</strong> når listen blir tung å bla i. Bruk <C slug="pagination">Pagination</C>.</>,
            <><strong>Fast overskrift og kolonne</strong> når tabellen beholdes og ruller. Se <C slug="table">Table</C>.</>,
          ]} />
          <Paragraph variant="long">
            Endringer fra søk, filter og sortering skal meldes til skjermlesere, for eksempel «Viser 3 av 8 saker».
          </Paragraph>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="visualiseringer">Små visualiseringer</Heading>
          <Paragraph variant="long">
            På små skjermer er det sjelden plass til store grafer. Små visualiseringer kan stå rett i en celle eller en
            listeoppføring, så brukerne slipper å hoppe mellom tall og graf.
          </Paragraph>
          <Bullets items={[
            <><strong>Trendgraf:</strong> en linje ved siden av verdien som viser utviklingen. Si også utviklingen med ord. Se eksempelet under <Link href="#oppgave-avvik">Når brukerne skal oppdage mønstre og avvik</Link>.</>,
            <><strong>Symboler:</strong> sparer plass, men skal alltid ha tekst, for eksempel en merkelapp eller et skjult navn.</>,
            <><strong>Småbilder</strong> (small multiples): samme lille figur med samme skala for hver oppføring, så bare dataene endrer seg. Se «Utvikling» i eksempelet under <Link href="#forberedelser">Forberedelser</Link>.</>,
          ]} />
          <Paragraph variant="long">
            Store grafer hører til et eget mønster. Har du en graf, bør dataene også finnes som tabell, for
            skjermlesere, KI-agenter og alle som trenger de nøyaktige tallene.
          </Paragraph>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="sprak">Språk</Heading>
          <Paragraph variant="long">
            På små skjermer er det fristende å forkorte. Korte ord er bedre enn forkortelser, og brukerne skal forstå
            ordene uten å kjenne virksomheten.
          </Paragraph>
          <Heading level={3} data-size="sm">Bruk disse ordene</Heading>
          <UseAvoid use="Dato" avoid="Reg.dato">
            <Paragraph variant="long">Velg et kortere ord fremfor å forkorte.</Paragraph>
          </UseAvoid>
          <UseAvoid use="Allment kjente forkortelser, som org.nr., tlf. og kr." avoid="Interne forkortelser og saksbehandlerbegreper">
            <Paragraph variant="long">Brukerne kjenner ikke begrepene virksomheten bruker internt.</Paragraph>
          </UseAvoid>
          <Divider />
          <Heading level={3} data-size="sm">Avkorting av tekst</Heading>
          <Bullets items={[
            "La teksten bryte over flere linjer i stedet for å kutte den.",
            "Kutter du likevel, må hele teksten kunne leses, og skjermlesere skal alltid få hele teksten.",
            "Kutt i slutten. Kutt i midten når oppføringene ligner hverandre, eller når det er filnavn, så filtypen synes.",
          ]} />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="kode">Koding og tilgjengelighet</Heading>
          <Paragraph variant="long">
            Kod innholdet etter hva det er, ikke etter hvordan det ser ut. Velg element ut fra strukturen i innholdet,
            og style det etterpå. Utseendet skal ikke love mer struktur enn koden har. Vises kolonneoverskrifter, skal
            det være en tabell.
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
          <Heading level={3} data-size="sm">Når tabellen blir en liste</Heading>
          <Bullets items={[
            "Vis ulik kode på stor og liten skjerm: en tabell der det er en tabell, og en liste der det er en liste.",
            <>Ikke gjør om en tabell med CSS. <code>display: block</code> på tabellelementer fjerner tabellstrukturen for skjermlesere i flere nettlesere.</>,
            "Mål bredden på flaten tabellen står i, ikke bare vinduet.",
            <>En sortert liste er fortsatt en <code>ul</code>. Rekkefølgen endrer seg når brukerne sorterer på nytt.</>,
            <>Lister der kulepunktene er fjernet med CSS, trenger <code>role="list"</code> for å bli lest som liste i Safari.</>,
            <>Meld endringer fra søk, filter og sortering med <code>role="status"</code>.</>,
          ]} />
          <Paragraph variant="long">Følg komponentdokumentasjonen for detaljene, og lenk dit i stedet for å gjenta den.</Paragraph>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="oppsummering">Oppsummering</Heading>
          <Paragraph variant="long">Start med hva brukerne skal gjøre, og velg visningen som lar dem løse oppgaven raskest.</Paragraph>
          <Bullets items={[
            "Bruk liste for å finne én oppføring, og kort når oppføringene har handlinger.",
            "Bruk en snudd tabell for å sammenligne noen få alternativer.",
            "Behold tabellen og la den rulle sideveis for å sammenligne mange oppføringer.",
            "Legg detaljer ett trykk unna i stedet for å fjerne dem.",
            "Merk avvik med tekst, og sorter dem først.",
            "Kod innholdet etter hva det er, og meld endringer til skjermlesere.",
          ]} />

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="kilder">Kilder og relevant informasjon</Heading>
          <Bullets items={[
            <Link key="131" href="https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html">Understanding 1.3.1 Info and Relationships (w3.org)</Link>,
            <Link key="1410" href="https://www.w3.org/WAI/WCAG22/Understanding/reflow.html">Understanding 1.4.10 Reflow (w3.org)</Link>,
            <Link key="fdk" href="https://data.norge.no">Felles datakatalog (data.norge.no)</Link>,
            "Uutilsynet: Tabeller. Lenken legges inn.",
          ]} />

          <Card data-color="warning" variant="tinted">
            <Paragraph variant="long">
              <strong>Mer innsikt ønskes</strong>
              <br />
              Har du erfaringer, brukertesting eller andre funn om strukturert informasjon på små skjermer? Del dem
              gjerne i <Link href={DISCUSSION}>diskusjonstråden på github.com</Link>.
            </Paragraph>
          </Card>

          {/* ------------------------------------------------------------ */}
          <Heading level={2} data-size="md" id="avklaring">Til avklaring i arbeidsgruppen</Heading>
          <Paragraph variant="long">Denne delen er bare med i forslaget og fjernes før artikkelen publiseres.</Paragraph>
          <Bullets items={[
            <>Utkastet foreslår også et chatgrensesnitt i stedet for visningen, og å la være å dele dataene. Skal det anbefales? Se <Link href="#forberedelser">Forberedelser</Link>.</>,
            <>Er det riktig å anbefale tabell med sideveis rulling når oppføringene har mange egenskaper, eller bør vi først anbefale liste eller kort? Det må begrunnes ut fra WCAG 1.4.10. Se <Link href="#oppgave-mange">Når brukerne skal sammenligne mange oppføringer</Link>.</>,
            <>Designsystemet har ingen data grid. Er avkryssing og én handling for de valgte godt nok, eller skal endring av flere oppføringer samtidig holdes utenfor mønsteret? Se <Link href="#oppgave-endre">Når brukerne skal endre oppføringer</Link>.</>,
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
