"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { fr, type Translations } from "@/locales/fr";
import { en } from "@/locales/en";

const locales = { fr, en };
export type Locale = keyof typeof locales;

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "fr",
  t: fr,
  setLocale: () => {},
});

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Locale {
  const saved = localStorage.getItem("kolecto_locale") as Locale | null;
  if (saved && saved in locales) return saved;
  return "fr";
}

function getServerSnapshot(): Locale {
  return "fr";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function setLocale(l: Locale) {
    localStorage.setItem("kolecto_locale", l);
    listeners.forEach((cb) => cb());
  }

  return (
    <LocaleContext.Provider value={{ locale, t: locales[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
