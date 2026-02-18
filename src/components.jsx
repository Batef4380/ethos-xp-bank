import { useState } from "react";
import { getTier, ethosProfileUrl } from "./ethos";

export function AvatarRing({ children, score, size = 44, src }) {
  const t = getTier(score);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `${size > 50 ? 4 : 3}px solid ${t.color}`,
      background: "#111120", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.44, flexShrink: 0, boxShadow: `0 0 14px ${t.color}30`,
      overflow: "hidden",
    }}>
      {src ? (
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
      ) : children}
    </div>
  );
}

export function TierBadge({ score, name }) {
  const t = getTier(score);
  const inner = (
    <span style={{
      fontSize: 12, fontWeight: 600, color: t.color,
      background: `${t.color}15`, border: `1px solid ${t.color}30`,
      borderRadius: 8, padding: "3px 10px", letterSpacing: 0.3,
      cursor: name ? "pointer" : "default", transition: "all 0.2s",
    }}>{t.name} · {score}</span>
  );
  if (name) {
    return <a href={ethosProfileUrl(name)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{inner}</a>;
  }
  return inner;
}

export function SlashBadge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: "#dc262615", border: "1px solid #dc262630",
      borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#fca5a5", fontWeight: 600,
    }}>⚠ {count}× slash</span>
  );
}

export function Stat({ icon, label, value, sub }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #131320, #0c0c18)",
      border: "1px solid #1c1c32", borderRadius: 14,
      padding: "16px 18px", flex: "1 1 155px", minWidth: 155,
    }}>
      <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 8 }}>{icon} {label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "mono" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#4ade80", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function Overlay({ open, close, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={close}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "linear-gradient(145deg, #151528, #0e0e1a)",
        border: "1px solid #22c55e20", borderRadius: 20, padding: 28,
        maxWidth: 440, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>{children}</div>
    </div>
  );
}

// Shared styles
export const lbl = { fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 };
export const inp = {
  width: "100%", padding: "11px 14px", background: "#0a0a14",
  border: "1px solid #1c1c32", borderRadius: 10, color: "#fff",
  fontSize: 15, fontFamily: "'Space Mono', monospace", outline: "none", boxSizing: "border-box",
};
export const btnGreen = {
  padding: "12px 28px", background: "linear-gradient(135deg, #22c55e, #10b981)",
  color: "#0a0a0f", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700,
  cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
};
export const btnGreenFull = { ...btnGreen, width: "100%", padding: "13px 0" };
export const btnOutline = {
  flex: 1, padding: "12px 0", background: "transparent",
  border: "1px solid #1c1c32", borderRadius: 12,
  color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer",
};
