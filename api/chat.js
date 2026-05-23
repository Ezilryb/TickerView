/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — AI Proxy  (Vercel Serverless Function)
   api/chat.js  — CommonJS (requis par Vercel Node.js runtime)

   Env vars Vercel Dashboard → Settings → Environment Variables :
     GEMINI_API_KEY   → clé Google AI Studio (gratuit)
     ALLOWED_ORIGIN   → https://<username>.github.io  (ou * en dev)
══════════════════════════════════════════════════════════════ */

const GEMINI_MODEL   = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ── CORS ──────────────────────────────────────────────────── */
function setCors(req, res) {
  const allowed = process.env.ALLOWED_ORIGIN || '*';
  const origin  = req.headers.origin || '';
  const header  = allowed === '*' ? '*' : (origin.includes(allowed) ? origin : allowed);

  res.setHeader('Access-Control-Allow-Origin',  header);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age',       '86400');
}

/* ── Format Gemini ─────────────────────────────────────────── */
function toGeminiContents(messages, system) {
  const contents = [];

  if (system) {
    contents.push({ role: 'user',  parts: [{ text: `[Instructions]\n${system}` }] });
    contents.push({ role: 'model', parts: [{ text: 'Instructions reçues. Prêt à analyser.' }] });
  }

  for (const msg of messages) {
    contents.push({
      role : msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  return contents;
}

/* ── Handler principal ─────────────────────────────────────── */
module.exports = async function handler(req, res) {
  setCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Méthode non supportée
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validation
  const { messages, system } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages[] requis' });
  }

  // Clé API — uniquement côté serveur
  const apiKey = process.env.GEMINI_API_KEY1;
  if (!apiKey) {
    console.error('[TickerAI] GEMINI_API_KEY1 manquante dans Vercel env vars');
    return res.status(500).json({ error: 'Config serveur incomplète — GEMINI_API_KEY1 manquante' });
  }

  // Appel Gemini
  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        contents: toGeminiContents(messages, system),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature    : 0.65,
          topP           : 0.9,
        },
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
      return res.status(502).json({ error: `Erreur Gemini upstream (${geminiRes.status})` });
    }

    const data  = await geminiRes.json();
    const text  = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const reason = data.candidates?.[0]?.finishReason;

    if (!text) {
      console.warn('[TickerAI] Réponse vide, finishReason:', reason);
      return res.status(200).json({
        text: `Réponse indisponible (${reason || 'UNKNOWN'}). Reformulez votre question.`,
      });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error('[TickerAI] Erreur handler:', err.message);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
};
