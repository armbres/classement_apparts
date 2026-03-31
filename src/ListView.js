import React from "react";
import { computeWeightedScore, getColor } from "./config";

export default function ListView({ apartments, onEdit, onAdd, onReset }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <button onClick={onAdd} style={{
          padding: "10px 24px", background: "#1a3a2a", color: "#f8f6f2", border: "none",
          borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.3px",
        }}>+ Ajouter un appart</button>
        {apartments.length > 0 && (
          <button onClick={onReset} style={{
            padding: "8px 16px", background: "transparent", color: "#a09a92",
            border: "1px solid #ddd8d0", borderRadius: 6, fontSize: 12, cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
          }}>Tout effacer</button>
        )}
      </div>

      {apartments.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#a09a92" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#5a5650", marginBottom: 8 }}>
            Aucun appartement pour l'instant
          </div>
          <div style={{ fontSize: 13 }}>Commencez à ajouter les biens que vous visitez pour les comparer</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {apartments.map((apt, i) => {
          const score = computeWeightedScore(apt);
          const scored = Object.keys(apt.scores).length;
          return (
            <div key={apt.id} onClick={() => onEdit(apt.id)} style={{
              background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #ece9e4",
              cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 16,
            }}>
              {apt.photos && apt.photos.length > 0 ? (
                <img src={apt.photos[0]} alt="" style={{
                  width: 44, height: 44, borderRadius: 10, objectFit: "cover",
                  flexShrink: 0, background: "#ece9e4",
                }} onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: `${getColor(i)}18`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>{apt.favorite ? "❤️" : (apt.emoji || "🏠")}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: 15, marginBottom: 3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {apt.name || "Appartement sans nom"}
                  {apt.visited && (
                    <span style={{
                      fontSize: 10, background: "#2e8b5715", color: "#2e8b57",
                      padding: "2px 8px", borderRadius: 4, fontFamily: "'DM Mono', monospace",
                    }}>visité</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#8a8680", fontFamily: "'DM Mono', monospace", display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {apt.address && <span>{apt.address}</span>}
                  {apt.price && <span>{Number(apt.price).toLocaleString("fr-FR")} €</span>}
                  {apt.sqm && <span>{apt.sqm} m²</span>}
                  {apt.rooms && <span>{apt.rooms} pièces</span>}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {scored > 0 ? (
                  <>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: getColor(i) }}>
                      {score.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 10, color: "#a09a92", fontFamily: "'DM Mono', monospace" }}>/ 10</div>
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: "#c4c0ba", fontFamily: "'DM Mono', monospace" }}>pas noté</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
