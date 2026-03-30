"use client";

import { useTheme } from "@/lib/theme/ThemeContext";
import { useLocale, type Locale } from "@/lib/locale/LocaleContext";
import styles from "./page.module.scss";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useLocale();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{t.settings.title}</h1>
      </div>

      <div className={styles.section}>
        <h2>{t.settings.appearance.label}</h2>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${theme === "light" ? styles.active : ""}`}
            onClick={() => theme !== "light" && toggleTheme()}
          >
            {t.settings.appearance.light}
          </button>
          <button
            className={`${styles.option} ${theme === "dark" ? styles.active : ""}`}
            onClick={() => theme !== "dark" && toggleTheme()}
          >
            {t.settings.appearance.dark}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>{t.settings.language.label}</h2>
        <div className={styles.options}>
          {(["fr", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              className={`${styles.option} ${locale === l ? styles.active : ""}`}
              onClick={() => setLocale(l)}
            >
              {t.settings.language[l]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
