import {api} from "/src/contexts/AuthContext.jsx";


export const getRecours = async (id) => {
  const res = await api.get ("recours/");
  return res.data.results ?? res.data;
// "si res.data.results existe → utilise res.data.results"
// "si res.data.results est null ou undefined → utilise res.data"
};

export const addRecours =async (recours) => {
  const res = await api.post("recours/", recours);
  return res.data;
};


export const updateRecours = async (id, recours) => {
  const res = await api.patch(`recours/${id}/`, recours);
  return res.data;
};


export const deleteRecours = async (id) => {
  await api.delete(`recours/${id}/`);
};
