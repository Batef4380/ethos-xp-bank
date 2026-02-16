// ═══════════════════════════════════════════
//  ETHOS API CONFIG
// ═══════════════════════════════════════════
const ETHOS_API = "https://api.ethos.network/api/v2";
const ETHOS_APP = "https://app.ethos.network";
const ETHOS_CLIENT = "ethos-xp-bank@0.1";

export function ethosProfileUrl(username) {
  return `${ETHOS_APP}/profile/x/${username}`;
}

export function ethosReviewUrl(username) {
  return `${ETHOS_APP}/profile/x/${username}/review`;
}

/**
 * Fetch user profile by Ethos Everywhere wallet address.
 * This is the address returned by Privy after "Log in with Ethos".
 */
export async function fetchUserByWallet(walletAddress) {
  const res = await fetch(`${ETHOS_API}/user/by/ethos-everywhere-wallet/${walletAddress}`, {
    headers: { "X-Ethos-Client": ETHOS_CLIENT },
  });
  if (!res.ok) throw new Error(`Ethos API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch user by X (Twitter) username — fallback / lookup.
 */
export async function fetchUserByX(xUsername) {
  const res = await fetch(`${ETHOS_API}/users/by/x`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Ethos-Client": ETHOS_CLIENT,
    },
    body: JSON.stringify({ accountIdsOrUsernames: [xUsername.replace("@", "")] }),
  });
  if (!res.ok) throw new Error(`Ethos API error: ${res.status}`);
  const data = await res.json();
  if (data.users && data.users.length > 0) return data.users[0];
  throw new Error("NOT_FOUND");
}

// ═══════════════════════════════════════════
//  ETHOS TIERS — 1000 XP increments
// ═══════════════════════════════════════════
export const TIERS = [
  { name: "Untrusted",     min: 0,    max: 799,  color: "#dc2626", limit: 0 },
  { name: "Questionable",  min: 800,  max: 1199, color: "#d4a017", limit: 1000 },
  { name: "Neutral",       min: 1200, max: 1399, color: "#c0c0c0", limit: 2000 },
  { name: "Known",         min: 1400, max: 1599, color: "#8090b0", limit: 3000 },
  { name: "Established",   min: 1600, max: 1799, color: "#4488cc", limit: 4000 },
  { name: "Reputable",     min: 1800, max: 1999, color: "#2d7dd2", limit: 5000 },
  { name: "Exemplary",     min: 2000, max: 2199, color: "#5a9a5a", limit: 6000 },
  { name: "Distinguished", min: 2200, max: 2399, color: "#1a7a3a", limit: 7000 },
  { name: "Revered",       min: 2400, max: 2599, color: "#8a6aaa", limit: 8000 },
  { name: "Renowned",      min: 2600, max: 2800, color: "#6a3d9a", limit: 9000 },
];

export function getTier(score) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (score >= TIERS[i].min) return TIERS[i];
  }
  return TIERS[0];
}

export function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}
