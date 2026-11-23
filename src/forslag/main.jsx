import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme";
import "../index.css";
import "../artikkel/artikkel.css";
import "../tabell/tabell.css";
import "../liste/liste.css";
import "../kort/kort.css";
import "./forslag.css";
import Forslag from "./Forslag.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Forslag />
  </StrictMode>,
);
