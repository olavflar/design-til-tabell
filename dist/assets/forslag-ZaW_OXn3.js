import{B as e,F as t,G as n,H as r,N as i,R as a,S as o,U as s,V as c,_ as l,c as u,h as d,i as f,l as p,o as m,q as h,w as g,x as _,y as v}from"./DeviceFrame-BLfhRT72.js";/* empty css                 */import{a as ee,n as te,o as y,r as b,s as ne,t as re}from"./Tabell-B_tbC7fT.js";import{a as x,i as S,o as C,r as ie,t as ae}from"./Liste-BxIQwNdi.js";import{i as w,r as oe,t as T}from"./Kort-BzY60oka.js";import{i as se,n as E,r as D}from"./CodeExample-BWbKoMjZ.js";import{c as O,r as k,s as ce,t as A,u as j}from"./cases-Dv2GKvFc.js";import{t as M}from"./Download-DbQyOrjt.js";var N=h(n(),1),le=s(),P=r(),F=new Intl.NumberFormat(`nb-NO`,{maximumFractionDigits:1,minimumFractionDigits:1}),I=[{id:`uib`,name:`Informatikk, Bergen`,points:180,grade:52.3,places:120,language:`Norsk`,practice:`Nei`,start:`August`},{id:`uio`,name:`Informatikk, Oslo`,points:180,grade:54.1,places:200,language:`Norsk`,practice:`Nei`,start:`August`},{id:`hvl`,name:`Dataingeniør, Bergen`,points:180,grade:47.8,places:90,language:`Norsk`,practice:`Ja`,start:`August`},{id:`ntnu`,name:`Informatikk, Trondheim`,points:180,grade:53,places:150,language:`Norsk og engelsk`,practice:`Nei`,start:`August`}],ue=[{key:`grade`,label:`Poenggrense 2026`,num:!0,format:e=>F.format(e)},{key:`places`,label:`Studieplasser`,num:!0,format:e=>e},{key:`practice`,label:`Praksis`,format:e=>e},{key:`language`,label:`Undervisningsspråk`,format:e=>e},{key:`points`,label:`Studiepoeng`,num:!0,format:e=>e},{key:`start`,label:`Oppstart`,format:e=>e}];function L({initial:e=[`uib`,`hvl`]}){let n=(0,N.useId)(),[r,a]=(0,N.useState)(e),[o,s]=(0,N.useState)(!1),c=I.filter(e=>r.includes(e.id)),l=e=>a(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]),f=ue.filter(e=>!o||new Set(c.map(t=>t[e.key])).size>1);return(0,P.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Sammenlign studier`}),(0,P.jsxs)(d,{"data-size":`sm`,children:[(0,P.jsx)(d.Legend,{children:`Velg studier`}),(0,P.jsx)(d.Description,{children:`Velg to eller tre for å se dem side om side.`}),(0,P.jsx)(`div`,{className:`chips`,children:I.map(e=>(0,P.jsx)(i.Checkbox,{"data-size":`sm`,name:`${n}-studie`,value:e.id,checked:r.includes(e.id),onChange:()=>l(e.id),children:e.name},e.id))})]}),(0,P.jsx)(p,{"data-size":`sm`,label:`Vis bare det som er forskjellig`,checked:o,onChange:e=>s(e.target.checked)}),(0,P.jsx)(t,{role:`status`,"data-size":`sm`,className:`meta`,children:c.length<2?`Velg minst to studier for å sammenligne.`:`Sammenligner ${c.length} studier`}),c.length>0&&(0,P.jsx)(`div`,{className:`scroll-area`,role:`region`,"aria-label":`Sammenligning, tabell`,tabIndex:0,children:(0,P.jsxs)(u,{"data-size":`sm`,zebra:!0,className:`sticky-first compare`,children:[(0,P.jsx)(`caption`,{className:`ds-sr-only`,children:`Sammenligning av studier`}),(0,P.jsx)(u.Head,{children:(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Egenskap`}),c.map(e=>(0,P.jsx)(u.HeaderCell,{scope:`col`,children:e.name},e.id))]})}),(0,P.jsx)(u.Body,{children:f.map(e=>(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`row`,children:e.label}),c.map(t=>(0,P.jsx)(u.Cell,{className:e.num?`num`:void 0,children:e.format(t[e.key])},t.id))]},e.key))})]})})]})}var R=50,z=[{sted:`Kirkeveien`,pts:[22,25,31,38,45,52,58]},{sted:`Hjortnes`,pts:[30,28,33,35,41,47,54]},{sted:`Manglerud`,pts:[40,37,33,30,28,26,24]},{sted:`Alnabru`,pts:[18,20,19,22,21,23,22]},{sted:`Smestad`,pts:[25,27,30,29,31,33,36]},{sted:`Grønland`,pts:[35,38,36,34,33,35,34]}],B=e=>e.pts.at(-1),V=e=>{let t=e.at(-1)-e[0];return Math.abs(t)<5?`stabil`:t>0?`stigende`:`synkende`};function H({pts:e,max:t=60}){let n=e.map((n,r)=>`${r/(e.length-1)*64},${20-n/t*20}`).join(` `),r=20-R/t*20;return(0,P.jsxs)(`svg`,{className:`spark`,viewBox:`0 0 64 20`,width:64,height:20,"aria-hidden":!0,children:[(0,P.jsx)(`line`,{x1:`0`,x2:64,y1:r,y2:r,className:`spark__limit`}),(0,P.jsx)(`polyline`,{points:n,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`})]})}var U=({value:e})=>e>R?(0,P.jsx)(m,{"data-size":`sm`,"data-color":`danger`,children:`Over grenseverdi`}):null;function W({large:e=!1}){let n=(0,N.useId)(),[r,a]=(0,N.useState)(`hoyest`),o=[...z].sort((e,t)=>r===`hoyest`?B(t)-B(e):e.sted.localeCompare(t.sted,`nb`)),s=z.filter(e=>B(e)>R).length;return(0,P.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,P.jsx)(v,{level:3,"data-size":`sm`,id:n,children:`Svevestøv nå`}),(0,P.jsxs)(t,{"data-size":`sm`,className:`meta`,children:[`PM10, µg/m³. Grenseverdi `,R,`. `,(0,P.jsx)(m,{"data-size":`sm`,"data-color":`warning`,children:`Fiktive målinger`})]}),(0,P.jsx)(t,{"data-size":`sm`,children:(0,P.jsxs)(`strong`,{children:[s,` av `,z.length,` målestasjoner er over grenseverdien.`]})}),!e&&(0,P.jsxs)(d,{"data-size":`sm`,children:[(0,P.jsx)(d.Legend,{children:`Sorter etter`}),(0,P.jsx)(`div`,{className:`chips`,children:[[`hoyest`,`Høyest først`],[`navn`,`Navn A–Å`]].map(([e,t])=>(0,P.jsx)(i.Radio,{"data-size":`sm`,name:`${n}-sort`,value:e,checked:r===e,onChange:()=>a(e),children:t},e))})]}),(0,P.jsxs)(t,{role:`status`,className:`ds-sr-only`,children:[`Sortert: `,r===`hoyest`?`høyest først`:`navn A–Å`]}),e?(0,P.jsxs)(u,{"data-size":`sm`,className:`air-table`,children:[(0,P.jsx)(`caption`,{className:`ds-sr-only`,children:`Svevestøv nå`}),(0,P.jsx)(u.Head,{children:(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`col`,sort:r===`navn`?`ascending`:`none`,onClick:()=>a(`navn`),children:`Målestasjon`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,className:`num`,sort:r===`hoyest`?`descending`:`none`,onClick:()=>a(`hoyest`),children:`Nå`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Siste 7 timer`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:(0,P.jsx)(`span`,{className:`ds-sr-only`,children:`Nivå`})})]})}),(0,P.jsx)(u.Body,{children:o.map(e=>(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`row`,className:`plain`,children:e.sted}),(0,P.jsx)(u.Cell,{className:`num`,children:(0,P.jsx)(`strong`,{children:B(e)})}),(0,P.jsx)(u.Cell,{children:(0,P.jsxs)(`span`,{className:`trend`,children:[(0,P.jsx)(H,{pts:e.pts}),` `,V(e.pts)]})}),(0,P.jsx)(u.Cell,{children:(0,P.jsx)(U,{value:B(e)})})]},e.sted))})]}):(0,P.jsx)(l.Unordered,{className:`stacked`,role:`list`,"aria-labelledby":n,children:o.map(e=>(0,P.jsxs)(l.Item,{children:[(0,P.jsxs)(`div`,{className:`row`,children:[(0,P.jsx)(v,{level:4,"data-size":`2xs`,className:`row__title`,children:e.sted}),(0,P.jsxs)(t,{"data-size":`sm`,className:`num`,children:[(0,P.jsx)(`strong`,{children:B(e)}),` µg/m³`]})]}),(0,P.jsxs)(`div`,{className:`row`,children:[(0,P.jsxs)(t,{"data-size":`sm`,className:`subtle trend`,children:[(0,P.jsx)(H,{pts:e.pts}),` `,V(e.pts)]}),(0,P.jsx)(U,{value:B(e)})]})]},e.sted))})]})}function G({large:n=!1}){let r=(0,N.useId)(),[i,s]=(0,N.useState)(()=>[...A].sort(j).slice(0,6)),[c,d]=(0,N.useState)([]),[f,p]=(0,N.useState)(``),m=c.length===i.length&&i.length>0,h=e=>d(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]),g=()=>{if(!c.length)return p(`Velg minst én sak først.`);s(e=>e.filter(e=>!c.includes(e.id))),p(`${c.length} ${c.length===1?`sak`:`saker`} er arkivert.`),d([])},_=(0,P.jsx)(o,{"data-size":`sm`,label:`Velg alle`,checked:m,onChange:()=>d(m?[]:i.map(e=>e.id))});return(0,P.jsxs)(`div`,{className:`frame__content hifi bulk`,children:[(0,P.jsx)(v,{level:3,"data-size":`sm`,id:r,children:`Mine saker`}),n?(0,P.jsxs)(u,{"data-size":`sm`,className:`case-table`,children:[(0,P.jsx)(`caption`,{className:`ds-sr-only`,children:`Mine saker`}),(0,P.jsx)(u.Head,{children:(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`col`,className:`check-col`,children:_}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Sak`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Status`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Sist oppdatert`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Behandler`})]})}),(0,P.jsx)(u.Body,{children:i.map(t=>(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.Cell,{className:`check-col`,children:(0,P.jsx)(o,{"data-size":`sm`,"aria-label":`Velg ${t.title}`,checked:c.includes(t.id),onChange:()=>h(t.id)})}),(0,P.jsx)(u.HeaderCell,{scope:`row`,className:`plain`,children:(0,P.jsx)(e,{href:`#${t.id}`,children:t.title})}),(0,P.jsx)(u.Cell,{children:(0,P.jsx)(O,{status:t.status})}),(0,P.jsx)(u.Cell,{className:`num`,children:t.updated}),(0,P.jsx)(u.Cell,{children:t.handler})]},t.id))})]}):(0,P.jsxs)(P.Fragment,{children:[_,(0,P.jsx)(l.Unordered,{className:`stacked`,role:`list`,"aria-labelledby":r,children:i.map(n=>(0,P.jsxs)(l.Item,{className:`bulk__item`,children:[(0,P.jsx)(o,{"data-size":`sm`,"aria-label":`Velg ${n.title}`,checked:c.includes(n.id),onChange:()=>h(n.id)}),(0,P.jsxs)(`div`,{className:`bulk__body`,children:[(0,P.jsx)(v,{level:4,"data-size":`2xs`,children:(0,P.jsx)(e,{href:`#${n.id}`,children:n.title})}),(0,P.jsxs)(`div`,{className:`row`,children:[(0,P.jsxs)(t,{"data-size":`sm`,className:`subtle`,children:[`Oppdatert `,n.updated]}),(0,P.jsx)(O,{status:n.status})]})]})]},n.id))})]}),(0,P.jsxs)(`div`,{className:`bulk__bar`,children:[(0,P.jsx)(t,{"data-size":`sm`,role:`status`,children:f||`${c.length} valgt`}),(0,P.jsx)(a,{"data-size":`sm`,variant:`secondary`,onClick:g,children:`Arkiver valgte`})]})]})}var K=[`Jan`,`Feb`,`Mar`,`Apr`,`Mai`,`Jun`],q=[[`Tromsø`,[21.4,21.9,22.3,22.1,21.6,21.2]],[`Harstad`,[22.1,22.4,22.9,22.8,22.2,21.9]],[`Senja`,[22.6,22.8,23.2,23.4,22.9,22.5]],[`Balsfjord`,[22.3,22.6,23,22.9,22.4,22]],[`Lyngen`,[23,23.1,23.6,23.5,23.1,22.8]],[`Nordreisa`,[22.8,23,23.4,23.3,22.8,22.6]]];function de(){let e=[[`Kommune`,...K].join(`;`),...q.map(([e,t])=>[e,...t.map(e=>String(e).replace(`.`,`,`))].join(`;`))],t=URL.createObjectURL(new Blob([e.join(`
`)],{type:`text/csv;charset=utf-8`}));Object.assign(document.createElement(`a`),{href:t,download:`drivstoffpriser-troms-2026.csv`}).click(),URL.revokeObjectURL(t)}function J(){let e=(0,N.useId)(),[n,r]=(0,N.useState)(`billigst`),i=[...q].sort((e,t)=>e[1].at(-1)-t[1].at(-1));return(0,P.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,P.jsx)(v,{level:3,"data-size":`sm`,id:e,children:`Drivstoffpriser i Troms 2026`}),(0,P.jsxs)(t,{"data-size":`sm`,className:`meta`,children:[`Bensin 95, kr per liter, snitt per måned. `,(0,P.jsx)(m,{"data-size":`sm`,"data-color":`warning`,children:`Fiktive priser`})]}),(0,P.jsxs)(f,{"data-size":`sm`,value:n,onChange:r,"aria-label":`Velg visning`,children:[(0,P.jsx)(f.Item,{value:`billigst`,children:`Billigst nå`}),(0,P.jsx)(f.Item,{value:`utvikling`,children:`Utvikling`}),(0,P.jsx)(f.Item,{value:`alle`,children:`Alle data`})]}),n===`billigst`&&(0,P.jsx)(l.Ordered,{className:`stacked`,role:`list`,"aria-label":`Billigst i juni`,children:i.map(([e,n],r)=>(0,P.jsx)(l.Item,{children:(0,P.jsxs)(`div`,{className:`row`,children:[(0,P.jsxs)(v,{level:4,"data-size":`2xs`,className:`row__title`,children:[(0,P.jsxs)(`span`,{className:`rank`,"aria-hidden":!0,children:[r+1,`.`]}),e]}),(0,P.jsx)(t,{"data-size":`sm`,className:`num`,children:(0,P.jsxs)(`strong`,{children:[F.format(n.at(-1)),` kr`]})})]})},e))}),n===`utvikling`&&(0,P.jsx)(l.Unordered,{className:`multiples`,role:`list`,"aria-label":`Utvikling per kommune`,children:q.map(([e,n])=>(0,P.jsxs)(l.Item,{children:[(0,P.jsx)(t,{"data-size":`sm`,children:(0,P.jsx)(`strong`,{children:e})}),(0,P.jsx)(fe,{values:n}),(0,P.jsxs)(t,{"data-size":`sm`,className:`subtle`,children:[F.format(n[0]),` kr i januar, `,F.format(n.at(-1)),` kr i juni`]})]},e))}),n===`alle`&&(0,P.jsx)(`div`,{className:`scroll-area`,role:`region`,"aria-label":`Alle data, tabell`,tabIndex:0,children:(0,P.jsxs)(u,{"data-size":`sm`,zebra:!0,className:`sticky-first`,children:[(0,P.jsx)(`caption`,{className:`ds-sr-only`,children:`Drivstoffpriser i Troms 2026, kr per liter`}),(0,P.jsx)(u.Head,{children:(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Kommune`}),K.map(e=>(0,P.jsx)(u.HeaderCell,{scope:`col`,className:`num`,children:e},e))]})}),(0,P.jsx)(u.Body,{children:q.map(([e,t])=>(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`row`,children:e}),t.map((e,t)=>(0,P.jsx)(u.Cell,{className:`num`,children:F.format(e)},t))]},e))})]})}),(0,P.jsx)(`div`,{children:(0,P.jsxs)(a,{"data-size":`sm`,variant:`secondary`,onClick:de,children:[(0,P.jsx)(M,{"aria-hidden":!0}),`Last ned alle data (CSV)`]})})]})}function fe({values:e}){let t=120/e.length-4;return(0,P.jsx)(`svg`,{viewBox:`0 0 120 36`,width:120,height:36,"aria-hidden":!0,className:`mini-chart`,children:e.map((e,n)=>{let r=(e-21)/3*36;return(0,P.jsx)(`rect`,{x:n*(t+4),y:36-r,width:t,height:r,rx:`1`},n)})})}var Y=`import { useId, useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Fieldset,
  Heading,
  Link,
  List,
  Paragraph,
  Switch,
  Table,
  Tag,
  ToggleGroup,
} from "@digdir/designsystemet-react";
import { DownloadIcon } from "@navikt/aksel-icons";
import { CASES, StatusTag, byNewest } from "../components/cases.jsx";

/* Nye eksempler til forslaget til artikkel. Alle data er fiktive. */

const nb = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/* -------------------------------------------------------------------------- */
/* Brukeroppgave 2: Sammenligne få alternativer                               */
/* -------------------------------------------------------------------------- */

const STUDIES = [
  { id: "uib", name: "Informatikk, Bergen", points: 180, grade: 52.3, places: 120, language: "Norsk", practice: "Nei", start: "August" },
  { id: "uio", name: "Informatikk, Oslo", points: 180, grade: 54.1, places: 200, language: "Norsk", practice: "Nei", start: "August" },
  { id: "hvl", name: "Dataingeniør, Bergen", points: 180, grade: 47.8, places: 90, language: "Norsk", practice: "Ja", start: "August" },
  { id: "ntnu", name: "Informatikk, Trondheim", points: 180, grade: 53.0, places: 150, language: "Norsk og engelsk", practice: "Nei", start: "August" },
];

const STUDY_ROWS = [
  { key: "grade", label: "Poenggrense 2026", num: true, format: (v) => nb.format(v) },
  { key: "places", label: "Studieplasser", num: true, format: (v) => v },
  { key: "practice", label: "Praksis", format: (v) => v },
  { key: "language", label: "Undervisningsspråk", format: (v) => v },
  { key: "points", label: "Studiepoeng", num: true, format: (v) => v },
  { key: "start", label: "Oppstart", format: (v) => v },
];

/**
 * Snudd tabell: alternativene er kolonner og egenskapene går nedover. Brukeren
 * velger hvilke alternativer som står side om side, og kan skjule egenskapene
 * som er like for alle, så forskjellene kommer frem.
 */
export function CompareStudies({ initial = ["uib", "hvl"] }) {
  const id = useId();
  const [picked, setPicked] = useState(initial);
  const [onlyDiff, setOnlyDiff] = useState(false);
  const shown = STUDIES.filter((s) => picked.includes(s.id));
  const toggle = (sid) =>
    setPicked((cur) => (cur.includes(sid) ? cur.filter((x) => x !== sid) : [...cur, sid]));
  const rows = STUDY_ROWS.filter(
    (r) => !onlyDiff || new Set(shown.map((s) => s[r.key])).size > 1,
  );

  return (
    <div className="frame__content hifi">
      <Heading level={3} data-size="sm">Sammenlign studier</Heading>
      <Fieldset data-size="sm">
        <Fieldset.Legend>Velg studier</Fieldset.Legend>
        <Fieldset.Description>Velg to eller tre for å se dem side om side.</Fieldset.Description>
        <div className="chips">
          {STUDIES.map((s) => (
            <Chip.Checkbox key={s.id} data-size="sm" name={\`\${id}-studie\`} value={s.id}
              checked={picked.includes(s.id)} onChange={() => toggle(s.id)}>
              {s.name}
            </Chip.Checkbox>
          ))}
        </div>
      </Fieldset>
      <Switch data-size="sm" label="Vis bare det som er forskjellig" checked={onlyDiff}
        onChange={(e) => setOnlyDiff(e.target.checked)} />
      <Paragraph role="status" data-size="sm" className="meta">
        {shown.length < 2 ? "Velg minst to studier for å sammenligne." : \`Sammenligner \${shown.length} studier\`}
      </Paragraph>
      {shown.length > 0 && (
        <div className="scroll-area" role="region" aria-label="Sammenligning, tabell" tabIndex={0}>
          <Table data-size="sm" zebra className="sticky-first compare">
            <caption className="ds-sr-only">Sammenligning av studier</caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope="col">Egenskap</Table.HeaderCell>
                {shown.map((s) => (
                  <Table.HeaderCell key={s.id} scope="col">{s.name}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((r) => (
                <Table.Row key={r.key}>
                  <Table.HeaderCell scope="row">{r.label}</Table.HeaderCell>
                  {shown.map((s) => (
                    <Table.Cell key={s.id} className={r.num ? "num" : undefined}>{r.format(s[r.key])}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Brukeroppgave 5: Oppdage mønstre og avvik                                  */
/* -------------------------------------------------------------------------- */

const LIMIT = 50;
const STATIONS = [
  { sted: "Kirkeveien", pts: [22, 25, 31, 38, 45, 52, 58] },
  { sted: "Hjortnes", pts: [30, 28, 33, 35, 41, 47, 54] },
  { sted: "Manglerud", pts: [40, 37, 33, 30, 28, 26, 24] },
  { sted: "Alnabru", pts: [18, 20, 19, 22, 21, 23, 22] },
  { sted: "Smestad", pts: [25, 27, 30, 29, 31, 33, 36] },
  { sted: "Grønland", pts: [35, 38, 36, 34, 33, 35, 34] },
];
const now = (s) => s.pts.at(-1);
const trendWord = (pts) => {
  const d = pts.at(-1) - pts[0];
  return Math.abs(d) < 5 ? "stabil" : d > 0 ? "stigende" : "synkende";
};

/**
 * Trendgraf: en enkel linje i samme høyde som teksten. Den er bare visuell,
 * så teksten ved siden av sier utviklingen med ord.
 */
export function Sparkline({ pts, max = 60 }) {
  const w = 64, h = 20;
  const d = pts.map((p, i) => \`\${(i / (pts.length - 1)) * w},\${h - (p / max) * h}\`).join(" ");
  const limitY = h - (LIMIT / max) * h;
  return (
    <svg className="spark" viewBox={\`0 0 \${w} \${h}\`} width={w} height={h} aria-hidden>
      <line x1="0" x2={w} y1={limitY} y2={limitY} className="spark__limit" />
      <polyline points={d} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Over grenseverdien får en merkelapp med tekst, så fargen ikke er eneste kjennetegn */
const Level = ({ value }) =>
  value > LIMIT ? <Tag data-size="sm" data-color="danger">Over grenseverdi</Tag> : null;

/**
 * Luftkvalitet: på stor skjerm en tabell som kan sorteres med
 * kolonneoverskriftene, på liten skjerm en liste med samme sortering.
 * Målestasjonene over grenseverdien skiller seg ut med merkelapp, og
 * trendgrafen viser utviklingen ved siden av dagens verdi.
 */
export function AirQuality({ large = false }) {
  const id = useId();
  const [order, setOrder] = useState("hoyest");
  const items = [...STATIONS].sort((a, b) =>
    order === "hoyest" ? now(b) - now(a) : a.sted.localeCompare(b.sted, "nb"),
  );
  const over = STATIONS.filter((s) => now(s) > LIMIT).length;

  return (
    <div className="frame__content hifi">
      <Heading level={3} data-size="sm" id={id}>Svevestøv nå</Heading>
      <Paragraph data-size="sm" className="meta">
        PM10, µg/m³. Grenseverdi {LIMIT}. <Tag data-size="sm" data-color="warning">Fiktive målinger</Tag>
      </Paragraph>
      <Paragraph data-size="sm"><strong>{over} av {STATIONS.length} målestasjoner er over grenseverdien.</strong></Paragraph>
      {!large && (
        <Fieldset data-size="sm">
          <Fieldset.Legend>Sorter etter</Fieldset.Legend>
          <div className="chips">
            {[["hoyest", "Høyest først"], ["navn", "Navn A–Å"]].map(([v, l]) => (
              <Chip.Radio key={v} data-size="sm" name={\`\${id}-sort\`} value={v} checked={order === v} onChange={() => setOrder(v)}>{l}</Chip.Radio>
            ))}
          </div>
        </Fieldset>
      )}
      <Paragraph role="status" className="ds-sr-only">
        Sortert: {order === "hoyest" ? "høyest først" : "navn A–Å"}
      </Paragraph>
      {large ? (
        <Table data-size="sm" className="air-table">
          <caption className="ds-sr-only">Svevestøv nå</caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope="col" sort={order === "navn" ? "ascending" : "none"} onClick={() => setOrder("navn")}>Målestasjon</Table.HeaderCell>
              <Table.HeaderCell scope="col" className="num" sort={order === "hoyest" ? "descending" : "none"} onClick={() => setOrder("hoyest")}>Nå</Table.HeaderCell>
              <Table.HeaderCell scope="col">Siste 7 timer</Table.HeaderCell>
              <Table.HeaderCell scope="col"><span className="ds-sr-only">Nivå</span></Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {items.map((s) => (
              <Table.Row key={s.sted}>
                <Table.HeaderCell scope="row" className="plain">{s.sted}</Table.HeaderCell>
                <Table.Cell className="num"><strong>{now(s)}</strong></Table.Cell>
                <Table.Cell><span className="trend"><Sparkline pts={s.pts} /> {trendWord(s.pts)}</span></Table.Cell>
                <Table.Cell><Level value={now(s)} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <List.Unordered className="stacked" role="list" aria-labelledby={id}>
          {items.map((s) => (
            <List.Item key={s.sted}>
              <div className="row">
                <Heading level={4} data-size="2xs" className="row__title">{s.sted}</Heading>
                <Paragraph data-size="sm" className="num"><strong>{now(s)}</strong> µg/m³</Paragraph>
              </div>
              <div className="row">
                <Paragraph data-size="sm" className="subtle trend"><Sparkline pts={s.pts} /> {trendWord(s.pts)}</Paragraph>
                <Level value={now(s)} />
              </div>
            </List.Item>
          ))}
        </List.Unordered>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Brukeroppgave 6: Endre flere oppføringer samtidig                          */
/* -------------------------------------------------------------------------- */

/**
 * Avkryssing per oppføring og én handling for de valgte. Handlingene står
 * fast nederst og sier hvor mange som er valgt. Knappene er aldri
 * deaktivert: uten valg sier statusteksten hva brukeren må gjøre.
 */
export function BulkCases({ large = false }) {
  const id = useId();
  const [items, setItems] = useState(() => [...CASES].sort(byNewest).slice(0, 6));
  const [picked, setPicked] = useState([]);
  const [message, setMessage] = useState("");
  const all = picked.length === items.length && items.length > 0;
  const toggle = (cid) =>
    setPicked((cur) => (cur.includes(cid) ? cur.filter((x) => x !== cid) : [...cur, cid]));
  const archive = () => {
    if (!picked.length) return setMessage("Velg minst én sak først.");
    setItems((cur) => cur.filter((c) => !picked.includes(c.id)));
    setMessage(\`\${picked.length} \${picked.length === 1 ? "sak" : "saker"} er arkivert.\`);
    setPicked([]);
  };

  const selectAll = (
    <Checkbox data-size="sm" label="Velg alle" checked={all}
      onChange={() => setPicked(all ? [] : items.map((c) => c.id))} />
  );

  return (
    <div className="frame__content hifi bulk">
      <Heading level={3} data-size="sm" id={id}>Mine saker</Heading>
      {large ? (
        <Table data-size="sm" className="case-table">
          <caption className="ds-sr-only">Mine saker</caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope="col" className="check-col">{selectAll}</Table.HeaderCell>
              <Table.HeaderCell scope="col">Sak</Table.HeaderCell>
              <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              <Table.HeaderCell scope="col">Sist oppdatert</Table.HeaderCell>
              <Table.HeaderCell scope="col">Behandler</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {items.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell className="check-col">
                  <Checkbox data-size="sm" aria-label={\`Velg \${c.title}\`} checked={picked.includes(c.id)} onChange={() => toggle(c.id)} />
                </Table.Cell>
                <Table.HeaderCell scope="row" className="plain"><Link href={\`#\${c.id}\`}>{c.title}</Link></Table.HeaderCell>
                <Table.Cell><StatusTag status={c.status} /></Table.Cell>
                <Table.Cell className="num">{c.updated}</Table.Cell>
                <Table.Cell>{c.handler}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <>
          {selectAll}
          <List.Unordered className="stacked" role="list" aria-labelledby={id}>
            {items.map((c) => (
              <List.Item key={c.id} className="bulk__item">
                <Checkbox data-size="sm" aria-label={\`Velg \${c.title}\`} checked={picked.includes(c.id)} onChange={() => toggle(c.id)} />
                <div className="bulk__body">
                  <Heading level={4} data-size="2xs"><Link href={\`#\${c.id}\`}>{c.title}</Link></Heading>
                  <div className="row">
                    <Paragraph data-size="sm" className="subtle">Oppdatert {c.updated}</Paragraph>
                    <StatusTag status={c.status} />
                  </div>
                </div>
              </List.Item>
            ))}
          </List.Unordered>
        </>
      )}
      <div className="bulk__bar">
        <Paragraph data-size="sm" role="status">{message || \`\${picked.length} valgt\`}</Paragraph>
        <Button data-size="sm" variant="secondary" onClick={archive}>Arkiver valgte</Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Når du ikke kjenner brukeroppgaven                                         */
/* -------------------------------------------------------------------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun"];
const PRICES = [
  ["Tromsø", [21.4, 21.9, 22.3, 22.1, 21.6, 21.2]],
  ["Harstad", [22.1, 22.4, 22.9, 22.8, 22.2, 21.9]],
  ["Senja", [22.6, 22.8, 23.2, 23.4, 22.9, 22.5]],
  ["Balsfjord", [22.3, 22.6, 23.0, 22.9, 22.4, 22.0]],
  ["Lyngen", [23.0, 23.1, 23.6, 23.5, 23.1, 22.8]],
  ["Nordreisa", [22.8, 23.0, 23.4, 23.3, 22.8, 22.6]],
];

function downloadCsv() {
  const lines = [["Kommune", ...MONTHS].join(";"), ...PRICES.map(([k, v]) => [k, ...v.map((p) => String(p).replace(".", ","))].join(";"))];
  const url = URL.createObjectURL(new Blob([lines.join("\\n")], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "drivstoffpriser-troms-2026.csv" });
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Noen ferdige visninger for de vanligste spørsmålene, og «Alle data» for
 * dem som trenger alt. Visningene byttes med ToggleGroup. Alle data kan
 * også lastes ned. Tabellen med alle data ruller sideveis med fast første
 * kolonne, fordi det er rådata uten en bestemt oppgave.
 */
export function UnknownTask() {
  const id = useId();
  const [view, setView] = useState("billigst");
  const cheapest = [...PRICES].sort((a, b) => a[1].at(-1) - b[1].at(-1));

  return (
    <div className="frame__content hifi">
      <Heading level={3} data-size="sm" id={id}>Drivstoffpriser i Troms 2026</Heading>
      <Paragraph data-size="sm" className="meta">
        Bensin 95, kr per liter, snitt per måned. <Tag data-size="sm" data-color="warning">Fiktive priser</Tag>
      </Paragraph>
      <ToggleGroup data-size="sm" value={view} onChange={setView} aria-label="Velg visning">
        <ToggleGroup.Item value="billigst">Billigst nå</ToggleGroup.Item>
        <ToggleGroup.Item value="utvikling">Utvikling</ToggleGroup.Item>
        <ToggleGroup.Item value="alle">Alle data</ToggleGroup.Item>
      </ToggleGroup>

      {view === "billigst" && (
        <List.Ordered className="stacked" role="list" aria-label="Billigst i juni">
          {cheapest.map(([k, v], i) => (
            <List.Item key={k}>
              <div className="row">
                {/* Plassen vises, men skjermlesere får den fra ol */}
                <Heading level={4} data-size="2xs" className="row__title"><span className="rank" aria-hidden>{i + 1}.</span>{k}</Heading>
                <Paragraph data-size="sm" className="num"><strong>{nb.format(v.at(-1))} kr</strong></Paragraph>
              </div>
            </List.Item>
          ))}
        </List.Ordered>
      )}

      {view === "utvikling" && (
        /* Småbilder: samme figur og samme skala for hver kommune, så bare dataene endrer seg */
        <List.Unordered className="multiples" role="list" aria-label="Utvikling per kommune">
          {PRICES.map(([k, v]) => (
            <List.Item key={k}>
              <Paragraph data-size="sm"><strong>{k}</strong></Paragraph>
              <MiniChart values={v} />
              <Paragraph data-size="sm" className="subtle">
                {nb.format(v[0])} kr i januar, {nb.format(v.at(-1))} kr i juni
              </Paragraph>
            </List.Item>
          ))}
        </List.Unordered>
      )}

      {view === "alle" && (
        <div className="scroll-area" role="region" aria-label="Alle data, tabell" tabIndex={0}>
          <Table data-size="sm" zebra className="sticky-first">
            <caption className="ds-sr-only">Drivstoffpriser i Troms 2026, kr per liter</caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope="col">Kommune</Table.HeaderCell>
                {MONTHS.map((m) => <Table.HeaderCell key={m} scope="col" className="num">{m}</Table.HeaderCell>)}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {PRICES.map(([k, v]) => (
                <Table.Row key={k}>
                  <Table.HeaderCell scope="row">{k}</Table.HeaderCell>
                  {v.map((p, i) => <Table.Cell key={i} className="num">{nb.format(p)}</Table.Cell>)}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      <div>
        <Button data-size="sm" variant="secondary" onClick={downloadCsv}>
          <DownloadIcon aria-hidden />
          Last ned alle data (CSV)
        </Button>
      </div>
    </div>
  );
}

/** Liten stolpefigur med fast skala (21–24 kr), så figurene kan sammenlignes */
function MiniChart({ values }) {
  const min = 21, max = 24, w = 120, h = 36, bw = w / values.length - 4;
  return (
    <svg viewBox={\`0 0 \${w} \${h}\`} width={w} height={h} aria-hidden className="mini-chart">
      {values.map((v, i) => {
        const bh = ((v - min) / (max - min)) * h;
        return <rect key={i} x={i * (bw + 4)} y={h - bh} width={bw} height={bh} rx="1" />;
      })}
    </svg>
  );
}
`,X=`/* Forslag til artikkel: oppsett for artikkelen og de nye eksemplene */
.forslag { max-width: 90rem; }
.forslag section { scroll-margin-top: var(--ds-size-4); }
.forslag .rule { max-width: 44rem; display: flex; flex-direction: column; gap: var(--ds-size-2); }
.forslag .rule > * { margin: 0; }
.forslag .steps { max-width: 44rem; }
.forslag .overview { max-width: 44rem; }
.forslag .overview .ds-table, .forslag section > .ds-table { width: 100%; max-width: 44rem; }
.task { display: flex; flex-direction: column; gap: var(--ds-size-3); padding-top: var(--ds-size-6); }
.task > * { margin: 0; }
.task__facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: var(--ds-size-4); max-width: 64rem; }
.task__facts > div > * { margin: 0; }
.task__facts h4 { margin-bottom: var(--ds-size-2); }
.forslag .meta code { margin-inline-end: var(--ds-size-2); }
.forslag .cols .ds-details { align-self: start; }

/* Felles for eksemplene */
.hifi .plain { font-weight: inherit; }
.chips { display: flex; flex-wrap: wrap; gap: var(--ds-size-2); }
.compare { min-width: 100%; }
.compare th[scope="col"] { white-space: normal; min-width: 8rem; }

/* Trendgraf */
.spark { color: var(--ds-color-accent-base-default); vertical-align: middle; flex: none; }
.spark__limit { stroke: var(--ds-color-danger-border-default); stroke-dasharray: 2 2; stroke-width: 1; }
.trend { display: inline-flex; align-items: center; gap: var(--ds-size-2); }
.air-table { width: 100%; }

/* Avkryssing og handling for de valgte */
.bulk { padding-bottom: 0; }
.check-col { width: 1%; }
.bulk__item { flex-direction: row !important; align-items: flex-start; gap: var(--ds-size-3) !important; }
.bulk__body { flex: 1; display: flex; flex-direction: column; gap: var(--ds-size-1); }
.bulk__body > * { margin: 0; }
.bulk__bar {
  position: sticky; bottom: 0; z-index: 2;
  display: flex; justify-content: space-between; align-items: center; gap: var(--ds-size-3);
  margin-inline: calc(var(--ds-size-4) * -1);
  padding: var(--ds-size-3) var(--ds-size-4);
  background: var(--ds-color-neutral-background-default);
  border-top: 1px solid var(--ds-color-neutral-border-subtle);
}
.bulk__bar > p { margin: 0; }

/* Småbilder: samme figur og skala for hver kommune */
.multiples { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr)); gap: var(--ds-size-4); }
.multiples > li { margin: 0; display: flex; flex-direction: column; gap: var(--ds-size-1); }
.multiples > li > p { margin: 0; }
.mini-chart rect { fill: var(--ds-color-accent-base-default); }

/* Brukeroppgavene er egne seksjoner i seksjonen, og skal ha full bredde som eksemplene */
.art section > .task { max-width: none !important; }
.task > :not(.examples):not(.task__facts) { max-width: 44rem; }
.rank { display: inline-block; min-width: 1.75rem; font-variant-numeric: tabular-nums; color: var(--ds-color-neutral-text-subtle); }
`,pe=[...A].sort(j),Z=({children:e})=>(0,P.jsx)(c,{"data-color":`warning`,"data-size":`sm`,children:(0,P.jsxs)(t,{"data-size":`sm`,children:[(0,P.jsx)(`strong`,{children:`Til avklaring i gruppa:`}),` `,e]})}),Q=({items:e})=>(0,P.jsx)(l.Unordered,{children:e.map((e,t)=>(0,P.jsx)(l.Item,{children:e},t))});function $({n:e,id:n,title:r,when:i,examples:a,advice:o,components:s,children:c}){return(0,P.jsxs)(`section`,{className:`task`,"aria-labelledby":n,children:[(0,P.jsxs)(v,{level:3,"data-size":`sm`,id:n,children:[e,`. `,r]}),(0,P.jsx)(t,{children:i}),(0,P.jsxs)(`div`,{className:`task__facts`,children:[(0,P.jsxs)(`div`,{children:[(0,P.jsx)(v,{level:4,"data-size":`2xs`,children:`Eksempler`}),(0,P.jsx)(Q,{items:a})]}),(0,P.jsxs)(`div`,{children:[(0,P.jsx)(v,{level:4,"data-size":`2xs`,children:`Anbefaling`}),(0,P.jsx)(Q,{items:o})]})]}),(0,P.jsxs)(t,{"data-size":`sm`,className:`meta`,children:[`Komponenter: `,s.map((e,t)=>(0,P.jsxs)(`code`,{children:[e,(s.length-1,``)]},e))]}),c]})}var me=[[`1`,`Finne én oppføring`,`Liste, eller kort når oppføringene har handlinger`,`#oppgave-finne`],[`2`,`Sammenligne få alternativer`,`Snudd tabell der brukeren velger alternativene`,`#oppgave-fa`],[`3`,`Sammenligne mange oppføringer`,`Tabell som ruller sideveis, med fast første kolonne`,`#oppgave-mange`],[`4`,`Se nøkkelinformasjon, med detaljer ved behov`,`Liste eller kort med detaljer bak en handling`,`#oppgave-detaljer`],[`5`,`Oppdage mønstre og avvik`,`Tabell eller liste som markerer avvik, med trendgraf og sortering`,`#oppgave-avvik`],[`6`,`Endre oppføringer`,`Kort med handlinger, og avkryssing når flere skal endres samtidig`,`#oppgave-endre`]];function he(){return(0,P.jsxs)(`main`,{className:`art forslag`,children:[(0,P.jsx)(se,{current:`Forslag`}),(0,P.jsxs)(`header`,{children:[(0,P.jsxs)(t,{"data-size":`sm`,className:`eyebrow`,children:[`Mønster · `,(0,P.jsx)(m,{"data-size":`sm`,"data-color":`warning`,children:`Forslag til ny oppbygging`})]}),(0,P.jsx)(v,{level:1,"data-size":`lg`,children:`Strukturert informasjon på små skjermer`}),(0,P.jsx)(t,{"data-size":`lg`,children:`Mønsteret hjelper deg å velge mellom tabell, liste og kort, og å tilpasse visningen til små skjermer uten at sammenhengen i informasjonen går tapt.`}),(0,P.jsx)(`nav`,{"aria-label":`Innhold`,className:`toc`,children:[[`#definisjon`,`Definisjon`],[`#bruk`,`Slik bruker du mønsteret`],[`#forberedelser`,`Forberedelser`],[`#oppgaver`,`Velg visning`],[`#liten-skjerm`,`Tilpass til liten skjerm`],[`#visualiseringer`,`Små visualiseringer`],[`#sprak`,`Språk`],[`#kode`,`Kode`],[`#kilder`,`Kilder`]].map(([t,n])=>(0,P.jsx)(e,{href:t,children:n},t))})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`definisjon`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`definisjon`,children:`Definisjon`}),(0,P.jsxs)(t,{children:[`Strukturert informasjon er en samling `,(0,P.jsx)(`strong`,{children:`oppføringer`}),` av samme type, der hver oppføring har de samme `,(0,P.jsx)(`strong`,{children:`egenskapene`}),`. Saker med saksnummer, dato og status er strukturert informasjon. Det er også målinger fra flere steder og tidspunkter, og studietilbud med opptakskrav og poenggrense.`]}),(0,P.jsxs)(g,{"data-color":`accent`,variant:`tinted`,className:`rule`,children:[(0,P.jsx)(v,{level:3,"data-size":`xs`,children:`Regneark-testen`}),(0,P.jsxs)(t,{children:[`Kunne informasjonen stått i et regneark, med én rad per oppføring og én kolonne per egenskap? Da hører den til dette mønsteret. Er det bare én kolonne, er det en vanlig liste, og da gjelder retningslinjene for`,` `,(0,P.jsx)(e,{href:`https://designsystemet.no/no/components/docs/list/overview`,children:`List`}),`.`]})]}),(0,P.jsxs)(`div`,{className:`cols`,children:[(0,P.jsxs)(`div`,{children:[(0,P.jsx)(v,{level:3,"data-size":`2xs`,children:`Begreper`}),(0,P.jsx)(Q,{items:[(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`strong`,{children:`Oppføring:`}),` én sak, én måling, ett studietilbud. I en tabell er det en rad.`]}),(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`strong`,{children:`Egenskap:`}),` det alle oppføringene har, som status eller dato. I en tabell er det en kolonne.`]}),(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`strong`,{children:`Verdi:`}),` egenskapen for én oppføring, som «Under behandling». I en tabell er det en celle.`]})]})]}),(0,P.jsxs)(`div`,{children:[(0,P.jsx)(v,{level:3,"data-size":`2xs`,children:`Ikke med i mønsteret`}),(0,P.jsx)(Q,{items:[`Punktlister med tekst, som råd eller steg i en veiledning. Se List.`,`Menyer og navigasjon.`,`Skjemaer.`,`Grafer som egne visninger, som linjediagram og stolpediagram. Det hører til et eget mønster for datavisualisering.`]})]})]})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`bruk`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`bruk`,children:`Slik bruker du mønsteret`}),(0,P.jsx)(t,{children:`Mønsteret følger tre spørsmål. Resten av artikkelen er bygd opp etter dem.`}),(0,P.jsxs)(l.Ordered,{className:`steps`,children:[(0,P.jsxs)(l.Item,{children:[(0,P.jsx)(`strong`,{children:`Er det strukturert informasjon?`}),` Bruk regneark-testen. Hvis nei, se komponentene.`]}),(0,P.jsxs)(l.Item,{children:[(0,P.jsx)(`strong`,{children:`Hva skal brukeren gjøre?`}),` Brukeroppgaven avgjør om du velger tabell, liste eller kort. Se `,(0,P.jsx)(e,{href:`#oppgaver`,children:`Velg visning`}),`.`]}),(0,P.jsxs)(l.Item,{children:[(0,P.jsx)(`strong`,{children:`Hva skjer på liten skjerm?`}),` Behold tabellen, eller gjør den om til liste eller kort uten at sammenhengen går tapt. Se `,(0,P.jsx)(e,{href:`#liten-skjerm`,children:`Tilpass til liten skjerm`}),`.`]})]})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`forberedelser`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`forberedelser`,children:`Forberedelser`}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Kartlegg brukeroppgaven`}),(0,P.jsx)(Q,{items:[`Skal brukeren finne, sammenligne, oppdage avvik eller endre noe?`,`Hvilken egenskap kjenner brukeren igjen oppføringen på?`,`Hvilke egenskaper må være synlige samtidig, og hvilke kan ligge bak en handling?`,`Hvor mange oppføringer er det, og trenger brukeren søk, filter eller sortering?`]}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Utfordre dataene`}),(0,P.jsx)(t,{children:`En database har ofte mange flere egenskaper enn brukeren trenger. Vis ikke alle kolonnene fordi de finnes. Velg egenskapene ut fra brukeroppgaven, og la resten ligge bak en handling. Mange tabeller som er vanskelige på mobil, er egentlig en utskrift av databasen som ingen har prioritert.`}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Når du ikke kjenner brukeroppgaven`}),(0,P.jsx)(t,{children:`Noen ganger brukes visningen til mye forskjellig, eller virksomheten vil dele data uten å vite hva de skal brukes til. Da kan du lage noen ferdige visninger for de vanligste spørsmålene, og gi tilgang til alle dataene og nedlasting for dem som trenger mer. Ferdige visninger er lettere å tilpasse liten skjerm enn rådata.`}),(0,P.jsx)(k,{id:`ukjent`,smallLabel:`Ferdige visninger og alle data, liten skjerm`,large:(0,P.jsx)(J,{}),caption:`Tre visninger svarer på hvert sitt spørsmål: hvor er det billigst nå, hvordan har prisene utviklet seg, og alle data. Visningene byttes med ToggleGroup. «Alle data» er en tabell som ruller sideveis med fast første kolonne, og alle data kan lastes ned.`,render:()=>(0,P.jsx)(J,{}),code:[{label:`Visninger`,code:D(Y,`UnknownTask`,`MiniChart`,`downloadCsv`)},{label:`CSS`,code:E(X,`Småbilder`)}]}),(0,P.jsx)(Z,{children:`Utkastet foreslår også et chatgrensesnitt i stedet for visningen, og å la være å dele dataene. Skal det anbefales?`})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`oppgaver`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`oppgaver`,children:`Velg visning etter brukeroppgave`}),(0,P.jsx)(t,{children:`De samme dataene kan ofte vises som tabell, liste eller kort. Det er brukeroppgaven som avgjør hva som er best.`}),(0,P.jsx)(`div`,{className:`overview`,children:(0,P.jsxs)(u,{"data-size":`sm`,zebra:!0,children:[(0,P.jsx)(`caption`,{children:`Brukeroppgaver og anbefalt visning`}),(0,P.jsx)(u.Head,{children:(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Brukeroppgave`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Anbefalt visning`})]})}),(0,P.jsx)(u.Body,{children:me.map(([t,n,r,i])=>(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`row`,children:(0,P.jsxs)(e,{href:i,children:[t,`. `,n]})}),(0,P.jsx)(u.Cell,{children:r})]},t))})]})}),(0,P.jsx)($,{n:`1`,id:`oppgave-finne`,title:`Finne én oppføring`,when:`Brukeren skal finne og kjenne igjen én eller noen få oppføringer, ikke sammenligne dem.`,examples:[`Innboks`,`Mine søknader`,`Nyheter`],advice:[`Bruk en liste. Velg kort hvis hver oppføring har handlinger.`,`Sett det brukeren kjenner igjen oppføringen på først, som lenke.`,`Gi søk når listen er lang, og filter når det er få, kjente kategorier.`],components:[`List`,`Heading`,`Link`,`Tag`,`Input type="search"`,`Chip`],children:(0,P.jsx)(k,{id:`finne`,smallLabel:`Liste med søk og filter, liten skjerm`,large:(0,P.jsx)(S,{id:`finne-large`,large:!0}),caption:`På stor skjerm er det en tabell, på liten skjerm en liste. Søk, sortering og filter virker likt i begge, og antall treff leses opp av skjermleser.`,render:e=>(0,P.jsx)(S,{id:e}),code:[{label:`Liste`,code:D(C,`SearchableCases`)},{label:`CSS`,code:E(x,`Søk og filter`,`Dialog-knapp`)}]})}),(0,P.jsx)($,{n:`2`,id:`oppgave-fa`,title:`Sammenligne få alternativer`,when:`Brukeren skal velge mellom noen få alternativer og sammenligne flere egenskaper. Passer ikke når brukeren bare vurderer én egenskap.`,examples:[`Studietilbud`,`Avtaler der pris, varighet og vilkår varierer`,`Værmelding for noen få steder`],advice:[`Bruk tabell. Snu den, så egenskapene går nedover og alternativene står i kolonner.`,`Er det flere enn to eller tre alternativer, la brukeren velge hvilke som sammenlignes.`,`Gjør det lett å se det som skiller alternativene.`],components:[`Table`,`Chip`,`Switch`],children:(0,P.jsx)(k,{id:`fa`,smallLabel:`Snudd tabell, liten skjerm`,large:(0,P.jsx)(L,{initial:[`uib`,`uio`,`hvl`,`ntnu`]}),caption:`Egenskapene går nedover, og studiene står i kolonner. På liten skjerm velger brukeren to eller tre. Bryteren skjuler egenskapene som er like for alle, så forskjellene kommer frem. Blir tabellen bredere enn skjermen, står første kolonne fast.`,render:()=>(0,P.jsx)(L,{}),code:[{label:`Tabell`,code:D(Y,`CompareStudies`)},{label:`CSS`,code:E(y,`Fast førstekolonne`,`Toning`)}]})}),(0,P.jsxs)($,{n:`3`,id:`oppgave-mange`,title:`Sammenligne mange oppføringer`,when:`Brukeren skal se mange oppføringer og egenskaper i sammenheng: sammenligne, finne høyeste og laveste verdi eller se utvikling over tid.`,examples:[`Tidsserier og måledata`,`Pris- og takstmatriser`,`Nøkkeltall per fylke eller kommune`],advice:[`Behold tabellen og la den rulle sideveis.`,`Lås første kolonne, så navnet på oppføringen alltid er synlig.`,`Lås overskriftsraden når tabellen er lang.`,`Vis tydelig at tabellen fortsetter til siden.`],components:[`Table`],children:[(0,P.jsx)(k,{id:`mange`,smallLabel:`Tabell som ruller sideveis, liten skjerm`,large:(0,P.jsxs)(`div`,{className:`frame__content hifi`,children:[(0,P.jsx)(re,{id:`mange-large`}),(0,P.jsx)(b,{data:ee,captionId:`mange-large`})]}),caption:`Første kolonne og overskriftsraden står fast, og resten ruller sideveis. Skygge ved den faste kolonnen og en toning til høyre viser at det er mer innhold.`,render:e=>(0,P.jsx)(te,{id:e}),code:[{label:`Tabell`,code:D(ne,`StatTable`,`ScrollArea`)},{label:`CSS`,code:E(y,`Rulleflaten`,`Snudd tabell`)}]}),(0,P.jsx)(Z,{children:`Er det riktig å anbefale tabell med sideveis rulling når oppføringene har mange egenskaper, eller bør vi først anbefale å prøve liste eller kort? Det må begrunnes ut fra WCAG 1.4.10.`})]}),(0,P.jsx)($,{n:`4`,id:`oppgave-detaljer`,title:`Se nøkkelinformasjon, med detaljer ved behov`,when:`Brukeren trenger noen få egenskaper for å finne oppføringen, og resten bare av og til.`,examples:[`Saker med mange felt`,`Vedtak`,`Fakturaer`],advice:[`Vis det viktigste i listen, og legg resten bak en handling.`,`Bruk Details når detaljene er korte, og Dialog når de er mange.`,`Fjern ikke informasjon. Legg den ett trykk unna.`],components:[`List`,`Details`,`Dialog`,`Table`],children:(0,P.jsx)(k,{id:`detaljer`,smallLabel:`Liste med detaljer ved behov, liten skjerm`,caption:`Navn og status er alltid synlige. Resten ligger under «Detaljer om saken», som etikett og verdi.`,render:e=>(0,P.jsx)(ce,{id:e,children:(0,P.jsx)(ae,{items:pe,labelledBy:e})}),code:[{label:`Liste`,code:D(C,`DetailsList`)},{label:`CSS`,code:E(x,`Detaljer ved behov`,`Søk og filter`)}]})}),(0,P.jsx)($,{n:`5`,id:`oppgave-avvik`,title:`Oppdage mønstre og avvik`,when:`Brukeren leter etter det som skiller seg ut, men vet ikke hva det er på forhånd.`,examples:[`Måleverdier over en grense`,`Utgifter som er høyere enn budsjett`,`Saker som har ligget lenge`],advice:[`La løsningen finne avvikene når den kan, og si det i klartekst over visningen.`,`Merk avvik med tekst, ikke bare farge.`,`Sorter så avvikene kommer først.`,`Vis utviklingen ved siden av verdien, for eksempel med en trendgraf.`],components:[`Table`,`List`,`Tag`,`Chip`],children:(0,P.jsx)(k,{id:`avvik`,smallLabel:`Liste med avvik og trendgraf, liten skjerm`,large:(0,P.jsx)(W,{large:!0}),caption:`Teksten over sier hvor mange som er over grenseverdien. De er sortert først og har en merkelapp med tekst. Trendgrafen viser utviklingen, og ordet ved siden av sier den med tekst. På stor skjerm sorterer brukeren med kolonneoverskriftene.`,render:()=>(0,P.jsx)(W,{}),code:[{label:`Visning`,code:D(Y,`AirQuality`,`Sparkline`,`Level`)},{label:`CSS`,code:E(X,`Trendgraf`,`Avkryssing`)}]})}),(0,P.jsxs)($,{n:`6`,id:`oppgave-endre`,title:`Endre oppføringer`,when:`Brukeren skal endre, slette eller legge til oppføringer, én om gangen eller flere samtidig.`,examples:[`Kostnader i en søknad`,`Endre status på flere saker`,`Arkivere meldinger`],advice:[`Én om gangen: bruk kort med handlingene nederst i kortet.`,`Flere samtidig: la brukeren krysse av og velge én handling for alle de valgte.`,`Vis feil inne i kortet eller raden de gjelder.`,`Ikke deaktiver knapper. Si i stedet hva brukeren må gjøre.`],components:[`Card`,`Button`,`Popover`,`ValidationMessage`,`ErrorSummary`,`Checkbox`],children:[(0,P.jsx)(k,{id:`endre`,smallLabel:`Kort med handlinger, liten skjerm`,large:(0,P.jsx)(T,{large:!0}),caption:`Endre og Slett står nederst i kortet. Feilen står der beløpet skulle stått. Slett ber om bekreftelse. Endre og «Legg til kostnad» åpner et skjema i en dialog. Feil vises ved feltet de gjelder. Når brukeren lagrer, oppdateres tabellen eller kortet, en melding sier hva som skjedde, og fokus går tilbake til knappen.`,render:()=>(0,P.jsx)(T,{}),code:[{label:`Kort`,code:D(w,`CostCards`,`EditButton`,`DeleteButton`)},{label:`Skjema`,code:D(w,`CostForm`,`parseKr`)},{label:`Siden`,code:D(w,`Costs`)},{label:`Tabell`,code:D(w,`CostTable`)},{label:`CSS`,code:E(oe,`Med handlinger`,`Stor skjerm`)}]}),(0,P.jsx)(k,{id:`flere`,smallLabel:`Velg flere og arkiver, liten skjerm`,large:(0,P.jsx)(G,{large:!0}),caption:`Hver oppføring har en avkrysningsboks, og «Velg alle» står øverst. Handlingen står fast nederst og sier hvor mange som er valgt. Knappen er aldri deaktivert: uten valg sier teksten hva brukeren må gjøre.`,render:()=>(0,P.jsx)(G,{}),code:[{label:`Visning`,code:D(Y,`BulkCases`)},{label:`CSS`,code:E(X,`Avkryssing`,`Småbilder`)}]}),(0,P.jsx)(Z,{children:`Designsystemet har ingen data grid. Er avkryssing og én handling for de valgte godt nok, eller skal endring av flere oppføringer samtidig holdes utenfor mønsteret?`})]}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Tabell, liste eller kort`}),(0,P.jsx)(t,{children:`Det er en glidende overgang fra enkle lister til kort med mye innhold. Mengden innhold per oppføring avgjør:`}),(0,P.jsx)(`div`,{className:`cols`,children:[[`Tabell`,[`Brukeren sammenligner verdier på tvers av oppføringene.`,`Hver rad er samme type innhold.`,`Verdiene er korte.`]],[`Liste`,[`Brukeren finner eller skanner.`,`Få egenskaper per oppføring.`,`Oppføringen er en vei videre.`]],[`Kort`,[`Mange egenskaper, eller handlinger.`,`Brukeren jobber med én oppføring om gangen.`,`Innholdet varierer i lengde.`]]].map(([e,t])=>(0,P.jsxs)(_,{children:[(0,P.jsxs)(_.Summary,{children:[e,` kan være greit når …`]}),(0,P.jsx)(_.Content,{children:(0,P.jsx)(Q,{items:t})})]},e))})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`liten-skjerm`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`liten-skjerm`,children:`Tilpass til liten skjerm`}),(0,P.jsx)(t,{children:`Når en tabell blir en liste eller kort, må sammenhengen bestå. Brukeren skal aldri være i tvil om hva en verdi beskriver, eller hvilke verdier som hører til samme oppføring.`}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Fire faste plasser per oppføring`}),(0,P.jsx)(ie,{}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Hjelp brukeren å finne frem`}),(0,P.jsx)(`div`,{className:`cols`,children:[[`Søk`,`Når listen er lang og brukeren vet hva de leter etter.`,`Input type="search"`],[`Filter`,`Når det er få, kjente kategorier, for eksempel status.`,`Chip.Checkbox i Fieldset`],[`Sortering`,`Når rekkefølgen hjelper oppgaven, for eksempel høyest først.`,`Chip.Radio, Select fra 7 valg`],[`Gruppering`,`Når oppføringene har en naturlig inndeling.`,`Overskrift og liste per gruppe`],[`Oppdeling i sider`,`Når listen er så lang at den blir tung å bla i.`,`Pagination`],[`Fast overskrift og kolonne`,`Når tabellen beholdes og ruller.`,`Table stickyHeader`]].map(([e,n,r])=>(0,P.jsxs)(`div`,{children:[(0,P.jsx)(v,{level:4,"data-size":`2xs`,children:e}),(0,P.jsx)(t,{"data-size":`sm`,children:n}),(0,P.jsx)(t,{"data-size":`sm`,className:`meta`,children:(0,P.jsx)(`code`,{children:r})})]},e))}),(0,P.jsx)(t,{children:`Endringer fra søk, filter og sortering skal meldes til skjermlesere, for eksempel «Viser 3 av 8 saker».`})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`visualiseringer`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`visualiseringer`,children:`Små visualiseringer`}),(0,P.jsx)(t,{children:`På små skjermer er det sjelden plass til store grafer. Små visualiseringer kan stå rett i en celle eller en listeoppføring, så brukeren slipper å hoppe mellom tall og graf.`}),(0,P.jsx)(Q,{items:[(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`strong`,{children:`Trendgraf:`}),` en linje ved siden av verdien, som viser utviklingen. Si også utviklingen med ord. Se eksempelet under `,(0,P.jsx)(e,{href:`#oppgave-avvik`,children:`Oppdage mønstre og avvik`}),`.`]}),(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`strong`,{children:`Symboler:`}),` sparer plass, men skal alltid ha tekst, for eksempel en merkelapp eller et skjult navn.`]}),(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(`strong`,{children:`Småbilder`}),` (small multiples): samme lille figur med samme skala for hver oppføring, så bare dataene endrer seg. Se «Utvikling» i eksempelet under `,(0,P.jsx)(e,{href:`#forberedelser`,children:`Forberedelser`}),`.`]})]}),(0,P.jsx)(t,{children:`Store grafer hører til et eget mønster. Har du en graf, bør dataene også finnes som tabell, for skjermlesere, KI-agenter og alle som trenger de nøyaktige tallene.`})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`sprak`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`sprak`,children:`Språk`}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Forkortelser`}),(0,P.jsx)(Q,{items:[`Bruk bare allment kjente forkortelser, som org.nr., tlf. og kr.`,`Unngå interne fagbegreper og saksbehandlerbegreper.`,`Velg et kortere ord fremfor å forkorte, for eksempel «Dato» i stedet for «Reg.dato».`]}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Avkorting av tekst`}),(0,P.jsx)(Q,{items:[`La teksten bryte over flere linjer i stedet for å kutte den.`,`Kutter du likevel, må hele teksten kunne leses, og skjermlesere skal alltid få hele teksten.`,`Kutt i slutten. Kutt i midten når oppføringene ligner hverandre, eller når det er filnavn, så filtypen synes.`]})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`kode`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`kode`,children:`Kode`}),(0,P.jsxs)(g,{"data-color":`accent`,variant:`tinted`,className:`rule`,children:[(0,P.jsx)(v,{level:3,"data-size":`xs`,children:`Kod innholdet etter hva det er, ikke etter hvordan det ser ut`}),(0,P.jsx)(t,{children:`Velg element ut fra strukturen i innholdet, og style det etterpå. Utseendet skal ikke love mer struktur enn koden har. Vises kolonneoverskrifter, skal det være en tabell.`})]}),(0,P.jsxs)(u,{"data-size":`sm`,zebra:!0,children:[(0,P.jsx)(`caption`,{children:`Hvilket element passer`}),(0,P.jsx)(u.Head,{children:(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Innhold`}),(0,P.jsx)(u.HeaderCell,{scope:`col`,children:`Element`})]})}),(0,P.jsx)(u.Body,{children:[[`Rader og kolonner som sammenlignes`,`table, med caption og th`],[`Oppføringer som står hver for seg`,`ul`],[`Oppføringer der rekkefølgen betyr noe, som kø, steg eller rangering`,`ol`],[`Etikett og verdi`,`dl, eller table med radoverskrifter`],[`Navnet på en oppføring`,`Overskrift, som regel med lenke`]].map(([e,t])=>(0,P.jsxs)(u.Row,{children:[(0,P.jsx)(u.HeaderCell,{scope:`row`,children:e}),(0,P.jsx)(u.Cell,{children:(0,P.jsx)(`code`,{children:t})})]},e))})]}),(0,P.jsx)(v,{level:3,"data-size":`sm`,children:`Når tabellen blir en liste`}),(0,P.jsx)(Q,{items:[`Vis ulik kode på stor og liten skjerm: en tabell der det er en tabell, og en liste der det er en liste.`,(0,P.jsxs)(P.Fragment,{children:[`Ikke gjør om en tabell med CSS. `,(0,P.jsx)(`code`,{children:`display: block`}),` på tabellelementer fjerner tabellstrukturen for skjermlesere i flere nettlesere.`]}),`Mål bredden på flaten tabellen står i, ikke bare vinduet.`,(0,P.jsxs)(P.Fragment,{children:[`En sortert liste er fortsatt en `,(0,P.jsx)(`code`,{children:`ul`}),`. Rekkefølgen endrer seg når brukeren sorterer på nytt.`]}),(0,P.jsxs)(P.Fragment,{children:[`Lister der kulepunktene er fjernet med CSS, trenger `,(0,P.jsx)(`code`,{children:`role="list"`}),` for å bli lest som liste i Safari.`]}),(0,P.jsxs)(P.Fragment,{children:[`Meld endringer fra søk, filter og sortering med `,(0,P.jsx)(`code`,{children:`role="status"`}),`.`]})]}),(0,P.jsx)(t,{children:`Følg komponentdokumentasjonen for detaljene, og lenk dit i stedet for å gjenta den.`})]}),(0,P.jsxs)(`section`,{"aria-labelledby":`kilder`,children:[(0,P.jsx)(v,{level:2,"data-size":`md`,id:`kilder`,children:`Kilder`}),(0,P.jsx)(Q,{items:[`Uutilsynet: Tabeller`,`WCAG 1.3.1 Informasjon og relasjoner (Uutilsynet)`,`WCAG 1.4.10 Dynamisk tilpasning (Uutilsynet)`,(0,P.jsx)(e,{href:`https://data.norge.no`,children:`Felles datakatalog`},`fdk`)]}),(0,P.jsx)(t,{"data-size":`sm`,className:`meta`,children:`Lenkene til Uutilsynet legges inn.`}),(0,P.jsx)(t,{"data-size":`sm`,className:`meta`,children:`Arbeidsgruppe: Digdir, Nav, Oslo kommune, Skatteetaten, Politiet, Brønnøysundregistrene og Entur.`})]})]})}(0,le.createRoot)(document.getElementById(`root`)).render((0,P.jsx)(N.StrictMode,{children:(0,P.jsx)(he,{})}));