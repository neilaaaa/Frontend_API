import {api} from "/src/contexts/AuthContext.jsx";


export const getDocuments = async (id) => {
  const res = await api.get ("documents/");
  return res.data.results ?? res.data;
// "si res.data.results existe → utilise res.data.results"
// "si res.data.results est null ou undefined → utilise res.data"
};

export const getTousDocuments = async (id) => {
  let results = []
  let url = "documents/"

   while (url) {
    const res = await api.get(url)
    results = [...results, ...(res.data.results ?? [])]
    // extraire juste le chemin de next
    url = res.data.next ? res.data.next.replace("http://127.0.0.1:8000/", "") : null
  }
  return results
};


export const addDocument = async (data) => {
  const isFormData = data instanceof FormData;
  const res = await api.post("documents/", data,{
    headers: isFormData ? 
    {"Content-Type": "multipart/form-data"} 
    : {"Content-Type": "application/json"}
  });
  return res.data;
};


export const updateDocument = async (id, data) => {
  const isFormData = data instanceof FormData;
  const res = await api.patch(`documents/${id}/`, data, {
    headers: isFormData ?
    {"Content-Type": "multipart/form-data"}
    : {"Content-Type": "application/json"}
   },);
  return res.data;
};


export const deleteDocument = async (id) => {
  await api.delete(`documents/${id}/`);
};


export const getDocumentById = async (id) => {
  const res = await api.get (`documents/${id}/`);
  return res.data;
};

export const getDocumentsByBrevet = async (brevetId) => {
  const res = await api.get(`documents/?brevet=${brevetId}`);
  return res.data.results ?? res.data;
};

export const downloadDocument = async (id) => {
  const res = await api.get(`documents/${id}/download/`, {
    responseType: "blob",
  });
  return res;
};

function buildFormData(doc) {
  const formData = new FormData();
  Object.entries(doc).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });
  return formData;
}
