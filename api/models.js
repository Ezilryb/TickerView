const CORS = { 'Access-Control-Allow-Origin': '*' };

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Clé manquante' });

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
  );
  const data = await r.json();
  const names = (data.models || []).map(m => m.name);
  return res.status(200).json({ models: names });
};
