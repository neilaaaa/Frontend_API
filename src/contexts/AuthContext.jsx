import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/";

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// mapping groupe Django → role frontend
const GROUP_TO_ROLE = {
  "agent":        "agent",
  "responsable":  "responsable",
  "directeur":    "directeur",
}

const ROLE_HOME = {
  admin:        "/admin",
  agent:        "/agent",
  responsable:  "/responsable",
  directeur:    "/directeur",
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  })  
  const [error, setError] = useState("")

  // garde la session après refresh
  const login = async (email, password) => {
    setError("")
    try {
      const res = await api.post("users/login/", { username: email, password })
      localStorage.setItem("token", res.data.token)

      const me = await api.get("users/me/")

      const djangoGroup = me.data.groups[0]?.toLowerCase()

      const role = me.data.is_superuser || me.data.is_staff
        ? "admin"
        : GROUP_TO_ROLE[djangoGroup]

      if (!role) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setError("Aucun role valide n'est attribue a ce compte.")
        return
      }

      // 3. construit l'objet user
      const userData = { email, role, id: me.data.id }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // 4. redirige selon le role
      navigate(ROLE_HOME[role] || "/")

    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Identifiants incorrects."
      setError(message)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
