import "./styles/index.css";

import { RouterProvider } from "react-router-dom";
import { StrictMode, useState, useEffect } from "react";
import { Toaster } from "./components/toast";
import { TokenProvider } from "./hooks/useToken";
import { createRoot } from "react-dom/client";
import { router } from "./routes";
import LoadingScreen from "./components/loading-screen";

const bgStyle = {
  minHeight: "100vh",
  position: "relative",
  backgroundColor: "#fffef9",
  backgroundImage: "radial-gradient(circle, #F5A62322 1px, transparent 1px), radial-gradient(circle, #003D7A11 1px, transparent 1px)",
  backgroundSize: "40px 40px, 20px 20px",
  backgroundPosition: "0 0, 10px 10px",
};

const App = () => {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) return <LoadingScreen />;

  return (
    <TokenProvider>
      <div style={bgStyle}>
        <RouterProvider router={router} />
      </div>
      <Toaster richColors closeButton />
    </TokenProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);