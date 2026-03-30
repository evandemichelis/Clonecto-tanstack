"use client";

import { useState } from "react";
import { use } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useExpenses, useUpdateExpense, useDeleteExpense } from "@/lib/queries/expenses";
import Badge, { expenseStatusVariant } from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import ExpenseForm from "@/components/Forms/ExpenseForm/ExpenseForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExpenseStatus } from "@/types";
import styles from "../../invoices/[id]/page.module.scss";

const EXPENSE_STATUSES = ["to_review", "to_pay", "paid"] as const;

export default function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations();
  const { data: expenses = [] } = useExpenses();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const expense = expenses.find((e) => e.id === id);
  const [editOpen, setEditOpen] = useState(false);

  if (!expense) {
    return (
      <div className={styles.page}>
        <button className={styles.back} onClick={() => router.push("/expenses")}>
          {t("common.back")}
        </button>
        <p style={{ color: "var(--color-text-secondary)" }}>
          {t("expenses.notFound")}
        </p>
      </div>
    );
  }

  async function handleDelete() {
    if (confirm(t("expenses.deleteConfirm", { supplier: expense!.supplier }))) {
      await deleteExpense.mutateAsync(id);
      router.push("/expenses");
    }
  }

  return (
    <div className={styles.page}>
      {editOpen && (
        <ExpenseForm expense={expense} onClose={() => setEditOpen(false)} />
      )}

      <button className={styles.back} onClick={() => router.push("/expenses")}>
        {t("expenses.backToList")}
      </button>

      <div className={styles.pageHeader}>
        <div>
          <h1>{expense.supplier}</h1>
          <div className={styles.sub}>{formatDate(expense.date)}</div>
        </div>
        <div className={styles.actions}>
          <Badge
            variant={expenseStatusVariant[expense.status]}
            label={t(`status.expense.${expense.status}` as Parameters<typeof t>[0])}
          />
          {expense.status !== "paid" && (
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              {t("common.edit")}
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={handleDelete}>
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t("expenses.detail.info")}</div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{t("expenses.detail.supplier")}</div>
            <div className={styles.fieldValue}>{expense.supplier}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{t("common.date")}</div>
            <div className={styles.fieldValue}>{formatDate(expense.date)}</div>
          </div>
        </div>
        {expense.notes && <div className={styles.notes}>{expense.notes}</div>}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t("invoices.detail.amounts")}</div>
        <div className={styles.amountRow}>
          <span>{t("common.amounts.subtotalCol")}</span>
          <span>{formatCurrency(expense.subtotal)}</span>
        </div>
        <div className={styles.amountRow}>
          <span>TVA ({expense.vatRate}%)</span>
          <span>{formatCurrency(expense.vat)}</span>
        </div>
        <div className={styles.amountRowTotal}>
          <span>{t("common.amounts.totalCol")}</span>
          <span>{formatCurrency(expense.total)}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t("common.status")}</div>
        <div className={styles.statusSelect}>
          <label>{t("invoices.detail.changeStatus")}</label>
          <select
            value={expense.status}
            onChange={(e) =>
              updateExpense.mutate({ id, data: { status: e.target.value as ExpenseStatus } })
            }
          >
            {EXPENSE_STATUSES.map((v) => (
              <option key={v} value={v}>
                {t(`status.expense.${v}` as Parameters<typeof t>[0])}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
