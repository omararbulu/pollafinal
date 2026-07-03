// app/api/state/route.js
// GET  -> devuelve el estado guardado (resultados, marcadores, goles)
// POST -> valida la contraseña (server-side) y guarda el estado en Airtable
// El token de Airtable vive solo en el servidor (variable de entorno).

const BASE = process.env.AIRTABLE_BASE_ID;
const TABLE = process.env.AIRTABLE_STATE_TABLE || "Estado";
const FIELD = process.env.AIRTABLE_STATE_FIELD || "data";
const TOKEN = process.env.AIRTABLE_TOKEN;
const PASS = process.env.ADMIN_PASSWORD;

const AT = () => `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;
const H = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });

async function firstRecord() {
  const res = await fetch(`${AT()}?maxRecords=1`, { headers: H(), cache: "no-store" });
  if (!res.ok) throw new Error(`Airtable GET ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return j.records && j.records[0];
}

export async function GET() {
  try {
    if (!BASE || !TOKEN) return Response.json({ ok: false, error: "Faltan variables de entorno" }, { status: 500 });
    const rec = await firstRecord();
    let state = {};
    if (rec && rec.fields && rec.fields[FIELD]) {
      try { state = JSON.parse(rec.fields[FIELD]); } catch (e) { state = {}; }
    }
    return Response.json({ ok: true, state });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!BASE || !TOKEN || !PASS) return Response.json({ ok: false, error: "Faltan variables de entorno" }, { status: 500 });
    const body = await req.json().catch(() => ({}));
    if (body.password !== PASS) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });

    const payload = JSON.stringify(body.state || {});
    const rec = await firstRecord();
    let res;
    if (rec) {
      res = await fetch(`${AT()}/${rec.id}`, { method: "PATCH", headers: H(), body: JSON.stringify({ fields: { [FIELD]: payload } }) });
    } else {
      res = await fetch(AT(), { method: "POST", headers: H(), body: JSON.stringify({ records: [{ fields: { Clave: "live", [FIELD]: payload } }] }) });
    }
    if (!res.ok) return Response.json({ ok: false, error: `Airtable ${res.status}: ${await res.text()}` }, { status: 500 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
