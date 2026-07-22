// Generic step animator for course / exercise correction pages.
// A "presentation" is a list of chapters. Each chapter has a list of steps.
// A step has a title, a note, optional math lines, an optional figure
// builder, and optional sub-explanations for surprising transformations.
// Theme-agnostic: emits class .presentation, themes style it via shared
// styles/presentation.css.

import { renderKatex } from "./katex-loader.js";

export function mountPresentation(rootEl, presentation) {
  rootEl.classList.add("presentation");
  rootEl.innerHTML = `
    <div class="pres-chapter-row" role="tablist" aria-label="Chapters"></div>
    <div class="pres-stage">
      <aside class="pres-side" aria-label="Explanation">
        <div class="pres-step-pos"></div>
        <div class="pres-roadmap-mount"></div>
        <h3 class="pres-step-title"></h3>
        <div class="pres-step-note"></div>
        <div class="pres-step-whystep"></div>
        <div class="pres-step-substeps"></div>
      </aside>
      <section class="pres-main">
        <div class="pres-figure"></div>
        <div class="pres-math"></div>
      </section>
    </div>
    <div class="pres-controls">
      <button class="btn btn-ghost" data-action="prev" type="button">← Previous</button>
      <button class="btn btn-ghost" data-action="play" type="button">▶ Autoplay</button>
      <button class="btn btn-accent" data-action="next" type="button">Next →</button>
      <span class="pres-progress" aria-live="polite"></span>
    </div>
  `;

  const chapterRow = rootEl.querySelector(".pres-chapter-row");
  const titleEl    = rootEl.querySelector(".pres-step-title");
  const noteEl     = rootEl.querySelector(".pres-step-note");
  const whyEl      = rootEl.querySelector(".pres-step-whystep");
  const subEl      = rootEl.querySelector(".pres-step-substeps");
  const figureEl   = rootEl.querySelector(".pres-figure");
  const mathEl     = rootEl.querySelector(".pres-math");
  const posEl      = rootEl.querySelector(".pres-step-pos");
  const roadmapEl  = rootEl.querySelector(".pres-roadmap-mount");
  const progEl     = rootEl.querySelector(".pres-progress");
  const prevBtn    = rootEl.querySelector("[data-action=prev]");
  const nextBtn    = rootEl.querySelector("[data-action=next]");
  const playBtn    = rootEl.querySelector("[data-action=play]");

  let chapterIdx = 0;
  let stepIdx = 0;
  let timer = null;

  function chapter() { return presentation.chapters[chapterIdx]; }
  function step()    { return chapter().steps[stepIdx]; }

  function renderChapterTabs() {
    chapterRow.innerHTML = "";
    presentation.chapters.forEach((ch, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pres-chapter" + (i === chapterIdx ? " active" : "");
      btn.innerHTML = `<span class="pres-chapter-num">${i + 1}</span><span>${ch.label}</span>`;
      btn.addEventListener("click", () => goToChapter(i));
      chapterRow.appendChild(btn);
    });
  }

  function renderStep() {
    const s = step();
    const ch = chapter();
    titleEl.textContent = s.title || "";
    noteEl.innerHTML = s.note || "";
    subEl.innerHTML = "";
    whyEl.innerHTML = "";
    roadmapEl.innerHTML = "";
    posEl.textContent = `${ch.label} · Step ${stepIdx + 1} / ${ch.steps.length}`;
    progEl.textContent = `Chapter ${chapterIdx + 1}/${presentation.chapters.length}`;

    // Roadmap (mini route sheet) — optional
    if (s.roadmap) {
      const rm = document.createElement("div");
      rm.className = "pres-roadmap";
      const q = document.createElement("div");
      q.className = "pres-roadmap-question";
      q.textContent = s.roadmap.question || "";
      rm.appendChild(q);
      const ol = document.createElement("ol");
      ol.className = "pres-roadmap-stages";
      (s.roadmap.stages || []).forEach((stage, i) => {
        const li = document.createElement("li");
        const cls = i < s.roadmap.current ? "done"
                  : i === s.roadmap.current ? "current"
                  : "pending";
        li.className = `pres-roadmap-stage ${cls}`;
        const dot = i < s.roadmap.current ? "✓"
                  : i === s.roadmap.current ? "▶"
                  : "○";
        li.innerHTML = `<span class="pres-roadmap-dot">${dot}</span><span class="pres-roadmap-text">${stage}</span>`;
        ol.appendChild(li);
      });
      rm.appendChild(ol);
      if (s.roadmap.completedNote) {
        const cn = document.createElement("div");
        cn.className = "pres-roadmap-completed";
        cn.innerHTML = s.roadmap.completedNote;
        rm.appendChild(cn);
      }
      roadmapEl.appendChild(rm);
    }

    // whyStep — strategic-why panel separate from math-why subSteps
    if (s.whyStep) {
      const det = document.createElement("details");
      det.className = "pres-whystep-panel";
      if (s.whyStep.openByDefault) det.open = true;
      const sum = document.createElement("summary");
      sum.textContent = s.whyStep.summary || "Reminder — why this step?";
      det.appendChild(sum);
      const body = document.createElement("div");
      body.className = "pres-whystep-body";
      body.innerHTML = s.whyStep.body || "";
      det.appendChild(body);
      if (s.whyStep.math && s.whyStep.math.length) {
        s.whyStep.math.forEach((m) => {
          const md = document.createElement("div");
          md.className = "pres-whystep-math";
          det.appendChild(md);
          renderKatex(m, md, true);
        });
      }
      whyEl.appendChild(det);
    }

    // Math
    mathEl.innerHTML = "";
    (s.math || []).forEach((line, idx) => {
      const div = document.createElement("div");
      div.className = "pres-math-line";
      if (s.highlightLine === idx) div.classList.add("highlight");
      mathEl.appendChild(div);
      renderKatex(line, div, true);
    });

    // Sub-steps (toggleable "Why?" explanations)
    if (s.subSteps && s.subSteps.length) {
      const det = document.createElement("details");
      det.className = "pres-substeps-panel";
      const sum = document.createElement("summary");
      sum.textContent = "Why? Show the transformation in detail";
      det.appendChild(sum);
      s.subSteps.forEach((sub) => {
        const sb = document.createElement("div");
        sb.className = "pres-substep";
        sb.innerHTML = `<div class="pres-substep-text">${sub.text || ""}</div>`;
        if (sub.math) {
          sub.math.forEach((m) => {
            const md = document.createElement("div");
            md.className = "pres-substep-math";
            sb.appendChild(md);
            renderKatex(m, md, true);
          });
        }
        det.appendChild(sb);
      });
      subEl.appendChild(det);
    }

    // Figure (optional builder)
    figureEl.innerHTML = "";
    if (typeof s.figure === "function") {
      const node = s.figure();
      if (node) figureEl.appendChild(node);
    } else if (typeof ch.defaultFigure === "function" && s.useChapterFigure !== false) {
      const node = ch.defaultFigure(s);
      if (node) figureEl.appendChild(node);
    }

    // Disable buttons appropriately
    prevBtn.disabled = stepIdx === 0;
    nextBtn.disabled = stepIdx === ch.steps.length - 1;
  }

  function go(delta) {
    stopAuto();
    stepIdx = Math.max(0, Math.min(chapter().steps.length - 1, stepIdx + delta));
    renderStep();
  }

  function goToChapter(i) {
    stopAuto();
    chapterIdx = Math.max(0, Math.min(presentation.chapters.length - 1, i));
    stepIdx = 0;
    renderChapterTabs();
    renderStep();
  }

  function startAuto() {
    if (timer) return;
    playBtn.textContent = "⏸ Pause";
    playBtn.classList.add("playing");
    timer = setInterval(() => {
      if (stepIdx < chapter().steps.length - 1) {
        stepIdx++;
        renderStep();
      } else {
        stopAuto();
      }
    }, 3500);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
    playBtn.textContent = "▶ Autoplay";
    playBtn.classList.remove("playing");
  }

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  playBtn.addEventListener("click", () => (timer ? stopAuto() : startAuto()));

  document.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Escape") { stopAuto(); }
  });

  renderChapterTabs();
  renderStep();
}
