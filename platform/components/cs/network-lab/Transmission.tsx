"use client";
import { useEffect, useState } from "react";
import {
  decodeSignal,
  encodeSignal,
  HAMMING_WORDS,
  hamming,
  parity,
  parityResidual,
  polynomialDivision,
  polynomialProduct,
  shannon,
  TD1_BITS,
  type Coding,
} from "@/lib/cs/networkLab";
import {
  Choice,
  Explain,
  Lesson,
  Numeric,
  Signal,
  Source,
  TermMap,
  useLab,
} from "./shared";
const CODINGS: [Coding, string][] = [
  ["nrz", "NRZ"],
  ["manchester", "Manchester"],
  ["differential", "Manchester différentiel"],
];
function CodingLab() {
  const { state, setState } = useLab();
  const [levels, setLevels] = useState<number[]>(Array(9).fill(1));
  const [sent, setSent] = useState(false);
  const [compare, setCompare] = useState(false);
  const expected = encodeSignal(state.bits, state.coding);
  useEffect(() => {
    setLevels(Array(encodeSignal(state.bits, state.coding).length).fill(1));
    setSent(false);
  }, [state.bits, state.coding]);
  const decoded = decodeSignal(levels, state.coding);
  return (
    <div className="nl-workbench">
      <h3>A envoie des bits, B reçoit un signal</h3>
      <label>
        Suite à transmettre{" "}
        <input
          className="nl-binary-input"
          value={state.bits}
          maxLength={16}
          onChange={(e) => {
            const bits = e.target.value.replace(/[^01]/g, "").slice(0, 16);
            if (bits) setState((s) => ({ ...s, bits }));
          }}
        />
      </label>
      <button onClick={() => setState((s) => ({ ...s, bits: TD1_BITS }))}>
        Reprendre le TD : {TD1_BITS}
      </button>
      <div className="nl-options">
        {CODINGS.map(([id, name]) => (
          <button
            key={id}
            aria-pressed={state.coding === id}
            onClick={() => setState((s) => ({ ...s, coding: id }))}
          >
            {name}
          </button>
        ))}
      </div>
      <p>
        {state.coding === "nrz"
          ? "NRZ : 1 au niveau +a, 0 au niveau −a. Chaque bit garde son niveau."
          : state.coding === "manchester"
            ? "Convention du TD : 1 descend, 0 monte, à mi-bit. Le sens opposé existe, mais ce n’est pas la convention de cet exercice."
            : "Transition à mi-bit systématique ; un 0 ajoute une transition au début, un 1 n’en ajoute pas. Niveau avant le premier bit : +a, comme le tracé du TD (premier bit 1 descendant)."}
      </p>
      <Signal
        levels={state.bits.split("").flatMap(() => [1, -1])}
        label="Horloge : un cycle par bit"
        halves
      />
      <div className="nl-bit-cells">
        {state.bits.split("").map((b, i) => (
          <span key={i}>
            bit {i + 1} : <strong>{b}</strong>
          </span>
        ))}
      </div>
      <Signal
        levels={levels}
        label="Ton signal"
        halves={state.coding !== "nrz"}
      />
      <div className="nl-bit-cells">
        {levels.map((v, i) => (
          <button
            key={i}
            aria-label={`Intervalle ${i + 1}, ${v === 1 ? "haut" : "bas"}, inverser`}
            aria-pressed={v === 1}
            onClick={() => {
              setLevels((s) => s.map((x, j) => (j === i ? -x : x)));
              setSent(false);
            }}
          >
            {state.coding === "nrz"
              ? i + 1
              : `${Math.floor(i / 2) + 1}${i % 2 ? "b" : "a"}`}{" "}
            : {v === 1 ? "+a" : "−a"}
          </button>
        ))}
      </div>
      <div className="nl-inline">
        <button className="nl-primary" onClick={() => setSent(true)}>
          Transmettre à B
        </button>
        <button
          onClick={() => {
            setLevels(expected);
            setSent(false);
          }}
        >
          Voir le signal de référence
        </button>
        <button onClick={() => setCompare(!compare)} aria-expanded={compare}>
          Comparer les trois codages
        </button>
      </div>
      {sent && (
        <div
          role="status"
          className={decoded === state.bits ? "nl-good" : "nl-feedback"}
        >
          <strong>
            B lit : <code>{decoded}</code>
          </strong>
          <p>
            {decoded === state.bits
              ? "Le message est conservé. Tu as construit une liaison qui transporte ces bits."
              : decoded.includes("?")
                ? "? = transition centrale absente : ce signal ne respecte pas ce codage. Le récepteur ne peut pas en déduire un bit valide."
                : `Des bits ont changé : positions ${decoded
                    .split("")
                    .flatMap((b, i) => (b !== state.bits[i] ? [i + 1] : []))
                    .join(
                      ", ",
                    )}. Observe la règle de codage puis corrige ton tracé.`}
          </p>
        </div>
      )}
      {compare && (
        <div>
          {CODINGS.map(([id, name]) => (
            <Signal
              key={id}
              levels={encodeSignal(state.bits, id)}
              label={`${name} · ${state.bits}`}
              halves={id !== "nrz"}
            />
          ))}
        </div>
      )}
      <Explain title="Indice : commence avec les deux premiers bits">
        <p>
          En NRZ, 10 donne +a puis −a. En Manchester, les quatre
          demi-intervalles sont +a, −a, −a, +a. En différentiel avec niveau
          initial +a, 10 donne +a, −a, +a, −a. Dans les deux codages biphases,
          la transition médiane aide à retrouver l'horloge.
        </p>
        <p>
          L'alphabet des niveaux de la figure est (+a, −a), de valence 2. Les
          deux demi-intervalles Manchester représentent ensemble un bit : ne les
          compte pas comme deux bits utiles.
        </p>
      </Explain>
    </div>
  );
}
function ValenceLab() {
  const { state, setState } = useLab();
  return (
    <div className="nl-workbench">
      <h3>Un symbole peut porter plusieurs bits</h3>
      <p>
        <strong>Énoncé TD1, exercice 2.</strong> Un alphabet comporte 16
        symboles. Chaque symbole dure T. Donne la rapidité de modulation, la
        valence et le débit binaire.
      </p>
      <Numeric
        question="Quelle est la valence de ce code ?"
        answer={16}
        why="La valence est le nombre de symboles distincts de l’alphabet."
      />
      <Numeric
        question="Combien de bits permettent de distinguer 16 symboles ?"
        answer={4}
        why="Il faut log₂(16) = 4 bits, car 2⁴ = 16."
      />
      <Choice
        question="T est en secondes : quelle paire de formules est correcte ?"
        options={[
          "R = 1/T bauds ; D = 4/T bit/s",
          "R = 16/T bauds ; D = 16/T bit/s",
          "R = 4/T bauds ; D = 1/T bit/s",
        ]}
        answer={0}
        why="Un symbole par T seconde, et quatre bits par symbole. D = R × log₂(V)."
      />
      <h4>Explore ensuite — illustration numérique ajoutée</h4>
      <div className="nl-inline">
        <label>
          Valence{" "}
          <select
            value={state.valence}
            onChange={(e) =>
              setState((s) => ({ ...s, valence: Number(e.target.value) }))
            }
          >
            {[2, 4, 8, 16, 64].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Durée T : {state.symbolMs} ms{" "}
          <input
            type="range"
            min="1"
            max="20"
            value={state.symbolMs}
            onChange={(e) =>
              setState((s) => ({ ...s, symbolMs: Number(e.target.value) }))
            }
          />
        </label>
      </div>
      <p className="nl-metric">
        {(1000 / state.symbolMs).toLocaleString("fr-FR", {
          maximumFractionDigits: 1,
        })}{" "}
        symboles/s × {Math.log2(state.valence)} bits/symbole ={" "}
        <strong>
          {((1000 / state.symbolMs) * Math.log2(state.valence)).toLocaleString(
            "fr-FR",
            { maximumFractionDigits: 1 },
          )}{" "}
          bit/s
        </strong>
      </p>
      <div className="nl-symbols">
        {Array.from({ length: Math.min(state.valence, 16) }, (_, i) => (
          <span key={i}>
            s{i} ↔ {i.toString(2).padStart(Math.log2(state.valence), "0")}
          </span>
        ))}
      </div>
      {state.valence > 16 && <p>16 premiers symboles affichés sur 64.</p>}
      <p>
        Ces symboles forment un nouvel alphabet abstrait. Ils ne sont pas les
        demi-bits du Manchester. Les neuf bits du premier atelier restent
        inchangés.
      </p>
    </div>
  );
}
function ModulationLab() {
  const [amplitudes, setAmplitudes] = useState(2);
  const [phases, setPhases] = useState(4);
  const [snr, setSnr] = useState(30);
  const [chosen, setChosen] = useState([0, 0, 0, 0, 0]);
  const target = [1, 1, 3, 0, 2];
  const [show, setShow] = useState(false);
  const valence = amplitudes * phases;
  const map = ["00", "01", "10", "11"];
  const offsets = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  return (
    <>
      <div className="nl-workbench">
        <h3>Exercice 3 · Distinguer plus de symboles</h3>
        <p>
          Le TD propose 2 amplitudes et 4 phases, à 2 400 bauds. Une amplitude
          est une hauteur de signal ; une phase est un décalage dans son cycle.
          Chaque paire amplitude/phase constitue un symbole.
        </p>
        <div className="nl-two">
          <svg
            viewBox="0 0 240 240"
            className="nl-constellation"
            role="img"
            aria-label={`Constellation : ${amplitudes} amplitudes et ${phases} phases, ${valence} symboles`}
          >
            <line
              x1="10"
              y1="120"
              x2="230"
              y2="120"
              stroke="var(--border-strong)"
            />
            <line
              x1="120"
              y1="10"
              x2="120"
              y2="230"
              stroke="var(--border-strong)"
            />
            {Array.from({ length: amplitudes }, (_, a) =>
              Array.from({ length: phases }, (_, p) => {
                const r = (100 * (a + 1)) / amplitudes,
                  angle = (2 * Math.PI * p) / phases;
                return (
                  <circle
                    key={`${a}-${p}`}
                    cx={120 + r * Math.cos(angle)}
                    cy={120 - r * Math.sin(angle)}
                    r="3"
                    fill="var(--accent)"
                  />
                );
              }),
            )}
          </svg>
          <div>
            <label>
              Amplitudes{" "}
              <select
                value={amplitudes}
                onChange={(e) => setAmplitudes(Number(e.target.value))}
              >
                {[1, 2, 4].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Phases{" "}
              <select
                value={phases}
                onChange={(e) => setPhases(Number(e.target.value))}
              >
                {[2, 4, 8, 16].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <p className="nl-metric">
              {valence} symboles → {Math.log2(valence)} bits/symbole →{" "}
              {2400 * Math.log2(valence)} bit/s
            </p>
            <p>
              À amplitude maximale fixée, ajouter des points les rapproche : le
              bruit peut rendre les symboles plus difficiles à distinguer. Ce
              dessin illustre des possibilités ; il ne prétend pas reproduire
              exactement une norme de modem.
            </p>
          </div>
        </div>
        <Numeric
          question="2 amplitudes, 4 phases, 2 400 bauds : débit ?"
          answer={7200}
          unit="bit/s"
          why="8 symboles portent 3 bits chacun : 2 400 × 3."
        />
        <Numeric
          question="Pour transmettre 6 bits par symbole, quelle valence faut-il ?"
          answer={64}
          why="2⁶ possibilités. À 2 400 bauds, cela donne 14 400 bit/s avant ajout de redondance."
        />
        <Explain title="Exercices 3.3 à 3.6 — choix et limites">
          <p>
            4 bits/symbole exigent 16 symboles : par exemple 2 amplitudes × 8
            phases, soit 9 600 bit/s à 2 400 bauds. Le TD donne aussi un
            arrangement V.32 avec 12 phases à une amplitude et 4 à une autre.
            Pour 6 bits, il faut 64 symboles, par exemple 4 amplitudes × 16
            phases.
          </p>
          <p>
            Ajouter de la redondance aide à détecter des erreurs, au prix du
            débit utile. À 64 symboles et 2 400 bauds fixés, le débit brut reste
            14 400 bit/s. Avec un bit de parité par groupe de 6 bits utiles, le
            débit utile devient 14 400 × 6/7 ≈ 12 343 bit/s. Le corrigé annonce
            16 800 bit/s brut et 14 400 utile : cela suppose une capacité de
            transmission accrue (par exemple 7 bits/symbole), pas le même
            alphabet à la même rapidité. Ces hypothèses sont distinguées ici.
          </p>
          <p>
            La compression peut réduire les bits nécessaires pour représenter un
            message redondant ; elle n'augmente pas la capacité physique du
            canal et n'est pas efficace sur toutes les données.
          </p>
        </Explain>
      </div>
      <div className="nl-workbench">
        <h3>Exercice 4 · Construire le signal QPSK</h3>
        <p>
          QPSK emploie quatre phases séparées de 90°, donc deux bits par
          symbole. Représente la suite exacte <code>0101110010</code> en
          choisissant chaque symbole. Convention sinusoïdale du dessin du TD :
          00 → 0°, 01 → 90°, 10 → 180°, 11 → 270°.
        </p>
        <svg
          viewBox="0 0 600 110"
          className="nl-signal"
          role="img"
          aria-label={`Signal QPSK choisi : ${chosen.map((i) => map[i]).join(" ")}`}
        >
          <line x1="0" y1="55" x2="600" y2="55" stroke="var(--border)" />
          {chosen.map((phase, i) => (
            <path
              key={i}
              d={Array.from(
                { length: 61 },
                (_, j) =>
                  `${j ? "L" : "M"} ${i * 120 + j * 2} ${55 - 35 * Math.sin((j / 60) * 2 * Math.PI + offsets[phase])}`,
              ).join(" ")}
              stroke="var(--accent)"
              fill="none"
              strokeWidth="2"
            />
          ))}
        </svg>
        <div className="nl-inline">
          {chosen.map((v, i) => (
            <label key={i}>
              Symbole {i + 1}
              <select
                value={v}
                onChange={(e) => {
                  setChosen((s) =>
                    s.map((x, j) => (j === i ? Number(e.target.value) : x)),
                  );
                  setShow(false);
                }}
              >
                {map.map((x, j) => (
                  <option key={x} value={j}>
                    {x} · {j === 2 ? 180 : j === 3 ? 270 : j * 90}°
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <button onClick={() => setShow(true)}>Décoder le signal</button>
        {show && (
          <p
            role="status"
            className={
              chosen.every((x, i) => x === target[i])
                ? "nl-good"
                : "nl-feedback"
            }
          >
            Le récepteur lit {chosen.map((i) => map[i]).join(" ")}.{" "}
            {chosen.every((x, i) => x === target[i])
              ? "C’est bien 01 01 11 00 10."
              : "Compare chaque groupe de deux bits avec le message attendu."}
          </p>
        )}
        <Explain title="Solution du tracé">
          <p>
            01 · 01 · 11 · 00 · 10 → 90°, 90°, 270°, 0°, 180°. La forme du
            signal suit ces cinq phases.
          </p>
        </Explain>
        <h4>La capacité du support</h4>
        <p>
          Bande 60–108 kHz : W = 48 kHz. Le rapport signal/bruit de 30 dB vaut
          10³ = 1 000 en puissance. Shannon donne C = W log₂(1 + S/B).
        </p>
        <label>
          Rapport signal/bruit : {snr} dB
          <input
            type="range"
            min="0"
            max="40"
            value={snr}
            onChange={(e) => setSnr(Number(e.target.value))}
          />
        </label>
        <p className="nl-metric">
          Capacité théorique : {(shannon(48000, snr) / 1000).toFixed(1)} kbit/s
        </p>
        <p className="nl-feedback">
          Correction du document : à 30 dB, C ≈ 478,4 kbit/s, et non 144 kbit/s.
          Le corrigé a utilisé une valeur correspondant au logarithme décimal au
          lieu de log₂.
        </p>
        <Numeric
          question="À 9 600 bit/s en QPSK, quelle rapidité de modulation ?"
          answer={4800}
          unit="bauds"
          why="Chaque symbole porte 2 bits : R = D / 2."
        />
        <Numeric
          question="MIC, avec l'hypothèse d'échantillonnage usuelle du TD : fréquence minimale pour fmax = 108 kHz ?"
          answer={216}
          unit="kHz"
          why="Le critère utilisé dans le TD est fe ≥ 2 fmax ; à la limite 216 kHz, avec une marge en pratique."
        />
      </div>
    </>
  );
}
function ErrorLab() {
  const { state, setState } = useLab();
  const [word, setWord] = useState("0001111");
  const [flips, setFlips] = useState<number[]>([]);
  const [hword, setHword] = useState("0000000111");
  const [received, setReceived] = useState("1001110");
  const [divisionStep, setDivisionStep] = useState(0);
  const sent = word + parity(word);
  const damaged = sent
    .split("")
    .map((x, i) => (flips.includes(i) ? String(1 - Number(x)) : x))
    .join("");
  const division = polynomialDivision(parseInt(received, 2), 13);
  const min = Math.min(...HAMMING_WORDS.map((x) => hamming(hword, x)));
  return (
    <>
      <div className="nl-workbench">
        <h3>Exercice 5 · Détecter un bit inversé</h3>
        <p>
          Une liaison peut altérer des bits. Ajoute un bit pour rendre pair le
          nombre total de 1, puis provoque une ou deux erreurs.
        </p>
        <label>
          Caractère du TD
          <select
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
              setFlips([]);
            }}
          >
            {["0001111", "1101010", "1110000"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <p>
          Parité paire : <strong>{parity(word)}</strong>. Mot envoyé :{" "}
          <code>{sent}</code>.
        </p>
        <div className="nl-bit-cells">
          {damaged.split("").map((b, i) => (
            <button
              key={i}
              aria-pressed={flips.includes(i)}
              aria-label={`Inverser le bit ${i + 1}${i === 7 ? ", parité" : ""}`}
              onClick={() =>
                setFlips((s) =>
                  s.includes(i) ? s.filter((x) => x !== i) : [...s, i],
                )
              }
            >
              {b}
              {i === 7 ? " (P)" : ""}
            </button>
          ))}
        </div>
        <p
          role="status"
          className={parity(damaged) ? "nl-feedback" : "nl-good"}
        >
          {parity(damaged)
            ? "Erreur détectée : le nombre de 1 est impair."
            : flips.length
              ? "Le contrôle passe, mais le mot est altéré ! Un nombre pair d’erreurs échappe à la parité."
              : "Le contrôle passe ; aucune erreur n’a été injectée."}
        </p>
        <button
          aria-pressed={state.protection}
          onClick={() => setState((s) => ({ ...s, protection: !s.protection }))}
        >
          {state.protection
            ? "Parité activée dans mon réseau"
            : "Activer la parité dans mon réseau"}
        </button>
        <Explain title="Pourquoi la parité ne suffit pas toujours">
          <p>
            Un nombre impair d'inversions change la parité ; un nombre pair la
            conserve. « Contrôle réussi » n'est pas « absence certaine d'erreur
            ».
          </p>
          <p>
            Pour des erreurs indépendantes de probabilité p = 10⁻⁴, un caractère
            de 7 bits non protégé est erroné avec probabilité 1 − (1 − p)⁷ ≈{" "}
            {(1 - (1 - 0.0001) ** 7).toExponential(4)}. Pour 7 bits + parité,
            une erreur non détectée comporte 2, 4, 6 ou 8 inversions. La somme Σ
            C(8,k)pᵏ(1−p)⁸⁻ᵏ sur ces k vaut{" "}
            {parityResidual(0.0001).toExponential(4)}. Cette estimation dépend
            de l'indépendance des erreurs.
          </p>
        </Explain>
        <Choice
          question="Le contrôle de parité passe. Peut-on affirmer que le message est intact ?"
          options={["Oui", "Non, deux bits ont pu être inversés"]}
          answer={1}
          why="La parité détecte tous les nombres impairs d’inversions, pas les nombres pairs."
        />
      </div>
      <div className="nl-workbench">
        <h3>Exercice 6 · Le mot le plus proche peut tromper</h3>
        <p>
          Le code contient quatre mots de 10 bits. Tu as envoyé{" "}
          <code>0000000000</code>, et reçu <code>0000000111</code>. Compare le
          reçu aux quatre mots valides.
        </p>
        <div className="nl-bit-cells">
          {hword.split("").map((b, i) => (
            <button
              key={i}
              aria-label={`Inverser bit reçu ${i + 1}`}
              onClick={() =>
                setHword(
                  (s) =>
                    s.slice(0, i) + (b === "1" ? "0" : "1") + s.slice(i + 1),
                )
              }
            >
              {b}
            </button>
          ))}
        </div>
        <table>
          <caption>
            Distances de Hamming : nombre de positions différentes
          </caption>
          <thead>
            <tr>
              <th>Mot valide</th>
              <th>Distance au reçu</th>
              <th>Plus proche ?</th>
            </tr>
          </thead>
          <tbody>
            {HAMMING_WORDS.map((w) => (
              <tr key={w}>
                <td>
                  <code>{w}</code>
                </td>
                <td>{hamming(w, hword)}</td>
                <td>{hamming(w, hword) === min ? "Oui" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p role="status">
          {hword === "0000000111"
            ? "Le plus proche est 0000011111 (distance 2), alors que le mot envoyé est à distance 3 : une correction automatique se tromperait."
            : `Distance minimale au reçu : ${min}. Le décodage par proximité ne connaît pas le message d’origine.`}
        </p>
        <Numeric
          question="Quelle est la distance minimale entre deux mots du code ?"
          answer={5}
          why="Le minimum des six distances entre mots valides est 5."
        />
        <Explain>
          <p>
            Une distance minimale d permet de détecter jusqu'à d−1 erreurs, ou
            de corriger jusqu'à ⌊(d−1)/2⌋ erreurs. Ici : détecter 4 erreurs,
            corriger 2. Ces garanties ne permettent pas de corriger 3 erreurs
            comme dans le reçu du TD ; les boules de correction de rayon 2 ne
            contiennent plus nécessairement le mot d'origine.
          </p>
        </Explain>
      </div>
      <div className="nl-workbench">
        <h3>Exercice 7 · Un contrôle par polynômes</h3>
        <p>
          G(x) = 1 + x² + x³, soit <code>1101</code>. La donnée U ={" "}
          <code>1110</code> représente x³ + x² + x. Le TD utilise le{" "}
          <strong>codage par multiplication</strong> M = U × G dans GF(2), avec
          additions XOR (sans retenue).
        </p>
        <p className="nl-metric">
          1110 × 1101 = {polynomialProduct(14, 13).toString(2)} = x⁶ + x² + x
        </p>
        <p>
          Le message reçu du TD est M′ = x⁶ + x³ + x² + x, soit{" "}
          <code>1001110</code>. Est-il divisible par G ?
        </p>
        <div className="nl-bit-cells">
          {received.split("").map((b, i) => (
            <button
              key={i}
              aria-label={`Inverser coefficient reçu ${6 - i}`}
              onClick={() => {
                setReceived(
                  (s) =>
                    s.slice(0, i) + (b === "1" ? "0" : "1") + s.slice(i + 1),
                );
                setDivisionStep(0);
              }}
            >
              {b}
            </button>
          ))}
        </div>
        <p>
          Division XOR, reste courant :{" "}
          <code>
            {division.steps[Math.min(divisionStep, division.steps.length - 1)]
              .toString(2)
              .padStart(7, "0")}
          </code>
        </p>
        <div className="nl-inline">
          <button
            disabled={divisionStep >= division.steps.length - 1}
            onClick={() => setDivisionStep(divisionStep + 1)}
          >
            Soustraire le générateur aligné
          </button>
          <button onClick={() => setDivisionStep(division.steps.length - 1)}>
            Voir le résultat
          </button>
          <button
            onClick={() => {
              setReceived("1001110");
              setDivisionStep(0);
            }}
          >
            Reprendre M′ du TD
          </button>
        </div>
        {divisionStep >= division.steps.length - 1 && (
          <p
            role="status"
            className={division.remainder ? "nl-feedback" : "nl-good"}
          >
            {division.remainder
              ? `Reste ${division.remainder.toString(2)} : erreur détectée.`
              : "Reste nul : mot accepté par ce contrôle, sans garantie absolue d’absence d’erreur."}
          </p>
        )}
        <Explain>
          <p>
            On aligne le terme de plus haut degré de G avec celui du dividende,
            puis on effectue un XOR. On recommence jusqu'à un reste de degré
            inférieur à 3. Pour M′, le reste est <code>101</code> = x² + 1. Ce
            codage par multiplication n'est pas la construction systématique «
            données suivies d'un CRC » : le critère de divisibilité est commun,
            mais les mots encodés diffèrent.
          </p>
        </Explain>
      </div>
    </>
  );
}
export function Transmission() {
  return (
    <>
      <Lesson
        id="td1-codage"
        kicker="TD1 · exercice 1"
        title="Dessine ce que le récepteur entend"
      >
        <p className="nl-lead">
          Tu as une liaison. Fais-lui transporter les neuf bits du TD, avec une
          représentation que les deux machines comprennent.
        </p>
        <TermMap
          goal="Transformer 101001001 en signal décodable"
          terms={[
            "bit",
            "signal",
            "codage-en-bande-de-base",
            "codage-nrz",
            "codage-manchester",
          ]}
        />
        <CodingLab />
        <Source>TD/TD123-correction.pdf, p. 1, questions 1.1–1.3</Source>
      </Lesson>
      <Lesson
        id="td1-debit"
        kicker="TD1 · exercice 2"
        title="Compter les symboles, puis les bits"
      >
        <TermMap
          goal="Calculer combien de bits traversent la liaison"
          terms={["valence", "rapidite-de-modulation", "debit-binaire"]}
        />
        <ValenceLab />
        <Source>TD/TD123-correction.pdf, p. 2, exercice 2</Source>
      </Lesson>
      <Lesson
        id="td1-modulation"
        kicker="TD1 · exercices 3–4"
        title="Plus de possibilités, plus de contraintes"
      >
        <ModulationLab />
        <Source>
          TD/TD123-correction.pdf, p. 2–4, exercices 3–4 ; corrections de calcul
          explicitées
        </Source>
      </Lesson>
      <Lesson
        id="td1-erreurs"
        kicker="TD1 · exercices 5–7"
        title="Détecter n’est pas toujours corriger"
      >
        <TermMap
          goal="Savoir ce que le récepteur peut vraiment garantir"
          terms={[
            "bit-de-parite",
            "distance-de-hamming",
            "code-detecteur",
            "polynome-generateur",
            "crc",
          ]}
        />
        <ErrorLab />
        <Source>TD/TD123-correction.pdf, p. 4–5, exercices 5–7</Source>
      </Lesson>
      <Lesson
        id="td1-transfert"
        kicker="Sans aide · prépare le partiel"
        title="Sais-tu refaire le raisonnement ?"
      >
        <p>
          Essaie d'abord sur papier. Les solutions restent accessibles à tout
          moment.
        </p>
        <Numeric
          question="Variante : 8 symboles, T = 2 ms. Quel débit binaire ?"
          answer={1500}
          unit="bit/s"
          why="R = 500 bauds ; log₂(8) = 3 bits/symbole ; D = 1 500 bit/s."
        />
        <Numeric
          question="Annale 1 h : codage NRZ à 8 niveaux, 5 ms par symbole. Quel débit ?"
          answer={600}
          unit="bit/s"
          why="200 symboles par seconde, chacun porte 3 bits."
        />
        <Explain title="À expliquer avec tes mots : pourquoi bauds ≠ toujours bits/s ?">
          <p>
            Les bauds comptent les symboles par seconde. Le débit binaire compte
            les bits. Il faut connaître le nombre de bits par symbole pour
            passer de l'un à l'autre.
          </p>
        </Explain>
        <Source>
          Annales/Partiel/partiel.pdf, p. 1, exercice 1 ; variante ajoutée
        </Source>
        <p className="nl-takeaway">
          Le signal et le contrôle sont prêts. Dans le routage, tu vas décider
          où envoyer ce message lorsque B n'est plus un voisin direct.
        </p>
      </Lesson>
    </>
  );
}
