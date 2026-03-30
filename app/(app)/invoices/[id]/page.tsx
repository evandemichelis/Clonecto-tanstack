"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useInvoices, useUpdateInvoice, useDeleteInvoice } from "@/lib/queries/invoices";
import Badge, { invoiceStatusVariant } from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import InvoiceForm from "@/components/Forms/InvoiceForm/InvoiceForm";
import { useLocale } from "@/lib/locale/LocaleContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceStatus } from "@/types";
import styles from "./page.module.scss";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLocale();
  const { data: invoices = [] } = useInvoices();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const invoice = invoices.find((i) => i.id === id);
  const [editOpen, setEditOpen] = useState(false);

  if (!invoice) {
    return (
      <div className={styles.page}>
        <button className={styles.back} onClick={() => router.push("/invoices")}>
          ← Retour
        </button>
        <p style={{ color: "var(--color-text-secondary)" }}>
          {t.invoices.notFound}
        </p>
      </div>
    );
  }

  async function handleDelete() {
    if (confirm(t.invoices.deleteConfirm(invoice!.number))) {
      await deleteInvoice.mutateAsync(id);
      router.push("/invoices");
    }
  }

  return (
    <div className={styles.page}>
      {editOpen && (
        <InvoiceForm invoice={invoice} onClose={() => setEditOpen(false)} />
      )}

      <button className={styles.back} onClick={() => router.push("/invoices")}>
        {t.invoices.backToList}
      </button>

      <div className={styles.pageHeader}>
        <div>
          <h1>{invoice.number}</h1>
          <div className={styles.sub}>{invoice.clientName}</div>
        </div>
        <div className={styles.actions}>
          <Badge
            variant={invoiceStatusVariant[invoice.status]}
            label={t.status.invoice[invoice.status]}
          />
          {invoice.status !== "paid" && (
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              {t.common.edit}
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={handleDelete}>
            {t.common.delete}
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t.invoices.detail.info}</div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{t.invoices.detail.client}</div>
            <div className={styles.fieldValue}>{invoice.clientName}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{t.invoices.detail.number}</div>
            <div className={styles.fieldValue}>{invoice.number}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{t.invoices.detail.date}</div>
            <div className={styles.fieldValue}>{formatDate(invoice.date)}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{t.invoices.detail.dueDate}</div>
            <div className={styles.fieldValue}>{formatDate(invoice.dueDate)}</div>
          </div>
        </div>
        {invoice.notes && <div className={styles.notes}>{invoice.notes}</div>}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t.invoices.detail.amounts}</div>
        <div className={styles.amountRow}>
          <span>{t.common.amounts.subtotalCol}</span>
          <span>{formatCurrency(invoice.subtotal)}</span>
        </div>
        <div className={styles.amountRow}>
          <span>TVA ({invoice.vatRate}%)</span>
          <span>{formatCurrency(invoice.vat)}</span>
        </div>
        <div className={styles.amountRowTotal}>
          <span>{t.common.amounts.totalCol}</span>
          <span>{formatCurrency(invoice.total)}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t.common.status}</div>
        <div className={styles.statusSelect}>
          <label>{t.invoices.detail.changeStatus}</label>
          <select
            value={invoice.status}
            onChange={(e) =>
              updateInvoice.mutate({ id, data: { status: e.target.value as InvoiceStatus } })
            }
          >
            {(Object.keys(t.status.invoice) as InvoiceStatus[]).map((v) => (
              <option key={v} value={v}>
                {t.status.invoice[v]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
