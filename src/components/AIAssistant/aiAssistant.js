/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — AI Assistant Component
   src/components/AIAssistant/aiAssistant.js
   v4 — Proxy Vercel + Google Gemini (modèle gratuit)

   Flux :
     Frontend (GitHub Pages)
       → POST /api/chat  (Vercel)
         → Google Gemini API  (clé serveur, jamais exposée)
           → réponse texte  → affiché dans l'interface
══════════════════════════════════════════════════════════════ */

import { AI_ENDPOINT } from '../../config/api.js';

const SUGGESTED = [
  'Analyse le setup technique actuel',
  'Zones de support/résistance clés ?',
  'Que dit le volume aujourd\'hui ?',
  'Risque/reward si je trade long ?',
];

/* ── Constantes UI ───────────────────────────────────────── */
const ERROR_MESSAGES = {
  network : 'Connexion au proxy impossible. Vérifie ta connexion ou l\'URL Vercel dans src/config/api.js.',
  server  : 'Erreur serveur (proxy Vercel). Vérifie que GEMINI_API_KEY1 est configurée dans les variables d\'env Vercel.',
  timeout : 'Délai dépassé. L\'API Gemini met parfois quelques secondes — réessaie.',
  default : 'Erreur inattendue. Consulte la console pour le détail.',
};

/**
 * @param {object} STOCK - Symbol data from symbolRegistry.getSymbolData()
 */
export function initAIAssistant(STOCK) {
  const panel = document.getElementById('ai-panel');
  if (!panel || !STOCK) return;

  const input     = panel.querySelector('#ai-input');
  const sendBtn   = panel.querySelector('#ai-send');
  const msgs      = panel.querySelector('#ai-messages');
  const suggestEl = panel.querySelector('#ai-suggestions');

  /* ── Prompt système dynamique par symbole ────────────────── */
  const fmtPrice = v => v > 100
    ? `$${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${v.toFixed(4)}`;

  const SYSTEM_PROMPT = `Tu es TickerAI, un assistant d'analyse financière expert intégré dans TickerView — terminal d'analyse orderflow pour traders professionnels. Tu es concis, précis, et tu parles le langage des traders (orderflow, delta, VAH/VAL, POC, imbalances, CVD, VRVP, etc.).

Contexte marché actuel :
- Symbole    : ${STOCK.sym} (${STOCK.name})
- Exchange   : ${STOCK.exchange} · Secteur : ${STOCK.sector}
- Prix       : ${fmtPrice(STOCK.price)} (${STOCK.changePct > 0 ? '+' : ''}${STOCK.changePct}%)
- OHLC       : O ${fmtPrice(STOCK.open)} | H ${fmtPrice(STOCK.high)} | L ${fmtPrice(STOCK.low)} | Préc. ${fmtPrice(STOCK.prevClose)}
- Volume     : ${STOCK.volume} (moy. ${STOCK.avgVolume})
- Market Cap : ${STOCK.marketCap}
- P/E        : ${STOCK.pe !== '—' ? STOCK.pe + '×' : 'N/A'} | EPS : ${STOCK.eps !== '—' ? '$' + STOCK.eps : 'N/A'} | Beta : ${STOCK.beta}
- 52W High   : ${fmtPrice(STOCK.week52High)} | 52W Low : ${fmtPrice(STOCK.week52Low)}

Règles de réponse :
- Réponds TOUJOURS en français
- 2 à 4 phrases maximum, sauf si l'utilisateur demande une analyse détaillée
- Utilise des données chiffrées concrètes tirées du contexte ci-dessus
- Structure tes réponses avec des niveaux de prix précis quand pertinent
- Si tu n'as pas assez d'informations, dis-le clairement plutôt que d'inventer`;

  /* ── Message de bienvenue ────────────────────────────────── */
  const WELCOME = `TickerAI connecté sur **${STOCK.sym}** (${STOCK.name}). \
Prix actuel **${fmtPrice(STOCK.price)}** (${STOCK.changePct > 0 ? '+' : ''}${STOCK.changePct}%), \
volume ${STOCK.volume} vs moy. ${STOCK.avgVolume}. \
Posez une question sur la configuration technique, les niveaux-clés ou l'orderflow.`;

  /* ── Historique de conversation ──────────────────────────── */
  const history = [];

  /* ── Init ────────────────────────────────────────────────── */
  appendAssistantMessage(msgs, WELCOME, true);
  renderSuggestions();

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  /* ── Envoi d'un message ──────────────────────────────────── */
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    input.value = '';
    suggestEl.style.display = 'none';
    sendBtn.disabled = true;

    appendUserMessage(msgs, text);
    history.push({ role: 'user', content: text });

    const thinkingEl = appendThinking(msgs);

    try {
      /* ── Appel au proxy Vercel (pas directement à Gemini) ── */
      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 20_000);

      const res = await fetch(AI_ENDPOINT, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal : controller.signal,
        body   : JSON.stringify({
          system  : SYSTEM_PROMPT,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || `HTTP ${res.status}`);
      }

      const { text: reply } = await res.json();

      resolveThinking(thinkingEl, reply || ERROR_MESSAGES.default);
      history.push({ role: 'assistant', content: reply });

    } catch (err) {
      const msg = err.name === 'AbortError'
        ? ERROR_MESSAGES.timeout
        : err.message?.includes('fetch')
          ? ERROR_MESSAGES.network
          : err.message?.includes('500')
            ? ERROR_MESSAGES.server
            : ERROR_MESSAGES.default;

      resolveThinking(thinkingEl, msg);
      console.error('[TickerAI]', err);

    } finally {
      sendBtn.disabled = false;
      msgs.scrollTop   = msgs.scrollHeight;
    }
  }

  /* ── Suggestions rapides ─────────────────────────────────── */
  function renderSuggestions() {
    suggestEl.innerHTML = SUGGESTED.map(s =>
      `<button class="ai-suggest">${s}</button>`
    ).join('');
    suggestEl.querySelectorAll('.ai-suggest').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.textContent;
        sendMessage();
      });
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   DOM HELPERS
══════════════════════════════════════════════════════════════ */

function appendUserMessage(container, text) {
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-user';
  div.innerHTML = `
    <span class="ai-msg-role">Vous</span>
    <span class="ai-msg-text">${escHtml(text)}</span>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendAssistantMessage(container, text, isWelcome = false) {
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-assistant';
  div.innerHTML = `
    <span class="ai-msg-role">
      <span class="ai-dot" aria-hidden="true"></span>TickerAI
    </span>
    <span class="ai-msg-text${isWelcome ? ' ai-welcome-text' : ''}">${renderMarkdown(text)}</span>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function appendThinking(container) {
  const div = document.createElement('div');
  div.className = 'ai-msg ai-msg-assistant';
  div.innerHTML = `
    <span class="ai-msg-role">
      <span class="ai-dot" aria-hidden="true"></span>TickerAI
    </span>
    <span class="ai-msg-text"><span class="ai-spinner" aria-label="Analyse en cours">···</span></span>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function resolveThinking(el, text) {
  el.querySelector('.ai-msg-text').innerHTML = renderMarkdown(text);
}

/* Markdown minimal : **gras** et retours à la ligne */
function renderMarkdown(text) {
  return escHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g,       '<code style="font-family:var(--font-mono);font-size:10px;background:var(--accent-dim);padding:1px 4px;">$1</code>')
    .replace(/\n/g, '<br>');
}

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
