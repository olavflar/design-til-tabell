import { useId, useState } from "react";
import { Button, Tabs } from "@digdir/designsystemet-react";
import { CodeIcon, FilesIcon, CheckmarkIcon } from "@navikt/aksel-icons";

/* Kode under hvert eksempel, slik designsystemet.no viser det: en knapp som
   viser og skjuler koden, faner når det er flere filer, og en kopier-knapp.
   Koden hentes fra kildefilene med Vite sin ?raw, så den er alltid lik det
   som vises i eksempelet. */

/**
 * Henter én eller flere toppnivå-definisjoner fra en kildefil, med
 * kommentaren rett over. En definisjon slutter ved første linje som bare er
 * «}», «];» eller «);».
 */
export function extract(src, ...names) {
  return names
    .map((name) => {
      const m = new RegExp(`^(export )?(default )?(function ${name}\\b|const ${name}\\b)`, "m").exec(src);
      if (!m) return `// Fant ikke ${name}`;
      let start = m.index;
      // Ta med kommentaren rett over, men bare hvis det ikke er en tom linje mellom
      const before = src.slice(0, start);
      const open = before.lastIndexOf("/*");
      if (open >= 0 && /^\/\*[\s\S]*?\*\/[ \t]*\n$/.test(before.slice(open)) && before.slice(open).indexOf("*/") === before.slice(open).lastIndexOf("*/"))
        start = open;
      const end = /\n(\}|\];|\);)\n/.exec(src.slice(m.index));
      return src.slice(start, end ? m.index + end.index + end[0].length - 1 : undefined).trim();
    })
    .join("\n\n");
}

/** Henter CSS fra og med en kommentar som starter med `from`, til neste med `to` (eller filslutt) */
export function cssBetween(src, from, to) {
  const start = src.indexOf(`/* ${from}`);
  if (start < 0) return `/* Fant ikke ${from} */`;
  const end = to ? src.indexOf(`/* ${to}`, start + 1) : -1;
  return src.slice(start, end < 0 ? undefined : end).trim();
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="tertiary"
      data-size="sm"
      className="code__copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* Utklippstavlen kan være blokkert, for eksempel i en innebygd ramme */
        }
      }}
    >
      {copied ? <CheckmarkIcon aria-hidden /> : <FilesIcon aria-hidden />}
      {copied ? "Kopiert" : "Kopier"}
    </Button>
  );
}

function Code({ text, label }) {
  return (
    <div className="code__block">
      <CopyButton text={text} />
      <pre tabIndex={0} aria-label={label}><code>{text}</code></pre>
    </div>
  );
}

/**
 * `snippets` er en liste med { label, code }. Én snippet vises rett, flere
 * vises i faner.
 */
export default function CodeExample({ snippets }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(snippets[0].label);

  return (
    <div className="code">
      <Button
        variant="tertiary"
        data-size="sm"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <CodeIcon aria-hidden />
        {open ? "Skjul kode" : "Vis kode"}
      </Button>
      <div id={id} hidden={!open}>
        {open &&
          (snippets.length === 1 ? (
            <Code text={snippets[0].code} label={snippets[0].label} />
          ) : (
            <Tabs value={tab} onChange={setTab} data-size="sm">
              <Tabs.List>
                {snippets.map((s) => (
                  <Tabs.Tab key={s.label} value={s.label}>{s.label}</Tabs.Tab>
                ))}
              </Tabs.List>
              {snippets.map((s) => (
                <Tabs.Panel key={s.label} value={s.label}>
                  <Code text={s.code} label={s.label} />
                </Tabs.Panel>
              ))}
            </Tabs>
          ))}
      </div>
    </div>
  );
}
