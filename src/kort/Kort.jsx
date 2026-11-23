import { useId, useRef, useState } from "react";
import {
  Button,
  Card,
  ErrorSummary,
  Heading,
  Link,
  List,
  Paragraph,
  Popover,
  Table,
  Tag,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import HifiNav from "../components/HifiNav.jsx";
import { CASES, StatusTag, byNewest, Intro, Example, Small } from "../components/cases.jsx";

/* Hi-fi av korteksemplene: tabell på stor skjerm → kort på liten skjerm.
   Sakene er de samme som på listesiden. Kostnadene er fiktive. */

const sorted = [...CASES].sort(byNewest);

/** Etikett og verdi som radoverskrift og celle, så koblingen er med i koden */
function KeyValue({ label, rows }) {
  return (
    <Table data-size="sm" className="kv">
      <caption className="ds-sr-only">{label}</caption>
      <Table.Body>
        {rows.map(([k, v]) => (
          <Table.Row key={k}>
            <Table.HeaderCell scope="row">{k}</Table.HeaderCell>
            <Table.Cell>{v}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

/* ---------- Etikett og verdi ---------- */

function LabelValueCards({ items, labelledBy }) {
  return (
    <List.Unordered className="cards" aria-labelledby={labelledBy}>
      {items.map((c) => (
        <List.Item key={c.id}>
          <Card data-color="neutral">
            <Card.Block>
              <Heading level={4} data-size="2xs">
                <Link href={`#${c.id}`}>{c.title}</Link>
              </Heading>
            </Card.Block>
            <Card.Block>
              <KeyValue
                label={c.title}
                rows={[
                  ["Saksnummer", c.caseNumber],
                  ["Status", <StatusTag key="s" status={c.status} />],
                  ["Mottatt", c.received],
                  ["Sist oppdatert", c.updated],
                  ["Behandler", c.handler],
                ]}
              />
            </Card.Block>
          </Card>
        </List.Item>
      ))}
    </List.Unordered>
  );
}

/* ---------- Mer kompakt ---------- */

/**
 * To verdier side om side med etiketten over, og resten på en linje under.
 * De to verdiene er en liten tabell med kolonneoverskrifter, så koblingen
 * mellom etikett og verdi er med i koden.
 */
function CompactCards({ items, labelledBy, grid = false }) {
  return (
    <List.Unordered className={grid ? "cards cards--grid" : "cards"} aria-labelledby={labelledBy}>
      {items.map((c) => (
        <List.Item key={c.id}>
          <Card data-color="neutral" className="compact">
            <Heading level={4} data-size="2xs">
              <Link href={`#${c.id}`}>{c.title}</Link>
            </Heading>
            <Table data-size="sm" className="pair">
              <caption className="ds-sr-only">{c.title}</caption>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Sist oppdatert</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><StatusTag status={c.status} /></Table.Cell>
                  <Table.Cell className="num">{c.updated}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Paragraph data-size="sm" className="subtle">
              Sak {c.caseNumber} · {c.handler}
            </Paragraph>
          </Card>
        </List.Item>
      ))}
    </List.Unordered>
  );
}

/* ---------- Med handlinger ---------- */

const COSTS = [
  { id: "husleie", name: "Husleie", category: "Drift", amount: 120000 },
  { id: "konsulent", name: "Konsulenttjenester", category: "Innkjøp", amount: null },
  { id: "reise", name: "Reise til Bergen", category: "Reise", amount: 48500 },
  { id: "lisenser", name: "Programvarelisenser", category: "Drift", amount: 9900 },
];
const ERROR = "Fyll inn beløp.";
const kr = (n) => `${n.toLocaleString("nb-NO")} kr`;

function EditButton({ item }) {
  return (
    <Button variant="secondary" data-size="sm" aria-label={`Endre ${item.name}`}>
      Endre
    </Button>
  );
}

/** Slett ber om bekreftelse i en popover, så brukeren ikke sletter ved et uhell */
function DeleteButton({ item, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.TriggerContext>
      <Popover.Trigger
        variant="secondary"
        data-size="sm"
        aria-label={`Slett ${item.name}`}
        onClick={() => setOpen((o) => !o)}
      >
        Slett
      </Popover.Trigger>
      <Popover open={open} onClose={() => setOpen(false)} placement="top">
        {/* Oppsettet ligger på et eget element: display på selve popoveren ville vist den også når den er lukket */}
        <div className="confirm">
          <Paragraph data-size="sm">Vil du slette «{item.name}»? Du kan ikke angre.</Paragraph>
          <div className="confirm__buttons">
            <Button data-size="sm" data-color="danger" onClick={onDelete}>Ja, slett</Button>
            <Button data-size="sm" variant="secondary" onClick={() => setOpen(false)}>Avbryt</Button>
          </div>
        </div>
      </Popover>
    </Popover.TriggerContext>
  );
}

function CostTable({ items, onDelete }) {
  return (
    <Table data-size="sm" className="cost-table">
      <caption className="ds-sr-only">Kostnader</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope="col">Kostnad</Table.HeaderCell>
          <Table.HeaderCell scope="col">Kategori</Table.HeaderCell>
          <Table.HeaderCell scope="col" className="num-col">Beløp</Table.HeaderCell>
          {/* Ett interaktivt element per celle, slik retningslinjene for Table sier */}
          <Table.HeaderCell scope="colgroup" colSpan={2}><span className="ds-sr-only">Handlinger</span></Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {items.map((c) => {
          const error = c.amount == null;
          return (
            <Table.Row key={c.id} id={`${c.id}-t`} tabIndex={-1} className={error ? "has-error" : undefined}>
              <Table.HeaderCell scope="row" className="plain">{c.name}</Table.HeaderCell>
              <Table.Cell>{c.category}</Table.Cell>
              <Table.Cell className="num-col">
                {error ? <ValidationMessage data-size="sm">{ERROR}</ValidationMessage> : kr(c.amount)}
              </Table.Cell>
              <Table.Cell className="action-cell"><EditButton item={c} /></Table.Cell>
              <Table.Cell className="action-cell"><DeleteButton item={c} onDelete={() => onDelete(c.id)} /></Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

/** Hver kostnad blir et kort: navn og beløp øverst, feilen under, Endre og Slett i en egen rad nederst */
function CostCards({ items, onDelete }) {
  return (
    <List.Unordered className="cards">
      {items.map((c) => {
        const error = c.amount == null;
        return (
          <List.Item key={c.id}>
            <Card
              id={`${c.id}-k`}
              tabIndex={-1}
              variant={error ? "tinted" : "default"}
              data-color={error ? "danger" : "neutral"}
            >
              <Card.Block className="cost-card__body">
                <div className="cost-card__top">
                  <Heading level={4} data-size="2xs">{c.name}</Heading>
                  {!error && <Paragraph data-size="sm" className="num">{kr(c.amount)}</Paragraph>}
                </div>
                <Paragraph data-size="sm" className="subtle">{c.category}</Paragraph>
                {error && <ValidationMessage data-size="sm">{ERROR}</ValidationMessage>}
                <div className="actions actions--card">
                  <EditButton item={c} />
                  <DeleteButton item={c} onDelete={() => onDelete(c.id)} />
                </div>
              </Card.Block>
            </Card>
          </List.Item>
        );
      })}
    </List.Unordered>
  );
}

function Costs({ large = false }) {
  const id = useId();
  const headingRef = useRef(null);
  const [items, setItems] = useState(COSTS);
  const [showSummary, setShowSummary] = useState(false);
  const withErrors = items.filter((c) => c.amount == null);
  // Raden eller kortet med fokus forsvinner, så fokus flyttes til overskriften
  const remove = (costId) => {
    setItems((prev) => prev.filter((c) => c.id !== costId));
    headingRef.current?.focus();
  };

  return (
    <div className="frame__content hifi">
      <div className="stack-1">
        <Paragraph data-size="sm" className="subtle">Søknad om tilskudd · Steg 2 av 4</Paragraph>
        <Heading level={3} data-size="sm" id={id} ref={headingRef} tabIndex={-1}>Kostnader</Heading>
      </div>
      {/* Bare for skjermlesere: leses opp når en kostnad slettes */}
      <p role="status" className="ds-sr-only">
        {items.length} kostnader{withErrors.length > 0 && `, ${withErrors.length} må rettes`}
      </p>
      {large ? <CostTable items={items} onDelete={remove} /> : <CostCards items={items} onDelete={remove} />}
      {showSummary && withErrors.length > 0 && (
        <ErrorSummary data-size="sm">
          <ErrorSummary.Heading>For å gå videre må du rette opp følgende feil:</ErrorSummary.Heading>
          <ErrorSummary.List>
            {withErrors.map((c) => (
              <ErrorSummary.Item key={c.id}>
                <ErrorSummary.Link href={`#${c.id}-${large ? "t" : "k"}`}>{c.name}: {ERROR}</ErrorSummary.Link>
              </ErrorSummary.Item>
            ))}
          </ErrorSummary.List>
        </ErrorSummary>
      )}
      {/* Neste steg er aldri deaktivert */}
      <div>
        <Button data-size="sm" className={large ? undefined : "full"} onClick={() => setShowSummary(true)}>
          Neste steg
        </Button>
      </div>
    </div>
  );
}

export default function Kort() {
  const few = sorted.slice(0, 6);

  return (
    <main className="art">
      <HifiNav current="Kort" />
      <header>
        <Paragraph data-size="sm" className="eyebrow">
          Mønster: Strukturert informasjon · <Tag data-size="sm" data-color="warning">Utkast</Tag>
        </Paragraph>
        <Heading level={1} data-size="lg">Kort</Heading>
        <Paragraph>
          Kortet er riktig når hver oppføring har flere egenskaper som hører sammen, eller når brukeren skal gjøre
          noe med én oppføring om gangen. Etikett og verdi står sammen i kortet, og handlingene får en egen rad
          nederst.
        </Paragraph>
      </header>

      <section>
        <Heading level={2} data-size="md">Etikett og verdi</Heading>
        <Paragraph>
          Når verdiene ikke forklarer seg selv, og brukeren trenger alle opplysningene for å kjenne igjen saken.
        </Paragraph>
        <Example
          id="kv"
          smallLabel="Kort med etikett og verdi, liten skjerm"
          caption="Hver rad i tabellen blir et kort. Etiketten står foran hver verdi, så ingen opplysninger mister sammenhengen med kolonneoverskriften. Saksnavnet er en lenke, så kortet trenger ingen pil."
          render={(id) => (
            <Small id={id}><LabelValueCards items={sorted} labelledBy={id} /></Small>
          )}
        />
      </section>

      <section>
        <Heading level={2} data-size="md">Mer kompakt</Heading>
        <Paragraph>
          Når det er få oppføringer, rundt fem til sju, og hver har få opplysninger. Da kan kortene brukes på alle
          skjermstørrelser.
        </Paragraph>
        <Example
          id="compact"
          smallLabel="Kompakte kort, liten skjerm"
          large={
            <Small id="compact-large"><CompactCards items={few} labelledBy="compact-large" grid /></Small>
          }
          caption="To verdier står side om side med etiketten over, og resten står på en linje under. Kortet tar mindre plass enn med etikett og verdi på hver linje. På stor skjerm står kortene i et rutenett i stedet for en tabell."
          render={(id) => (
            <Small id={id}><CompactCards items={few} labelledBy={id} /></Small>
          )}
        />
      </section>

      <section>
        <Heading level={2} data-size="md">Med handlinger</Heading>
        <Paragraph>
          Når brukeren skal gjøre noe med hver oppføring, for eksempel endre eller slette rader de har lagt inn selv
          i et skjema.
        </Paragraph>
        <Example
          id="actions"
          smallLabel="Kort med handlinger, liten skjerm"
          large={<Costs large />}
          caption="Endre og Slett står nederst i kortet, som i tabellen. Feilen står der beløpet skulle stått, og kortet får rød bakgrunn, så fargen ikke er eneste kjennetegn. Slett ber om bekreftelse. Neste steg er aldri deaktivert: trykker brukeren på den med feil, vises en feiloppsummering med lenke til kortet."
          render={() => <Costs />}
        />
      </section>
    </main>
  );
}
