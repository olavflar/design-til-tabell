import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme";
import "../index.css";
import "../artikkel/artikkel.css";
import "../liste/liste.css";
import "./filter.css";
import Filter from "./Filter.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Filter />
  </StrictMode>,
);
