# Ethos XP Bank

Reputation-backed XP lending on [Ethos Network](https://ethos.network). No interest. Built on trust.

## How it works

1. **Sign in with Ethos** — Privy handles cross-app authentication, verifying your Ethos identity cryptographically
2. **Your tier determines your borrow limit** — Each Ethos credibility tier unlocks +1,000 XP borrowing capacity
3. **Lend or borrow XP** — Zero interest, peer-to-peer
4. **Review & Gift** — After repayment, leave a review on Ethos and optionally send a gift

## Tier Borrow Limits

| Tier | Score Range | Borrow Limit |
|------|-----------|-------------|
| Untrusted | 0–799 | 🔒 Locked |
| Questionable | 800–1199 | 1,000 XP |
| Neutral | 1200–1399 | 2,000 XP |
| Known | 1400–1599 | 3,000 XP |
| Established | 1600–1799 | 4,000 XP |
| Reputable | 1800–1999 | 5,000 XP |
| Exemplary | 2000–2199 | 6,000 XP |
| Distinguished | 2200–2399 | 7,000 XP |
| Revered | 2400–2599 | 8,000 XP |
| Renowned | 2600–2800 | 9,000 XP |

## Setup

### 1. Create a Privy App

1. Go to [dashboard.privy.io](https://dashboard.privy.io)
2. Create a new app (or select existing)
3. Go to **Global Settings → Integrations**
4. Find **Ethos Network** and **enable it**
5. Copy your **App ID**

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and paste your Privy App ID:

```
VITE_PRIVY_APP_ID=your-actual-privy-app-id
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

When prompted, set the environment variable:
- `VITE_PRIVY_APP_ID` = your Privy App ID

Or add it in Vercel Dashboard → Settings → Environment Variables.

## Tech Stack

- **React 18** + **Vite**
- **Privy** — Cross-app authentication (Log in with Ethos)
- **Ethos API v2** — User profiles, credibility scores, XP data

## Auth Flow

```
User clicks "Sign in with Ethos"
  → Privy opens Ethos cross-app auth
  → User authorizes on Ethos domain
  → Privy returns Ethos Everywhere wallet address
  → App calls GET /api/v2/user/by/ethos-everywhere-wallet/{address}
  → Full Ethos profile loaded (score, XP, stats, avatar)
```

## Project Structure

```
src/
├── main.jsx          # Entry point, PrivyProvider wrapper
├── App.jsx           # Main app (login, dashboard, market, loans)
├── ethos.js          # Ethos API helpers, tier system
├── useEthosUser.js   # Custom hook: Privy auth → Ethos profile
└── components.jsx    # Reusable UI components
```

## API Endpoints Used

- `GET /api/v2/user/by/ethos-everywhere-wallet/{address}` — Fetch profile after Privy login
- `POST /api/v2/users/by/x` — Lookup by X username (fallback)

All requests include `X-Ethos-Client: ethos-xp-bank@0.1` header.

## License

MIT
