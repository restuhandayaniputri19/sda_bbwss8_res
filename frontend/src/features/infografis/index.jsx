import { useEffect, useState } from "react";

import DropdownSelect from "../../components/select";
import PhotoCard from "../../components/photo-card";
import { getInfoGrafis } from "../../services/infografis/api";
import bendungPerjaya from "../../assets/11.png";

const InfografisPage = () => {
  const [data, setData] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [infografisMonths, setInfografisMonths] = useState([]);

  // Daftar Kategori
  const categories = [
    "Semua",
    "Bendungan",
    "Irigasi & Rawa",
    "Sungai",
    "Danau",
    "Embung",
    "Air Tanah & Air Baku",
  ];

  // Kunci scroll body saat tampilan full screen aktif
  useEffect(() => {
    if (fullScreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [fullScreenImage]);

  // Extract unique months for infographics dropdown
  const getUniqueMonths = (infografis) => {
    const months = infografis.map((item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      }
      return "Unknown Date";
    });
    return Array.from(new Set(months));
  };

  useEffect(() => {
    const fetchInfografis = async () => {
      try {
        const response = await getInfoGrafis();

        if (response && Array.isArray(response.data)) {
          setData(response.data);
          setInfografisMonths(getUniqueMonths(response.data));
        } else {
          console.error("Expected an array but got:", response);
        }
      } catch (error) {
        console.error("Error fetching infografis data:", error);
      }
    };

    fetchInfografis();
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Filter infografis berdasarkan bulan DAN kategori
const filteredInfografis = data.filter((item) => {
  const itemDate = new Date(item.createdAt);
  const monthYear = itemDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const matchMonth = selectedMonth === "all" || monthYear === selectedMonth;

  // Pembandingan kategori case-insensitive
  const matchCategory =
    selectedCategory === "Semua" ||
    item.category?.toLowerCase() === selectedCategory.toLowerCase();

  return matchMonth && matchCategory;
});

  const handleImageClick = (src) => {
    setFullScreenImage(src);
  };

  const handleFullScreenClose = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-full md:h-[60vh] object-cover"
        src={bendungPerjaya}
        alt="Call center picture"
      />
      <section className="p-10">
        <h1 className="text-2xl font-bold text-indigo mb-6">Infografis</h1>

        {/* Tombol Kategori */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-bold text-gray-700">Kategori :</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-mango text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-mango hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Month Dropdown */}
        <DropdownSelect
          className="w-[200px] p-2 border rounded-md mb-5"
          data={[
            { value: "all", label: "Semua Bulan" },
            ...infografisMonths.map((month) => ({
              value: month,
              label: month,
            })),
          ]}
          defaultValue="all"
          name="monthSelect"
          placeholder="Select a month"
          emptyState="No months available"
          onChange={handleMonthChange}
        />

        {/* Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInfografis.length > 0 ? (
            filteredInfografis.map((item, index) => (
              <PhotoCard
                key={index}
                src={item.url}
                onImageClick={handleImageClick}
                description={item.description}
                category={item.category}
                date={
                  item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : item.date
                }
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500">
              Tidak ada infografis tersedia untuk bulan dan kategori yang dipilih.
            </p>
          )}
        </div>

        {/* Fullscreen Image Overlay */}
        {fullScreenImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={handleFullScreenClose}
          >
            <img
              src={fullScreenImage}
              className="max-w-full max-h-full object-contain rounded-sm"
              alt="Full Screen"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default InfografisPage;