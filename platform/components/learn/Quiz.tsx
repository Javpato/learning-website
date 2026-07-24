"use client";

// Quiz engine for the L2 Chimie tracks. Learning-first rules:
//  - unlimited retries, a Réinitialiser button, no penalty ever;
//  - feedback explains WHY (per-option <QFeedback>), never just right/wrong;
//  - the explanation (<QExplain>) can be revealed at any time, even before
//    answering — solutions are never locked;
//  - supportive wording only.
//
// MDX usage:
//   <Quiz title="Vérification rapide">
//     <QItem>
//       Prompt markdown (KaTeX ok)…
//       <QOption id="a" correct>première option</QOption>
//       <QOption id="b">deuxième option</QOption>
//       <QFeedback of="a">pourquoi c'est vrai…</QFeedback>
//       <QFeedback of="b">pourquoi ça ne marche pas…</QFeedback>
//       <QExplain>le concept en jeu + où l'explorer…</QExplain>
//     </QItem>
//     <QNumeric answer={3.108} tolerance={0.01} unit="g·cm⁻³">
//       Prompt…
//       <QExplain>…</QExplain>
//     </QNumeric>
//   </Quiz>
// Multi-answer: <QItem multiple> with several `correct` options.

import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

type QOptionProps = { id: string; correct?: boolean; children: ReactNode };
type QFeedbackProps = { of: string; children: ReactNode };
type QExplainProps = { children: ReactNode };

export function QOption(_props: QOptionProps) {
  return null; // rendered by QItem
}
export function QFeedback(_props: QFeedbackProps) {
  return null; // rendered by QItem
}
export function QExplain(_props: QExplainProps) {
  return null; // rendered by QItem / QNumeric
}

export function Quiz({ title, children }: { title?: string; children: ReactNode }) {
  const t = learnUi(useLocale());
  return (
    <div className="quiz">
      <div className="quiz-title">{title ?? t.quizDefaultTitle}</div>
      <p className="quiz-note">{t.quizNote}</p>
      {children}
    </div>
  );
}


function pick(arr: string[], seed: number) {
  return arr[seed % arr.length];
}

export function QItem({ multiple = false, children }: { multiple?: boolean; children: ReactNode }) {
  const t = learnUi(useLocale());
  const { prompt, options, feedback, explain } = useMemo(() => {
    const prompt: ReactNode[] = [];
    const options: ReactElement<QOptionProps>[] = [];
    const feedback = new Map<string, ReactNode>();
    let explain: ReactNode = null;
    Children.forEach(children, (c) => {
      if (isValidElement(c)) {
        if (c.type === QOption) {
          options.push(c as ReactElement<QOptionProps>);
          return;
        }
        if (c.type === QFeedback) {
          const p = (c as ReactElement<QFeedbackProps>).props;
          feedback.set(p.of, p.children);
          return;
        }
        if (c.type === QExplain) {
          explain = (c as ReactElement<QExplainProps>).props.children;
          return;
        }
      }
      prompt.push(c);
    });
    return { prompt, options, feedback, explain };
  }, [children]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const correctIds = new Set(options.filter((o) => o.props.correct).map((o) => o.props.id));
  const isRight =
    checked &&
    selected.size === correctIds.size &&
    [...selected].every((id) => correctIds.has(id));

  const toggle = (id: string) => {
    setChecked(false);
    setSelected((s) => {
      const next = new Set(multiple ? s : []);
      if (s.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setSelected(new Set());
    setChecked(false);
    setShowExplain(false);
  };

  return (
    <div className="quiz-item">
      <div className="quiz-prompt">{prompt}</div>
      <div className="quiz-options" role="group">
        {options.map((o) => {
          const id = o.props.id;
          const sel = selected.has(id);
          const state = checked && sel ? (correctIds.has(id) ? " is-right" : " is-miss") : "";
          return (
            <div key={id}>
              <button
                type="button"
                className={`quiz-option${sel ? " selected" : ""}${state}`}
                aria-pressed={sel}
                onClick={() => toggle(id)}
              >
                {o.props.children}
              </button>
              {checked && sel && feedback.has(id) && (
                <div className="quiz-feedback">{feedback.get(id)}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="quiz-actions">
        <button
          type="button"
          className="btn btn-accent quiz-check"
          disabled={selected.size === 0}
          onClick={() => {
            setChecked(true);
            setAttempts((a) => a + 1);
          }}
        >
          {t.check}
        </button>
        <button type="button" className="btn" onClick={reset}>
          {t.reset}
        </button>
        {explain && (
          <button type="button" className="btn" onClick={() => setShowExplain((v) => !v)}>
            {showExplain ? t.hideExplain : t.showExplain}
          </button>
        )}
      </div>
      {checked && (
        <p className={`quiz-verdict${isRight ? " ok" : ""}`} role="status">
          {isRight ? pick(t.okMsgs, attempts) : pick(t.retryMsgs, attempts)}
        </p>
      )}
      {showExplain && explain && <div className="quiz-explain">{explain}</div>}
    </div>
  );
}

/** Numeric-answer question. Accepts French decimal commas. */
export function QNumeric({
  answer,
  tolerance = 0,
  unit,
  children,
}: {
  answer: number;
  tolerance?: number;
  unit?: string;
  children: ReactNode;
}) {
  const t = learnUi(useLocale());
  const { prompt, explain } = useMemo(() => {
    const prompt: ReactNode[] = [];
    let explain: ReactNode = null;
    Children.forEach(children, (c) => {
      if (isValidElement(c) && c.type === QExplain) {
        explain = (c as ReactElement<QExplainProps>).props.children;
        return;
      }
      prompt.push(c);
    });
    return { prompt, explain };
  }, [children]);

  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const parsed = Number.parseFloat(value.replace(",", ".").trim());
  const isRight = checked && Number.isFinite(parsed) && Math.abs(parsed - answer) <= tolerance;

  return (
    <div className="quiz-item">
      <div className="quiz-prompt">{prompt}</div>
      <div className="quiz-numeric">
        <input
          type="text"
          inputMode="decimal"
          className="quiz-input"
          aria-label={unit ? `${t.numericPlaceholder} (${unit})` : t.numericPlaceholder}
          placeholder={t.numericPlaceholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
        {unit && <span className="quiz-unit">{unit}</span>}
      </div>
      <div className="quiz-actions">
        <button
          type="button"
          className="btn btn-accent quiz-check"
          disabled={value.trim() === ""}
          onClick={() => setChecked(true)}
        >
          {t.check}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setValue("");
            setChecked(false);
            setShowExplain(false);
          }}
        >
          {t.reset}
        </button>
        {explain && (
          <button type="button" className="btn" onClick={() => setShowExplain((v) => !v)}>
            {showExplain ? t.hideExplain : t.showExplain}
          </button>
        )}
      </div>
      {checked && (
        <p className={`quiz-verdict${isRight ? " ok" : ""}`} role="status">
          {isRight
            ? t.numericOk
            : Number.isFinite(parsed)
              ? t.numericRetry
              : t.numericNaN}
        </p>
      )}
      {showExplain && explain && <div className="quiz-explain">{explain}</div>}
    </div>
  );
}
