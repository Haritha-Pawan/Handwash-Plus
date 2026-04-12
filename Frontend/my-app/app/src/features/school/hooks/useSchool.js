import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchoolsApi, deleteSchoolApi, updateSchoolApi } from "../api/school.api";

export const useSchools = () => {
  return useQuery({
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
    mutationFn: (id) => deleteSchoolApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSchoolApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
};
