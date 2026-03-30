"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FileDown } from "lucide-react";
import { useInvoices } from "@/lib/queries/invoices";
import Badge, { invoiceStatusVariant } from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import InvoiceForm from "@/components/Forms/InvoiceForm/InvoiceForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceStatus } from "@/types";
import styles from "./page.module.scss";

const INVOICE_STATUSES = ["to_send", "pending", "paid", "overdue"] as const;

export default function InvoicesPage() {
  const router = useRouter();
  const t = useTranslations();
  const { data: invoices = [] } = useInvoices();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "">("");

  const STATUS_OPTIONS = [
    { value: "" as const, label: t("common.allStatuses") },
    ...INVOICE_STATUSES.map((s) => ({
      value: s,
      label: t(`status.invoice.${s}` as Parameters<typeof t>[0]),
    })),
  ];

  const filtered = useMemo(
    () =>
      invoices.filter((inv) => {
        const matchSearch =
          inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
          inv.number.toLowerCase().includes(search.toLowerCase());
        return matchSearch && (!statusFilter || inv.status === statusFilter);
      }),
    [invoices, search, statusFilter],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>{t("invoices.title")}</h1>
        <Button onClick={() => setShowModal(true)}>{t("invoices.new")}</Button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder={t("common.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as InvoiceStatus | "")
          }
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.card}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>{t("invoices.empty")}</p>
            {invoices.length === 0 && (
              <Button onClick={() => setShowModal(true)}>
                {t("invoices.createFirst")}
              </Button>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("invoices.table.number")}</th>
                <th>{t("invoices.table.client")}</th>
                <th>{t("invoices.table.date")}</th>
                <th>{t("invoices.table.dueDate")}</th>
                <th>{t("common.amounts.subtotalCol")}</th>
                <th>{t("common.amounts.totalCol")}</th>
                <th>{t("common.status")}</th>
                <th className={styles.actionCol}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => router.push(`/invoices/${inv.id}`)}
                >
                  <td>{inv.number}</td>
                  <td>{inv.clientName}</td>
                  <td className={styles.dateCol}>{formatDate(inv.date)}</td>
                  <td className={styles.dateCol}>{formatDate(inv.dueDate)}</td>
                  <td className={styles.amount}>
                    {formatCurrency(inv.subtotal)}
                  </td>
                  <td className={styles.amount}>{formatCurrency(inv.total)}</td>
                  <td>
                    <Badge
                      variant={invoiceStatusVariant[inv.status]}
                      label={t(`status.invoice.${inv.status}` as Parameters<typeof t>[0])}
                    />
                  </td>
                  <td className={styles.actionCol}>
                    <button
                      className={styles.exportBtn}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { generateInvoicePDF } = await import("@/lib/pdf");
                        generateInvoicePDF(inv, t(`status.invoice.${inv.status}` as Parameters<typeof t>[0]));
                      }}
                    >
                      <FileDown />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <InvoiceForm onClose={() => setShowModal(false)} />}
    </div>
  );
}
