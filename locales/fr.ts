export const fr = {
  nav: {
    dashboard: "Accueil",
    invoices: "Encaissements",
    expenses: "Dépenses",
    clients: "Clients",
    settings: "Paramètres",
  },

  common: {
    search: "Rechercher...",
    allStatuses: "Tous les statuts",
    cancel: "Annuler",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    back: "← Retour",
    notes: "Notes",
    notesPlaceholder: "Informations complémentaires...",
    seeAll: "Voir tout →",
    date: "Date",
    status: "Statut",
    amounts: {
      subtotal: "Montant HT (€) *",
      vatRate: "TVA (%)",
      vat: "TVA (€)",
      total: "Total TTC (€)",
      subtotalCol: "Montant HT",
      totalCol: "Montant TTC",
    },
  },

  status: {
    invoice: {
      to_send: "À envoyer",
      pending: "En attente",
      paid: "Payée",
      overdue: "En retard",
    },
    expense: {
      to_review: "À contrôler",
      to_pay: "À payer",
      paid: "Payée",
    },
  },

  dashboard: {
    title: "Accueil",
    recentInvoices: "Dernières factures",
    empty: "Aucune facture pour l'instant",
    stats: {
      revenue: "CA Net",
      revenueSub: "Encaissements − Dépenses payées",
      clients: "Clients",
      clientsSub: "Clients enregistrés",
      pending: "Factures en cours",
      pendingSub: "Non encaissées",
      paid: "Factures payées",
      paidSub: "Encaissées",
    },
  },

  invoices: {
    title: "Encaissements",
    new: "+ Nouvelle facture",
    createFirst: "Créer une facture",
    empty: "Aucune facture trouvée",
    notFound: "Facture introuvable.",
    backToList: "← Encaissements",
    deleteConfirm: (number: string) => `Supprimer la facture ${number} ?`,
    table: {
      number: "N°",
      client: "Client",
      date: "Date",
      dueDate: "Échéance",
    },
    form: {
      title: "Nouvelle facture",
      editTitle: "Modifier la facture",
      client: "Client *",
      clientPlaceholder: "Nom du client",
      date: "Date de facturation",
      dueDate: "Date d'échéance",
    },
    detail: {
      info: "Informations",
      client: "Client",
      number: "Numéro",
      date: "Date de facturation",
      dueDate: "Date d'échéance",
      amounts: "Montants",
      changeStatus: "Changer le statut :",
    },
  },

  expenses: {
    title: "Dépenses",
    new: "+ Nouvelle dépense",
    createFirst: "Créer une dépense",
    empty: "Aucune dépense trouvée",
    notFound: "Dépense introuvable.",
    backToList: "← Dépenses",
    deleteConfirm: (supplier: string) =>
      `Supprimer cette dépense (${supplier}) ?`,
    table: {
      supplier: "Fournisseur",
    },
    form: {
      title: "Nouvelle dépense",
      editTitle: "Modifier la dépense",
      supplier: "Fournisseur *",
      supplierPlaceholder: "Nom du fournisseur",
    },
    detail: {
      info: "Informations",
      supplier: "Fournisseur",
    },
  },

  settings: {
    title: "Paramètres",
    appearance: {
      label: "Apparence",
      light: "Clair",
      dark: "Sombre",
    },
    language: {
      label: "Langue",
      fr: "Français",
      en: "English",
    },
  },

  clients: {
    title: "Clients",
    new: "+ Nouveau client",
    createFirst: "Créer un client",
    empty: "Aucun client trouvé",
    notFound: "Client introuvable.",
    backToList: "← Clients",
    deleteConfirm: (name: string) => `Supprimer le client "${name}" ?`,
    searchPlaceholder: "Rechercher un client...",
    form: {
      title: "Nouveau client",
      editTitle: "Modifier le client",
      name: "Nom *",
      namePlaceholder: "Nom du client ou de l'entreprise",
      email: "Email",
      emailPlaceholder: "email@exemple.fr",
      phone: "Téléphone",
      phonePlaceholder: "06 00 00 00 00",
      siret: "SIRET",
      siretPlaceholder: "000 000 000 00000",
      address: "Adresse",
      addressPlaceholder: "Adresse complète",
    },
    detail: {
      info: "Informations",
      invoices: (n: number) => `Factures (${n})`,
      noInvoices: "Aucune facture pour ce client",
    },
  },
};

export type Translations = typeof fr;
