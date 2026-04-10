import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const USERS = [
  { email: "admin@sonatra.dz", password: "1234", role: "admin" },
  { email: "agent@sonatra.dz", password: "1234", role: "agent" },
  { email: "resp@sonatra.dz", password: "1234", role: "responsable" },
  { email: "directeur@sonatra.dz", password: "1234", role: "directeur" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // garder login après refresh
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email, password) => {
    const found = USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return { success: true };
    }

    return { success: false, message: "Email ou mot de passe incorrect" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}