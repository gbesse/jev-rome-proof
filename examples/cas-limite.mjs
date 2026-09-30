// Garde-fou : la couverture d’une compétence ne devient jamais une décision d’embauche.
import assert from "node:assert/strict";
import { assessEvidence } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const jev = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    coverage: {
      type: "choice",
      choice: "demonstrated",
      probabilities: {
        demonstrated: 0.9,
        partially_demonstrated: 0.04,
        adjacent: 0.03,
        no_evidence: 0.03,
      },
      confidence: 0.9,
    },
  },
  usage: { input_tokens: 40, output_tokens: 0 },
}));
const resultat = await assessEvidence(
  {
    code: "SK-002",
    label: "Analyser des entretiens",
    description: "Synthétiser des entretiens utilisateurs",
  },
  {
    id: "ev-2",
    kind: "portfolio",
    text: "Synthèse de douze entretiens",
    observedAt: "2026-06-01",
  },
  jev,
);
assert.equal(resultat.coverage, "demonstrated");
assert.equal(resultat.hiringDecision, false);
console.log(JSON.stringify(resultat, null, 2));
