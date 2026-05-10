// Lazy KaTeX wrapper. Loads from CDN once and exposes renderKatex(latex, host, display).

const KATEX_JS  = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
const KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";

let readyPromise = null;

function ensureLoaded() {
  if (readyPromise) return readyPromise;
  readyPromise = new Promise((resolve, reject) => {
    if (window.katex) return resolve(window.katex);
    if (!document.querySelector(`link[href="${KATEX_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = KATEX_CSS;
      document.head.appendChild(link);
    }
    const sc = document.createElement("script");
    sc.src = KATEX_JS;
    sc.defer = true;
    sc.onload = () => resolve(window.katex);
    sc.onerror = reject;
    document.head.appendChild(sc);
  });
  return readyPromise;
}

export function renderKatex(latex, host, display = false) {
  ensureLoaded().then((k) => {
    try {
      k.render(latex, host, { displayMode: display, throwOnError: false, output: "html" });
    } catch (err) {
      host.textContent = latex;
    }
  });
}
