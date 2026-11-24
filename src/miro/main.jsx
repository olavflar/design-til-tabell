import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme";
import "../index.css";
import "../artikkel/artikkel.css";
import "../tabell/tabell.css";
import "../liste/liste.css";
import "../kort/kort.css";
import "../forslag/forslag.css";
import "./miro.css";
import Miro from "./Miro.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Miro />
  </StrictMode>,
);
