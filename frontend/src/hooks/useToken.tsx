import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosWithConfig from "../services/api";

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
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "");

  const handleLogout = useCallback(() => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_source");
  }, []);

  const changeToken = useCallback((newToken?: string) => {
    const val = newToken ?? "";
    setToken(val);
    if (val) {
      localStorage.setItem("token", val);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_source");
    }
  }, []);

  // 1. Request Interceptor: SELALU SISIPKAN TOKEN DARI LOCALSTORAGE
  useEffect(() => {
    const reqInterceptor = axiosWithConfig.interceptors.request.use(
      (config) => {
        const activeToken = localStorage.getItem("token");
        if (activeToken) {
          config.headers.Authorization = `Bearer ${activeToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: TANGSUD 401 HANYA JIKA BUKAN DARI PROSES LOGIN
    const resInterceptor = axiosWithConfig.interceptors.response.use(
      (response) => response,
      (error) => {
        const isAuthEndpoint = error.config?.url?.includes("/api/auth/login");
        
        // Jangan jalankan handleLogout jika yang 401 adalah request login itu sendiri
        if (error.response?.status === 401 && !isAuthEndpoint) {
          console.warn("[AUTH] Token tidak valid / 401 received. Clearing session...");
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosWithConfig.interceptors.request.eject(reqInterceptor);
      axiosWithConfig.interceptors.response.eject(resInterceptor);
    };
  }, [handleLogout]);

  const tokenContextValue = useMemo(
    () => ({
      token,
      changeToken,
    }),
    [token, changeToken]
  );

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