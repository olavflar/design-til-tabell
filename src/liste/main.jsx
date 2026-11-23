import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme";
import "../index.css";
import "../artikkel/artikkel.css";
import "./liste.css";
import Liste from "./Liste.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Liste />
  </StrictMode>,
);
