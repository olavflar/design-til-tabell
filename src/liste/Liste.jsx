import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Chip,
  Details,
  Dialog,
  Field,
  Fieldset,
  Heading,
  Label,
  Link,
  List,
  Paragraph,
  Input,
  Table,
  Tag,
} from "@digdir/designsystemet-react";
import { XMarkIcon } from "@navikt/aksel-icons";
import { useFrameLayer } from "../components/DeviceFrame.jsx";
import HifiNav from "../components/HifiNav.jsx";
import { extract, cssBetween } from "../components/CodeExample.jsx";
import src from "./Liste.jsx?raw";
import css from "./liste.css?raw";
import casesSrc from "../components/cases.jsx?raw";
import {
  CASES, TITLE, STATUSES, StatusTag, SORT_ORDERS, byNewest, Intro, CaseTable, Example, Small,
} from "../components/cases.jsx";

/* Hi-fi av listeeksemplene i artikkelen: tabell på stor skjerm → liste på liten
   skjerm. Samme saker som scenario 1 i mønsteret («Mine saker»). Sakene er fiktive. */


/**
 * Stablet liste: hver oppføring har fire faste plasser, så brukeren kjenner
 * igjen verdiene uten etiketter. Saksnavnet øverst til venstre, sist oppdatert
 * øverst til høyre, saksnummer, behandler og mottatt nederst til venstre,
 * status nederst til høyre.
 */
function StackedItem({ c, headingLevel = 4 }) {
  return (
    <>
      <div className="row">
        <Heading level={headingLevel} data-size="2xs" className="row__title">
          <Link href={`#${c.id}`}>{c.title}</Link>
        </Heading>
        <Paragraph data-size="sm" className="num">Oppdatert {c.updated}</Paragraph>
      </div>
      <div className="row">
        <Paragraph data-size="sm" className="subtle">
          Sak {c.caseNumber} · {c.handler} · Mottatt {c.received}
        </Paragraph>
        <StatusTag status={c.status} />
      </div>
    </>
  );
}

export function StackedList({ items, labelledBy, headingLevel }) {
  return (
    <List.Unordered className="stacked" aria-labelledby={labelledBy}>
      {items.map((c) => (
        <List.Item key={c.id}>
          <StackedItem c={c} headingLevel={headingLevel} />
        </List.Item>
      ))}
    </List.Unordered>
  );
}

/** Gruppert liste: én gruppe per status, i den rekkefølgen brukeren må handle */
function GroupedList({ items }) {
  return (
    <div className="groups">
      {STATUSES.map((s) => {
        const group = items.filter((c) => c.status === s).sort(byNewest);
        if (!group.length) return null;
        const gid = `grp-${s.replace(/\s/g, "-")}`;
        return (
          <section key={s} aria-labelledby={gid} className="group">
            <Heading level={4} data-size="2xs" id={gid} className="group__heading">
              {s} <span className="subtle">({group.length})</span>
            </Heading>
            <List.Unordered className="stacked">
              {group.map((c) => (
                <List.Item key={c.id}>
                  <div className="row">
                    <Heading level={5} data-size="2xs" className="row__title">
                      <Link href={`#${c.id}`}>{c.title}</Link>
                    </Heading>
                    <Paragraph data-size="sm" className="num">Oppdatert {c.updated}</Paragraph>
                  </div>
                  <Paragraph data-size="sm" className="subtle">
                    Sak {c.caseNumber} · {c.handler}
                  </Paragraph>
                </List.Item>
              ))}
            </List.Unordered>
          </section>
        );
      })}
    </div>
  );
}

/** Liste med detaljer ved behov: navn og status synlig, resten bak «Vis detaljer» */
export function DetailsList({ items, labelledBy }) {
  return (
    <List.Unordered className="stacked" aria-labelledby={labelledBy}>
      {items.map((c) => (
        <List.Item key={c.id}>
          <div className="row">
            <Heading level={4} data-size="2xs" className="row__title">
              <Link href={`#${c.id}`}>{c.title}</Link>
            </Heading>
            <StatusTag status={c.status} />
          </div>
          <Details data-size="sm" className="item-details">
            <Details.Summary>Detaljer om saken</Details.Summary>
            <Details.Content>
              <Table data-size="sm" className="kv">
                <caption className="ds-sr-only">Detaljer om {c.title}</caption>
                <Table.Body>
                  {[
                    ["Saksnummer", c.caseNumber],
                    ["Mottatt", c.received],
                    ["Sist oppdatert", c.updated],
                    ["Behandler", c.handler],
                  ].map(([k, v]) => (
                    <Table.Row key={k}>
                      <Table.HeaderCell scope="row">{k}</Table.HeaderCell>
                      <Table.Cell>{v}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Details.Content>
          </Details>
        </List.Item>
      ))}
    </List.Unordered>
  );
}

const detailRows = (c) => [
  ["Saksnummer", c.caseNumber],
  ["Status", <StatusTag key="s" status={c.status} />],
  ["Mottatt", c.received],
  ["Sist oppdatert", c.updated],
  ["Behandler", c.handler],
];

/**
 * Knapp som åpner en dialog med alle opplysningene om saken. Dialogen legges i
 * laget over skjermen i rammen (useFrameLayer), så den fyller eksempelet og
 * ikke hele siden. Mens den er åpen, er resten av skjermen inert, Esc og klikk
 * utenfor lukker, og fokus går tilbake til knappen. Nederst på smal skjerm,
 * midt på bred skjerm.
 */
function CaseDialog({ c }) {
  const layer = useFrameLayer();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const headingId = `dlg-${useId()}`;

  useEffect(() => {
    if (!open || !layer) return;
    const screen = layer.parentElement.querySelector(".frame__screen");
    screen.inert = true;
    dialogRef.current?.querySelector("button")?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      screen.inert = false;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open, layer]);

  const narrow = layer && layer.clientWidth < 600;

  return (
    <>
      <Button ref={triggerRef} variant="tertiary" data-size="sm" className="more-btn" onClick={() => setOpen(true)}>
        Mer om saken
      </Button>
      {open && layer && createPortal(
        <>
          <div className="frame__scrim" onClick={() => setOpen(false)} />
          <Dialog
            ref={dialogRef}
            open
            modal={false}
            closeButton="Lukk"
            placement={narrow ? "bottom" : "center"}
            aria-labelledby={headingId}
            aria-modal="true"
            onClose={() => setOpen(false)}
          >
            <Dialog.Block>
              <Heading level={2} data-size="xs" id={headingId}>{c.title}</Heading>
            </Dialog.Block>
            <Dialog.Block>
              <Table data-size="sm" className="kv">
                <caption className="ds-sr-only">{c.title}</caption>
                <Table.Body>
                  {detailRows(c).map(([k, v]) => (
                    <Table.Row key={k}>
                      <Table.HeaderCell scope="row">{k}</Table.HeaderCell>
                      <Table.Cell>{v}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Dialog.Block>
            <Dialog.Block>
              <Link href={`#${c.id}`}>Gå til saken</Link>
            </Dialog.Block>
          </Dialog>
        </>,
        layer,
      )}
    </>
  );
}

/** Liste der mer informasjon åpnes i en dialog */
function DialogList({ items, labelledBy }) {
  return (
    <List.Unordered className="stacked" aria-labelledby={labelledBy}>
      {items.map((c) => (
        <List.Item key={c.id}>
          <StackedItem c={c} />
          <CaseDialog c={c} />
        </List.Item>
      ))}
    </List.Unordered>
  );
}

/** Tabell for stor skjerm der hver rad har en knapp som åpner samme dialog */
function DialogTable({ items, labelledBy }) {
  return (
    <Table data-size="sm" zebra className="case-table">
      <caption className="ds-sr-only">{TITLE}</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope="col">Sak</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
          <Table.HeaderCell scope="col">Sist oppdatert</Table.HeaderCell>
          <Table.HeaderCell scope="col">Behandler</Table.HeaderCell>
          <Table.HeaderCell scope="col"><span className="ds-sr-only">Mer informasjon</span></Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {items.map((c) => (
          <Table.Row key={c.id}>
            <Table.HeaderCell scope="row"><Link href={`#${c.id}`}>{c.title}</Link></Table.HeaderCell>
            <Table.Cell><StatusTag status={c.status} /></Table.Cell>
            <Table.Cell className="num">{c.updated}</Table.Cell>
            <Table.Cell>{c.handler}</Table.Cell>
            <Table.Cell><CaseDialog c={c} /></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

/** Illustrasjon: én tabellrad og samme sak som listeoppføring, med nummer på hvor cellene havner */
export function Mapping() {
  const c = CASES[0];
  const N = ({ n }) => <span className="num-badge" aria-hidden>{n}</span>;
  return (
    <div className="mapping">
      <figure>
        <figcaption>Tabellrad</figcaption>
        <div className="mapping__scroll">
          <Table data-size="sm" className="case-table">
            <caption className="ds-sr-only">Én sak som tabellrad</caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope="col">Sak</Table.HeaderCell>
                <Table.HeaderCell scope="col">Saksnummer</Table.HeaderCell>
                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                <Table.HeaderCell scope="col">Mottatt</Table.HeaderCell>
                <Table.HeaderCell scope="col">Sist oppdatert</Table.HeaderCell>
                <Table.HeaderCell scope="col">Behandler</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.HeaderCell scope="row"><N n={1} /> <Link href={`#${c.id}`}>{c.title}</Link></Table.HeaderCell>
                <Table.Cell className="num"><N n={4} /> {c.caseNumber}</Table.Cell>
                <Table.Cell><N n={3} /> <StatusTag status={c.status} /></Table.Cell>
                <Table.Cell className="num"><N n={4} /> {c.received}</Table.Cell>
                <Table.Cell className="num"><N n={2} /> {c.updated}</Table.Cell>
                <Table.Cell><N n={4} /> {c.handler}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </figure>
      <figure>
        <figcaption>Listeoppføring</figcaption>
        <List.Unordered className="stacked mapping__item">
          <List.Item>
            <div className="row">
              <Heading level={4} data-size="2xs" className="row__title">
                <N n={1} /> <Link href={`#${c.id}`}>{c.title}</Link>
              </Heading>
              <Paragraph data-size="sm" className="num"><N n={2} /> Oppdatert {c.updated}</Paragraph>
            </div>
            <div className="row">
              <Paragraph data-size="sm" className="subtle"><N n={4} /> Sak {c.caseNumber} · {c.handler} · Mottatt {c.received}</Paragraph>
              <span><N n={3} /> <StatusTag status={c.status} /></span>
            </div>
          </List.Item>
        </List.Unordered>
      </figure>
      <List.Ordered className="places" data-size="sm">
        <List.Item><strong>Øverst til venstre:</strong> det brukeren kjenner igjen saken på, som lenke når den kan åpnes.</List.Item>
        <List.Item><strong>Øverst til høyre:</strong> det nest viktigste, ofte en dato eller et beløp.</List.Item>
        <List.Item><strong>Nederst til høyre:</strong> status, med tekst og ikke bare farge.</List.Item>
        <List.Item><strong>Nederst til venstre:</strong> resten, i dempet tekst og skilt med prikk.</List.Item>
      </List.Ordered>
      <Paragraph data-size="sm">
        Kolonneoverskriftene faller bort. Saksnavn og status forklarer seg selv. Datoer og nummer får et ord foran
        («Oppdatert», «Sak», «Mottatt») i stedet for etikett, så de er forståelige uten overskrift.
      </Paragraph>
    </div>
  );
}

/**
 * Søk, statusfilter og sortering, likt på stor og liten skjerm. I tabellen
 * vises sorteringen som nedtrekksliste her også, så prototypen viser samme
 * kontroller på begge flatene.
 */
export function SearchableCases({ id, large = false }) {
  const uid = useId();
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState([]);
  const toggleStatus = (s) =>
    // Valgte filtre står i samme rekkefølge som valgene, ikke i rekkefølgen brukeren klikket
    setStatuses((cur) => STATUSES.filter((x) => (x === s ? !cur.includes(s) : cur.includes(x))));
  const [order, setOrder] = useState("nyest");

  const q = query.trim().toLocaleLowerCase("nb");
  const shown = CASES.filter(
    (c) =>
      (!statuses.length || statuses.includes(c.status)) &&
      (!q || [c.title, c.caseNumber, c.handler].some((v) => v.toLocaleLowerCase("nb").includes(q))),
  ).sort(SORT_ORDERS.find((o) => o.value === order).cmp);

  return (
    <div className="frame__content hifi">
      <Intro id={id} total={CASES.length} />
      <div className="controls">
        <Field data-size="sm">
          <Label>Søk i sakene</Label>
          {/* Search er avviklet. Designsystemet anbefaler Input med type="search" i Field med Label.
              Feltet er kontrollert, så tøm-knappen nullstiller state i onClick i stedet for type="reset". */}
          <div className="search-field">
            <Input
              type="search"
              enterKeyHint="search"
              placeholder=" "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            />
            {query && (
              <Button
                type="button"
                variant="tertiary"
                data-size="sm"
                icon
                aria-label="Tøm søkefeltet"
                className="search-field__clear"
                onClick={(e) => {
                  setQuery("");
                  e.currentTarget.parentElement.querySelector("input")?.focus();
                }}
              >
                <XMarkIcon aria-hidden />
              </Button>
            )}
          </div>
        </Field>
      </div>
      {/* Fire valg: Select brukes først fra 7 valg, så sorteringen er filterbrikker med ett valg */}
      <Fieldset data-size="sm">
        <Fieldset.Legend>Sorter etter</Fieldset.Legend>
        <div className="chips">
          {SORT_ORDERS.map((o) => (
            <Chip.Radio
              key={o.value}
              data-size="sm"
              name={`${uid}-sort`}
              value={o.value}
              checked={order === o.value}
              onChange={() => setOrder(o.value)}
            >
              {o.label}
            </Chip.Radio>
          ))}
        </div>
      </Fieldset>
      <Fieldset data-size="sm">
        <Fieldset.Legend>Status</Fieldset.Legend>
        <Fieldset.Description>Velg én eller flere. Ingen valgt viser alle.</Fieldset.Description>
        <div className="chips">
          {STATUSES.map((s) => (
            <Chip.Checkbox
              key={s}
              data-size="sm"
              name={`${uid}-status`}
              value={s}
              checked={statuses.includes(s)}
              onChange={() => toggleStatus(s)}
            >
              {s}
            </Chip.Checkbox>
          ))}
        </div>
      </Fieldset>
      {(q || statuses.length > 0) && (
        /* Chip-retningslinjene: chips som kan fjernes eller klikkes, bør ligge i en liste med navn */
        <div className="active-filters">
          <Paragraph data-size="sm" className="subtle" id={`${uid}-active`}>Valgte filtre:</Paragraph>
          <ul aria-labelledby={`${uid}-active`}>
            {q && (
              <li>
                <Chip.Removable data-size="sm" aria-label={`Fjern søk ${query.trim()}`} onClick={() => setQuery("")}>
                  {query.trim()}
                </Chip.Removable>
              </li>
            )}
            {statuses.map((s) => (
              <li key={s}>
                <Chip.Removable data-size="sm" aria-label={`Fjern ${s}`} onClick={() => toggleStatus(s)}>
                  {s}
                </Chip.Removable>
              </li>
            ))}
            <li>
              <Chip.Button data-size="sm" onClick={() => { setQuery(""); setStatuses([]); }}>Tøm alle filtre</Chip.Button>
            </li>
          </ul>
        </div>
      )}
      <Paragraph role="status" data-size="sm" className="meta">
        {shown.length === 0
          ? "Ingen saker passer søket"
          : `Viser ${shown.length} av ${CASES.length} saker`}
      </Paragraph>
      {shown.length > 0 &&
        (large ? <CaseTable items={shown} labelledBy={id} /> : <StackedList items={shown} labelledBy={id} />)}
    </div>
  );
}

/* ---------- Nummerert liste som ser ut som en tabell ---------- */

/* Køen hos byggesak: her betyr rekkefølgen noe, så det er en nummerert liste */
const QUEUE = [
  { id: "ko-1", title: "Søknad om byggetillatelse, Storgata 12", received: "02.10.2026", answer: "Uke 48" },
  { id: "ko-2", title: "Søknad om ferdigattest, Bakkeveien 3", received: "05.10.2026", answer: "Uke 49" },
  { id: "ko-3", title: "Søknad om byggetillatelse, Elvegata 7", received: "12.10.2026", answer: "Uke 50" },
  { id: "ko-4", title: "Søknad om dispensasjon, Fjellveien 21", received: "19.10.2026", answer: "Uke 51" },
  { id: "ko-5", title: "Søknad om rivetillatelse, Torget 1", received: "27.10.2026", answer: "Uke 2" },
];
const QUEUE_COLUMNS = ["Plass", "Søknad", "Mottatt", "Forventet svar"];

/**
 * Én nummerert liste for alle skjermbredder. Når listen er bred nok, står
 * verdiene i kolonner under en overskriftsrad, så den ser ut som en tabell.
 * Overskriftsraden er bare visuell (aria-hidden). Hver verdi har sin egen
 * etikett, som er skjult når overskriftsraden vises, og synlig når listen
 * stables. Skjermlesere får vite plassen fra den nummererte listen
 * («1 av 5»), og etiketten fra hver verdi.
 */
function QueueList({ labelledBy }) {
  return (
    <div className="ol-table">
      <div className="ol-table__head" aria-hidden>
        {QUEUE_COLUMNS.map((c) => <span key={c}>{c}</span>)}
      </div>
      <ol className="ol-table__list" role="list" aria-labelledby={labelledBy}>
        {QUEUE.map((q) => (
          <li key={q.id}>
            <Heading level={4} data-size="2xs" className="ol-table__title">
              <Link href={`#${q.id}`}>{q.title}</Link>
            </Heading>
            <Paragraph data-size="sm" className="num">
              <span className="ol-table__label">Mottatt </span>{q.received}
            </Paragraph>
            <Paragraph data-size="sm" className="num">
              <span className="ol-table__label">Forventet svar </span>{q.answer}
            </Paragraph>
          </li>
        ))}
      </ol>
    </div>
  );
}

function QueueScreen({ id }) {
  return (
    <div className="frame__content hifi">
      <Heading level={3} data-size="sm" id={id}>Køen hos byggesak</Heading>
      <Paragraph data-size="sm" className="meta">
        Søknadene behandles i den rekkefølgen de kom inn. <Tag data-size="sm" data-color="warning">Fiktive søknader</Tag>
      </Paragraph>
      <QueueList labelledBy={id} />
    </div>
  );
}

export default function Liste() {
  const sorted = [...CASES].sort(byNewest);

  return (
    <main className="art">
      <HifiNav current="Liste" />
      <header>
        <Paragraph data-size="sm" className="eyebrow">
          Mønster: Strukturert informasjon · <Tag data-size="sm" data-color="warning">Utkast</Tag>
        </Paragraph>
        <Heading level={1} data-size="lg">Liste</Heading>
        <Paragraph>
          Listen er riktig når brukeren skal finne eller skanne én oppføring, og ikke sammenligne mange verdier på
          tvers av oppføringene. På små skjermer blir hver rad i tabellen en oppføring i listen, med det viktigste
          først.
        </Paragraph>
      </header>

      <section>
        <Heading level={2} data-size="md">Stablet liste</Heading>
        <Paragraph>
          Når brukeren skal kjenne igjen én sak blant mange, og hver sak har få opplysninger.
        </Paragraph>
        <Heading level={3} data-size="sm">Fire faste plasser per oppføring</Heading>
        <Mapping />
        <Example
          id="stacked"
          code={[
            { label: "Liste", code: extract(src, "StackedItem", "StackedList") },
            { label: "Tabell", code: extract(casesSrc, "CaseTable") },
            { label: "CSS", code: cssBetween(css, "Stablet liste", "Gruppert liste") },
          ]}
          smallLabel="Stablet liste, liten skjerm"
          caption="Seks kolonner blir to linjer per sak. Hver verdi har en fast plass: navnet øverst til venstre, sist oppdatert øverst til høyre, status nederst til høyre. Verdier som ikke forklarer seg selv, har et ord foran («Sak», «Oppdatert»), så de er forståelige uten kolonneoverskrift. Navnet er en overskrift med lenke, så skjermleserbrukere kan hoppe fra sak til sak."
          render={(id) => (
            <Small id={id}><StackedList items={sorted} labelledBy={id} /></Small>
          )}
        />
      </section>

      <section>
        <Heading level={2} data-size="md">Liste med søk, filter og sortering</Heading>
        <Paragraph>
          Når listen er så lang at brukeren ikke finner saken ved å skanne. Søk, filter og sortering virker likt i
          tabellen og listen.
        </Paragraph>
        <Example
          id="search"
          code={[
            { label: "Søk, filter og sortering", code: extract(src, "SearchableCases") },
            { label: "CSS", code: cssBetween(css, "Søk og filter", "Dialog-knapp") },
          ]}
          smallLabel="Liste med søk og filter, liten skjerm"
          large={<SearchableCases id="search-large" large />}
          caption="Søk, sortering og statusfilter står over listen og virker likt i tabellen og listen. Sorteringen har fire valg, så den er filterbrikker der brukeren velger ett, og ikke en nedtrekksliste. Statusfilteret er filterbrikker der brukeren kan velge flere statuser samtidig. Valgte filtre vises samlet over listen, der hvert filter kan fjernes for seg. Antall treff leses opp av skjermleser når listen endres."
          render={(id) => <SearchableCases id={id} />}
        />
      </section>

      <section>
        <Heading level={2} data-size="md">Gruppert liste</Heading>
        <Paragraph>
          Når oppføringene har en naturlig inndeling, og noen grupper er viktigere enn andre. Her kommer sakene som
          venter på brukeren, først.
        </Paragraph>
        <Example
          id="grouped"
          code={[
            { label: "Liste", code: extract(src, "GroupedList") },
            { label: "CSS", code: cssBetween(css, "Gruppert liste", "Detaljer ved behov") },
          ]}
          smallLabel="Liste gruppert etter status, liten skjerm"
          caption="Status er flyttet fra hver oppføring til en gruppeoverskrift, så hver sak trenger færre opplysninger. Gruppeoverskriftene er ekte overskrifter, og hver gruppe er en egen liste. Det gir struktur for skjermlesere og KI-agenter, og ikke bare visuelt."
          render={(id) => (
            <Small id={id}><GroupedList items={CASES} /></Small>
          )}
        />
      </section>

      <section>
        <Heading level={2} data-size="md">Liste med detaljer ved behov</Heading>
        <Paragraph>
          Når brukeren trenger noen få nøkkelopplysninger for å finne saken, og resten bare av og til.
        </Paragraph>
        <Example
          id="details"
          code={[
            { label: "Liste", code: extract(src, "DetailsList") },
            { label: "CSS", code: cssBetween(css, "Detaljer ved behov", "Søk og filter") },
          ]}
          smallLabel="Liste med detaljer som kan vises, liten skjerm"
          caption="Navn og status er alltid synlige. Resten ligger under «Detaljer om saken», med etikett og verdi som radoverskrift og celle. Ingen opplysninger er fjernet, bare lagt ett trykk unna. Lenken i navnet åpner saken, så knappen for detaljer og lenken gjør hver sin ting."
          render={(id) => (
            <Small id={id}><DetailsList items={sorted} labelledBy={id} /></Small>
          )}
        />
      </section>

      <section>
        <Heading level={2} data-size="md">Liste med mer informasjon i dialog</Heading>
        <Paragraph>
          Når detaljene er for mange eller for store til å vises inne i listen, men brukeren ikke trenger å åpne hele
          saken.
        </Paragraph>
        <Example
          id="dialog"
          code={[
            { label: "Liste", code: extract(src, "DialogList", "detailRows", "CaseDialog") },
            { label: "Tabell", code: extract(src, "DialogTable") },
          ]}
          smallLabel="Liste med dialog for mer informasjon, liten skjerm"
          large={
            <Small id="dialog-large"><DialogTable items={sorted} labelledBy="dialog-large" /></Small>
          }
          caption="Listen er den samme stablede listen. På liten skjerm åpner «Mer om saken» en dialog nederst på skjermen med alle opplysningene som etikett og verdi. På stor skjerm åpnes samme dialog fra tabellen, midt på skjermen. Brukeren blir på samme sted og kommer tilbake til knappen når dialogen lukkes."
          render={(id) => (
            <Small id={id}><DialogList items={sorted} labelledBy={id} /></Small>
          )}
        />
      </section>

      <section>
        <Heading level={2} data-size="md">Nummerert liste som ser ut som en tabell</Heading>
        <Paragraph>
          Når rekkefølgen er en del av innholdet, for eksempel en kø, og hver oppføring har noen få verdier som bør stå
          på linje på stor skjerm.
        </Paragraph>
        <Example
          id="queue"
          code={[
            { label: "Liste", code: extract(src, "QueueList") },
            { label: "CSS", code: cssBetween(css, "---------- Nummerert liste") },
          ]}
          smallLabel="Nummerert liste, liten skjerm"
          large={<QueueScreen id="queue-large" />}
          caption="Det er samme nummererte liste på begge skjermene. På stor skjerm står verdiene i kolonner med en overskriftsrad over, så den ser ut som en tabell. På liten skjerm stables hver oppføring, og etiketten står foran verdien. Overskriftsraden er bare visuell. For skjermlesere har hver verdi sin egen etikett, og plassen kommer fra nummereringen. Brukeren kan ikke bevege seg opp og ned i en kolonne slik som i en ekte tabell. Skal brukeren sammenligne verdier på tvers av oppføringene, er en tabell med en kolonne for plass bedre."
          render={(id) => <QueueScreen id={id} />}
        />
      </section>
    </main>
  );
}
