"use client";

import { useState } from "react";
import { useAddClient, useUpdateClient } from "@/lib/queries/clients";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import { useLocale } from "@/lib/locale/LocaleContext";
import { Client } from "@/types";
import styles from "./ClientForm.module.scss";

interface Props {
  onClose: () => void;
  client?: Client;
}

export default function ClientForm({ onClose, client }: Props) {
  const { t } = useLocale();
  const addClient = useAddClient();
  const updateClient = useUpdateClient();
  const [form, setForm] = useState(() => ({
    name: client?.name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
    siret: client?.siret ?? "",
  }));

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const data = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      siret: form.siret.trim(),
    };
    if (client) {
      await updateClient.mutateAsync({ id: client.id, data });
    } else {
      await addClient.mutateAsync(data);
    }
    onClose();
  }

  return (
    <Modal
      title={client ? t.clients.form.editTitle : t.clients.form.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit}>
            {client ? t.common.edit : t.common.create}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>{t.clients.form.name}</label>
          <input
            type="text"
            placeholder={t.clients.form.namePlaceholder}
            {...field("name")}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>{t.clients.form.email}</label>
          <input
            type="email"
            placeholder={t.clients.form.emailPlaceholder}
            {...field("email")}
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>{t.clients.form.phone}</label>
            <input
              type="tel"
              placeholder={t.clients.form.phonePlaceholder}
              {...field("phone")}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t.clients.form.siret}</label>
            <input
              type="text"
              placeholder={t.clients.form.siretPlaceholder}
              {...field("siret")}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>{t.clients.form.address}</label>
          <input
            type="text"
            placeholder={t.clients.form.addressPlaceholder}
            {...field("address")}
          />
        </div>
      </form>
    </Modal>
  );
}
