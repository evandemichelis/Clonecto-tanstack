"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useInvoices, useAddInvoice, useUpdateInvoice } from "@/lib/queries/invoices";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import { Invoice } from "@/types";
import {
  generateInvoiceNumber,
  computeAmounts,
  formatCurrency,
  today,
  dateIn,
} from "@/lib/utils";
import styles from "./InvoiceForm.module.scss";

interface Props {
  onClose: () => void;
  invoice?: Invoice;
}

export default function InvoiceForm({ onClose, invoice }: Props) {
  const t = useTranslations();
  const { data: invoices = [] } = useInvoices();
  const addInvoice = useAddInvoice();
  const updateInvoice = useUpdateInvoice();
  const [form, setForm] = useState(() => ({
    clientName: invoice?.clientName ?? "",
    date: invoice?.date ?? today(),
    dueDate: invoice?.dueDate ?? dateIn(30),
    subtotal: invoice?.subtotal?.toString() ?? "",
    vatRate: invoice?.vatRate?.toString() ?? "20",
    notes: invoice?.notes ?? "",
  }));

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const { vat, total } = computeAmounts(
    parseFloat(form.subtotal) || 0,
    parseFloat(form.vatRate) || 0,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim() || !form.subtotal) return;
    const data = {
      clientName: form.clientName.trim(),
      date: form.date,
      dueDate: form.dueDate,
      subtotal: parseFloat(form.subtotal),
      vatRate: parseFloat(form.vatRate) || 0,
      vat,
      total,
      notes: form.notes,
    };
    if (invoice) {
      await updateInvoice.mutateAsync({ id: invoice.id, data });
    } else {
      await addInvoice.mutateAsync({ ...data, number: generateInvoiceNumber(invoices), status: "to_send" });
    }
    onClose();
  }

  return (
    <Modal
      title={invoice ? t("invoices.form.editTitle") : t("invoices.form.title")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {invoice ? t("common.edit") : t("common.create")}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>{t("invoices.form.client")}</label>
          <input
            type="text"
            placeholder={t("invoices.form.clientPlaceholder")}
            {...field("clientName")}
            required
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>{t("invoices.form.date")}</label>
            <input type="date" {...field("date")} />
          </div>
          <div className={styles.formGroup}>
            <label>{t("invoices.form.dueDate")}</label>
            <input type="date" {...field("dueDate")} />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>{t("common.amounts.subtotal")}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...field("subtotal")}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t("common.amounts.vatRate")}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...field("vatRate")}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>{t("common.amounts.vat")}</label>
            <div className={styles.computed}>{formatCurrency(vat)}</div>
          </div>
          <div className={styles.formGroup}>
            <label>{t("common.amounts.total")}</label>
            <div className={styles.computed}>{formatCurrency(total)}</div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>{t("common.notes")}</label>
          <textarea
            placeholder={t("common.notesPlaceholder")}
            {...field("notes")}
          />
        </div>
      </form>
    </Modal>
  );
}
