"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTheme } from "@/lib/theme/ThemeContext";
import { routing, type Locale } from "@/i18n/routing";
import styles from "./page.module.scss";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleLocaleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{t("settings.title")}</h1>
      </div>

      <div className={styles.section}>
        <h2>{t("settings.appearance.label")}</h2>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${theme === "light" ? styles.active : ""}`}
            onClick={() => theme !== "light" && toggleTheme()}
          >
            {t("settings.appearance.light")}
          </button>
          <button
            className={`${styles.option} ${theme === "dark" ? styles.active : ""}`}
            onClick={() => theme !== "dark" && toggleTheme()}
          >
            {t("settings.appearance.dark")}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>{t("settings.language.label")}</h2>
        <div className={styles.options}>
          {routing.locales.map((l) => (
            <button
              key={l}
              className={`${styles.option} ${locale === l ? styles.active : ""}`}
              onClick={() => handleLocaleChange(l)}
            >
              {t(`settings.language.${l}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
