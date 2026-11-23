/** Faner mellom hi-fi-sidene. Hver fane er en egen side, så dette er lenker med aria-current. */
const PAGES = [
  { href: "tabell.html", label: "Tabell" },
  { href: "liste.html", label: "Liste" },
  { href: "kort.html", label: "Kort" },
  { href: "forslag.html", label: "Forslag" },
];

export default function HifiNav({ current }) {
  return (
    <nav aria-label="Hi-fi-prototyper" className="hifi-nav">
      <ul>
        {PAGES.map((p) => (
          <li key={p.href}>
            <a href={p.href} aria-current={p.label === current ? "page" : undefined}>{p.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
