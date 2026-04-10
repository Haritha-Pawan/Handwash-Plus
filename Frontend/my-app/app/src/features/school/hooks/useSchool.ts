import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchoolsApi, deleteSchoolApi, updateSchoolApi } from "../api/school.api";
import type { School } from "../types/school.types";

export const useSchools = () => {
  return useQuery<School[], Error>({
    queryKey: ["schools"],
    queryFn: async () => {
      const response = await getSchoolsApi();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch schools");
      }

      return response.data;
    },
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSchoolApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<School> }) => updateSchoolApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
};