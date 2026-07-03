"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { computeAll, DEFAULT_RESULTS, ROUNDS, PART, PTS, idLabel, hasScore, scoreMarc } from "../../lib/polla";

export default function AdminPage() {
  const [loaded, setLoaded] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [results, setResults] = useState(DEFAULT_RESULTS);
  const [marc, setMarc] = useState({});
  const [gol, setGol] = useState({ goals: {}, top: "" });
  const [saveState, setSaveState] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/state", { cache: "no-store" });
        const j = await r.json();
        const s = (j && j.ok && j.state) || {};
        setResults(s.results && Object.keys(s.results).length ? s.results : DEFAULT_RESULTS);
        setMarc(s.marc || {});
        setGol(s.gol || { goals: {}, top: "" });
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const C = useMemo(() => computeAll(results, marc, gol), [results, marc, gol]);

  const save = useCallback(async (next) => {
    setSaveState("Guardando…");
    try {
      const r = await fetch("/api/state", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, state: next }),
      });
      if (r.status === 401) { setSaveState("Contraseña incorrecta"); setAuthed(false); return false; }
      if (!r.ok) {
        let detail = "";
        try { const j = await r.json(); detail = j && j.error ? ` (${j.error})` : ""; } catch (e) {}
        setSaveState(`Error del servidor${detail || ` (${r.status})`}`);
        return false;
      }
      setSaveState("Guardado ✓");
      setTimeout(() => setSaveState(""), 1500);
      return true;
    } catch (e) { setSaveState("Error de red"); return false; }
  }, [pass]);

  const commit = (nextResults = results, nextMarc = marc, nextGol = gol) =>
    save({ results: nextResults, marc: nextMarc, gol: nextGol });

  // gate: intenta guardar el estado actual; el mensaje de error queda fijado por save()
  const tryEnter = async () => {
    const ok = await save({ results, marc, gol });
    if (ok) setAuthed(true);
  };

  if (!loaded) return <div className="ppload">Cargando…</div>;

  return (
    <div className="pp">
      <header className="pp-head">
        <div className="pp-head-l">
          <div className="pp-badge">PP</div>
          <div><h1>Administrador</h1><p>La Polla Periquitos · Fase Final</p></div>
        </div>
        <div className="pp-head-r">
          {authed && <span className={`ad-save ${saveState.includes("✓") ? "ok" : ""}`}>{saveState}</span>}
          <a className="pp-link" href="/">Ver tablero</a>
        </div>
      </header>

      {!authed
        ? <Gate pass={pass} setPass={setPass} onEnter={tryEnter} msg={saveState} />
        : <Editors C={C} results={results} marc={marc} gol={gol}
            setResults={setResults} setMarc={setMarc} setGol={setGol} commit={commit} />}
    </div>
  );
}

function Gate({ pass, setPass, onEnter, msg }) {
  return (
    <main className="pp-main">
      <div className="gate">
        <div className="gate-ic">🔒</div>
        <h2>Acceso de administrador</h2>
        <p>Ingresa la contraseña para cargar resultados, marcadores y goles. La web pública es de solo lectura.</p>
        <div className="gate-row">
          <input type="password" value={pass} placeholder="Contraseña" autoFocus
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()} />
          <button onClick={onEnter}>Entrar</button>
        </div>
        {msg && msg !== "Guardando…" && <div className="gate-err">{msg}</div>}
        {msg === "Guardando…" && <div className="mut" style={{ marginTop: 12, fontSize: 13 }}>Verificando…</div>}
      </div>
    </main>
  );
}

function Editors({ C, results, marc, gol, setResults, setMarc, setGol, commit }) {
  const [sec, setSec] = useState("res");
  const [resRound, setResRound] = useState("16");
  const [marcRound, setMarcRound] = useState("8");
  const rd = ROUNDS.find((r) => r.key === resRound);
  const mrd = ROUNDS.find((r) => r.key === marcRound);
  const marcTabs = ROUNDS.filter((r) => r.key !== "16");

  const setScore = (id, side, raw) => {
    const v = raw === "" ? undefined : Math.max(0, Math.min(30, parseInt(raw, 10) || 0));
    const next = { ...results, [id]: { ...(results[id] || {}), [side]: v } };
    const r = next[id];
    if (typeof r.gl === "number" && typeof r.gv === "number" && r.gl !== r.gv) {
      const [a, b] = C.teamsFor(id); r.adv = r.gl > r.gv ? a : b;
    }
    setResults(next); commit(next, marc, gol);
  };
  const setAdv = (id, team) => { const next = { ...results, [id]: { ...(results[id] || {}), adv: team } }; setResults(next); commit(next, marc, gol); };
  const setMarcPred = (name, id, side, raw) => {
    const v = raw === "" ? "" : Math.max(0, Math.min(30, parseInt(raw, 10) || 0));
    const pm = marc[name] || {}; const cellv = pm[id] || ["", ""];
    const nc = side === 0 ? [v, cellv[1]] : [cellv[0], v];
    const next = { ...marc, [name]: { ...pm, [id]: nc } };
    setMarc(next); commit(results, next, gol);
  };
  const setGoals = (name, raw) => {
    const v = raw === "" ? "" : Math.max(0, parseInt(raw, 10) || 0);
    const next = { ...gol, goals: { ...gol.goals, [name]: v } };
    setGol(next); commit(results, marc, next);
  };

  return (
    <main className="pp-main">
      <div className="ad-bar">
        <div className="ad-secs">
          {[["res", "Resultados"], ["marc", "Marcadores"], ["gol", "Goleador"]].map(([k, l]) =>
            <button key={k} className={sec === k ? "on" : ""} onClick={() => setSec(k)}>{l}</button>)}
        </div>
      </div>

      {sec === "res" && <>
        <p className="pp-hint">Carga el marcador real y quién avanza. Los cruces de la siguiente ronda se arman solos con los ganadores. En empate, elige el clasificado (penales).</p>
        <div className="pp-seg">{ROUNDS.map((r) => <button key={r.key} className={resRound === r.key ? "on" : ""} onClick={() => setResRound(r.key)}>{r.label}</button>)}</div>
        {rd.ids.map((id) => {
          const [a, b] = C.teamsFor(id); const r = results[id] || {}; const w = C.winnerOf(id);
          return (
            <div className="ad-mr" key={id}>
              <div className="ad-mr-id">{idLabel(id)}</div>
              <div className="ad-mr-body">
                <div className={`ad-team ${w && w === a ? "win" : ""}`}>{a || <em>Por definir</em>}</div>
                <input className="ad-sc" inputMode="numeric" value={r.gl ?? ""} disabled={!a || !b} onChange={(e) => setScore(id, "gl", e.target.value)} />
                <span className="ad-x">-</span>
                <input className="ad-sc" inputMode="numeric" value={r.gv ?? ""} disabled={!a || !b} onChange={(e) => setScore(id, "gv", e.target.value)} />
                <div className={`ad-team r ${w && w === b ? "win" : ""}`}>{b || <em>Por definir</em>}</div>
              </div>
              {a && b && <div className="ad-adv"><span>Avanza:</span>
                <button className={w === a ? "on" : ""} onClick={() => setAdv(id, a)}>{a}</button>
                <button className={w === b ? "on" : ""} onClick={() => setAdv(id, b)}>{b}</button>
              </div>}
            </div>
          );
        })}
      </>}

      {sec === "marc" && <>
        <p className="pp-hint">Marcadores que cada uno manda al formarse el cruce (solo suman por score). Los de 16avos ya están cargados.</p>
        <div className="pp-seg">{marcTabs.map((r) => <button key={r.key} className={marcRound === r.key ? "on" : ""} onClick={() => setMarcRound(r.key)}>{r.label}</button>)}</div>
        {mrd.ids.map((id) => {
          const [a, b] = C.teamsFor(id);
          if (!a || !b) return <div className="ad-mcard pending" key={id}><b>{idLabel(id)}</b> · <span className="mut">cruce aún no definido</span></div>;
          const real = hasScore(results, id) ? `${results[id].gl}-${results[id].gv}` : null;
          return (
            <div className="ad-mcard" key={id}>
              <div className="ad-mcard-h"><b>{a}</b> vs <b>{b}</b> {real && <span className="ad-real">final {real}</span>}</div>
              <div className="ad-mgrid">
                {PART.map((p) => {
                  const cellv = (marc[p.name] && marc[p.name][id]) || ["", ""];
                  const pts = real ? scoreMarc(cellv, results[id].gl, results[id].gv) : null;
                  return (
                    <div className="ad-mgrow" key={p.name}>
                      <span className="ad-mgn">{p.name}</span>
                      <input className="ad-sc sm" inputMode="numeric" value={cellv[0]} onChange={(e) => setMarcPred(p.name, id, 0, e.target.value)} />
                      <span className="ad-x">-</span>
                      <input className="ad-sc sm" inputMode="numeric" value={cellv[1]} onChange={(e) => setMarcPred(p.name, id, 1, e.target.value)} />
                      {pts != null && <span className={`ad-mpts ${pts === 5 ? "ex" : pts === 3 ? "ok" : "no"}`}>{pts}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>}

      {sec === "gol" && <>
        <p className="pp-hint">Goles de cada goleador elegido en la fase final (1 punto por gol).</p>
        <table className="lb">
          <thead><tr><th>Participante</th><th>Goleador</th><th className="r">Goles</th><th className="r">Puntos</th></tr></thead>
          <tbody>
            {PART.map((p) => {
              const goals = (gol.goals && gol.goals[p.name]) ?? "";
              const pts = p.goleador ? (+goals || 0) * PTS.gol : 0;
              return (
                <tr key={p.name}>
                  <td className="lb-nm"><b>{p.name}</b></td>
                  <td>{p.goleador || <span className="mut">— sin goleador —</span>}</td>
                  <td className="r">{p.goleador ? <input className="ad-sc" inputMode="numeric" value={goals} onChange={(e) => setGoals(p.name, e.target.value)} /> : <span className="mut">—</span>}</td>
                  <td className="r lb-tot">{pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>}
    </main>
  );
}
