import { api } from "/src/contexts/AuthContext.jsx";

const unwrap = (res) => res.data?.results ?? res.data;

export const getUsers = async () => {
  const res = await api.get("users/utilisateurs/");
  return unwrap(res);
};

export const createUser = async (payload) => {
  const res = await api.post("users/utilisateurs/", payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await api.patch(`users/utilisateurs/${id}/`, payload);
  return res.data;
};

export const deleteUser = async (id) => {
  await api.delete(`users/utilisateurs/${id}/`);
};
