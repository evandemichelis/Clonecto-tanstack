"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Layers,
  Settings,
  Menu,
} from "lucide-react";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  { href: "/dashboard", key: "nav.dashboard" as const, Icon: LayoutDashboard },
  { href: "/invoices", key: "nav.invoices" as const, Icon: FileText },
  { href: "/expenses", key: "nav.expenses" as const, Icon: Receipt },
  { href: "/clients", key: "nav.clients" as const, Icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const navLink = (href: string, Icon: React.ElementType, label: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        key={href}
        href={href}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/dashboard" className={styles.logoLink} onClick={() => setIsOpen(false)}>
          <div className={styles.logoIcon}>
            <Layers size={20} />
          </div>
          <span>Clonecto</span>
        </Link>
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
        {NAV_ITEMS.map(({ href, key, Icon }) =>
          navLink(href, Icon, t(key)),
        )}
      </nav>

      <div className={`${styles.footer} ${isOpen ? styles.footerOpen : ""}`}>
        {navLink("/settings", Settings, t("nav.settings"))}
      </div>
    </aside>
  );
}
