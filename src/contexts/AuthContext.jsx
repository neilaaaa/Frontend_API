import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/"
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
  const [user, setUser] = useState(null)  
  const [error, setError] = useState("")

  // garde la session après refresh
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    setError("")
    try {
      const res = await api.post("users/login/", { username: email, password })
      localStorage.setItem("token", res.data.token)
      console.log("token ok: ", res.data.token)

      const me = await api.get("users/me/")
      console.log("me.data:", me.data)        
      console.log("groups:", me.data.groups)

      const djangoGroup = me.data.groups[0]
      console.log("djangoGroup:", djangoGroup)

      const role = GROUP_TO_ROLE[djangoGroup]       
       console.log("role:", role)

      // 3. construit l'objet user
      const userData = { email, role, id: me.data.id }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // 4. redirige selon le role
      navigate(ROLE_HOME[role] || "/")

    } catch (err) {
      console.log(err)
      setError("Identifiants incorrects.")
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