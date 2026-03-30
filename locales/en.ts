import type { Translations } from "./fr";

export const en: Translations = {
  nav: {
    dashboard: "Home",
    invoices: "Invoices",
    expenses: "Expenses",
    clients: "Clients",
    settings: "Settings",
  },

  common: {
    search: "Search...",
    allStatuses: "All statuses",
    cancel: "Cancel",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    back: "← Back",
    notes: "Notes",
    notesPlaceholder: "Additional information...",
    seeAll: "See all →",
    date: "Date",
    status: "Status",
    amounts: {
      subtotal: "Amount excl. tax (€) *",
      vatRate: "VAT (%)",
      vat: "VAT (€)",
      total: "Total incl. tax (€)",
      subtotalCol: "Excl. tax",
      totalCol: "Incl. tax",
    },
  },

  status: {
    invoice: {
      to_send: "To send",
      pending: "Pending",
      paid: "Paid",
      overdue: "Overdue",
    },
    expense: {
      to_review: "To review",
      to_pay: "To pay",
      paid: "Paid",
    },
  },

  dashboard: {
    title: "Home",
    recentInvoices: "Recent invoices",
    empty: "No invoices yet",
    stats: {
      revenue: "Net revenue",
      revenueSub: "Invoices − Paid expenses",
      clients: "Clients",
      clientsSub: "Registered clients",
      pending: "Pending invoices",
      pendingSub: "Unpaid",
      paid: "Paid invoices",
      paidSub: "Collected",
    },
  },

  invoices: {
    title: "Invoices",
    new: "+ New invoice",
    createFirst: "Create an invoice",
    empty: "No invoices found",
    notFound: "Invoice not found.",
    backToList: "← Invoices",
    deleteConfirm: (number: string) => `Delete invoice ${number}?`,
    table: {
      number: "No.",
      client: "Client",
      date: "Date",
      dueDate: "Due date",
    },
    form: {
      title: "New invoice",
      editTitle: "Edit invoice",
      client: "Client *",
      clientPlaceholder: "Client name",
      date: "Invoice date",
      dueDate: "Due date",
    },
    detail: {
      info: "Information",
      client: "Client",
      number: "Number",
      date: "Invoice date",
      dueDate: "Due date",
      amounts: "Amounts",
      changeStatus: "Change status:",
    },
  },

  expenses: {
    title: "Expenses",
    new: "+ New expense",
    createFirst: "Create an expense",
    empty: "No expenses found",
    notFound: "Expense not found.",
    backToList: "← Expenses",
    deleteConfirm: (supplier: string) => `Delete this expense (${supplier})?`,
    table: {
      supplier: "Supplier",
    },
    form: {
      title: "New expense",
      editTitle: "Edit expense",
      supplier: "Supplier *",
      supplierPlaceholder: "Supplier name",
    },
    detail: {
      info: "Information",
      supplier: "Supplier",
    },
  },

  settings: {
    title: "Settings",
    appearance: {
      label: "Appearance",
      light: "Light",
      dark: "Dark",
    },
    language: {
      label: "Language",
      fr: "Français",
      en: "English",
    },
  },

  clients: {
    title: "Clients",
    new: "+ New client",
    createFirst: "Create a client",
    empty: "No clients found",
    notFound: "Client not found.",
    backToList: "← Clients",
    deleteConfirm: (name: string) => `Delete client "${name}"?`,
    searchPlaceholder: "Search a client...",
    form: {
      title: "New client",
      editTitle: "Edit client",
      name: "Name *",
      namePlaceholder: "Client or company name",
      email: "Email",
      emailPlaceholder: "email@example.com",
      phone: "Phone",
      phonePlaceholder: "+1 000 000 0000",
      siret: "Tax ID",
      siretPlaceholder: "000 000 000",
      address: "Address",
      addressPlaceholder: "Full address",
    },
    detail: {
      info: "Information",
      invoices: (n: number) => `Invoices (${n})`,
      noInvoices: "No invoices for this client",
    },
  },
};
