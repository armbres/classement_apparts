import React, { useRef, useEffect } from "react";
import { CRITERIA } from "./config";
import { ScoreButton, Card, SectionTitle } from "./components";

export default function EditView({ apt, onUpdate, onDelete, onBack }) {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, [apt.id]);

  const update = (updates) => onUpdate(apt.id, updates);
  const setScore = (key, val) => update({ scores: { ...apt.scores, [key]: val } });
  const clearScore = (key) => {
    const ns = { ...apt.scores };
    delete ns[key];
    update({ scores: ns });
  };

  const fields = [
    { key: "name", label: "Nom / Référence", placeholder: "ex. Ferlandina 53", span: 2 },
    { key: "address", label: "Adresse", placeholder: "Adresse complète", span: 2 },
    { key: "price", label: "Prix (€)", placeholder: "229900", type: "number" },
    { key: "sqm", label: "Surface (m²)", placeholder: "65", type: "number" },
    { key: "rooms", label: "Pièces", placeholder: "3", type: "number" },
    { key: "floor", label: "Étage", placeholder: "2" },
    { key: "visitDate", label: "Date de visite", placeholder: "ex. 30 mars 2026", span: 2 },
  ];

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: "none", color: "#8a8680", fontSize: 13,
        cursor: "pointer", marginBottom: 16, padding: 0,
      }}>← Retour à la liste</button>

      {/* Infos */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
          <SectionTitle>Détails du bien</SectionTitle>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => update({ favorite: !apt.favorite })} style={{
              background: apt.favorite ? "#c45a3c15" : "transparent",
              border: `1px solid ${apt.favorite ? "#c45a3c" : "#ddd8d0"}`,
              borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer",
              color: apt.favorite ? "#c45a3c" : "#8a8680",
            }}>{apt.favorite ? "❤️ Favori" : "♡ Favori"}</button>
            <button onClick={() => update({ visited: !apt.visited })} style={{
              background: apt.visited ? "#2e8b5715" : "transparent",
              border: `1px solid ${apt.visited ? "#2e8b57" : "#ddd8d0"}`,
              borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer",
              color: apt.visited ? "#2e8b57" : "#8a8680",
            }}>{apt.visited ? "✓ Visité" : "○ Pas visité"}</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {fields.map((f) => (
            <div key={f.key} style={{ gridColumn: f.span === 2 ? "1 / -1" : "auto" }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600, color: "#8a8680", marginBottom: 4,
                fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>{f.label}</label>
              <input
                ref={f.key === "name" ? inputRef : null}
                type={f.type || "text"}
                value={apt[f.key] || ""}
                onChange={(e) => update({ [f.key]: e.target.value })}
                placeholder={f.placeholder}
                style={{
                  width: "100%", padding: "10px 12px", border: "1px solid #e2e0dc", borderRadius: 8,
                  fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#faf9f7",
                  color: "#1a3a2a", boxSizing: "border-box", transition: "border-color 0.2s",
                }}
              />
            </div>
          ))}
        </div>

        {apt.price && apt.sqm && (
          <div style={{
            marginTop: 12, padding: "10px 14px", background: "#eef4f0", borderRadius: 8,
            fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#2a4f3a",
          }}>
            {Math.round(apt.price / apt.sqm).toLocaleString("fr-FR")} € / m²
          </div>
        )}
      </Card>

      {/* Notation */}
      <Card>
        <SectionTitle>Noter ce bien</SectionTitle>
        <div style={{ fontSize: 12, color: "#a09a92", marginTop: 4, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
          Notez chaque critère de 1 (mauvais) à 10 (excellent)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CRITERIA.map((c) => (
            <div key={c.key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{c.icon} {c.label}</span>
                <span style={{ fontSize: 10, color: "#b0aaa2", fontFamily: "'DM Mono', monospace" }}>
                  poids : {"●".repeat(c.weight)}{"○".repeat(3 - c.weight)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[1,2,3,4,5,6,7,8,9,10].map((v) => (
                  <ScoreButton key={v} value={v}
                    selected={apt.scores[c.key] === v}
                    onClick={() => setScore(c.key, v)}
                    color={v <= 3 ? "#c45a3c" : v <= 6 ? "#b8a040" : "#2e8b57"}
                  />
                ))}
                {apt.scores[c.key] !== undefined && (
                  <button onClick={() => clearScore(c.key)} style={{
                    background: "none", border: "none", color: "#c4c0ba", fontSize: 14, cursor: "pointer", padding: "0 4px",
                  }}>✕</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pour / Contre / Notes */}
      <Card>
        <SectionTitle>Impressions</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <div>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600, color: "#2e8b57", marginBottom: 4,
              fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.5px",
            }}>👍 Points forts</label>
            <textarea value={apt.pros || ""} onChange={(e) => update({ pros: e.target.value })}
              placeholder="Lumineux, bien placé, calme..."
              rows={3} style={{
                width: "100%", padding: 12, border: "1px solid #e2e0dc", borderRadius: 8,
                fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#faf9f7",
                color: "#1a3a2a", resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600, color: "#c45a3c", marginBottom: 4,
              fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.5px",
            }}>👎 Points faibles</label>
            <textarea value={apt.cons || ""} onChange={(e) => update({ cons: e.target.value })}
              placeholder="Bruyant, travaux à prévoir..."
              rows={3} style={{
                width: "100%", padding: 12, border: "1px solid #e2e0dc", borderRadius: 8,
                fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#faf9f7",
                color: "#1a3a2a", resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{
            display: "block", fontSize: 11, fontWeight: 600, color: "#8a8680", marginBottom: 4,
            fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.5px",
          }}>📝 Notes libres</label>
          <textarea value={apt.notes || ""} onChange={(e) => update({ notes: e.target.value })}
            placeholder="Commentaires, choses à vérifier, contact agence..."
            rows={3} style={{
              width: "100%", padding: 12, border: "1px solid #e2e0dc", borderRadius: 8,
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#faf9f7",
              color: "#1a3a2a", resize: "vertical", boxSizing: "border-box",
            }}
          />
        </div>
      </Card>

      <button onClick={() => { if (window.confirm("Supprimer cet appartement ?")) onDelete(apt.id); }} style={{
        background: "none", border: "1px solid #e2d0d0", borderRadius: 8,
        padding: "10px 20px", color: "#c45a3c", fontSize: 13, cursor: "pointer", fontWeight: 500,
      }}>Supprimer cet appartement</button>
    </div>
  );
}
