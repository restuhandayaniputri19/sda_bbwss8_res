import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Footer from "../components/footer";
import Navbar from "../components/navbar";
import logo from "../assets/logo.png";

const LayoutUser = () => {
  const location = useLocation();
  const { pathname } = location;
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex flex-col w-full ${
        pathname === "/visiting-point" ? "overflow-hidden" : ""
      } ${scrolled ? "h-full" : "h-screen"}`}
    >
      {pathname !== "/login" && (
        <Navbar
          maxWidth="w-full"
          logoIcon={<img src={logo} className="w-12 shadow-sm rounded-sm" />}
          linksPosition="right"
          links={[
            {
              path: "/",
              label: "Beranda",
            },
            {
              path: "#",
              label: "Profil",
              submenu: [
                {
                  path: "/struktur-organisasi",
                  label: "Struktur Organisasi",
                },
                {
                  path: "/tugas-fungsi",
                  label: "Informasi Organisasi",
                },
                {
                  path: "/profil-pejabat",
                  label: "Informasi Pejabat",
                },
                {
                  path: "/profil",
                  label: "Visi Misi",
                },
                {
                  path: "/sejarah",
                  label: "Sejarah",
                },
                {
                  path: "/pola-rencana",
                  label: "Pola dan Rencana",
                },
                {
                  path: "/dipa",
                  label: "DIPA",
                },
                {
                  path: "/lokasi-kantor",
                  label: "Lokasi Kantor",
                },
              ],
            },
            {
              path: "#",
              label: "Publikasi",
              submenu: [
                {
                  path: "https://sinbad.sda.pu.go.id/simadu/main/login.php",
                  label: "Early Warning System (E-SIMADU)",
                },
                {
                  path: "https://www.windy.com/-2.989/104.757?clouds,-3.611,104.757,8",
                  label: "Prakiraan Cuaca (Windy)",
                },
                {
                  path: "/galeri",
                  label: "Galeri",
                },
                {
                  path: "/infografis",
                  label: "Infografis",
                },
                {
                  path: "/aplikasi",
                  label: "Aplikasi",
                },
                {
                  path: "/geoportal",
                  label: "Geoportal",
                },
                {
                  path: "/rpsda",
                  label: "RPSDA",
                },
                {
                  path: "/prediksi-cuaca",
                  label: "Prediksi Cuaca",
                },
              ],
            },

            {
              path: "#",
              label: "Informasi Publik",
              submenu: [
                // {
                //   path: "/tkpsda",
                //   label: "TKPSDA",
                // },
                {
                  path: "/majalah",
                  label: "Majalah"
                },
                {
                  path: "/berita",
                  label: "Berita",
                },
                {
                  path: "/informasi-berkala",
                  label: "Informasi Berkala",
                },
                {
                  path: "/informasi-serta-merta",
                  label: "Informasi Serta Merta",
                },
                {
                  path: "/informasi-tersedia",
                  label: "Informasi Tersedia",
                },
                {
                  path: "/peraturan",
                  label: "Peraturan",
                },
                {
                  path: "/informasi",
                  label: "Informasi",
                },
                {
                  path: "/kontak-kami",
                  label: "Kontak Kami",
                },
              ],
            },
          ]}
        />
      )}

      <div className="flex-grow">
        <Outlet />
      </div>
      {(pathname !== "/visiting-point" || pathname !== "/login") && <Footer />}
    </div>
  );
};

export default LayoutUser;
