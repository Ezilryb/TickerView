/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — AI Proxy
   api/chat.js  v4 — Gemini 1.5 free tier uniquement
══════════════════════════════════════════════════════════════ */

const MODELS = [
  'gemini-1.5-flash-8b',  // free tier · quota le plus généreux
  'gemini-1.5-flash',     // free tier · fallback
];

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const CORS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function callGemini(apiKey, model, contents) {
  return fetch(`${BASE}/${model}:generateContent?key=${apiKey}`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({
      contents,
      generationConfig: { maxOutputTokens: 800, temperature: 0.65, topP: 0.9 },
    }),
  });
}

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system } = req.body || {};
    if (!Array.isArray(messages) || !messages.length)
      return res.status(400).json({ error: 'messages[] requis' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY manquante sur Vercel' });

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

    let geminiRes, usedModel, lastErr = '';

    for (const model of MODELS) {
      geminiRes = await callGemini(apiKey, model, contents);
      usedModel = model;

      if (geminiRes.status === 429) {
        lastErr = await geminiRes.text().catch(() => '429');
        console.warn(`[TickerAI] 429 ${model}:`, lastErr);
        await new Promise(r => setTimeout(r, 1200));
        continue;
      }
      break;
    }

    if (geminiRes.status === 429) {
      console.error('[TickerAI] Tous les modèles en 429. Body:', lastErr);
      return res.status(200).json({
        text: `⚠️ Quota temporaire atteint sur tous les modèles. Vérifie que l'API "Generative Language" est bien activée sur ton projet Google Cloud, et que la clé n'est pas restreinte par IP. Détail : ${lastErr.slice(0, 120)}`,
      });
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[TickerAI] ${usedModel} ${geminiRes.status}:`, errText);
      return res.status(502).json({ error: `Erreur Gemini ${geminiRes.status} — ${errText.slice(0, 200)}` });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text: text || 'Réponse vide.' });

  } catch (err) {
    console.error('[TickerAI]', err.message);
    return res.status(500).json({ error: 'Erreur serveur : ' + err.message });
  }
};
