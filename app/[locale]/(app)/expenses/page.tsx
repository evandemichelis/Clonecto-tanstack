"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FileDown } from "lucide-react";
import { useExpenses } from "@/lib/queries/expenses";
import Badge, { expenseStatusVariant } from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import ExpenseForm from "@/components/Forms/ExpenseForm/ExpenseForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExpenseStatus } from "@/types";
import styles from "../invoices/page.module.scss";

const EXPENSE_STATUSES = ["to_review", "to_pay", "paid"] as const;

export default function ExpensesPage() {
  const router = useRouter();
  const t = useTranslations();
  const { data: expenses = [] } = useExpenses();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | "">("");

  const STATUS_OPTIONS = [
    { value: "" as const, label: t("common.allStatuses") },
    ...EXPENSE_STATUSES.map((s) => ({
      value: s,
      label: t(`status.expense.${s}` as Parameters<typeof t>[0]),
    })),
  ];

  const filtered = useMemo(
    () =>
      expenses.filter((exp) => {
        const matchSearch = exp.supplier
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchSearch && (!statusFilter || exp.status === statusFilter);
      }),
    [expenses, search, statusFilter],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>{t("expenses.title")}</h1>
        <Button onClick={() => setShowModal(true)}>{t("expenses.new")}</Button>
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
            setStatusFilter(e.target.value as ExpenseStatus | "")
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
            <p>{t("expenses.empty")}</p>
            {expenses.length === 0 && (
              <Button onClick={() => setShowModal(true)}>
                {t("expenses.createFirst")}
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("expenses.table.supplier")}</th>
                <th>{t("common.date")}</th>
                <th>{t("common.amounts.subtotalCol")}</th>
                <th>{t("common.amounts.totalCol")}</th>
                <th>{t("common.status")}</th>
                <th className={styles.actionCol}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => router.push(`/expenses/${exp.id}`)}
                >
                  <td>{exp.supplier}</td>
                  <td className={styles.dateCol}>{formatDate(exp.date)}</td>
                  <td className={styles.amount}>
                    {formatCurrency(exp.subtotal)}
                  </td>
                  <td className={styles.amount}>{formatCurrency(exp.total)}</td>
                  <td>
                    <Badge
                      variant={expenseStatusVariant[exp.status]}
                      label={t(`status.expense.${exp.status}` as Parameters<typeof t>[0])}
                    />
                  </td>
                  <td className={styles.actionCol}>
                    <button
                      className={styles.exportBtn}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { generateExpensePDF } = await import("@/lib/pdf");
                        generateExpensePDF(exp, t(`status.expense.${exp.status}` as Parameters<typeof t>[0]));
                      }}
                    >
                      <FileDown />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showModal && <ExpenseForm onClose={() => setShowModal(false)} />}
    </div>
  );
}
