"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { CircleDollarSign, Users, Clock, CheckCheck } from "lucide-react";
import { useInvoices } from "@/lib/queries/invoices";
import { useExpenses } from "@/lib/queries/expenses";
import { useClients } from "@/lib/queries/clients";
import Badge, { invoiceStatusVariant } from "@/components/Badge/Badge";
import StatCard from "@/components/StatCard/StatCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import styles from "./page.module.scss";

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations();
  const { data: invoices = [] } = useInvoices();
  const { data: expenses = [] } = useExpenses();
  const { data: clients = [] } = useClients();

  const revenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);
  const costs = expenses
    .filter((e) => e.status === "paid")
    .reduce((s, e) => s + e.total, 0);
  const paidInvoices = invoices.filter((i) => i.status === "paid");

  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{t("dashboard.title")}</h1>
        <p>{dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}</p>
      </div>

      <div className={styles.stats}>
        <StatCard
          label={t("dashboard.stats.revenue")}
          value={formatCurrency(revenue - costs)}
          sub={t("dashboard.stats.revenueSub")}
          icon={<CircleDollarSign size={20} />}
        />
        <StatCard
          label={t("dashboard.stats.clients")}
          value={clients.length}
          sub={t("dashboard.stats.clientsSub")}
          icon={<Users size={20} />}
        />
        <StatCard
          label={t("dashboard.stats.pending")}
          value={invoices.length - paidInvoices.length}
          sub={t("dashboard.stats.pendingSub")}
          icon={<Clock size={20} />}
        />
        <StatCard
          label={t("dashboard.stats.paid")}
          value={paidInvoices.length}
          sub={t("dashboard.stats.paidSub")}
          icon={<CheckCheck size={20} />}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>{t("dashboard.recentInvoices")}</h2>
          <Link
            href="/invoices"
            style={{ fontSize: 13, color: "var(--color-primary)" }}
          >
            {t("common.seeAll")}
          </Link>
        </div>
        {invoices.length === 0 ? (
          <div className={styles.empty}>{t("dashboard.empty")}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("invoices.table.number")}</th>
                <th>{t("invoices.table.client")}</th>
                <th>{t("invoices.table.date")}</th>
                <th>{t("common.amounts.totalCol")}</th>
                <th>{t("common.status")}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => router.push(`/invoices/${inv.id}`)}
                >
                  <td>{inv.number}</td>
                  <td>{inv.clientName}</td>
                  <td>{formatDate(inv.date)}</td>
                  <td className={styles.amount}>{formatCurrency(inv.total)}</td>
                  <td>
                    <Badge
                      variant={invoiceStatusVariant[inv.status]}
                      label={t(`status.invoice.${inv.status}` as Parameters<typeof t>[0])}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
