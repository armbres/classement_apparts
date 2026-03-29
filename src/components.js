import React from "react";

export function ScoreButton({ value, selected, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 34, height: 34, borderRadius: "50%",
        border: selected ? `2.5px solid ${color}` : "2px solid #e2e0dc",
        background: selected ? color : "transparent",
        color: selected ? "#fff" : "#8a8680",
        fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600,
        cursor: "pointer", transition: "all 0.15s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {value}
    </button>
  );
}

export function StarRating({ score }) {
  const filled = Math.round(score / 2);
  return (
    <span style={{ fontSize: 14, letterSpacing: 1 }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < filled ? "#2e8b57" : "#ddd8d0" }}>★</span>
      ))}
    </span>
  );
}

export function ScoreBar({ value, max = 10, color = "#4a9e6e" }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ height: 6, borderRadius: 3, background: "#ece9e4", overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        borderRadius: 3, transition: "width 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
      }} />
    </div>
  );
}

export function Card({ children, highlight, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: 24,
      border: highlight ? "2px solid #4a9e6e" : "1px solid #ece9e4",
      marginBottom: 16, position: "relative", overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Badge({ children }) {
  return (
    <div style={{
      position: "absolute", top: 0, right: 0, background: "#4a9e6e", color: "#fff",
      fontSize: 10, fontWeight: 700, padding: "4px 12px", borderBottomLeftRadius: 8,
      fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px",
    }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
    }}>
      {children}
    </div>
  );
}

export function Mono({ children, style = {} }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", ...style }}>
      {children}
    </span>
  );
}
