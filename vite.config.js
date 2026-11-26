import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Alle sidene bygges, med relative stier, så dist/ virker uansett hvor den legges ut
export default defineConfig({
  base: "./",
  plugins: [react()],
  // Tidspunktet siden ble bygd, så forslaget kan vise nøyaktig når det sist ble oppdatert
  define: { __BUILD_TIME__: JSON.stringify(new Date().toISOString()) },
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        artikkel: "artikkel.html",
        tabell: "tabell.html",
        liste: "liste.html",
        kort: "kort.html",
        forslag: "forslag.html",
        filter: "filter.html",
      },
    },
  },
});
