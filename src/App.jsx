import { useEffect, useRef, useState } from "react";
import {
  Button,
  Details,
  Heading,
  List,
  Link,
  Paragraph,
  Tabs,
  ToggleGroup,
} from "@digdir/designsystemet-react";
import { groups } from "./variants.js";
import { BrowserFrame, PhoneFrame } from "./components/DeviceFrame.jsx";
import {
  alternatives,
  designText,
  ingress,
  intro,
  language,
  preparations,
  sources,
  structureNote,
} from "./guidance.js";

function Guidance() {
  return (
    <section className="guidance" aria-labelledby="guidance-heading">
      <Heading id="guidance-heading" level={2} data-size="sm">
        Hva er alternativene
      </Heading>
      <Paragraph>{intro}</Paragraph>
      <Paragraph>{structureNote}</Paragraph>
      <div>
        {alternatives.map((a) => (
          <Details key={a.title}>
            <Details.Summary>{a.title}</Details.Summary>
            <Details.Content>
              <Paragraph data-size="sm">
                <strong>Markup:</strong> {a.markup}
              </Paragraph>
              <Heading level={3} data-size="2xs">
                {a.title} kan være greit når …
              </Heading>
              <List.Unordered>
                {a.when.map((t) => (
                  <List.Item key={t}>{t}</List.Item>
                ))}
              </List.Unordered>
              <Heading level={3} data-size="2xs">
                Vær oppmerksom på:
              </Heading>
              <List.Unordered>
                {a.caution.map((t) => (
                  <List.Item key={t}>{t}</List.Item>
                ))}
              </List.Unordered>
            </Details.Content>
          </Details>
        ))}
      </div>
    </section>
  );
}

// Hvert eksempel vises i tre bredder samtidig. 390 × 844 tilsvarer nyere
// iPhone, 768 er et nettbrett på høykant, og desktop fyller bredden.
const DEVICES = [
  { key: "mobil", label: "Mobil", frame: "phone", width: 390, height: 844 },
  { key: "nettbrett", label: "Nettbrett", frame: "browser", width: 768, height: 720 },
  { key: "desktop", label: "Desktop", frame: "browser", height: 720 },
];

// På små skjermer er telefonen selv rammen, så da vises prototypen som en vanlig side.
const useWideScreen = () => {
  const query = "(min-width: 40rem)";
  const [wide, setWide] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
};

function Prototype({ variant }) {
  return (
    <section className="article">
      <Paragraph data-size="sm" className="eyebrow">
        {variant.context.eyebrow}
      </Paragraph>
      <Heading level={2} data-size="lg">
        {variant.context.heading}
      </Heading>
      <Paragraph>{variant.context.intro}</Paragraph>
      <variant.Component />
    </section>
  );
}

const MIN_WIDTH = 360;

/**
 * Én nettleserramme der bredden styres med en glidebryter, så man ser
 * tabellen bli til kort eller liste mens bredden endres.
 */
function DynamicDevice({ variant }) {
  const ref = useRef(null);
  const [max, setMax] = useState(1280);
  const [width, setWidth] = useState(1280);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);

  // Største bredde er plassen rammen har på siden
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const w = Math.floor(e.contentRect.width);
      setMax(w);
      setWidth((cur) => Math.min(cur, w));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Smalner inn til mobil og tilbake igjen
  const play = () => {
    if (playing) {
      cancelAnimationFrame(raf.current);
      setPlaying(false);
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWidth((w) => (w > (max + MIN_WIDTH) / 2 ? MIN_WIDTH : max));
      return;
    }
    setPlaying(true);
    const duration = 6000;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // 0 → 1 → 0, mykt i hver ende
      const k = (1 - Math.cos(t * 2 * Math.PI)) / 2;
      setWidth(Math.round(max - k * (max - MIN_WIDTH)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const id = `bredde-${variant.id}`;
  return (
    <div className="dynamic" ref={ref}>
      <div className="dynamic__controls">
        <label htmlFor={id}>Bredde</label>
        <input
          id={id}
          type="range"
          min={MIN_WIDTH}
          max={max}
          step={1}
          value={width}
          onChange={(e) => {
            cancelAnimationFrame(raf.current);
            setPlaying(false);
            setWidth(Number(e.target.value));
          }}
        />
        <output htmlFor={id}>{width} px</output>
        <Button variant="secondary" data-size="sm" onClick={play}>
          {playing ? "Stopp" : "Spill av"}
        </Button>
      </div>
      <BrowserFrame
        width={width}
        height={720}
        label={`Eksempel ${variant.id}, ${width} piksler bred`}
      >
        <div className="frame__content">
          <Prototype variant={variant} />
        </div>
      </BrowserFrame>
    </div>
  );
}

/** Samme eksempel på mobil, nettbrett og desktop, eller på én av dem */
function Devices({ variant, device }) {
  const wide = useWideScreen();
  if (!wide) return <Prototype variant={variant} />;
  if (device === "dynamisk") return <DynamicDevice variant={variant} />;
  const shown = DEVICES.filter((d) => device === "alle" || d.key === device);
  return (
    <div className="devices">
      {shown.map((d) => {
        const Frame = d.frame === "phone" ? PhoneFrame : BrowserFrame;
        return (
          <figure key={d.key} className={`device device--${d.key}`}>
            <figcaption>
              {d.label}
              {d.width ? ` (${d.width} px)` : ""}
            </figcaption>
            <Frame
              width={d.width}
              height={d.height}
              label={`Eksempel ${variant.id}, ${d.label.toLowerCase()}`}
            >
              <div className="frame__content">
                <Prototype variant={variant} />
              </div>
            </Frame>
          </figure>
        );
      })}
    </div>
  );
}

/** Ett scenario: teksten fra artikkelen først, så eksemplene */
function Scenario({ group }) {
  const [current, setCurrent] = useState(group.variants[0].id);
  // Valget beholdes når brukeren bytter eksempel i samme scenario
  const [device, setDevice] = useState("mobil");
  const wide = useWideScreen();
  return (
    <section className="scenario" aria-labelledby={`scenario-${group.id}`}>
      <Heading id={`scenario-${group.id}`} level={3} data-size="md">
        {group.title}
      </Heading>
      <div className="scenario__text">
        <Heading level={4} data-size="xs">
          Kontekst og behov
        </Heading>
        <Paragraph>{group.need}</Paragraph>
        <Heading level={4} data-size="xs">
          Eksempler
        </Heading>
        <List.Unordered>
          {group.examples.map((e) => (
            <List.Item key={e}>{e}</List.Item>
          ))}
        </List.Unordered>
        <Heading level={4} data-size="xs">
          Anbefalinger
        </Heading>
        <List.Unordered>
          {group.recommendations.map((r) => (
            <List.Item key={r}>{r}</List.Item>
          ))}
        </List.Unordered>
      </div>

      <Heading level={4} data-size="xs">
        Slik kan det se ut
      </Heading>
      <Tabs value={current} onChange={setCurrent} data-size="sm">
        <Tabs.List>
          {group.variants.map((v) => (
            <Tabs.Tab key={v.id} value={v.id}>
              {v.id}: {v.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {/* Ett panel per eksempel, men bare det valgte tegnes */}
        {group.variants.map((v) => (
          <Tabs.Panel key={v.id} value={v.id}>
            {v.id === current && (
              <div className="scenario__example">
                <Paragraph>{v.description}</Paragraph>
                <Paragraph data-size="xs" className="eyebrow">
                  Story: <code>{v.story}</code>
                </Paragraph>
                {wide && (
                  <ToggleGroup
                    data-size="sm"
                    value={device}
                    onChange={setDevice}
                    aria-label={`Vis eksempel ${v.id} på`}
                  >
                    <ToggleGroup.Item value="alle">Alle</ToggleGroup.Item>
                    {DEVICES.map((d) => (
                      <ToggleGroup.Item key={d.key} value={d.key}>
                        {d.label}
                      </ToggleGroup.Item>
                    ))}
                    <ToggleGroup.Item value="dynamisk">Dynamisk</ToggleGroup.Item>
                  </ToggleGroup>
                )}
                <Devices variant={v} device={device} />
              </div>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </section>
  );
}

/** Artikler som er inspirasjon for mønsteret, med det viktigste fra hver */
function Sources() {
  return (
    <section className="guidance" aria-labelledby="sources-heading">
      <Heading id="sources-heading" level={2} data-size="sm">
        Inspirasjon
      </Heading>
      <div>
        {sources.map((src) => (
          <Details key={src.title}>
            <Details.Summary>{src.title}</Details.Summary>
            <Details.Content>
              <Paragraph data-size="sm" className="eyebrow">
                {src.href ? <Link href={src.href}>{src.author}</Link> : src.author}
              </Paragraph>
              <List.Unordered>
                {src.points.map((t) => (
                  <List.Item key={t}>{t}</List.Item>
                ))}
              </List.Unordered>
            </Details.Content>
          </Details>
        ))}
      </div>
    </section>
  );
}

/** «Forberedelser» fra artikkelen */
function Preparations() {
  return (
    <section className="guidance" aria-labelledby="preparations-heading">
      <Heading id="preparations-heading" level={2} data-size="sm">
        Forberedelser
      </Heading>
      <Paragraph>{preparations.intro}</Paragraph>
      <List.Unordered>
        {preparations.questions.map((q) => (
          <List.Item key={q}>{q}</List.Item>
        ))}
      </List.Unordered>
    </section>
  );
}

/** «Design og opplevelse» fra artikkelen */
function Design() {
  return (
    <section className="guidance" aria-labelledby="design-heading">
      <Heading id="design-heading" level={2} data-size="sm">
        Design og opplevelse
      </Heading>
      {designText.map((t) => (
        <Paragraph key={t}>{t}</Paragraph>
      ))}
    </section>
  );
}

/** «Språk» fra artikkelen */
function Language() {
  return (
    <section className="guidance language" aria-labelledby="language-heading">
      <Heading id="language-heading" level={2} data-size="md">
        Språk
      </Heading>
      {language.map((part) => (
        <div key={part.title} className="guidance">
          <Heading level={3} data-size="xs">
            {part.title}
          </Heading>
          {part.text.map((t) => (
            <Paragraph key={t}>{t}</Paragraph>
          ))}
          <List.Unordered>
            {part.points.map((t) => (
              <List.Item key={t}>{t}</List.Item>
            ))}
          </List.Unordered>
          {part.after && <Paragraph>{part.after}</Paragraph>}
        </div>
      ))}
    </section>
  );
}

export default function App() {
  return (
    <main className="page">
      <Paragraph data-size="sm" className="eyebrow">
        Mønster
      </Paragraph>
      <Heading level={1} data-size="lg">
        Strukturerte data på små skjermer
      </Heading>
      {ingress.map((t) => (
        <Paragraph key={t} data-size="lg">
          {t}
        </Paragraph>
      ))}
      <Paragraph data-size="sm" className="eyebrow">
        Prototyper bygget med Designsystemet. Hvert scenario viser teksten fra
        artikkelen først, og så eksemplene på mobil, nettbrett og desktop.
        Eksemplene ligger i
        <code> src/patterns/structured-data.stories.tsx</code>.
      </Paragraph>
      <section className="guidance" aria-labelledby="definition-heading">
        <Heading id="definition-heading" level={2} data-size="sm">
          Definisjon
        </Heading>
        <Paragraph>
          Strukturerte data er informasjon som følger en definert og gjentakende
          struktur. Det kan for eksempel være en samling verdier som har de
          samme egenskapene, som saker med saksnummer, dato og status, eller
          målinger fra flere tidspunkter. Dataene kan vises som tabell, liste
          eller andre organiserte visninger i et brukergrensesnitt. Se også{" "}
          <Link href="https://data.norge.no/nb/search/concepts?q=strukturerte%20data">
            begrepet i Felles datakatalog (data.norge.no)
          </Link>
          .
        </Paragraph>
      </section>
      <Preparations />
      <Guidance />
      <Design />
      <Heading level={2} data-size="md" className="scenarios-heading">
        Brukerscenarier
      </Heading>
      {groups.map((g) => (
        <Scenario key={g.id} group={g} />
      ))}
      <Language />
      <Sources />
    </main>
  );
}
