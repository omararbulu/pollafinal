// ============================================================
// La Polla Periquitos · Fase Final — datos + motor de puntaje
// Puntaje:
//  - AVANCE (bloqueado): octavos 3 / cuartos 5 / semis 8 / final 12 por equipo;
//    campeón 15, subcampeón 8, tercero 5.
//  - MARCADOR (progresivo, solo score): resultado 3 / exacto 5 por partido.
//  - GOLEADOR: 1 punto por gol.
// ============================================================

export const PTS = { oct: 3, cua: 5, sem: 8, fin: 12, camp: 15, sub: 8, ter: 5, res: 3, exa: 5, gol: 1 };

export const M16 = [
  ["Sudáfrica", "Canadá"], ["Brasil", "Japón"], ["Alemania", "Paraguay"], ["Países Bajos", "Marruecos"],
  ["Costa de Marfil", "Noruega"], ["Francia", "Suecia"], ["México", "Ecuador"], ["Inglaterra", "RD Congo"],
  ["Bélgica", "Senegal"], ["USA", "Bosnia"], ["España", "Austria"], ["Suiza", "Argelia"],
  ["Portugal", "Croacia"], ["Argentina", "Cabo Verde"], ["Colombia", "Ghana"], ["Australia", "Egipto"],
];
export const OCT = [[3, 6], [1, 4], [2, 5], [7, 8], [13, 11], [10, 9], [14, 16], [12, 15]];
export const CUA = [[1, 2], [5, 6], [3, 4], [7, 8]];
export const SEM = [[1, 2], [3, 4]];

export const PART = [
  { name: "Omar", goleador: "Kane",
    a16: ["Canadá","Japón","Alemania","Países Bajos","Noruega","Francia","Ecuador","Inglaterra","Senegal","USA","España","Suiza","Croacia","Argentina","Colombia","Egipto"],
    p16: [[0,2],[2,2],[3,1],[3,1],[1,2],[4,0],[1,1],[3,1],[2,2],[4,1],[3,0],[2,1],[1,1],[1,1],[2,2],[1,2]],
    l4: ["Francia","Países Bajos","Japón","Inglaterra","España","USA","Argentina","Colombia"],
    ls: ["Países Bajos","España","Inglaterra","Argentina"], fin: ["Países Bajos","Argentina"],
    camp: "Países Bajos", sub: "Argentina", ter: "Inglaterra" },
  { name: "Alexander", goleador: "Mbappe",
    a16: ["Canadá","Brasil","Alemania","Países Bajos","Noruega","Francia","México","Inglaterra","Bélgica","USA","España","Suiza","Portugal","Argentina","Colombia","Egipto"],
    p16: [[0,2],[3,2],[3,0],[1,1],[1,3],[4,1],[1,0],[2,0],[2,2],[2,0],[3,0],[1,0],[2,1],[2,0],[3,2],[1,2]],
    l4: ["Francia","Países Bajos","Brasil","Inglaterra","España","USA","Argentina","Colombia"],
    ls: ["Francia","España","Brasil","Argentina"], fin: ["Francia","Argentina"],
    camp: "Francia", sub: "Argentina", ter: "España" },
  { name: "Alberto", goleador: "",
    a16: ["Canadá","Brasil","Alemania","Países Bajos","Noruega","Francia","México","Inglaterra","Bélgica","USA","España","Suiza","Portugal","Argentina","Colombia","Egipto"],
    p16: [[1,2],[2,1],[2,0],[2,1],[1,2],[2,0],[2,1],[2,1],[2,1],[2,1],[2,0],[2,1],[2,1],[2,0],[2,1],[1,2]],
    l4: ["Francia","Países Bajos","Brasil","Inglaterra","Portugal","Bélgica","Argentina","Colombia"],
    ls: ["Francia","Portugal","Brasil","Argentina"], fin: ["Portugal","Argentina"],
    camp: "Portugal", sub: "Argentina", ter: "Francia" },
  { name: "Héctor", goleador: "Mbappe",
    a16: ["Canadá","Brasil","Alemania","Países Bajos","Costa de Marfil","Francia","Ecuador","Inglaterra","Senegal","USA","España","Suiza","Portugal","Argentina","Colombia","Australia"],
    p16: [[1,3],[3,2],[2,0],[2,1],[2,2],[3,1],[1,2],[3,0],[1,2],[3,1],[2,0],[2,0],[2,1],[3,0],[2,1],[1,1]],
    l4: ["Francia","Países Bajos","Brasil","Inglaterra","Portugal","USA","Argentina","Suiza"],
    ls: ["Francia","Portugal","Brasil","Suiza"], fin: ["Francia","Brasil"],
    camp: "Francia", sub: "Brasil", ter: "Portugal" },
  { name: "Victor", goleador: "Messi",
    a16: ["Canadá","Brasil","Alemania","Países Bajos","Noruega","Francia","México","Inglaterra","Bélgica","USA","España","Suiza","Portugal","Argentina","Colombia","Egipto"],
    p16: [[1,3],[2,1],[2,0],[2,1],[1,2],[3,1],[2,2],[2,0],[2,2],[3,1],[2,0],[2,1],[2,1],[2,0],[2,1],[1,2]],
    l4: ["Francia","Países Bajos","Brasil","Inglaterra","España","USA","Argentina","Colombia"],
    ls: ["Países Bajos","España","Inglaterra","Argentina"], fin: ["Países Bajos","Argentina"],
    camp: "Países Bajos", sub: "Argentina", ter: "Inglaterra" },
];

export const ROUNDS = [
  { key: "16", label: "16avos", n: 16, ids: Array.from({ length: 16 }, (_, i) => `16-${i + 1}`) },
  { key: "8", label: "Octavos", n: 8, ids: Array.from({ length: 8 }, (_, i) => `8-${i + 1}`) },
  { key: "4", label: "Cuartos", n: 4, ids: Array.from({ length: 4 }, (_, i) => `4-${i + 1}`) },
  { key: "S", label: "Semifinales", n: 2, ids: ["S-1", "S-2"] },
  { key: "FIN", label: "Final y 3°", n: 2, ids: ["F", "3P"] },
];
export const PLUS_IDS = ["8-1","8-2","8-3","8-4","8-5","8-6","8-7","8-8","4-1","4-2","4-3","4-4","S-1","S-2","F","3P"];
export const ALL_IDS = ROUNDS.flatMap((r) => r.ids);
export const DEFAULT_RESULTS = { "16-1": { gl: 0, gv: 1, adv: "Canadá" }, "16-2": { gl: 2, gv: 1, adv: "Brasil" } };

export const idLabel = (id) => id === "3P" ? "3er puesto" : id === "F" ? "Final"
  : id.replace("16-", "16avos ").replace("8-", "8vos ").replace("4-", "4tos ").replace("S-", "Semi ");

export function makeTree(results) {
  const teamsFor = (id) => {
    if (id.startsWith("16-")) return M16[+id.slice(3) - 1] || [null, null];
    if (id.startsWith("8-")) { const f = OCT[+id.slice(2) - 1]; return [winnerOf(`16-${f[0]}`), winnerOf(`16-${f[1]}`)]; }
    if (id.startsWith("4-")) { const f = CUA[+id.slice(2) - 1]; return [winnerOf(`8-${f[0]}`), winnerOf(`8-${f[1]}`)]; }
    if (id.startsWith("S-")) { const f = SEM[+id.slice(2) - 1]; return [winnerOf(`4-${f[0]}`), winnerOf(`4-${f[1]}`)]; }
    if (id === "F") return [winnerOf("S-1"), winnerOf("S-2")];
    if (id === "3P") return [loserOf("S-1"), loserOf("S-2")];
    return [null, null];
  };
  const winnerOf = (id) => {
    const r = results[id]; if (!r) return null; const [a, b] = teamsFor(id);
    if (r.adv && (r.adv === a || r.adv === b)) return r.adv;
    if (typeof r.gl === "number" && typeof r.gv === "number" && r.gl !== r.gv) return r.gl > r.gv ? a : b;
    return null;
  };
  const loserOf = (id) => { const w = winnerOf(id); const [a, b] = teamsFor(id); if (!w || !a || !b) return null; return w === a ? b : a; };
  return { teamsFor, winnerOf, loserOf };
}

export function scoreMarc(pred, gl, gv) {
  if (!pred || pred[0] === "" || pred[1] === "" || pred[0] == null || pred[1] == null) return 0;
  const p0 = +pred[0], p1 = +pred[1]; if (Number.isNaN(p0) || Number.isNaN(p1)) return 0;
  if (p0 === gl && p1 === gv) return PTS.exa;
  if (Math.sign(p0 - p1) === Math.sign(gl - gv)) return PTS.res;
  return 0;
}
export const hasScore = (results, id) => results[id] && typeof results[id].gl === "number" && typeof results[id].gv === "number";
export const predFor = (p, id, marc) => id.startsWith("16-") ? p.p16[+id.slice(3) - 1] : (marc[p.name] && marc[p.name][id]) || null;

export function computeAll(results, marc, gol) {
  const T = makeTree(results);
  const reached = {
    oct: ROUNDS[0].ids.map(T.winnerOf).filter(Boolean),
    cua: ROUNDS[1].ids.map(T.winnerOf).filter(Boolean),
    sem: ROUNDS[2].ids.map(T.winnerOf).filter(Boolean),
    fin: ["S-1", "S-2"].map(T.winnerOf).filter(Boolean),
  };
  const champion = T.winnerOf("F"), subc = T.loserOf("F"), tercero = T.winnerOf("3P");

  const rows = PART.map((p) => {
    const inter = (picks, set) => picks.filter((t) => set.includes(t)).length;
    const avOct = inter(p.a16, reached.oct) * PTS.oct, avCua = inter(p.l4, reached.cua) * PTS.cua;
    const avSem = inter(p.ls, reached.sem) * PTS.sem, avFin = inter(p.fin, reached.fin) * PTS.fin;
    const avCamp = champion && p.camp === champion ? PTS.camp : 0;
    const avSub = subc && p.sub === subc ? PTS.sub : 0;
    const avTer = tercero && p.ter === tercero ? PTS.ter : 0;
    const avance = avOct + avCua + avSem + avFin + avCamp + avSub + avTer;

    let mc16 = 0; ROUNDS[0].ids.forEach((id, i) => { if (hasScore(results, id)) mc16 += scoreMarc(p.p16[i], results[id].gl, results[id].gv); });
    let mcPlus = 0; PLUS_IDS.forEach((id) => { if (hasScore(results, id)) mcPlus += scoreMarc(predFor(p, id, marc), results[id].gl, results[id].gv); });
    const marcador = mc16 + mcPlus;

    const goals = (gol.goals && +gol.goals[p.name]) || 0;
    const golPts = p.goleador ? goals * PTS.gol : 0;

    return { ...p, avance, marcador, golPts, total: avance + marcador + golPts,
      d: { avOct, avCua, avSem, avFin, avCamp, avSub, avTer, mc16, mcPlus, goals } };
  });

  rows.sort((a, b) => b.total - a.total || b.avance - a.avance);
  let rank = 0, prev = null;
  rows.forEach((r, i) => { if (r.total !== prev) { rank = i + 1; prev = r.total; } r.rank = rank; });
  const decided = ALL_IDS.filter((id) => hasScore(results, id)).length;
  return { rows, reached, champion, subcampeon: subc, tercero, ...T, decided };
}
