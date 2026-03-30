import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Invoice } from "@/types";
import { api } from "@/lib/api";

export const invoicesKeys = {
  all: ["invoices"] as const,
};

export function useInvoices() {
  return useQuery({
    queryKey: invoicesKeys.all,
    queryFn: () => api.get("invoices").json<Invoice[]>(),
  });
}

export function useAddInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Invoice, "id">) =>
      api.post("invoices", { json: data }).json<Invoice>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: invoicesKeys.all }),
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Invoice> }) =>
      api.patch(`invoices/${id}`, { json: data }).json<Invoice>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: invoicesKeys.all }),
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`invoices/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: invoicesKeys.all }),
  });
}
