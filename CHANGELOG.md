# Changelog

## [0.2.0] - 2026-02-19

### Added
- XP tip/send functionality — lenders can send XP directly to borrowers
- `tipXP()` API helper using Ethos `/xp/tip` endpoint
- "Send XP" button on lent loan rows
- `fmtDuration()` utility for human-readable loan durations
- `calcMaxLoan()` helper derived from credibility tier
- `cancelOffer()` — delete an open lending offer
- `fetchLoansByOfferId()` — look up loans tied to a specific offer
- `.env.example` documenting required environment variables
- Vite manual chunk splitting for better build performance

## [0.1.0] - 2026-02-16

### Added
- Initial release — Ethos XP Bank
- Twitter/X login via Privy
- Lending offer market
- Peer-to-peer XP loan creation and repayment
- Supabase persistence for offers and loans
