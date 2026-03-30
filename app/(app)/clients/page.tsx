"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useClients } from "@/lib/queries/clients";
import Button from "@/components/Button/Button";
import ClientForm from "@/components/Forms/ClientForm/ClientForm";
import { useLocale } from "@/lib/locale/LocaleContext";
import styles from "./page.module.scss";

export default function ClientsPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { data: clients = [] } = useClients();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [clients, search],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>{t.clients.title}</h1>
        <Button onClick={() => setShowModal(true)}>{t.clients.new}</Button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder={t.clients.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>{t.clients.empty}</p>
            <Button onClick={() => setShowModal(true)}>
              {t.clients.createFirst}
            </Button>
          </div>
        ) : (
          filtered.map((client) => (
            <div
              key={client.id}
              className={styles.clientCard}
              onClick={() => router.push(`/clients/${client.id}`)}
            >
              <div className={styles.clientAvatar}>
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.clientName}>{client.name}</div>
              {client.email && (
                <div className={styles.clientInfo}>{client.email}</div>
              )}
              {client.phone && (
                <div className={styles.clientInfo}>{client.phone}</div>
              )}
              {client.address && (
                <div className={styles.clientInfo}>{client.address}</div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && <ClientForm onClose={() => setShowModal(false)} />}
    </div>
  );
}
