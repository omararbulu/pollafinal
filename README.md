# La Polla Periquitos · Fase Final 2026

Tablero de puntajes de la polla del Mundial 2026 (fase final). Next.js + Airtable, listo para Vercel.

- **Web pública** (`/`): solo lectura — Tabla, Marcadores (matriz por partido) y Detalle.
- **Admin** (`/admin`): protegido con una contraseña simple. Carga resultados reales, marcadores progresivos y goles.
- Los pronósticos de los 5 participantes están fijos en el código (`lib/polla.js`). Lo único que cambia durante el torneo se guarda en Airtable.

## Puntaje
- **Avance** (bloqueado con el bracket enviado): octavos 3 · cuartos 5 · semis 8 · final 12 por equipo; campeón 15 · subcampeón 8 · tercero 5.
- **Marcador** (progresivo, solo score): resultado 3 · exacto 5 por partido.
- **Goleador**: 1 punto por gol.

## Cómo se guarda el estado
Todo lo que carga el admin (resultados, marcadores de octavos en adelante y goles) se guarda como un JSON en **una sola fila** de la base de Airtable *Polla Periquitos · Estado* (tabla `Estado`, campo `data`). La web pública lee de ahí. El token de Airtable vive solo en el servidor (variables de entorno), nunca se expone en el navegador.

## Variables de entorno
Copia `.env.example` a `.env.local` (para correr en tu máquina) y en Vercel configúralas en el proyecto:

| Variable | Valor |
|---|---|
| `AIRTABLE_TOKEN` | Tu Personal Access Token de Airtable (lectura + escritura) |
| `AIRTABLE_BASE_ID` | `appKZm4FZSMkadmjk` |
| `AIRTABLE_STATE_TABLE` | `Estado` |
| `AIRTABLE_STATE_FIELD` | `data` |
| `ADMIN_PASSWORD` | La contraseña que usarás en `/admin` |

## Crear el token de Airtable (paso a paso)
1. Entra a https://airtable.com/create/tokens y crea un **Personal Access Token**.
2. En **Scopes** agrega: `data.records:read` y `data.records:write`.
3. En **Access** elige la base *Polla Periquitos · Estado* (`appKZm4FZSMkadmjk`).
4. Crea el token y **cópialo** (solo se muestra una vez). Ese valor va en `AIRTABLE_TOKEN`.

## Deploy en Vercel
1. Sube esta carpeta a un repo de GitHub.
2. En Vercel: **New Project** → importa el repo (framework Next.js, detectado solo).
3. En **Environment Variables** pega las 5 variables de la tabla de arriba.
4. **Deploy**. La URL pública es el tablero; `/admin` es el panel con contraseña.

## Correr local
```bash
npm install
cp .env.example .env.local   # y completa AIRTABLE_TOKEN y ADMIN_PASSWORD
npm run dev                  # http://localhost:3000  (admin en /admin)
```

## Nota sobre la contraseña
La validación es simple (una clave comparada en el servidor). Evita ediciones casuales, suficiente para una polla entre amigos. No guardes secretos importantes con este método.
