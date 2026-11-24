// Lager PNG-bilder av hvert eksempel i forslaget i 320, 390 og 768 px og på desktop, til Miro.
// Kjør: npm run dev   og så i et annet vindu:   node scripts/miro-bilder.mjs
// Krever Google Chrome. Bildene havner i miro-bilder/ (ligger ikke i Git).
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const BASE = process.env.MIRO_URL ?? "http://localhost:5173/miro.html";
const OUT = path.resolve("miro-bilder");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;

const EXAMPLES = [
  ["ukjent", "Forberedelser – ferdige visninger og alle data"],
  ["finne", "Finne én oppføring"],
  ["fa", "Sammenligne noen få alternativer"],
  ["mange", "Sammenligne mange oppføringer"],
  ["detaljer", "Detaljer bare av og til"],
  ["avvik", "Oppdage mønstre og avvik"],
  ["endre", "Endre oppføringer – én om gangen"],
  ["flere", "Endre oppføringer – flere samtidig"],
];
const WIDTHS = [[320, "mobil-320"], [390, "mobil-390"], [768, "nettbrett-768"], [1280, "desktop-1280"]];

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

  for (const [n, [eks, title]] of EXAMPLES.entries()) {
    for (const [width, label] of WIDTHS) {
      // Vinduet er bredere enn rammen, så det er plass til marg og skygge
      await send("Emulation.setDeviceMetricsOverride", { width: width + 120, height: 4000, deviceScaleFactor: 2, mobile: false });
      await send("Page.navigate", { url: `${BASE}?eks=${eks}&bredde=${width}` });
      for (let i = 0; i < 50 && (await evaluate("document.body?.dataset.ferdig")) !== "ja"; i++) await sleep(200);
      await evaluate("document.fonts.ready.then(() => true)");
      await sleep(300);
      const box = await evaluate(`(() => { const r = document.querySelector('.miro-shot').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })()`);
      const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...box, scale: 1 } });
      const file = `${String(n + 1).padStart(2, "0")}-${eks}-${label}.png`;
      fs.writeFileSync(path.join(OUT, file), Buffer.from(data, "base64"));
      console.log(`${file}  (${title})`);
    }
  }
  ws.close();
} finally {
  chrome.kill();
  fs.rmSync(profile, { recursive: true, force: true });
}
