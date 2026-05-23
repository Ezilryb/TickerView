/* ══════════════════════════════════════════════════════════════
   TICKERVIEW — Configuration API
   src/config/api.js

   ✏️  SEUL FICHIER À MODIFIER après déploiement Vercel.
   Remplace l'URL par celle visible dans :
     Vercel Dashboard → Project → Domains

   En développement local (vercel dev) :
     export const VERCEL_BASE_URL = 'http://localhost:3000';

   FIX v2 : https:// obligatoire — sans lui, fetch() interprète
   l'URL comme un chemin relatif sur le domaine courant (GitHub Pages),
   ce qui renvoie un 405 au lieu d'atteindre Vercel.
══════════════════════════════════════════════════════════════ */

export const VERCEL_BASE_URL =
  'https://ticker-view-c2pvwld6k-betacapitaldiscord-2889s-projects.vercel.app';

/** Endpoint du proxy IA — ne pas modifier */
export const AI_ENDPOINT = `${VERCEL_BASE_URL}/api/chat`;
