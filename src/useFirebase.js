import { useState, useEffect, useRef, useCallback } from "react";
import { db, ref, onValue, set } from "./firebase";

// Firebase converts arrays to objects with numeric keys.
// This converts them back to arrays when needed.
function firebaseToArray(data) {
  if (data === null || data === undefined) return null;
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    const keys = Object.keys(data);
    // Check if it looks like a Firebase-converted array (numeric keys)
    const isNumeric = keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
    if (isNumeric) {
      const arr = [];
      keys.forEach((k) => {
        arr[parseInt(k, 10)] = data[k];
      });
      // Remove any undefined holes
      return arr.filter((item) => item !== undefined && item !== null);
    }
  }
  return data;
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
          const data =
            Array.isArray(initialValue) ? firebaseToArray(raw) : raw;
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
