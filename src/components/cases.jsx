import { Heading, Link, Paragraph, Table, Tag } from "@digdir/designsystemet-react";
import { BrowserFrame, PhoneFrame } from "./DeviceFrame.jsx";

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
    <Table data-size="sm" zebra aria-labelledby={labelledBy} className="case-table">
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
            <Table.HeaderCell scope="row"><Link href={`#${c.id}`}>{c.title}</Link></Table.HeaderCell>
            <Table.Cell className="num">{c.caseNumber}</Table.Cell>
            <Table.Cell><StatusTag status={c.status} /></Table.Cell>
            <Table.Cell className="num">{c.received}</Table.Cell>
            <Table.Cell className="num">{c.updated}</Table.Cell>
            <Table.Cell>{c.handler}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}


/** Stor og liten skjerm side om side, med bildetekst. `render(id)` lager innholdet for liste-visningene. */
export function Example({ id, smallLabel, caption, large, render }) {
  return (
    <div className="examples">
      <figure className="wide">
        <figcaption>Stor skjerm</figcaption>
        <BrowserFrame height={720} label="Tabell, stor skjerm">
          {large ?? (
            <div className="frame__content hifi">
              <Intro id={`${id}-large`} total={CASES.length} />
              <CaseTable items={[...CASES].sort(byNewest)} labelledBy={`${id}-large`} />
            </div>
          )}
        </BrowserFrame>
      </figure>
      <figure>
        <figcaption>Liten skjerm</figcaption>
        <PhoneFrame width={390} height={720} label={smallLabel}>
          {render(`${id}-small`)}
        </PhoneFrame>
      </figure>
      <Paragraph data-size="sm">{caption}</Paragraph>
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

