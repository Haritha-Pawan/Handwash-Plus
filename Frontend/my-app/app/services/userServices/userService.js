import API from "../../api/api";

export const getProfileById = async (userId) => {
  const res = await API.get(`/users/${userId}`);
  return res.data;
};

export const updateProfileById = async (userId, payload) => {
  const res = await API.put(`/users/${userId}`, payload);
  return res.data?.updatedUser || res.data?.user || res.data;
};
