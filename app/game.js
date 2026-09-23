// Dossier shinobi — jeu de rôle Naruto.
// Port of the Claude Design prototype (RP Naruto - Dossier Shinobi.dc.html)
// to plain HTML/CSS/JS. Game data and rules are unchanged from game-data.js;
// this file replaces the .dc.html template/runtime with direct DOM building.

import * as D from "./game-data.js";

const CLE = "rp-naruto-sauvegarde-v2";
const PIPS = 16;
const CAP = 16;
// Plafond d'aptitude par grade : un élève ne sort pas de l'académie au maximum.
const PLAFONDS = [8, 10, 12, 13, 14, 15, 16, 16];
const CAP_CREATION = 7;
const COUT_SEANCE = (v) => (v < 8 ? 1 : v < 10 ? 2 : v < 12 ? 3 : 4);

// Props exposed as editable presets in Claude Design; fixed to their
// defaults here since this build has no design-time prop editor.
const DIFF = 0; // "Standard"
const POINTS_MAX = 5;

const ORIGINES = [
  { id: "orphelin", nom: "Orphelin de guerre", effet: "Volonté +1, réputation +5", ef: { vol: 1, rep: 5 } },
  { id: "heritier", nom: "Héritier déclaré du clan", effet: "Réputation +10, moral −5", ef: { rep: 10, moral: -5 } },
  { id: "rue", nom: "Enfant des quartiers extérieurs", effet: "Furtivité +1, notoriété +5", ef: { fur: 1, noto: 5 } },
  { id: "civil", nom: "Fils de civils", effet: "Stratégie +1, moral +5", ef: { int: 1, moral: 5 } }
];

const state = {
  pret: false, ecran: "titre", etape: 0,
  village: null, clan: null, nom: "", genre: "Non précisé", origine: null,
  base: {}, alloc: {}, pool: POINTS_MAX,
  rep: 30, moral: 0, noto: 0, seances: 0, rang: 0,
  node: "depart", jet: null, journal: [], flags: [], tech: [],
  tab: "recit", sauvegarde: null
};

function setState(patch) { Object.assign(state, patch); render(); }

function sauver(patch) {
  const s = { ...state, ...patch };
  const plain = {
    ecran: s.ecran, village: s.village, clan: s.clan, nom: s.nom, genre: s.genre, origine: s.origine,
    base: s.base, alloc: s.alloc, pool: s.pool, rep: s.rep, moral: s.moral, noto: s.noto,
    seances: s.seances, rang: s.rang, node: s.node, journal: s.journal, flags: s.flags, tech: s.tech, tab: s.tab
  };
  try { localStorage.setItem(CLE, JSON.stringify(plain)); } catch (e) { /* stockage indisponible */ }
  return plain;
}

function maj(patch) { const plain = sauver(patch); setState({ ...patch, sauvegarde: plain }); }

// — helpers de règles (portés tels quels depuis le prototype)
function villageRef(id) { return D.VILLAGES.find((v) => v.id === (id || state.village)) || D.VILLAGES[0]; }
function clanRef(id) { return D.CLANS.find((c) => c.id === (id || state.clan)) || D.CLANS[0]; }
function plafond(rang) { return PLAFONDS[Math.min(PLAFONDS.length - 1, rang ?? state.rang)] ?? CAP; }

function statsFinales(rang) {
  const p = plafond(rang);
  const o = {};
  D.STATS.forEach((s) => { o[s.k] = Math.min(p, (state.base[s.k] || 0) + (state.alloc[s.k] || 0)); });
  return o;
}

function ctx() {
  return { village: state.village, clan: state.clan, clanRef: clanRef(), flags: state.flags, moral: state.moral, rep: state.rep, noto: state.noto };
}

function appliquer(ef, titre) {
  if (!ef) return {};
  const rangSuivant = Math.min(D.RANGS.length - 1, state.rang + (ef.rang || 0));
  const plaf = plafond(rangSuivant);
  const alloc = { ...state.alloc };
  D.STATS.forEach((s) => {
    if (typeof ef[s.k] !== "number") return;
    const max = Math.max(0, plaf - (state.base[s.k] || 0));
    alloc[s.k] = Math.max(0, Math.min(max, (alloc[s.k] || 0) + ef[s.k]));
  });
  return {
    alloc,
    rep: Math.max(0, Math.min(100, state.rep + (ef.rep || 0))),
    moral: Math.max(-100, Math.min(100, state.moral + (ef.moral || 0))),
    noto: Math.max(0, Math.min(100, state.noto + (ef.noto || 0))),
    seances: Math.max(0, state.seances + (ef.seances || 0)),
    rang: rangSuivant,
    flags: ef.flags ? [...new Set([...state.flags, ...ef.flags])] : state.flags,
    tech: ef.tech ? [...new Set([...state.tech, ...ef.tech])] : state.tech,
    journal: ef.journal ? [...state.journal, { n: state.journal.length + 1, t: (titre ? titre + " — " : "") + ef.journal }] : state.journal
  };
}

function resoudre(id, patch) {
  let cur = id;
  let acc = { ...patch };
  const snap = () => ({ ...ctx(), ...acc, clanRef: clanRef(), flags: acc.flags || state.flags, moral: acc.moral ?? state.moral, rep: acc.rep ?? state.rep });
  let garde = 0;
  while (D.NODES[cur] && D.NODES[cur].auto && garde++ < 10) cur = D.NODES[cur].auto(snap());
  return { ...acc, node: cur, jet: null };
}

function choisir(c) {
  const titre = D.NODES[state.node].titre;
  if (!c.test) { maj(resoudre(c.next, appliquer(c.effets, titre))); return; }
  const stats = statsFinales();
  const mod = stats[c.test.stat] || 0;
  const seuil = c.test.seuil + DIFF;
  const d20 = 1 + Math.floor(Math.random() * 20);
  const ok = d20 + mod >= seuil || d20 === 20;
  const br = ok ? c.reussite : c.echec;
  maj({ jet: { statNom: D.STATS.find((s) => s.k === c.test.stat).nom, seuil, d20, mod, total: d20 + mod, ok, effets: br.effets, next: br.next, titre, mode: "recit" } });
}

function mission(m) {
  const stats = statsFinales();
  const mod = stats[m.test.stat] || 0;
  const seuil = m.test.seuil + DIFF;
  const d20 = 1 + Math.floor(Math.random() * 20);
  const ok = d20 + mod >= seuil;
  const ef = ok ? { ...m.gain, journal: "Mission " + m.rang + " remplie : " + m.nom + "." } : { ...m.perte, journal: "Mission " + m.rang + " échouée : " + m.nom + "." };
  maj({ jet: { statNom: D.STATS.find((s) => s.k === m.test.stat).nom, seuil, d20, mod, total: d20 + mod, ok, effets: ef, next: null, titre: "Mission", mode: "mission", missionId: m.id } });
}

function suite() {
  const j = state.jet;
  const patch = appliquer(j.effets, j.titre === "Mission" ? "" : j.titre);
  if (j.next) maj(resoudre(j.next, patch));
  else maj({ ...patch, jet: null });
}

function demarrer() {
  const v = villageRef(), c = clanRef();
  const base = {};
  D.STATS.forEach((s) => { base[s.k] = 2 + (v.bonus[s.k] || 0) + (c.bonus[s.k] || 0); });
  setState({ base, alloc: {}, pool: POINTS_MAX, etape: 2 });
}

function pips(v, max) {
  const n = Math.max(0, Math.min(PIPS, Math.round((v / max) * PIPS)));
  return { on: Array.from({ length: n }, (_, i) => i), off: Array.from({ length: PIPS - n }, (_, i) => i) };
}

function bonusTxt(b) {
  return Object.keys(b || {}).length ? Object.entries(b).map(([k, n]) => (D.STATS.find((s) => s.k === k) || { nom: k }).nom + " +" + n).join(", ") : "—";
}

// — petit utilitaire DOM : construit un élément, ses attributs et enfants.
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "style") el.setAttribute("style", v);
    else if (k === "hoverStyle") applyHover(el, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "class") el.className = v;
    else if (k === "value" && (tag === "input" || tag === "select")) el.value = v;
    else el.setAttribute(k, v);
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  }
  return el;
}

// Reproduit l'attribut `style-hover` du prototype : superpose un style au
// survol, restaure le style de base à la sortie.
function applyHover(el, hoverStyle) {
  el.addEventListener("mouseenter", () => { el.setAttribute("style", (el.getAttribute("style") || "") + ";" + hoverStyle); });
  el.addEventListener("mouseleave", () => { el.setAttribute("style", el.dataset.baseStyle || el.getAttribute("style")); });
  // capture the base style once, before any hover is applied
  if (!el.dataset.baseStyle) el.dataset.baseStyle = el.getAttribute("style") || "";
}

function frag(children) {
  const f = document.createDocumentFragment();
  (Array.isArray(children) ? children : [children]).forEach((c) => c != null && f.appendChild(c));
  return f;
}

// ─────────────────────────────────────────────────────────────────────────
// Écran titre
// ─────────────────────────────────────────────────────────────────────────

function renderTitre() {
  const aSauvegarde = !!state.sauvegarde && state.sauvegarde.ecran === "jeu";
  const resumeSauvegarde = state.sauvegarde
    ? ((state.sauvegarde.nom || "Sans nom") + " · " + (D.NODES[state.sauvegarde.node] ? D.NODES[state.sauvegarde.node].titre : "en cours"))
    : "";

  const onNouvelle = () => setState({
    ecran: "creation", etape: 0, village: null, clan: null, nom: "", origine: null,
    alloc: {}, base: {}, rep: 30, moral: 0, noto: 0, seances: 0, rang: 0,
    node: "depart", journal: [], flags: [], tech: [], jet: null, tab: "recit"
  });
  const onContinuer = () => setState({ ...state.sauvegarde, pret: true, sauvegarde: state.sauvegarde });

  const lignes = [
    ["Villages jouables", "Konoha · Kiri"],
    ["Clans au registre", String(D.CLANS.length)],
    ["Trames de clan exclusives", "Uchiha · Senju · Kaguya"],
    ["Résolution", "d20 + stat vs seuil"],
    ["Échec au prologue", "Jamais fatal — la trame bifurque"],
    ["Sauvegarde", "Automatique, locale"]
  ];

  return h("div", { style: "min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto;" }, [
    h("div", { style: "border-bottom: 2px solid var(--color-text); padding: 12px 24px; display: flex; gap: 24px; align-items: baseline; flex-wrap: wrap;" }, [
      h("span", { style: "font-weight: 800; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;" }, "Dossier shinobi"),
      h("span", { style: "font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700);" }, "Jeu de rôle — registre des villages cachés")
    ]),
    h("div", { style: "display: flex; flex-wrap: wrap; align-items: stretch;" }, [
      h("div", { style: "flex: 1 1 420px; min-width: 0; background: var(--color-accent); color: var(--color-bg); padding: 48px 24px 40px 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 32px; border-right: 2px solid var(--color-text);" }, [
        h("div", {}, [
          h("div", { style: "font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; margin-bottom: 20px;" }, "Campagne — prologue académie"),
          h("h1", { style: "font-size: clamp(40px, 7vw, 92px); line-height: 0.92; margin: 0; font-weight: 800; letter-spacing: -0.02em; text-wrap: balance;" }, [
            "CRÉER UN", h("br"), "SHINOBI,", h("br"), "PUIS VIVRE", h("br"), "AVEC."
          ])
        ]),
        h("p", { style: "margin: 0; max-width: 46ch; font-size: 16px; line-height: 1.5;" }, "Village, clan, kekkei genkai, réputation, moral. Chaque choix entre au dossier. Les jets de dés sont visibles et vos stats en décident.")
      ]),
      h("div", { style: "flex: 1 1 340px; min-width: 0; padding: 40px 24px; display: flex; flex-direction: column; gap: 24px;" }, [
        h("div", {}, [
          h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; margin-bottom: 8px;" }, "Systèmes actifs"),
          h("div", { style: "border-top: 2px solid var(--color-text);" }, lignes.map(([k, v], i) => h("div", { style: "display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; font-size: 14px; border-bottom: " + (i === lignes.length - 1 ? "2px solid var(--color-text);" : "1px solid var(--color-neutral-300);") }, [
            h("span", {}, k), h("span", { style: "font-weight: 600;" }, v)
          ])))
        ]),
        h("div", { style: "display: flex; flex-direction: column; gap: 8px; max-width: 420px;" }, [
          h("button", { onClick: onNouvelle, style: "border: 2px solid var(--color-text); background: var(--color-accent); color: var(--color-bg); padding: 14px 16px; font-size: 15px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; width: 100%;", hoverStyle: "background:var(--color-accent-600)" }, "Nouvelle partie"),
          aSauvegarde ? h("button", { onClick: onContinuer, style: "border: 2px solid var(--color-text); background: transparent; color: var(--color-text); padding: 14px 16px; font-size: 15px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; width: 100%;", hoverStyle: "background:var(--color-accent-200)" }, "Continuer — " + resumeSauvegarde) : null,
          h("p", { style: "margin: 8px 0 0 0; font-size: 12px; line-height: 1.5; color: var(--color-neutral-700); max-width: 44ch;" }, "Œuvre de fan non officielle. Écriture originale ; noms de villages, de clans et de techniques repris de l'univers de référence.")
        ])
      ])
    ]),
    h("div", { style: "border-top: 2px solid var(--color-text); padding: 10px 24px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-neutral-700);" }, "Prologue — académie jusqu'à la diplômation · rang visé : genin")
  ]);
}

// ─────────────────────────────────────────────────────────────────────────
// Écran création
// ─────────────────────────────────────────────────────────────────────────

function renderCreation() {
  const onRetour = () => setState({ etape: Math.max(0, state.etape - 1) });
  const etapes = ["Village", "Clan", "Identité & aptitudes", "Validation"];
  const v = state.village ? villageRef() : null;
  const c = state.clan ? clanRef() : null;

  let corps;
  if (state.etape === 0) corps = renderEtapeVillage();
  else if (state.etape === 1) corps = renderEtapeClan(v);
  else if (state.etape === 2) corps = renderEtapeIdentite();
  else corps = renderEtapeValidation(v, c);

  return h("div", { style: "min-height: 100vh; display: grid; grid-template-rows: auto 1fr;" }, [
    h("div", { style: "border-bottom: 2px solid var(--color-text); padding: 12px 24px; display: flex; gap: 20px; align-items: baseline; flex-wrap: wrap;" }, [
      h("span", { style: "font-weight: 800; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;" }, "Création de personnage"),
      h("span", { style: "font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700);" }, "Étape " + (state.etape + 1) + " / 4 — " + etapes[state.etape])
    ]),
    h("div", { style: "padding: 24px; display: flex; flex-direction: column; gap: 20px;" }, [corps]),
  ]);

  function renderEtapeVillage() {
    const villagesJouables = D.VILLAGES.filter((x) => x.jouable);
    const villagesBloques = D.VILLAGES.filter((x) => !x.jouable);
    return h("div", { style: "display: flex; flex-direction: column; gap: 16px;" }, [
      h("h2", { style: "margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.01em;" }, "Provenance"),
      h("p", { style: "margin: 0; max-width: 70ch; font-size: 15px; line-height: 1.55; color: var(--color-neutral-800);" }, "Le village décide de la doctrine, des corps d'élite accessibles, du bijū gardé sur place et des trames exclusives. Deux villages sont jouables dans cette bêta ; les autres sont au registre."),
      h("div", { style: "display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2px; background: var(--color-text); border: 2px solid var(--color-text);" },
        villagesJouables.map((x) => h("button", {
          onClick: () => setState({ village: x.id, clan: null, etape: 1 }),
          style: "background: var(--color-bg); border: 0; padding: 18px 16px; text-align: left; display: flex; flex-direction: column; gap: 10px;",
          hoverStyle: "background:var(--color-accent-200)"
        }, [
          h("span", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600;" }, x.pays),
          h("span", { style: "font-size: 24px; font-weight: 800; letter-spacing: -0.01em;" }, x.nom),
          h("span", { style: "font-size: 13px; line-height: 1.5; color: var(--color-neutral-800);" }, x.resume),
          h("span", { style: "border-top: 1px solid var(--color-neutral-300); padding-top: 8px; width: 100%; font-size: 12px; line-height: 1.6;" }, [
            h("b", {}, "Rang suprême"), " " + x.kage, h("br"),
            h("b", {}, "Bijū sur place"), " " + x.bijuu, h("br"),
            h("b", {}, "Bonus"), " " + bonusTxt(x.bonus), h("br"),
            h("b", {}, "Corps"), " " + x.corps.join(" · ")
          ])
        ]))
      ),
      h("div", {}, [
        h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 8px;" }, "Au registre — non jouables dans cette version"),
        h("div", { style: "display: flex; flex-wrap: wrap; gap: 6px;" },
          villagesBloques.map((x) => h("span", { style: "border: 1px solid var(--color-neutral-400); color: var(--color-neutral-700); padding: 5px 9px; font-size: 12px; letter-spacing: 0.04em;" }, x.nom + " — " + x.pays))
        )
      ])
    ]);
  }

  function renderEtapeClan(v) {
    const clansVillage = v ? D.CLANS.filter((x) => x.village === v.id) : [];
    return h("div", { style: "display: flex; flex-direction: column; gap: 16px;" }, [
      h("h2", { style: "margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.01em;" }, "Clan — " + (v ? v.nom : "—")),
      h("p", { style: "margin: 0; max-width: 70ch; font-size: 15px; line-height: 1.55; color: var(--color-neutral-800);" }, "Chaque clan porte sa spécificité, ses techniques de départ et sa contrainte. Les clans marqués TRAME EXCLUSIVE ouvrent un nœud narratif qui leur est propre dès le prologue."),
      h("div", { style: "display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2px; background: var(--color-text); border: 2px solid var(--color-text);" },
        clansVillage.map((x) => h("button", {
          onClick: () => { Object.assign(state, { clan: x.id }); demarrer(); },
          style: "background: var(--color-bg); border: 0; padding: 16px; text-align: left; display: flex; flex-direction: column; gap: 8px;",
          hoverStyle: "background:var(--color-accent-200)"
        }, [
          h("span", { style: "display: flex; gap: 8px; align-items: center; flex-wrap: wrap;" }, [
            h("span", { style: "font-size: 20px; font-weight: 800;" }, x.nom),
            x.trame ? h("span", { style: "background: var(--color-accent); color: var(--color-bg); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; padding: 3px 6px;" }, "Trame exclusive") : null
          ]),
          h("span", { style: "font-size: 13px; line-height: 1.5; color: var(--color-neutral-800);" }, x.resume),
          h("span", { style: "border-top: 1px solid var(--color-neutral-300); padding-top: 8px; width: 100%; font-size: 12px; line-height: 1.6;" }, [
            h("b", {}, "Spécificité"), " " + x.spec, h("br"),
            h("b", {}, "Techniques"), " " + x.tech.join(" · "), h("br"),
            h("b", {}, "Bonus"), " " + bonusTxt(x.bonus), h("br"),
            h("b", {}, "Contrainte"), " " + x.contrainte
          ])
        ]))
      ),
      h("button", { onClick: onRetour, style: "border: 2px solid var(--color-text); background: transparent; padding: 10px 14px; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; align-self: flex-start;", hoverStyle: "background:var(--color-accent-200)" }, "Retour")
    ]);
  }

  function pickOrigine(o) {
    const alloc = { ...state.alloc };
    D.STATS.forEach((s) => { if (o.ef[s.k]) alloc[s.k] = (alloc[s.k] || 0) + o.ef[s.k]; });
    if (state.origine) {
      const old = ORIGINES.find((x) => x.id === state.origine);
      D.STATS.forEach((s) => { if (old.ef[s.k]) alloc[s.k] = Math.max(0, (alloc[s.k] || 0) - old.ef[s.k]); });
    }
    setState({
      origine: o.id, alloc,
      rep: Math.max(0, 30 + (o.ef.rep || 0)),
      moral: (o.ef.moral || 0), noto: (o.ef.noto || 0)
    });
  }

  function renderEtapeIdentite() {
    const genresL = ["Femme", "Homme", "Non précisé"];
    return h("div", { style: "display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start;" }, [
      h("div", { style: "flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 16px;" }, [
        h("h2", { style: "margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.01em;" }, "Identité"),
        h("label", { style: "display: flex; flex-direction: column; gap: 6px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600;" }, [
          "Nom complet",
          h("input", {
            value: state.nom, placeholder: "Nom, prénom",
            onInput: (e) => setState({ nom: e.target.value }),
            style: "border: 2px solid var(--color-text); background: var(--color-bg); padding: 11px 12px; font-size: 16px; letter-spacing: 0; text-transform: none; font-weight: 400;"
          })
        ]),
        h("div", { style: "display: flex; flex-direction: column; gap: 6px;" }, [
          h("span", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600;" }, "Genre"),
          h("div", { style: "display: flex; gap: 2px; background: var(--color-text); border: 2px solid var(--color-text); width: fit-content;" },
            genresL.map((g) => h("button", {
              onClick: () => setState({ genre: g }),
              style: "border: 0; padding: 10px 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; background: " + (state.genre === g ? "var(--color-text)" : "var(--color-bg)") + "; color: " + (state.genre === g ? "var(--color-bg)" : "var(--color-text)") + ";"
            }, g))
          )
        ]),
        h("div", { style: "display: flex; flex-direction: column; gap: 6px;" }, [
          h("span", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600;" }, "Trait d'origine"),
          ...ORIGINES.map((o) => h("button", {
            onClick: () => pickOrigine(o),
            style: "border: 2px solid var(--color-text); padding: 10px 12px; font-size: 14px; text-align: left; width: 100%; background: " + (state.origine === o.id ? "var(--color-accent-200)" : "var(--color-bg)") + "; color: var(--color-text);"
          }, [o.nom + " — ", h("span", { style: "font-size: 12px;" }, o.effet)]))
        ]),
        h("button", { onClick: onRetour, style: "border: 2px solid var(--color-text); background: transparent; padding: 10px 14px; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; align-self: flex-start;", hoverStyle: "background:var(--color-accent-200)" }, "Retour")
      ]),
      h("div", { style: "flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 12px; border-left: 2px solid var(--color-text); padding-left: 24px;" }, [
        h("h2", { style: "margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.01em;" }, "Aptitudes"),
        h("div", { style: "display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid var(--color-text); padding-bottom: 8px;" }, [
          h("span", { style: "font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-neutral-700);" }, "Points à répartir"),
          h("span", { style: "font-size: 30px; font-weight: 800; color: var(--color-accent-700);" }, String(state.pool))
        ]),
        ...D.STATS.map((s) => {
          const total = (state.base[s.k] || 0) + (state.alloc[s.k] || 0);
          const onInc = () => { if (state.pool > 0 && total < CAP_CREATION) setState({ pool: state.pool - 1, alloc: { ...state.alloc, [s.k]: (state.alloc[s.k] || 0) + 1 } }); };
          const onDec = () => { if ((state.alloc[s.k] || 0) > 0) setState({ pool: state.pool + 1, alloc: { ...state.alloc, [s.k]: state.alloc[s.k] - 1 } }); };
          return h("div", { style: "display: grid; grid-template-columns: 1fr auto auto auto; gap: 10px; align-items: center; padding: 7px 0; border-bottom: 1px solid var(--color-neutral-300);" }, [
            h("span", { style: "font-size: 14px; font-weight: 500;" }, [s.nom + " ", h("span", { style: "color: var(--color-neutral-600); font-size: 12px;" }, "base " + (state.base[s.k] || 0) + " · max " + CAP_CREATION + " à la création")]),
            h("button", { onClick: onDec, style: "border: 2px solid var(--color-text); background: transparent; width: 30px; height: 30px; font-size: 16px; font-weight: 800; line-height: 1;", hoverStyle: "background:var(--color-accent-200)" }, "−"),
            h("span", { style: "font-size: 18px; font-weight: 800; min-width: 28px; text-align: right;" }, String(total)),
            h("button", { onClick: onInc, style: "border: 2px solid var(--color-text); background: transparent; width: 30px; height: 30px; font-size: 16px; font-weight: 800; line-height: 1;", hoverStyle: "background:var(--color-accent-200)" }, "+")
          ]);
        }),
        h("button", { onClick: () => setState({ etape: 3 }), style: "border: 2px solid var(--color-text); background: var(--color-accent); color: var(--color-bg); padding: 13px 16px; font-size: 14px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; margin-top: 8px;", hoverStyle: "background:var(--color-accent-600)" }, "Valider la fiche")
      ])
    ]);
  }

  function renderEtapeValidation(v, c) {
    const stats = statsFinales();
    const nomAffiche = state.nom.trim() || "Sans nom déclaré";
    const recap = c ? [
      { k: "Village", v: v.nom + " — " + v.pays + " · " + v.kage },
      { k: "Clan", v: c.nom + " · " + c.spec },
      { k: "Genre", v: state.genre },
      { k: "Origine", v: state.origine ? ORIGINES.find((x) => x.id === state.origine).nom : "Non déclarée" },
      { k: "Aptitudes", v: D.STATS.map((s) => s.abbr + " " + stats[s.k]).join(" · ") },
      { k: "Points non dépensés", v: state.pool + " (perdus à l'entrée)" },
      { k: "Techniques de départ", v: c.tech.join(" · ") },
      { k: "Contrainte", v: c.contrainte }
    ] : [];
    const onLancer = () => maj({ ecran: "jeu", tab: "recit" });
    return h("div", { style: "display: flex; flex-direction: column; gap: 16px; max-width: 900px;" }, [
      h("h2", { style: "margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.01em;" }, "Fiche de dossier"),
      h("div", { style: "border: 2px solid var(--color-text);" }, [
        h("div", { style: "background: var(--color-text); color: var(--color-bg); padding: 14px 16px; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;" }, [
          h("span", { style: "font-size: 22px; font-weight: 800;" }, nomAffiche),
          h("span", { style: "font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;" }, (v ? v.nom : "—") + " · " + (c ? c.nom : "—") + " · Élève")
        ]),
        h("div", { style: "display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));" },
          recap.map((r) => h("div", { style: "padding: 14px 16px; border-right: 1px solid var(--color-neutral-300); border-bottom: 1px solid var(--color-neutral-300);" }, [
            h("div", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; margin-bottom: 6px;" }, r.k),
            h("div", { style: "font-size: 14px; line-height: 1.5;" }, r.v)
          ]))
        )
      ]),
      h("div", { style: "display: flex; gap: 8px; flex-wrap: wrap;" }, [
        h("button", { onClick: onLancer, style: "border: 2px solid var(--color-text); background: var(--color-accent); color: var(--color-bg); padding: 14px 18px; font-size: 15px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left;", hoverStyle: "background:var(--color-accent-600)" }, "Entrer à l'académie"),
        h("button", { onClick: onRetour, style: "border: 2px solid var(--color-text); background: transparent; padding: 14px 18px; font-size: 15px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left;", hoverStyle: "background:var(--color-accent-200)" }, "Modifier")
      ])
    ]);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Écran jeu
// ─────────────────────────────────────────────────────────────────────────

function jetView() {
  if (!state.jet) return null;
  const j = state.jet;
  return {
    ...j,
    verdict: j.ok ? "Réussite" : "Échec",
    verdictBg: j.ok ? "var(--color-accent)" : "var(--color-text)",
    verdictFg: "var(--color-bg)",
    suite: j.effets && j.effets.journal ? j.effets.journal : (j.ok ? "Le résultat te laisse la main." : "La trame bifurque : tu continues autrement.")
  };
}

function jetPanel(jet, onSuite, continuerLabel) {
  return h("div", { style: "border: 2px solid var(--color-text); margin-top: 10px;" }, [
    h("div", { style: "background: var(--color-text); color: var(--color-bg); padding: 10px 14px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600;" }, "Jet — " + jet.statNom + " · seuil " + jet.seuil),
    h("div", { style: "display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));" }, [
      h("div", { style: "padding: 14px; border-right: 1px solid var(--color-neutral-300);" }, [h("div", { style: "font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 4px;" }, "d20"), h("div", { style: "font-size: 32px; font-weight: 800;" }, String(jet.d20))]),
      h("div", { style: "padding: 14px; border-right: 1px solid var(--color-neutral-300);" }, [h("div", { style: "font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 4px;" }, "Stat"), h("div", { style: "font-size: 32px; font-weight: 800;" }, String(jet.mod))]),
      h("div", { style: "padding: 14px; border-right: 1px solid var(--color-neutral-300);" }, [h("div", { style: "font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 4px;" }, "Total"), h("div", { style: "font-size: 32px; font-weight: 800;" }, String(jet.total))]),
      h("div", { style: "padding: 14px; background: " + jet.verdictBg + "; color: " + jet.verdictFg + ";" }, [h("div", { style: "font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px;" }, "Verdict"), h("div", { style: "font-size: 20px; font-weight: 800; letter-spacing: 0.02em;" }, jet.verdict)])
    ]),
    h("div", { style: "border-top: 2px solid var(--color-text); padding: 12px 14px; font-size: 14px; line-height: 1.55;" }, jet.suite),
    h("button", { onClick: onSuite, style: "border: 0; border-top: 2px solid var(--color-text); background: var(--color-accent); color: var(--color-bg); padding: 13px 14px; width: 100%; text-align: left; font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;", hoverStyle: "background:var(--color-accent-600)" }, continuerLabel)
  ]);
}

function renderTabRecit() {
  const n = D.NODES[state.node] || D.NODES.libre;
  const jet = jetView();
  const jetEnCours = !!state.jet && state.jet.mode === "recit";
  const choixOuverts = !state.jet;
  const c = ctx();
  const choix = (n.choix || []).filter((ch) => !ch.cond || ch.cond(c));
  return h("div", { style: "max-width: 72ch; display: flex; flex-direction: column; gap: 14px;" }, [
    h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600;" }, n.lieu),
    h("h1", { style: "margin: 0; font-size: 34px; line-height: 1.05; font-weight: 800; letter-spacing: -0.015em;" }, n.titre),
    h("div", { style: "border-top: 2px solid var(--color-text);" }),
    ...n.texte.map((p) => h("p", { style: "margin: 0; font-size: 16px; line-height: 1.62; color: var(--color-neutral-900); text-wrap: pretty;" }, p)),
    jetEnCours ? jetPanel(jet, () => suite(), "Continuer") : null,
    choixOuverts ? h("div", { style: "display: flex; flex-direction: column; gap: 8px; margin-top: 10px;" }, [
      h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; border-top: 2px solid var(--color-text); padding-top: 12px;" }, "Décision"),
      ...choix.map((ch) => h("button", {
        onClick: () => choisir(ch),
        style: "border: 2px solid var(--color-text); background: var(--color-bg); padding: 13px 14px; text-align: left; display: flex; justify-content: space-between; gap: 16px; align-items: baseline; font-size: 15px; line-height: 1.45; color: var(--color-text); width: 100%;",
        hoverStyle: "background:var(--color-accent-200)"
      }, [
        h("span", {}, ch.txt),
        h("span", { style: "font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; white-space: nowrap;" }, ch.test ? ("Jet " + D.STATS.find((s) => s.k === ch.test.stat).abbr + " · seuil " + (ch.test.seuil + DIFF)) : "")
      ]))
    ]) : null
  ]);
}

function renderTabCarte() {
  const libre = state.flags.includes("prologue_fini") || state.rang >= 1;
  const jet = jetView();
  const missions = libre ? D.MISSIONS.filter((m) => m.village === "*" || m.village === state.village) : [];
  return h("div", { style: "display: flex; flex-direction: column; gap: 18px;" }, [
    h("div", {}, [
      h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; margin-bottom: 6px;" }, "Carte politique"),
      h("h1", { style: "margin: 0 0 12px 0; font-size: 30px; font-weight: 800; letter-spacing: -0.015em;" }, "Pays et villages cachés")
    ]),
    h("div", { style: "display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 2px; background: var(--color-text); border: 2px solid var(--color-text);" },
      D.VILLAGES.map((x) => {
        const bg = x.id === state.village ? "var(--color-accent)" : "var(--color-bg)";
        const fg = x.id === state.village ? "var(--color-bg)" : "var(--color-text)";
        const etat = x.id === state.village ? "Village d'attache" : x.jouable ? "Grande puissance" : "Territoire au registre";
        return h("div", { style: "padding: 14px; background: " + bg + "; color: " + fg + "; display: flex; flex-direction: column; gap: 6px; min-height: 132px;" }, [
          h("span", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;" }, x.pays),
          h("span", { style: "font-size: 19px; font-weight: 800; line-height: 1.1;" }, x.nom),
          h("span", { style: "font-size: 12px; line-height: 1.45;" }, x.bijuu === "—" ? "Aucun bijū déclaré" : x.bijuu),
          h("span", { style: "margin-top: auto; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600;" }, etat)
        ]);
      })
    ),
    h("div", {}, [
      h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 8px;" }, "Registre des missions — " + (libre ? "ouvert" : "verrouillé jusqu'à la diplômation")),
      h("div", { style: "border-top: 2px solid var(--color-text);" },
        missions.map((m) => {
          const testTxt = "jet " + D.STATS.find((s) => s.k === m.test.stat).abbr + " seuil " + (m.test.seuil + DIFF);
          const rapportOuvert = !!state.jet && state.jet.mode === "mission" && state.jet.missionId === m.id;
          return frag([
            h("div", { style: "display: grid; grid-template-columns: 42px minmax(0, 1fr) auto; gap: 14px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-neutral-300);" }, [
              h("span", { style: "font-size: 18px; font-weight: 800; color: var(--color-accent-700);" }, m.rang),
              h("span", {}, [h("span", { style: "font-size: 15px; font-weight: 600; display: block;" }, m.nom), h("span", { style: "font-size: 13px; color: var(--color-neutral-700); line-height: 1.45;" }, m.res + " · " + testTxt)]),
              h("button", { onClick: () => mission(m), style: "border: 2px solid var(--color-text); background: transparent; padding: 9px 14px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;", hoverStyle: "background:var(--color-accent-200)" }, "Accepter")
            ]),
            rapportOuvert ? h("div", { style: "border: 2px solid var(--color-text); margin: 0 0 14px 0; max-width: 620px;" }, [
              h("div", { style: "background: var(--color-text); color: var(--color-bg); padding: 10px 14px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600;" }, "Compte rendu — " + jet.statNom + " · seuil " + jet.seuil),
              h("div", { style: "display: grid; grid-template-columns: repeat(4, 1fr);" }, [
                h("div", { style: "padding: 12px; border-right: 1px solid var(--color-neutral-300);" }, [h("div", { style: "font-size: 10px; text-transform: uppercase; color: var(--color-neutral-700);" }, "d20"), h("div", { style: "font-size: 26px; font-weight: 800;" }, String(jet.d20))]),
                h("div", { style: "padding: 12px; border-right: 1px solid var(--color-neutral-300);" }, [h("div", { style: "font-size: 10px; text-transform: uppercase; color: var(--color-neutral-700);" }, "Stat"), h("div", { style: "font-size: 26px; font-weight: 800;" }, String(jet.mod))]),
                h("div", { style: "padding: 12px; border-right: 1px solid var(--color-neutral-300);" }, [h("div", { style: "font-size: 10px; text-transform: uppercase; color: var(--color-neutral-700);" }, "Total"), h("div", { style: "font-size: 26px; font-weight: 800;" }, String(jet.total))]),
                h("div", { style: "padding: 12px; background: " + jet.verdictBg + "; color: " + jet.verdictFg + ";" }, [h("div", { style: "font-size: 10px; text-transform: uppercase;" }, "Verdict"), h("div", { style: "font-size: 17px; font-weight: 800;" }, jet.verdict)])
              ]),
              h("div", { style: "border-top: 2px solid var(--color-text); padding: 12px 14px; font-size: 14px;" }, jet.suite),
              h("button", { onClick: () => suite(), style: "border: 0; border-top: 2px solid var(--color-text); background: var(--color-accent); color: var(--color-bg); padding: 12px 14px; width: 100%; text-align: left; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;", hoverStyle: "background:var(--color-accent-600)" }, "Classer le rapport")
            ]) : null
          ]);
        })
      )
    ])
  ]);
}

function renderTabFiche(v, c) {
  const moralTxt = state.moral >= 40 ? "Loyauté affirmée" : state.moral >= 0 ? "Équilibre" : state.moral > -30 ? "Dérive" : state.moral > -60 ? "Voie de la trahison ouverte" : "Manteau rouge à portée";
  const nomAffiche = state.nom.trim() || "Sans nom déclaré";
  const fiche = [
    { k: "Village", v: v.nom + " — " + v.pays },
    { k: "Grade", v: D.RANGS[state.rang] + " · plafond d'aptitude " + plafond() + " · rang suprême visé : " + v.kage },
    { k: "Clan", v: c.nom },
    { k: "Spécificité", v: c.spec },
    { k: "Bijū sur le territoire", v: v.bijuu },
    { k: "Moral", v: state.moral + " — " + moralTxt },
    { k: "Réputation / notoriété", v: state.rep + " au village · " + state.noto + " hors frontières" },
    { k: "Drapeaux de trame", v: state.flags.length ? state.flags.join(", ") : "aucun" }
  ];
  const echelle = D.RANGS.map((r, i) => ({ nom: r, etat: i < state.rang ? "acquis" : i === state.rang ? "en cours" : "verrouillé", fg: i <= state.rang ? "var(--color-text)" : "var(--color-neutral-500)", fw: i === state.rang ? "800" : "400" }));
  const journal = state.journal.slice().reverse();

  return h("div", { style: "display: flex; flex-direction: column; gap: 20px;" }, [
    h("div", {}, [
      h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; margin-bottom: 6px;" }, "Dossier personnel"),
      h("h1", { style: "margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.015em;" }, nomAffiche + " — " + c.nom)
    ]),
    h("div", { style: "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2px; background: var(--color-text); border: 2px solid var(--color-text);" },
      fiche.map((r) => h("div", { style: "background: var(--color-bg); padding: 14px;" }, [
        h("div", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; margin-bottom: 6px;" }, r.k),
        h("div", { style: "font-size: 14px; line-height: 1.5;" }, r.v)
      ]))
    ),
    h("div", { style: "display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px;" }, [
      h("div", {}, [
        h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 8px;" }, "Échelle des grades — " + v.nom),
        h("div", { style: "border-top: 2px solid var(--color-text);" },
          echelle.map((r) => h("div", { style: "display: flex; justify-content: space-between; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--color-neutral-300); font-size: 14px; color: " + r.fg + "; font-weight: " + r.fw + ";" }, [
            h("span", {}, r.nom), h("span", { style: "font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;" }, r.etat)
          ]))
        )
      ]),
      h("div", {}, [
        h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 8px;" }, "Trames suivies"),
        h("div", { style: "border-top: 2px solid var(--color-text);" },
          D.ARCS.map((a) => h("div", { style: "padding: 9px 0; border-bottom: 1px solid var(--color-neutral-300);" }, [
            h("div", { style: "display: flex; justify-content: space-between; gap: 12px; font-size: 14px; font-weight: 600;" }, [h("span", {}, a.nom), h("span", { style: "font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-accent-700);" }, a.etat)]),
            h("div", { style: "font-size: 12px; color: var(--color-neutral-700);" }, a.req)
          ]))
        )
      ])
    ]),
    h("div", {}, [
      h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 8px;" }, "Journal des décisions"),
      h("div", { style: "border-top: 2px solid var(--color-text); max-width: 78ch;" },
        journal.map((j) => h("div", { style: "display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--color-neutral-300);" }, [
          h("span", { style: "font-size: 12px; font-weight: 800; color: var(--color-neutral-500);" }, String(j.n)), h("span", { style: "font-size: 14px; line-height: 1.5;" }, j.t)
        ]))
      )
    ])
  ]);
}

function renderTabEntrainement() {
  const stats = statsFinales();
  return h("div", { style: "display: flex; flex-direction: column; gap: 18px; max-width: 760px;" }, [
    h("div", {}, [
      h("div", { style: "font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; margin-bottom: 6px;" }, "Terrain libre"),
      h("h1", { style: "margin: 0 0 8px 0; font-size: 30px; font-weight: 800; letter-spacing: -0.015em;" }, "Entraînement"),
      h("p", { style: "margin: 0; font-size: 15px; line-height: 1.55; color: var(--color-neutral-800); max-width: 64ch;" }, "Une séance vaut un point d'aptitude, et le point coûte plus cher à mesure que l'aptitude monte : une séance jusqu'à 7, deux jusqu'à 9, trois jusqu'à 11, quatre au-delà. Chaque grade impose son propre plafond — un élève sort de l'académie loin du maximum.")
    ]),
    h("div", { style: "display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid var(--color-text); border-bottom: 2px solid var(--color-text); padding: 10px 0;" }, [
      h("span", { style: "font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-neutral-700);" }, "Séances disponibles"),
      h("span", { style: "font-size: 34px; font-weight: 800; color: var(--color-accent-700);" }, String(state.seances))
    ]),
    ...D.STATS.map((s) => {
      const val = stats[s.k];
      const plaf = plafond();
      const bloque = val >= plaf;
      const cout = COUT_SEANCE(val);
      const note = bloque ? "plafond du grade " + D.RANGS[state.rang] + " atteint (" + plaf + ") — monter en grade pour aller plus loin" : "+1 au total des jets " + s.abbr + " · plafond " + plaf;
      const coutTxt = bloque ? "Plafond" : "+1 · " + cout + (cout > 1 ? " séances" : " séance");
      const onTrain = () => { if (!bloque && state.seances >= cout) setState({ seances: state.seances - cout, alloc: { ...state.alloc, [s.k]: (state.alloc[s.k] || 0) + 1 } }); };
      return h("div", { style: "display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 14px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--color-neutral-300);" }, [
        h("span", {}, [h("span", { style: "font-size: 15px; font-weight: 600;" }, s.nom), " ", h("span", { style: "font-size: 12px; color: var(--color-neutral-600);" }, note)]),
        h("span", { style: "font-size: 20px; font-weight: 800; min-width: 32px; text-align: right;" }, String(val)),
        h("button", { onClick: onTrain, style: "border: 2px solid var(--color-text); background: transparent; padding: 8px 12px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;", hoverStyle: "background:var(--color-accent-200)" }, coutTxt)
      ]);
    })
  ]);
}

function renderSidePanel(c) {
  const stats = statsFinales();
  const plaf = plafond();
  const panneau = D.STATS.map((s) => ({ abbr: s.abbr, val: stats[s.k] + " / " + plaf, ...pips(stats[s.k], plaf) }));
  const moralTxt = state.moral >= 40 ? "Loyauté affirmée" : state.moral >= 0 ? "Équilibre" : state.moral > -30 ? "Dérive" : state.moral > -60 ? "Voie de la trahison ouverte" : "Manteau rouge à portée";
  const jauges = [
    { nom: "Réputation", val: state.rep, note: state.rep >= 60 ? "Dossier remarqué en haut lieu" : state.rep >= 30 ? "Dossier propre" : "Sous surveillance", ...pips(state.rep, 100) },
    { nom: "Moral", val: state.moral, note: moralTxt, ...pips(Math.max(0, state.moral + 100), 200) },
    { nom: "Notoriété", val: state.noto, note: state.noto >= 40 ? "Nom connu hors du village" : "Inconnu à l'étranger", ...pips(state.noto, 100) }
  ];
  const techniques = [...c.tech, ...state.tech];

  const pipsRow = (on, off, color) => h("div", { style: "display: flex; gap: 2px; margin-top: 4px;" }, [
    ...on.map(() => h("span", { style: "width: 100%; height: 7px; background: " + color + ";" })),
    ...off.map(() => h("span", { style: "width: 100%; height: 7px; background: var(--color-neutral-300);" }))
  ]);

  return h("div", { style: "flex: 1 1 300px; min-width: 0; border-left: 2px solid var(--color-text); border-top: 2px solid var(--color-text); padding: 20px 18px 40px 18px; display: flex; flex-direction: column; gap: 18px; align-content: start;" }, [
    h("div", {}, [
      h("div", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 8px;" }, "Aptitudes"),
      ...panneau.map((s) => h("div", { style: "padding: 6px 0; border-bottom: 1px solid var(--color-neutral-300);" }, [
        h("div", { style: "display: flex; justify-content: space-between; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;" }, [h("span", { style: "font-weight: 600;" }, s.abbr), h("span", { style: "font-weight: 800;" }, s.val)]),
        pipsRow(s.on, s.off, "var(--color-text)")
      ]))
    ]),
    h("div", {}, [
      h("div", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 8px;" }, "Statut social"),
      ...jauges.map((j) => h("div", { style: "padding: 8px 0; border-bottom: 1px solid var(--color-neutral-300);" }, [
        h("div", { style: "display: flex; justify-content: space-between; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;" }, [h("span", { style: "font-weight: 600;" }, j.nom), h("span", { style: "font-weight: 800; color: var(--color-accent-700);" }, String(j.val))]),
        pipsRow(j.on, j.off, "var(--color-accent)"),
        h("div", { style: "font-size: 11px; color: var(--color-neutral-700); margin-top: 3px; line-height: 1.4;" }, j.note)
      ]))
    ]),
    h("div", { style: "border: 2px solid var(--color-text); padding: 12px;" }, [
      h("div", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-700); font-weight: 600; margin-bottom: 6px;" }, "Spécificité de clan"),
      h("div", { style: "font-size: 13px; line-height: 1.5; font-weight: 600;" }, c.spec),
      h("div", { style: "font-size: 12px; line-height: 1.5; color: var(--color-neutral-700); margin-top: 6px;" }, c.contrainte)
    ]),
    h("div", {}, [
      h("div", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 6px;" }, "Techniques"),
      h("div", { style: "display: flex; flex-direction: column; gap: 4px;" },
        techniques.map((t) => h("span", { style: "border: 1px solid var(--color-neutral-400); padding: 5px 8px; font-size: 12px;" }, t))
      )
    ]),
    h("div", { style: "display: flex; flex-direction: column; gap: 6px; margin-top: auto;" }, [
      h("div", { style: "font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-neutral-700); font-weight: 600;" }, "Séances : " + state.seances + " · Sauvegarde automatique"),
      h("button", { onClick: () => setState({ ecran: "titre", etape: 0 }), style: "border: 2px solid var(--color-text); background: transparent; padding: 9px 12px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-align: left;", hoverStyle: "background:var(--color-accent-200)" }, "Nouveau personnage")
    ])
  ]);
}

function renderJeu() {
  const v = villageRef(), c = clanRef();
  const nomAffiche = state.nom.trim() || "Sans nom déclaré";
  const onglets = [["recit", "Récit"], ["carte", "Carte"], ["fiche", "Fiche"], ["entrainement", "Entraînement"]];

  let corps;
  if (state.tab === "recit") corps = renderTabRecit();
  else if (state.tab === "carte") corps = renderTabCarte();
  else if (state.tab === "fiche") corps = renderTabFiche(v, c);
  else corps = renderTabEntrainement();

  return h("div", { style: "min-height: 100vh; display: grid; grid-template-rows: auto 1fr;" }, [
    h("div", { style: "border-bottom: 2px solid var(--color-text); display: flex; justify-content: space-between; align-items: stretch; flex-wrap: wrap;" }, [
      h("div", { style: "padding: 10px 24px; display: flex; gap: 18px; align-items: baseline; flex-wrap: wrap;" }, [
        h("span", { style: "font-weight: 800; font-size: 14px; letter-spacing: 0.06em;" }, nomAffiche),
        h("span", { style: "font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-neutral-700);" }, c.nom + " · " + v.nom + " · " + D.RANGS[state.rang])
      ]),
      h("div", { style: "display: flex; gap: 0; border-left: 2px solid var(--color-text);" },
        onglets.map(([k, l]) => h("button", {
          onClick: () => maj({ tab: k }),
          style: "border: 0; border-right: 1px solid var(--color-neutral-300); padding: 10px 18px; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; background: " + (state.tab === k ? "var(--color-text)" : "var(--color-bg)") + "; color: " + (state.tab === k ? "var(--color-bg)" : "var(--color-text)") + ";"
        }, l))
      )
    ]),
    h("div", { style: "display: flex; flex-wrap: wrap; align-items: stretch;" }, [
      h("div", { style: "flex: 100 1 440px; min-width: 0; padding: 28px 24px 48px 24px;" }, [corps]),
      renderSidePanel(c)
    ])
  ]);
}

// ─────────────────────────────────────────────────────────────────────────
// Racine
// ─────────────────────────────────────────────────────────────────────────

function render() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  if (!state.pret) return;
  if (state.ecran === "titre") root.appendChild(renderTitre());
  else if (state.ecran === "creation") root.appendChild(renderCreation());
  else if (state.ecran === "jeu") root.appendChild(renderJeu());
}

(function init() {
  let sv = null;
  try { const raw = localStorage.getItem(CLE); if (raw) sv = JSON.parse(raw); } catch (e) { sv = null; }
  setState({ pret: true, sauvegarde: sv });
})();
