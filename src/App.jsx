import { useEffect, useState } from "react";
import {
  Details,
  Heading,
  List,
  Link,
  Paragraph,
  Tabs,
} from "@digdir/designsystemet-react";
import { groups } from "./variants.js";
import { BrowserFrame, PhoneFrame } from "./components/DeviceFrame.jsx";
import { alternatives, intro, structureNote } from "./guidance.js";

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
  { key: "mobil", label: "Mobil", frame: "phone", width: 390, height: 720 },
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

/** Samme eksempel på mobil, nettbrett og desktop */
function Devices({ variant }) {
  const wide = useWideScreen();
  if (!wide) return <Prototype variant={variant} />;
  return (
    <div className="devices">
      {DEVICES.map((d) => {
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
  return (
    <section className="scenario" aria-labelledby={`scenario-${group.id}`}>
      <Heading id={`scenario-${group.id}`} level={2} data-size="md">
        {group.title}
      </Heading>
      <div className="scenario__text">
        <Heading level={3} data-size="xs">
          Kontekst og behov
        </Heading>
        <Paragraph>{group.need}</Paragraph>
        <Heading level={3} data-size="xs">
          Eksempler
        </Heading>
        <List.Unordered>
          {group.examples.map((e) => (
            <List.Item key={e}>{e}</List.Item>
          ))}
        </List.Unordered>
        <Heading level={3} data-size="xs">
          Anbefalinger
        </Heading>
        <List.Unordered>
          {group.recommendations.map((r) => (
            <List.Item key={r}>{r}</List.Item>
          ))}
        </List.Unordered>
      </div>

      <Heading level={3} data-size="xs">
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
                <Devices variant={v} />
              </div>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </section>
  );
}

export default function App() {
  return (
    <main className="page">
      <Paragraph data-size="sm" className="eyebrow">
        Mønster: Strukturert data på små skjermer
      </Paragraph>
      <Heading level={1} data-size="lg">
        Strukturert informasjon på små skjermer
      </Heading>
      <Paragraph>
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
      <Guidance />
      {groups.map((g) => (
        <Scenario key={g.id} group={g} />
      ))}
    </main>
  );
}
