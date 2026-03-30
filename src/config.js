export const CRITERIA = [
  { key: "emplacement", label: "Emplacement", icon: "📍", weight: 3 },
  { key: "prix", label: "Prix", icon: "💰", weight: 3 },
  { key: "surface", label: "Surface / Agencement", icon: "📐", weight: 2 },
  { key: "luminosite", label: "Luminosité", icon: "☀️", weight: 2 },
  { key: "etat", label: "État général", icon: "🔧", weight: 2 },
  { key: "immeuble", label: "Immeuble / Copro", icon: "🏢", weight: 1 },
  { key: "transports", label: "Transports / Accès", icon: "🚇", weight: 2 },
  { key: "bruit", label: "Niveau de bruit", icon: "🔇", weight: 1 },
  { key: "exterieur", label: "Extérieur / Balcon", icon: "🌿", weight: 1 },
  { key: "feeling", label: "Coup de cœur", icon: "✨", weight: 2 },
];

export const STORAGE_KEY = "armance-fred-apparts";

export const createEmptyApt = () => ({
  id: Date.now() + Math.random(),
  name: "",
  address: "",
  price: "",
  sqm: "",
  rooms: "",
  floor: "",
  notes: "",
  pros: "",
  cons: "",
  scores: {},
  favorite: false,
  visited: false,
  visitDate: "",
});

export function computeWeightedScore(apt) {
  let total = 0;
  let maxTotal = 0;
  CRITERIA.forEach((c) => {
    const s = apt.scores[c.key];
    if (s !== undefined) {
      total += s * c.weight;
    }
    maxTotal += 10 * c.weight;
  });
  if (maxTotal === 0) return 0;
  return (total / maxTotal) * 10;
}

export const ACCENT_COLORS = [
  "#2e8b57", "#4a9e6e", "#3a7d5c", "#5aaa7a",
  "#6bb88a", "#338a5e", "#4caf70", "#27764a",
];

export const getColor = (i) => ACCENT_COLORS[i % ACCENT_COLORS.length];
