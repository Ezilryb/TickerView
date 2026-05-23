/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — AI Proxy  (Vercel Serverless — CommonJS)
   api/chat.js

   CORS headers sont posés au niveau infrastructure dans vercel.json.
   Ce fichier n'a besoin que de gérer le preflight OPTIONS + POST.

   Env vars → Vercel Dashboard → Settings → Environment Variables :
     GEMINI_API_KEY   clé Google AI Studio (obligatoire)
══════════════════════════════════════════════════════════════ */

const GEMINI_MODEL   = 'gemini-2.0-flash';
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

module.exports = async function handler(req, res) {

  /* ── Preflight OPTIONS ───────────────────────────────────── */
  /* vercel.json injecte déjà les headers CORS sur cette réponse */
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  /* ── Seul POST est accepté ───────────────────────────────── */
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* ── Validation du body ──────────────────────────────────── */
  const { messages, system } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages[] requis' });
  }

  /* ── Clé API — uniquement côté serveur ──────────────────── */
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[TickerAI] GEMINI_API_KEY manquante');
    return res.status(500).json({
      error: 'GEMINI_API_KEY manquante dans Vercel env vars',
    });
  }

  /* ── Construction du payload Gemini ─────────────────────── */
  const contents = [];

  if (system) {
    contents.push({
      role : 'user',
      parts: [{ text: `[Instructions système]\n${system}` }],
    });
    contents.push({
      role : 'model',
      parts: [{ text: 'Instructions reçues. Prêt.' }],
    });
  }

  for (const msg of messages) {
    contents.push({
      role : msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(msg.content) }],
    });
  }

  /* ── Appel Gemini ────────────────────────────────────────── */
  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        contents,
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
      return res.status(502).json({ error: `Erreur Gemini (${geminiRes.status})` });
    }

    const data   = await geminiRes.json();
    const text   = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const reason = data.candidates?.[0]?.finishReason;

    if (!text) {
      return res.status(200).json({
        text: `Réponse indisponible (${reason || 'UNKNOWN'}). Reformulez votre question.`,
      });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error('[TickerAI] Erreur:', err.message);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
};
