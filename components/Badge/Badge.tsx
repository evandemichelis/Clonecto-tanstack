import styles from "./Badge.module.scss";
import { InvoiceStatus, ExpenseStatus } from "@/types";

export type BadgeVariant =
  | "gray"
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "purple";

export const invoiceStatusVariant: Record<InvoiceStatus, BadgeVariant> = {
  to_send: "gray",
  pending: "blue",
  paid: "green",
  overdue: "red",
};

export const expenseStatusVariant: Record<ExpenseStatus, BadgeVariant> = {
  to_review: "gray",
  to_pay: "orange",
  paid: "green",
};

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

export default function Badge({ label, variant }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
