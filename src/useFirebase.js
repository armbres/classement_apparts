import { useState, useEffect, useRef, useCallback } from "react";
import { db, ref, onValue, set } from "./firebase";

// Firebase converts arrays to objects with numeric keys.
// This converts them back to arrays when needed.
function firebaseToArray(data) {
  if (data === null || data === undefined) return null;
  if (Array.isArray(data)) return data.filter(Boolean);
  if (typeof data === "object") {
    const keys = Object.keys(data);
    const isNumeric = keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
    if (isNumeric) {
      const arr = [];
      keys.forEach((k) => {
        arr[parseInt(k, 10)] = data[k];
      });
      return arr.filter(Boolean);
    }
  }
  return data;
}

// Firebase strips empty objects like scores: {}.
// Ensure every apartment has all required fields.
function sanitizeApartments(data) {
  if (!Array.isArray(data)) return [];
  return data.filter(Boolean).map((apt) => ({
    id: apt.id || Date.now() + Math.random(),
    name: apt.name || "",
    address: apt.address || "",
    price: apt.price || "",
    sqm: apt.sqm || "",
    rooms: apt.rooms || "",
    floor: apt.floor || "",
    notes: apt.notes || "",
    pros: apt.pros || "",
    cons: apt.cons || "",
    scores: apt.scores && typeof apt.scores === "object" ? apt.scores : {},
    favorite: apt.favorite || false,
    visited: apt.visited || false,
    visitDate: apt.visitDate || "",
    emoji: apt.emoji || "",
    link: apt.link || "",
    photos: Array.isArray(apt.photos) ? apt.photos.filter(Boolean) : [],
  }));
}

export function useFirebase(path, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const isWriting = useRef(false);

  // Listen for changes from Firebase
  useEffect(() => {
    let dbRef;
    try {
      dbRef = ref(db, path);
    } catch (err) {
      console.error("Firebase ref error:", err);
      setLoading(false);
      return;
    }

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        // Skip echoes from our own writes
        if (isWriting.current) {
          isWriting.current = false;
          return;
        }
        try {
          const raw = snapshot.val();
          const converted =
            Array.isArray(initialValue) ? firebaseToArray(raw) : raw;
          const data =
            Array.isArray(initialValue) ? sanitizeApartments(converted) : converted;
          setValue(data !== null && data !== undefined ? data : initialValue);
          setConnected(true);
        } catch (err) {
          console.error("Firebase parse error:", err);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase read error:", error);
        setLoading(false);
        setConnected(false);
        // Fallback to localStorage
        try {
          const local = localStorage.getItem(`fb_${path}`);
          if (local) {
            const parsed = JSON.parse(local);
            setValue(parsed);
          }
        } catch {}
      }
    );
    return () => unsubscribe();
  }, [path]);

  // Write to Firebase
  const setAndSync = useCallback(
    (newValueOrFn) => {
      setValue((prev) => {
        const next =
          typeof newValueOrFn === "function" ? newValueOrFn(prev) : newValueOrFn;

        // Save to localStorage as backup
        try {
          localStorage.setItem(`fb_${path}`, JSON.stringify(next));
        } catch {}

        // Write to Firebase
        isWriting.current = true;
        set(ref(db, path), next).catch((err) => {
          console.error("Firebase write error:", err);
          isWriting.current = false;
        });

        return next;
      });
    },
    [path]
  );

  return [value, setAndSync, { loading, connected }];
}
