import { Invoice } from "@/types";

export const today = () => new Date().toISOString().split("T")[0];

export const dateIn = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export function generateInvoiceNumber(existing: Invoice[]): string {
  const year = new Date().getFullYear();
  const count =
    existing.filter((i) => i.number.startsWith(`FAC-${year}-`)).length + 1;
  return `FAC-${year}-${String(count).padStart(3, "0")}`;
}

export function computeAmounts(subtotal: number, vatRate: number) {
  const vat = Math.round(subtotal * (vatRate / 100) * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;
  return { vat, total };
}

const currencyFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});
const dateFmt = new Intl.DateTimeFormat("fr-FR");

export const formatCurrency = (n: number) => currencyFmt.format(n);
export const formatDate = (s: string) =>
  s ? dateFmt.format(new Date(s)) : "—";
