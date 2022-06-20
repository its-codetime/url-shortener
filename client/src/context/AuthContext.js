import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axiosClient, { apiPaths } from "../axiosClient.js";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    // user sign out
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const authorize = useCallback(async () => {
    // authorize and set user if token is in local storage
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axiosClient.get(apiPaths.authorize, { headers });
      setUser(data.user);
    } catch (error) {
      console.log(error?.response ? error.response.data.error : error.message);
      logout();
      return;
    }
  }, [logout]);

  useEffect(() => {
    // authorize on load(check for token in local storage and authorize)
    authorize();
  }, [authorize]);

  const login = useCallback(async (userData) => {
    try {
      const { data } = await axiosClient.post(apiPaths.login, userData);
      setUser(data.user);
      localStorage.setItem("token", data.user.token);
    } catch (error) {
      throw new Error(
        error?.response ? error.response.data.error : error.message
      );
    }
  }, []);

  const updatePassword = useCallback(async (password, token) => {
    try {
      const body = {
        password,
        token,
      };
      const { data } = await axiosClient.patch(
        apiPaths.passwordResetUpdate,
        body
      );
      return data.passwordUpdate;
    } catch (error) {
      // set axios error
      throw new Error(
        error?.response ? error.response.data.error : error.message
      );
    }
  }, []);

  const verifyPasswordReset = useCallback(async (token) => {
    try {
      const { data } = await axiosClient.post(apiPaths.passwordResetVerify, {
        token: token,
      });
      return data.linkValid;
    } catch (error) {
      // set axios error
      throw new Error(
        error?.response ? error.response.data.error : error.message
      );
    }
  }, []);

  const createPasswordReset = useCallback(async (email) => {
    try {
      const { data } = await axiosClient.post(apiPaths.passwordResetCreate, {
        email,
      });
      return data.emailSent;
    } catch (error) {
      throw new Error(
        error?.response ? error.response.data.error : error.message
      );
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const { data } = await axiosClient.post(apiPaths.register, userData);
      setUser(data.user);
      localStorage.setItem("token", data.user.token);
    } catch (error) {
      throw new Error(
        error?.response ? error.response.data.error : error.message
      );
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        createPasswordReset,
        verifyPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
