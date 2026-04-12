import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/authApi.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ start as loading
  const [error, setError] = useState(null);

  // Load user + token from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false); // ✅ finished loading
  }, []);

  // ------ LOGIN ------
  const login = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const { success, message, user: loggedInUser, token } = await authApi.login(formData);

      if (success) {
        setUser(loggedInUser);
        setToken(token);

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", token);
      }

      return { success, message, user: loggedInUser };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ------ LOGOUT ------
  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return { user, token, loading, error, login, logout, setUser, setToken };
}
