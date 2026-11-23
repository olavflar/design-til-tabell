import{B as e,G as t,I as n,N as r,P as i,R as a,S as o,U as s,_ as c,a as l,d as u,h as d,m as f,s as p}from"./DeviceFrame-C4KpHYVz.js";import{i as m,n as h,r as g}from"./CodeExample-BAlVicH_.js";import{c as _,r as v,s as y,t as b,u as x}from"./cases-CFdL7Zie.js";var S=t(s(),1),C=`import { useId, useRef, useState } from "react";
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
const kr = (n) => \`\${n.toLocaleString("nb-NO")} kr\`;

function EditButton({ item }) {
  return (
    <Button variant="secondary" data-size="sm" aria-label={\`Endre \${item.name}\`}>
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
            <Table.Row key={c.id} id={\`\${c.id}-t\`} tabIndex={-1} className={error ? "has-error" : undefined}>
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

export function Costs({ large = false }) {
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
        {items.length} kostnader{withErrors.length > 0 && \`, \${withErrors.length} må rettes\`}
      </p>
      {large ? <CostTable items={items} onDelete={remove} /> : <CostCards items={items} onDelete={remove} />}
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
            { label: "Tabell", code: extract(src, "CostTable") },
            { label: "Siden", code: extract(src, "Costs") },
            { label: "CSS", code: cssBetween(css, "Med handlinger", "Stor skjerm") },
          ]}
          smallLabel="Kort med handlinger, liten skjerm"
          large={<Costs large />}
          caption="Endre og Slett står nederst i kortet, som i tabellen. Feilen står der beløpet skulle stått, og kortet får rød bakgrunn, så fargen ikke er eneste kjennetegn. Slett ber om bekreftelse. Neste steg er aldri deaktivert: trykker brukeren på den med feil, vises en feiloppsummering med lenke til kortet."
          render={() => <Costs />}
        />
      </section>
    </main>
  );
}
`,w=`/* Hi-fi kort: bare oppsett som Designsystemet ikke dekker direkte */
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
`,T=e(),E=[...b].sort(x);function D({label:e,rows:t}){return(0,T.jsxs)(p,{"data-size":`sm`,className:`kv`,children:[(0,T.jsx)(`caption`,{className:`ds-sr-only`,children:e}),(0,T.jsx)(p.Body,{children:t.map(([e,t])=>(0,T.jsxs)(p.Row,{children:[(0,T.jsx)(p.HeaderCell,{scope:`row`,children:e}),(0,T.jsx)(p.Cell,{children:t})]},e))})]})}function O({items:e,labelledBy:t}){return(0,T.jsx)(d.Unordered,{className:`cards`,"aria-labelledby":t,children:e.map(e=>(0,T.jsx)(d.Item,{children:(0,T.jsxs)(o,{"data-color":`neutral`,children:[(0,T.jsx)(o.Block,{children:(0,T.jsx)(c,{level:4,"data-size":`2xs`,children:(0,T.jsx)(a,{href:`#${e.id}`,children:e.title})})}),(0,T.jsx)(o.Block,{children:(0,T.jsx)(D,{label:e.title,rows:[[`Saksnummer`,e.caseNumber],[`Status`,(0,T.jsx)(_,{status:e.status},`s`)],[`Mottatt`,e.received],[`Sist oppdatert`,e.updated],[`Behandler`,e.handler]]})})]})},e.id))})}function k({items:e,labelledBy:t,grid:n=!1}){return(0,T.jsx)(d.Unordered,{className:n?`cards cards--grid`:`cards`,"aria-labelledby":t,children:e.map(e=>(0,T.jsx)(d.Item,{children:(0,T.jsxs)(o,{"data-color":`neutral`,className:`compact`,children:[(0,T.jsx)(c,{level:4,"data-size":`2xs`,children:(0,T.jsx)(a,{href:`#${e.id}`,children:e.title})}),(0,T.jsxs)(p,{"data-size":`sm`,className:`pair`,children:[(0,T.jsx)(`caption`,{className:`ds-sr-only`,children:e.title}),(0,T.jsx)(p.Head,{children:(0,T.jsxs)(p.Row,{children:[(0,T.jsx)(p.HeaderCell,{scope:`col`,children:`Status`}),(0,T.jsx)(p.HeaderCell,{scope:`col`,children:`Sist oppdatert`})]})}),(0,T.jsx)(p.Body,{children:(0,T.jsxs)(p.Row,{children:[(0,T.jsx)(p.Cell,{children:(0,T.jsx)(_,{status:e.status})}),(0,T.jsx)(p.Cell,{className:`num`,children:e.updated})]})})]}),(0,T.jsxs)(r,{"data-size":`sm`,className:`subtle`,children:[`Sak `,e.caseNumber,` · `,e.handler]})]})},e.id))})}var A=[{id:`husleie`,name:`Husleie`,category:`Drift`,amount:12e4},{id:`konsulent`,name:`Konsulenttjenester`,category:`Innkjøp`,amount:null},{id:`reise`,name:`Reise til Bergen`,category:`Reise`,amount:48500},{id:`lisenser`,name:`Programvarelisenser`,category:`Drift`,amount:9900}],j=`Fyll inn beløp.`,M=e=>`${e.toLocaleString(`nb-NO`)} kr`;function N({item:e}){return(0,T.jsx)(n,{variant:`secondary`,"data-size":`sm`,"aria-label":`Endre ${e.name}`,children:`Endre`})}function P({item:e,onDelete:t}){let[i,a]=(0,S.useState)(!1);return(0,T.jsxs)(u.TriggerContext,{children:[(0,T.jsx)(u.Trigger,{variant:`secondary`,"data-size":`sm`,"aria-label":`Slett ${e.name}`,onClick:()=>a(e=>!e),children:`Slett`}),(0,T.jsx)(u,{open:i,onClose:()=>a(!1),placement:`top`,children:(0,T.jsxs)(`div`,{className:`confirm`,children:[(0,T.jsxs)(r,{"data-size":`sm`,children:[`Vil du slette «`,e.name,`»? Du kan ikke angre.`]}),(0,T.jsxs)(`div`,{className:`confirm__buttons`,children:[(0,T.jsx)(n,{"data-size":`sm`,"data-color":`danger`,onClick:t,children:`Ja, slett`}),(0,T.jsx)(n,{"data-size":`sm`,variant:`secondary`,onClick:()=>a(!1),children:`Avbryt`})]})]})})]})}function F({items:e,onDelete:t}){return(0,T.jsxs)(p,{"data-size":`sm`,className:`cost-table`,children:[(0,T.jsx)(`caption`,{className:`ds-sr-only`,children:`Kostnader`}),(0,T.jsx)(p.Head,{children:(0,T.jsxs)(p.Row,{children:[(0,T.jsx)(p.HeaderCell,{scope:`col`,children:`Kostnad`}),(0,T.jsx)(p.HeaderCell,{scope:`col`,children:`Kategori`}),(0,T.jsx)(p.HeaderCell,{scope:`col`,className:`num-col`,children:`Beløp`}),(0,T.jsx)(p.HeaderCell,{scope:`colgroup`,colSpan:2,children:(0,T.jsx)(`span`,{className:`ds-sr-only`,children:`Handlinger`})})]})}),(0,T.jsx)(p.Body,{children:e.map(e=>{let n=e.amount==null;return(0,T.jsxs)(p.Row,{id:`${e.id}-t`,tabIndex:-1,className:n?`has-error`:void 0,children:[(0,T.jsx)(p.HeaderCell,{scope:`row`,className:`plain`,children:e.name}),(0,T.jsx)(p.Cell,{children:e.category}),(0,T.jsx)(p.Cell,{className:`num-col`,children:n?(0,T.jsx)(i,{"data-size":`sm`,children:j}):M(e.amount)}),(0,T.jsx)(p.Cell,{className:`action-cell`,children:(0,T.jsx)(N,{item:e})}),(0,T.jsx)(p.Cell,{className:`action-cell`,children:(0,T.jsx)(P,{item:e,onDelete:()=>t(e.id)})})]},e.id)})})]})}function I({items:e,onDelete:t}){return(0,T.jsx)(d.Unordered,{className:`cards`,children:e.map(e=>{let n=e.amount==null;return(0,T.jsx)(d.Item,{children:(0,T.jsx)(o,{id:`${e.id}-k`,tabIndex:-1,variant:n?`tinted`:`default`,"data-color":n?`danger`:`neutral`,children:(0,T.jsxs)(o.Block,{className:`cost-card__body`,children:[(0,T.jsxs)(`div`,{className:`cost-card__top`,children:[(0,T.jsx)(c,{level:4,"data-size":`2xs`,children:e.name}),!n&&(0,T.jsx)(r,{"data-size":`sm`,className:`num`,children:M(e.amount)})]}),(0,T.jsx)(r,{"data-size":`sm`,className:`subtle`,children:e.category}),n&&(0,T.jsx)(i,{"data-size":`sm`,children:j}),(0,T.jsxs)(`div`,{className:`actions actions--card`,children:[(0,T.jsx)(N,{item:e}),(0,T.jsx)(P,{item:e,onDelete:()=>t(e.id)})]})]})})},e.id)})})}function L({large:e=!1}){let t=(0,S.useId)(),i=(0,S.useRef)(null),[a,o]=(0,S.useState)(A),[s,l]=(0,S.useState)(!1),u=a.filter(e=>e.amount==null),d=e=>{o(t=>t.filter(t=>t.id!==e)),i.current?.focus()};return(0,T.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,T.jsxs)(`div`,{className:`stack-1`,children:[(0,T.jsx)(r,{"data-size":`sm`,className:`subtle`,children:`Søknad om tilskudd · Steg 2 av 4`}),(0,T.jsx)(c,{level:3,"data-size":`sm`,id:t,ref:i,tabIndex:-1,children:`Kostnader`})]}),(0,T.jsxs)(`p`,{role:`status`,className:`ds-sr-only`,children:[a.length,` kostnader`,u.length>0&&`, ${u.length} må rettes`]}),e?(0,T.jsx)(F,{items:a,onDelete:d}):(0,T.jsx)(I,{items:a,onDelete:d}),s&&u.length>0&&(0,T.jsxs)(f,{"data-size":`sm`,children:[(0,T.jsx)(f.Heading,{children:`For å gå videre må du rette opp følgende feil:`}),(0,T.jsx)(f.List,{children:u.map(t=>(0,T.jsx)(f.Item,{children:(0,T.jsxs)(f.Link,{href:`#${t.id}-${e?`t`:`k`}`,children:[t.name,`: `,j]})},t.id))})]}),(0,T.jsx)(`div`,{children:(0,T.jsx)(n,{"data-size":`sm`,className:e?void 0:`full`,onClick:()=>l(!0),children:`Neste steg`})})]})}function R(){let e=E.slice(0,6);return(0,T.jsxs)(`main`,{className:`art`,children:[(0,T.jsx)(m,{current:`Kort`}),(0,T.jsxs)(`header`,{children:[(0,T.jsxs)(r,{"data-size":`sm`,className:`eyebrow`,children:[`Mønster: Strukturert informasjon · `,(0,T.jsx)(l,{"data-size":`sm`,"data-color":`warning`,children:`Utkast`})]}),(0,T.jsx)(c,{level:1,"data-size":`lg`,children:`Kort`}),(0,T.jsx)(r,{children:`Kortet er riktig når hver oppføring har flere egenskaper som hører sammen, eller når brukeren skal gjøre noe med én oppføring om gangen. Etikett og verdi står sammen i kortet, og handlingene får en egen rad nederst.`})]}),(0,T.jsxs)(`section`,{children:[(0,T.jsx)(c,{level:2,"data-size":`md`,children:`Etikett og verdi`}),(0,T.jsx)(r,{children:`Når verdiene ikke forklarer seg selv, og brukeren trenger alle opplysningene for å kjenne igjen saken.`}),(0,T.jsx)(v,{id:`kv`,code:[{label:`Kort`,code:g(C,`LabelValueCards`,`KeyValue`)},{label:`CSS`,code:h(w,`Kortlister`,`Kompakt`)}],smallLabel:`Kort med etikett og verdi, liten skjerm`,caption:`Hver rad i tabellen blir et kort. Etiketten står foran hver verdi, så ingen opplysninger mister sammenhengen med kolonneoverskriften. Saksnavnet er en lenke, så kortet trenger ingen pil.`,render:e=>(0,T.jsx)(y,{id:e,children:(0,T.jsx)(O,{items:E,labelledBy:e})})})]}),(0,T.jsxs)(`section`,{children:[(0,T.jsx)(c,{level:2,"data-size":`md`,children:`Mer kompakt`}),(0,T.jsx)(r,{children:`Når det er få oppføringer, rundt fem til sju, og hver har få opplysninger. Da kan kortene brukes på alle skjermstørrelser.`}),(0,T.jsx)(v,{id:`compact`,code:[{label:`Kort`,code:g(C,`CompactCards`)},{label:`CSS`,code:h(w,`Kortlister`,`Etikett og verdi`)+`

`+h(w,`Kompakt`,`Med handlinger`)}],smallLabel:`Kompakte kort, liten skjerm`,large:(0,T.jsx)(y,{id:`compact-large`,children:(0,T.jsx)(k,{items:e,labelledBy:`compact-large`,grid:!0})}),caption:`To verdier står side om side med etiketten over, og resten står på en linje under. Kortet tar mindre plass enn med etikett og verdi på hver linje. På stor skjerm står kortene i et rutenett i stedet for en tabell.`,render:t=>(0,T.jsx)(y,{id:t,children:(0,T.jsx)(k,{items:e,labelledBy:t})})})]}),(0,T.jsxs)(`section`,{children:[(0,T.jsx)(c,{level:2,"data-size":`md`,children:`Med handlinger`}),(0,T.jsx)(r,{children:`Når brukeren skal gjøre noe med hver oppføring, for eksempel endre eller slette rader de har lagt inn selv i et skjema.`}),(0,T.jsx)(v,{id:`actions`,code:[{label:`Kort`,code:g(C,`CostCards`,`EditButton`,`DeleteButton`)},{label:`Tabell`,code:g(C,`CostTable`)},{label:`Siden`,code:g(C,`Costs`)},{label:`CSS`,code:h(w,`Med handlinger`,`Stor skjerm`)}],smallLabel:`Kort med handlinger, liten skjerm`,large:(0,T.jsx)(L,{large:!0}),caption:`Endre og Slett står nederst i kortet, som i tabellen. Feilen står der beløpet skulle stått, og kortet får rød bakgrunn, så fargen ikke er eneste kjennetegn. Slett ber om bekreftelse. Neste steg er aldri deaktivert: trykker brukeren på den med feil, vises en feiloppsummering med lenke til kortet.`,render:()=>(0,T.jsx)(L,{})})]})]})}export{C as i,R as n,w as r,L as t};