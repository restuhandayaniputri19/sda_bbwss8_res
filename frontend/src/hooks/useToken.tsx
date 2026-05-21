import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosWithConfig, { setAxiosConfig } from "../services/api";

interface Context {
  token: string;
  changeToken: (token?: string) => void;
}

interface Props {
  children: ReactNode;
}

const contextValue = {
  token: "",
  changeToken: () => {},
};

const TokenContext = createContext<Context>(contextValue);

export function TokenProvider({ children }: Readonly<Props>) {
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");

  // Daftarkan interceptor hanya SATU KALI saat aplikasi pertama kali jalan
  useEffect(() => {
    const interceptor = axiosWithConfig.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Jika 401, bersihkan token agar kembali ke login
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function untuk menghapus interceptor jika component unmount
    return () => axiosWithConfig.interceptors.response.eject(interceptor);
  }, []);

  const handleLogout = useCallback(() => {
    setToken("");
    localStorage.removeItem("token");
  }, []);

  const changeToken = useCallback((newToken?: string) => {
    const val = newToken ?? "";
    setToken(val);
    if (val) {
      localStorage.setItem("token", val);
    } else {
      localStorage.removeItem("token");
    }
  }, []);

  const tokenContextValue = useMemo(() => ({
    token,
    changeToken,
  }), [token, changeToken]);

  return (
    <TokenContext.Provider value={tokenContextValue}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);

  if (context === undefined) {
    throw new Error("ERROR, useToken must be used within TokenContext");
  }

  return context;
}
