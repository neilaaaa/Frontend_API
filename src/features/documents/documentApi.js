import {api} from "/src/contexts/AuthContext.jsx";


export const getDocuments = async (id) => {
  const res = await api.get ("documents/");
  return res.data.results ?? res.data;
// "si res.data.results existe → utilise res.data.results"
// "si res.data.results est null ou undefined → utilise res.data"
};


export const addDocument =async (document) => {
  const res = await api.post("documents/", document);
  return res.data;
  alert ("brevet ajouter !")
};


export const updateDocument = async (id, document) => {
  const res = await api.patch(`documents/${id}/`, document);
  return res.data;
};


export const deleteDocument = async (id) => {
  await api.delete(`documents/${id}/`);
};


export const getDocumentById = async (id) => {
  const res = await api.get (`documents/${id}/`);
  return res.data;
};