/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Ping / Health-check
   api/ping.js

   Utilisation : ouvre dans le navigateur
     https://ticker-view-c2pvwld6k-betacapitaldiscord-2889s-projects.vercel.app/api/ping
   Doit retourner : { "ok": true, "env": true/false }
   Si "env": false → GEMINI_API_KEY non configurée sur Vercel.
   Si 404 → le fichier n'a pas été déployé.
══════════════════════════════════════════════════════════════ */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(204).end();
  return res.status(200).json({
    ok  : true,
    env : !!process.env.GEMINI_API_KEY,
    ts  : new Date().toISOString(),
  });
};
