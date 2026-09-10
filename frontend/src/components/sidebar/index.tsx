import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../button";
import SidebarItem from "./item";
import { SidebarItemType } from "./type";
import { toast } from "sonner";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useToken } from "../../hooks/useToken";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { API } from "../../services";

interface SidebarProps {
  header?: ReactNode;
  items: SidebarItemType[];
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  fontSize?: string;
  padding?: string;
  borderRadius?: string;
  shadow?: string;
}

const CollapsibleGroup: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}> = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-1 pl-2">{children}</div>}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  header,
  items,
  backgroundColor = "bg-white",
  textColor = "text-black",
  activeColor = "bg-gray-100 text-gray-900",
  hoverBgColor = "hover:bg-gray-100",
  hoverTextColor = "hover:text-gray-900",
  fontSize = "text-base",
  padding = "p-2",
  borderRadius = "rounded-lg",
  shadow = "shadow-sm",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { changeToken } = useToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Inisialisasi username sebagai React State
  const [username, setUsername] = useState<string>(
    () => localStorage.getItem("username") || "Memuat..."
  );

  // 2. Ambil sumber autentikasi (Provider A / B)
  const authSource = (localStorage.getItem("auth_source") || "B").toUpperCase();

  // Fetch data user dari backend
useEffect(() => {
  let isMounted = true;

  const authSource = (localStorage.getItem("auth_source") || "B").toUpperCase();
  const savedUsername = localStorage.getItem("username");

  // Jika Provider A (Legacy), tidak perlu panggil /api/auth/me
  if (authSource === "A") {
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      setUsername("User Legacy");
    }
    return;
  }

  // Jika Provider B (Hono/SQLite), panggil /api/auth/me lokal
  API.get("/api/auth/me")
    .then((res: any) => {
      const fetchedUsername =
        res?.user?.username ||
        res?.data?.user?.username ||
        res?.username;

      if (isMounted && fetchedUsername) {
        setUsername(fetchedUsername);
        localStorage.setItem("username", fetchedUsername);
      }
    })
    .catch((err: any) => {
      console.error("[Sidebar Profil Error]:", err);
      if (isMounted) {
        setUsername(savedUsername || "Admin");
      }
    });

  return () => {
    isMounted = false;
  };
}, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    localStorage.removeItem("username");
    changeToken();
    toast.success("Logout successfully");
    navigate("/login");
  };

  const linkStyle = `flex items-center gap-2 ${padding} ${borderRadius} text-sm font-medium ${textColor} ${hoverBgColor} ${hoverTextColor} transition-colors`;

  const navigation = (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-4 overflow-y-auto">
        {header && <div className="mb-2">{header}</div>}

        <nav className="flex flex-col gap-3">
          <CollapsibleGroup title="Jalan Pintas" defaultOpen={true}>
            <Link
              to="/admin"
              className={`${linkStyle} ${
                location.pathname === "/admin" ? activeColor : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/berita"
              className={`${linkStyle} ${
                location.pathname === "/admin/berita" ? activeColor : ""
              }`}
            >
              Berita
            </Link>
            <Link
              to="/admin/permintaan-data"
              className={`${linkStyle} ${
                location.pathname === "/admin/permintaan-data" ? activeColor : ""
              }`}
            >
              Permintaan Data
            </Link>
          </CollapsibleGroup>

          <CollapsibleGroup title="Manajemen Data" defaultOpen={true}>
            {items.map((item: SidebarItemType, index: number) => (
              <SidebarItem
                key={index}
                item={item}
                textColor={textColor}
                activeColor={activeColor}
                hoverBgColor={hoverBgColor}
                hoverTextColor={hoverTextColor}
                fontSize={fontSize}
                padding={padding}
                borderRadius={borderRadius}
              />
            ))}
          </CollapsibleGroup>

          <CollapsibleGroup title="Sistem" defaultOpen={true}>
            <Link
              to="/admin/users"
              className={`${linkStyle} ${
                location.pathname === "/admin/users" ? activeColor : ""
              }`}
            >
              Manajemen User
            </Link>
            <Link
              to="/admin/logs"
              className={`${linkStyle} ${
                location.pathname === "/admin/logs" ? activeColor : ""
              }`}
            >
              Admin Logs
            </Link>
          </CollapsibleGroup>
        </nav>
      </div>

      {/* Info Username & Logout */}
      <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-gray-50 border border-gray-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600 shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[10px] text-gray-400 font-medium">Logged in as</span>
              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-gray-200 text-gray-600">
                {authSource === "A" ? "Warisan (A)" : "Baru (B)"}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-800 truncate leading-tight mt-1">
              {username}
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`${backgroundColor} ${shadow} hidden min-h-screen w-1/5 flex-col gap-2 overflow-y-auto p-5 sm:flex border-r border-gray-200`}
      >
        {navigation}
      </aside>

      <button
        type="button"
        aria-label="Buka menu navigasi"
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed right-3 top-3 z-[60] rounded-md bg-white p-2 text-gray-700 shadow-md sm:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside
            className={`${backgroundColor} ${shadow} absolute inset-y-0 left-0 flex w-4/5 max-w-xs flex-col gap-2 overflow-y-auto p-5`}
          >
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="ml-auto rounded-md p-1 text-gray-700 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
            {navigation}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;