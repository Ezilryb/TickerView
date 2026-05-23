/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — News Panel Component
   src/components/NewsPanel/newsPanel.js
   v2 — accepts newsData param built by symbolRegistry
══════════════════════════════════════════════════════════════ */

const SENTIMENT_ICON  = { positive: '▲', negative: '▼', neutral: '●' };
const SENTIMENT_CLASS = { positive: 'news-sent-up', negative: 'news-sent-dn', neutral: 'news-sent-neu' };

/**
 * @param {Array} newsData - Built by symbolRegistry.buildNews()
 */
export function renderNews(newsData) {
  const el = document.getElementById('news-panel');
  if (!el || !newsData) return;

  el.innerHTML = newsData.map(n => `
    <article class="news-item">
      <div class="news-meta">
        <span class="news-source">${n.source}</span>
        <span class="news-tag">${n.tag}</span>
        <span class="news-sent ${SENTIMENT_CLASS[n.sentiment]}" title="Sentiment ${n.sentiment}">${SENTIMENT_ICON[n.sentiment]}</span>
        <span class="news-time">${n.time}</span>
      </div>
      <h4 class="news-title">${n.title}</h4>
      <p class="news-summary">${n.summary}</p>
    </article>
  `).join('');
}
