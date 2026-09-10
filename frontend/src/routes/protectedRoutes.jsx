import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  // Ambil token langsung untuk memastikan keabsahannya
  const token = localStorage.getItem("token");

  // Jika tidak ada token di storage, langsung arahkan ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;