"use client";
import React, { useState } from "react";
import { PART, ROUNDS, PTS, idLabel, hasScore, predFor, scoreMarc } from "../lib/polla";

/* Tabla de posiciones */
export function Tabla({ C }) {
  const rows = C.rows;
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <main className="pp-main">
      <table className="lb">
        <thead><tr><th>#</th><th>Participante</th><th className="r">Avance</th><th className="r">Marcador</th><th className="r">Goleador</th><th className="r">Total</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className="lb-rk">{r.rank}</td>
              <td className="lb-nm">
                <b>{r.name}</b>
                <span className="lb-gol">{r.goleador ? <>⚽ {r.goleador}</> : "Sin goleador"}</span>
                <div className="lb-bar"><i className="av" style={{ width: `${(r.avance / max) * 100}%` }} /><i className="mc" style={{ width: `${(r.marcador / max) * 100}%` }} /><i className="gl" style={{ width: `${(r.golPts / max) * 100}%` }} /></div>
              </td>
              <td className="r c-av">{r.avance}</td>
              <td className="r c-mc">{r.marcador}</td>
              <td className="r c-gl">{r.golPts}</td>
              <td className="r lb-tot">{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pp-legend"><i className="av" /> Avance <i className="mc" /> Marcador <i className="gl" /> Goleador</div>
    </main>
  );
}

/* Matriz de marcadores partido × participante */
export function Marcadores({ C, results, marc }) {
  const cell = (p, id) => {
    const pred = predFor(p, id, marc);
    const txt = pred && pred[0] !== "" && pred[0] != null ? `${pred[0]}-${pred[1]}` : "·";
    if (!hasScore(results, id)) return <td key={p.name} className="mx-cell"><span className="mx-pred">{txt}</span></td>;
    const pts = scoreMarc(pred, results[id].gl, results[id].gv);
    const cls = pts === 5 ? "ex" : pts === 3 ? "ok" : "no";
    return <td key={p.name} className={`mx-cell ${cls}`}><span className="mx-pred">{txt}</span><span className="mx-pts">{pts}</span></td>;
  };
  const totalMc = (p) => { const r = C.rows.find((x) => x.name === p.name); return r ? r.marcador : 0; };
  return (
    <main className="pp-main">
      <p className="pp-hint">Marcador pronosticado por cada participante en cada partido. Al jugarse, la celda muestra los puntos: <b className="t-ex">5</b> exacto, <b className="t-ok">3</b> resultado, <span className="t-no">0</span> falla. Los puntos por pasar de fase no se cuentan acá.</p>
      <div className="mx-wrap">
        <table className="mx">
          <thead><tr><th className="mx-h-match">Partido</th><th className="mx-h-real">Final</th>{PART.map((p) => <th key={p.name} className="mx-h-p">{p.name}</th>)}</tr></thead>
          {ROUNDS.map((rd) => (
            <tbody key={rd.key}>
              <tr className="mx-band"><td colSpan={2 + PART.length}>{rd.label}</td></tr>
              {rd.ids.map((id) => {
                const [a, b] = C.teamsFor(id); const played = hasScore(results, id);
                const real = played ? `${results[id].gl}-${results[id].gv}` : null; const adv = C.winnerOf(id);
                return (
                  <tr key={id} className={played ? "played" : ""}>
                    <td className="mx-match"><span className="mx-mid">{idLabel(id)}</span><span className="mx-teams">{a || "Por definir"} <i>vs</i> {b || "Por definir"}</span>{adv && <span className="mx-adv">avanza {adv}</span>}</td>
                    <td className="mx-real">{real || <span className="mx-pending">—</span>}</td>
                    {PART.map((p) => cell(p, id))}
                  </tr>
                );
              })}
            </tbody>
          ))}
          <tfoot><tr className="mx-tot"><td className="mx-match"><b>Total marcador</b></td><td></td>{PART.map((p) => <td key={p.name} className="mx-totc">{totalMc(p)}</td>)}</tr></tfoot>
        </table>
      </div>
    </main>
  );
}

/* Detalle por jugador */
export function Detalle({ C }) {
  const rows = C.rows;
  const [sel, setSel] = useState(rows[0].name);
  const r = rows.find((x) => x.name === sel) || rows[0];
  const tier = (label, picks, set, pe) => (
    <div className="dt-tier">
      <div className="dt-th">{label} <span>{picks.filter((t) => set.includes(t)).length}/{picks.length} aciertos · {pe} c/u</span></div>
      <div className="dt-chips">{picks.map((t, i) => <span key={t + i} className={`dt-chip ${set.includes(t) ? "hit" : "miss"}`}>{t}</span>)}</div>
    </div>
  );
  const bonus = (label, pick, real, pts) => (
    <div className={`dt-bonus ${real ? (pick === real ? "hit" : "miss") : "wait"}`}><span>{label}</span><b>{pick || "—"}</b><i>{real ? (pick === real ? `+${pts}` : "0") : "pendiente"}</i></div>
  );
  return (
    <main className="pp-main">
      <div className="dt-tabs">{rows.map((p) => <button key={p.name} className={sel === p.name ? "on" : ""} onClick={() => setSel(p.name)}>{p.name}</button>)}</div>
      <div className="dt-head">
        <div><div className="dt-tot">{r.total}<span>pts</span></div><div className="dt-rk">{r.rank}° lugar</div></div>
        <div className="dt-break">
          <div><b className="c-av">{r.avance}</b><span>Avance</span></div>
          <div><b className="c-mc">{r.marcador}</b><span>Marcador</span></div>
          <div><b className="c-gl">{r.golPts}</b><span>Goleador</span></div>
        </div>
      </div>
      {tier("Llegan a octavos", r.a16, C.reached.oct, PTS.oct)}
      {tier("Llegan a cuartos", r.l4, C.reached.cua, PTS.cua)}
      {tier("Llegan a semifinales", r.ls, C.reached.sem, PTS.sem)}
      {tier("Finalistas", r.fin, C.reached.fin, PTS.fin)}
      <div className="dt-bonuses">
        {bonus("Campeón (+15)", r.camp, C.champion, 15)}
        {bonus("Subcampeón (+8)", r.sub, C.subcampeon, 8)}
        {bonus("Tercero (+5)", r.ter, C.tercero, 5)}
      </div>
      <div className="dt-foot">Goleador elegido: <b>{r.goleador || "—"}</b> · {r.d.goals} gol(es) · suma <b>{r.golPts}</b> pts (1 por gol)</div>
    </main>
  );
}
