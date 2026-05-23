/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — AI Proxy  (Vercel Serverless Function)
   api/chat.js

   Rôle : proxy sécurisé entre le frontend (GitHub Pages)
          et l'API Google Gemini.
          La clé API ne transite JAMAIS vers le client.

   Env vars à configurer dans Vercel Dashboard :
     GEMINI_API_KEY   → clé Google AI Studio (gratuit)
     ALLOWED_ORIGIN   → https://<username>.github.io  (ou * en dev)

   Modèle utilisé : gemini-2.0-flash  (gratuit, rapide, 1M context)
══════════════════════════════════════════════════════════════ */

const GEMINI_MODEL   = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ── Helpers ─────────────────────────────────────────────── */

/**
 * Construit les headers CORS en fonction de l'origine de la requête.
 * En production : seul ALLOWED_ORIGIN est autorisé.
 * En dev local  : toutes les origines passent (ALLOWED_ORIGIN=*).
 */
function corsHeaders(reqOrigin) {
  const allowed = process.env.ALLOWED_ORIGIN || '*';
  const origin  = allowed === '*'
    ? '*'
    : (reqOrigin && reqOrigin.includes(allowed) ? reqOrigin : allowed);

  return {
    'Access-Control-Allow-Origin' : origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age'      : '86400',
  };
}

/**
 * Transforme le format "Anthropic-style" messages + system
 * vers le format natif Gemini (contents[]).
 *
 * Gemini n'a pas de champ "system" dédié dans v1beta :
 * on l'injecte comme premier échange user/model.
 */
function toGeminiContents(messages, system) {
  const contents = [];

  if (system) {
    contents.push({
      role : 'user',
      parts: [{ text: `[Contexte système — lis ces instructions avant de répondre]\n\n${system}` }],
    });
    contents.push({
      role : 'model',
      parts: [{ text: 'Instructions reçues. Je suis prêt à analyser le marché selon ce contexte.' }],
    });
  }

  for (const msg of messages) {
    contents.push({
      role : msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  return contents;
}

/* ── Main handler ─────────────────────────────────────────── */
export default async function handler(req, res) {
  const headers = corsHeaders(req.headers.origin);

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).end();
  }

  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));

  // Méthode non supportée
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validation du body
  const { messages, system } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages[] requis et non vide' });
  }

  // Clé API (strictement côté serveur)
  const apiKey = process.env.GEMINI_API_KEY1;
  if (!apiKey) {
    console.error('[TickerAI] GEMINI_API_KEY1 manquante dans les variables d\'env Vercel');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
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
          topK           : 40,
        },
        // Seuils souples pour analyses financières (termes techniques autorisés)
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });

    // Erreur upstream Gemini
    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error(`[TickerAI] Gemini ${geminiRes.status}:`, errBody);
      return res.status(502).json({
        error : 'Erreur API upstream',
        detail: geminiRes.status,
      });
    }

    const data = await geminiRes.json();

    // Extraire le texte de la réponse
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      // Gemini peut bloquer via finishReason: SAFETY ou autre
      const reason = data.candidates?.[0]?.finishReason || 'UNKNOWN';
      console.warn('[TickerAI] Réponse vide, finishReason:', reason);
      return res.status(200).json({
        text: `Réponse indisponible (${reason}). Reformulez votre question.`,
      });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error('[TickerAI] Erreur handler:', err);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}
