import{B as e,D as t,F as n,H as r,I as i,M as a,O as o,P as s,W as c,_ as l,a as u,b as d,c as f,f as p,l as m,n as h,s as g,t as _,z as v}from"./DeviceFrame-bF385BlT.js";/* empty css                 */import{i as y,n as b,r as x,t as S}from"./CodeExample-vHXTI-OR.js";var C=c(r(),1),w=e(),T=`import { useEffect, useRef, useState } from "react";
import {
  Button,
  Field,
  Heading,
  Label,
  Select,
  Switch,
  Pagination,
  Paragraph,
  Table,
  Tag,
  usePagination,
} from "@digdir/designsystemet-react";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { BrowserFrame, PhoneFrame } from "../components/DeviceFrame.jsx";
import HifiNav from "../components/HifiNav.jsx";
import CodeExample, { extract, cssBetween } from "../components/CodeExample.jsx";
import src from "./Tabell.jsx?raw";
import css from "./tabell.css?raw";

/* Hi-fi av tabelleksempelet i artikkelen: stor skjerm → liten skjerm.
   Liten skjerm: første kolonne og overskriftsraden står fast, resten ruller
   sideveis. Valgfritt: paginering av radene. Tallene er fiktive. */

const years = [2019, 2020, 2021, 2022, 2023, 2024];
const fylker = [
  "Agder", "Akershus", "Buskerud", "Finnmark", "Innlandet", "Møre og Romsdal",
  "Nordland", "Oslo", "Rogaland", "Telemark", "Troms", "Trøndelag",
  "Vestfold", "Vestland", "Østfold",
];
const rows = fylker.map((navn, i) => ({
  navn,
  verdier: years.map((_, j) => 1000 + i * 37 + j * 91 + ((i * 13 + j * 7) % 29)),
}));
const fmt = new Intl.NumberFormat("nb-NO");

const TITLE = "Nye elbiler per fylke";

function StatTable({ data, captionId, className }) {
  return (
    <Table data-size="sm" zebra stickyHeader className={className}>
      <caption className="ds-sr-only">{TITLE}</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope="col">Fylke</Table.HeaderCell>
          {years.map((y) => (
            <Table.HeaderCell key={y} scope="col" className="num">{y}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.map((r) => (
          <Table.Row key={r.navn}>
            <Table.HeaderCell scope="row">{r.navn}</Table.HeaderCell>
            {r.verdier.map((v, j) => (
              <Table.Cell key={years[j]} className="num">{fmt.format(v)}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

function Intro({ id }) {
  return (
    <>
      <Heading level={3} data-size="sm" id={id}>{TITLE}</Heading>
      <Paragraph data-size="sm" className="meta">
        Antall nyregistrerte elbiler, 2019–2024. <Tag data-size="sm" data-color="warning">Fiktive tall</Tag>
      </Paragraph>
    </>
  );
}

/** Rulleflate som viser skygge ved den faste kolonnen og et hint om mer innhold */
function ScrollArea({ labelledBy, children }) {
  const ref = useRef(null);
  const [state, setState] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    const update = () =>
      setState({
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="scroll-wrap" data-start={state.start} data-end={state.end}>
      <div
        ref={ref}
        className="scroll-area"
        role="region"
        aria-labelledby={labelledBy}
        tabIndex={0}
      >
        {children}
      </div>
      <Paragraph data-size="xs" className="scroll-hint" aria-hidden>
        {state.end ? "Du har sett alle årene" : <>Rull sideveis for flere år <ArrowRightIcon /></>}
      </Paragraph>
    </div>
  );
}

const VISIBLE = 2;

/** Bla mellom kolonnene: alltid to hele årskolonner synlige, ingen halve kolonner */
function ColumnNavScreen({ stickyHeader = false, stickyNav = true }) {
  const [start, setStart] = useState(0);
  const max = years.length - VISIBLE;
  const shown = years.slice(start, start + VISIBLE);

  return (
    <div className="frame__content hifi">
      <Intro id="t-cols" />
      <Table data-size="sm" zebra stickyHeader={stickyHeader} className="flipped">
        <caption className="ds-sr-only">{TITLE}</caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope="col">Fylke</Table.HeaderCell>
            {shown.map((y) => (
              <Table.HeaderCell key={y} scope="col" className="num">{y}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.navn}>
              <Table.HeaderCell scope="row">{r.navn}</Table.HeaderCell>
              {shown.map((y) => (
                <Table.Cell key={y} className="num">{fmt.format(r.verdier[years.indexOf(y)])}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className={stickyNav ? "col-nav col-nav--sticky" : "col-nav"}>
        <Paragraph data-size="sm" aria-live="polite" className="col-nav__status">
          Viser {shown.join(" og ")} <span className="meta-inline">av {years[0]}–{years[years.length - 1]}</span>
        </Paragraph>
        <div className="col-nav__buttons">
          <Button
            variant="secondary"
            data-size="sm"
            disabled={start === 0}
            onClick={() => setStart((s) => Math.max(0, s - 1))}
          >
            <ArrowLeftIcon aria-hidden />
            Tidligere år
          </Button>
          <Button
            variant="secondary"
            data-size="sm"
            disabled={start === max}
            onClick={() => setStart((s) => Math.min(max, s + 1))}
          >
            Senere år
            <ArrowRightIcon aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}

const PER_PAGE = 5;

function SmallScreen({ id, paginate = false }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(rows.length / PER_PAGE);
  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage: page,
    setCurrentPage: setPage,
    totalPages,
    showPages: 5,
  });
  const data = paginate ? rows.slice((page - 1) * PER_PAGE, page * PER_PAGE) : rows;
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, rows.length);

  return (
    <div className="frame__content hifi">
      <Intro id={id} />
      <ScrollArea labelledBy={id}>
        <StatTable data={data} captionId={id} className="sticky-first" />
      </ScrollArea>
      {paginate && (
        <div className="pager">
          <Paragraph data-size="xs" className="meta">
            Viser {from}–{to} av {rows.length} fylker
          </Paragraph>
          <Pagination aria-label="Sider i tabellen" data-size="sm">
            <Pagination.List>
              <Pagination.Item>
                <Pagination.Button {...prevButtonProps} aria-label="Forrige side" />
              </Pagination.Item>
              {pages.map(({ page: p, itemKey, buttonProps }) => (
                <Pagination.Item key={itemKey}>
                  {typeof p === "number" && (
                    <Pagination.Button {...buttonProps} aria-label={\`Side \${p}\`}>{p}</Pagination.Button>
                  )}
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Button {...nextButtonProps} aria-label="Neste side" />
              </Pagination.Item>
            </Pagination.List>
          </Pagination>
        </div>
      )}
    </div>
  );
}

/** Snudd tabell: årene går nedover, og brukeren velger to fylker som står side om side */
function TransposedScreen() {
  const [a, setA] = useState("Oslo");
  const [b, setB] = useState("Vestland");
  const pick = [rows.find((r) => r.navn === a), rows.find((r) => r.navn === b)];

  return (
    <div className="frame__content hifi">
      <Intro id="t-flip" />
      <div className="pickers">
        {[[a, setA, "Fylke 1"], [b, setB, "Fylke 2"]].map(([val, set, label]) => (
          <Field key={label} data-size="sm">
            <Label>{label}</Label>
            <Select value={val} onChange={(e) => set(e.target.value)}>
              {fylker.map((f) => (
                <Select.Option key={f} value={f}>{f}</Select.Option>
              ))}
            </Select>
          </Field>
        ))}
      </div>
      <Table data-size="sm" zebra className="flipped">
        <caption className="ds-sr-only">{TITLE}</caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope="col">År</Table.HeaderCell>
            {pick.map((r, i) => (
              <Table.HeaderCell key={i} scope="col" className="num">{r.navn}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {years.map((y, j) => (
            <Table.Row key={y}>
              <Table.HeaderCell scope="row">{y}</Table.HeaderCell>
              {pick.map((r, i) => (
                <Table.Cell key={i} className="num">{fmt.format(r.verdier[j])}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

/** Stor skjerm og liten skjerm side om side, med bildetekst */
function Example({ id, smallLabel, caption, code, children }) {
  return (
    <div className="examples">
      <figure className="wide">
        <figcaption>Stor skjerm</figcaption>
        <BrowserFrame height={720} label="Tabell, stor skjerm">
          <div className="frame__content hifi">
            <Intro id={\`\${id}-large\`} />
            <StatTable data={rows} captionId={\`\${id}-large\`} />
          </div>
        </BrowserFrame>
      </figure>
      <figure>
        <figcaption>Liten skjerm</figcaption>
        <PhoneFrame width={390} height={720} label={smallLabel}>
          {children}
        </PhoneFrame>
      </figure>
      <Paragraph data-size="sm">{caption}</Paragraph>
      {code && <CodeExample snippets={code} />}
    </div>
  );
}

export default function Tabell() {
  const [stickyHeader, setStickyHeader] = useState(true);
  const [stickyNav, setStickyNav] = useState(true);

  return (
    <main className="art">
      <HifiNav current="Tabell" />
      <header>
        <Paragraph data-size="sm" className="eyebrow">
          Mønster: Strukturert informasjon · <Tag data-size="sm" data-color="warning">Utkast</Tag>
        </Paragraph>
        <Heading level={1} data-size="lg">Tabell</Heading>
        <Paragraph data-size="sm" className="meta">
          Kode: <code>table</code>. Grid (<code>role="grid"</code>) kan vurderes for interaktive tabeller.
        </Paragraph>
        <Paragraph>
          Tabellen er riktig når brukeren skal sammenligne verdier på tvers av rader og kolonner. På små skjermer
          beholder du tabellen og lar den rulle sideveis, eller snur den når det bare er noen få alternativer.
        </Paragraph>
      </header>

      <section>
        <Heading level={2} data-size="md">Behold tabellen og rull sideveis</Heading>
        <Paragraph>Når brukeren skal sammenligne mange oppføringer på tvers av mange egenskaper.</Paragraph>
        <Example
          id="scroll"
          code={[
            { label: "Tabell", code: extract(src, "StatTable", "ScrollArea") },
            { label: "CSS", code: cssBetween(css, "Rulleflaten", "Snudd tabell") },
          ]}
          smallLabel="Tabell som ruller sideveis, liten skjerm"
          caption="Første kolonne og overskriftsraden står fast. Resten ruller sideveis. En skygge ved den faste kolonnen og en toning til høyre viser at det er mer innhold."
        >
          <SmallScreen id="scroll-small" />
        </Example>
      </section>

      <section>
        <Heading level={2} data-size="md">Rull sideveis og del opp i sider</Heading>
        <Paragraph>
          Når det er så mange oppføringer at tabellen blir lang, og brukeren først og fremst sammenligner innenfor
          én oppføring eller noen få om gangen.
        </Paragraph>
        <Example
          id="paged"
          code={[
            { label: "Tabell med sider", code: extract(src, "SmallScreen") },
            { label: "CSS", code: cssBetween(css, "Rulleflaten", "Snudd tabell") },
          ]}
          smallLabel="Tabell med paginering, liten skjerm"
          caption="Tabellen ruller sideveis som før, men viser fem fylker om gangen. Det gir en kortere tabell, men brukeren kan ikke sammenligne fylker som ligger på ulike sider. Vurder sortering eller søk i tillegg, så brukeren slipper å bla for å finne et fylke."
        >
          <SmallScreen id="paged-small" paginate />
        </Example>
      </section>

      <section>
        <Heading level={2} data-size="md">Snu tabellen</Heading>
        <Paragraph>
          Når brukeren bare trenger å sammenligne noen få oppføringer om gangen. Oppføringene blir kolonner og
          egenskapene går nedover, så tabellen passer i bredden uten å rulle sideveis.
        </Paragraph>
        <Example
          id="flip"
          code={[
            { label: "Snudd tabell", code: extract(src, "TransposedScreen") },
            { label: "CSS", code: cssBetween(css, "Snudd tabell", "Bla mellom") },
          ]}
          smallLabel="Snudd tabell, liten skjerm"
          caption="Årene går nedover, og brukeren velger hvilke to fylker som står side om side. Det fungerer når oppgaven er å sammenligne noen få oppføringer. Skal brukeren se alle fylkene samtidig, er det bedre å beholde tabellen og la den rulle."
        >
          <TransposedScreen />
        </Example>
      </section>

      <section>
        <Heading level={2} data-size="md">Bla mellom kolonnene</Heading>
        <Paragraph>
          Når brukeren skal sammenligne alle oppføringene, men bare trenger noen få egenskaper om gangen. Tabellen
          viser alltid hele kolonner, så ingen tall blir kuttet på midten.
        </Paragraph>
        <div className="switches">
          <Switch
            data-size="sm"
            label="Fast overskriftsrad"
            checked={stickyHeader}
            onChange={(e) => setStickyHeader(e.target.checked)}
          />
          <Switch
            data-size="sm"
            label="Faste knapper nederst"
            checked={stickyNav}
            onChange={(e) => setStickyNav(e.target.checked)}
          />
        </div>
        <Example
          id="cols"
          code={[
            { label: "Tabell", code: extract(src, "ColumnNavScreen") },
            { label: "CSS", code: cssBetween(css, "Bla mellom kolonnene") },
          ]}
          smallLabel="Tabell der brukeren blar mellom kolonnene, liten skjerm"
          caption="Første kolonne står fast, og tabellen viser to år om gangen. Pilknappene ligger nederst, innenfor rekkevidde for tommelen. De flytter ett år frem eller tilbake, så brukeren kan sammenligne to år som ligger ved siden av hverandre. Teksten ved knappene sier hvilke år som vises. Den leses også opp av skjermleser når brukeren blar. Med bryterne kan du prøve med og uten fast overskriftsrad og faste knapper."
        >
          <ColumnNavScreen stickyHeader={stickyHeader} stickyNav={stickyNav} />
        </Example>
      </section>
    </main>
  );
}
`,E=`/* Hi-fi tabell: bare det Designsystemet ikke har ennå (fast førstekolonne og rulleindikator) */
.hifi { display: flex; flex-direction: column; gap: var(--ds-size-3); padding-top: var(--ds-size-4); }
.hifi > * { margin: 0; }
.meta { color: var(--ds-color-neutral-text-subtle); display: flex; flex-wrap: wrap; align-items: center; gap: var(--ds-size-2); }
.num { text-align: right; font-variant-numeric: tabular-nums; }

/* Rulleflaten. Høyden gjør at stickyHeader fester seg her. */
.scroll-wrap { position: relative; display: flex; flex-direction: column; gap: var(--ds-size-2); }
.scroll-area {
  overflow: auto;
  max-height: 60cqh;
  border: 1px solid var(--ds-color-neutral-border-subtle);
  border-radius: var(--ds-border-radius-md);
  overscroll-behavior-x: contain;
}
.scroll-area:focus-visible {
  outline: var(--ds-border-width-focus) solid var(--ds-color-focus-outer);
  outline-offset: 2px;
}
.scroll-area .ds-table { min-width: max-content; }
.scroll-area .ds-table th, .scroll-area .ds-table td { white-space: nowrap; }

/* Fast førstekolonne */
.sticky-first th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--ds-color-neutral-background-default);
  box-shadow: inset -1px 0 0 var(--ds-color-neutral-border-subtle);
  transition: box-shadow 0.15s;
}
.sticky-first tbody tr:nth-child(even) th:first-child { background: var(--dsc-table-background--zebra); }
.sticky-first thead th:first-child { z-index: 3; }
.scroll-wrap[data-start="false"] .sticky-first th:first-child {
  box-shadow: inset -1px 0 0 var(--ds-color-neutral-border-default), 6px 0 8px -4px rgb(0 0 0 / 0.18);
}

/* Toning til høyre så lenge det er mer å se */
.scroll-wrap::after {
  content: "";
  position: absolute;
  top: 1px;
  right: 1px;
  height: calc(100% - 2.25rem);
  width: 2.5rem;
  pointer-events: none;
  border-radius: 0 var(--ds-border-radius-md) var(--ds-border-radius-md) 0;
  background: linear-gradient(to right, transparent, var(--ds-color-neutral-background-default));
  transition: opacity 0.2s;
}
.scroll-wrap[data-end="true"]::after { opacity: 0; }

.scroll-hint {
  margin: 0;
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: var(--ds-size-1);
  color: var(--ds-color-accent-text-default);
  font-weight: 500;
}
.scroll-wrap[data-end="true"] .scroll-hint { color: var(--ds-color-neutral-text-subtle); font-weight: 400; }
.scroll-hint svg { font-size: 1.25em; }

.pager { display: flex; flex-direction: column; align-items: center; gap: var(--ds-size-2); }

.art > header { display: flex; flex-direction: column; gap: var(--ds-size-3); }

/* Snudd tabell */
.pickers { display: grid; grid-template-columns: 1fr 1fr; gap: var(--ds-size-3); }
.flipped { width: 100%; }
.flipped th[scope="row"] { font-variant-numeric: tabular-nums; }

/* Bla mellom kolonnene */
.col-nav {
  display: flex; flex-direction: column; gap: var(--ds-size-2);
  margin-inline: calc(var(--ds-size-4) * -1);
  padding: var(--ds-size-3) var(--ds-size-4);
  background: var(--ds-color-neutral-background-default);
  border-top: 1px solid var(--ds-color-neutral-border-subtle);
}
.col-nav__status { margin: 0; font-weight: 500; text-align: center; }
.col-nav__buttons { display: grid; grid-template-columns: 1fr 1fr; gap: var(--ds-size-2); }
.col-nav__buttons > .ds-button { width: 100%; justify-content: center; }
.meta-inline { color: var(--ds-color-neutral-text-subtle); font-weight: 400; }
.col-nav--sticky { position: sticky; bottom: 0; z-index: 2; }
.hifi:has(> .col-nav) { padding-bottom: 0; }
.hifi > .col-nav { margin-top: auto; }
.switches { display: flex; flex-wrap: wrap; gap: var(--ds-size-3) var(--ds-size-6); }
`,D=v(),O=[2019,2020,2021,2022,2023,2024],k=[`Agder`,`Akershus`,`Buskerud`,`Finnmark`,`Innlandet`,`Møre og Romsdal`,`Nordland`,`Oslo`,`Rogaland`,`Telemark`,`Troms`,`Trøndelag`,`Vestfold`,`Vestland`,`Østfold`],A=k.map((e,t)=>({navn:e,verdier:O.map((e,n)=>1e3+t*37+n*91+(t*13+n*7)%29)})),j=new Intl.NumberFormat(`nb-NO`),M=`Nye elbiler per fylke`;function N({data:e,captionId:t,className:n}){return(0,D.jsxs)(g,{"data-size":`sm`,zebra:!0,stickyHeader:!0,className:n,children:[(0,D.jsx)(`caption`,{className:`ds-sr-only`,children:M}),(0,D.jsx)(g.Head,{children:(0,D.jsxs)(g.Row,{children:[(0,D.jsx)(g.HeaderCell,{scope:`col`,children:`Fylke`}),O.map(e=>(0,D.jsx)(g.HeaderCell,{scope:`col`,className:`num`,children:e},e))]})}),(0,D.jsx)(g.Body,{children:e.map(e=>(0,D.jsxs)(g.Row,{children:[(0,D.jsx)(g.HeaderCell,{scope:`row`,children:e.navn}),e.verdier.map((e,t)=>(0,D.jsx)(g.Cell,{className:`num`,children:j.format(e)},O[t]))]},e.navn))})]})}function P({id:e}){return(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)(l,{level:3,"data-size":`sm`,id:e,children:M}),(0,D.jsxs)(a,{"data-size":`sm`,className:`meta`,children:[`Antall nyregistrerte elbiler, 2019–2024. `,(0,D.jsx)(u,{"data-size":`sm`,"data-color":`warning`,children:`Fiktive tall`})]})]})}function F({labelledBy:e,children:n}){let r=(0,C.useRef)(null),[i,o]=(0,C.useState)({start:!0,end:!1});return(0,C.useEffect)(()=>{let e=r.current,t=()=>o({start:e.scrollLeft<=1,end:e.scrollLeft+e.clientWidth>=e.scrollWidth-1});t(),e.addEventListener(`scroll`,t,{passive:!0});let n=new ResizeObserver(t);return n.observe(e),()=>{e.removeEventListener(`scroll`,t),n.disconnect()}},[]),(0,D.jsxs)(`div`,{className:`scroll-wrap`,"data-start":i.start,"data-end":i.end,children:[(0,D.jsx)(`div`,{ref:r,className:`scroll-area`,role:`region`,"aria-labelledby":e,tabIndex:0,children:n}),(0,D.jsx)(a,{"data-size":`xs`,className:`scroll-hint`,"aria-hidden":!0,children:i.end?`Du har sett alle årene`:(0,D.jsxs)(D.Fragment,{children:[`Rull sideveis for flere år `,(0,D.jsx)(t,{})]})})]})}var I=2;function L({stickyHeader:e=!1,stickyNav:r=!0}){let[i,s]=(0,C.useState)(0),c=O.length-I,l=O.slice(i,i+I);return(0,D.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,D.jsx)(P,{id:`t-cols`}),(0,D.jsxs)(g,{"data-size":`sm`,zebra:!0,stickyHeader:e,className:`flipped`,children:[(0,D.jsx)(`caption`,{className:`ds-sr-only`,children:M}),(0,D.jsx)(g.Head,{children:(0,D.jsxs)(g.Row,{children:[(0,D.jsx)(g.HeaderCell,{scope:`col`,children:`Fylke`}),l.map(e=>(0,D.jsx)(g.HeaderCell,{scope:`col`,className:`num`,children:e},e))]})}),(0,D.jsx)(g.Body,{children:A.map(e=>(0,D.jsxs)(g.Row,{children:[(0,D.jsx)(g.HeaderCell,{scope:`row`,children:e.navn}),l.map(t=>(0,D.jsx)(g.Cell,{className:`num`,children:j.format(e.verdier[O.indexOf(t)])},t))]},e.navn))})]}),(0,D.jsxs)(`div`,{className:r?`col-nav col-nav--sticky`:`col-nav`,children:[(0,D.jsxs)(a,{"data-size":`sm`,"aria-live":`polite`,className:`col-nav__status`,children:[`Viser `,l.join(` og `),` `,(0,D.jsxs)(`span`,{className:`meta-inline`,children:[`av `,O[0],`–`,O[O.length-1]]})]}),(0,D.jsxs)(`div`,{className:`col-nav__buttons`,children:[(0,D.jsxs)(n,{variant:`secondary`,"data-size":`sm`,disabled:i===0,onClick:()=>s(e=>Math.max(0,e-1)),children:[(0,D.jsx)(o,{"aria-hidden":!0}),`Tidligere år`]}),(0,D.jsxs)(n,{variant:`secondary`,"data-size":`sm`,disabled:i===c,onClick:()=>s(e=>Math.min(c,e+1)),children:[`Senere år`,(0,D.jsx)(t,{"aria-hidden":!0})]})]})]})]})}var R=5;function z({id:e,paginate:t=!1}){let[n,r]=(0,C.useState)(1),o=Math.ceil(A.length/R),{pages:s,prevButtonProps:c,nextButtonProps:l}=i({currentPage:n,setCurrentPage:r,totalPages:o,showPages:5}),u=t?A.slice((n-1)*R,n*R):A,d=(n-1)*R+1,f=Math.min(n*R,A.length);return(0,D.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,D.jsx)(P,{id:e}),(0,D.jsx)(F,{labelledBy:e,children:(0,D.jsx)(N,{data:u,captionId:e,className:`sticky-first`})}),t&&(0,D.jsxs)(`div`,{className:`pager`,children:[(0,D.jsxs)(a,{"data-size":`xs`,className:`meta`,children:[`Viser `,d,`–`,f,` av `,A.length,` fylker`]}),(0,D.jsx)(p,{"aria-label":`Sider i tabellen`,"data-size":`sm`,children:(0,D.jsxs)(p.List,{children:[(0,D.jsx)(p.Item,{children:(0,D.jsx)(p.Button,{...c,"aria-label":`Forrige side`})}),s.map(({page:e,itemKey:t,buttonProps:n})=>(0,D.jsx)(p.Item,{children:typeof e==`number`&&(0,D.jsx)(p.Button,{...n,"aria-label":`Side ${e}`,children:e})},t)),(0,D.jsx)(p.Item,{children:(0,D.jsx)(p.Button,{...l,"aria-label":`Neste side`})})]})})]})]})}function B(){let[e,t]=(0,C.useState)(`Oslo`),[n,r]=(0,C.useState)(`Vestland`),i=[A.find(t=>t.navn===e),A.find(e=>e.navn===n)];return(0,D.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,D.jsx)(P,{id:`t-flip`}),(0,D.jsx)(`div`,{className:`pickers`,children:[[e,t,`Fylke 1`],[n,r,`Fylke 2`]].map(([e,t,n])=>(0,D.jsxs)(d,{"data-size":`sm`,children:[(0,D.jsx)(s,{children:n}),(0,D.jsx)(m,{value:e,onChange:e=>t(e.target.value),children:k.map(e=>(0,D.jsx)(m.Option,{value:e,children:e},e))})]},n))}),(0,D.jsxs)(g,{"data-size":`sm`,zebra:!0,className:`flipped`,children:[(0,D.jsx)(`caption`,{className:`ds-sr-only`,children:M}),(0,D.jsx)(g.Head,{children:(0,D.jsxs)(g.Row,{children:[(0,D.jsx)(g.HeaderCell,{scope:`col`,children:`År`}),i.map((e,t)=>(0,D.jsx)(g.HeaderCell,{scope:`col`,className:`num`,children:e.navn},t))]})}),(0,D.jsx)(g.Body,{children:O.map((e,t)=>(0,D.jsxs)(g.Row,{children:[(0,D.jsx)(g.HeaderCell,{scope:`row`,children:e}),i.map((e,n)=>(0,D.jsx)(g.Cell,{className:`num`,children:j.format(e.verdier[t])},n))]},e))})]})]})}function V({id:e,smallLabel:t,caption:n,code:r,children:i}){return(0,D.jsxs)(`div`,{className:`examples`,children:[(0,D.jsxs)(`figure`,{className:`wide`,children:[(0,D.jsx)(`figcaption`,{children:`Stor skjerm`}),(0,D.jsx)(_,{height:720,label:`Tabell, stor skjerm`,children:(0,D.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,D.jsx)(P,{id:`${e}-large`}),(0,D.jsx)(N,{data:A,captionId:`${e}-large`})]})})]}),(0,D.jsxs)(`figure`,{children:[(0,D.jsx)(`figcaption`,{children:`Liten skjerm`}),(0,D.jsx)(h,{width:390,height:720,label:t,children:i})]}),(0,D.jsx)(a,{"data-size":`sm`,children:n}),r&&(0,D.jsx)(S,{snippets:r})]})}function H(){let[e,t]=(0,C.useState)(!0),[n,r]=(0,C.useState)(!0);return(0,D.jsxs)(`main`,{className:`art`,children:[(0,D.jsx)(y,{current:`Tabell`}),(0,D.jsxs)(`header`,{children:[(0,D.jsxs)(a,{"data-size":`sm`,className:`eyebrow`,children:[`Mønster: Strukturert informasjon · `,(0,D.jsx)(u,{"data-size":`sm`,"data-color":`warning`,children:`Utkast`})]}),(0,D.jsx)(l,{level:1,"data-size":`lg`,children:`Tabell`}),(0,D.jsxs)(a,{"data-size":`sm`,className:`meta`,children:[`Kode: `,(0,D.jsx)(`code`,{children:`table`}),`. Grid (`,(0,D.jsx)(`code`,{children:`role="grid"`}),`) kan vurderes for interaktive tabeller.`]}),(0,D.jsx)(a,{children:`Tabellen er riktig når brukeren skal sammenligne verdier på tvers av rader og kolonner. På små skjermer beholder du tabellen og lar den rulle sideveis, eller snur den når det bare er noen få alternativer.`})]}),(0,D.jsxs)(`section`,{children:[(0,D.jsx)(l,{level:2,"data-size":`md`,children:`Behold tabellen og rull sideveis`}),(0,D.jsx)(a,{children:`Når brukeren skal sammenligne mange oppføringer på tvers av mange egenskaper.`}),(0,D.jsx)(V,{id:`scroll`,code:[{label:`Tabell`,code:x(T,`StatTable`,`ScrollArea`)},{label:`CSS`,code:b(E,`Rulleflaten`,`Snudd tabell`)}],smallLabel:`Tabell som ruller sideveis, liten skjerm`,caption:`Første kolonne og overskriftsraden står fast. Resten ruller sideveis. En skygge ved den faste kolonnen og en toning til høyre viser at det er mer innhold.`,children:(0,D.jsx)(z,{id:`scroll-small`})})]}),(0,D.jsxs)(`section`,{children:[(0,D.jsx)(l,{level:2,"data-size":`md`,children:`Rull sideveis og del opp i sider`}),(0,D.jsx)(a,{children:`Når det er så mange oppføringer at tabellen blir lang, og brukeren først og fremst sammenligner innenfor én oppføring eller noen få om gangen.`}),(0,D.jsx)(V,{id:`paged`,code:[{label:`Tabell med sider`,code:x(T,`SmallScreen`)},{label:`CSS`,code:b(E,`Rulleflaten`,`Snudd tabell`)}],smallLabel:`Tabell med paginering, liten skjerm`,caption:`Tabellen ruller sideveis som før, men viser fem fylker om gangen. Det gir en kortere tabell, men brukeren kan ikke sammenligne fylker som ligger på ulike sider. Vurder sortering eller søk i tillegg, så brukeren slipper å bla for å finne et fylke.`,children:(0,D.jsx)(z,{id:`paged-small`,paginate:!0})})]}),(0,D.jsxs)(`section`,{children:[(0,D.jsx)(l,{level:2,"data-size":`md`,children:`Snu tabellen`}),(0,D.jsx)(a,{children:`Når brukeren bare trenger å sammenligne noen få oppføringer om gangen. Oppføringene blir kolonner og egenskapene går nedover, så tabellen passer i bredden uten å rulle sideveis.`}),(0,D.jsx)(V,{id:`flip`,code:[{label:`Snudd tabell`,code:x(T,`TransposedScreen`)},{label:`CSS`,code:b(E,`Snudd tabell`,`Bla mellom`)}],smallLabel:`Snudd tabell, liten skjerm`,caption:`Årene går nedover, og brukeren velger hvilke to fylker som står side om side. Det fungerer når oppgaven er å sammenligne noen få oppføringer. Skal brukeren se alle fylkene samtidig, er det bedre å beholde tabellen og la den rulle.`,children:(0,D.jsx)(B,{})})]}),(0,D.jsxs)(`section`,{children:[(0,D.jsx)(l,{level:2,"data-size":`md`,children:`Bla mellom kolonnene`}),(0,D.jsx)(a,{children:`Når brukeren skal sammenligne alle oppføringene, men bare trenger noen få egenskaper om gangen. Tabellen viser alltid hele kolonner, så ingen tall blir kuttet på midten.`}),(0,D.jsxs)(`div`,{className:`switches`,children:[(0,D.jsx)(f,{"data-size":`sm`,label:`Fast overskriftsrad`,checked:e,onChange:e=>t(e.target.checked)}),(0,D.jsx)(f,{"data-size":`sm`,label:`Faste knapper nederst`,checked:n,onChange:e=>r(e.target.checked)})]}),(0,D.jsx)(V,{id:`cols`,code:[{label:`Tabell`,code:x(T,`ColumnNavScreen`)},{label:`CSS`,code:b(E,`Bla mellom kolonnene`)}],smallLabel:`Tabell der brukeren blar mellom kolonnene, liten skjerm`,caption:`Første kolonne står fast, og tabellen viser to år om gangen. Pilknappene ligger nederst, innenfor rekkevidde for tommelen. De flytter ett år frem eller tilbake, så brukeren kan sammenligne to år som ligger ved siden av hverandre. Teksten ved knappene sier hvilke år som vises. Den leses også opp av skjermleser når brukeren blar. Med bryterne kan du prøve med og uten fast overskriftsrad og faste knapper.`,children:(0,D.jsx)(L,{stickyHeader:e,stickyNav:n})})]})]})}(0,w.createRoot)(document.getElementById(`root`)).render((0,D.jsx)(C.StrictMode,{children:(0,D.jsx)(H,{})}));