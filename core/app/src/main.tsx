import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "./styles.css";
import "./reading.css";
import "./reading";
import { installSounds } from "./sound";
import "./summaries/summaries.css";
import "./labtabs/labtabs.css";
import { App } from "./App";
import { SummaryApp } from "./summaries/SummaryApp";
import { copyWithMath } from "./summaries/rich";

installSounds();

document.documentElement.lang = "he";
document.documentElement.dir = "rtl";
// equations copied from a lesson reach the summaries as equations, not as their drawn letters
document.addEventListener("copy", copyWithMath);

/** The lessons, or with #summary after the address the summaries notebook (in its own window). */
function Root() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash === "#summary" ? <SummaryApp lab="lanchester" name="לנצ'סטר" /> : <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
