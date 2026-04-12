import axiosClient from "../../../shared/lib/axios";

export const loginApi = async (data) => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};
