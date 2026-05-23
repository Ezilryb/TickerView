/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Configuration API
   src/config/api.js

   ✏️  SEUL FICHIER À MODIFIER après déploiement Vercel.
   Remplace VERCEL_PROJECT_URL par l'URL de ton projet Vercel,
   visible dans : Vercel Dashboard → Project → Domains

   Exemple :
     export const VERCEL_BASE_URL = 'https://tickerview-api.vercel.app';

   En développement local (vercel dev) :
     export const VERCEL_BASE_URL = 'http://localhost:3000';
══════════════════════════════════════════════════════════════ */

export const VERCEL_BASE_URL = 'ticker-view-c2pvwld6k-betacapitaldiscord-2889s-projects.vercel.app';

/** Endpoint du proxy IA — ne pas modifier */
export const AI_ENDPOINT = `${VERCEL_BASE_URL}/api/chat`;
