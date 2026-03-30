"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Layers,
  Settings,
} from "lucide-react";
import { useLocale } from "@/lib/locale/LocaleContext";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  { href: "/dashboard", key: "dashboard" as const, Icon: LayoutDashboard },
  { href: "/invoices", key: "invoices" as const, Icon: FileText },
  { href: "/expenses", key: "expenses" as const, Icon: Receipt },
  { href: "/clients", key: "clients" as const, Icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLocale();

  const navLink = (href: string, Icon: React.ElementType, label: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        key={href}
        href={href}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Layers size={20} />
        </div>
        <span>Clonecto</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, key, Icon }) =>
          navLink(href, Icon, t.nav[key]),
        )}
      </nav>

      <div className={styles.footer}>
        {navLink("/settings", Settings, t.nav.settings)}
      </div>
    </aside>
  );
}
