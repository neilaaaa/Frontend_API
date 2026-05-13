import {api} from "/src/contexts/AuthContext.jsx";


export const getDemandeBrevets = async (id) => {
  let results = []
  let url = "demandes/"
  
  while (url) {
    const res = await api.get(url)
    results = [...results, ...(res.data.results ?? [])]
    url = res.data.next ? res.data.next.replace("http://127.0.0.1:8000/", "") : null
  }
  
  return results
}


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