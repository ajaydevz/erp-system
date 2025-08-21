import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const res = await api.post("/login/", { username, password });
      const access = res.data.access;
      const refresh = res.data.refresh;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Get user profile first
      const profileRes = await api.get("/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const loggedUser = profileRes.data;
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // If Admin or Manager, fetch all users and store in context
      if (loggedUser.role === "Admin" || loggedUser.role === "Manager") {
        const usersRes = await api.get("/users/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        // Optionally store all users in localStorage or another state if needed
        localStorage.setItem("allUsers", JSON.stringify(usersRes.data));
      }

    } catch (err) {
      console.error("Login failed:", err);
      logout();
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("allUsers");

    setUser(null);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
