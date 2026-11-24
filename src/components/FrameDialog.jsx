import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Dialog, Heading } from "@digdir/designsystemet-react";
import { useFrameLayer } from "./DeviceFrame.jsx";

/**
 * Dialog som åpnes inne i rammen i prototypen (mobil eller nettleser), ikke
 * over hele siden. I en ekte løsning bruker du en vanlig modal Dialog fra
 * Designsystemet. Mens dialogen er åpen, er skjermen bak inert, Esc og klikk
 * utenfor lukker, og fokus går tilbake til knappen i returnFocusRef (eller dit
 * det var da dialogen ble åpnet). Safari gir ikke knapper fokus ved klikk, så
 * send med knappen når du kan.
 * Nederst på smal skjerm, midt på bred skjerm.
 */
export default function FrameDialog({ open, onClose, title, returnFocusRef, children }) {
  const layer = useFrameLayer();
  const headingId = useId();
  const dialogRef = useRef(null);
  // Siste onClose, så effekten ikke kjøres på nytt (og flytter fokus) hver gang forelderen tegnes
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open || !layer) return;
    const returnTo = document.activeElement;
    const screen = layer.parentElement.querySelector(".frame__screen");
    screen.inert = true;
    // Fokus til første felt, eller første knapp hvis dialogen ikke har felt
    const el = dialogRef.current;
    (el?.querySelector("input, select, textarea") ?? el?.querySelector("button"))?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      screen.inert = false;
      document.removeEventListener("keydown", onKey);
      const target = returnFocusRef?.current ?? returnTo;
      if (target?.isConnected) target.focus();
    };
  }, [open, layer]);

  if (!open || !layer) return null;
  const narrow = layer.clientWidth < 600;

  return createPortal(
    <>
      <div className="frame__scrim" onClick={onClose} />
      <Dialog
        ref={dialogRef}
        open
        modal={false}
        closeButton="Lukk"
        placement={narrow ? "bottom" : "center"}
        aria-labelledby={headingId}
        aria-modal="true"
        onClose={onClose}
      >
        <Dialog.Block>
          <Heading level={2} data-size="xs" id={headingId}>{title}</Heading>
        </Dialog.Block>
        <Dialog.Block>{children}</Dialog.Block>
      </Dialog>
    </>,
    layer,
  );
}
