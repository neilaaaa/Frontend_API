import {api} from "/src/contexts/AuthContext.jsx";


export const getBrevets = async (id) => {
  const res = await api.get ("brevets/");
  return res.data.results ?? res.data;
// "si res.data.results existe → utilise res.data.results"
// "si res.data.results est null ou undefined → utilise res.data"
};


export const addBrevet =async (brevet) => {
  const res = await api.post("brevets/", brevet);
  return res.data;
  alert ("brevet ajouter !")
};


export const updateBrevet = async (id, brevet) => {
  const res = await api.patch(`brevets/${id}/`, brevet);
  return res.data;
};


export const deleteBrevet = async (id) => {
  await api.delete(`brevets/${id}/`);
};


export const getBrevetById = async (id) => {
  const res = await api.get (`brevets/${id}/`);
  return res.data;
};