import {api} from "/src/contexts/AuthContext.jsx";


export const getBrevets = async (id) => {
  const res = await api.get ("brevets/");
  return res.data.results ?? res.data;
// "si res.data.results existe → utilise res.data.results"
// "si res.data.results est null ou undefined → utilise res.data"
};

export const getTousBrevets = async (id) => {
  let results = []
  let url = "brevets/"

   while (url) {
    const res = await api.get(url)
    results = [...results, ...(res.data.results ?? [])]
    // extraire juste le chemin de next
    url = res.data.next ? res.data.next.replace("http://127.0.0.1:8000/", "") : null
  }
  return results
};

export const addBrevet =async (brevet) => {
  const res = await api.post("brevets/", brevet);
  return res.data;
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
