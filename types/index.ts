export type InvoiceStatus = 'to_send' | 'pending' | 'paid' | 'overdue';
export type ExpenseStatus = 'to_review' | 'to_pay' | 'paid';

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  date: string;
  dueDate: string;
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
}

export interface Expense {
  id: string;
  supplier: string;
  date: string;
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
  status: ExpenseStatus;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  siret?: string;
}
