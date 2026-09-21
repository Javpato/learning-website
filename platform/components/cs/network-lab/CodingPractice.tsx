"use client";
import { useEffect, useState } from "react";
import { C_EXERCISES, cProgram } from "@/lib/cs/networkCodeExercises";
import { Explain } from "./shared";
export function CodingPractice({ id }: { id: string }) {
  const ex = C_EXERCISES.find((x) => x.id === id)!;
  const [code, setCode] = useState(ex.starter);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`reseaux-code-${id}`);
      if (saved !== null) setCode(saved);
    } catch {}
    setLoaded(true);
  }, [id]);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(`reseaux-code-${id}`, code);
      } catch {}
  }, [code, id, loaded]);
  function download() {
    const url = URL.createObjectURL(
      new Blob([cProgram(ex, code)], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `reseaux-${id}.c`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="nl-workbench nl-code-practice" id={`code-${id}`}>
      <p className="nl-eyebrow">Du raisonnement au programme · C</p>
      <h3>{ex.title}</h3>
      <p>{ex.task}</p>
      <p>
        Exercice de programmation ajouté à partir de {ex.source}. Le TP2 fourni
        utilise des fichiers <code>.c</code> et les sockets C ; les TD de
        routage eux-mêmes ne demandent pas de code.
      </p>
      <Explain title="Lire les quelques constructions C utiles">
        <p>
          <code>int</code> représente un entier, <code>int d[6]</code> un
          tableau indexé de 0 à 5. <code>for</code> répète une action ;{" "}
          <code>if</code> teste une condition. <code>&amp;&amp;</code> signifie
          « et », <code>||</code> « ou ». Une fonction <code>void</code> remplit
          ici des tableaux sans renvoyer de valeur. <code>INF</code> vaut 1 000
          000, une sentinelle suffisante pour ces petits graphes, pas l’infini
          mathématique. Les tests utilisent <code>assert</code> : un échec
          arrête le programme et indique la condition fausse.
        </p>
      </Explain>
      <label>
        Ta fonction C
        <textarea
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
        />
      </label>
      <div className="nl-inline">
        <button onClick={download}>
          Télécharger mon programme et ses tests
        </button>
        <button onClick={() => setCode(ex.starter)}>
          Reprendre le squelette
        </button>
      </div>
      <Explain title="Indice">
        <p>{ex.hint}</p>
      </Explain>
      <Explain title="Solution commentée par la méthode">
        <p>
          {ex.hint} Compare chaque étape avec les manipulations de l’atelier.
        </p>
        <pre>
          <code>{ex.solution}</code>
        </pre>
        <button onClick={() => setCode(ex.solution)}>
          Charger la solution dans l’éditeur
        </button>
      </Explain>
      <Explain title="Tests fournis — TD et cas supplémentaires">
        <pre>
          <code>{ex.tests}</code>
        </pre>
      </Explain>
      <h4>Exécuter sur ton ordinateur</h4>
      <p>
        L’éditeur prépare le vrai code C ; il ne simule pas un compilateur. Le
        fichier téléchargé contient ta fonction et les tests. Avec GCC ou Clang
        installé, compile et lance dans ton terminal :
      </p>
      <pre>
        <code>{`cc -std=c11 -Wall -Wextra -pedantic reseaux-${id}.c -o reseaux-${id}\n./reseaux-${id}`}</code>
      </pre>
      <p>
        Sortie attendue après réussite : <code>{ex.expected}</code>. Une erreur
        de compilation et un test faux sont deux diagnostics différents ; le
        site ne marque pas une solution correcte sans l’avoir exécutée.
      </p>
    </section>
  );
}
