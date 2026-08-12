import { Button } from "../button";
import { ReactNode, useEffect, useState } from "react";
import SidebarItem from "./item";
import { SidebarItemType } from "./type";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useToken } from "../../hooks/useToken";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    changeToken();
    toast.success("Logout successfully");
    navigate("/login");
  };

  const navigation = (
    <>
      {header}
      <ul className={`space-y-2 font-medium ${textColor}`}>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
        <p>Informasi Publik</p>
        <Link to="/admin/berita" className="flex items-center mb-6 ml-6">
          Berita
        </Link>
        <Link to="/admin/peraturan" className="flex items-center mb-6 ml-6">
          Peraturan
        </Link>

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
      </ul>
    </>
  );

  return (
    <>
      <aside
        className={`${backgroundColor} ${shadow} hidden w-1/5 flex-col gap-2 overflow-y-auto p-5 sm:flex`}
      >
        {navigation}
      </aside>

      <button
        type="button"
        aria-label="Buka menu navigasi"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed right-3 top-3 z-[60] rounded-md bg-white p-2 text-gray-700 shadow-md sm:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside
            aria-label="Navigasi admin"
            className={`${backgroundColor} ${shadow} absolute inset-y-0 left-0 flex w-4/5 max-w-xs flex-col gap-2 overflow-y-auto p-5`}
          >
            <button
              type="button"
              aria-label="Tutup menu navigasi"
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
