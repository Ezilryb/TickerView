/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — AI Proxy
   api/chat.js  v3 — Gemini 2.0 (modèles actifs)
══════════════════════════════════════════════════════════════ */

const MODELS = [
  'gemini-1.5-flash-8b',   // free tier · RPM le plus généreux
  'gemini-1.5-flash',      // free tier · fallback
];

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const CORS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function callGemini(apiKey, model, contents) {
  const res = await fetch(`${BASE}/${model}:generateContent?key=${apiKey}`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({
      contents,
      generationConfig: { maxOutputTokens: 800, temperature: 0.65, topP: 0.9 },
    }),
  });
  return res;
}

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system } = req.body || {};
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: 'messages[] requis' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY manquante' });

    const contents = [];
    if (system) {
      contents.push({ role: 'user',  parts: [{ text: `[Système]\n${system}` }] });
      contents.push({ role: 'model', parts: [{ text: 'Compris.' }] });
    }
    for (const msg of messages) {
      contents.push({
        role : msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(msg.content) }],
      });
    }

    let geminiRes, usedModel;
    for (const model of MODELS) {
      geminiRes  = await callGemini(apiKey, model, contents);
      usedModel  = model;
      if (geminiRes.status !== 429) break;
      console.warn(`[TickerAI] 429 sur ${model}, fallback...`);
      await new Promise(r => setTimeout(r, 1000));
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[TickerAI] ${usedModel} ${geminiRes.status}:`, errText);
      if (geminiRes.status === 429) {
        return res.status(200).json({ text: 'Quota Gemini atteint. Réessaie dans quelques secondes.' });
      }
      return res.status(502).json({ error: `Erreur Gemini (${geminiRes.status})` });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ text: text || 'Réponse vide.' });

  } catch (err) {
    console.error('[TickerAI]', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
