/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — AI Proxy  (Vercel Serverless — CommonJS)
   api/chat.js  v4 — CORS bulletproof

   CORS posé EN PREMIER sur chaque chemin de code, y compris
   les erreurs non catchées via un wrapper try/finally global.
══════════════════════════════════════════════════════════════ */

const GEMINI_MODEL   = 'gemini-2.0-flash';
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age'      : '86400',
};

function setCors(res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
}

module.exports = async function handler(req, res) {

  /* ── CORS : TOUJOURS en premier, avant tout le reste ──────── */
  setCors(res);

  /* ── Preflight OPTIONS ────────────────────────────────────── */
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  /* ── Seul POST accepté ────────────────────────────────────── */
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    /* ── Validation du body ─────────────────────────────────── */
    const { messages, system } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages[] requis' });
    }

    /* ── Clé API ────────────────────────────────────────────── */
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[TickerAI] GEMINI_API_KEY manquante');
      return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur Vercel' });
    }

    /* ── Payload Gemini ─────────────────────────────────────── */
    const contents = [];
    if (system) {
      contents.push({ role: 'user',  parts: [{ text: `[Système]\n${system}` }] });
      contents.push({ role: 'model', parts: [{ text: 'OK.' }] });
    }
    for (const msg of messages) {
      contents.push({
        role : msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(msg.content) }],
      });
    }

    /* ── Appel Gemini ───────────────────────────────────────── */
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1000, temperature: 0.65, topP: 0.9 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[TickerAI] Gemini ${geminiRes.status}:`, errText);
      return res.status(502).json({ error: `Erreur Gemini (${geminiRes.status})` });
    }

    const data   = await geminiRes.json();
    const text   = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const reason = data.candidates?.[0]?.finishReason;

    return res.status(200).json({
      text: text || `Réponse vide (${reason || 'UNKNOWN'}). Reformulez.`,
    });

  } catch (err) {
    /* ── Catch global — CORS déjà posé, on répond proprement ── */
    console.error('[TickerAI] Erreur catch global:', err.message);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
};
