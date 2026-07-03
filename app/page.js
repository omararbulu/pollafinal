"use client";
import React, { useState, useEffect, useMemo } from "react";
import { computeAll, DEFAULT_RESULTS } from "../lib/polla";
import { Tabla, Marcadores, Detalle } from "../components/views";

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState(DEFAULT_RESULTS);
  const [marc, setMarc] = useState({});
  const [gol, setGol] = useState({ goals: {}, top: "" });
  const [tab, setTab] = useState("tabla");

  const load = async () => {
    try {
      const r = await fetch("/api/state", { cache: "no-store" });
      const j = await r.json();
      const s = (j && j.ok && j.state) || {};
      setResults(s.results && Object.keys(s.results).length ? s.results : DEFAULT_RESULTS);
      setMarc(s.marc || {});
      setGol(s.gol || { goals: {}, top: "" });
    } catch (e) { /* usa defaults */ }
    setLoaded(true);
  };
  useEffect(() => { load(); }, []);

  const C = useMemo(() => computeAll(results, marc, gol), [results, marc, gol]);
  if (!loaded) return <div className="ppload">Cargando tablero…</div>;

  const TABS = [["tabla", "Tabla"], ["marcadores", "Marcadores"], ["detalle", "Detalle"]];
  return (
    <div className="pp">
      <header className="pp-head">
        <div className="pp-head-l">
          <div className="pp-badge">PP</div>
          <div><h1>La Polla Periquitos</h1><p>Fase Final · Mundial 2026</p></div>
        </div>
        <div className="pp-head-r">
          <span className="pp-prog">{C.decided}/32 partidos jugados</span>
          <button className="pp-link" onClick={load} title="Actualizar">↻ Actualizar</button>
          <a className="pp-link" href="/admin">Admin</a>
        </div>
      </header>

      <nav className="pp-tabs">
        {TABS.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </nav>

      {tab === "tabla" && <Tabla C={C} />}
      {tab === "marcadores" && <Marcadores C={C} results={results} marc={marc} />}
      {tab === "detalle" && <Detalle C={C} />}

      <footer className="pp-foot">
        Avance: octavos 3 · cuartos 5 · semis 8 · final 12 · campeón 15 · subcampeón 8 · tercero 5 &nbsp;|&nbsp;
        Marcador: resultado 3 · exacto 5 &nbsp;|&nbsp; Goleador: 1 por gol
      </footer>
    </div>
  );
}
