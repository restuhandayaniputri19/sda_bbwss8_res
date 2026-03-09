import Application from "../features/application";
import BannerAdmin from "../features/admin/banner";
import BeritaAdmin from "../features/admin/berita";
import BeritaTerkini from "../features/berita";
import Contact from "../features/contact";
import DashboardPage from "../features/admin/dashboard";
import DipaAdmin from "../features/admin/dipa";
import DipaPage from "../features/dipa";
import GaleriPage from "../features/galeri";
import GalleryAdmin from "../features/admin/gallery";
import HomePage from "../features/home";
import InfografisAdmin from "../features/admin/infografis";
import InfografisPage from "../features/infografis";
import InformasiAdmin from "../features/admin/informasi";
import InformasiPage from "../features/informasi";
import LayananTerpaduAdmin from "../features/admin/layanan-terpadu";
import Layout from "../layout";
import LayoutAdmin from "../layout/layout-admin";
import LoginPage from "../features/login";
import LokasiKantor from "../features/profil/LokasiKantor";
import MajalahAdmin from "../features/admin/majalah";
import PengumumanAdmin from "../features/admin/pengumuman";
import PeraturanAdmin from "../features/admin/peraturan";
import PeraturanPage from "../features/peraturan";
import PetaGeospasialAdmin from "../features/admin/peta-geospasial";
import PolaRencana from "../features/profil/PolaRencana";
import PolaRencanaAdmin from "../features/admin/pola-rencana";
import Product from "../features/product";
import Profil from "../features/profil";
import ProtectedRoutes from "./protectedRoutes";
import Publication from "../features/publication";
import Sejarah from "../features/profil/Sejarah";
import StrukturOrganisasi from "../features/profil/StrukturOrganisasi";
import ProfilePejabat from "../features/profil/pejabat";
import StrukturOrganisasiAdmin from "../features/admin/struktur-organisasi";
import Tkpsda from "../features/tkpsda";
import TugasFungsi from "../features/profil/TugasFungsi";
import TugasFungsiAdmin from "../features/admin/tugas-fungsi";
import YoutubeAdmin from "../features/admin/youtube";
import { createBrowserRouter } from "react-router-dom";
import GeospasialPage from "../features/geospasial";
import RpsdaAdmin from "../features/admin/rpsda";
import PrediksiCuacaAdmin from "../features/admin/prediksi-cuaca";
import RpsdaPage from "../features/rpsda";
import PrediksiCuacaPage from "../features/prediksi-cuaca";
import InformasiBerkalaPage from "../features/informasi-berkala";
import MajalahUser from "../features/majalah";
import KontakLokasi from "../features/profil/KontakLokasi";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/aplikasi",
        element: <Application />,
      },
      {
        path: "/kontak-kami",
        element: <Contact />,
      },
      {
        path: "/publikasi",
        element: <Publication />,
      },
      {
        path: "/tkpsda",
        element: <Tkpsda />,
      },
      {
        path: "/profil",
        element: <Profil />,
      },
      {
        path: "/produk",
        element: <Product />,
      },
      {
        path: "/galeri",
        element: <GaleriPage />,
      },
      {
        path: "/infografis",
        element: <InfografisPage />,
      },
      {
        path: "/berita",
        element: <BeritaTerkini />,
      },
      {
        path: "/tugas-fungsi",
        element: <TugasFungsi />,
      },
      {
        path: "/struktur-organisasi",
        element: <StrukturOrganisasi />,
      },
      {
        path: "/sejarah",
        element: <Sejarah />
      },
      {
        path: "/profil-pejabat",
        element: <ProfilePejabat />,
      },
      {
        path: "/lokasi-kantor",
        element: <LokasiKantor />,
      },
      {
        path: "/kontak-lokasi",
        element: <KontakLokasi />,
      },
      {
        path: "/pola-rencana",
        element: <PolaRencana />,
      },
      {
        path: "/dipa",
        element: <DipaPage />,
      },
      {
        path: "/peraturan",
        element: <PeraturanPage />,
      },
      {
        path: "/informasi",
        element: <InformasiPage />,
      },
      {
        path: "/geoportal",
        element: <GeospasialPage />,
      },
      {
        path: "/rpsda",
        element: <RpsdaPage />,
      },
      {
        path: "/prediksi-cuaca",
        element: <PrediksiCuacaPage />,
      },
      {
        path: "/informasi-berkala",
        element: <InformasiBerkalaPage />,
      },
      {
        path: "/majalah",
        element: <MajalahUser />, // Pakai komponen yang baru kita buat
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/admin",
        element: <LayoutAdmin />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "berita",
            element: <BeritaAdmin />,
          },
          {
            path: "majalah",
            element: <MajalahAdmin />,
          },
          {
            path: "youtube",
            element: <YoutubeAdmin />,
          },
          {
            path: "banner",
            element: <BannerAdmin />,
          },
          {
            path: "infografis",
            element: <InfografisAdmin />,
          },
          {
            path: "gallery",
            element: <GalleryAdmin />,
          },
          {
            path: "layanan-terpadu",
            element: <LayananTerpaduAdmin />,
          },
          {
            path: "struktur-organisasi",
            element: <StrukturOrganisasiAdmin />,
          },
          {
            path: "pola-rencana",
            element: <PolaRencanaAdmin />,
          },
          {
            path: "tugas-fungsi",
            element: <TugasFungsiAdmin />,
          },
          {
            path: "dipa",
            element: <DipaAdmin />,
          },
          {
            path: "peraturan",
            element: <PeraturanAdmin />,
          },
          {
            path: "pengumuman",
            element: <PengumumanAdmin />,
          },
          {
            path: "informasi",
            element: <InformasiAdmin />,
          },
          {
            path: "geoportal",
            element: <PetaGeospasialAdmin />,
          },
          {
            path: "rpsda",
            element: <RpsdaAdmin />,
          },
          {
            path: "prediksi-cuaca",
            element: <PrediksiCuacaAdmin />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
],
{
  basename: "/balai/bbwssumatera8",
});
