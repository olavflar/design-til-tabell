import { useEffect, useState } from "react";
import {
  Card,
  Details,
  Heading,
  List,
  Link,
  Paragraph,
  Tag,
  ToggleGroup,
} from "@digdir/designsystemet-react";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { groups, variants } from "./variants.js";
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

const useHash = () => {
  const route = () =>
    location.hash.startsWith("#/") ? location.hash.slice(2) : null;
  const [hash, setHash] = useState(() => route() ?? "");
  useEffect(() => {
    const on = () => {
      const r = route();
      if (r === null) return; // vanlig anker i et eksempel, ikke en side
      setHash(r);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
};

function Overview() {
  return (
    <main className="page">
      <Paragraph data-size="sm" className="eyebrow">
        Mønster: Strukturert data på små skjermer
      </Paragraph>
      <Heading level={1} data-size="lg">
        Strukturert informasjon på små skjermer
      </Heading>
      <Paragraph>
        Prototyper bygget med Designsystemet. Åpne dem på mobil, eller gjør
        nettleservinduet smalt. Eksemplene ligger i
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
        <section key={g.title} className="variant-group">
          <Heading level={2} data-size="sm">
            {g.title}
          </Heading>
          <Paragraph data-size="sm">{g.need}</Paragraph>
          <Paragraph data-size="sm">
            <strong>Eksempler:</strong> {g.examples.join(", ")}.
          </Paragraph>
          <Heading level={3} data-size="2xs">
            Anbefalinger
          </Heading>
          <List.Unordered data-size="sm">
            {g.recommendations.map((r) => (
              <List.Item key={r}>{r}</List.Item>
            ))}
          </List.Unordered>
          <ul className="variant-list">
            {g.variants.map((v) => (
              <li key={v.id}>
                <Card asChild data-color="accent">
                  <a href={`#/${v.id}`}>
                    <Tag data-size="sm" variant="outline">
                      {v.id}
                    </Tag>
                    <Heading level={3} data-size="xs">
                      {v.title}
                    </Heading>
                    <Paragraph data-size="sm">{v.description}</Paragraph>
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

const DEVICES = {
  // 320 px er bredden WCAG 1.4.10 (Reflow) tester ved
  wcag: { label: "WCAG", frame: "phone", width: 320, height: 680 },
  // 390 × 844 tilsvarer nyere iPhone (Pixel er 393)
  mobil: { label: "Mobil", frame: "phone", width: 390, height: 844 },
  nettbrett: { label: "Nettbrett", frame: "browser", width: 768, height: 1024 },
  full: { label: "Full bredde", frame: "browser", height: 900 },
};

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

const readDevice = () => {
  try {
    return localStorage.getItem("device") || "mobil";
  } catch {
    return "mobil";
  }
};

function Prototype({ variant }) {
  return (
    <section className="article" aria-labelledby="prototype-heading">
      <Paragraph data-size="sm" className="eyebrow">
        {variant.context.eyebrow}
      </Paragraph>
      <Heading id="prototype-heading" level={2} data-size="lg">
        {variant.context.heading}
      </Heading>
      <Paragraph>{variant.context.intro}</Paragraph>
      <variant.Component />
      <Heading level={2} data-size="sm">
        Mer innhold
      </Heading>
      <Paragraph>
        Fylltekst under eksempelet, slik at du kan rulle forbi den og se hvordan
        den oppfører seg i en vanlig side.
      </Paragraph>
    </section>
  );
}

function VariantPage({ variant }) {
  const wide = useWideScreen();
  const [device, setDevice] = useState(readDevice);
  const choose = (d) => {
    setDevice(d);
    try {
      localStorage.setItem("device", d);
    } catch {}
  };
  const size = DEVICES[device] ?? DEVICES.mobil;
  const Frame = size.frame === "phone" ? PhoneFrame : BrowserFrame;

  const i = variants.indexOf(variant);
  const prev = variants[i - 1];
  const next = variants[i + 1];

  return (
    <main className="page page--variant">
      <nav className="variant-nav" aria-label="Varianter">
        <Link href="#/">
          <ArrowLeftIcon aria-hidden />
          Alle varianter
        </Link>
        <span className="variant-nav__steps">
          {prev && <Link href={`#/${prev.id}`}>← {prev.title}</Link>}
          {next && <Link href={`#/${next.id}`}>{next.title} →</Link>}
        </span>
      </nav>
      <div className="variant-heading">
        <Tag data-size="sm">{variant.id}</Tag>
        <Heading level={1} data-size="sm">
          {variant.title}
        </Heading>
      </div>
      <Paragraph data-size="sm">{variant.description}</Paragraph>
      <Paragraph data-size="xs" className="eyebrow">
        Story: <code>{variant.story}</code>
      </Paragraph>

      {wide && (
        <ToggleGroup
          data-size="sm"
          value={device}
          onChange={choose}
          aria-label="Visning"
        >
          {Object.entries(DEVICES).map(([key, d]) => (
            <ToggleGroup.Item key={key} value={key}>
              {d.label}
              {d.width ? ` (${d.width})` : ""}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      )}

      {wide ? (
        <Frame
          width={size.width}
          height={size.height}
          label={`Prototype ${variant.id}, ${size.label.toLowerCase()}`}
        >
          <div className="frame__content">
            <Prototype variant={variant} />
          </div>
        </Frame>
      ) : (
        <Prototype variant={variant} />
      )}
    </main>
  );
}

export default function App() {
  const hash = useHash();
  const variant = variants.find((v) => v.id === hash);
  return variant ? <VariantPage variant={variant} /> : <Overview />;
}
