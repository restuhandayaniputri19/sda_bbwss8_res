import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import logo from "../assets/logo.png";

const LayoutAdmin = () => {
  const sidebar = [
    {
      path: "/admin",
      label: "Dashboard",
    },
    {
      path: "/admin/berita",
      label: "Berita",
    },
    {
      path: "/admin/majalah",
      label: "Majalah",
    },
    {
      path: "/admin/youtube",
      label: "Youtube",
    },
    {
      path: "/admin/banner",
      label: "Banner",
    },
    {
      path: "/admin/infografis",
      label: "Infografis",
    },
    {
      path: "/admin/gallery",
      label: "Gallery",
    },
    {
      path: "/admin/kesiapsiagaan-bencana",
      label: "Kesiapsiagaan Bencana",
    },
    {
      path: "/admin/permintaan-data",
      label: "Permintaan Data",
    },
    {
      path: "/admin/layanan-terpadu",
      label: "Layanan Terpadu",
    },
    {
      path: "/admin/struktur-organisasi",
      label: "Struktur Organisasi",
    },
    {
      path: "/admin/pola-rencana",
      label: "Pola dan Rencana",
    },
    {
      path: "/admin/tugas-fungsi",
      label: "Tugas dan Fungsi",
    },
    {
      path: "/admin/dipa",
      label: "Dipa",
    },
    {
      path: "/admin/peraturan",
      label: "Peraturan",
    },
    {
      path: "/admin/pengumuman",
      label: "Pengumuman",
    },
    {
      path: "/admin/informasi",
      label: "Informasi",
    },
    {
      path: "/admin/geoportal",
      label: "Geoportal",
    },
    {
      path: "/admin/rpsda",
      label: "RPSDA",
    },
    {
      path: "/admin/prediksi-cuaca",
      label: "Prediksi Cuaca",
    },
  ];
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <Sidebar shadow="shadow-md" items={sidebar} />
      <div className="flex flex-col w-full overflow-hidden">
        <Navbar
          logoIcon={<img src={logo} className="w-9" />}
          shadow="shadow-md"
        />
        <div className="overflow-y-auto h-full p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
