import React, { useState, useCallback } from "react";
import { createEmptyApt } from "./config";
import { useFirebase } from "./useFirebase";
import ListView from "./ListView";
import EditView from "./EditView";
import RankingView from "./RankingView";

export default function App() {
  const [apartments, setApartments, { loading, connected }] = useFirebase("apartments", []);
  const [activeTab, setActiveTab] = useState("list");
  const [editingId, setEditingId] = useState(null);

  const addApartment = useCallback(() => {
    const n = createEmptyApt();
    setApartments((p) => [...p, n]);
    setEditingId(n.id);
    setActiveTab("edit");
  }, [setApartments]);

  const updateApartment = useCallback((id, updates) => {
    setApartments((p) => p.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, [setApartments]);

  const deleteApartment = useCallback((id) => {
    setApartments((p) => p.filter((a) => a.id !== id));
    setEditingId(null);
    setActiveTab("list");
  }, [setApartments]);

  const resetAll = useCallback(() => {
    if (window.confirm("Tout effacer ? Cette action est irréversible.")) {
      setApartments([]);
      setEditingId(null);
      setActiveTab("list");
    }
  }, [setApartments]);

  const editingApt = apartments.find((a) => a.id === editingId);
  const tabs = [
    { key: "list", label: "Biens" },
    { key: "ranking", label: "Classement" },
    ...(editingApt ? [{ key: "edit", label: editingApt.name || "Nouveau" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a2a 0%, #2a4f3a 100%)",
        padding: "32px 24px 24px", color: "#f8f6f2",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800,
            letterSpacing: "0.5px", marginBottom: 4, textTransform: "uppercase",
          }}>
            Armance et Fred cherchent un appart !!!!
          </div>
          <div style={{
            fontSize: 13, color: "#a0b8a8", fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>
              {apartments.length} bien{apartments.length !== 1 ? "s" : ""} suivi{apartments.length !== 1 ? "s" : ""} · Barcelona 🏡
            </span>
            <span style={{
              display: "inline-block", width: 8, height: 8, borderRadius: "50%",
              background: connected ? "#4a9e6e" : "#c45a3c",
              boxShadow: connected ? "0 0 6px #4a9e6e80" : "none",
            }} />
            <span style={{ fontSize: 11, color: connected ? "#7ac09a" : "#e08070" }}>
              {connected ? "synchro" : "hors ligne"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 20, borderBottom: "1px solid #3a5a48" }}>
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: "10px 20px", background: "transparent", border: "none",
                borderBottom: activeTab === tab.key ? "2px solid #4a9e6e" : "2px solid transparent",
                color: activeTab === tab.key ? "#f8f6f2" : "#7a957e",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px",
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#a09a92" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 14, fontFamily: "'DM Mono', monospace" }}>Chargement...</div>
          </div>
        ) : (
          <>
            {activeTab === "list" && (
              <ListView
                apartments={apartments}
                onEdit={(id) => { setEditingId(id); setActiveTab("edit"); }}
                onAdd={addApartment}
                onReset={resetAll}
              />
            )}
            {activeTab === "edit" && editingApt && (
              <EditView
                apt={editingApt}
                onUpdate={updateApartment}
                onDelete={deleteApartment}
                onBack={() => setActiveTab("list")}
              />
            )}
            {activeTab === "ranking" && (
              <RankingView apartments={apartments} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
