import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense } from "@/types";
import { api } from "@/lib/api";

export const expensesKeys = {
  all: ["expenses"] as const,
};

export function useExpenses() {
  return useQuery({
    queryKey: expensesKeys.all,
    queryFn: () => api.get("expenses").json<Expense[]>(),
  });
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Expense, "id">) =>
      api.post("expenses", { json: data }).json<Expense>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKeys.all }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Expense> }) =>
      api.patch(`expenses/${id}`, { json: data }).json<Expense>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKeys.all }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`expenses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKeys.all }),
  });
}
