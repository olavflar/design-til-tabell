import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Alle sidene bygges, med relative stier, så dist/ virker uansett hvor den legges ut
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        artikkel: "artikkel.html",
        tabell: "tabell.html",
        liste: "liste.html",
        kort: "kort.html",
      },
    },
  },
});
