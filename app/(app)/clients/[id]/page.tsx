"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useClients, useDeleteClient } from "@/lib/queries/clients";
import { useInvoices } from "@/lib/queries/invoices";
import Badge, { invoiceStatusVariant } from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import ClientForm from "@/components/Forms/ClientForm/ClientForm";
import { useLocale } from "@/lib/locale/LocaleContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import styles from "./page.module.scss";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLocale();
  const [editOpen, setEditOpen] = useState(false);

  const { data: clients = [] } = useClients();
  const { data: allInvoices = [] } = useInvoices();
  const deleteClient = useDeleteClient();

  const client = clients.find((c) => c.id === id);
  const invoices = allInvoices.filter(
    (i) => i.clientName.toLowerCase() === (client?.name ?? "").toLowerCase(),
  );

  if (!client) {
    return (
      <div className={styles.page}>
        <button className={styles.back} onClick={() => router.push("/clients")}>
          ← Retour
        </button>
        <p style={{ color: "var(--color-text-secondary)" }}>
          {t.clients.notFound}
        </p>
      </div>
    );
  }

  async function handleDelete() {
    if (confirm(t.clients.deleteConfirm(client!.name))) {
      await deleteClient.mutateAsync(id);
      router.push("/clients");
    }
  }

  return (
    <div className={styles.page}>
      {editOpen && (
        <ClientForm client={client} onClose={() => setEditOpen(false)} />
      )}

      <button className={styles.back} onClick={() => router.push("/clients")}>
        {t.clients.backToList}
      </button>

      <div className={styles.pageHeader}>
        <div>
          <div className={styles.avatar}>
            {client.name.charAt(0).toUpperCase()}
          </div>
          <h1>{client.name}</h1>
          {client.email && <div className={styles.sub}>{client.email}</div>}
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            {t.common.edit}
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            {t.common.delete}
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t.clients.detail.info}</div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{t.clients.form.name}</div>
            <div className={styles.fieldValue}>{client.name}</div>
          </div>
          {client.email && (
            <div className={styles.field}>
              <div className={styles.fieldLabel}>{t.clients.form.email}</div>
              <div className={styles.fieldValue}>{client.email}</div>
            </div>
          )}
          {client.phone && (
            <div className={styles.field}>
              <div className={styles.fieldLabel}>{t.clients.form.phone}</div>
              <div className={styles.fieldValue}>{client.phone}</div>
            </div>
          )}
          {client.siret && (
            <div className={styles.field}>
              <div className={styles.fieldLabel}>{t.clients.form.siret}</div>
              <div className={styles.fieldValue}>{client.siret}</div>
            </div>
          )}
          {client.address && (
            <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
              <div className={styles.fieldLabel}>{t.clients.form.address}</div>
              <div className={styles.fieldValue}>{client.address}</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>{t.clients.detail.invoices(invoices.length)}</div>
        {invoices.length === 0 ? (
          <div className={styles.empty}>{t.clients.detail.noInvoices}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.invoices.table.number}</th>
                <th>{t.common.date}</th>
                <th>{t.common.amounts.totalCol}</th>
                <th>{t.common.status}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} onClick={() => router.push(`/invoices/${inv.id}`)}>
                  <td>{inv.number}</td>
                  <td>{formatDate(inv.date)}</td>
                  <td className={styles.amount}>{formatCurrency(inv.total)}</td>
                  <td>
                    <Badge
                      variant={invoiceStatusVariant[inv.status]}
                      label={t.status.invoice[inv.status]}
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
