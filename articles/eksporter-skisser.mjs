// Lager PNG-filer av alle skissene i skisser.js, i mappen skisser/.
// Kjør: node articles/eksporter-skisser.mjs   (krever Google Chrome)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ctx = { module: { exports: {} }, Math, String, Number };
vm.runInNewContext(fs.readFileSync(path.join(dir, 'skisser.js'), 'utf8'), ctx);
const { sketches, standalone } = ctx.module.exports;

const out = path.join(dir, 'skisser');
fs.mkdirSync(out, { recursive: true });
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const only = process.argv.slice(2);

for (const name of Object.keys(sketches)) {
  if (only.length && !only.includes(name)) continue;
  const { svg, width, height } = standalone(name, 2);
  const svgFile = path.join(out, name + '.svg');
  fs.writeFileSync(svgFile, svg);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000',
    `--window-size=${width},${height}`, '--force-device-scale-factor=2', '--virtual-time-budget=2000',
    `--screenshot=${path.join(out, name + '.png')}`, 'file://' + svgFile], { stdio: 'ignore' });
  fs.unlinkSync(svgFile);
  console.log(`${name}.png  ${width * 2}×${height * 2}`);
}
