import {
  Button,
  Card,
  Chip,
  Details,
  Dropdown,
  ErrorSummary,
  Field,
  Fieldset,
  Heading,
  Label,
  Link,
  List,
  Paragraph,
  Popover,
  Search,
  Select,
  Table,
  Tag,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import {
  ChatIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
  PaperclipIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

/*
 * Alt utseende kommer fra Designsystemet: komponentene, tokens og CSS-klassene
 * deres. Inline-stilene under er bare layout (flex, grid og avstand med
 * --ds-size-tokens), som Designsystemet ikke har komponenter for.
 */

/** Stabel med jevn avstand, med avstand fra Designsystemet */
const stack = (gap = 'var(--ds-size-2)'): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
});

/**
 * Tabell uten skillelinjer og bakgrunn, med Table sine egne tokens. Brukes
 * inne i kort, så det ikke blir rammer i rammer i rammer (Law of Common Region).
 */
const plainTable = {
  '--dsc-table-background': 'transparent',
  '--dsc-table-divider-border-width': 0,
  '--dsc-table-border-width': 0,
} as CSSProperties;

/**
 * Etikett og verdi som tabell med to kolonner. Designsystemet har ingen
 * komponent for beskrivelseslister, men en tabell med radoverskrifter gir den
 * samme koblingen mellom etikett og verdi for skjermlesere.
 */
const KeyValueTable = ({
  label,
  rows,
  plain,
}: {
  label: string;
  rows: [string, ReactNode][];
  /** Uten skillelinjer, for bruk inne i et kort som allerede rammer inn */
  plain?: boolean;
}) => (
  <Table data-size='sm' style={plain ? plainTable : undefined}>
    {/* Tabeller skal alltid ha caption. Her står navnet allerede synlig over. */}
    <caption className='ds-sr-only'>{label}</caption>
    <Table.Body>
      {rows.map(([key, value]) => (
        <Table.Row key={key}>
          <Table.HeaderCell scope='row'>{key}</Table.HeaderCell>
          <Table.Cell>{value}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

/**
 * Liste uten punkter og innrykk: klassen fra Designsystemet fjerner punktene,
 * og komponent-tokenet til List fjerner innrykket.
 */
const plainList = {
  className: 'ds-list--unstyled',
  style: { '--dsc-list-padding-inline': 0 } as CSSProperties,
};

/** Område som ruller når tabellen er bredere enn plassen (WCAG 1.4.10) */
const ScrollRegion = ({
  labelledBy,
  maxHeight,
  children,
}: {
  labelledBy: string;
  /** stickyHeader festes til nærmeste rulleområde, så det må ha en høyde */
  maxHeight?: string;
  children: ReactNode;
}) => (
  // Fokuserbart, så tabellen kan rulles med tastaturet
  <div
    role='region'
    aria-labelledby={labelledBy}
    tabIndex={0}
    style={{ overflow: 'auto', maxHeight }}
  >
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Scenario 2: Sammenligne verdier på tvers av mange datapunkter              */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Data: SSB, Tabell 1 «Innenlandsk person- og godstransportarbeid,          */
/* etter transportmåte». Rad: [nivå, etikett, 2024, 2025, erSum]              */
/* -------------------------------------------------------------------------- */

type Row = [number, string, number, number, boolean?];

const TITLE = 'Innenlandsk person- og godstransportarbeid, etter transportmåte';
const COLUMNS = ['2024', '2025', 'Endring 2024–2025, prosent'];

const GROUPS: { label: string; rows: Row[] }[] = [
  {
    label: 'Persontransport uten kabotasje. Mill. personkm¹',
    rows: [
      [0, 'I alt', 75968, 77681, true],
      [0, 'Skinnegående transport', 4720, 4749],
      [0, 'Lufttransport', 5388, 5548],
      [0, 'Veitransport', 64843, 66325],
      [0, 'Sjøtransport', 1018, 1061],
    ],
  },
  {
    label: 'Godstransport uten kabotasje. Mill. tonnkm²',
    rows: [
      [0, 'I alt', 59127, 58523, true],
      [0, 'Fastlandstransport i alt', 26586, 26162],
      [1, 'Jernbanetransport', 1832, 1892],
      [1, 'Lufttransport', 8, 8],
      [1, 'Veitransport', 22824, 22500],
      [1, 'Sjøtransport', 1922, 1763],
      [2, 'Bilferjeruter', 204, 218],
      [2, 'Annen sjøtransport', 1718, 1545],
      [0, 'Transport norsk kontinentalsokkel - fastland i alt', 32541, 32360],
    ],
  },
  {
    label: 'Godstransport medregnet kabotasje. Mill. tonnkm³',
    rows: [
      [0, 'I alt', 75176, 74964, true],
      [0, 'Fastlandstransport i alt', 41393, 40957],
      [1, 'Jernbanetransport', 1876, 1902],
      [1, 'Lufttransport', 8, 8],
      [1, 'Veitransport', 23351, 23213],
      [1, 'Sjøtransport', 16159, 15835],
      [2, 'Bilferjeruter', 204, 218],
      [2, 'Annen sjøtransport', 15955, 15616],
      [3, 'Norsk Ordinært Skipsregister (NOR)', 1718, 1545],
      [3, 'Norsk Internasjonalt Skipsregister (NIS)', 513, 766],
      [3, 'Utenlandske skipsregistre', 13725, 13305],
      [0, 'Transport norsk kontinentalsokkel - fastland i alt', 33783, 34007],
    ],
  },
];

const NOTES = [
  'Bare medregnet norske transportmidler som har både på- og avstigning i Norge.',
  'Omfatter gods på norske transportmidler som er lastet og losset i Norge.',
  'Kabotasje omfatter gods på utenlandske transportmidler der godset er både lastet og losset i Norge.',
];

const formatNumber = (n: number) => n.toLocaleString('nb-NO');
const formatChange = (a: number, b: number) => {
  const v = ((b - a) / a) * 100;
  return (v < 0 ? '−' : '') + Math.abs(v).toFixed(1).replace('.', ',');
};
/** Tall høyrejusteres, slik retningslinjene for Table sier */
const numeric: CSSProperties = { textAlign: 'right' };

const TransportTable = ({ stickyHeader }: { stickyHeader?: boolean }) => {
  const titleId = useId();
  return (
    <div style={stack()}>
      {/* Synlig tittel utenfor rulleområdet, så den ikke ruller bort sideveis */}
      <Heading id={titleId} level={3} data-size='2xs'>
        Tabell 1. {TITLE}
      </Heading>

      {/* cqh er høyden til rammen rundt prototypen, ellers skjermhøyden */}
      <ScrollRegion
        labelledBy={titleId}
        maxHeight={stickyHeader ? '70cqh' : undefined}
      >
        <Table data-size='sm' stickyHeader={stickyHeader}>
          {/* Tabeller skal alltid ha caption. Tittelen står synlig over. */}
          <caption className='ds-sr-only'>Tabell 1. {TITLE}</caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>Transportmåte</Table.HeaderCell>
              {COLUMNS.map((c) => (
                <Table.HeaderCell key={c} scope='col' style={numeric}>
                  {c}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Head>

          {GROUPS.map((g) => (
            <Table.Body key={g.label}>
              <Table.Row>
                {/* Celler slås ikke sammen. Tomme celler er Table.Cell. */}
                <Table.HeaderCell scope='rowgroup'>{g.label}</Table.HeaderCell>
                {COLUMNS.map((c) => (
                  <Table.Cell key={c} />
                ))}
              </Table.Row>
              {g.rows.map(([, label, a, b, total]) => {
                // Summeringsradene er uthevet med <strong>, ikke egen stil
                const Text = total ? 'strong' : 'span';
                return (
                  <Table.Row key={label + a}>
                    <Table.HeaderCell scope='row'>
                      <Text>{label}</Text>
                    </Table.HeaderCell>
                    <Table.Cell style={numeric}>
                      <Text>{formatNumber(a)}</Text>
                    </Table.Cell>
                    <Table.Cell style={numeric}>
                      <Text>{formatNumber(b)}</Text>
                    </Table.Cell>
                    <Table.Cell style={numeric}>
                      {formatChange(a, b)}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          ))}
        </Table>
      </ScrollRegion>

      <List.Ordered data-size='sm'>
        {NOTES.map((n) => (
          <List.Item key={n}>{n}</List.Item>
        ))}
      </List.Ordered>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Eksempler                                                                  */
/* -------------------------------------------------------------------------- */

/** 2a: Tabellen beholdes og ruller sideveis når den ikke får plass. */
export const TableHorizontalScroll = () => <TransportTable />;

/** 2b: stickyHeader holder kolonneoverskriftene synlige når tabellen rulles. */
export const TableStickyHeader = () => <TransportTable stickyHeader />;

/* -------------------------------------------------------------------------- */
/* Scenario 1: Finne en bestemt rad eller enhet i en større oversikt         */
/* -------------------------------------------------------------------------- */

type Status = 'Venter på deg' | 'Under behandling' | 'Mottatt' | 'Avsluttet';

type Case = {
  id: string;
  title: string;
  caseNumber: string;
  status: Status;
  received: string;
  updated: string;
  handler: string;
};

const CASES: Case[] = [
  {
    id: 'sak-1432',
    title: 'Søknad om byggetillatelse',
    caseNumber: '2026/1432',
    status: 'Venter på deg',
    received: '12.10.2026',
    updated: '28.10.2026',
    handler: 'Byggesaksavdelingen',
  },
  {
    id: 'sak-1398',
    title: 'Søknad om ferdigattest',
    caseNumber: '2026/1398',
    status: 'Under behandling',
    received: '03.10.2026',
    updated: '21.10.2026',
    handler: 'Byggesaksavdelingen',
  },
  {
    id: 'sak-1201',
    title: 'Klage på eiendomsskatt',
    caseNumber: '2026/1201',
    status: 'Under behandling',
    received: '18.09.2026',
    updated: '30.09.2026',
    handler: 'Skatteoppkreveren',
  },
  {
    id: 'sak-1187',
    title: 'Søknad om parkeringstillatelse',
    caseNumber: '2026/1187',
    status: 'Mottatt',
    received: '16.09.2026',
    updated: '16.09.2026',
    handler: 'Bymiljøetaten',
  },
  {
    id: 'sak-0954',
    title: 'Melding om flytting',
    caseNumber: '2026/0954',
    status: 'Avsluttet',
    received: '02.08.2026',
    updated: '14.08.2026',
    handler: 'Folkeregisteret',
  },
  {
    id: 'sak-1455',
    title: 'Søknad om tilskudd til lag og foreninger',
    caseNumber: '2026/1455',
    status: 'Mottatt',
    received: '27.10.2026',
    updated: '27.10.2026',
    handler: 'Kulturetaten',
  },
  {
    id: 'sak-1310',
    title: 'Søknad om utvidet skjenkebevilling',
    caseNumber: '2026/1310',
    status: 'Venter på deg',
    received: '25.09.2026',
    updated: '22.10.2026',
    handler: 'Næringsetaten',
  },
  {
    id: 'sak-0871',
    title: 'Klage på vedtak om byggetillatelse',
    caseNumber: '2026/0871',
    status: 'Avsluttet',
    received: '11.07.2026',
    updated: '29.09.2026',
    handler: 'Byggesaksavdelingen',
  },
];

/**
 * Bare statusen som krever noe av brukeren, får farge. Får alle statusene
 * hver sin farge, skiller ingen seg ut (Von Restorff-effekten). Teksten i
 * merkelappen sier uansett hva statusen er, så fargen er ikke eneste kjennetegn.
 */
const STATUS_COLOR: Record<Status, string> = {
  'Venter på deg': 'warning',
  'Under behandling': 'neutral',
  Mottatt: 'neutral',
  Avsluttet: 'neutral',
};

const META: { key: keyof Case; label: string }[] = [
  { key: 'caseNumber', label: 'Saksnummer' },
  { key: 'received', label: 'Mottatt' },
  { key: 'handler', label: 'Behandler' },
];

const StatusTag = ({ status }: { status: Status }) => (
  <Tag data-size='sm' data-color={STATUS_COLOR[status]}>
    {status}
  </Tag>
);

/** Saksnummer, dato og behandler som etikett og verdi */
const MetaTable = ({ item }: { item: Case }) => (
  <KeyValueTable
    label={`Detaljer om ${item.title}`}
    rows={META.map(({ key, label }) => [label, item[key]])}
  />
);

/** 1a: Liste med objektnavn og litt metadata. Rask å skanne, fungerer på alle skjermbredder. */
export const CasesList = () => {
  const id = useId();
  return (
    <section aria-labelledby={id} style={stack()}>
      <Heading id={id} level={3} data-size='2xs'>
        Mine saker
      </Heading>
      <List.Unordered {...plainList}>
        {CASES.map((c) => (
          <List.Item key={c.id}>
            <Link href={`#${c.id}`}>{c.title}</Link>
            <Paragraph data-size='sm'>
              {c.status} · Mottatt {c.received}
            </Paragraph>
          </List.Item>
        ))}
      </List.Unordered>
    </section>
  );
};

/** 1b: Liste der hver sak har etikett og verdi i en tabell med to kolonner. */
export const CasesKeyValueList = () => {
  const id = useId();
  return (
    <section aria-labelledby={id} style={stack()}>
      <Heading id={id} level={3} data-size='2xs'>
        Mine saker
      </Heading>
      <List.Unordered {...plainList}>
        {CASES.map((c) => (
          <List.Item key={c.id} style={stack()}>
            <Heading level={4} data-size='2xs'>
              <Link href={`#${c.id}`}>{c.title}</Link>
            </Heading>
            <div>
              <StatusTag status={c.status} />
            </div>
            <MetaTable item={c} />
          </List.Item>
        ))}
      </List.Unordered>
    </section>
  );
};

/** 1c: Kort (rik liste). Hele kortet er klikkbart via lenken i overskriften. */
export const CasesCards = () => {
  const id = useId();
  return (
    <section aria-labelledby={id} style={stack()}>
      <Heading id={id} level={3} data-size='2xs'>
        Mine saker
      </Heading>
      <List.Unordered
        className={plainList.className}
        style={{
          ...plainList.style,
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(min(100%, 18rem), 1fr))',
          gap: 'var(--ds-size-3)',
        }}
      >
        {CASES.map((c) => (
          <List.Item key={c.id}>
            <Card data-clickdelegatefor={`${c.id}-link`}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 'var(--ds-size-2)',
                }}
              >
                <Heading level={4} data-size='2xs'>
                  <Link id={`${c.id}-link`} href={`#${c.id}`}>
                    {c.title}
                  </Link>
                </Heading>
                <ChevronRightIcon aria-hidden />
              </div>
              <div>
                <StatusTag status={c.status} />
              </div>
              <MetaTable item={c} />
            </Card>
          </List.Item>
        ))}
      </List.Unordered>
    </section>
  );
};

/** 1d: Navn og status er synlige, sjeldnere brukte opplysninger ligger i Details. */
export const CasesExpandable = () => {
  const id = useId();
  return (
    <section aria-labelledby={id} style={stack()}>
      <Heading id={id} level={3} data-size='2xs'>
        Mine saker
      </Heading>
      <List.Unordered {...plainList}>
        {CASES.map((c) => (
          <List.Item key={c.id} style={stack()}>
            <Heading level={4} data-size='2xs'>
              <Link href={`#${c.id}`}>{c.title}</Link>
            </Heading>
            <div>
              <StatusTag status={c.status} />
            </div>
            <Details data-size='sm'>
              <Details.Summary>Flere detaljer</Details.Summary>
              <Details.Content>
                <MetaTable item={c} />
              </Details.Content>
            </Details>
          </List.Item>
        ))}
      </List.Unordered>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 1f: Innboks                                                                */
/* -------------------------------------------------------------------------- */

type Message = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  received: string;
  unread?: boolean;
  attachments?: number;
};

const MESSAGES: Message[] = [
  {
    id: 'melding-1',
    sender: 'Byggesaksavdelingen',
    subject: 'Vi trenger mer informasjon om søknaden din',
    preview:
      'Søknad om byggetillatelse, sak 2026/1432. Send inn tegninger av fasaden innen 15. november.',
    received: 'I dag kl. 09.14',
    unread: true,
    attachments: 1,
  },
  {
    id: 'melding-2',
    sender: 'Kulturetaten',
    subject: 'Vi har mottatt søknaden din',
    preview:
      'Søknad om tilskudd til lag og foreninger, sak 2026/1455. Du får svar innen fire uker.',
    received: 'I går kl. 14.02',
    unread: true,
  },
  {
    id: 'melding-3',
    sender: 'Næringsetaten',
    subject: 'Påminnelse: Svar på spørsmål om skjenkebevillingen',
    preview:
      'Vi har ikke fått svar på brevet vårt fra 25. september. Fristen er 5. november.',
    received: '22.10.2026',
  },
  {
    id: 'melding-4',
    sender: 'Byggesaksavdelingen',
    subject: 'Saken din er under behandling',
    preview:
      'Søknad om ferdigattest, sak 2026/1398. Forventet saksbehandlingstid er tre uker.',
    received: '21.10.2026',
  },
  {
    id: 'melding-5',
    sender: 'Skatteoppkreveren',
    subject: 'Vedtak i klagesaken om eiendomsskatt',
    preview:
      'Klagen din er behandlet. Les vedtaket i vedlegget for å se resultatet og hvordan du kan klage.',
    received: '30.09.2026',
    attachments: 2,
  },
  {
    id: 'melding-6',
    sender: 'Folkeregisteret',
    subject: 'Flyttingen din er registrert',
    preview: 'Den nye adressen din gjelder fra 1. august 2026.',
    received: '14.08.2026',
  },
  {
    id: 'melding-7',
    sender: 'Bymiljøetaten',
    subject: 'Parkeringstillatelsen din er klar',
    preview:
      'Søknad om parkeringstillatelse, sak 2026/1187. Tillatelsen gjelder fra 1. oktober.',
    received: '18.09.2026',
    attachments: 1,
  },
  {
    id: 'melding-8',
    sender: 'Utdanningsetaten',
    subject: 'Barnet ditt har fått plass i SFO',
    preview:
      'Plassen gjelder fra skolestart. Svar innen 1. juli om dere tar imot plassen.',
    received: '12.06.2026',
  },
];

const SENDERS = [...new Set(MESSAGES.map((m) => m.sender))].sort((a, b) =>
  a.localeCompare(b, 'nb'),
);

/**
 * Innboks: én melding per listeelement. Avsender og emne kommer først, så
 * dato og en kort forhåndsvisning. Uleste meldinger er merket med tekst,
 * ikke bare med utheving, så det også kommer fram for skjermlesere.
 * Søk, filterbrikker og avsendervalg gjør det lett å finne én melding.
 */
export const Inbox = () => {
  const id = useId();
  const [query, setQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [onlyAttachments, setOnlyAttachments] = useState(false);
  const [sender, setSender] = useState('');

  const q = query.trim().toLocaleLowerCase('nb');
  const shown = MESSAGES.filter(
    (m) =>
      (!onlyUnread || m.unread) &&
      (!onlyAttachments || m.attachments) &&
      (!sender || m.sender === sender) &&
      (!q ||
        [m.sender, m.subject, m.preview].some((v) =>
          v.toLocaleLowerCase('nb').includes(q),
        )),
  );
  const unread = MESSAGES.filter((m) => m.unread).length;
  const filtered = Boolean(q || onlyUnread || onlyAttachments || sender);

  const reset = () => {
    setQuery('');
    setOnlyUnread(false);
    setOnlyAttachments(false);
    setSender('');
  };

  return (
    <section aria-labelledby={id} style={stack('var(--ds-size-3)')}>
      <Heading id={id} level={3} data-size='2xs'>
        Meldinger
      </Heading>

      <Field>
        <Label>Søk i meldingene</Label>
        <Search>
          <Search.Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search.Clear onClick={() => setQuery('')} />
        </Search>
      </Field>

      <Fieldset>
        <Fieldset.Legend>Vis bare</Fieldset.Legend>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--ds-size-2)',
          }}
        >
          <Chip.Checkbox
            checked={onlyUnread}
            onChange={(e) => setOnlyUnread(e.target.checked)}
          >
            Uleste ({unread})
          </Chip.Checkbox>
          <Chip.Checkbox
            checked={onlyAttachments}
            onChange={(e) => setOnlyAttachments(e.target.checked)}
          >
            Med vedlegg
          </Chip.Checkbox>
        </div>
      </Fieldset>

      <Field>
        <Label>Avsender</Label>
        <Select value={sender} onChange={(e) => setSender(e.target.value)}>
          <Select.Option value=''>Alle avsendere</Select.Option>
          {SENDERS.map((name) => (
            <Select.Option key={name} value={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Field>

      {/* Skjermlesere får vite at innholdet er endret når søk eller filter endres */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--ds-size-2)',
        }}
      >
        <Paragraph role='status' data-size='sm'>
          {shown.length === 0
            ? 'Ingen meldinger passer søket'
            : filtered
              ? `Viser ${shown.length} av ${MESSAGES.length} meldinger`
              : `${unread} uleste av ${MESSAGES.length} meldinger`}
        </Paragraph>
        {filtered && <Chip.Button onClick={reset}>Tøm alle filtre</Chip.Button>}
      </div>

      <List.Unordered {...plainList}>
        {shown.map((m) => (
          <List.Item key={m.id}>
            <Card data-clickdelegatefor={`${m.id}-link`}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 'var(--ds-size-2)',
                }}
              >
                <Paragraph data-size='sm'>{m.sender}</Paragraph>
                <Paragraph data-size='sm'>{m.received}</Paragraph>
              </div>
              <Heading level={4} data-size='2xs'>
                <Link id={`${m.id}-link`} href={`#${m.id}`}>
                  {m.unread ? <strong>{m.subject}</strong> : m.subject}
                </Link>
              </Heading>
              <Paragraph data-size='sm'>{m.preview}</Paragraph>
              {(m.unread || m.attachments) && (
                // Flere tagger sammen ligger i en liste med navn, slik retningslinjene for Tag sier
                <List.Unordered
                  aria-label='Om meldingen'
                  className={plainList.className}
                  style={{ ...plainList.style, ...chipRow }}
                >
                  {m.unread && (
                    <List.Item>
                      <Tag data-size='sm' data-color='info'>
                        Ulest
                      </Tag>
                    </List.Item>
                  )}
                  {m.attachments && (
                    <List.Item>
                      <Tag data-size='sm' data-color='neutral'>
                        <PaperclipIcon aria-hidden />
                        {m.attachments} vedlegg
                      </Tag>
                    </List.Item>
                  )}
                </List.Unordered>
              )}
            </Card>
          </List.Item>
        ))}
      </List.Unordered>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 1e: Tabell på full bredde, kort med søk og sortering når den ikke får plass */
/* -------------------------------------------------------------------------- */

/** Filterbrikker brytes over flere linjer når det trengs */
const chipRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--ds-size-2)',
};

/** «dd.mm.åååå» som tall som kan sorteres */
const sortableDate = (d: string) => d.split('.').reverse().join('');

type SortOrder = 'nyest' | 'eldst' | 'oppdatert' | 'navn';

const SORT_ORDERS: { value: SortOrder; label: string }[] = [
  { value: 'nyest', label: 'Nyeste først' },
  { value: 'eldst', label: 'Eldste først' },
  { value: 'oppdatert', label: 'Sist oppdatert' },
  { value: 'navn', label: 'Navn A–Å' },
];

const compareCases: Record<SortOrder, (a: Case, b: Case) => number> = {
  nyest: (a, b) =>
    sortableDate(b.received).localeCompare(sortableDate(a.received)),
  eldst: (a, b) =>
    sortableDate(a.received).localeCompare(sortableDate(b.received)),
  oppdatert: (a, b) =>
    sortableDate(b.updated).localeCompare(sortableDate(a.updated)),
  navn: (a, b) => a.title.localeCompare(b.title, 'nb'),
};

/** Alle kolonnene fra tabellen, som etikett og verdi i kortet */
const CARD_FIELDS: { key: keyof Case; label: string }[] = [
  { key: 'title', label: 'Sak' },
  { key: 'status', label: 'Status' },
  { key: 'received', label: 'Mottatt' },
  { key: 'updated', label: 'Sist oppdatert' },
  { key: 'handler', label: 'Behandler' },
];

/**
 * Handlingene for en sak ligger i en meny. Retningslinjene for Table sier at
 * hver celle bør ha bare ett interaktivt element, og at en meny kan spare
 * plass når en rad har flere handlinger. Å åpne saken gjør lenken i navnet.
 */
const CaseActions = ({ item }: { item: Case }) => (
  <Dropdown.TriggerContext>
    {/* Det tilgjengelige navnet starter med den synlige teksten (WCAG 2.5.3) */}
    <Dropdown.Trigger
      variant='tertiary'
      data-size='sm'
      aria-label={`Handlinger for sak ${item.caseNumber}`}
    >
      Handlinger
      <ChevronDownIcon aria-hidden />
    </Dropdown.Trigger>
    <Dropdown placement='bottom-end' data-size='sm'>
      <Dropdown.List>
        <Dropdown.Item>
          <Dropdown.Button>
            <DownloadIcon aria-hidden />
            Last ned kvittering
          </Dropdown.Button>
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.Button>
            <ChatIcon aria-hidden />
            Send melding
          </Dropdown.Button>
        </Dropdown.Item>
        {/* En avsluttet sak kan ikke trekkes tilbake, så valget vises ikke */}
        {item.status !== 'Avsluttet' && (
          <Dropdown.Item>
            <Dropdown.Button>
              <XMarkOctagonIcon aria-hidden />
              Trekk tilbake saken
            </Dropdown.Button>
          </Dropdown.Item>
        )}
      </Dropdown.List>
    </Dropdown>
  </Dropdown.TriggerContext>
);

/** Bredden der tabellen får plass uten sideveis rulling */
const TABLE_MIN_WIDTH = 832;

/**
 * Om elementet er bredt nok til tabell. Måler elementet selv, ikke vinduet,
 * så prototypen følger bredden på rammen den vises i.
 */
const useFitsTable = (
  ref: RefObject<HTMLElement | null>,
  minWidth = TABLE_MIN_WIDTH,
) => {
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setFits(entry.contentRect.width >= minWidth),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, minWidth]);
  return fits;
};

/** Verdien i et felt, med status som Tag og saksnavnet som lenke */
const fieldValue = (c: Case, key: keyof Case): ReactNode =>
  key === 'status' ? (
    <StatusTag status={c.status} />
  ) : key === 'title' ? (
    <Link href={`#${c.id}`}>{c.title}</Link>
  ) : (
    c[key]
  );

/** Kolonnene tabellen kan sorteres etter, og hvilken rekkefølge et klikk gir */
const SORTABLE: Partial<
  Record<
    keyof Case,
    {
      next: (o: SortOrder) => SortOrder;
      sort: (o: SortOrder) => 'ascending' | 'descending' | 'none';
    }
  >
> = {
  title: {
    next: () => 'navn',
    sort: (o) => (o === 'navn' ? 'ascending' : 'none'),
  },
  received: {
    next: (o) => (o === 'nyest' ? 'eldst' : 'nyest'),
    sort: (o) =>
      o === 'nyest' ? 'descending' : o === 'eldst' ? 'ascending' : 'none',
  },
  updated: {
    next: () => 'oppdatert',
    sort: (o) => (o === 'oppdatert' ? 'descending' : 'none'),
  },
};

/** Sakene som tabell, for full bredde. Sorteres med kolonneoverskriftene. */
const CaseTable = ({
  items,
  order,
  onOrderChange,
}: {
  items: Case[];
  order: SortOrder;
  onOrderChange: (order: SortOrder) => void;
}) => (
  <Table data-size='sm'>
    {/* Overskriften «Mine saker» står synlig over, så caption er bare for skjermlesere */}
    <caption className='ds-sr-only'>Mine saker</caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col'>Saksnummer</Table.HeaderCell>
        {CARD_FIELDS.map(({ key, label }) => {
          const sortable = SORTABLE[key];
          return (
            <Table.HeaderCell
              key={key}
              scope='col'
              sort={sortable?.sort(order)}
              onClick={sortable && (() => onOrderChange(sortable.next(order)))}
            >
              {label}
            </Table.HeaderCell>
          );
        })}
        <Table.HeaderCell scope='col'>Handlinger</Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {items.map((c) => (
        <Table.Row key={c.id}>
          <Table.HeaderCell scope='row'>{c.caseNumber}</Table.HeaderCell>
          {CARD_FIELDS.map(({ key }) => (
            <Table.Cell key={key}>{fieldValue(c, key)}</Table.Cell>
          ))}
          <Table.Cell>
            <CaseActions item={c} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

/** Hver rad blir et kort: saksnummer og handlinger øverst, kolonnene som etikett og verdi */
const CaseCards = ({ items }: { items: Case[] }) => (
  <List.Unordered
    className={plainList.className}
    style={{
      ...plainList.style,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 20rem), 1fr))',
      gap: 'var(--ds-size-3)',
    }}
  >
    {items.map((c) => (
      <List.Item key={c.id}>
        <Card>
          <Card.Block>
            <Heading level={4} data-size='2xs'>
              Sak {c.caseNumber}
            </Heading>
          </Card.Block>
          <Card.Block>
            <KeyValueTable
              plain
              label={`Sak ${c.caseNumber}`}
              rows={CARD_FIELDS.map(({ key, label }) => [
                label,
                fieldValue(c, key),
              ])}
            />
          </Card.Block>
          {/* Knapper står til venstre, slik mønsteret for plassering av knapper sier */}
          <Card.Block>
            <CaseActions item={c} />
          </Card.Block>
        </Card>
      </List.Item>
    ))}
  </List.Unordered>
);

/**
 * Hver rad blir en rik liste: saksnavnet først som lenke, så det brukeren
 * trenger for å kjenne igjen saken. Ikke alle kolonnene er med, fordi
 * saksnummer og behandler sjelden avgjør hvilken sak brukeren leter etter.
 */
const CaseRichList = ({ items }: { items: Case[] }) => (
  <List.Unordered
    className={plainList.className}
    style={{ ...plainList.style, ...stack('var(--ds-size-3)') }}
  >
    {items.map((c) => (
      <List.Item key={c.id}>
        <Card style={stack()}>
          <Heading level={4} data-size='2xs'>
            <Link href={`#${c.id}`}>{c.title}</Link>
          </Heading>
          <Paragraph data-size='sm'>
            Sak {c.caseNumber} · {c.handler} · Mottatt {c.received}
          </Paragraph>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--ds-size-2) var(--ds-size-3)',
            }}
          >
            <StatusTag status={c.status} />
            <Paragraph data-size='sm'>Oppdatert {c.updated}</Paragraph>
          </div>
          {/* Knapper står til venstre, slik mønsteret for plassering av knapper sier */}
          <div>
            <CaseActions item={c} />
          </div>
        </Card>
      </List.Item>
    ))}
  </List.Unordered>
);

/** Rad i den stablede listen: én verdi til venstre og én til høyre */
const stackedRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 'var(--ds-size-1) var(--ds-size-3)',
};

/**
 * Stablet liste: hver rad har fire faste plasser, så brukeren kjenner igjen
 * verdiene uten etiketter. Saksnavnet øverst til venstre er viktigst,
 * sist oppdatert øverst til høyre, saksnummer og behandler nederst til
 * venstre, og status nederst til høyre. Verdiene som ikke forklarer seg selv,
 * har et ord foran («Sak», «Oppdatert»), så de er forståelige også uten
 * kolonneoverskrift. Detaljene får brukeren ved å åpne saken.
 */
const CaseStackedList = ({ items }: { items: Case[] }) => (
  <List.Unordered {...plainList}>
    {items.map((c) => (
      <List.Item
        key={c.id}
        style={{
          ...stack('var(--ds-size-1)'),
          paddingBlock: 'var(--ds-size-3)',
          borderBottom:
            'var(--ds-border-width-default) solid var(--ds-color-neutral-border-subtle)',
        }}
      >
        <div style={stackedRow}>
          <Heading level={4} data-size='2xs'>
            <Link href={`#${c.id}`}>{c.title}</Link>
          </Heading>
          <Paragraph data-size='sm'>Oppdatert {c.updated}</Paragraph>
        </div>
        <div style={stackedRow}>
          <Paragraph
            data-size='sm'
            style={{ color: 'var(--ds-color-neutral-text-subtle)' }}
          >
            Sak {c.caseNumber} · {c.handler} · Mottatt {c.received}
          </Paragraph>
          <StatusTag status={c.status} />
        </div>
      </List.Item>
    ))}
  </List.Unordered>
);

/**
 * På full bredde vises sakene som tabell. Når tabellen ikke får plass, vises
 * radene som kort eller rik liste. Søk, statusfilter og sortering virker
 * likt i begge.
 */
const ResponsiveCases = ({
  SmallView,
}: {
  SmallView: (props: { items: Case[] }) => ReactNode;
}) => {
  const id = useId();
  const ref = useRef<HTMLElement>(null);
  const fitsTable = useFitsTable(ref);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [order, setOrder] = useState<SortOrder>('nyest');

  const q = query.trim().toLocaleLowerCase('nb');
  const shown = CASES.filter(
    (c) =>
      (!status || c.status === status) &&
      (!q ||
        [c.title, c.caseNumber, c.handler].some((v) =>
          v.toLocaleLowerCase('nb').includes(q),
        )),
  ).sort(compareCases[order]);

  return (
    <section
      ref={ref}
      aria-labelledby={`${id}-heading`}
      style={stack('var(--ds-size-3)')}
    >
      <Heading id={`${id}-heading`} level={3} data-size='2xs'>
        Mine saker
      </Heading>

      <Field>
        <Label>Søk i sakene</Label>
        <Search>
          <Search.Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search.Clear onClick={() => setQuery('')} />
        </Search>
      </Field>

      {/* Få valg: filterbrikker, ikke Select, slik retningslinjene for Chip og Select sier */}
      <Fieldset>
        <Fieldset.Legend>Status</Fieldset.Legend>
        <div style={chipRow}>
          {(['', ...Object.keys(STATUS_COLOR)] as (Status | '')[]).map((s) => (
            <Chip.Radio
              key={s || 'alle'}
              name={`${id}-status`}
              value={s}
              checked={status === s}
              onChange={() => setStatus(s)}
            >
              {s || 'Alle'}
            </Chip.Radio>
          ))}
        </div>
      </Fieldset>

      {/* I tabellen sorteres det med kolonneoverskriftene. På smal skjerm er
          sorteringen én nedtrekksliste med «Nyeste først» som standard, så den
          ikke legger fire valg til over listen (Hick's Law). */}
      {!fitsTable && (
        <Field>
          <Label>Sorter etter</Label>
          <Select
            value={order}
            onChange={(e) => setOrder(e.target.value as SortOrder)}
          >
            {SORT_ORDERS.map((o) => (
              <Select.Option key={o.value} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        </Field>
      )}

      {(q || status) && (
        <div>
          <Chip.Button
            onClick={() => {
              setQuery('');
              setStatus('');
            }}
          >
            Tøm alle filtre
          </Chip.Button>
        </div>
      )}

      {/* Skjermlesere får vite at innholdet er endret når søk, filter eller sortering endres */}
      <Paragraph role='status' data-size='sm'>
        {shown.length === 0
          ? 'Ingen saker passer søket'
          : `Viser ${shown.length} av ${CASES.length} saker. Sortert: ${
              SORT_ORDERS.find((o) => o.value === order)!.label
            }`}
      </Paragraph>

      {shown.length > 0 &&
        (fitsTable ? (
          <CaseTable items={shown} order={order} onOrderChange={setOrder} />
        ) : (
          <SmallView items={shown} />
        ))}
    </section>
  );
};

/** 1e: Tabell på full bredde. Når den ikke får plass, blir hver rad et kort med alle kolonnene. */
export const CasesSearchableCards = () => <ResponsiveCases SmallView={CaseCards} />;

/** 1g: Tabell på full bredde. Når den ikke får plass, blir radene en rik liste med det viktigste først. */
export const CasesTableToRichList = () => (
  <ResponsiveCases SmallView={CaseRichList} />
);

/* -------------------------------------------------------------------------- */
/* Scenario 3: Sammenligne få alternativer med mange egenskaper               */
/* Eksempeldata, forenklet etter Statens vegvesens oversikt over førerkort.   */
/* -------------------------------------------------------------------------- */

type Licence = {
  id: string;
  name: string;
  vehicle: string;
  weight: string;
  trailer: string;
  age: string;
  requires: string;
  tests: string;
  healthCertificate: string;
};

const LICENCES: Licence[] = [
  {
    id: 'B',
    name: 'Klasse B',
    vehicle: 'Personbil',
    weight: 'Inntil 3\u00a0500 kg',
    trailer: 'Inntil 750 kg',
    age: '18 år',
    requires: 'Ingen',
    tests: 'Teori- og førerprøve',
    healthCertificate: 'Nei',
  },
  {
    id: 'B96',
    name: 'Klasse B96',
    vehicle: 'Personbil med tyngre tilhenger',
    weight: 'Inntil 3\u00a0500 kg',
    trailer: 'Inntil 4\u00a0250 kg med bilen',
    age: '18 år',
    requires: 'Klasse B',
    tests: 'Ingen, bare kurs',
    healthCertificate: 'Nei',
  },
  {
    id: 'BE',
    name: 'Klasse BE',
    vehicle: 'Personbil med stor tilhenger',
    weight: 'Inntil 3\u00a0500 kg',
    trailer: 'Inntil 3\u00a0500 kg',
    age: '18 år',
    requires: 'Klasse B',
    tests: 'Førerprøve',
    healthCertificate: 'Nei',
  },
  {
    id: 'C1',
    name: 'Klasse C1',
    vehicle: 'Lett lastebil',
    weight: 'Inntil 7\u00a0500 kg',
    trailer: 'Inntil 750 kg',
    age: '18 år',
    requires: 'Klasse B',
    tests: 'Teori- og førerprøve',
    healthCertificate: 'Ja',
  },
  {
    id: 'C',
    name: 'Klasse C',
    vehicle: 'Lastebil',
    weight: 'Over 3\u00a0500 kg',
    trailer: 'Inntil 750 kg',
    age: '21 år',
    requires: 'Klasse B',
    tests: 'Teori- og førerprøve',
    healthCertificate: 'Ja',
  },
];

/** Egenskapene blir rader når aksene byttes om. */
const PROPERTIES: { key: keyof Licence; label: string }[] = [
  { key: 'vehicle', label: 'Hva du kan kjøre' },
  { key: 'weight', label: 'Tillatt totalvekt for bilen' },
  { key: 'trailer', label: 'Tilhenger' },
  { key: 'age', label: 'Aldersgrense' },
  { key: 'requires', label: 'Må ha fra før' },
  { key: 'tests', label: 'Prøver' },
  { key: 'healthCertificate', label: 'Helseattest' },
];

type ComparisonProps = {
  /** Alternativene som står side om side */
  selected: Licence[];
  /** Gir hver kolonne en velger i stedet for et fast navn */
  onSelect?: (column: number, id: string) => void;
};

/**
 * Transponert tabell: egenskapene går nedover som rader, og de 2–3
 * alternativene står i smale kolonner til høyre. Brukeren leser og
 * sammenligner fra venstre mot høyre per egenskap.
 */
const LicenceComparison = ({ selected, onSelect }: ComparisonProps) => {
  return (
    <div style={stack()}>
      <Table data-size='sm'>
        <caption>Sammenlign førerkortklasser</caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope='col'>Egenskap</Table.HeaderCell>
            {selected.map((l, column) => (
              <Table.HeaderCell key={column} scope='col'>
                {onSelect ? (
                  // Kolonneoverskriften er selve valget
                  <Select
                    aria-label={`Klasse i kolonne ${column + 1}`}
                    data-size='sm'
                    value={l.id}
                    onChange={(e) => onSelect(column, e.target.value)}
                  >
                    {LICENCES.map((o) => (
                      <Select.Option key={o.id} value={o.id}>
                        {/* Bare bokstavkoden, så valget får plass i en smal kolonne */}
                        {o.id}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  l.name
                )}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {PROPERTIES.map(({ key, label }) => (
            <Table.Row key={key}>
              <Table.HeaderCell scope='row'>{label}</Table.HeaderCell>
              {selected.map((l, column) => (
                <Table.Cell key={column}>{l[key]}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Paragraph data-size='xs'>
        Forenklet eksempeldata. Se Statens vegvesen for gjeldende regler.
      </Paragraph>
    </div>
  );
};

const byId = (id: string) => LICENCES.find((l) => l.id === id)!;

/** 3a: Tre faste alternativer side om side, med egenskapene som rader. */
export const CompareTransposed = () => (
  <LicenceComparison selected={['B', 'B96', 'BE'].map(byId)} />
);

/** 3b: Flere alternativer enn det er plass til. Brukeren velger hva som står i hver kolonne. */
export const CompareWithPicker = () => {
  const [ids, setIds] = useState(['B', 'C1']);
  return (
    <LicenceComparison
      selected={ids.map(byId)}
      // Ingen deaktiverte valg: står klassen i den andre kolonnen, bytter de plass
      onSelect={(column, id) =>
        setIds((prev) =>
          prev.map((p, i) => (i === column ? id : p === id ? prev[column] : p)),
        )
      }
    />
  );
};

/* -------------------------------------------------------------------------- */
/* Skjema: Rader brukeren legger inn og retter selv                           */
/* -------------------------------------------------------------------------- */

type Cost = {
  id: string;
  name: string;
  category: string;
  amount: number;
  errors: string[];
  warnings: string[];
  info: string[];
};

const COSTS: Cost[] = [
  {
    id: 'kostnad-husleie',
    name: 'Husleie',
    category: 'Drift',
    amount: 120000,
    errors: [],
    warnings: [],
    info: [],
  },
  {
    id: 'kostnad-konsulent',
    name: 'Konsulenttjenester',
    category: 'Innkjøp',
    amount: 0,
    errors: ['Beløpet må være større enn 0 kr.'],
    warnings: [],
    info: [],
  },
  {
    id: 'kostnad-reise',
    name: 'Reise til Bergen',
    category: 'Reise',
    amount: 48500,
    errors: [
      'Datoen må være innenfor prosjektperioden, 1. januar–31. desember 2026.',
      'Du må laste opp kvittering når beløpet er over 10 000 kr.',
    ],
    warnings: ['Reiser over 40 000 kr blir ofte bedt om nærmere begrunnelse.'],
    info: [],
  },
  {
    id: 'kostnad-lisenser',
    name: 'Programvarelisenser',
    category: 'Drift',
    amount: 9900,
    errors: [],
    warnings: [
      'Skriv gjerne hvilke lisenser det gjelder, så går saksbehandlingen raskere.',
    ],
    info: [
      'Lisenser som varer lenger enn prosjektet, dekkes bare for prosjektperioden.',
    ],
  },
];

const formatKr = (n: number) => `${n.toLocaleString('nb-NO')} kr`;

/** Bredden der kostnadstabellen får plass */
const COST_TABLE_MIN_WIDTH = 640;

/**
 * Antall advarsler eller opplysninger som knapp med popover. Det tilgjengelige
 * navnet starter med det synlige tallet (WCAG 2.5.3), og fargen er ikke
 * eneste kjennetegn fordi ikonet og teksten i popoveren sier hva det er.
 */
const NoteCount = ({
  kind,
  item,
}: {
  kind: 'warning' | 'info';
  item: Cost;
}) => {
  const notes = kind === 'warning' ? item.warnings : item.info;
  if (notes.length === 0) return null;
  const word =
    kind === 'warning'
      ? notes.length === 1
        ? 'advarsel'
        : 'advarsler'
      : notes.length === 1
        ? 'opplysning'
        : 'opplysninger';
  const Icon =
    kind === 'warning' ? ExclamationmarkTriangleIcon : InformationSquareIcon;
  const color = kind === 'warning' ? 'warning' : 'info';
  return (
    <Popover.TriggerContext>
      <Popover.Trigger
        variant='tertiary'
        data-size='sm'
        data-color={color}
        aria-label={`${notes.length} ${word} for ${item.name}`}
      >
        <Icon aria-hidden />
        {notes.length}
      </Popover.Trigger>
      <Popover data-color={color} placement='bottom' style={stack()}>
        <Paragraph data-size='sm'>
          <strong>
            {notes.length} {word}
          </strong>
        </Paragraph>
        {notes.map((n) => (
          <div
            key={n}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--ds-size-2)',
            }}
          >
            <Icon aria-hidden style={{ flex: 'none', marginTop: '0.2em' }} />
            <Paragraph data-size='sm'>{n}</Paragraph>
          </div>
        ))}
      </Popover>
    </Popover.TriggerContext>
  );
};

const Notes = ({ item }: { item: Cost }) => (
  <span style={{ display: 'inline-flex', gap: 'var(--ds-size-1)' }}>
    <NoteCount kind='warning' item={item} />
    <NoteCount kind='info' item={item} />
  </span>
);

const Errors = ({ item }: { item: Cost }) =>
  item.errors.length > 0 && (
    <div style={stack('var(--ds-size-1)')}>
      {item.errors.map((e) => (
        <ValidationMessage key={e} data-size='sm'>
          {e}
        </ValidationMessage>
      ))}
    </div>
  );

/* Knappene sier hvilken kostnad de gjelder, så de skiller seg fra hverandre
   i en liste over alle knappene. Det synlige ordet står først (WCAG 2.5.3). */
const EditButton = ({ item }: { item: Cost }) => (
  <Button variant='tertiary' data-size='sm' aria-label={`Rediger ${item.name}`}>
    <PencilIcon aria-hidden />
    Rediger
  </Button>
);

/**
 * Sletting kan ikke angres, så brukeren bekrefter i en popover. Knappene der
 * følger mønsteret for plassering av knapper: primær først, til venstre, og
 * tekster som sier hva som skjer.
 */
const DeleteButton = ({
  item,
  onDelete,
}: {
  item: Cost;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover.TriggerContext>
      <Popover.Trigger
        variant='tertiary'
        data-size='sm'
        data-color='danger'
        aria-label={`Slett ${item.name}`}
        onClick={() => setOpen((o) => !o)}
      >
        <TrashIcon aria-hidden />
        Slett
      </Popover.Trigger>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        placement='top'
        style={stack('var(--ds-size-3)')}
      >
        <Paragraph data-size='sm'>
          Vil du slette «{item.name}»? Du kan ikke angre.
        </Paragraph>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-size-2)' }}
        >
          <Button data-size='sm' data-color='danger' onClick={onDelete}>
            Ja, slett kostnad
          </Button>
          <Button
            data-size='sm'
            variant='secondary'
            onClick={() => setOpen(false)}
          >
            Behold kostnad
          </Button>
        </div>
      </Popover>
    </Popover.TriggerContext>
  );
};

/** Rader med feil får rød bakgrunn fra Designsystemet, i tillegg til feilteksten */
const errorRow = {
  '--dsc-table-background': 'var(--ds-color-danger-surface-tinted)',
} as CSSProperties;

/** Antall kolonner i kostnadstabellen, for raden med feil under */
const COST_COLUMNS = 7;

/**
 * Kostnadene som tabell, for full bredde. Feilene står i en egen rad under
 * kostnaden de gjelder, over hele bredden, så de ikke presser kolonnene.
 * Cellen peker på radoverskriften med headers, så skjermlesere vet hvilken
 * kostnad feilene gjelder.
 */
const CostTable = ({
  items,
  onDelete,
}: {
  items: Cost[];
  onDelete: (id: string) => void;
}) => (
  <Table data-size='sm' border>
    <caption className='ds-sr-only'>Kostnader</caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col'>Beskrivelse</Table.HeaderCell>
        <Table.HeaderCell scope='col'>Kategori</Table.HeaderCell>
        <Table.HeaderCell scope='col' style={numeric}>
          Beløp
        </Table.HeaderCell>
        {/* Overskriftene trengs for skjermlesere, men ikoner og knapper sier nok visuelt */}
        <Table.HeaderCell scope='col'>
          <span className='ds-sr-only'>Advarsler</span>
        </Table.HeaderCell>
        <Table.HeaderCell scope='col'>
          <span className='ds-sr-only'>Opplysninger</span>
        </Table.HeaderCell>
        {/* Ett interaktivt element per celle, slik retningslinjene for Table sier */}
        <Table.HeaderCell scope='colgroup' colSpan={2}>
          <span className='ds-sr-only'>Handlinger</span>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {items.flatMap((c) => {
        const style = c.errors.length > 0 ? errorRow : undefined;
        const rows = [
          <Table.Row key={c.id} style={style}>
            <Table.HeaderCell
              scope='row'
              id={c.id}
              tabIndex={-1}
              style={{ fontWeight: 'inherit' }}
            >
              {c.name}
            </Table.HeaderCell>
            <Table.Cell>{c.category}</Table.Cell>
            <Table.Cell style={numeric}>{formatKr(c.amount)}</Table.Cell>
            <Table.Cell>
              <NoteCount kind='warning' item={c} />
            </Table.Cell>
            <Table.Cell>
              <NoteCount kind='info' item={c} />
            </Table.Cell>
            <Table.Cell>
              <EditButton item={c} />
            </Table.Cell>
            <Table.Cell>
              <DeleteButton item={c} onDelete={() => onDelete(c.id)} />
            </Table.Cell>
          </Table.Row>,
        ];
        if (c.errors.length > 0)
          rows.push(
            <Table.Row key={`${c.id}-feil`} style={style}>
              <Table.Cell colSpan={COST_COLUMNS} headers={c.id}>
                <Errors item={c} />
              </Table.Cell>
            </Table.Row>,
          );
        return rows;
      })}
    </Table.Body>
  </Table>
);

/**
 * Kategori og beløp side om side, med etiketten over verdien. Det er en liten
 * tabell med kolonneoverskrifter, så koblingen mellom etikett og verdi er med
 * i koden. Skillelinjene og bakgrunnen er fjernet med Table sine egne tokens.
 */
const CostFields = ({ item }: { item: Cost }) => (
  <Table
    data-size='sm'
    style={
      {
        '--dsc-table-background': 'transparent',
        '--dsc-table-header-background': 'transparent',
        '--dsc-table-divider-border-width': 0,
        '--dsc-table-border-width': 0,
        '--dsc-table-padding': '0 var(--ds-size-4) 0 0',
        tableLayout: 'fixed',
      } as CSSProperties
    }
  >
    <caption className='ds-sr-only'>{item.name}</caption>
    <Table.Head>
      <Table.Row>
        {['Kategori', 'Beløp'].map((label) => (
          <Table.HeaderCell
            key={label}
            scope='col'
            style={{
              fontWeight: 'inherit',
              color: 'var(--ds-color-neutral-text-subtle)',
            }}
          >
            {label}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell style={{ borderBottom: 0 }}>{item.category}</Table.Cell>
        <Table.Cell style={{ borderBottom: 0 }}>{formatKr(item.amount)}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

/**
 * Hver rad blir et kort. Navnet og merknadene står øverst, kategori og beløp
 * side om side, feilene under, og handlingene i en egen rad nederst.
 * Kort med feil får farge fra Designsystemet, men feilteksten sier hva som er galt.
 */
const CostCards = ({
  items,
  onDelete,
}: {
  items: Cost[];
  onDelete: (id: string) => void;
}) => (
  <List.Unordered
    className={plainList.className}
    style={{ ...plainList.style, ...stack('var(--ds-size-3)') }}
  >
    {items.map((c) => (
      <List.Item key={c.id}>
        <Card
          id={c.id}
          tabIndex={-1}
          variant={c.errors.length > 0 ? 'tinted' : 'default'}
          data-color={c.errors.length > 0 ? 'danger' : undefined}
        >
          <Card.Block style={stack('var(--ds-size-3)')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--ds-size-2)',
              }}
            >
              <Heading level={4} data-size='2xs'>
                {c.name}
              </Heading>
              <Notes item={c} />
            </div>
            <CostFields item={c} />
            <Errors item={c} />
          </Card.Block>
          {/* Handlingsraden: to like brede knapper med skillelinje mellom */}
          <Card.Block
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              padding: 0,
            }}
          >
            <div style={{ display: 'grid' }}>
              <EditButton item={c} />
            </div>
            <div
              style={{
                display: 'grid',
                borderInlineStart:
                  'var(--ds-border-width-default) solid var(--dsc-card-border-color, var(--ds-color-neutral-border-subtle))',
              }}
            >
              <DeleteButton item={c} onDelete={() => onDelete(c.id)} />
            </div>
          </Card.Block>
        </Card>
      </List.Item>
    ))}
  </List.Unordered>
);

/**
 * Kort med handlingsrad: rader brukeren legger inn selv i et skjema. På full
 * bredde er det en tabell. Når den ikke får plass, blir hver rad et kort med
 * Rediger og Slett i en egen rad nederst, og feilene står i kortet de gjelder.
 */
export const CostsWithActionRow = () => {
  const id = useId();
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fitsTable = useFitsTable(ref, COST_TABLE_MIN_WIDTH);
  const [items, setItems] = useState(COSTS);
  const [showSummary, setShowSummary] = useState(false);
  // Kortet eller raden med fokus forsvinner, så fokus flyttes til overskriften
  const remove = (costId: string) => {
    setItems((prev) => prev.filter((c) => c.id !== costId));
    headingRef.current?.focus();
  };
  const withErrors = items.filter((c) => c.errors.length > 0);
  const errorCount = withErrors.reduce((n, c) => n + c.errors.length, 0);

  return (
    <section
      ref={ref}
      aria-labelledby={`${id}-heading`}
      style={stack('var(--ds-size-4)')}
    >
      <div style={stack('var(--ds-size-1)')}>
        <Heading
          ref={headingRef}
          tabIndex={-1}
          id={`${id}-heading`}
          level={3}
          data-size='xs'
        >
          Kostnader
        </Heading>
        <Paragraph data-size='sm'>
          Legg inn alle kostnadene du søker tilskudd for.
        </Paragraph>
      </div>

      {/* Leses opp når en kostnad slettes */}
      <Paragraph role='status' data-size='sm'>
        {items.length} kostnader
        {errorCount > 0 && `, ${errorCount} feil må rettes`}
      </Paragraph>

      {fitsTable ? (
        <CostTable items={items} onDelete={remove} />
      ) : (
        <CostCards items={items} onDelete={remove} />
      )}

      {/* Egen handling, ikke i samme gruppe som Neste steg og Forrige steg */}
      <div>
        <Button
          variant='secondary'
          style={fitsTable ? undefined : { width: '100%' }}
        >
          <PlusIcon aria-hidden />
          Legg til kostnad
        </Button>
      </div>

      {/* Mønsteret for feilmeldinger: oppsummeringen står like over Neste steg,
          og vises først når brukeren prøver å gå videre */}
      {showSummary && withErrors.length > 0 && (
        <ErrorSummary>
          <ErrorSummary.Heading>
            For å gå videre må du rette opp følgende feil:
          </ErrorSummary.Heading>
          <ErrorSummary.List>
            {withErrors.flatMap((c) =>
              c.errors.map((e) => (
                <ErrorSummary.Item key={`${c.id}-${e}`}>
                  <ErrorSummary.Link href={`#${c.id}`}>
                    {c.name}: {e}
                  </ErrorSummary.Link>
                </ErrorSummary.Item>
              )),
            )}
          </ErrorSummary.List>
        </ErrorSummary>
      )}

      {/* Primær før sekundær, til venstre. På små skjermer ligger Forrige steg
          under Neste steg. Neste steg er aldri deaktivert. */}
      <div
        style={{
          display: 'flex',
          flexDirection: fitsTable ? 'row' : 'column',
          alignItems: fitsTable ? 'center' : 'stretch',
          gap: 'var(--ds-size-3)',
        }}
      >
        <Button onClick={() => setShowSummary(true)}>Neste steg</Button>
        <Button variant='secondary'>Forrige steg</Button>
      </div>
    </section>
  );
};

/** 1h: Tabell på full bredde. Når den ikke får plass, blir radene en stablet liste med fire faste plasser. */
export const CasesTableToStackedList = () => (
  <ResponsiveCases SmallView={CaseStackedList} />
);
