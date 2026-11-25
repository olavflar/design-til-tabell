import {
  ArrowCirclepathIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HouseIcon,
  MenuElipsisVerticalIcon,
  PadlockLockedFillIcon,
  PlusIcon,
  StarIcon,
  XMarkIcon,
} from "@navikt/aksel-icons";

import { createContext, useContext, useState } from "react";

/** Laget over skjermen i rammen. Dialoger og andre overlegg legges her, så de fyller rammen og ikke hele siden. */
const FrameLayerContext = createContext(null);
export const useFrameLayer = () => useContext(FrameLayerContext);

function Screen({ label, children }) {
  const [layer, setLayer] = useState(null);
  return (
    <div className="frame__viewport">
      <FrameLayerContext.Provider value={layer}>
        <div className="frame__screen" role="region" aria-label={label} tabIndex={0}>
          <SiteHeader />
          {children}
        </div>
      </FrameLayerContext.Provider>
      <div className="frame__layer" ref={setLayer} />
    </div>
  );
}

/* Mal for mobil og nettleser, etter Designsystemets maler for eksempler.
   Rammen er bare pynt (aria-hidden). Selve innholdet ligger i en egen
   rulleflate, så rulling i prototypen holdes atskilt fra siden rundt. */

/* Fire ruter som sammen danner en stor rute, med smale mellomrom. Tegnet som
   vektor etter «Forbedringer høst/image 147.svg», så den er skarp i alle størrelser. */
const Logo = () => (
  <svg viewBox="0 0 24 24" width="1.4em" height="1.4em" aria-hidden>
    <g fill="currentColor">
      <path d="M12 0 17.15 5.15 12 10.3 6.85 5.15Z" />
      <path d="M5.15 6.85 10.3 12 5.15 17.15 0 12Z" />
      <path d="M18.85 6.85 24 12 18.85 17.15 13.7 12Z" />
      <path d="M12 13.7 17.15 18.85 12 24 6.85 18.85Z" />
    </g>
  </svg>
);

/** «Avsender»-headeren er en del av siden og ruller med innholdet. */
export const SiteHeader = () => (
  <header className="site-header">
    <Logo />
    <span>Avsender</span>
  </header>
);

const StatusIcons = () => (
  <svg viewBox="0 0 66 14" width="66" height="14" aria-hidden>
    <g fill="currentColor">
      {/* Signal */}
      <rect x="0" y="9" width="3" height="4" rx="0.7" />
      <rect x="4.5" y="6.5" width="3" height="6.5" rx="0.7" />
      <rect x="9" y="4" width="3" height="9" rx="0.7" />
      <rect x="13.5" y="1" width="3" height="12" rx="0.7" />
      {/* Wifi */}
      <path d="M29 12.6 26.6 10a3.4 3.4 0 0 1 4.8 0z" />
      <path d="M24.6 8a6.2 6.2 0 0 1 8.8 0l-1.3 1.4a4.4 4.4 0 0 0-6.2 0z" />
      <path d="M22.4 5.7a9.3 9.3 0 0 1 13.2 0l-1.3 1.4a7.5 7.5 0 0 0-10.6 0z" />
      {/* Batteri */}
      <rect x="40.5" y="1.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="42.5" y="3.5" width="18" height="7" rx="1.6" />
      <path d="M64 5.2v3.6a1.9 1.9 0 0 0 0-3.6z" fillOpacity="0.4" />
    </g>
  </svg>
);

export function PhoneFrame({ width, height, label, children }) {
  return (
    <div
      className="frame frame--phone"
      style={{ "--frame-width": `${width}px`, "--frame-height": `${height}px` }}
    >
      <div className="frame__statusbar" aria-hidden>
        <span>9:41</span>
        <StatusIcons />
      </div>
      <Screen label={label}>{children}</Screen>
    </div>
  );
}

export function BrowserFrame({ width, height, label, children }) {
  return (
    <div
      className="frame frame--browser"
      style={{
        "--frame-width": width ? `${width}px` : "100%",
        "--frame-height": `${height}px`,
      }}
    >
      <div className="browser-chrome" aria-hidden>
        <div className="browser-chrome__tabs">
          <span className="browser-chrome__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="browser-chrome__tab">
            designsystemet.no
            <XMarkIcon />
          </span>
          <PlusIcon className="browser-chrome__plus" />
        </div>
        <div className="browser-chrome__toolbar">
          <ArrowLeftIcon />
          <ArrowRightIcon className="browser-chrome__muted" />
          <ArrowCirclepathIcon />
          <HouseIcon />
          <span className="browser-chrome__url">
            <PadlockLockedFillIcon />
            <span>designsystemet.no</span>
            <StarIcon />
          </span>
          <span className="browser-chrome__avatar" />
          <MenuElipsisVerticalIcon />
        </div>
      </div>
      <Screen label={label}>{children}</Screen>
    </div>
  );
}
