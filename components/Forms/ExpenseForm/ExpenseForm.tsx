"use client";

import { useState } from "react";
import { useAddExpense, useUpdateExpense } from "@/lib/queries/expenses";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import { useLocale } from "@/lib/locale/LocaleContext";
import { Expense } from "@/types";
import { computeAmounts, formatCurrency, today } from "@/lib/utils";
import styles from "./ExpenseForm.module.scss";

interface Props {
  onClose: () => void;
  expense?: Expense;
}

export default function ExpenseForm({ onClose, expense }: Props) {
  const { t } = useLocale();
  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const [form, setForm] = useState(() => ({
    supplier: expense?.supplier ?? "",
    date: expense?.date ?? today(),
    subtotal: expense?.subtotal?.toString() ?? "",
    vatRate: expense?.vatRate?.toString() ?? "20",
    notes: expense?.notes ?? "",
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
    if (!form.supplier.trim() || !form.subtotal) return;
    const data = {
      supplier: form.supplier.trim(),
      date: form.date,
      subtotal: parseFloat(form.subtotal),
      vatRate: parseFloat(form.vatRate) || 0,
      vat,
      total,
      notes: form.notes,
    };
    if (expense) {
      await updateExpense.mutateAsync({ id: expense.id, data });
    } else {
      await addExpense.mutateAsync({ ...data, status: "to_review" });
    }
    onClose();
  }

  return (
    <Modal
      title={expense ? t.expenses.form.editTitle : t.expenses.form.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit}>
            {expense ? t.common.edit : t.common.create}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>{t.expenses.form.supplier}</label>
          <input
            type="text"
            placeholder={t.expenses.form.supplierPlaceholder}
            {...field("supplier")}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>{t.common.date}</label>
          <input type="date" {...field("date")} />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>{t.common.amounts.subtotal}</label>
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
            <label>{t.common.amounts.vatRate}</label>
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
            <label>{t.common.amounts.vat}</label>
            <div className={styles.computed}>{formatCurrency(vat)}</div>
          </div>
          <div className={styles.formGroup}>
            <label>{t.common.amounts.total}</label>
            <div className={styles.computed}>{formatCurrency(total)}</div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>{t.common.notes}</label>
          <textarea
            placeholder={t.common.notesPlaceholder}
            {...field("notes")}
          />
        </div>
      </form>
    </Modal>
  );
}
