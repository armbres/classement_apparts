import { useState, useEffect, useRef, useCallback } from "react";
import { db, ref, onValue, set } from "./firebase";

export function useFirebase(path, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const skipNextSync = useRef(false);

  // Listen for changes from Firebase
  useEffect(() => {
    const dbRef = ref(db, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (skipNextSync.current) {
          skipNextSync.current = false;
          return;
        }
        const data = snapshot.val();
        setValue(data !== null ? data : initialValue);
        setLoading(false);
        setConnected(true);
      },
      (error) => {
        console.error("Firebase read error:", error);
        setLoading(false);
        setConnected(false);
        // Fallback to localStorage
        try {
          const local = localStorage.getItem(`fb_${path}`);
          if (local) setValue(JSON.parse(local));
        } catch {}
      }
    );
    return () => unsubscribe();
  }, [path, initialValue]);

  // Write to Firebase
  const setAndSync = useCallback(
    (newValueOrFn) => {
      setValue((prev) => {
        const next =
          typeof newValueOrFn === "function" ? newValueOrFn(prev) : newValueOrFn;
        // Write to Firebase
        skipNextSync.current = true;
        set(ref(db, path), next).catch((err) => {
          console.error("Firebase write error:", err);
          skipNextSync.current = false;
        });
        // Also save to localStorage as backup
        try {
          localStorage.setItem(`fb_${path}`, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [path]
  );

  return [value, setAndSync, { loading, connected }];
}
