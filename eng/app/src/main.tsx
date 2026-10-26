import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "./styles.css";
import "./eng.css";
import "./reading.css";
import "./reading";
import "./summaries/summaries.css";
import { App } from "./App";
import { SummaryApp } from "./summaries/SummaryApp";

document.documentElement.lang = "he";
document.documentElement.dir = "rtl";

/** The lessons, or with #summary after the address the summaries notebook (in its own window). */
function Root() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash === "#summary" ? <SummaryApp lab="gilua" name="גילואה" /> : <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
