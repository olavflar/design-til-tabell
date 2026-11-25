// Skriver ut alle sidene i prototypen som PDF, til Miro.
// Kjør: npm run pdf-sider   (bruker den publiserte siden)
//   eller: PDF_URL=http://localhost:5173/ npm run pdf-sider   (bruker utviklingsserveren)
// Krever Google Chrome. PDF-ene havner i miro-bilder/pdf/ (ligger ikke i Git).
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const BASE = process.env.PDF_URL ?? "https://olavflar.github.io/design-til-tabell/";
const OUT = path.resolve("miro-bilder", "pdf");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const WIDTH = 1440; // desktopbredde, så sidene vises slik de gjør på en vanlig skjerm

const PAGES = [
  ["forslag.html", "1-forslag-til-artikkel"],
  ["index.html", "2-oversikt"],
  ["artikkel.html", "3-artikkel"],
  ["tabell.html", "4-tabell"],
  ["liste.html", "5-liste"],
  ["kort.html", "6-kort"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(OUT, { recursive: true });
const profile = fs.mkdtempSync(path.join(OUT, ".chrome-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--hide-scrollbars", "--force-color-profile=srgb", "about:blank"], { stdio: "ignore" });

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    target = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json()).then((l) => l.find((t) => t.type === "page")).catch(() => null);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let next = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++next;
    pending.set(id, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: 900, deviceScaleFactor: 1, mobile: false });
  // Skjermutseendet, ikke utskriftsstilen, og lyst tema
  await send("Emulation.setEmulatedMedia", { media: "screen", features: [{ name: "prefers-color-scheme", value: "light" }] });

  for (const [page, name] of PAGES) {
    await send("Page.navigate", { url: new URL(page, BASE).href });
    for (let i = 0; i < 50 && (await evaluate("document.readyState")) !== "complete"; i++) await sleep(200);
    await evaluate("document.fonts.ready.then(() => true)");
    await sleep(1500);
    // Rammer og eksempler deles ikke over to sider, og overskrifter blir ikke stående alene nederst
    await evaluate(`(() => {
      const s = document.createElement("style");
      s.textContent = ".frame, .examples figure, .examples > .ds-paragraph, .ds-card, .ds-table tr { break-inside: avoid; } h1, h2, h3, h4 { break-after: avoid; }";
      document.head.appendChild(s);
      return true;
    })()`);
    await sleep(300);
    const { data } = await send("Page.printToPDF", {
      printBackground: true,
      paperWidth: WIDTH / 96,
      paperHeight: (WIDTH * 1.414) / 96, // samme forhold som A4, i desktopbredde
      marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
      preferCSSPageSize: false,
    });
    const file = path.join(OUT, `${name}.pdf`);
    fs.writeFileSync(file, Buffer.from(data, "base64"));
    console.log(`${name}.pdf  ${(fs.statSync(file).size / 1e6).toFixed(1)} MB`);
  }
  ws.close();
} finally {
  chrome.kill();
  fs.rmSync(profile, { recursive: true, force: true });
}
