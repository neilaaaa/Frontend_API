import { createContext, useContext, useState } from "react";

const Ctx = createContext();

const DEMO = [
  {
    id: 1,
    num_brevet: "DZ-2024-001",
    titre: "Système de filtration d'eau",
    num_depo: "DEP-001",
    date_depo: "2024-01-15",
    date_sortie: "2024-06-15",
    titulaire: "Entreprise Alpha",
    nom_inventeur: "Ahmed Benali",
    nom_deposant: "Ahmed Benali",
    status: "EN_ATTENTE",
    documents: [],
  },
];

export function RespBrevetsProvider({ children }) {
  const [brevets, setBrevets] = useState(DEMO);

  const addBrevet    = (b)    => setBrevets(p => [...p, { ...b, id: Date.now() }]);
  const updateBrevet = (id, b)=> setBrevets(p => p.map(x => x.id === Number(id) ? { ...x, ...b } : x));
  const deleteBrevet = (id)   => setBrevets(p => p.filter(x => x.id !== id));
  const getBrevetById= (id)   => brevets.find(x => x.id === Number(id));

  return (
    <Ctx.Provider value={{ brevets, addBrevet, updateBrevet, deleteBrevet, getBrevetById }}>
      {children}
    </Ctx.Provider>
  );
}

export const useRespBrevets = () => useContext(Ctx);