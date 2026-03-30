import type { Invoice, Expense } from "@/types";
import type { Translations } from "@/locales/fr";
import { formatCurrency, formatDate } from "./utils";

const PRIMARY: [number, number, number] = [95, 99, 242];
const DARK: [number, number, number] = [30, 30, 30];
const MUTED: [number, number, number] = [130, 130, 140];
const LIGHT: [number, number, number] = [246, 247, 255];

// jsPDF uses WinAnsiEncoding — replace non-breaking spaces so amounts render correctly
const fmt = (n: number) => formatCurrency(n).replace(/\u00A0/g, " ");

export async function generateInvoicePDF(invoice: Invoice, t: Translations) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const W = doc.internal.pageSize.width;

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 30, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("CLONECTO", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("FACTURE", W - 14, 20, { align: "right" });

  // ── Invoice number ────────────────────────────────────────────
  doc.setTextColor(...DARK);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.number, W - 14, 44, { align: "right" });

  // ── Meta info (left) ──────────────────────────────────────────
  const meta: [string, string][] = [
    ["Date", formatDate(invoice.date)],
    ["Echeance", formatDate(invoice.dueDate)],
    ["Statut", t.status.invoice[invoice.status]],
  ];
  let y = 40;
  for (const [label, value] of meta) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, 14, y);
    doc.setTextColor(...DARK);
    doc.text(value, 48, y);
    y += 7;
  }

  // ── Client box (right) ────────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.roundedRect(W / 2, 33, W / 2 - 14, 26, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("FACTURER A", W / 2 + 6, 41);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(invoice.clientName, W / 2 + 6, 51);

  // ── Items table ───────────────────────────────────────────────
  autoTable(doc, {
    startY: 70,
    head: [
      ["Description", "Montant HT", `TVA (${invoice.vatRate}%)`, "Total TTC"],
    ],
    body: [
      [
        "Prestation de services",
        fmt(invoice.subtotal),
        fmt(invoice.vat),
        fmt(invoice.total),
      ],
    ],
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: "bold",
    },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right", fontStyle: "bold" },
    },
  });

  // ── Totals ────────────────────────────────────────────────────
  const x1 = W - 85;
  const x2 = W - 14;
  let ty = (doc as any).lastAutoTable.finalY + 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.setTextColor(...MUTED);
  doc.text("Montant HT", x1, ty);
  doc.setTextColor(...DARK);
  doc.text(fmt(invoice.subtotal), x2, ty, { align: "right" });

  ty += 8;
  doc.setTextColor(...MUTED);
  doc.text(`TVA ${invoice.vatRate}%`, x1, ty);
  doc.setTextColor(...DARK);
  doc.text(fmt(invoice.vat), x2, ty, { align: "right" });

  ty += 4;
  doc.setFillColor(...LIGHT);
  doc.rect(x1 - 6, ty + 1, W - x1 + 6, 13, "F");
  ty += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PRIMARY);
  doc.text("Total TTC", x1, ty);
  doc.text(fmt(invoice.total), x2, ty, { align: "right" });

  // ── Notes ─────────────────────────────────────────────────────
  if (invoice.notes) {
    ty += 16;
    doc.setFillColor(...LIGHT);
    doc.rect(14, ty - 5, W - 28, 20, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MUTED);
    doc.text("NOTES", 18, ty);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(invoice.notes, 18, ty + 7);
  }

  doc.save(`${invoice.number}.pdf`);
}

export async function generateExpensePDF(expense: Expense, t: Translations) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const W = doc.internal.pageSize.width;

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 30, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("CLONECTO", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("NOTE DE FRAIS", W - 14, 20, { align: "right" });

  // ── Supplier box (right) ──────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.roundedRect(W / 2, 33, W / 2 - 14, 26, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("FOURNISSEUR", W / 2 + 6, 41);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(expense.supplier, W / 2 + 6, 51);

  // ── Meta info (left) ──────────────────────────────────────────
  const meta: [string, string][] = [
    ["Date", formatDate(expense.date)],
    ["Statut", t.status.expense[expense.status]],
  ];
  let y = 40;
  for (const [label, value] of meta) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, 14, y);
    doc.setTextColor(...DARK);
    doc.text(value, 48, y);
    y += 7;
  }

  // ── Items table ───────────────────────────────────────────────
  autoTable(doc, {
    startY: 70,
    head: [
      ["Description", "Montant HT", `TVA (${expense.vatRate}%)`, "Total TTC"],
    ],
    body: [
      [
        "Depense fournisseur",
        fmt(expense.subtotal),
        fmt(expense.vat),
        fmt(expense.total),
      ],
    ],
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: "bold",
    },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right", fontStyle: "bold" },
    },
  });

  // ── Totals ────────────────────────────────────────────────────
  const x1 = W - 85;
  const x2 = W - 14;
  let ty = (doc as any).lastAutoTable.finalY + 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.setTextColor(...MUTED);
  doc.text("Montant HT", x1, ty);
  doc.setTextColor(...DARK);
  doc.text(fmt(expense.subtotal), x2, ty, { align: "right" });

  ty += 8;
  doc.setTextColor(...MUTED);
  doc.text(`TVA ${expense.vatRate}%`, x1, ty);
  doc.setTextColor(...DARK);
  doc.text(fmt(expense.vat), x2, ty, { align: "right" });

  ty += 4;
  doc.setFillColor(...LIGHT);
  doc.rect(x1 - 6, ty + 1, W - x1 + 6, 13, "F");
  ty += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PRIMARY);
  doc.text("Total TTC", x1, ty);
  doc.text(fmt(expense.total), x2, ty, { align: "right" });

  // ── Notes ─────────────────────────────────────────────────────
  if (expense.notes) {
    ty += 16;
    doc.setFillColor(...LIGHT);
    doc.rect(14, ty - 5, W - 28, 20, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MUTED);
    doc.text("NOTES", 18, ty);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(expense.notes, 18, ty + 7);
  }

  doc.save(`depense-${expense.supplier}-${expense.date}.pdf`);
}
