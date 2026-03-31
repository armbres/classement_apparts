import React, { useRef, useEffect, useState } from "react";
import { CRITERIA } from "./config";
import { ScoreButton, Card, SectionTitle } from "./components";

const EMOJI_SUGGESTIONS = [
  "🏠", "🏡", "🏢", "🌇", "☀️", "🌙", "🎨", "🧱",
  "🐱", "🌳", "🍋", "🔑", "✨", "🔥", "💎", "🦋",
];

export default function EditView({ apt, onUpdate, onDelete, onBack }) {
  const inputRef = useRef(null);
  const [showEmojiHelper, setShowEmojiHelper] = useState(false);
  useEffect(() => { inputRef.current?.focus(); }, [apt.id]);

  const update = (updates) => onUpdate(apt.id, updates);
  const setScore = (key, val) => update({ scores: { ...apt.scores, [key]: val } });
  const clearScore = (key) => {
    const ns = { ...apt.scores };
    delete ns[key];
    update({ scores: ns });
  };

  const addPhoto = () => {
    const url = window.prompt("Collez l'URL de la photo :");
    if (url && url.trim()) {
      const photos = apt.photos ? [...apt.photos, url.trim()] : [url.trim()];
      update({ photos });
    }
  };

  const removePhoto = (index) => {
    const photos = (apt.photos || []).filter((_, i) => i !== index);
    update({ photos });
  };

  const fields = [
    { key: "name", label: "Nom / Référence", placeholder: "ex. Ferlandina 53", span: 2 },
    { key: "address", label: "Adresse", placeholder: "Adresse complète", span: 2 },
    { key: "link", label: "🔗 Lien annonce", placeholder: "https://idealista.com/...", span: 2, type: "url" },
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Emoji picker */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowEmojiHelper(!showEmojiHelper)} style={{
                width: 48, height: 48, borderRadius: 12, border: "2px dashed #d0dcd4",
                background: "#f0f5f2", fontSize: 24, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                {apt.emoji || "🏠"}
              </button>
              {showEmojiHelper && (
                <div style={{
                  position: "absolute", top: 56, left: 0, zIndex: 100,
                  background: "#fff", borderRadius: 12, padding: 16,
                  border: "1px solid #ece9e4", boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  width: 260,
                }}>
                  <div style={{ fontSize: 12, color: "#8a8680", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
                    Tapez ou collez un emoji :
                  </div>
                  <input
                    autoFocus
                    value={apt.emoji || ""}
                    onChange={(e) => {
                      // Take only the last entered emoji character(s)
                      const val = e.target.value;
                      // Extract the last emoji (handles multi-codepoint)
                      const segments = [...new Intl.Segmenter("fr", { granularity: "grapheme" }).segment(val)];
                      const lastEmoji = segments.length > 0 ? segments[segments.length - 1].segment : "";
                      update({ emoji: lastEmoji });
                    }}
                    placeholder="🏠"
                    style={{
                      width: "100%", padding: "10px", border: "1px solid #e2e0dc", borderRadius: 8,
                      fontSize: 28, textAlign: "center", boxSizing: "border-box",
                      background: "#faf9f7", marginBottom: 10,
                    }}
                  />
                  <div style={{ fontSize: 11, color: "#b0aaa2", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
                    Ou choisissez :
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {EMOJI_SUGGESTIONS.map((e) => (
                      <button key={e} onClick={() => { update({ emoji: e }); setShowEmojiHelper(false); }}
                        style={{
                          width: 34, height: 34, border: "none", borderRadius: 6,
                          background: apt.emoji === e ? "#eef4f0" : "transparent",
                          fontSize: 18, cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}
                      >{e}</button>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 10, fontSize: 10, color: "#b0aaa2", fontFamily: "'DM Mono', monospace",
                    borderTop: "1px solid #ece9e4", paddingTop: 8,
                  }}>
                    💡 Mac : Ctrl+Cmd+Espace · Win : Win+.
                  </div>
                  <button onClick={() => setShowEmojiHelper(false)} style={{
                    marginTop: 8, width: "100%", padding: "6px", background: "#f0f5f2",
                    border: "1px solid #d0dcd4", borderRadius: 6, fontSize: 12,
                    cursor: "pointer", color: "#5a8a6e",
                  }}>Fermer</button>
                </div>
              )}
            </div>
            <SectionTitle>Détails du bien</SectionTitle>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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

        {/* Link button */}
        {apt.link && (
          <a href={apt.link} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12,
            padding: "8px 16px", background: "#eef4f0", borderRadius: 8,
            color: "#2e8b57", fontSize: 13, fontWeight: 600, textDecoration: "none",
            border: "1px solid #c4d8ca", transition: "all 0.2s",
          }}>
            🔗 Voir l'annonce
          </a>
        )}

        {apt.price && apt.sqm && (
          <div style={{
            marginTop: 12, padding: "10px 14px", background: "#eef4f0", borderRadius: 8,
            fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#2a4f3a",
          }}>
            {Math.round(apt.price / apt.sqm).toLocaleString("fr-FR")} € / m²
          </div>
        )}
      </Card>

      {/* Photos */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <SectionTitle>Photos</SectionTitle>
          <button onClick={addPhoto} style={{
            padding: "6px 14px", background: "#1a3a2a", color: "#f8f6f2", border: "none",
            borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>+ Ajouter une photo</button>
        </div>

        {(!apt.photos || apt.photos.length === 0) && (
          <div style={{
            padding: "24px", textAlign: "center", color: "#b0aaa2", fontSize: 13,
            border: "2px dashed #e2e0dc", borderRadius: 10,
          }}>
            📷 Aucune photo — ajoutez des URLs d'images
          </div>
        )}

        {apt.photos && apt.photos.length > 0 && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 10,
          }}>
            {apt.photos.map((url, i) => (
              <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                <img
                  src={url} alt={`Photo ${i + 1}`}
                  style={{
                    width: "100%", height: 120, objectFit: "cover",
                    borderRadius: 10, display: "block", background: "#ece9e4",
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <button onClick={() => removePhoto(i)} style={{
                  position: "absolute", top: 4, right: 4,
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
                  fontSize: 12, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 11, color: "#b0aaa2", fontFamily: "'DM Mono', monospace" }}>
          Astuce : copiez l'URL d'une image depuis Idealista, Fotocasa, etc.
        </div>
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
