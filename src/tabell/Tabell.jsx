import { useEffect, useRef, useState } from "react";
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
    <Table data-size="sm" zebra stickyHeader className={className} aria-labelledby={captionId}>
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
      <Table data-size="sm" zebra stickyHeader={stickyHeader} aria-labelledby="t-cols" className="flipped">
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
                    <Pagination.Button {...buttonProps} aria-label={`Side ${p}`}>{p}</Pagination.Button>
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
      <Table data-size="sm" zebra aria-labelledby="t-flip" className="flipped">
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
function Example({ id, smallLabel, caption, children }) {
  return (
    <div className="examples">
      <figure className="wide">
        <figcaption>Stor skjerm</figcaption>
        <BrowserFrame height={720} label="Tabell, stor skjerm">
          <div className="frame__content hifi">
            <Intro id={`${id}-large`} />
            <StatTable data={rows} captionId={`${id}-large`} />
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
          smallLabel="Tabell der brukeren blar mellom kolonnene, liten skjerm"
          caption="Første kolonne står fast, og tabellen viser to år om gangen. Pilknappene ligger nederst, innenfor rekkevidde for tommelen. De flytter ett år frem eller tilbake, så brukeren kan sammenligne to år som ligger ved siden av hverandre. Teksten ved knappene sier hvilke år som vises. Den leses også opp av skjermleser når brukeren blar. Med bryterne kan du prøve med og uten fast overskriftsrad og faste knapper."
        >
          <ColumnNavScreen stickyHeader={stickyHeader} stickyNav={stickyNav} />
        </Example>
      </section>
    </main>
  );
}
