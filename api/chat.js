const GEMINI_MODEL   = 'gemini-2.0-flash';
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CORS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function cors(res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
}

module.exports = async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();   // 200, pas 204
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body || {};
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: 'messages[] requis' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY manquante' });
    }

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

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1000, temperature: 0.65, topP: 0.9 },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error(`[Gemini] ${geminiRes.status}:`, err);
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
