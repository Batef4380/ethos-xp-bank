import { useState, useEffect, useCallback } from "react";
import { useEthosUser } from "./useEthosUser";
import { getTier, fmtNum, TIERS, ethosProfileUrl, ethosReviewUrl, tipXP } from "./ethos";
import {
  AvatarRing, TierBadge, SlashBadge, Stat, Overlay,
  lbl, inp, btnGreen, btnGreenFull, btnOutline,
} from "./components";
import {
  fetchOffers as dbFetchOffers,
  createOffer as dbCreateOffer,
  borrowOffer as dbBorrowOffer,
  fetchLoans as dbFetchLoans,
  createLoan as dbCreateLoan,
  repayLoan as dbRepayLoan,
} from "./db";

// ═══════════════════════════════════════════
//  LOGIN SCREEN
// ═══════════════════════════════════════════
function LoginScreen({ onLogin, loading, error }) {
  const [h, setH] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", background: "#08080f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: "0 24px", animation: "fadeUp 0.6s ease" }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, margin: "0 auto 28px",
          background: "linear-gradient(135deg, #22c55e, #10b981)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, color: "#0a0a0f",
          fontFamily: "'Space Mono', monospace", boxShadow: "0 0 40px #22c55e22",
        }}>XP</div>

        <h1 style={{ color: "#f9fafb", fontSize: 30, fontWeight: 700, marginBottom: 10, fontFamily: "'Space Mono', monospace", letterSpacing: -1 }}>
          Ethos XP Bank
        </h1>
        <p style={{ color: "#9ca3af", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
          Reputation-backed XP lending. 0% interest. Built on trust.
        </p>

        {error && (
          <div style={{ marginBottom: 16, padding: "10px 14px", background: "#dc262612", border: "1px solid #dc262630", borderRadius: 10 }}>
            <p style={{ color: "#fca5a5", fontSize: 12, margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          onClick={onLogin}
          disabled={loading}
          onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
          style={{
            padding: "15px 44px",
            background: loading ? "#161624" : (h ? "linear-gradient(135deg, #16a34a, #059669)" : "linear-gradient(135deg, #22c55e, #10b981)"),
            color: loading ? "#4b5563" : "#071a0f", border: "none", borderRadius: 12,
            fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            textTransform: "uppercase", letterSpacing: 2,
            boxShadow: h && !loading ? "0 8px 32px #22c55e28, 0 2px 8px #0003" : "0 4px 16px #22c55e14, 0 2px 8px #0003",
            transition: "all 0.25s ease",
            display: "inline-flex", alignItems: "center", gap: 10,
          }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: "2px solid #4b5563", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Connecting...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Sign in with X
            </>
          )}
        </button>

        <p style={{ color: "#3f3f5c", fontSize: 11, marginTop: 16 }}>
          Powered by <a href="https://privy.io" target="_blank" rel="noopener noreferrer" style={{ color: "#4488cc", textDecoration: "none" }}>Privy</a> ×{" "}
          <a href="https://www.ethos.network" target="_blank" rel="noopener noreferrer" style={{ color: "#4488cc", textDecoration: "none" }}>Ethos Network</a>
        </p>

        <div style={{
          marginTop: 20, padding: "10px 16px", borderRadius: 10,
          background: "#0a0a14", border: "1px solid #1c1c32",
          maxWidth: 320, margin: "20px auto 0",
        }}>
          <p style={{ color: "#6b7280", fontSize: 11, margin: 0, lineHeight: 1.6 }}>
            🔒 Sign in with your X account. Your Ethos reputation is linked to your X identity.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
          {TIERS.filter(t => t.limit > 0).slice(0, 5).map(t => (
            <div key={t.name} style={{ textAlign: "center" }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: t.color, margin: "0 auto 4px",
                boxShadow: `0 0 8px ${t.color}44`,
              }} />
              <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase" }}>{t.name}</div>
              <div style={{ fontSize: 9, color: t.color, fontFamily: "mono" }}>{fmtNum(t.limit)} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  MODALS (Review, Gift, Borrow, Lend)
// ═══════════════════════════════════════════

function ReviewPrompt({ open, close, counterparty }) {
  if (!open || !counterparty) return null;
  const [selected, setSelected] = useState(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Overlay open={open} close={close}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "mono" }}>Review Submitted!</h3>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Review for {counterparty.displayName || counterparty.username} recorded.</p>
          <button onClick={close} style={btnGreen}>Done</button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay open={open} close={close}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>⭐</div>
        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 4, fontFamily: "mono" }}>Leave a Review?</h3>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 22 }}>
          How was your experience with <span style={{ color: "#fff", fontWeight: 600 }}>{counterparty.displayName || counterparty.username}</span>?
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <AvatarRing score={counterparty.score || 0} size={42} src={counterparty.avatarUrl}>{(counterparty.displayName || "?")[0]}</AvatarRing>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{counterparty.displayName || counterparty.username}</div>
            <TierBadge score={counterparty.score || 0} name={counterparty.username} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 22 }}>
          {[
            { val: "negative", em: "👎", label: "Negative", color: "#dc2626", bg: "#dc262618" },
            { val: "neutral",  em: "😐", label: "Neutral",  color: "#a3a3a3", bg: "#a3a3a318" },
            { val: "positive", em: "👍", label: "Positive", color: "#22c55e", bg: "#22c55e18" },
          ].map(r => (
            <button key={r.val} onClick={() => setSelected(r.val)} style={{
              flex: 1, padding: "14px 8px",
              background: selected === r.val ? r.bg : "#0a0a14",
              border: `2px solid ${selected === r.val ? r.color : "#1c1c32"}`,
              borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
              boxShadow: selected === r.val ? `0 0 16px ${r.color}25` : "none",
            }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{r.em}</div>
              <div style={{ fontSize: 11, color: selected === r.val ? r.color : "#6b7280", fontWeight: 600 }}>{r.label}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={close} style={btnOutline}>Skip</button>
          <button onClick={() => { if (selected) { window.open(ethosReviewUrl(counterparty.username), "_blank"); setSent(true); }}} disabled={!selected} style={{
            flex: 1, padding: "12px 0",
            background: selected ? "linear-gradient(135deg, #22c55e, #10b981)" : "#1a1a2e",
            color: selected ? "#0a0a0f" : "#4b5563",
            border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700,
            cursor: selected ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 1,
          }}>Submit Review</button>
        </div>
      </div>
    </Overlay>
  );
}

function GiftPrompt({ open, close, counterparty }) {
  if (!open || !counterparty) return null;
  const [amount, setAmount] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Overlay open={open} close={close}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "mono" }}>Gift Sent!</h3>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>You sent {amount} XP to {counterparty.displayName || counterparty.username}!</p>
          <button onClick={close} style={btnGreen}>Done</button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay open={open} close={close}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🎁</div>
        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 4, fontFamily: "mono" }}>Repayment Complete!</h3>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 22 }}>
          Send a gift to <span style={{ color: "#fff", fontWeight: 600 }}>{counterparty.displayName || counterparty.username}</span>?
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, justifyContent: "center" }}>
          <AvatarRing score={counterparty.score || 0} size={42} src={counterparty.avatarUrl}>{(counterparty.displayName || "?")[0]}</AvatarRing>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{counterparty.displayName || counterparty.username}</div>
            <TierBadge score={counterparty.score || 0} name={counterparty.username} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
          {[10, 25, 50, 100].map(v => (
            <button key={v} onClick={() => setAmount(String(v))} style={{
              padding: "10px 16px",
              background: amount === String(v) ? "#22c55e20" : "#0a0a14",
              border: `1.5px solid ${amount === String(v) ? "#22c55e" : "#1c1c32"}`,
              borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
              color: amount === String(v) ? "#22c55e" : "#fff",
              fontSize: 14, fontWeight: 700, fontFamily: "mono",
            }}>{v} XP</button>
          ))}
        </div>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="Or enter custom amount" style={{ ...inp, textAlign: "center", marginBottom: 20 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={close} style={btnOutline}>Skip</button>
          <button onClick={() => Number(amount) > 0 && setSent(true)} disabled={!Number(amount)} style={{
            flex: 1, padding: "12px 0",
            background: Number(amount) > 0 ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#1a1a2e",
            color: Number(amount) > 0 ? "#0a0a0f" : "#4b5563",
            border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700,
            cursor: Number(amount) > 0 ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 1,
          }}>Send Gift 🎁</button>
        </div>
      </div>
    </Overlay>
  );
}

function BorrowModal({ open, close, offer, onConfirm }) {
  if (!offer) return null;
  const tier = getTier(offer.score || 0);
  return (
    <Overlay open={open} close={close}>
      <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 3, fontFamily: "mono" }}>Confirm Borrow</h3>
      <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 20 }}>0% interest — repay what you borrow</p>
      <div style={{ background: "#0a0a14", borderRadius: 12, padding: 18, border: "1px solid #1c1c32", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #1c1c32" }}>
          <AvatarRing score={offer.score || 0} size={42} src={offer.avatarUrl}>{(offer.displayName || "?")[0]}</AvatarRing>
          <div>
            <span style={{ color: "#fff", fontWeight: 600 }}>{offer.displayName || offer.username}</span>
            <div><TierBadge score={offer.score || 0} name={offer.username} /></div>
          </div>
        </div>
        {[
          ["Borrow Amount", offer.amt + " XP", "#fff"],
          ["Repay Amount", offer.amt + " XP", "#22c55e"],
          ["Interest", "0% interest", "#4ade80"],
          ["Duration", offer.dur + " days", "#fff"],
        ].map(([l, v, c], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
            <span style={{ color: "#6b7280", fontSize: 13 }}>{l}</span>
            <span style={{ color: c, fontSize: 14, fontWeight: 600, fontFamily: "mono" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "#f59e0b10", border: "1px solid #f59e0b30", borderRadius: 10, padding: 12, marginBottom: 18 }}>
        <p style={{ color: "#fcd34d", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Late repayment may affect your Ethos credibility.</p>
      </div>
      <button onClick={() => onConfirm(offer)} style={{ ...btnGreenFull, background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}>
        Confirm & Borrow
      </button>
    </Overlay>
  );
}

function LendModal({ open, close, onConfirm }) {
  const [amt, setAmt] = useState("");
  const [dur, setDur] = useState("7");
  const a = Number(amt) || 0;
  return (
    <Overlay open={open} close={close}>
      <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 3, fontFamily: "mono" }}>Create Lending Offer</h3>
      <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 20 }}>0% interest — help the community</p>
      <label style={lbl}>XP Amount</label>
      <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="Enter XP amount" style={inp} />
      <div style={{ marginTop: 14 }}>
        <label style={lbl}>Repayment Period (days)</label>
        <input type="number" value={dur} onChange={e => setDur(e.target.value)} style={inp} />
      </div>
      {a > 0 && (
        <div style={{ background: "#0a0a14", borderRadius: 10, padding: 14, marginTop: 16, border: "1px solid #1c1c32" }}>
          {[["You lend", a + " XP", "#fff"], ["You get back", a + " XP", "#22c55e"], ["Interest", "0% interest", "#4ade80"]].map(([l, v, c], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ color: "#6b7280", fontSize: 12 }}>{l}</span>
              <span style={{ color: c, fontSize: 13, fontWeight: 600, fontFamily: "mono" }}>{v}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => a > 0 && onConfirm({ amt: a, dur: Number(dur) })} disabled={!a} style={{
        ...btnGreenFull, marginTop: 18,
        background: a > 0 ? "linear-gradient(135deg, #22c55e, #10b981)" : "#1a1a2e",
        color: a > 0 ? "#0a0a0f" : "#4b5563", cursor: a > 0 ? "pointer" : "not-allowed",
      }}>Create Offer</button>
    </Overlay>
  );
}

// ═══════════════════════════════════════════
//  OFFER CARD + LOAN ROW
// ═══════════════════════════════════════════

function OfferCard({ o, onBorrow, canBorrow }) {
  const [h, setH] = useState(false);
  const tier = getTier(o.score || 0);
  const active = o.open && canBorrow;
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? "linear-gradient(145deg, #171730, #131320)" : "linear-gradient(145deg, #131320, #0c0c18)",
      border: `1px solid ${h ? tier.color + "33" : "#1c1c32"}`,
      borderRadius: 16, padding: 20, transition: "all 0.3s",
      transform: h ? "translateY(-2px)" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AvatarRing score={o.score || 0} size={40} src={o.avatarUrl}>{(o.displayName || "?")[0]}</AvatarRing>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{o.displayName || o.username}</div>
            <TierBadge score={o.score || 0} name={o.username} />
          </div>
        </div>
        {!o.open && <span style={{ fontSize: 10, color: "#6b7280", background: "#1a1a2e", padding: "3px 8px", borderRadius: 12, textTransform: "uppercase" }}>Taken</span>}
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        {[{ l: "Amount", v: o.amt + " XP" }, { l: "Interest", v: "0%", c: "#4ade80" }, { l: "Duration", v: o.dur + "d" }].map((x, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{x.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: x.c || "#fff", fontFamily: "mono" }}>{x.v}</div>
          </div>
        ))}
      </div>
      <button onClick={() => active && onBorrow(o)} disabled={!active} style={{
        width: "100%", padding: "11px 0",
        background: active ? `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` : "#1a1a2e",
        color: active ? "#fff" : "#4b5563",
        border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700,
        cursor: active ? "pointer" : "not-allowed",
        textTransform: "uppercase", letterSpacing: 1.2, opacity: active ? 1 : 0.5,
      }}>{!canBorrow ? "Score Too Low" : o.open ? "Borrow XP" : "Unavailable"}</button>
    </div>
  );
}

function LoanRow({ l, onRepay, onSendXP }) {
  const isLent = l.type === "lent";
  const left = Math.max(0, Math.ceil((new Date(l.due) - new Date()) / 864e5));
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px", background: "linear-gradient(145deg, #131320, #0c0c18)",
      border: `1px solid ${left <= 2 ? "#dc262633" : "#1c1c32"}`,
      borderRadius: 12, flexWrap: "wrap", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 170 }}>
        <AvatarRing score={l.score || 0} size={34} src={l.avatarUrl}>{(l.displayName || "?")[0]}</AvatarRing>
        <div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{l.displayName || l.username}</span>
          <div style={{ color: isLent ? "#22c55e" : "#f59e0b", fontSize: 11, textTransform: "uppercase", fontWeight: 600 }}>{isLent ? "Lent" : "Borrowed"}</div>
        </div>
      </div>
      {[{ lb: "Amount", v: l.amt + " XP", c: "#fff" }, { lb: "Repay", v: l.amt + " XP", c: "#22c55e" }, { lb: "Due in", v: left + "d", c: left <= 2 ? "#dc2626" : "#fff" }].map((x, i) => (
        <div key={i} style={{ textAlign: "center", minWidth: 70 }}>
          <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>{x.lb}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: x.c, fontFamily: "mono" }}>{x.v}</div>
        </div>
      ))}
      {isLent && onSendXP && <button onClick={() => onSendXP(l)} style={{
        padding: "7px 18px", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
        color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase",
      }}>Send XP</button>}
      {!isLent && <button onClick={() => onRepay(l)} style={{
        padding: "7px 18px", background: "linear-gradient(135deg, #22c55e, #10b981)",
        color: "#0a0a0f", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase",
      }}>Repay</button>}
    </div>
  );
}

// ═══════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════
export default function App() {
  const { ready, authenticated, ethosUser, loading, error, login, logout, getAccessToken } = useEthosUser();
  const [tab, setTab] = useState("market");
  const [lendOpen, setLendOpen] = useState(false);
  const [borrowOffer, setBorrowOffer] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [giftTarget, setGiftTarget] = useState(null);
  const [repaidLoan, setRepaidLoan] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loans, setLoans] = useState([]);

  const refreshOffers = useCallback(async () => {
    try {
      const rows = await dbFetchOffers();
      setOffers(rows.map(r => ({
        id: r.id, username: r.username, displayName: r.display_name,
        avatarUrl: r.avatar_url, score: r.score, amt: r.amount,
        dur: r.duration_days, open: r.is_open,
      })));
    } catch (e) { console.error("fetchOffers:", e); }
  }, []);

  const refreshLoans = useCallback(async (user) => {
    try {
      const rows = await dbFetchLoans(user);
      setLoans(rows.filter(r => !r.is_repaid).map(r => ({
        id: r.id, offerId: r.offer_id,
        username: r.lender_username === user ? r.borrower_username : r.lender_username,
        displayName: r.lender_username === user ? r.borrower_display_name : r.lender_display_name,
        avatarUrl: r.lender_username === user ? r.borrower_avatar_url : r.lender_avatar_url,
        score: r.lender_username === user ? r.borrower_score : r.lender_score,
        type: r.lender_username === user ? "lent" : "borrowed",
        amt: r.amount, due: r.due_date,
      })));
    } catch (e) { console.error("fetchLoans:", e); }
  }, []);

  useEffect(() => {
    if (!authenticated || !ethosUser) return;
    refreshOffers();
    const u = ethosUser.username || "";
    if (u) refreshLoans(u);
  }, [authenticated, ethosUser, refreshOffers, refreshLoans]);

  // Show login if not authenticated or Ethos profile not loaded
  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: "#08080f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 24, border: "3px solid #1c1c32", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!authenticated || !ethosUser) {
    return <LoginScreen onLogin={login} loading={loading} error={error} />;
  }

  // Derived from real Ethos data
  const score = ethosUser.score || 0;
  const tier = getTier(score);
  const limit = tier.limit;
  const eligible = limit > 0;
  const xpTotal = ethosUser.xpTotal || 0;
  const streakDays = ethosUser.xpStreakDays || 0;
  const displayName = ethosUser.displayName || ethosUser.username || "User";
  const avatarUrl = ethosUser.avatarUrl;
  const username = ethosUser.username || "";

  async function handleBorrowConfirm(offer) {
    setBorrowOffer(null);
    try {
      const dueDate = new Date(Date.now() + offer.dur * 864e5).toISOString().split("T")[0];
      await dbBorrowOffer(offer.id, username);
      await dbCreateLoan({
        offerId: offer.id,
        lenderUsername: offer.username,
        lenderDisplayName: offer.displayName,
        lenderAvatarUrl: offer.avatarUrl,
        lenderScore: offer.score,
        borrowerUsername: username,
        borrowerDisplayName: displayName,
        borrowerAvatarUrl: avatarUrl,
        borrowerScore: score,
        amount: offer.amt,
        dueDate,
      });
      await refreshOffers();
      await refreshLoans(username);
    } catch (e) { console.error("handleBorrowConfirm:", e); }
  }

  async function handleLendConfirm({ amt, dur }) {
    setLendOpen(false);
    try {
      await dbCreateOffer({
        username, displayName, avatarUrl, score,
        amount: amt, durationDays: dur,
      });
      await refreshOffers();
    } catch (e) { console.error("handleLendConfirm:", e); }
  }

  async function handleRepay(loan) {
    try {
      // Send XP back to lender via Ethos tip API
      const token = await getAccessToken();
      if (token) {
        await tipXP(token, `x:${loan.username}`, loan.amt);
      }
      await dbRepayLoan(loan.id);
      await refreshLoans(username);
    } catch (e) { console.error("handleRepay:", e); }
    const cp = { username: loan.username, displayName: loan.displayName, avatarUrl: loan.avatarUrl, score: loan.score };
    setRepaidLoan(cp);
    setTimeout(() => setGiftTarget(cp), 400);
  }

  async function handleSendXP(loan) {
    try {
      const token = await getAccessToken();
      if (token) {
        await tipXP(token, `x:${loan.username}`, loan.amt);
        alert(`${loan.amt} XP sent to ${loan.displayName || loan.username}!`);
      }
    } catch (e) {
      console.error("handleSendXP:", e);
      alert("XP transfer failed: " + e.message);
    }
  }

  function handleGiftClose() {
    setGiftTarget(null);
    if (repaidLoan) {
      setTimeout(() => { setReviewTarget({ ...repaidLoan }); setRepaidLoan(null); }, 400);
    }
  }

  const navItems = [
    { id: "market", label: "Market" },
    { id: "loans", label: "My Loans" },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", color: "#f9fafb", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* HEADER */}
      <header style={{
        padding: "13px 24px", borderBottom: "1px solid #1a1a2e",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,8,15,0.85)", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #22c55e, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#0a0a0f", fontFamily: "'Space Mono', monospace",
          }}>XP</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Space Mono', monospace" }}>Ethos XP Bank</span>
          <span style={{ fontSize: 9, color: "#22c55e", background: "#22c55e15", padding: "2px 7px", borderRadius: 5, fontWeight: 600, textTransform: "uppercase" }}>Beta</span>
          <span style={{ fontSize: 9, color: "#4ade80", background: "#22c55e10", padding: "2px 7px", borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} /> Connected
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#6b7280" }}>{displayName}</div>
            <TierBadge score={score} name={username} />
          </div>
          <AvatarRing score={score} size={38} src={avatarUrl}>{displayName[0]}</AvatarRing>
        </div>
      </header>

      {/* NAV */}
      <nav style={{ padding: "0 24px", display: "flex", gap: 2, borderBottom: "1px solid #141428", overflowX: "auto" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            padding: "13px 18px",
            background: "transparent",
            border: "none",
            borderBottom: tab === n.id ? `2px solid ${tier.color}` : "2px solid transparent",
            color: tab === n.id ? "#f9fafb" : "#6b7280",
            fontSize: 13, fontWeight: tab === n.id ? 600 : 400, cursor: "pointer",
            transition: "all 0.2s", whiteSpace: "nowrap", marginBottom: -1,
          }}>{n.label}</button>
        ))}
        <button onClick={logout} style={{
          marginLeft: "auto", padding: "7px 14px",
          background: "transparent", border: "1px solid #dc262630",
          borderRadius: 8, color: "#dc2626", fontSize: 11, fontWeight: 600,
          cursor: "pointer", textTransform: "uppercase",
        }}>Logout</button>
      </nav>

      {/* CONTENT */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "22px 20px", animation: "fadeUp 0.5s ease" }}>
        {!eligible && (
          <div style={{ background: "#0f0a0a", border: "1px solid #3f1515", borderRadius: 14, padding: "16px 20px", marginBottom: 22, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#7f1d1d20", border: "1px solid #7f1d1d40", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>🔒</div>
            <div>
              <div style={{ color: "#f87171", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Borrowing Locked</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>Your score ({score}) is below 800. Build reputation on Ethos to unlock borrowing.</div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
              <AvatarRing score={score} size={68} src={avatarUrl}>{displayName[0]}</AvatarRing>
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 2, fontFamily: "'Space Mono', monospace", letterSpacing: -0.5 }}>{displayName}</h2>
                <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 10, letterSpacing: 0.2 }}>@{username} · Ethos Network</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: `${tier.color}12`, border: `1px solid ${tier.color}25`, borderRadius: 8, padding: "5px 12px", color: tier.color, fontSize: 12, fontWeight: 600, letterSpacing: 0.3 }}>
                    {fmtNum(limit)} XP limit
                  </span>
                  <a href={ethosProfileUrl(username)} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 5, background: "#111120", border: "1px solid #1e1e32",
                    borderRadius: 8, padding: "5px 12px", color: "#9ca3af", fontSize: 12, textDecoration: "none", letterSpacing: 0.2,
                  }}>Ethos profile ↗</a>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <Stat icon="💎" label="Total XP" value={fmtNum(xpTotal)} />
              <Stat icon="⭐" label="Cred Score" value={score} sub={tier.name} />
              <Stat icon="🔥" label="Streak" value={streakDays + "d"} />
              <Stat icon="🎯" label="Borrow Limit" value={fmtNum(limit) + " XP"} />
            </div>
            {ethosUser?.stats && (
              <div style={{ background: "linear-gradient(145deg, #131320, #0c0c18)", border: "1px solid #1c1c32", borderRadius: 16, padding: 22, marginBottom: 16 }}>
                <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Ethos Stats (Live)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                  {[
                    { l: "Reviews +", v: ethosUser.stats?.review?.received?.positive || 0, c: "#22c55e" },
                    { l: "Reviews −", v: ethosUser.stats?.review?.received?.negative || 0, c: "#dc2626" },
                    { l: "Vouches In", v: ethosUser.stats?.vouch?.received?.count || 0, c: "#8a6aaa" },
                    { l: "Vouches Out", v: ethosUser.stats?.vouch?.given?.count || 0, c: "#4488cc" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "#0a0a14", borderRadius: 10, padding: "10px 14px", border: "1px solid #1c1c3220" }}>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>{s.l}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: s.c, fontFamily: "mono" }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ background: "linear-gradient(145deg, #131320, #0c0c18)", border: "1px solid #1c1c32", borderRadius: 16, padding: 22 }}>
              <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Tier Borrow Limits</h3>
              <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 16 }}>Each tier unlocks +1,000 XP. 0% interest.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(95px, 1fr))", gap: 8 }}>
                {TIERS.map(t => {
                  const cur = score >= t.min && score <= t.max;
                  return (
                    <div key={t.name} style={{
                      padding: "10px 8px", background: cur ? `${t.color}18` : "#0a0a14",
                      border: `1.5px solid ${cur ? t.color : "#1c1c3220"}`, borderRadius: 10, textAlign: "center",
                      boxShadow: cur ? `0 0 16px ${t.color}20` : "none",
                    }}>
                      <div style={{ fontSize: 9, color: t.color, fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>{t.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "mono" }}>{t.limit === 0 ? "🔒" : fmtNum(t.limit)}</div>
                      <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>{t.min}–{t.max}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* MARKET */}
        {tab === "market" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Mono', monospace", marginBottom: 3 }}>XP Lending Market</h2>
                <p style={{ color: "#6b7280", fontSize: 13 }}>Borrow XP at 0% interest</p>
              </div>
              <button onClick={() => setLendOpen(true)} style={{
                padding: "11px 22px", background: "linear-gradient(135deg, #22c55e, #10b981)",
                color: "#0a0a0f", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700,
                cursor: "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 7,
              }}><span style={{ fontSize: 17 }}>+</span> Lend XP</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
              <Stat icon="📊" label="Available" value={offers.filter(o => o.open).length} />
              <Stat icon="🎯" label="Your Limit" value={fmtNum(limit) + " XP"} />
              <Stat icon="🤝" label="Interest" value="0%" sub="Always 0%" />
            </div>
            {offers.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
                {offers.map(o => <OfferCard key={o.id} o={o} onBorrow={setBorrowOffer} canBorrow={eligible} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "linear-gradient(145deg, #131320, #0c0c18)", border: "1px solid #1c1c32", borderRadius: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
                <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 6 }}>No offers yet</p>
                <p style={{ color: "#4b5563", fontSize: 12 }}>Be the first to create a lending offer!</p>
              </div>
            )}
          </>
        )}

        {/* LOANS */}
        {tab === "loans" && (
          <>
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Mono', monospace", marginBottom: 3 }}>My Active Loans</h2>
              <p style={{ color: "#6b7280", fontSize: 13 }}>Track lending & borrowing</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
              <Stat icon="📤" label="Lent Out" value={loans.filter(l => l.type === "lent").reduce((a, l) => a + l.amt, 0) + " XP"} />
              <Stat icon="📥" label="Borrowed" value={loans.filter(l => l.type === "borrowed").reduce((a, l) => a + l.amt, 0) + " XP"} />
              <Stat icon="🔄" label="Active" value={loans.length} />
            </div>
            {loans.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {loans.map(l => <LoanRow key={l.id} l={l} onRepay={handleRepay} onSendXP={handleSendXP} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "linear-gradient(145deg, #131320, #0c0c18)", border: "1px solid #1c1c32", borderRadius: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                <p style={{ color: "#6b7280", fontSize: 13 }}>No active loans</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer style={{ padding: "18px 22px", borderTop: "1px solid #1c1c32", textAlign: "center", marginTop: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <p style={{ color: "#3f3f5c", fontSize: 11, margin: 0 }}>Ethos XP Bank</p>
          <a href="https://www.ethos.network" target="_blank" rel="noopener noreferrer" style={{ color: "#4488cc", fontSize: 11, textDecoration: "none" }}>Ethos Network</a>
          <a href="https://developers.ethos.network" target="_blank" rel="noopener noreferrer" style={{ color: "#4488cc", fontSize: 11, textDecoration: "none" }}>API Docs</a>
        </div>
      </footer>

      {/* MODALS */}
      <LendModal open={lendOpen} close={() => setLendOpen(false)} onConfirm={handleLendConfirm} />
      <BorrowModal open={!!borrowOffer} close={() => setBorrowOffer(null)} offer={borrowOffer} onConfirm={handleBorrowConfirm} />
      <GiftPrompt open={!!giftTarget} close={handleGiftClose} counterparty={giftTarget} />
      <ReviewPrompt open={!!reviewTarget} close={() => setReviewTarget(null)} counterparty={reviewTarget} />
    </div>
  );
}
