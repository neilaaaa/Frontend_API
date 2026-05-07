import {api} from "/src/contexts/AuthContext.jsx";


export const getDemandeBrevets = async (id) => {
  const res = await api.get ("demandes/");
  return res.data.results ?? res.data;
};


export const addDemandeBrevet =async (demande) => {
  const res = await api.post("demandes/", demande);
  return res.data;
  alert ("Demande de brevet ajoutée !")
};


export const updateDemandeBrevet = async (id, demande) => {
  const res = await api.patch(`demandes/${id}/`, demande);
  return res.data;
};


export const deleteDemandeBrevet = async (id) => {
  await api.delete(`demandes/${id}/`);
};


export const getDemandeBrevetById = async (id) => {
  const res = await api.get (`demandes/${id}/`);
  return res.data;
};

export const validerDemandeBrevet = async (id) => {
  const res = await api.post(`demandes/${id}/valider_demande/`);
  return res.data;
};

export const refuserDemandeBrevet = async (id) => {
  const res = await api.post(`demandes/${id}/refuser_demande/`);
  return res.data;
};