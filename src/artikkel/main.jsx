import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme";
import "../index.css";
import "./artikkel.css";
import Artikkel from "./Artikkel.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Artikkel />
  </StrictMode>,
);
