import { useState } from "react";
import { getTier, ethosProfileUrl } from "./ethos";

export function AvatarRing({ children, score, size = 44, src }) {
  const t = getTier(score);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `${size > 50 ? 3 : 2}px solid ${t.color}60`,
      background: "#0d0d1a", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.44, flexShrink: 0,
      boxShadow: `0 0 0 1px ${t.color}20, 0 0 18px ${t.color}22`,
      overflow: "hidden", transition: "box-shadow 0.3s ease",
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
    <span
      title={`${count} slash${count !== 1 ? "es" : ""} received on Ethos`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: "#7f1d1d18", border: "1px solid #7f1d1d40",
        borderRadius: 6, padding: "3px 9px", fontSize: 11, color: "#f87171", fontWeight: 500,
        letterSpacing: 0.2, cursor: "help",
      }}>⚠ {count} slash</span>
  );
}

export function Stat({ icon, label, value, sub }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #10101e, #0a0a16)",
      border: "1px solid #1a1a2e",
      borderTop: "1px solid #22223a",
      borderRadius: 16,
      padding: "18px 20px", flex: "1 1 155px", minWidth: 155,
    }}>
      <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>{icon} {label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "'Space Mono', monospace", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#4ade80", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function Overlay({ open, close, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.78)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={close}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "linear-gradient(160deg, #13131f, #0c0c18)",
        border: "1px solid #1e1e32",
        borderTop: "1px solid #2a2a42",
        borderRadius: 22, padding: 30,
        maxWidth: 440, width: "100%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px #ffffff06",
      }}>{children}</div>
    </div>
  );
}

// Shared styles
export const lbl = { fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.4, fontWeight: 600, display: "block", marginBottom: 7 };
export const inp = {
  width: "100%", padding: "12px 16px", background: "#0a0a14",
  border: "1px solid #1c1c32", borderRadius: 12, color: "#fff",
  fontSize: 15, fontFamily: "'Space Mono', monospace", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.2s",
};
export const btnGreen = {
  padding: "12px 28px", background: "linear-gradient(135deg, #22c55e, #10b981)",
  color: "#0a0a0f", border: "none", borderRadius: 16, fontSize: 13, fontWeight: 700,
  cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
};
export const btnGreenFull = { ...btnGreen, width: "100%", padding: "13px 0" };
export const btnOutline = {
  flex: 1, padding: "12px 0", background: "transparent",
  border: "1px solid #1c1c32", borderRadius: 16,
  color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer",
};
