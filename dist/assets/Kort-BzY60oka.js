import{B as e,D as t,F as n,G as r,H as i,I as a,R as o,W as s,_ as c,a as l,b as u,c as d,f,g as p,h as m,o as h,p as g,q as _,r as v,w as y,y as b}from"./DeviceFrame-BLfhRT72.js";import{i as x,n as S,r as C}from"./CodeExample-BWbKoMjZ.js";import{c as w,r as T,s as E,t as D,u as O}from"./cases-Dv2GKvFc.js";var k=_(r(),1),A=_(s(),1),j=i();function M({open:e,onClose:t,title:n,returnFocusRef:r,children:i}){let a=v(),o=(0,k.useId)(),s=(0,k.useRef)(null),c=(0,k.useRef)(t);if(c.current=t,(0,k.useEffect)(()=>{if(!e||!a)return;let t=document.activeElement,n=a.parentElement.querySelector(`.frame__screen`);n.inert=!0;let i=s.current;(i?.querySelector(`input, select, textarea`)??i?.querySelector(`button`))?.focus();let o=e=>e.key===`Escape`&&c.current();return document.addEventListener(`keydown`,o),()=>{n.inert=!1,document.removeEventListener(`keydown`,o);let e=r?.current??t;e?.isConnected&&e.focus()}},[e,a]),!e||!a)return null;let l=a.clientWidth<600;return(0,A.createPortal)((0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(`div`,{className:`frame__scrim`,onClick:t}),(0,j.jsxs)(u,{ref:s,open:!0,modal:!1,closeButton:`Lukk`,placement:l?`bottom`:`center`,"aria-labelledby":o,"aria-modal":`true`,onClose:t,children:[(0,j.jsx)(u.Block,{children:(0,j.jsx)(b,{level:2,"data-size":`xs`,id:o,children:n})}),(0,j.jsx)(u.Block,{children:i})]})]}),a)}var N=`import { useId, useRef, useState } from "react";
import {
  Button,
  Card,
  ErrorSummary,
  Heading,
  Link,
  List,
  Paragraph,
  Popover,
  Radio,
  Table,
  Textfield,
  Fieldset,
  Tag,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import HifiNav from "../components/HifiNav.jsx";
import FrameDialog from "../components/FrameDialog.jsx";
import { PlusIcon } from "@navikt/aksel-icons";
import { extract, cssBetween } from "../components/CodeExample.jsx";
import src from "./Kort.jsx?raw";
import css from "./kort.css?raw";
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
                <Link href={\`#\${c.id}\`}>{c.title}</Link>
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
              <Link href={\`#\${c.id}\`}>{c.title}</Link>
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
const CATEGORIES = ["Drift", "Innkjøp", "Reise", "Annet"];
const kr = (n) => \`\${n.toLocaleString("nb-NO")} kr\`;

/** Gjør «12 500», «12500» og «12 500,50» om til et tall. Gir NaN hvis det ikke er et tall. */
const parseKr = (v) => Number(v.replace(/[\\s\\u00a0]/g, "").replace(/kr$/i, "").replace(",", "."));

/**
 * Skjemaet for å legge til eller endre en kostnad. Feilene vises ved feltet
 * de gjelder når brukeren prøver å lagre. Fire kategorier gir radioknapper,
 * ikke Select, fordi Select brukes først fra 7 valg.
 */
function CostForm({ item, onSave, onCancel }) {
  const uid = useId();
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "Drift");
  const [amount, setAmount] = useState(item?.amount != null ? String(item.amount) : "");
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const n = parseKr(amount);
    const next = {
      name: name.trim() ? null : "Skriv hva kostnaden gjelder.",
      amount: !amount.trim()
        ? "Skriv beløpet i kroner."
        : Number.isNaN(n) ? "Beløpet må være et tall, for eksempel 12 500."
        : n <= 0 ? "Beløpet må være større enn 0 kr." : null,
    };
    setErrors(next);
    if (next.name || next.amount) {
      e.currentTarget.querySelector(next.name ? "input[name=name]" : "input[name=amount]")?.focus();
      return;
    }
    onSave({ ...item, name: name.trim(), category, amount: n });
  };

  return (
    <form className="cost-form" onSubmit={submit} noValidate>
      <Textfield data-size="sm" label="Hva gjelder kostnaden?" name="name" value={name}
        onChange={(e) => setName(e.target.value)} error={errors.name} autoComplete="off" />
      <Fieldset data-size="sm">
        <Fieldset.Legend>Kategori</Fieldset.Legend>
        {CATEGORIES.map((c) => (
          <Radio key={c} label={c} name={\`\${uid}-kategori\`} value={c}
            checked={category === c} onChange={() => setCategory(c)} />
        ))}
      </Fieldset>
      <Textfield data-size="sm" label="Beløp" name="amount" suffix="kr" inputMode="decimal"
        value={amount} onChange={(e) => setAmount(e.target.value)} error={errors.amount} autoComplete="off" />
      {/* Primær før sekundær, til venstre */}
      <div className="cost-form__buttons">
        <Button data-size="sm" type="submit">{item?.id ? "Lagre endringer" : "Legg til"}</Button>
        <Button data-size="sm" variant="secondary" type="button" onClick={onCancel}>Avbryt</Button>
      </div>
    </form>
  );
}

function EditButton({ item, onEdit }) {
  return (
    <Button variant="secondary" data-size="sm" aria-label={\`Endre \${item.name}\`} onClick={(e) => onEdit(item, e.currentTarget)}>
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
        aria-label={\`Slett \${item.name}\`}
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

function CostTable({ items, onDelete, onEdit }) {
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
            <Table.Row key={c.id} id={\`\${c.id}-t\`} tabIndex={-1} className={error ? "has-error" : undefined}>
              <Table.HeaderCell scope="row" className="plain">{c.name}</Table.HeaderCell>
              <Table.Cell>{c.category}</Table.Cell>
              <Table.Cell className="num-col">
                {error ? <ValidationMessage data-size="sm">{ERROR}</ValidationMessage> : kr(c.amount)}
              </Table.Cell>
              <Table.Cell className="action-cell"><EditButton item={c} onEdit={onEdit} /></Table.Cell>
              <Table.Cell className="action-cell"><DeleteButton item={c} onDelete={() => onDelete(c.id)} /></Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

/** Hver kostnad blir et kort: navn og beløp øverst, feilen under, Endre og Slett i en egen rad nederst */
function CostCards({ items, onDelete, onEdit }) {
  return (
    <List.Unordered className="cards">
      {items.map((c) => {
        const error = c.amount == null;
        return (
          <List.Item key={c.id}>
            <Card
              id={\`\${c.id}-k\`}
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
                  <EditButton item={c} onEdit={onEdit} />
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

export function Costs({ large = false }) {
  const id = useId();
  const headingRef = useRef(null);
  const [items, setItems] = useState(COSTS);
  const [showSummary, setShowSummary] = useState(false);
  const [editing, setEditing] = useState(null); // null, { } for ny, eller kostnaden som endres
  const [message, setMessage] = useState("");
  const triggerRef = useRef(null); // Knappen som åpnet skjemaet, så fokus kan gå tilbake dit
  const openForm = (item, trigger) => {
    triggerRef.current = trigger;
    setEditing(item);
  };
  const withErrors = items.filter((c) => c.amount == null);
  // Raden eller kortet med fokus forsvinner, så fokus flyttes til overskriften
  const remove = (costId) => {
    const gone = items.find((c) => c.id === costId);
    setItems((prev) => prev.filter((c) => c.id !== costId));
    setMessage(\`«\${gone?.name}» er slettet.\`);
    headingRef.current?.focus();
  };
  const save = (cost) => {
    if (cost.id) {
      setItems((prev) => prev.map((c) => (c.id === cost.id ? cost : c)));
      setMessage(\`«\${cost.name}» er endret.\`);
    } else {
      setItems((prev) => [...prev, { ...cost, id: \`ny-\${Date.now()}\` }]);
      setMessage(\`«\${cost.name}» er lagt til.\`);
    }
    setEditing(null);
  };
  const next = () => {
    setShowSummary(true);
    setMessage(withErrors.length ? "" : "Alle kostnadene er fylt ut. I en ekte løsning går du nå videre til steg 3.");
  };

  return (
    <div className="frame__content hifi">
      <div className="stack-1">
        <Paragraph data-size="sm" className="subtle">Søknad om tilskudd · Steg 2 av 4</Paragraph>
        <Heading level={3} data-size="sm" id={id} ref={headingRef} tabIndex={-1}>Kostnader</Heading>
      </div>
      {/* Leses opp når en kostnad legges til, endres eller slettes */}
      <Paragraph data-size="sm" role="status" className="meta">{message}</Paragraph>
      {large
        ? <CostTable items={items} onDelete={remove} onEdit={openForm} />
        : <CostCards items={items} onDelete={remove} onEdit={openForm} />}
      <div>
        <Button data-size="sm" variant="secondary" className={large ? undefined : "full"} onClick={(e) => openForm({}, e.currentTarget)}>
          <PlusIcon aria-hidden />
          Legg til kostnad
        </Button>
      </div>
      <FrameDialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        returnFocusRef={triggerRef}
        title={editing?.id ? \`Endre «\${editing.name}»\` : "Legg til kostnad"}
      >
        {editing !== null && (
          <CostForm key={editing.id ?? "ny"} item={editing} onSave={save} onCancel={() => setEditing(null)} />
        )}
      </FrameDialog>
      {showSummary && withErrors.length > 0 && (
        <ErrorSummary data-size="sm">
          <ErrorSummary.Heading>For å gå videre må du rette opp følgende feil:</ErrorSummary.Heading>
          <ErrorSummary.List>
            {withErrors.map((c) => (
              <ErrorSummary.Item key={c.id}>
                <ErrorSummary.Link href={\`#\${c.id}-\${large ? "t" : "k"}\`}>{c.name}: {ERROR}</ErrorSummary.Link>
              </ErrorSummary.Item>
            ))}
          </ErrorSummary.List>
        </ErrorSummary>
      )}
      {/* Neste steg er aldri deaktivert */}
      <div>
        <Button data-size="sm" className={large ? undefined : "full"} onClick={next}>
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
          code={[
            { label: "Kort", code: extract(src, "LabelValueCards", "KeyValue") },
            { label: "CSS", code: cssBetween(css, "Kortlister", "Kompakt") },
          ]}
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
          code={[
            { label: "Kort", code: extract(src, "CompactCards") },
            { label: "CSS", code: cssBetween(css, "Kortlister", "Etikett og verdi") + "\\n\\n" + cssBetween(css, "Kompakt", "Med handlinger") },
          ]}
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
          code={[
            { label: "Kort", code: extract(src, "CostCards", "EditButton", "DeleteButton") },
            { label: "Skjema", code: extract(src, "CostForm", "parseKr") },
            { label: "Tabell", code: extract(src, "CostTable") },
            { label: "Siden", code: extract(src, "Costs") },
            { label: "CSS", code: cssBetween(css, "Med handlinger", "Stor skjerm") },
          ]}
          smallLabel="Kort med handlinger, liten skjerm"
          large={<Costs large />}
          caption="Endre og Slett står nederst i kortet, som i tabellen. Feilen står der beløpet skulle stått, og kortet får rød bakgrunn, så fargen ikke er eneste kjennetegn. Slett ber om bekreftelse. Neste steg er aldri deaktivert: trykker brukeren på den med feil, vises en feiloppsummering med lenke til kortet. Endre og «Legg til kostnad» åpner et skjema i en dialog. Feil vises ved feltet de gjelder. Når brukeren lagrer, oppdateres tabellen eller kortet, en melding sier hva som skjedde, og fokus går tilbake til knappen."
          render={() => <Costs />}
        />
      </section>
    </main>
  );
}
`,P=`/* Hi-fi kort: bare oppsett som Designsystemet ikke dekker direkte */
.hifi { display: flex; flex-direction: column; gap: var(--ds-size-3); padding-top: var(--ds-size-4); }
.hifi > * { margin: 0; }
.meta { color: var(--ds-color-neutral-text-subtle); display: flex; flex-wrap: wrap; align-items: center; gap: var(--ds-size-2); margin: 0; }
.subtle { color: var(--ds-color-neutral-text-subtle); font-weight: 400; }
.num { font-variant-numeric: tabular-nums; white-space: nowrap; }
.art > header { display: flex; flex-direction: column; gap: var(--ds-size-3); }
.stack-1 { display: flex; flex-direction: column; gap: var(--ds-size-1); }
.stack-1 > * { margin: 0; }
.case-table { width: 100%; }
.case-table th[scope="row"] { font-weight: 400; }

/* Kortlister */
.cards { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--ds-size-3); }
.cards > li { margin: 0; }
.cards--grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); }
.cards .ds-card > * { margin: 0; }

/* Etikett og verdi */
.kv { width: 100%; }
.kv th { width: 45%; font-weight: 400; color: var(--ds-color-neutral-text-subtle); }
.kv td { font-weight: 500; }

/* Kompakt: to verdier side om side, etiketten over */
.compact { display: flex; flex-direction: column; gap: var(--ds-size-2); }
.pair {
  --dsc-table-background: transparent;
  --dsc-table-header-background: transparent;
  --dsc-table-divider-border-width: 0;
  --dsc-table-border-width: 0;
  --dsc-table-padding: 0 var(--ds-size-4) 0 0;
  table-layout: fixed;
  width: 100%;
}
.pair th { font-weight: 400; color: var(--ds-color-neutral-text-subtle); }
.pair td { border-bottom: 0; font-weight: 500; }

/* Med handlinger */
.cost-table { width: 100%; }
.cost-table .plain { font-weight: inherit; }
.cost-table .has-error { --dsc-table-background: var(--ds-color-danger-surface-tinted); }
.num-col { text-align: right; font-variant-numeric: tabular-nums; }
.cost-card__body { display: flex; flex-direction: column; gap: var(--ds-size-1); }
.cost-card__body > * { margin: 0; }
.cost-card__top { display: flex; justify-content: space-between; align-items: baseline; gap: var(--ds-size-3); }
.cost-card__top > * { margin: 0; }
/* Endre og Slett: to like knapper ved siden av hverandre */
.action-cell { width: 1%; white-space: nowrap; }
.actions { display: flex; gap: var(--ds-size-2); }
.actions--card { display: grid; grid-template-columns: 1fr 1fr; margin-top: var(--ds-size-2); }
.actions--card > * { justify-content: center; width: 100%; }
.cost-table .ds-validation-message { justify-content: flex-end; }
.confirm { display: flex; flex-direction: column; gap: var(--ds-size-3); max-width: 18rem; }
.confirm > p { margin: 0; }
.confirm__buttons { display: flex; flex-wrap: wrap; gap: var(--ds-size-2); }
.full { width: 100%; justify-content: center; }
.table-scroll { overflow-x: auto; }
/* Stor skjerm: litt mindre luft i cellene, så alle kolonnene får plass i rammen */
.case-table.ds-table { --dsc-table-padding: var(--ds-size-2) var(--ds-size-2); }
/* Hi-fi-sidene får bredere flate, så desktop-rammen har plass til hele tabellen */
.art { max-width: 90rem; }
.case-table .ds-button { white-space: nowrap; }
.frame--browser .frame__content.hifi { padding-inline: var(--ds-size-4); }
.case-table :is(th, td) { padding-inline: var(--ds-size-2); }
.case-table .ds-tag { white-space: normal; }

/* Skjemaet for å legge til eller endre en kostnad */
.cost-form { display: flex; flex-direction: column; gap: var(--ds-size-4); }
.cost-form__buttons { display: flex; flex-wrap: wrap; gap: var(--ds-size-3); }
`,F=[...D].sort(O);function I({label:e,rows:t}){return(0,j.jsxs)(d,{"data-size":`sm`,className:`kv`,children:[(0,j.jsx)(`caption`,{className:`ds-sr-only`,children:e}),(0,j.jsx)(d.Body,{children:t.map(([e,t])=>(0,j.jsxs)(d.Row,{children:[(0,j.jsx)(d.HeaderCell,{scope:`row`,children:e}),(0,j.jsx)(d.Cell,{children:t})]},e))})]})}function L({items:t,labelledBy:n}){return(0,j.jsx)(c.Unordered,{className:`cards`,"aria-labelledby":n,children:t.map(t=>(0,j.jsx)(c.Item,{children:(0,j.jsxs)(y,{"data-color":`neutral`,children:[(0,j.jsx)(y.Block,{children:(0,j.jsx)(b,{level:4,"data-size":`2xs`,children:(0,j.jsx)(e,{href:`#${t.id}`,children:t.title})})}),(0,j.jsx)(y.Block,{children:(0,j.jsx)(I,{label:t.title,rows:[[`Saksnummer`,t.caseNumber],[`Status`,(0,j.jsx)(w,{status:t.status},`s`)],[`Mottatt`,t.received],[`Sist oppdatert`,t.updated],[`Behandler`,t.handler]]})})]})},t.id))})}function R({items:t,labelledBy:r,grid:i=!1}){return(0,j.jsx)(c.Unordered,{className:i?`cards cards--grid`:`cards`,"aria-labelledby":r,children:t.map(t=>(0,j.jsx)(c.Item,{children:(0,j.jsxs)(y,{"data-color":`neutral`,className:`compact`,children:[(0,j.jsx)(b,{level:4,"data-size":`2xs`,children:(0,j.jsx)(e,{href:`#${t.id}`,children:t.title})}),(0,j.jsxs)(d,{"data-size":`sm`,className:`pair`,children:[(0,j.jsx)(`caption`,{className:`ds-sr-only`,children:t.title}),(0,j.jsx)(d.Head,{children:(0,j.jsxs)(d.Row,{children:[(0,j.jsx)(d.HeaderCell,{scope:`col`,children:`Status`}),(0,j.jsx)(d.HeaderCell,{scope:`col`,children:`Sist oppdatert`})]})}),(0,j.jsx)(d.Body,{children:(0,j.jsxs)(d.Row,{children:[(0,j.jsx)(d.Cell,{children:(0,j.jsx)(w,{status:t.status})}),(0,j.jsx)(d.Cell,{className:`num`,children:t.updated})]})})]}),(0,j.jsxs)(n,{"data-size":`sm`,className:`subtle`,children:[`Sak `,t.caseNumber,` · `,t.handler]})]})},t.id))})}var z=[{id:`husleie`,name:`Husleie`,category:`Drift`,amount:12e4},{id:`konsulent`,name:`Konsulenttjenester`,category:`Innkjøp`,amount:null},{id:`reise`,name:`Reise til Bergen`,category:`Reise`,amount:48500},{id:`lisenser`,name:`Programvarelisenser`,category:`Drift`,amount:9900}],B=`Fyll inn beløp.`,V=[`Drift`,`Innkjøp`,`Reise`,`Annet`],H=e=>`${e.toLocaleString(`nb-NO`)} kr`,U=e=>Number(e.replace(/[\s\u00a0]/g,``).replace(/kr$/i,``).replace(`,`,`.`));function W({item:e,onSave:t,onCancel:n}){let r=(0,k.useId)(),[i,a]=(0,k.useState)(e?.name??``),[s,c]=(0,k.useState)(e?.category??`Drift`),[u,d]=(0,k.useState)(e?.amount==null?``:String(e.amount)),[p,h]=(0,k.useState)({});return(0,j.jsxs)(`form`,{className:`cost-form`,onSubmit:n=>{n.preventDefault();let r=U(u),a={name:i.trim()?null:`Skriv hva kostnaden gjelder.`,amount:u.trim()?Number.isNaN(r)?`Beløpet må være et tall, for eksempel 12 500.`:r<=0?`Beløpet må være større enn 0 kr.`:null:`Skriv beløpet i kroner.`};h(a),a.name||a.amount?n.currentTarget.querySelector(a.name?`input[name=name]`:`input[name=amount]`)?.focus():t({...e,name:i.trim(),category:s,amount:r})},noValidate:!0,children:[(0,j.jsx)(l,{"data-size":`sm`,label:`Hva gjelder kostnaden?`,name:`name`,value:i,onChange:e=>a(e.target.value),error:p.name,autoComplete:`off`}),(0,j.jsxs)(m,{"data-size":`sm`,children:[(0,j.jsx)(m.Legend,{children:`Kategori`}),V.map(e=>(0,j.jsx)(f,{label:e,name:`${r}-kategori`,value:e,checked:s===e,onChange:()=>c(e)},e))]}),(0,j.jsx)(l,{"data-size":`sm`,label:`Beløp`,name:`amount`,suffix:`kr`,inputMode:`decimal`,value:u,onChange:e=>d(e.target.value),error:p.amount,autoComplete:`off`}),(0,j.jsxs)(`div`,{className:`cost-form__buttons`,children:[(0,j.jsx)(o,{"data-size":`sm`,type:`submit`,children:e?.id?`Lagre endringer`:`Legg til`}),(0,j.jsx)(o,{"data-size":`sm`,variant:`secondary`,type:`button`,onClick:n,children:`Avbryt`})]})]})}function G({item:e,onEdit:t}){return(0,j.jsx)(o,{variant:`secondary`,"data-size":`sm`,"aria-label":`Endre ${e.name}`,onClick:n=>t(e,n.currentTarget),children:`Endre`})}function K({item:e,onDelete:t}){let[r,i]=(0,k.useState)(!1);return(0,j.jsxs)(g.TriggerContext,{children:[(0,j.jsx)(g.Trigger,{variant:`secondary`,"data-size":`sm`,"aria-label":`Slett ${e.name}`,onClick:()=>i(e=>!e),children:`Slett`}),(0,j.jsx)(g,{open:r,onClose:()=>i(!1),placement:`top`,children:(0,j.jsxs)(`div`,{className:`confirm`,children:[(0,j.jsxs)(n,{"data-size":`sm`,children:[`Vil du slette «`,e.name,`»? Du kan ikke angre.`]}),(0,j.jsxs)(`div`,{className:`confirm__buttons`,children:[(0,j.jsx)(o,{"data-size":`sm`,"data-color":`danger`,onClick:t,children:`Ja, slett`}),(0,j.jsx)(o,{"data-size":`sm`,variant:`secondary`,onClick:()=>i(!1),children:`Avbryt`})]})]})})]})}function q({items:e,onDelete:t,onEdit:n}){return(0,j.jsxs)(d,{"data-size":`sm`,className:`cost-table`,children:[(0,j.jsx)(`caption`,{className:`ds-sr-only`,children:`Kostnader`}),(0,j.jsx)(d.Head,{children:(0,j.jsxs)(d.Row,{children:[(0,j.jsx)(d.HeaderCell,{scope:`col`,children:`Kostnad`}),(0,j.jsx)(d.HeaderCell,{scope:`col`,children:`Kategori`}),(0,j.jsx)(d.HeaderCell,{scope:`col`,className:`num-col`,children:`Beløp`}),(0,j.jsx)(d.HeaderCell,{scope:`colgroup`,colSpan:2,children:(0,j.jsx)(`span`,{className:`ds-sr-only`,children:`Handlinger`})})]})}),(0,j.jsx)(d.Body,{children:e.map(e=>{let r=e.amount==null;return(0,j.jsxs)(d.Row,{id:`${e.id}-t`,tabIndex:-1,className:r?`has-error`:void 0,children:[(0,j.jsx)(d.HeaderCell,{scope:`row`,className:`plain`,children:e.name}),(0,j.jsx)(d.Cell,{children:e.category}),(0,j.jsx)(d.Cell,{className:`num-col`,children:r?(0,j.jsx)(a,{"data-size":`sm`,children:B}):H(e.amount)}),(0,j.jsx)(d.Cell,{className:`action-cell`,children:(0,j.jsx)(G,{item:e,onEdit:n})}),(0,j.jsx)(d.Cell,{className:`action-cell`,children:(0,j.jsx)(K,{item:e,onDelete:()=>t(e.id)})})]},e.id)})})]})}function J({items:e,onDelete:t,onEdit:r}){return(0,j.jsx)(c.Unordered,{className:`cards`,children:e.map(e=>{let i=e.amount==null;return(0,j.jsx)(c.Item,{children:(0,j.jsx)(y,{id:`${e.id}-k`,tabIndex:-1,variant:i?`tinted`:`default`,"data-color":i?`danger`:`neutral`,children:(0,j.jsxs)(y.Block,{className:`cost-card__body`,children:[(0,j.jsxs)(`div`,{className:`cost-card__top`,children:[(0,j.jsx)(b,{level:4,"data-size":`2xs`,children:e.name}),!i&&(0,j.jsx)(n,{"data-size":`sm`,className:`num`,children:H(e.amount)})]}),(0,j.jsx)(n,{"data-size":`sm`,className:`subtle`,children:e.category}),i&&(0,j.jsx)(a,{"data-size":`sm`,children:B}),(0,j.jsxs)(`div`,{className:`actions actions--card`,children:[(0,j.jsx)(G,{item:e,onEdit:r}),(0,j.jsx)(K,{item:e,onDelete:()=>t(e.id)})]})]})})},e.id)})})}function Y({large:e=!1}){let r=(0,k.useId)(),i=(0,k.useRef)(null),[a,s]=(0,k.useState)(z),[c,l]=(0,k.useState)(!1),[u,d]=(0,k.useState)(null),[f,m]=(0,k.useState)(``),h=(0,k.useRef)(null),g=(e,t)=>{h.current=t,d(e)},_=a.filter(e=>e.amount==null),v=e=>{let t=a.find(t=>t.id===e);s(t=>t.filter(t=>t.id!==e)),m(`«${t?.name}» er slettet.`),i.current?.focus()};return(0,j.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,j.jsxs)(`div`,{className:`stack-1`,children:[(0,j.jsx)(n,{"data-size":`sm`,className:`subtle`,children:`Søknad om tilskudd · Steg 2 av 4`}),(0,j.jsx)(b,{level:3,"data-size":`sm`,id:r,ref:i,tabIndex:-1,children:`Kostnader`})]}),(0,j.jsx)(n,{"data-size":`sm`,role:`status`,className:`meta`,children:f}),e?(0,j.jsx)(q,{items:a,onDelete:v,onEdit:g}):(0,j.jsx)(J,{items:a,onDelete:v,onEdit:g}),(0,j.jsx)(`div`,{children:(0,j.jsxs)(o,{"data-size":`sm`,variant:`secondary`,className:e?void 0:`full`,onClick:e=>g({},e.currentTarget),children:[(0,j.jsx)(t,{"aria-hidden":!0}),`Legg til kostnad`]})}),(0,j.jsx)(M,{open:u!==null,onClose:()=>d(null),returnFocusRef:h,title:u?.id?`Endre «${u.name}»`:`Legg til kostnad`,children:u!==null&&(0,j.jsx)(W,{item:u,onSave:e=>{e.id?(s(t=>t.map(t=>t.id===e.id?e:t)),m(`«${e.name}» er endret.`)):(s(t=>[...t,{...e,id:`ny-${Date.now()}`}]),m(`«${e.name}» er lagt til.`)),d(null)},onCancel:()=>d(null)},u.id??`ny`)}),c&&_.length>0&&(0,j.jsxs)(p,{"data-size":`sm`,children:[(0,j.jsx)(p.Heading,{children:`For å gå videre må du rette opp følgende feil:`}),(0,j.jsx)(p.List,{children:_.map(t=>(0,j.jsx)(p.Item,{children:(0,j.jsxs)(p.Link,{href:`#${t.id}-${e?`t`:`k`}`,children:[t.name,`: `,B]})},t.id))})]}),(0,j.jsx)(`div`,{children:(0,j.jsx)(o,{"data-size":`sm`,className:e?void 0:`full`,onClick:()=>{l(!0),m(_.length?``:`Alle kostnadene er fylt ut. I en ekte løsning går du nå videre til steg 3.`)},children:`Neste steg`})})]})}function X(){let e=F.slice(0,6);return(0,j.jsxs)(`main`,{className:`art`,children:[(0,j.jsx)(x,{current:`Kort`}),(0,j.jsxs)(`header`,{children:[(0,j.jsxs)(n,{"data-size":`sm`,className:`eyebrow`,children:[`Mønster: Strukturert informasjon · `,(0,j.jsx)(h,{"data-size":`sm`,"data-color":`warning`,children:`Utkast`})]}),(0,j.jsx)(b,{level:1,"data-size":`lg`,children:`Kort`}),(0,j.jsx)(n,{children:`Kortet er riktig når hver oppføring har flere egenskaper som hører sammen, eller når brukeren skal gjøre noe med én oppføring om gangen. Etikett og verdi står sammen i kortet, og handlingene får en egen rad nederst.`})]}),(0,j.jsxs)(`section`,{children:[(0,j.jsx)(b,{level:2,"data-size":`md`,children:`Etikett og verdi`}),(0,j.jsx)(n,{children:`Når verdiene ikke forklarer seg selv, og brukeren trenger alle opplysningene for å kjenne igjen saken.`}),(0,j.jsx)(T,{id:`kv`,code:[{label:`Kort`,code:C(N,`LabelValueCards`,`KeyValue`)},{label:`CSS`,code:S(P,`Kortlister`,`Kompakt`)}],smallLabel:`Kort med etikett og verdi, liten skjerm`,caption:`Hver rad i tabellen blir et kort. Etiketten står foran hver verdi, så ingen opplysninger mister sammenhengen med kolonneoverskriften. Saksnavnet er en lenke, så kortet trenger ingen pil.`,render:e=>(0,j.jsx)(E,{id:e,children:(0,j.jsx)(L,{items:F,labelledBy:e})})})]}),(0,j.jsxs)(`section`,{children:[(0,j.jsx)(b,{level:2,"data-size":`md`,children:`Mer kompakt`}),(0,j.jsx)(n,{children:`Når det er få oppføringer, rundt fem til sju, og hver har få opplysninger. Da kan kortene brukes på alle skjermstørrelser.`}),(0,j.jsx)(T,{id:`compact`,code:[{label:`Kort`,code:C(N,`CompactCards`)},{label:`CSS`,code:S(P,`Kortlister`,`Etikett og verdi`)+`

`+S(P,`Kompakt`,`Med handlinger`)}],smallLabel:`Kompakte kort, liten skjerm`,large:(0,j.jsx)(E,{id:`compact-large`,children:(0,j.jsx)(R,{items:e,labelledBy:`compact-large`,grid:!0})}),caption:`To verdier står side om side med etiketten over, og resten står på en linje under. Kortet tar mindre plass enn med etikett og verdi på hver linje. På stor skjerm står kortene i et rutenett i stedet for en tabell.`,render:t=>(0,j.jsx)(E,{id:t,children:(0,j.jsx)(R,{items:e,labelledBy:t})})})]}),(0,j.jsxs)(`section`,{children:[(0,j.jsx)(b,{level:2,"data-size":`md`,children:`Med handlinger`}),(0,j.jsx)(n,{children:`Når brukeren skal gjøre noe med hver oppføring, for eksempel endre eller slette rader de har lagt inn selv i et skjema.`}),(0,j.jsx)(T,{id:`actions`,code:[{label:`Kort`,code:C(N,`CostCards`,`EditButton`,`DeleteButton`)},{label:`Skjema`,code:C(N,`CostForm`,`parseKr`)},{label:`Tabell`,code:C(N,`CostTable`)},{label:`Siden`,code:C(N,`Costs`)},{label:`CSS`,code:S(P,`Med handlinger`,`Stor skjerm`)}],smallLabel:`Kort med handlinger, liten skjerm`,large:(0,j.jsx)(Y,{large:!0}),caption:`Endre og Slett står nederst i kortet, som i tabellen. Feilen står der beløpet skulle stått, og kortet får rød bakgrunn, så fargen ikke er eneste kjennetegn. Slett ber om bekreftelse. Neste steg er aldri deaktivert: trykker brukeren på den med feil, vises en feiloppsummering med lenke til kortet. Endre og «Legg til kostnad» åpner et skjema i en dialog. Feil vises ved feltet de gjelder. Når brukeren lagrer, oppdateres tabellen eller kortet, en melding sier hva som skjedde, og fokus går tilbake til knappen.`,render:()=>(0,j.jsx)(Y,{})})]})]})}export{N as i,X as n,P as r,Y as t};