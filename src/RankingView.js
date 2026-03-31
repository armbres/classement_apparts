import React from "react";
import { CRITERIA, computeWeightedScore, getColor } from "./config";
import { StarRating, ScoreBar, Card, Badge } from "./components";

export default function RankingView({ apartments }) {
  const ranked = [...apartments]
    .map((a) => ({ ...a, totalScore: computeWeightedScore(a) }))
    .sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        Votre classement
      </div>
      <div style={{ fontSize: 12, color: "#a09a92", fontFamily: "'DM Mono', monospace", marginBottom: 24 }}>
        Pondéré selon l'importance de chaque critère
      </div>

      {ranked.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#a09a92", fontSize: 14 }}>
          Ajoutez et notez des appartements pour voir votre classement
        </div>
      )}

      {ranked.map((apt, i) => {
        const scored = Object.keys(apt.scores).length;
        const ppm = apt.price && apt.sqm ? Math.round(apt.price / apt.sqm) : null;
        const isTop = i === 0 && scored > 0;

        return (
          <Card key={apt.id} highlight={isTop} style={{ padding: 20 }}>
            {isTop && <Badge>MEILLEUR CHOIX</Badge>}

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: scored > 0 ? 16 : 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: isTop ? "#4a9e6e" : "#ece9e4",
                color: isTop ? "#fff" : "#8a8680",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, flexShrink: 0,
              }}>{i + 1}</div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                  {apt.favorite ? "❤️ " : apt.emoji ? `${apt.emoji} ` : ""}{apt.name || "Sans nom"}
                  {apt.link && (
                    <a href={apt.link} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: 12, color: "#4a9e6e", textDecoration: "none" }}>🔗</a>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#8a8680", fontFamily: "'DM Mono', monospace", display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {apt.price && <span>{Number(apt.price).toLocaleString("fr-FR")} €</span>}
                  {ppm && <span>{ppm.toLocaleString("fr-FR")} €/m²</span>}
                  {apt.sqm && <span>{apt.sqm} m²</span>}
                  {apt.rooms && <span>{apt.rooms}p</span>}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: getColor(i),
                }}>
                  {scored > 0 ? apt.totalScore.toFixed(1) : "—"}
                </div>
                <StarRating score={apt.totalScore} />
              </div>
            </div>

            {scored > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                {CRITERIA.filter((c) => apt.scores[c.key] !== undefined).map((c) => (
                  <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <span style={{ width: 18, textAlign: "center" }}>{c.icon}</span>
                    <ScoreBar value={apt.scores[c.key]} color={getColor(i)} />
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#8a8680", width: 18, textAlign: "right",
                    }}>{apt.scores[c.key]}</span>
                  </div>
                ))}
              </div>
            )}

            {(apt.pros || apt.cons) && (
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {apt.pros && (
                  <div style={{
                    flex: 1, minWidth: 120, padding: "8px 12px", background: "#eef8f2", borderRadius: 8,
                    fontSize: 12, color: "#2e7a4a", lineHeight: 1.5,
                  }}>👍 {apt.pros}</div>
                )}
                {apt.cons && (
                  <div style={{
                    flex: 1, minWidth: 120, padding: "8px 12px", background: "#fef4f2", borderRadius: 8,
                    fontSize: 12, color: "#a04a3a", lineHeight: 1.5,
                  }}>👎 {apt.cons}</div>
                )}
              </div>
            )}

            {apt.notes && (
              <div style={{
                marginTop: 8, padding: "8px 12px", background: "#faf9f7", borderRadius: 8,
                fontSize: 12, color: "#6a655e", fontStyle: "italic", lineHeight: 1.5,
              }}>📝 {apt.notes}</div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
