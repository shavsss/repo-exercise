import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "./styles.css";
import "./eng.css";
import { App } from "./App";

document.documentElement.lang = "he";
document.documentElement.dir = "rtl";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
