import { useId, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Fieldset,
  Heading,
  List,
  Paragraph,
  Popover,
  Table,
  Tag,
  Textfield,
} from "@digdir/designsystemet-react";
import { DownloadIcon, FunnelFillIcon, FunnelIcon } from "@navikt/aksel-icons";
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
/** Inn får pluss, ut får minus. Fargen er bare i tillegg til tegnet. */
const Amount = ({ value }) => (
  <span className={value > 0 ? "amount amount--in" : "amount"}>
    {value > 0 ? "+" : "−"}{kr.format(Math.abs(value))}
  </span>
);
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

/** Knapp som åpner ett filter i en Popover. Teksten sier om filteret er i bruk, ikke bare ikonet. */
function FilterButton({ label, on, children }) {
  return (
    <Popover.TriggerContext>
      <Popover.Trigger data-size="sm" variant={on ? "primary" : "secondary"}>
        {label}
        {on ? <FunnelFillIcon aria-hidden /> : <FunnelIcon aria-hidden />}
        {on && <span className="ds-sr-only">, i bruk</span>}
      </Popover.Trigger>
      <Popover placement="bottom-end" className="tx-popover">{children}</Popover>
    </Popover.TriggerContext>
  );
}

/**
 * Kontobevegelser med filter.
 * Konto velges med Chip, fordi det er fem kontoer (Select brukes først fra 7 valg).
 * Hvert filter har sin egen knapp som åpner en Popover, som i den opprinnelige løsningen.
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

  const acc = ACCOUNTS.find((a) => a.id === account);
  const all = ROWS[account];
  const lo = parseKr(min);
  const hi = parseKr(max);
  const shown = useMemo(() => all.filter((r) => {
    const day = isoDate(r.date);
    if (from && day < from) return false;
    if (to && day > to) return false;
    if (lo !== null && Math.abs(r.amount) < lo) return false;
    if (hi !== null && Math.abs(r.amount) > hi) return false;
    if (direction === "inn" && r.amount < 0) return false;
    if (direction === "ut" && r.amount > 0) return false;
    return true;
  }), [all, from, to, lo, hi, direction]);
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

      {/* Fem kontoer: Select brukes først fra 7 valg, så kontoene er filterbrikker med ett valg */}
      <Fieldset data-size="sm">
        <Fieldset.Legend>Velg konto ({ACCOUNTS.length})</Fieldset.Legend>
        <div className="chips">
          {ACCOUNTS.map((a) => (
            <Chip.Radio key={a.id} data-size="sm" name={`${uid}-account`} value={a.id} checked={account === a.id}
              onChange={() => { setAccount(a.id); setLimit(PAGE); }}>
              {a.name}
            </Chip.Radio>
          ))}
        </div>
      </Fieldset>
      <Paragraph data-size="sm" className="meta">Kontonummer {acc.number}</Paragraph>

      <div className="tx-tools">
        <Button data-size="sm" variant="tertiary" onClick={downloadCsv}>
          <DownloadIcon aria-hidden />
          Last ned alle kontoer (CSV)
        </Button>
        {/* Hvert filter har sin egen knapp som åpner en Popover. Fylt trakt betyr at filteret er i bruk. */}
        <div className="tx-filters">
          <FilterButton label="Dato" on={Boolean(from || to)}>
            <Fieldset data-size="sm">
              <Fieldset.Legend>Dato</Fieldset.Legend>
              <div className="tx-pair">
                <Textfield data-size="sm" type="date" label="Fra og med" value={from}
                  min={isoDate(FIRST)} max={isoDate(DEATH)} onChange={(e) => setFrom(e.target.value)} />
                <Textfield data-size="sm" type="date" label="Til og med" value={to}
                  min={isoDate(FIRST)} max={isoDate(DEATH)} onChange={(e) => setTo(e.target.value)} />
              </div>
            </Fieldset>
          </FilterButton>
          <FilterButton label="Beløp" on={lo !== null || hi !== null}>
            <Fieldset data-size="sm">
              <Fieldset.Legend>Beløp</Fieldset.Legend>
              <Fieldset.Description>Gjelder både inn og ut.</Fieldset.Description>
              <div className="tx-pair">
                <Textfield data-size="sm" label="Minst" suffix="kr" inputMode="decimal" value={min}
                  onChange={(e) => setMin(e.target.value)} />
                <Textfield data-size="sm" label="Høyst" suffix="kr" inputMode="decimal" value={max}
                  onChange={(e) => setMax(e.target.value)} />
              </div>
            </Fieldset>
          </FilterButton>
          <FilterButton label="Inn/ut" on={direction !== "alle"}>
            <Fieldset data-size="sm">
              <Fieldset.Legend>Inn eller ut</Fieldset.Legend>
              <div className="chips">
                {DIRECTIONS.map(([value, label]) => (
                  <Chip.Radio key={value} data-size="sm" name={`${uid}-dir`} value={value}
                    checked={direction === value} onChange={() => setDirection(value)}>
                    {label}
                  </Chip.Radio>
                ))}
              </div>
            </Fieldset>
          </FilterButton>
        </div>
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
                <Table.Cell className="num-date">{fmtDate(r.date)}</Table.Cell>
                <Table.Cell>{r.type}</Table.Cell>
                <Table.Cell>{r.text}</Table.Cell>
                <Table.Cell className="num"><Amount value={r.amount} /></Table.Cell>
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
                <span className="num"><Amount value={r.amount} /> kr</span>
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
          eller penger inn eller ut. Hvert filter har sin egen knapp, valgte filtre vises over listen og kan
          fjernes ett og ett, og antall treff leses opp av skjermleser.
        </Paragraph>
      </header>
      <section>
        <Example
          id="tx"
          smallLabel="Kontobevegelser med filter, liten skjerm"
          large={<Transactions large />}
          caption="På stor skjerm er bevegelsene en tabell, på liten skjerm en liste der beskrivelse og beløp står først. Kontoen velges med filterbrikker, fordi det er fem kontoer. Beløp inn har pluss og ut har minus, og fargen kommer i tillegg. Det vises 25 om gangen."
          render={() => <Transactions />}
        />
      </section>
    </main>
  );
}
