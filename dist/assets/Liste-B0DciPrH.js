import{B as e,C as t,F as n,G as r,H as i,I as a,M as o,N as s,R as c,U as l,_ as u,a as d,h as f,j as p,p as m,r as h,s as g,v as _,x as v,y}from"./DeviceFrame-C4KpHYVz.js";import{i as b,n as x,r as S}from"./CodeExample-BAlVicH_.js";import{a as C,c as w,i as T,l as E,n as D,o as O,r as k,s as A,t as j,u as M}from"./cases-CFdL7Zie.js";var N=r(l(),1),P=r(i(),1),F=`import { useEffect, useId, useRef, useState } from "react";
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
          <Link href={\`#\${c.id}\`}>{c.title}</Link>
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
        const gid = \`grp-\${s.replace(/\\s/g, "-")}\`;
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
                      <Link href={\`#\${c.id}\`}>{c.title}</Link>
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
              <Link href={\`#\${c.id}\`}>{c.title}</Link>
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
  const headingId = \`dlg-\${useId()}\`;

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
              <Link href={\`#\${c.id}\`}>Gå til saken</Link>
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
            <Table.HeaderCell scope="row"><Link href={\`#\${c.id}\`}>{c.title}</Link></Table.HeaderCell>
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
                <Table.HeaderCell scope="row"><N n={1} /> <Link href={\`#\${c.id}\`}>{c.title}</Link></Table.HeaderCell>
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
                <N n={1} /> <Link href={\`#\${c.id}\`}>{c.title}</Link>
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
    setStatuses((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
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
              name={\`\${uid}-sort\`}
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
              name={\`\${uid}-status\`}
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
          <Paragraph data-size="sm" className="subtle" id={\`\${uid}-active\`}>Valgte filtre:</Paragraph>
          <ul aria-labelledby={\`\${uid}-active\`}>
            {q && (
              <li>
                <Chip.Removable data-size="sm" aria-label={\`Fjern søk \${query.trim()}\`} onClick={() => setQuery("")}>
                  {query.trim()}
                </Chip.Removable>
              </li>
            )}
            {statuses.map((s) => (
              <li key={s}>
                <Chip.Removable data-size="sm" aria-label={\`Fjern \${s}\`} onClick={() => toggleStatus(s)}>
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
          : \`Viser \${shown.length} av \${CASES.length} saker\`}
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
              <Link href={\`#\${q.id}\`}>{q.title}</Link>
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
`,I=`/* Hi-fi liste: bare oppsett som Designsystemet ikke dekker direkte */
.hifi { display: flex; flex-direction: column; gap: var(--ds-size-3); padding-top: var(--ds-size-4); }
.hifi > * { margin: 0; }
.meta { color: var(--ds-color-neutral-text-subtle); display: flex; flex-wrap: wrap; align-items: center; gap: var(--ds-size-2); margin: 0; }
.subtle { color: var(--ds-color-neutral-text-subtle); font-weight: 400; }
.num { font-variant-numeric: tabular-nums; white-space: nowrap; }
.art > header { display: flex; flex-direction: column; gap: var(--ds-size-3); }

/* Stablet liste */
.stacked { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--ds-color-neutral-border-subtle); }
.stacked > li {
  display: flex; flex-direction: column; gap: var(--ds-size-1);
  padding-block: var(--ds-size-3);
  border-bottom: 1px solid var(--ds-color-neutral-border-subtle);
}
.stacked > li + li { margin-top: 0; }
.stacked .row {
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline;
  gap: var(--ds-size-1) var(--ds-size-3);
}
.stacked .row > *, .stacked > li > * { margin: 0; }
.row__title { flex: 1 1 12rem; }

/* Gruppert liste */
.groups { display: flex; flex-direction: column; gap: var(--ds-size-6); }
.group { display: flex; flex-direction: column; gap: var(--ds-size-2); }
.group > * { margin: 0; }

/* Detaljer ved behov */
.item-details { margin-top: var(--ds-size-1); }
.kv { width: 100%; }
.kv th { width: 40%; font-weight: 500; }

/* Søk og filter */
.controls { display: grid; gap: var(--ds-size-3); }
.controls--wide { grid-template-columns: 2fr 1fr; align-items: end; }
.chips { display: flex; flex-wrap: wrap; gap: var(--ds-size-2); }

.case-table { width: 100%; }
.case-table th[scope="row"] { font-weight: 400; }

/* Valgte filtre */
.active-filters { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ds-size-2); }
.active-filters > p { margin: 0; }
.active-filters ul { display: flex; flex-wrap: wrap; gap: var(--ds-size-2); margin: 0; padding: 0; list-style: none; }

/* Søkefelt: Input type="search" med egen tøm-knapp (Search er avviklet) */
.search-field { position: relative; }
.search-field input::-webkit-search-cancel-button { display: none; }
.search-field input:not(:placeholder-shown) { padding-inline-end: var(--ds-size-10); }
.search-field__clear { position: absolute; inset-block: 0; inset-inline-end: var(--ds-size-1); margin-block: auto; }

/* Dialog-knapp: står til venstre under oppføringen */
.more-btn { align-self: flex-start; margin-inline-start: calc(var(--ds-size-3) * -1); }

/* Fire faste plasser */
.mapping { display: flex; flex-direction: column; gap: var(--ds-size-4); max-width: 64rem !important; }
.mapping > * { margin: 0; }
.mapping figure { margin: 0; display: flex; flex-direction: column; gap: var(--ds-size-2); }
.mapping figcaption { color: var(--ds-color-neutral-text-subtle); font-size: var(--ds-font-size-3); font-weight: 500; }
.mapping__scroll { overflow-x: auto; }
.mapping__item { max-width: 26rem; }
.num-badge {
  display: inline-grid; place-items: center;
  width: 1.4em; height: 1.4em; border-radius: 50%;
  font-size: 0.75rem; font-weight: 600; line-height: 1; vertical-align: 0.1em;
  background: var(--ds-color-accent-base-default); color: var(--ds-color-accent-base-contrast-default);
}
.places { max-width: 44rem; }
.table-scroll { overflow-x: auto; }
/* Stor skjerm: litt mindre luft i cellene, så alle kolonnene får plass i rammen */
.case-table.ds-table { --dsc-table-padding: var(--ds-size-2) var(--ds-size-2); }
/* Hi-fi-sidene får bredere flate, så desktop-rammen har plass til hele tabellen */
.art { max-width: 90rem; }
.case-table .ds-button { white-space: nowrap; }
.frame--browser .frame__content.hifi { padding-inline: var(--ds-size-4); }
.case-table :is(th, td) { padding-inline: var(--ds-size-2); }
.case-table .ds-tag { white-space: normal; }

/* ---------- Nummerert liste som ser ut som en tabell ----------
   Smal: hver oppføring stables, med etiketten foran verdien.
   Bred (container query): kolonner med felles bredder via subgrid,
   en visuell overskriftsrad, og plassen som første kolonne. */
.ol-table { container-type: inline-size; }
.ol-table__head { display: none; }
.ol-table__list { list-style: none; margin: 0; padding: 0; counter-reset: plass; border-top: 1px solid var(--ds-color-neutral-border-subtle); }
.ol-table__list > li {
  counter-increment: plass;
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  column-gap: var(--ds-size-2);
  padding-block: var(--ds-size-3);
  border-bottom: 1px solid var(--ds-color-neutral-border-subtle);
}
.ol-table__list > li > * { margin: 0; grid-column: 2; }
/* Plassen vises med en teller. Skjermlesere får den fra ol, så den skjules for dem. */
.ol-table__list > li::before {
  content: counter(plass) "." / "";
  grid-column: 1; grid-row: 1 / span 3;
  font-weight: 600; font-variant-numeric: tabular-nums;
}
.ol-table__label { color: var(--ds-color-neutral-text-subtle); }

@container (min-width: 36rem) {
  .ol-table { display: grid; grid-template-columns: 4rem minmax(0, 1fr) auto auto; }
  .ol-table__head,
  .ol-table__list,
  .ol-table__list > li { display: grid; grid-column: 1 / -1; grid-template-columns: subgrid; column-gap: var(--ds-size-5); }
  .ol-table__head {
    padding: var(--ds-size-2) var(--ds-size-2);
    font-weight: 600; font-size: var(--ds-font-size-3);
    border-bottom: 2px solid var(--ds-color-accent-border-subtle);
  }
  .ol-table__list { border-top: 0; }
  .ol-table__list > li { padding: var(--ds-size-3) var(--ds-size-2); align-items: baseline; }
  .ol-table__list > li:nth-child(even) { background: var(--ds-color-neutral-surface-tinted); }
  .ol-table__list > li::before { grid-row: auto; }
  .ol-table__list > li > * { grid-column: auto; }
  .ol-table__head > :nth-child(n + 3),
  .ol-table__list .num { text-align: right; }
  /* Overskriftsraden vises, så etikettene skjules visuelt, men leses fortsatt opp */
  .ol-table__label {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap;
  }
}
`,L=`import { Heading, Link, Paragraph, Table, Tag } from "@digdir/designsystemet-react";
import { BrowserFrame, PhoneFrame } from "./DeviceFrame.jsx";
import CodeExample from "./CodeExample.jsx";

/* Felles for hi-fi-sidene (liste og kort): sakene fra scenario 1 («Mine saker»),
   tabellen for stor skjerm og rammen for eksemplene. Sakene er fiktive. */

export const CASES = [
  { id: "sak-1432", title: "Søknad om byggetillatelse", caseNumber: "2026/1432", status: "Venter på deg", received: "12.10.2026", updated: "28.10.2026", handler: "Byggesaksavdelingen" },
  { id: "sak-1398", title: "Søknad om ferdigattest", caseNumber: "2026/1398", status: "Under behandling", received: "03.10.2026", updated: "21.10.2026", handler: "Byggesaksavdelingen" },
  { id: "sak-1201", title: "Klage på eiendomsskatt", caseNumber: "2026/1201", status: "Under behandling", received: "18.09.2026", updated: "30.09.2026", handler: "Skatteoppkreveren" },
  { id: "sak-1187", title: "Søknad om parkeringstillatelse", caseNumber: "2026/1187", status: "Mottatt", received: "16.09.2026", updated: "16.09.2026", handler: "Bymiljøetaten" },
  { id: "sak-0954", title: "Melding om flytting", caseNumber: "2026/0954", status: "Avsluttet", received: "02.08.2026", updated: "14.08.2026", handler: "Folkeregisteret" },
  { id: "sak-1455", title: "Søknad om tilskudd til lag og foreninger", caseNumber: "2026/1455", status: "Mottatt", received: "27.10.2026", updated: "27.10.2026", handler: "Kulturetaten" },
  { id: "sak-1310", title: "Søknad om utvidet skjenkebevilling", caseNumber: "2026/1310", status: "Venter på deg", received: "25.09.2026", updated: "22.10.2026", handler: "Næringsetaten" },
  { id: "sak-0871", title: "Klage på vedtak om byggetillatelse", caseNumber: "2026/0871", status: "Avsluttet", received: "11.07.2026", updated: "29.09.2026", handler: "Byggesaksavdelingen" },
];

/* Bare statusen som krever noe av brukeren, får farge (Von Restorff). */
export const STATUSES = ["Venter på deg", "Under behandling", "Mottatt", "Avsluttet"];
export const STATUS_COLOR = { "Venter på deg": "warning" };
export const StatusTag = ({ status }) => (
  <Tag data-size="sm" data-color={STATUS_COLOR[status] ?? "neutral"}>{status}</Tag>
);

export const iso = (d) => d.split(".").reverse().join("-");
export const SORT_ORDERS = [
  { value: "nyest", label: "Nyeste først", cmp: (a, b) => iso(b.received).localeCompare(iso(a.received)) },
  { value: "eldst", label: "Eldste først", cmp: (a, b) => iso(a.received).localeCompare(iso(b.received)) },
  { value: "oppdatert", label: "Sist oppdatert", cmp: (a, b) => iso(b.updated).localeCompare(iso(a.updated)) },
  { value: "navn", label: "Navn A–Å", cmp: (a, b) => a.title.localeCompare(b.title, "nb") },
];
export const byNewest = SORT_ORDERS[0].cmp;

export const TITLE = "Mine saker";

export function Intro({ id, total }) {
  return (
    <>
      <Heading level={3} data-size="sm" id={id}>{TITLE}</Heading>
      <Paragraph data-size="sm" className="meta">
        {total} saker hos kommunen. <Tag data-size="sm" data-color="warning">Fiktive saker</Tag>
      </Paragraph>
    </>
  );
}

/** Sakene som tabell, for stor skjerm */
export function CaseTable({ items, labelledBy }) {
  return (
    // Rulleflate i tilfelle tabellen er bredere enn skjermen
    <div className="table-scroll" role="region" aria-label={\`\${TITLE}, tabell\`} tabIndex={0}>
    <Table data-size="sm" zebra className="case-table">
      <caption className="ds-sr-only">{TITLE}</caption>
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
        {items.map((c) => (
          <Table.Row key={c.id}>
            <Table.HeaderCell scope="row"><Link href={\`#\${c.id}\`}>{c.title}</Link></Table.HeaderCell>
            <Table.Cell className="num">{c.caseNumber}</Table.Cell>
            <Table.Cell><StatusTag status={c.status} /></Table.Cell>
            <Table.Cell className="num">{c.received}</Table.Cell>
            <Table.Cell className="num">{c.updated}</Table.Cell>
            <Table.Cell>{c.handler}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    </div>
  );
}


/** Stor og liten skjerm side om side, med bildetekst. \`render(id)\` lager innholdet for liste-visningene. */
export function Example({ id, smallLabel, caption, large, render, code }) {
  return (
    <div className="examples">
      <figure className="wide">
        <figcaption>Stor skjerm</figcaption>
        <BrowserFrame height={720} label="Tabell, stor skjerm">
          {large ?? (
            <div className="frame__content hifi">
              <Intro id={\`\${id}-large\`} total={CASES.length} />
              <CaseTable items={[...CASES].sort(byNewest)} labelledBy={\`\${id}-large\`} />
            </div>
          )}
        </BrowserFrame>
      </figure>
      <figure>
        <figcaption>Liten skjerm</figcaption>
        <PhoneFrame width={390} height={720} label={smallLabel}>
          {render(\`\${id}-small\`)}
        </PhoneFrame>
      </figure>
      <Paragraph data-size="sm">{caption}</Paragraph>
      {code && <CodeExample snippets={code} />}
    </div>
  );
}

export function Small({ id, children }) {
  return (
    <div className="frame__content hifi">
      <Intro id={id} total={CASES.length} />
      {children}
    </div>
  );
}

`,R=e();function z({c:e,headingLevel:t=4}){return(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)(`div`,{className:`row`,children:[(0,R.jsx)(u,{level:t,"data-size":`2xs`,className:`row__title`,children:(0,R.jsx)(c,{href:`#${e.id}`,children:e.title})}),(0,R.jsxs)(s,{"data-size":`sm`,className:`num`,children:[`Oppdatert `,e.updated]})]}),(0,R.jsxs)(`div`,{className:`row`,children:[(0,R.jsxs)(s,{"data-size":`sm`,className:`subtle`,children:[`Sak `,e.caseNumber,` · `,e.handler,` · Mottatt `,e.received]}),(0,R.jsx)(w,{status:e.status})]})]})}function B({items:e,labelledBy:t,headingLevel:n}){return(0,R.jsx)(f.Unordered,{className:`stacked`,"aria-labelledby":t,children:e.map(e=>(0,R.jsx)(f.Item,{children:(0,R.jsx)(z,{c:e,headingLevel:n})},e.id))})}function V({items:e}){return(0,R.jsx)(`div`,{className:`groups`,children:O.map(t=>{let n=e.filter(e=>e.status===t).sort(M);if(!n.length)return null;let r=`grp-${t.replace(/\s/g,`-`)}`;return(0,R.jsxs)(`section`,{"aria-labelledby":r,className:`group`,children:[(0,R.jsxs)(u,{level:4,"data-size":`2xs`,id:r,className:`group__heading`,children:[t,` `,(0,R.jsxs)(`span`,{className:`subtle`,children:[`(`,n.length,`)`]})]}),(0,R.jsx)(f.Unordered,{className:`stacked`,children:n.map(e=>(0,R.jsxs)(f.Item,{children:[(0,R.jsxs)(`div`,{className:`row`,children:[(0,R.jsx)(u,{level:5,"data-size":`2xs`,className:`row__title`,children:(0,R.jsx)(c,{href:`#${e.id}`,children:e.title})}),(0,R.jsxs)(s,{"data-size":`sm`,className:`num`,children:[`Oppdatert `,e.updated]})]}),(0,R.jsxs)(s,{"data-size":`sm`,className:`subtle`,children:[`Sak `,e.caseNumber,` · `,e.handler]})]},e.id))})]},t)})})}function H({items:e,labelledBy:t}){return(0,R.jsx)(f.Unordered,{className:`stacked`,"aria-labelledby":t,children:e.map(e=>(0,R.jsxs)(f.Item,{children:[(0,R.jsxs)(`div`,{className:`row`,children:[(0,R.jsx)(u,{level:4,"data-size":`2xs`,className:`row__title`,children:(0,R.jsx)(c,{href:`#${e.id}`,children:e.title})}),(0,R.jsx)(w,{status:e.status})]}),(0,R.jsxs)(y,{"data-size":`sm`,className:`item-details`,children:[(0,R.jsx)(y.Summary,{children:`Detaljer om saken`}),(0,R.jsx)(y.Content,{children:(0,R.jsxs)(g,{"data-size":`sm`,className:`kv`,children:[(0,R.jsxs)(`caption`,{className:`ds-sr-only`,children:[`Detaljer om `,e.title]}),(0,R.jsx)(g.Body,{children:[[`Saksnummer`,e.caseNumber],[`Mottatt`,e.received],[`Sist oppdatert`,e.updated],[`Behandler`,e.handler]].map(([e,t])=>(0,R.jsxs)(g.Row,{children:[(0,R.jsx)(g.HeaderCell,{scope:`row`,children:e}),(0,R.jsx)(g.Cell,{children:t})]},e))})]})})]})]},e.id))})}var U=e=>[[`Saksnummer`,e.caseNumber],[`Status`,(0,R.jsx)(w,{status:e.status},`s`)],[`Mottatt`,e.received],[`Sist oppdatert`,e.updated],[`Behandler`,e.handler]];function W({c:e}){let t=h(),[n,r]=(0,N.useState)(!1),i=(0,N.useRef)(null),o=(0,N.useRef)(null),s=`dlg-${(0,N.useId)()}`;(0,N.useEffect)(()=>{if(!n||!t)return;let e=t.parentElement.querySelector(`.frame__screen`);e.inert=!0,o.current?.querySelector(`button`)?.focus();let a=e=>e.key===`Escape`&&r(!1);return document.addEventListener(`keydown`,a),()=>{e.inert=!1,document.removeEventListener(`keydown`,a),i.current?.focus()}},[n,t]);let l=t&&t.clientWidth<600;return(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(a,{ref:i,variant:`tertiary`,"data-size":`sm`,className:`more-btn`,onClick:()=>r(!0),children:`Mer om saken`}),n&&t&&(0,P.createPortal)((0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`div`,{className:`frame__scrim`,onClick:()=>r(!1)}),(0,R.jsxs)(_,{ref:o,open:!0,modal:!1,closeButton:`Lukk`,placement:l?`bottom`:`center`,"aria-labelledby":s,"aria-modal":`true`,onClose:()=>r(!1),children:[(0,R.jsx)(_.Block,{children:(0,R.jsx)(u,{level:2,"data-size":`xs`,id:s,children:e.title})}),(0,R.jsx)(_.Block,{children:(0,R.jsxs)(g,{"data-size":`sm`,className:`kv`,children:[(0,R.jsx)(`caption`,{className:`ds-sr-only`,children:e.title}),(0,R.jsx)(g.Body,{children:U(e).map(([e,t])=>(0,R.jsxs)(g.Row,{children:[(0,R.jsx)(g.HeaderCell,{scope:`row`,children:e}),(0,R.jsx)(g.Cell,{children:t})]},e))})]})}),(0,R.jsx)(_.Block,{children:(0,R.jsx)(c,{href:`#${e.id}`,children:`Gå til saken`})})]})]}),t)]})}function G({items:e,labelledBy:t}){return(0,R.jsx)(f.Unordered,{className:`stacked`,"aria-labelledby":t,children:e.map(e=>(0,R.jsxs)(f.Item,{children:[(0,R.jsx)(z,{c:e}),(0,R.jsx)(W,{c:e})]},e.id))})}function K({items:e,labelledBy:t}){return(0,R.jsxs)(g,{"data-size":`sm`,zebra:!0,className:`case-table`,children:[(0,R.jsx)(`caption`,{className:`ds-sr-only`,children:E}),(0,R.jsx)(g.Head,{children:(0,R.jsxs)(g.Row,{children:[(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Sak`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Status`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Sist oppdatert`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Behandler`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:(0,R.jsx)(`span`,{className:`ds-sr-only`,children:`Mer informasjon`})})]})}),(0,R.jsx)(g.Body,{children:e.map(e=>(0,R.jsxs)(g.Row,{children:[(0,R.jsx)(g.HeaderCell,{scope:`row`,children:(0,R.jsx)(c,{href:`#${e.id}`,children:e.title})}),(0,R.jsx)(g.Cell,{children:(0,R.jsx)(w,{status:e.status})}),(0,R.jsx)(g.Cell,{className:`num`,children:e.updated}),(0,R.jsx)(g.Cell,{children:e.handler}),(0,R.jsx)(g.Cell,{children:(0,R.jsx)(W,{c:e})})]},e.id))})]})}function q(){let e=j[0],t=({n:e})=>(0,R.jsx)(`span`,{className:`num-badge`,"aria-hidden":!0,children:e});return(0,R.jsxs)(`div`,{className:`mapping`,children:[(0,R.jsxs)(`figure`,{children:[(0,R.jsx)(`figcaption`,{children:`Tabellrad`}),(0,R.jsx)(`div`,{className:`mapping__scroll`,children:(0,R.jsxs)(g,{"data-size":`sm`,className:`case-table`,children:[(0,R.jsx)(`caption`,{className:`ds-sr-only`,children:`Én sak som tabellrad`}),(0,R.jsx)(g.Head,{children:(0,R.jsxs)(g.Row,{children:[(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Sak`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Saksnummer`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Status`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Mottatt`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Sist oppdatert`}),(0,R.jsx)(g.HeaderCell,{scope:`col`,children:`Behandler`})]})}),(0,R.jsx)(g.Body,{children:(0,R.jsxs)(g.Row,{children:[(0,R.jsxs)(g.HeaderCell,{scope:`row`,children:[(0,R.jsx)(t,{n:1}),` `,(0,R.jsx)(c,{href:`#${e.id}`,children:e.title})]}),(0,R.jsxs)(g.Cell,{className:`num`,children:[(0,R.jsx)(t,{n:4}),` `,e.caseNumber]}),(0,R.jsxs)(g.Cell,{children:[(0,R.jsx)(t,{n:3}),` `,(0,R.jsx)(w,{status:e.status})]}),(0,R.jsxs)(g.Cell,{className:`num`,children:[(0,R.jsx)(t,{n:4}),` `,e.received]}),(0,R.jsxs)(g.Cell,{className:`num`,children:[(0,R.jsx)(t,{n:2}),` `,e.updated]}),(0,R.jsxs)(g.Cell,{children:[(0,R.jsx)(t,{n:4}),` `,e.handler]})]})})]})})]}),(0,R.jsxs)(`figure`,{children:[(0,R.jsx)(`figcaption`,{children:`Listeoppføring`}),(0,R.jsx)(f.Unordered,{className:`stacked mapping__item`,children:(0,R.jsxs)(f.Item,{children:[(0,R.jsxs)(`div`,{className:`row`,children:[(0,R.jsxs)(u,{level:4,"data-size":`2xs`,className:`row__title`,children:[(0,R.jsx)(t,{n:1}),` `,(0,R.jsx)(c,{href:`#${e.id}`,children:e.title})]}),(0,R.jsxs)(s,{"data-size":`sm`,className:`num`,children:[(0,R.jsx)(t,{n:2}),` Oppdatert `,e.updated]})]}),(0,R.jsxs)(`div`,{className:`row`,children:[(0,R.jsxs)(s,{"data-size":`sm`,className:`subtle`,children:[(0,R.jsx)(t,{n:4}),` Sak `,e.caseNumber,` · `,e.handler,` · Mottatt `,e.received]}),(0,R.jsxs)(`span`,{children:[(0,R.jsx)(t,{n:3}),` `,(0,R.jsx)(w,{status:e.status})]})]})]})})]}),(0,R.jsxs)(f.Ordered,{className:`places`,"data-size":`sm`,children:[(0,R.jsxs)(f.Item,{children:[(0,R.jsx)(`strong`,{children:`Øverst til venstre:`}),` det brukeren kjenner igjen saken på, som lenke når den kan åpnes.`]}),(0,R.jsxs)(f.Item,{children:[(0,R.jsx)(`strong`,{children:`Øverst til høyre:`}),` det nest viktigste, ofte en dato eller et beløp.`]}),(0,R.jsxs)(f.Item,{children:[(0,R.jsx)(`strong`,{children:`Nederst til høyre:`}),` status, med tekst og ikke bare farge.`]}),(0,R.jsxs)(f.Item,{children:[(0,R.jsx)(`strong`,{children:`Nederst til venstre:`}),` resten, i dempet tekst og skilt med prikk.`]})]}),(0,R.jsx)(s,{"data-size":`sm`,children:`Kolonneoverskriftene faller bort. Saksnavn og status forklarer seg selv. Datoer og nummer får et ord foran («Oppdatert», «Sak», «Mottatt») i stedet for etikett, så de er forståelige uten overskrift.`})]})}function J({id:e,large:r=!1}){let i=(0,N.useId)(),[c,l]=(0,N.useState)(``),[u,d]=(0,N.useState)([]),f=e=>d(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]),[h,g]=(0,N.useState)(`nyest`),_=c.trim().toLocaleLowerCase(`nb`),y=j.filter(e=>(!u.length||u.includes(e.status))&&(!_||[e.title,e.caseNumber,e.handler].some(e=>e.toLocaleLowerCase(`nb`).includes(_)))).sort(C.find(e=>e.value===h).cmp);return(0,R.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,R.jsx)(T,{id:e,total:j.length}),(0,R.jsx)(`div`,{className:`controls`,children:(0,R.jsxs)(v,{"data-size":`sm`,children:[(0,R.jsx)(n,{children:`Søk i sakene`}),(0,R.jsxs)(`div`,{className:`search-field`,children:[(0,R.jsx)(o,{type:`search`,enterKeyHint:`search`,placeholder:` `,value:c,onChange:e=>l(e.target.value),onKeyDown:e=>e.key===`Escape`&&l(``)}),c&&(0,R.jsx)(a,{type:`button`,variant:`tertiary`,"data-size":`sm`,icon:!0,"aria-label":`Tøm søkefeltet`,className:`search-field__clear`,onClick:e=>{l(``),e.currentTarget.parentElement.querySelector(`input`)?.focus()},children:(0,R.jsx)(t,{"aria-hidden":!0})})]})]})}),(0,R.jsxs)(m,{"data-size":`sm`,children:[(0,R.jsx)(m.Legend,{children:`Sorter etter`}),(0,R.jsx)(`div`,{className:`chips`,children:C.map(e=>(0,R.jsx)(p.Radio,{"data-size":`sm`,name:`${i}-sort`,value:e.value,checked:h===e.value,onChange:()=>g(e.value),children:e.label},e.value))})]}),(0,R.jsxs)(m,{"data-size":`sm`,children:[(0,R.jsx)(m.Legend,{children:`Status`}),(0,R.jsx)(m.Description,{children:`Velg én eller flere. Ingen valgt viser alle.`}),(0,R.jsx)(`div`,{className:`chips`,children:O.map(e=>(0,R.jsx)(p.Checkbox,{"data-size":`sm`,name:`${i}-status`,value:e,checked:u.includes(e),onChange:()=>f(e),children:e},e))})]}),(_||u.length>0)&&(0,R.jsxs)(`div`,{className:`active-filters`,children:[(0,R.jsx)(s,{"data-size":`sm`,className:`subtle`,id:`${i}-active`,children:`Valgte filtre:`}),(0,R.jsxs)(`ul`,{"aria-labelledby":`${i}-active`,children:[_&&(0,R.jsx)(`li`,{children:(0,R.jsx)(p.Removable,{"data-size":`sm`,"aria-label":`Fjern søk ${c.trim()}`,onClick:()=>l(``),children:c.trim()})}),u.map(e=>(0,R.jsx)(`li`,{children:(0,R.jsx)(p.Removable,{"data-size":`sm`,"aria-label":`Fjern ${e}`,onClick:()=>f(e),children:e})},e)),(0,R.jsx)(`li`,{children:(0,R.jsx)(p.Button,{"data-size":`sm`,onClick:()=>{l(``),d([])},children:`Tøm alle filtre`})})]})]}),(0,R.jsx)(s,{role:`status`,"data-size":`sm`,className:`meta`,children:y.length===0?`Ingen saker passer søket`:`Viser ${y.length} av ${j.length} saker`}),y.length>0&&(r?(0,R.jsx)(D,{items:y,labelledBy:e}):(0,R.jsx)(B,{items:y,labelledBy:e}))]})}var Y=[{id:`ko-1`,title:`Søknad om byggetillatelse, Storgata 12`,received:`02.10.2026`,answer:`Uke 48`},{id:`ko-2`,title:`Søknad om ferdigattest, Bakkeveien 3`,received:`05.10.2026`,answer:`Uke 49`},{id:`ko-3`,title:`Søknad om byggetillatelse, Elvegata 7`,received:`12.10.2026`,answer:`Uke 50`},{id:`ko-4`,title:`Søknad om dispensasjon, Fjellveien 21`,received:`19.10.2026`,answer:`Uke 51`},{id:`ko-5`,title:`Søknad om rivetillatelse, Torget 1`,received:`27.10.2026`,answer:`Uke 2`}],X=[`Plass`,`Søknad`,`Mottatt`,`Forventet svar`];function Z({labelledBy:e}){return(0,R.jsxs)(`div`,{className:`ol-table`,children:[(0,R.jsx)(`div`,{className:`ol-table__head`,"aria-hidden":!0,children:X.map(e=>(0,R.jsx)(`span`,{children:e},e))}),(0,R.jsx)(`ol`,{className:`ol-table__list`,role:`list`,"aria-labelledby":e,children:Y.map(e=>(0,R.jsxs)(`li`,{children:[(0,R.jsx)(u,{level:4,"data-size":`2xs`,className:`ol-table__title`,children:(0,R.jsx)(c,{href:`#${e.id}`,children:e.title})}),(0,R.jsxs)(s,{"data-size":`sm`,className:`num`,children:[(0,R.jsx)(`span`,{className:`ol-table__label`,children:`Mottatt `}),e.received]}),(0,R.jsxs)(s,{"data-size":`sm`,className:`num`,children:[(0,R.jsx)(`span`,{className:`ol-table__label`,children:`Forventet svar `}),e.answer]})]},e.id))})]})}function Q({id:e}){return(0,R.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,R.jsx)(u,{level:3,"data-size":`sm`,id:e,children:`Køen hos byggesak`}),(0,R.jsxs)(s,{"data-size":`sm`,className:`meta`,children:[`Søknadene behandles i den rekkefølgen de kom inn. `,(0,R.jsx)(d,{"data-size":`sm`,"data-color":`warning`,children:`Fiktive søknader`})]}),(0,R.jsx)(Z,{labelledBy:e})]})}function $(){let e=[...j].sort(M);return(0,R.jsxs)(`main`,{className:`art`,children:[(0,R.jsx)(b,{current:`Liste`}),(0,R.jsxs)(`header`,{children:[(0,R.jsxs)(s,{"data-size":`sm`,className:`eyebrow`,children:[`Mønster: Strukturert informasjon · `,(0,R.jsx)(d,{"data-size":`sm`,"data-color":`warning`,children:`Utkast`})]}),(0,R.jsx)(u,{level:1,"data-size":`lg`,children:`Liste`}),(0,R.jsx)(s,{children:`Listen er riktig når brukeren skal finne eller skanne én oppføring, og ikke sammenligne mange verdier på tvers av oppføringene. På små skjermer blir hver rad i tabellen en oppføring i listen, med det viktigste først.`})]}),(0,R.jsxs)(`section`,{children:[(0,R.jsx)(u,{level:2,"data-size":`md`,children:`Stablet liste`}),(0,R.jsx)(s,{children:`Når brukeren skal kjenne igjen én sak blant mange, og hver sak har få opplysninger.`}),(0,R.jsx)(u,{level:3,"data-size":`sm`,children:`Fire faste plasser per oppføring`}),(0,R.jsx)(q,{}),(0,R.jsx)(k,{id:`stacked`,code:[{label:`Liste`,code:S(F,`StackedItem`,`StackedList`)},{label:`Tabell`,code:S(L,`CaseTable`)},{label:`CSS`,code:x(I,`Stablet liste`,`Gruppert liste`)}],smallLabel:`Stablet liste, liten skjerm`,caption:`Seks kolonner blir to linjer per sak. Hver verdi har en fast plass: navnet øverst til venstre, sist oppdatert øverst til høyre, status nederst til høyre. Verdier som ikke forklarer seg selv, har et ord foran («Sak», «Oppdatert»), så de er forståelige uten kolonneoverskrift. Navnet er en overskrift med lenke, så skjermleserbrukere kan hoppe fra sak til sak.`,render:t=>(0,R.jsx)(A,{id:t,children:(0,R.jsx)(B,{items:e,labelledBy:t})})})]}),(0,R.jsxs)(`section`,{children:[(0,R.jsx)(u,{level:2,"data-size":`md`,children:`Liste med søk, filter og sortering`}),(0,R.jsx)(s,{children:`Når listen er så lang at brukeren ikke finner saken ved å skanne. Søk, filter og sortering virker likt i tabellen og listen.`}),(0,R.jsx)(k,{id:`search`,code:[{label:`Søk, filter og sortering`,code:S(F,`SearchableCases`)},{label:`CSS`,code:x(I,`Søk og filter`,`Dialog-knapp`)}],smallLabel:`Liste med søk og filter, liten skjerm`,large:(0,R.jsx)(J,{id:`search-large`,large:!0}),caption:`Søk, sortering og statusfilter står over listen og virker likt i tabellen og listen. Sorteringen har fire valg, så den er filterbrikker der brukeren velger ett, og ikke en nedtrekksliste. Statusfilteret er filterbrikker der brukeren kan velge flere statuser samtidig. Valgte filtre vises samlet over listen, der hvert filter kan fjernes for seg. Antall treff leses opp av skjermleser når listen endres.`,render:e=>(0,R.jsx)(J,{id:e})})]}),(0,R.jsxs)(`section`,{children:[(0,R.jsx)(u,{level:2,"data-size":`md`,children:`Gruppert liste`}),(0,R.jsx)(s,{children:`Når oppføringene har en naturlig inndeling, og noen grupper er viktigere enn andre. Her kommer sakene som venter på brukeren, først.`}),(0,R.jsx)(k,{id:`grouped`,code:[{label:`Liste`,code:S(F,`GroupedList`)},{label:`CSS`,code:x(I,`Gruppert liste`,`Detaljer ved behov`)}],smallLabel:`Liste gruppert etter status, liten skjerm`,caption:`Status er flyttet fra hver oppføring til en gruppeoverskrift, så hver sak trenger færre opplysninger. Gruppeoverskriftene er ekte overskrifter, og hver gruppe er en egen liste. Det gir struktur for skjermlesere og KI-agenter, og ikke bare visuelt.`,render:e=>(0,R.jsx)(A,{id:e,children:(0,R.jsx)(V,{items:j})})})]}),(0,R.jsxs)(`section`,{children:[(0,R.jsx)(u,{level:2,"data-size":`md`,children:`Liste med detaljer ved behov`}),(0,R.jsx)(s,{children:`Når brukeren trenger noen få nøkkelopplysninger for å finne saken, og resten bare av og til.`}),(0,R.jsx)(k,{id:`details`,code:[{label:`Liste`,code:S(F,`DetailsList`)},{label:`CSS`,code:x(I,`Detaljer ved behov`,`Søk og filter`)}],smallLabel:`Liste med detaljer som kan vises, liten skjerm`,caption:`Navn og status er alltid synlige. Resten ligger under «Detaljer om saken», med etikett og verdi som radoverskrift og celle. Ingen opplysninger er fjernet, bare lagt ett trykk unna. Lenken i navnet åpner saken, så knappen for detaljer og lenken gjør hver sin ting.`,render:t=>(0,R.jsx)(A,{id:t,children:(0,R.jsx)(H,{items:e,labelledBy:t})})})]}),(0,R.jsxs)(`section`,{children:[(0,R.jsx)(u,{level:2,"data-size":`md`,children:`Liste med mer informasjon i dialog`}),(0,R.jsx)(s,{children:`Når detaljene er for mange eller for store til å vises inne i listen, men brukeren ikke trenger å åpne hele saken.`}),(0,R.jsx)(k,{id:`dialog`,code:[{label:`Liste`,code:S(F,`DialogList`,`detailRows`,`CaseDialog`)},{label:`Tabell`,code:S(F,`DialogTable`)}],smallLabel:`Liste med dialog for mer informasjon, liten skjerm`,large:(0,R.jsx)(A,{id:`dialog-large`,children:(0,R.jsx)(K,{items:e,labelledBy:`dialog-large`})}),caption:`Listen er den samme stablede listen. På liten skjerm åpner «Mer om saken» en dialog nederst på skjermen med alle opplysningene som etikett og verdi. På stor skjerm åpnes samme dialog fra tabellen, midt på skjermen. Brukeren blir på samme sted og kommer tilbake til knappen når dialogen lukkes.`,render:t=>(0,R.jsx)(A,{id:t,children:(0,R.jsx)(G,{items:e,labelledBy:t})})})]}),(0,R.jsxs)(`section`,{children:[(0,R.jsx)(u,{level:2,"data-size":`md`,children:`Nummerert liste som ser ut som en tabell`}),(0,R.jsx)(s,{children:`Når rekkefølgen er en del av innholdet, for eksempel en kø, og hver oppføring har noen få verdier som bør stå på linje på stor skjerm.`}),(0,R.jsx)(k,{id:`queue`,code:[{label:`Liste`,code:S(F,`QueueList`)},{label:`CSS`,code:x(I,`---------- Nummerert liste`)}],smallLabel:`Nummerert liste, liten skjerm`,large:(0,R.jsx)(Q,{id:`queue-large`}),caption:`Det er samme nummererte liste på begge skjermene. På stor skjerm står verdiene i kolonner med en overskriftsrad over, så den ser ut som en tabell. På liten skjerm stables hver oppføring, og etiketten står foran verdien. Overskriftsraden er bare visuell. For skjermlesere har hver verdi sin egen etikett, og plassen kommer fra nummereringen. Brukeren kan ikke bevege seg opp og ned i en kolonne slik som i en ekte tabell. Skal brukeren sammenligne verdier på tvers av oppføringene, er en tabell med en kolonne for plass bedre.`,render:e=>(0,R.jsx)(Q,{id:e})})]})]})}export{I as a,J as i,$ as n,F as o,q as r,H as t};