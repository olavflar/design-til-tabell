# Design til tabell

Prototyper for mønsteret «Strukturert informasjon på små skjermer», som en tverretatlig arbeidsgruppe lager for
[Designsystemet](https://designsystemet.no) høsten 2026. Prototypene er innspill til et offisielt mønster, så de skal
vise god praksis.

## Kjør prosjektet

```sh
npm install
npm run dev     # http://localhost:5173
npm run build   # bygger til dist/
```

`node_modules`, `dist` og `.DS_Store` skal ikke inn i Git.

## Deling og kommentarer

Prototypen ligger ute på GitHub Pages. `.github/workflows/pages.yml` bygger og publiserer den hver gang noe havner
på `main`, også når en pull request blir merget. Gruppen kommenterer i Miro, med bilder av eksemplene og lenke til
prototypen.

## Struktur

- `src/patterns/structured-data.stories.tsx` har alle eksemplene. Hvert eksempel er en eksportert story.
- `src/variants.js` deler eksemplene inn etter de tre brukerscenarioene i artikkelen. Hvert scenario har tekst om
  kontekst og behov, eksempler og anbefalinger.
- `src/App.jsx` viser hvert scenario med teksten først og så eksemplene i faner. Hvert eksempel vises på mobil (390 px),
  nettbrett (768 px) og desktop, med en bryter for å vise én av dem.

## Regler

- **Bruk bare Designsystemet**, altså `@digdir/designsystemet-react`, tokens (`--ds-…`) og CSS-klassene deres.
  - Inline-stiler er bare til layout: flex, grid og avstand med `--ds-size`-tokens.
  - Finnes det ikke noe i Designsystemet, skal det sies tydelig, for eksempel i beskrivelsen av eksempelet, og ikke
    lages for hånd.
- **Følg mønstrene og retningslinjene på designsystemet.no.** Les retningslinjene for komponenten før du bruker den.
  Kilden ligger i `apps/www/app/content` i [digdir/designsystemet](https://github.com/digdir/designsystemet). Viktige
  regler vi har fulgt:
  - Tabeller har alltid `caption`, tall er høyrejustert, celler slås ikke sammen, og hver celle har bare ett
    interaktivt element. Flere handlinger legges i en `Dropdown`.
  - Filtre med få valg er `Chip` i en `Fieldset`. `Select` brukes først fra 7 valg.
  - Ikke bruk deaktiverte tilstander.
  - Flere tagger sammen ligger i en liste med et tilgjengelig navn.
  - Endringer som søk, filter og sortering gir, meldes til skjermlesere med `role="status"`.
- **Test i 320, 390 og 768 px og på desktop** før du viser resultatet.
- **Skriv norsk bokmål** i grensesnittet og i kommentarene. Klokkeslett skrives «kl. 09.14».
- **Commit lokalt, men push bare når brukeren ber om det.**
