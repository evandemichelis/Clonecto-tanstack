import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types";
import { api } from "@/lib/api";

export const clientsKeys = {
  all: ["clients"] as const,
};

export function useClients() {
  return useQuery({
    queryKey: clientsKeys.all,
    queryFn: () => api.get("clients").json<Client[]>(),
  });
}

export function useAddClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Client, "id">) =>
      api.post("clients", { json: data }).json<Client>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientsKeys.all }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      api.patch(`clients/${id}`, { json: data }).json<Client>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientsKeys.all }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`clients/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientsKeys.all }),
  });
}
