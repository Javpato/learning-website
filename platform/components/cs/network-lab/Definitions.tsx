"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  Children,
  isValidElement,
  cloneElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { RESEAUX_TERMES } from "@/lib/content/glossaire-reseaux";
const fr = (v: string | { fr?: string } | undefined) =>
  typeof v === "string" ? v : v?.fr || "";
const extra = [
  {
    id: "sommet",
    label: "sommet",
    short:
      "Un point du graphe : ici, un équipement ou un routeur. Sa position dans le dessin ne fixe pas le coût des liaisons.",
  },
  {
    id: "arc",
    label: "arc",
    short:
      "Une liaison orientée : A → B autorise ce sens seulement. Son poids est son coût.",
  },
  {
    id: "relaxation",
    label: "relaxation",
    short:
      "Comparer la meilleure distance connue vers v au candidat d(u) + coût(u,v), puis garder le plus petit et son prédécesseur.",
  },
  {
    id: "invariant",
    label: "invariant",
    short:
      "Une propriété vraie au départ, préservée à chaque étape, qui permet de démontrer le résultat de l’algorithme.",
  },
  {
    id: "frontiere",
    label: "frontière",
    short:
      "La séparation entre sommets dont la distance est définitive et sommets encore provisoires.",
  },
];
const terms = [
  ...RESEAUX_TERMES.map((t) => ({
    id: t.id,
    label: fr(t.label),
    short: fr(t.short),
  })),
  ...extra,
];
const DefinitionContext = createContext<
  (id: string, trigger: HTMLElement) => void
>(() => {});
export function DefinitionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const box = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const dismiss = (restore = false) => {
    setSelected(null);
    if (restore) trigger.current?.focus();
  };
  useEffect(() => {
    if (!selected) return;
    close.current?.focus();
    const outside = (e: PointerEvent) => {
      if (
        !box.current?.contains(e.target as Node) &&
        !trigger.current?.contains(e.target as Node)
      )
        dismiss();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss(true);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
    };
  }, [selected]);
  const term = terms.find((t) => t.id === selected);
  return (
    <DefinitionContext.Provider
      value={(id, el) => {
        trigger.current = el;
        setSelected(id);
      }}
    >
      {children}
      {term && (
        <aside
          ref={box}
          className="nl-definition-popover"
          role="dialog"
          aria-modal="false"
          aria-labelledby="nl-definition-title"
        >
          <button
            ref={close}
            aria-label="Fermer la définition"
            onClick={() => dismiss(true)}
          >
            ×
          </button>
          <p className="nl-eyebrow">Définition</p>
          <h3 id="nl-definition-title">{term.label}</h3>
          <p>{term.short}</p>
          <small>Échap, × ou un clic à l’extérieur pour fermer.</small>
        </aside>
      )}
    </DefinitionContext.Provider>
  );
}
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const open = useContext(DefinitionContext);
  return (
    <button
      type="button"
      className="nl-inline-term"
      aria-haspopup="dialog"
      onClick={(e) => open(id, e.currentTarget)}
    >
      {children || terms.find((t) => t.id === id)?.label || id}
    </button>
  );
}
// Annotate authored prose only. Never inspect/mutate the DOM or learner code.
const aliases = [
  {
    ...terms.find((t) => t.id === "algorithme-de-dijkstra")!,
    label: "Dijkstra",
  },
  {
    ...terms.find((t) => t.id === "vecteur-de-distances")!,
    label: "Bellman-Ford",
  },
];
const labels = [...terms.filter((t) => t.label.length >= 3), ...aliases].sort(
  (a, b) => b.label.length - a.label.length,
);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(
  String.raw`(?<![\p{L}\p{N}])(${labels.map((t) => escape(t.label)).join("|")})(?![\p{L}\p{N}])`,
  "giu",
);
function textTerms(text: string): ReactNode {
  const chunks: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    chunks.push(text.slice(last, m.index));
    const term = labels.find(
      (t) => t.label.toLocaleLowerCase("fr") === m[0].toLocaleLowerCase("fr"),
    );
    chunks.push(
      <Term key={m.index} id={term!.id}>
        {m[0]}
      </Term>,
    );
    last = m.index! + m[0].length;
  }
  chunks.push(text.slice(last));
  return chunks;
}
export function annotateProse(children: ReactNode, inProse = false): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") return inProse ? textTerms(child) : child;
    if (!isValidElement(child) || typeof child.type !== "string") return child;
    const el = child as ReactElement<{ children?: ReactNode }>;
    if (
      [
        "button",
        "a",
        "code",
        "pre",
        "svg",
        "input",
        "textarea",
        "select",
        "label",
        "summary",
        "h1",
        "h2",
        "h3",
        "h4",
      ].includes(child.type)
    )
      return child;
    return cloneElement(
      el,
      {},
      annotateProse(el.props.children, inProse || child.type === "p"),
    );
  });
}

export function CourseParagraph({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return <p {...props}>{annotateProse(children, true)}</p>;
}
