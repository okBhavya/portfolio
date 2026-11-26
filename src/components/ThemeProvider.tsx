"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type DeskTheme = "day" | "night";

interface ThemeContextValue {
  theme: DeskTheme;
  toggleTheme: () => void;
  setTheme: (theme: DeskTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "day",
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "bhavya-desk-theme";
const THEME_EVENT = "bhavya-desk-theme-change";

function readThemeSnapshot(): DeskTheme {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "night" ? "night" : "day";
  } catch {
    return "day";
  }
}

function getServerThemeSnapshot(): DeskTheme {
  return "day";
}

function subscribeTheme(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((next: DeskTheme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures in restricted browsing contexts
    }
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "day" ? "night" : "day");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useDeskTheme() {
  return useContext(ThemeContext);
}
