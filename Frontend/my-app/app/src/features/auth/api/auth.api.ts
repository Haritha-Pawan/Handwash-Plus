import axiosClient from "../../../shared/lib/axios";
import type { LoginResponse } from "../types/auth.types";

export const loginApi = async (data: Record<string, string>): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};
