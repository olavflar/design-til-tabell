import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme";
import "../index.css";
import "../artikkel/artikkel.css";
import "./tabell.css";
import Tabell from "./Tabell.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Tabell />
  </StrictMode>,
);
