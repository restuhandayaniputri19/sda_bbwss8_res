import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useToken } from "../hooks/useToken";

const ProtectedRoutes = () => {
  const { pathname } = useLocation();
  const { token } = useToken();

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname.startsWith("/admin");

  // Jika sudah login tapi mencoba akses /login atau /register
  if (isAuthRoute && token) {
    return <Navigate to="/admin" replace />;
  }

  // Jika belum login tapi mencoba akses /admin atau sub-halamannya (/admin/...)
  if (isAdminRoute && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;