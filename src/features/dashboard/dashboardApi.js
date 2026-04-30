import { api } from "/src/contexts/AuthContext.jsx";

const unwrap = (res) => res.data?.results ?? res.data;

export const getDashboardCounts = async () => {
  const res = await api.get("counts/");
  return res.data;
};

export const getDashboardUsers = async () => {
  const res = await api.get("users/utilisateurs/");
  return unwrap(res);
};

export const getDashboardBrevets = async () => {
  const res = await api.get("brevets/");
  return unwrap(res);
};

export const getDashboardDemandes = async () => {
  const res = await api.get("demandes/");
  return unwrap(res);
};

export const getDashboardDocuments = async () => {
  const res = await api.get("documents/");
  return unwrap(res);
};

export const getDashboardRecours = async () => {
  const res = await api.get("recours/");
  return unwrap(res);
};

export const getDashboardPaiements = async () => {
  const res = await api.get("paiements/");
  return unwrap(res);
};
