import { useEffect, useRef } from "react";
import { BrowserFrame, PhoneFrame } from "../components/DeviceFrame.jsx";
import { CASES, byNewest, Intro, CaseTable, Small } from "../components/cases.jsx";
import { SearchableCases, DetailsList } from "../liste/Liste.jsx";
import { Costs } from "../kort/Kort.jsx";
import { StatTable, SmallScreen, Intro as ElbilIntro, rows as elbilRows } from "../tabell/Tabell.jsx";
import { CompareStudies, AirQuality, BulkCases, UnknownTask } from "../forslag/eksempler.jsx";

/* Viser ett eksempel fra forslaget i én bredde, så scripts/miro-bilder.mjs kan ta bilde av det.
   Adresse: miro.html?eks=finne&bredde=390. Siden bygges ikke og legges ikke ut. */

const sorted = [...CASES].sort(byNewest);

export const EXAMPLES = {
  ukjent: { large: () => <UnknownTask />, small: () => <UnknownTask /> },
  finne: { large: (id) => <SearchableCases id={id} large />, small: (id) => <SearchableCases id={id} /> },
  fa: { large: () => <CompareStudies initial={["uib", "uio", "hvl", "ntnu"]} />, small: () => <CompareStudies /> },
  mange: {
    large: (id) => (
      <div className="frame__content hifi">
        <ElbilIntro id={id} />
        <StatTable data={elbilRows} captionId={id} />
      </div>
    ),
    small: (id) => <SmallScreen id={id} />,
  },
  detaljer: {
    large: (id) => (
      <div className="frame__content hifi">
        <Intro id={id} total={CASES.length} />
        <CaseTable items={sorted} labelledBy={id} />
      </div>
    ),
    small: (id) => <Small id={id}><DetailsList items={sorted} labelledBy={id} /></Small>,
  },
  avvik: { large: () => <AirQuality large />, small: () => <AirQuality /> },
  endre: { large: () => <Costs large />, small: () => <Costs /> },
  flere: { large: () => <BulkCases large />, small: () => <BulkCases /> },
};

export default function Miro() {
  const params = new URLSearchParams(location.search);
  const eks = EXAMPLES[params.get("eks")];
  const width = Number(params.get("bredde")) || 390;
  const ref = useRef(null);

  // Rammen får høyden til innholdet, så hele eksempelet kommer med på bildet
  useEffect(() => {
    const t = setTimeout(() => {
      const frame = ref.current?.querySelector(".frame");
      const screen = frame?.querySelector(".frame__screen");
      if (!frame || !screen) return;
      // Gjør rammen lav først, så scrollHeight måler innholdet og ikke rammen
      frame.style.setProperty("--frame-height", "300px");
      const chrome = frame.offsetHeight - screen.clientHeight;
      frame.style.setProperty("--frame-height", `${chrome + screen.scrollHeight}px`);
      document.body.dataset.ferdig = "ja";
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (!eks) return <p>Ukjent eksempel. Bruk for eksempel ?eks=finne&amp;bredde=390.</p>;
  const phone = width < 600;
  const id = `miro-${params.get("eks")}`;
  return (
    <div ref={ref} style={{ padding: "var(--ds-size-6)", width: `${width}px` }} className="miro-shot">
      {phone
        ? <PhoneFrame width={width} height={5000} label="Liten skjerm">{eks.small(id)}</PhoneFrame>
        : <BrowserFrame width={width} height={5000} label="Stor skjerm">{eks.large(id)}</BrowserFrame>}
    </div>
  );
}
