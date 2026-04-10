import axiosClient from "../../../shared/lib/axios";

import type { GetSchoolsResponse, School } from "../types/school.types";

export const getSchoolsApi  = async (): Promise<GetSchoolsResponse> => {
  const response = await axiosClient.get<GetSchoolsResponse>("/schools");
  return response.data;
};

export const deleteSchoolApi = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const response = await axiosClient.delete<{ success: boolean; message?: string }>(`/schools/${id}`);
  return response.data;
};

export const updateSchoolApi = async (id: string, data: Partial<School>): Promise<{ success: boolean; message?: string; data: School }> => {
  const response = await axiosClient.put<{ success: boolean; message?: string; data: School }>(`/schools/${id}`, data);
  return response.data;
};