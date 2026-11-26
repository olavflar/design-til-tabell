import { useId, useMemo, useState } from "react";
import {
  Button,
  Card,
  Chip,
  Field,
  Fieldset,
  Heading,
  Label,
  List,
  Paragraph,
  Select,
  Table,
  Tag,
  Textfield,
} from "@digdir/designsystemet-react";
import { DownloadIcon, FunnelIcon } from "@navikt/aksel-icons";
import HifiNav from "../components/HifiNav.jsx";
import { Example } from "../components/cases.jsx";

/* Eksempel på filtrering: kontobevegelser i et dødsbo. Banken, kontoene, navnene
   og beløpene er fiktive. */

const ACCOUNTS = [
  { id: "bruk", name: "Brukskonto", number: "1234 56 78901", count: 412 },
  { id: "regning", name: "Regningskonto", number: "1234 56 78902", count: 64 },
  { id: "spare", name: "Sparekonto", number: "1234 56 78903", count: 9 },
  { id: "hoyrente", name: "Høyrentekonto", number: "1234 56 78904", count: 3 },
  { id: "kreditt", name: "Kredittkort", number: "1234 56 78905", count: 41 },
];

// Fra dødsdatoen og tre måneder tilbake
const DEATH = new Date(2026, 9, 17);
const FIRST = new Date(2026, 6, 17);

const OUT = [
  ["Varekjøp", ["Dagligvare Sentrum", "Matbutikken Torget", "Bakeriet", "Kiosken Stasjonen", "Apoteket Torget", "Bensinstasjonen E6", "Kafé Hjørnet", "Bokhandelen", "Jernvarehandelen", "Blomsterbutikken"], [40, 1300]],
  ["Varekjøp utland", ["Nettbutikk Europa", "Strømmetjeneste"], [99, 450]],
  ["Uttak i minibank", ["Minibank Sentrum"], [200, 1000]],
  ["Straksbetaling", ["Kari Nordmann", "Ola Nordmann"], [150, 2500]],
  ["Fast overføring", ["Sparekonto"], [700, 700]],
];
const BILLS = [
  ["Efaktura", ["Strøm AS", "Forsikringsselskapet", "Kommunale avgifter", "Telefon og internett", "Borettslaget"], [300, 6500]],
];
const IN = [
  ["Stønad", ["Nav utbetaling"], [1500, 1500]],
  ["Pensjon", ["Nav pensjon"], [18400, 18400]],
  ["Straksbetaling", ["Kari Nordmann", "Ola Nordmann"], [500, 2500]],
];

/** Fast «tilfeldig» rekkefølge, så dataene er like hver gang */
function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function makeRows(account, n) {
  const rnd = seeded(account.number.replaceAll(" ", "") % 2147483647 || 7);
  const span = DEATH - FIRST;
  const outs = account.id === "regning" ? BILLS : account.id === "kreditt" ? OUT.slice(0, 2) : OUT;
  const ins = account.id === "spare" || account.id === "hoyrente"
    ? [["Fast overføring", ["Brukskonto"], [700, 700]], ["Renter", ["Renter"], [12, 80]]]
    : account.id === "regning" ? [["Fast overføring", ["Brukskonto"], [3000, 9000]]] : IN;
  return Array.from({ length: n }, (_, i) => {
    const incoming = rnd() < (account.id === "spare" || account.id === "hoyrente" ? 0.9 : 0.12);
    const [type, names, [min, max]] = (incoming ? ins : outs)[Math.floor(rnd() * (incoming ? ins : outs).length)];
    const raw = min + rnd() * (max - min);
    const amount = Math.round((min === max ? raw : raw) * 100) / 100;
    return {
      id: `${account.id}-${i}`,
      date: new Date(FIRST.getTime() + rnd() * span),
      type,
      text: names[Math.floor(rnd() * names.length)],
      amount: incoming ? amount : -amount,
    };
  }).sort((a, b) => b.date - a.date);
}

const ROWS = Object.fromEntries(ACCOUNTS.map((a) => [a.id, makeRows(a, a.count)]));

const kr = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => d.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
/** Inn får pluss, ut får minus, så retningen står i teksten */
const fmtAmount = (value) => `${value > 0 ? "+" : "−"}${kr.format(Math.abs(value))}`;
const parseKr = (s) => {
  const n = Number(String(s).replace(/\s/g, "").replace(",", "."));
  return s.trim() === "" || Number.isNaN(n) ? null : n;
};

const DIRECTIONS = [["alle", "Alle"], ["inn", "Inn"], ["ut", "Ut"]];
const PAGE = 25;

function downloadCsv() {
  const lines = [["Konto", "Kontonummer", "Dato", "Type", "Beskrivelse", "Beløp"].join(";")];
  for (const a of ACCOUNTS) {
    for (const r of ROWS[a.id]) lines.push([a.name, a.number, fmtDate(r.date), r.type, r.text, String(r.amount).replace(".", ",")].join(";"));
  }
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
  Object.assign(document.createElement("a"), { href: url, download: "kontobevegelser.csv" }).click();
  URL.revokeObjectURL(url);
}

/** Bevegelsene som passer filtrene. Beløpsfiltrene gjelder både inn og ut. */
function filterRows(rows, f) {
  const lo = parseKr(f.min ?? ""), hi = parseKr(f.max ?? "");
  return rows.filter((r) => {
    const day = isoDate(r.date);
    if (f.from && day < f.from) return false;
    if (f.to && day > f.to) return false;
    if (lo !== null && Math.abs(r.amount) < lo) return false;
    if (hi !== null && Math.abs(r.amount) > hi) return false;
    if (f.direction === "inn" && r.amount < 0) return false;
    if (f.direction === "ut" && r.amount > 0) return false;
    return true;
  });
}

/**
 * Kontobevegelser med filter.
 * Konto velges med Select, med navn og kontonummer, som i den opprinnelige løsningen.
 * Én knapp, «Filter», åpner en oversikt med alle filtrene under knappen. Brukeren fyller ut
 * og trykker «Vis … treff», som sier på forhånd hvor mange treff det blir. Da lukkes
 * oversikten, og hvert filter står som en brikke som kan fjernes. Listen endres ikke før
 * brukeren har trykket på knappen. Feil vises ved feltet de gjelder.
 * Valgte filtre står samlet og kan fjernes ett og ett. Antall treff meldes med role="status".
 * Stor skjerm: tabell. Liten skjerm: liste med beskrivelse og beløp først.
 */
export function Transactions({ large = false }) {
  const uid = useId();
  const [account, setAccount] = useState("bruk");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [direction, setDirection] = useState("alle");
  const [limit, setLimit] = useState(PAGE);
  // Filteroversikten er åpen, og verdiene i den før brukeren har trykket «Vis treff»
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({});
  const [errors, setErrors] = useState({});
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  const toggle = () => {
    setErrors({});
    if (!open) setDraft({ from, to, min, max, direction });
    setOpen(!open);
  };
  const close = () => {
    setOpen(false);
    setErrors({});
    document.getElementById(`${uid}-filter-btn`)?.focus();
  };
  const apply = () => {
    // Feilmeldingene står ved feltet de gjelder, som i mønsteret for feilmeldinger
    const a = parseKr(draft.min), b = parseKr(draft.max);
    const e = {};
    if (draft.from && draft.to && draft.from > draft.to) e.to = "Til-datoen må være etter fra-datoen.";
    if (draft.min.trim() && a === null) e.min = "Skriv beløpet med tall, for eksempel 1500.";
    if (draft.max.trim() && b === null) e.max = "Skriv beløpet med tall, for eksempel 1500.";
    if (!e.min && !e.max && a !== null && b !== null && a > b) e.max = "Høyst må være mer enn minst.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setFrom(draft.from); setTo(draft.to); setMin(draft.min); setMax(draft.max); setDirection(draft.direction);
    setLimit(PAGE);
    close();
  };

  const acc = ACCOUNTS.find((a) => a.id === account);
  const all = ROWS[account];
  const lo = parseKr(min);
  const hi = parseKr(max);
  const shown = useMemo(() => filterRows(all, { from, to, min, max, direction }), [all, from, to, min, max, direction]);
  // Antall treff med verdiene i oversikten, til knappen «Vis … treff»
  const draftCount = open ? filterRows(all, draft).length : 0;
  const visible = shown.slice(0, limit);

  const active = [
    from && { key: "from", label: `Fra ${fmtDate(new Date(from))}`, clear: () => setFrom("") },
    to && { key: "to", label: `Til ${fmtDate(new Date(to))}`, clear: () => setTo("") },
    lo !== null && { key: "min", label: `Minst ${kr.format(lo)} kr`, clear: () => setMin("") },
    hi !== null && { key: "max", label: `Høyst ${kr.format(hi)} kr`, clear: () => setMax("") },
    direction !== "alle" && { key: "dir", label: direction === "inn" ? "Bare inn" : "Bare ut", clear: () => setDirection("alle") },
  ].filter(Boolean);
  const clearAll = () => { setFrom(""); setTo(""); setMin(""); setMax(""); setDirection("alle"); };

  return (
    <div className="frame__content hifi tx">
      <Paragraph data-size="sm" className="meta">
        Eksempelbanken <Tag data-size="sm" data-color="warning">Fiktive data</Tag>
      </Paragraph>
      <Heading level={3} data-size="sm" id={`${uid}-title`}>Kontobevegelser tre måneder fra dødsdato</Heading>
      <Paragraph data-size="sm" variant="long">
        For eldre bevegelser har banken taushetsplikt. Trenger du eldre bevegelser, må du kontakte banken og forklare
        hvorfor. Banken vurderer da om du kan få innsyn.
      </Paragraph>

      {/* Nedtrekksliste etter ønske fra arbeidsgruppen, som i den opprinnelige løsningen,
          selv om det bare er fem kontoer (Designsystemet anbefaler Select fra 7 valg) */}
      <Field data-size="sm" className="tx-account">
        <Label>Velg konto ({ACCOUNTS.length})</Label>
        <Select value={account} onChange={(e) => { setAccount(e.target.value); setLimit(PAGE); }}>
          {ACCOUNTS.map((a) => (
            <Select.Option key={a.id} value={a.id}>{a.name} – {a.number}</Select.Option>
          ))}
        </Select>
      </Field>

      <div className="tx-tools">
        <Button data-size="sm" variant="tertiary" onClick={downloadCsv}>
          <DownloadIcon aria-hidden />
          Last ned alle kontoer (CSV)
        </Button>
        {/* Én filterknapp som åpner en oversikt med alle filtrene. Tallet sier hvor mange som er i bruk. */}
        <Button id={`${uid}-filter-btn`} data-size="sm" variant="secondary"
          aria-expanded={open} aria-controls={`${uid}-panel`} onClick={toggle}>
          <FunnelIcon aria-hidden />
          Filter{active.length > 0 && ` (${active.length})`}
        </Button>
      </div>

      <div id={`${uid}-panel`} hidden={!open}>
        {open && (
          <Card variant="tinted" className="tx-panel">
            <Heading level={4} data-size="2xs">Filtrer kontobevegelser</Heading>
            <Fieldset data-size="sm">
              <Fieldset.Legend>Dato</Fieldset.Legend>
              <div className="tx-pair">
                <Textfield data-size="sm" type="date" label="Fra og med" value={draft.from}
                  min={isoDate(FIRST)} max={isoDate(DEATH)} onChange={set("from")} />
                <Textfield data-size="sm" type="date" label="Til og med" value={draft.to} error={errors.to}
                  min={isoDate(FIRST)} max={isoDate(DEATH)} onChange={set("to")} />
              </div>
            </Fieldset>
            <Fieldset data-size="sm">
              <Fieldset.Legend>Beløp</Fieldset.Legend>
              <Fieldset.Description>Gjelder både inn og ut.</Fieldset.Description>
              <div className="tx-pair">
                <Textfield data-size="sm" label="Minst" suffix="kr" inputMode="decimal" value={draft.min}
                  error={errors.min} onChange={set("min")} />
                <Textfield data-size="sm" label="Høyst" suffix="kr" inputMode="decimal" value={draft.max}
                  error={errors.max} onChange={set("max")} />
              </div>
            </Fieldset>
            <Fieldset data-size="sm">
              <Fieldset.Legend>Inn eller ut</Fieldset.Legend>
              <div className="chips">
                {DIRECTIONS.map(([value, label]) => (
                  <Chip.Radio key={value} data-size="sm" name={`${uid}-dir`} value={value}
                    checked={draft.direction === value} onChange={set("direction")}>
                    {label}
                  </Chip.Radio>
                ))}
              </div>
            </Fieldset>
            {/* Knappen sier hvor mange treff brukeren får, før filtrene brukes */}
            <div className="tx-panel__actions">
              <Button data-size="sm" onClick={apply}>Vis {draftCount} treff</Button>
              <Button data-size="sm" variant="tertiary" onClick={close}>Avbryt</Button>
            </div>
          </Card>
        )}
      </div>

      {active.length > 0 && (
        <div className="active-filters">
          <Paragraph data-size="sm" className="subtle" id={`${uid}-active`}>Valgte filtre:</Paragraph>
          <ul aria-labelledby={`${uid}-active`}>
            {active.map((f) => (
              <li key={f.key}>
                <Chip.Removable data-size="sm" aria-label={`Fjern filter ${f.label}`} onClick={f.clear}>{f.label}</Chip.Removable>
              </li>
            ))}
            <li><Chip.Button data-size="sm" onClick={clearAll}>Tøm alle filtre</Chip.Button></li>
          </ul>
        </div>
      )}

      <Paragraph role="status" data-size="sm"><strong>
        {shown.length === 0
          ? "Ingen kontobevegelser passer filtrene"
          : active.length
            ? `Viser ${shown.length} av ${all.length} kontobevegelser`
            : `${all.length} kontobevegelser`}
      </strong></Paragraph>

      {visible.length > 0 && (large ? (
        <Table data-size="sm" zebra className="tx-table">
          <caption className="ds-sr-only">Kontobevegelser på {acc.name}, nyeste først</caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope="col">Dato</Table.HeaderCell>
              <Table.HeaderCell scope="col">Type</Table.HeaderCell>
              <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell scope="col" className="num">Beløp (kr)</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {visible.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>{fmtDate(r.date)}</Table.Cell>
                <Table.Cell>{r.type}</Table.Cell>
                <Table.Cell>{r.text}</Table.Cell>
                <Table.Cell className="num">{fmtAmount(r.amount)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <List.Unordered className="stacked" aria-label={`Kontobevegelser på ${acc.name}, nyeste først`}>
          {visible.map((r) => (
            <li key={r.id}>
              <div className="row">
                <strong className="row__title">{r.text}</strong>
                <span className="num">{fmtAmount(r.amount)} kr</span>
              </div>
              <span className="meta">{fmtDate(r.date)} · {r.type}</span>
            </li>
          ))}
        </List.Unordered>
      ))}

      {shown.length > limit && (
        <Button data-size="sm" variant="secondary" onClick={() => setLimit((l) => l + PAGE)}>
          Vis {Math.min(PAGE, shown.length - limit)} til ({shown.length - limit} igjen)
        </Button>
      )}
    </div>
  );
}

export default function Filter() {
  return (
    <main className="art">
      <HifiNav current="Filtrering" />
      <header>
        <Paragraph data-size="sm" className="eyebrow">
          Mønster: Strukturert informasjon · <Tag data-size="sm" data-color="warning">Utkast</Tag>
        </Paragraph>
        <Heading level={1} data-size="lg">Filtrering</Heading>
        <Paragraph>
          Kontobevegelser i et dødsbo. Det er mange bevegelser, og brukeren leter etter noe bestemt: en dato, et beløp
          eller penger inn eller ut. Én filterknapp åpner en oversikt med alle filtrene. Knappen «Vis … treff» sier
          hvor mange treff det blir før filtrene brukes. Valgte filtre blir brikker over listen som kan fjernes ett og
          ett, og antall treff leses opp av skjermleser.
        </Paragraph>
      </header>
      <section>
        <Example
          id="tx"
          smallLabel="Kontobevegelser med filter, liten skjerm"
          large={<Transactions large />}
          caption="På stor skjerm er bevegelsene en tabell, på liten skjerm en liste der beskrivelse og beløp står først. Kontoen velges med en nedtrekksliste. Beløp inn har pluss og ut har minus. Det vises 25 om gangen."
          render={() => <Transactions />}
        />
      </section>
    </main>
  );
}
