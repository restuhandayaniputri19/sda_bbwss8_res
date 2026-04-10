import "./styles/index.css";

import { RouterProvider } from "react-router-dom";
import { StrictMode, useState, useEffect } from "react";
import { Toaster } from "./components/toast";
import { TokenProvider } from "./hooks/useToken";
import { createRoot } from "react-dom/client";
import { router } from "./routes";
import LoadingScreen from "./components/loading-screen";

const App = () => {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) return <LoadingScreen />;

  return (
    <TokenProvider>
      <RouterProvider router={router} />
      <Toaster richColors closeButton />
    </TokenProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);