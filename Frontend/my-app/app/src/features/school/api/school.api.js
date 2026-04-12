import axiosClient from "../../../shared/lib/axios";

export const getSchoolsApi  = async () => {
  const response = await axiosClient.get("/schools");
  return response.data;
};

export const deleteSchoolApi = async (id) => {
  const response = await axiosClient.delete(`/schools/${id}`);
  return response.data;
};

export const updateSchoolApi = async (id, data) => {
  const response = await axiosClient.put(`/schools/${id}`, data);
  return response.data;
};
