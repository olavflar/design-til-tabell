import {
  Button,
  Card,
  Heading,
  Link,
  Paragraph,
  Table,
  Tag,
  ToggleGroup,
} from '@digdir/designsystemet-react';
import {
  BulletListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TableIcon,
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

/* -------------------------------------------------------------------------- */
/* Felles oppsett                                                             */
/* -------------------------------------------------------------------------- */

type Options = {
  stickyColumn?: boolean;
  stickyHeader?: boolean;
  /** Lar brukeren bytte mellom tabell og liste */
  alternativeView?: boolean;
};

const labelCell = (level = 0): CSSProperties => ({
  minWidth: '9.5rem',
  maxWidth: '11rem',
  whiteSpace: 'normal',
  hyphens: 'auto',
  paddingLeft: `calc(var(--ds-size-3) + ${level} * var(--ds-size-3))`,
});

const numCell: CSSProperties = {
  textAlign: 'right',
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
  minWidth: '5rem',
};

const groupBackground = 'var(--ds-color-neutral-surface-tinted)';

const listReset: CSSProperties = { listStyle: 'none', margin: 0, padding: 0 };

/** Fast førstekolonne. Table har ikke dette innebygd, så det legges på cellen. */
const sticky = (
  on: boolean | undefined,
  scrolled: boolean,
  background = 'var(--ds-color-neutral-surface-default)',
  zIndex = 1,
): CSSProperties =>
  on
    ? {
        position: 'sticky',
        left: 0,
        zIndex,
        background,
        boxShadow: scrolled
          ? '6px 0 8px -4px color-mix(in srgb, var(--ds-color-neutral-text-default) 25%, transparent)'
          : undefined,
      }
    : {};

type ScrollState = { overflowing: boolean; atStart: boolean; atEnd: boolean };

/** Holder rede på om innholdet er bredere enn plassen, og hvor langt det er rullet. */
const useHorizontalScroll = (ref: RefObject<HTMLDivElement | null>) => {
  const [state, setState] = useState<ScrollState>({
    overflowing: false,
    atStart: true,
    atEnd: true,
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const next = {
        overflowing: max > 1,
        atStart: el.scrollLeft <= 1,
        atEnd: el.scrollLeft >= max - 1,
      };
      setState((prev) =>
        prev.overflowing === next.overflowing &&
        prev.atStart === next.atStart &&
        prev.atEnd === next.atEnd
          ? prev
          : next,
      );
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [ref]);
  return state;
};

const edgeShadow = (
  side: 'left' | 'right',
  visible: boolean,
): CSSProperties => ({
  position: 'absolute',
  insetBlock: 0,
  [side]: 0,
  width: 'var(--ds-size-4)',
  pointerEvents: 'none',
  background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, color-mix(in srgb, var(--ds-color-neutral-text-default) 18%, transparent), transparent)`,
  opacity: visible ? 1 : 0,
  transition: 'opacity 150ms',
  zIndex: 4,
});

type ScrollAreaProps = {
  labelledBy: string;
  /** Høyden begrenses når tabellen har stickyHeader */
  stickyHeader?: boolean;
  /** Fast førstekolonne har egen skygge, så venstre kantskygge skjules */
  stickyColumn?: boolean;
  children: ReactNode;
  onScrolledChange?: (scrolled: boolean) => void;
};

/**
 * Rulleområde for brede tabeller. Gjør det tydelig at tabellen kan rulles:
 * - hjelpetekst og pilknapper vises bare når tabellen er bredere enn plassen
 * - pilknappene deaktiveres når tabellen er rullet helt ut i den retningen
 * - skygge i kanten der det er mer innhold
 */
const ScrollArea = ({
  labelledBy,
  stickyHeader,
  stickyColumn,
  children,
  onScrolledChange,
}: ScrollAreaProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { overflowing, atStart, atEnd } = useHorizontalScroll(ref);

  useEffect(() => onScrolledChange?.(!atStart), [atStart, onScrolledChange]);

  const scrollBy = (left: number) =>
    ref.current?.scrollBy({ left, behavior: 'smooth' });

  return (
    <>
      {overflowing && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--ds-size-2)',
          }}
        >
          <Paragraph
            data-size='xs'
            style={{ margin: 0, color: 'var(--ds-color-neutral-text-subtle)' }}
          >
            Rull sideveis for å se alle kolonnene
          </Paragraph>
          <div style={{ display: 'flex', gap: 'var(--ds-size-1)' }}>
            <Button
              variant='tertiary'
              data-size='sm'
              icon
              aria-label='Rull tabellen til venstre'
              disabled={atStart}
              onClick={() => scrollBy(-160)}
            >
              <ChevronLeftIcon aria-hidden />
            </Button>
            <Button
              variant='tertiary'
              data-size='sm'
              icon
              aria-label='Rull tabellen til høyre'
              disabled={atEnd}
              onClick={() => scrollBy(160)}
            >
              <ChevronRightIcon aria-hidden />
            </Button>
          </div>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {/* WCAG 1.4.10: tabellen ruller, ikke siden. Fokuserbar for tastatur. */}
        <div
          ref={ref}
          role='region'
          aria-labelledby={labelledBy}
          tabIndex={0}
          style={{
            overflow: 'auto',
            // stickyHeader festes til nærmeste rulleområde, så det må ha en høyde.
            // cqh = høyden til nærmeste container, ellers skjermhøyden.
            maxHeight: stickyHeader ? '70cqh' : undefined,
            borderBlock: stickyHeader
              ? 'var(--ds-border-width-default) solid var(--ds-color-neutral-border-subtle)'
              : undefined,
          }}
        >
          {children}
        </div>
        {!stickyColumn && (
          <div
            aria-hidden
            style={edgeShadow('left', overflowing && !atStart)}
          />
        )}
        <div aria-hidden style={edgeShadow('right', overflowing && !atEnd)} />
      </div>
    </>
  );
};

/** Samme data som liste: hver rad blir en oppføring med verdiene under. */
const TransportList = ({ labelledBy }: { labelledBy: string }) => (
  <div role='region' aria-labelledby={labelledBy}>
    {GROUPS.map((g) => (
      <section key={g.label} style={{ marginBottom: 'var(--ds-size-4)' }}>
        <Heading
          level={4}
          data-size='2xs'
          style={{
            margin: 0,
            padding: 'var(--ds-size-2) var(--ds-size-3)',
            background: groupBackground,
          }}
        >
          {g.label}
        </Heading>
        <ul style={listReset}>
          {g.rows.map(([level, label, a, b, total]) => (
            <li
              key={label + a}
              style={{
                padding: 'var(--ds-size-3)',
                paddingLeft: `calc(var(--ds-size-3) + ${level} * var(--ds-size-4))`,
                borderBottom:
                  'var(--ds-border-width-default) solid var(--ds-color-neutral-border-subtle)',
                fontWeight: total
                  ? 'var(--ds-font-weight-semibold)'
                  : undefined,
              }}
            >
              {label}
              <dl
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 'var(--ds-size-2)',
                  margin: 'var(--ds-size-1) 0 0',
                  fontSize: 'var(--ds-body-sm-font-size)',
                }}
              >
                {[
                  [COLUMNS[0], formatNumber(a)],
                  [COLUMNS[1], formatNumber(b)],
                  ['Endring, %', formatChange(a, b)],
                ].map(([term, value]) => (
                  <div key={term}>
                    <dt
                      style={{
                        color: 'var(--ds-color-neutral-text-subtle)',
                        fontWeight: 'var(--ds-font-weight-regular)',
                      }}
                    >
                      {term}
                    </dt>
                    <dd
                      style={{ margin: 0, fontVariantNumeric: 'tabular-nums' }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);

const TransportTable = ({
  stickyColumn,
  stickyHeader,
  alternativeView,
}: Options) => {
  const titleId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<'tabell' | 'liste'>('tabell');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-2)',
      }}
    >
      <div>
        <Paragraph
          data-size='sm'
          style={{
            margin: 0,
            fontWeight: 'var(--ds-font-weight-medium)',
            color: 'var(--ds-color-accent-text-subtle)',
          }}
        >
          Tabell 1
        </Paragraph>
        <Heading id={titleId} level={3} data-size='2xs' style={{ margin: 0 }}>
          {TITLE}
        </Heading>
      </div>

      {alternativeView && (
        <ToggleGroup
          data-size='sm'
          value={view}
          onChange={(v) => setView(v as 'tabell' | 'liste')}
          aria-label='Velg visning av tabell 1'
          style={{ alignSelf: 'flex-start' }}
        >
          <ToggleGroup.Item value='tabell'>
            <TableIcon aria-hidden />
            Tabell
          </ToggleGroup.Item>
          <ToggleGroup.Item value='liste'>
            <BulletListIcon aria-hidden />
            Liste
          </ToggleGroup.Item>
        </ToggleGroup>
      )}

      {view === 'liste' ? (
        <TransportList labelledBy={titleId} />
      ) : (
        <ScrollArea
          labelledBy={titleId}
          stickyHeader={stickyHeader}
          stickyColumn={stickyColumn}
          onScrolledChange={setScrolled}
        >
          <Table
            data-size='sm'
            data-color='neutral'
            stickyHeader={stickyHeader}
            aria-labelledby={titleId}
            style={{ width: 'max-content', minWidth: '100%' }}
          >
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell
                  scope='col'
                  style={{
                    ...labelCell(),
                    verticalAlign: 'bottom',
                    ...sticky(stickyColumn, scrolled, undefined, 3),
                  }}
                >
                  Transportmåte
                </Table.HeaderCell>
                {COLUMNS.map((c, i) => (
                  <Table.HeaderCell
                    key={c}
                    scope='col'
                    style={{
                      ...numCell,
                      ...(i === COLUMNS.length - 1 && {
                        whiteSpace: 'normal',
                        minWidth: '7.5rem',
                      }),
                    }}
                  >
                    {c}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>

            {GROUPS.map((g) => (
              <Table.Body key={g.label}>
                <Table.Row>
                  <Table.HeaderCell
                    scope='rowgroup'
                    style={{
                      ...labelCell(),
                      background: groupBackground,
                      ...sticky(stickyColumn, scrolled, groupBackground),
                    }}
                  >
                    {g.label}
                  </Table.HeaderCell>
                  <Table.Cell
                    colSpan={COLUMNS.length}
                    style={{ background: groupBackground }}
                  />
                </Table.Row>
                {g.rows.map(([level, label, a, b, total]) => {
                  const weight = total
                    ? 'var(--ds-font-weight-semibold)'
                    : 'var(--ds-font-weight-regular)';
                  return (
                    <Table.Row key={label + a}>
                      <Table.HeaderCell
                        scope='row'
                        style={{
                          ...labelCell(level),
                          fontWeight: weight,
                          ...sticky(stickyColumn, scrolled),
                        }}
                      >
                        {label}
                      </Table.HeaderCell>
                      <Table.Cell style={{ ...numCell, fontWeight: weight }}>
                        {formatNumber(a)}
                      </Table.Cell>
                      <Table.Cell style={{ ...numCell, fontWeight: weight }}>
                        {formatNumber(b)}
                      </Table.Cell>
                      <Table.Cell style={numCell}>
                        {formatChange(a, b)}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            ))}
          </Table>
        </ScrollArea>
      )}

      <ol
        style={{
          margin: 0,
          paddingLeft: '1.2em',
          fontSize: 'var(--ds-body-sm-font-size)',
          color: 'var(--ds-color-neutral-text-subtle)',
        }}
      >
        {NOTES.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ol>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Eksempler                                                                  */
/* -------------------------------------------------------------------------- */

/** 1a: Tabellen rulles sideveis. Brukeren kan bytte til listevisning. */
export const TableHorizontalScroll = () => <TransportTable alternativeView />;

/** 1b: Radoverskriftene står fast mens tallkolonnene rulles. */
export const TableStickyFirstColumn = () => <TransportTable stickyColumn />;

/** 1d: Fast førstekolonne og stickyHeader i ett rulleområde med begrenset høyde. */
export const TableStickyHeader = () => (
  <TransportTable stickyColumn stickyHeader />
);

/* -------------------------------------------------------------------------- */
/* Objektliste: samme data vist som tabell, liste og kort                     */
/* -------------------------------------------------------------------------- */

type Status = 'Venter på deg' | 'Under behandling' | 'Mottatt' | 'Avsluttet';

type Case = {
  id: string;
  title: string;
  caseNumber: string;
  status: Status;
  received: string;
  handler: string;
};

const CASES: Case[] = [
  {
    id: 'sak-1432',
    title: 'Søknad om byggetillatelse',
    caseNumber: '2026/1432',
    status: 'Venter på deg',
    received: '12.10.2026',
    handler: 'Byggesaksavdelingen',
  },
  {
    id: 'sak-1398',
    title: 'Søknad om ferdigattest',
    caseNumber: '2026/1398',
    status: 'Under behandling',
    received: '03.10.2026',
    handler: 'Byggesaksavdelingen',
  },
  {
    id: 'sak-1201',
    title: 'Klage på eiendomsskatt',
    caseNumber: '2026/1201',
    status: 'Under behandling',
    received: '18.09.2026',
    handler: 'Skatteoppkreveren',
  },
  {
    id: 'sak-1187',
    title: 'Søknad om parkeringstillatelse',
    caseNumber: '2026/1187',
    status: 'Mottatt',
    received: '16.09.2026',
    handler: 'Bymiljøetaten',
  },
  {
    id: 'sak-0954',
    title: 'Melding om flytting',
    caseNumber: '2026/0954',
    status: 'Avsluttet',
    received: '02.08.2026',
    handler: 'Folkeregisteret',
  },
];

const STATUS_COLOR: Record<Status, string> = {
  'Venter på deg': 'warning',
  'Under behandling': 'info',
  Mottatt: 'neutral',
  Avsluttet: 'success',
};

const META: { key: keyof Case; label: string }[] = [
  { key: 'caseNumber', label: 'Saksnummer' },
  { key: 'received', label: 'Mottatt' },
  { key: 'handler', label: 'Behandles av' },
];

const StatusTag = ({ status }: { status: Status }) => (
  <Tag data-size='sm' data-color={STATUS_COLOR[status]}>
    {status}
  </Tag>
);

/** Beskrivelsesliste (<dl>) for metadata. Designsystemet har ikke egen komponent for dette. */
const MetaList = ({ item, columns = 1 }: { item: Case; columns?: 1 | 2 }) => (
  <dl
    style={{
      display: 'grid',
      gridTemplateColumns: columns === 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
      gap: 'var(--ds-size-2) var(--ds-size-4)',
      margin: 0,
      fontSize: 'var(--ds-body-sm-font-size)',
    }}
  >
    {META.map(({ key, label }) => (
      <div key={key}>
        <dt style={{ color: 'var(--ds-color-neutral-text-subtle)' }}>
          {label}
        </dt>
        <dd style={{ margin: 0 }}>{item[key]}</dd>
      </div>
    ))}
  </dl>
);

/** Samme saker som tabell. Fungerer godt på stor skjerm, men krever sideveis rulling på mobil. */
export const CasesTable = () => {
  const titleId = useId();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-2)',
      }}
    >
      <Heading id={titleId} level={3} data-size='2xs' style={{ margin: 0 }}>
        Mine saker
      </Heading>
      <ScrollArea labelledBy={titleId}>
        <Table
          data-size='sm'
          data-color='neutral'
          aria-labelledby={titleId}
          style={{ width: 'max-content', minWidth: '100%' }}
        >
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>Sak</Table.HeaderCell>
              <Table.HeaderCell scope='col'>Status</Table.HeaderCell>
              {META.map(({ key, label }) => (
                <Table.HeaderCell key={key} scope='col'>
                  {label}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {CASES.map((c) => (
              <Table.Row key={c.id}>
                <Table.HeaderCell scope='row'>
                  {/* Tabellen er nøytral, lenken beholder lenkefargen */}
                  <Link data-color='accent' href={`#${c.id}`}>
                    {c.title}
                  </Link>
                </Table.HeaderCell>
                <Table.Cell>
                  <StatusTag status={c.status} />
                </Table.Cell>
                {META.map(({ key }) => (
                  <Table.Cell key={key} style={{ whiteSpace: 'nowrap' }}>
                    {c[key]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ScrollArea>
    </div>
  );
};

/** Liste (<ul>): objektnavn og litt metadata. Rask å skanne, fungerer på alle skjermbredder. */
export const CasesList = () => (
  <section aria-labelledby='cases-list-heading'>
    <Heading
      id='cases-list-heading'
      level={3}
      data-size='2xs'
      style={{ margin: 0 }}
    >
      Mine saker
    </Heading>
    <ul style={{ ...listReset, marginTop: 'var(--ds-size-2)' }}>
      {CASES.map((c) => (
        <li
          key={c.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-size-1)',
            paddingBlock: 'var(--ds-size-3)',
            borderBottom:
              'var(--ds-border-width-default) solid var(--ds-color-neutral-border-subtle)',
          }}
        >
          <Link href={`#${c.id}`}>{c.title}</Link>
          <Paragraph
            data-size='sm'
            style={{ margin: 0, color: 'var(--ds-color-neutral-text-subtle)' }}
          >
            {c.status} · Mottatt {c.received}
          </Paragraph>
        </li>
      ))}
    </ul>
  </section>
);

/** Liste med beskrivelsesliste (<ul> + <dl>): mer metadata, tydelig kobling mellom etikett og verdi. */
export const CasesDescriptionList = () => (
  <section aria-labelledby='cases-dl-heading'>
    <Heading
      id='cases-dl-heading'
      level={3}
      data-size='2xs'
      style={{ margin: 0 }}
    >
      Mine saker
    </Heading>
    <ul style={{ ...listReset, marginTop: 'var(--ds-size-2)' }}>
      {CASES.map((c) => (
        <li
          key={c.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-size-2)',
            paddingBlock: 'var(--ds-size-4)',
            borderBottom:
              'var(--ds-border-width-default) solid var(--ds-color-neutral-border-subtle)',
          }}
        >
          <Heading level={4} data-size='2xs' style={{ margin: 0 }}>
            <Link href={`#${c.id}`}>{c.title}</Link>
          </Heading>
          <div>
            <StatusTag status={c.status} />
          </div>
          <MetaList item={c} columns={2} />
        </li>
      ))}
    </ul>
  </section>
);

/** Kort (rik liste): hvert kort er et listeelement, og hele kortet er klikkbart via lenken i overskriften. */
export const CasesCards = () => (
  <section aria-labelledby='cases-cards-heading'>
    <Heading
      id='cases-cards-heading'
      level={3}
      data-size='2xs'
      style={{ margin: 0 }}
    >
      Mine saker
    </Heading>
    <ul
      style={{
        ...listReset,
        marginTop: 'var(--ds-size-3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 18rem), 1fr))',
        gap: 'var(--ds-size-3)',
      }}
    >
      {CASES.map((c) => (
        <li key={c.id}>
          <Card
            data-color='neutral'
            data-clickdelegatefor={`${c.id}-link`}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--ds-size-3)',
              padding: 'var(--ds-size-4)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--ds-size-2)',
              }}
            >
              <Heading level={4} data-size='2xs' style={{ margin: 0 }}>
                <Link data-color='accent' id={`${c.id}-link`} href={`#${c.id}`}>
                  {c.title}
                </Link>
              </Heading>
              <ChevronRightIcon
                aria-hidden
                style={{ flexShrink: 0, fontSize: '1.5rem' }}
              />
            </div>
            <div>
              <StatusTag status={c.status} />
            </div>
            <MetaList item={c} />
          </Card>
        </li>
      ))}
    </ul>
  </section>
);
