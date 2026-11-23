import { useId, useState } from "react";
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
            <Chip.Checkbox key={s.id} data-size="sm" name={`${id}-studie`} value={s.id}
              checked={picked.includes(s.id)} onChange={() => toggle(s.id)}>
              {s.name}
            </Chip.Checkbox>
          ))}
        </div>
      </Fieldset>
      <Switch data-size="sm" label="Vis bare det som er forskjellig" checked={onlyDiff}
        onChange={(e) => setOnlyDiff(e.target.checked)} />
      <Paragraph role="status" data-size="sm" className="meta">
        {shown.length < 2 ? "Velg minst to studier for å sammenligne." : `Sammenligner ${shown.length} studier`}
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
  const d = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - (p / max) * h}`).join(" ");
  const limitY = h - (LIMIT / max) * h;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden>
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
              <Chip.Radio key={v} data-size="sm" name={`${id}-sort`} value={v} checked={order === v} onChange={() => setOrder(v)}>{l}</Chip.Radio>
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
    setMessage(`${picked.length} ${picked.length === 1 ? "sak" : "saker"} er arkivert.`);
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
                  <Checkbox data-size="sm" aria-label={`Velg ${c.title}`} checked={picked.includes(c.id)} onChange={() => toggle(c.id)} />
                </Table.Cell>
                <Table.HeaderCell scope="row" className="plain"><Link href={`#${c.id}`}>{c.title}</Link></Table.HeaderCell>
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
                <Checkbox data-size="sm" aria-label={`Velg ${c.title}`} checked={picked.includes(c.id)} onChange={() => toggle(c.id)} />
                <div className="bulk__body">
                  <Heading level={4} data-size="2xs"><Link href={`#${c.id}`}>{c.title}</Link></Heading>
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
        <Paragraph data-size="sm" role="status">{message || `${picked.length} valgt`}</Paragraph>
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
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
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
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden className="mini-chart">
      {values.map((v, i) => {
        const bh = ((v - min) / (max - min)) * h;
        return <rect key={i} x={i * (bw + 4)} y={h - bh} width={bw} height={bh} rx="1" />;
      })}
    </svg>
  );
}
