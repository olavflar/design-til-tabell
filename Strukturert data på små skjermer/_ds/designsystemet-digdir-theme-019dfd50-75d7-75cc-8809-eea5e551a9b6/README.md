# Designsystemet (Digdir-theme) — Design System

**Digdir's design system.** It builds on **Designsystemet** (designsystemet.no,
repo: https://github.com/digdir/designsystemet) — the shared toolbox of UI
components, design tokens, and patterns for Norwegian public-sector digital
services — with **Digdir's own theme** on top.

**What comes from where:**
- **Components, component CSS, type scale, sizing, radii, shadows** → Designsystemet (`digdir/designsystemet`).
- **Colour theme (accent, neutral, brand1–3, status colours)** → Digdir's theme from **Varde**: https://github.com/digdir/varde/tree/main (built file: `design-tokens-build/digdir.css`). Brand1 = red `#F45F63`, brand2 = yellow `#E5AA20`, brand3 = blue `#1E98F5`.
- **Logo and brand profile** → Digdir's profile guide: https://profilveileder.digdir.no/

When updating tokens, pull colours from Varde, not from Designsystemet's default theme.

## Guidelines — read on designsystemet.no

This project holds tokens, CSS, and assets only. **Usage guidelines for every component and pattern live on designsystemet.no** — always check there before using or combining components:

- **Components** (usage, do/don't, accessibility, props): https://designsystemet.no/no/components
- **Patterns** (forms, error handling, navigation, etc.): https://designsystemet.no/no/patterns
- **Best practice** (content, accessibility, UX writing): https://designsystemet.no/no/best-practices
- **Get started / fundamentals** (tokens, theming, size modes): https://designsystemet.no/no/fundamentals
- English versions: replace `/no/` with `/en/`.

## Sources

- **GitHub (base system):** https://github.com/digdir/designsystemet (component CSS: `@digdir/designsystemet-css` v1.23.0)
- **GitHub (Digdir theme):** https://github.com/digdir/varde/tree/main — `design-tokens-build/digdir.css` (built tokens v1.18.0)
- **Docs site:** https://designsystemet.no/
- **Storybook:** https://storybook.designsystemet.no/
- **Theme builder:** https://theme.designsystemet.no/
- **Digdir profile guide:** https://profilveileder.digdir.no/
- **NPM:**
  - `@digdir/designsystemet-css` — the CSS in `theme/components/`
  - `@digdir/designsystemet-react` — React components (not vendored here)
  - `@digdir/designsystemet-web` — framework-agnostic web package (not vendored here) — https://www.npmjs.com/package/@digdir/designsystemet-web
  - `@digdir/designsystemet` — CLI

## Index

- `styles.css` — single entry stylesheet; imports everything below.
- `colors_and_type.css` — short-alias CSS vars (--fg1, --accent, --h1, …) on top of the canonical `--ds-*` tokens, plus Inter `@font-face`.
- `theme/digdir.css` — **the canonical token file**: Digdir theme from Varde, unmodified (size modes, type scale, light/dark colour schemes, radii, shadows, all colour roles incl. brand1–3 and Digdir neutral).
- `theme/components/*.css` — all component CSS from `@digdir/designsystemet-css` v1.23.0, unmodified except `/* @kind */` annotations; cascade layers `ds.theme` → `ds.base` → `ds.components`, so the Digdir theme drives every component.
- `fonts/` — self-hosted Inter.
- `assets/logos/` — official Digdir logo (emblem + wordmark, from digdir.no `logo_sogn.svg`): `digdir-logo.svg` (emblem "mørk rød" `#C2132C`, wordmark "blåsvart" `#1E2B3C`) and `digdir-logo-white.svg` (all white, for dark backgrounds). The old Designsystemet wordmark + favicon are kept for reference.
- `assets/avatars/`, `assets/illustrations/` — assets inherited from designsystemet.no; not part of Digdir's profile.
- `preview/` — design-system tab cards.
- `SKILL.md` — Agent-Skill front-matter so this folder is portable to Claude Code.

---

## Logo for enheter

Digdir-logoen = emblem («D») + navnetrekk i blåsvart `#1E2B3C`. For enheter velges emblemfarge ut fra spørsmålet **«Hvor tilhører enheten?»**:

- **A — Naturlig underlagt Digdir:** emblem i «mørk rød» `#C2132C` + «Digdir». → `assets/logos/digdir-logo.svg`, `emblem-digdir.svg`
- **B — Fellesløsning** (f.eks. ID-porten): emblem i «mørk blå» `#0062B8` + løsningens navn. → `emblem-felleslosning.svg`
- **C — Annen merkevare** (f.eks. StimuLab): emblem i blåsvart `#1E2B3C` + merkevarens navn. → `emblem-merkevare.svg`

Emblemfargene brukes **kun** på emblemene — aldri i UI. Logooriginalene skal ikke endres; hent ferdige navnetrekk for enheter fra Digdir (https://profilveileder.digdir.no/visuell-profil/logo/108), ikke sett dem selv.

## Font

**Inter only** — no other families, no monospace. Weights 400 / 500 / 600.
Self-hosted in `fonts/` (from https://github.com/rsms/inter/releases/tag/v3.19). For production hosting use Altinn CDN:

```html
<link rel="stylesheet" href="https://altinncdn.no/fonts/inter/v4.1/inter.css" integrity="sha384-OcHzc/By/OPw9uJREawUCjP2inbOGKtKb4A/I2iXxmknUfog2H8Adx71tWVZRscD" crossorigin="anonymous">
```

Always enable the tailed lowercase "l" so it can't be confused with capital "I":

```css
font-family: "Inter", sans-serif;
font-feature-settings: "cv05" 1; /* lowercase l with tail */
```

`colors_and_type.css` sets this globally on `html, body` via the `--font-features` token (form controls inherit it).

## Writing

Sentence case everywhere — headings, buttons, nav items. Never Title Case.
Norwegian (Bokmål) is primary, English second. Plain, calm, factual
public-sector language; no hyperbole. No emoji in UI. For content guidance see
https://designsystemet.no/no/best-practices.

---

## Visual foundations

**Type.** 10-step font-size scale (12 → 60px at medium mode) and **three size
modes** (sm/md/lg) that scale every component via `--ds-size-mode-font-size`.
Body default is 18px (md). Headings use `data-size='2xs'…'2xl'` independent of
element level. Negative letter-spacing on large headings; line-height 1.3 on
headings, 1.5 on body, 1.7 on long-form.

**Color.** Semantic roles — `accent`, `neutral`, `brand1`, `brand2`, `brand3`,
plus status (`info`, `success`, `warning`, `danger`). Each role has **the same
sub-tokens**: `background-default/tinted`, `surface-default/tinted/hover/active`,
`border-subtle/default/strong`, `text-subtle/default`, `base-default/hover/active`,
plus `base-contrast-subtle/default`. Switch role on any subtree with
`data-color="brand1"` etc. Accent is **#0062BA (blue)**; brand1 red
**#F45F63**, brand2 yellow **#E5AA20**, brand3 blue **#1E98F5** — all three
take **black** text on base. Page backgrounds are white in light mode; tinted
backgrounds are for sections adjacent to the page background.

**Hover / press / focus.**
- **Hover:** background swaps to `--ds-color-{role}-base-hover` on filled buttons, `--surface-hover` on tertiary. Only on `(hover: hover) and (pointer: fine)`.
- **Active:** `--ds-color-{role}-base-active`.
- **Disabled:** `opacity: 30%`, `cursor: not-allowed`. No colour change.
- **Focus:** 3px solid outline (`--ds-color-focus-outer`) **plus** 3px inner box-shadow ring (`--ds-color-focus-inner`), offset 3px. Defined in `base.css` as `.ds-focus--visible`. **Never remove or replace this.**
- Colour swaps are instant; the only built-in animation is `ds-fade-in` (0.15s) on floating elements.

**Borders.** Default 1px; 3px is focus-only. Cards use `border-subtle`; inputs
use `border-default`.

**Shadows.** Five steps (xs → xl), stacked rgba-black. No inner, coloured, or
neumorphic shadows.

**Corner radii.** Conservative: `sm` ~2px, `md`/`default` 4px (buttons,
inputs, alerts), `lg` ~8px, `xl` ~12px, `full` for pills and avatars.

**Layout.** Spacing tokens `--ds-size-1…30` (4px units at 18px base). Keep body
copy to a readable measure (~600–700px).

**Transparency / blur.** None — fully opaque, no backdrop-filter.

---

## Iconography

[`@navikt/aksel-icons`](https://aksel.nav.no/ikoner) — outline, 24×24,
1.5px stroke. All icons are SVG. Never emoji or Unicode characters as icons.

---

## Components in the system

35+ components upstream: `alert`, `avatar`, `avatar-stack`, `badge`,
`breadcrumbs`, `button`, `card`, `chip`, `combobox`, `details`, `dialog`,
`divider`, `dropdown`, `error-summary`, `field`, `fieldset`, `heading`,
`input`, `label`, `link`, `list`, `pagination`, `paragraph`, `popover`,
`search`, `skeleton`, `skip-link`, `spinner`, `suggestion`, `tabs`, `table`,
`tag`, `toggle-group`, `tooltip`, `validation-message`. All of them are vendored in
`theme/components/` (v1.23.0) and previewed in the «UI components» cards.
The Digdir theme sits on top via `theme/digdir.css`. To update: replace the
files from `https://unpkg.com/@digdir/designsystemet-css@<version>/dist/src/`
and `theme/digdir.css` from Varde.

If a component does **not** exist in the system, flag it as missing rather
than design a custom one.
