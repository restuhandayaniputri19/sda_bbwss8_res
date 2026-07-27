import { useEffect, useState } from "react";
import DropdownSelect from "../../components/select";
import KesiapsiagaanPdfViewer from "./KesiapsiagaanPdfViewer";
import PdfPagePreview from "./PdfPagePreview";
import bendungPerjaya from "../../assets/11.png";
import { getKesiapsiagaanBencana } from "../../services/kesiapsiagaan_bencana";

const KesiapsiagaanBencanaPage = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Viewer
  const [activeModalPdf, setActiveModalPdf] = useState(null);

  // Ekstrak bulan-tahun unik dari releaseDate
  const getUniqueMonths = (items) => {
    const months = items
      .filter((item) => item.releaseDate)
      .map((item) => {
        const date = new Date(item.releaseDate);
        return date.toLocaleString("id-ID", { month: "long", year: "numeric" });
      });
    return Array.from(new Set(months));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getKesiapsiagaanBencana();
        const items = response?.data || response || [];

        if (Array.isArray(items) && items.length > 0) {
          const sorted = [...items].sort((a, b) => {
            const dateA = new Date(a.releaseDate || 0);
            const dateB = new Date(b.releaseDate || 0);
            return dateB.getTime() - dateA.getTime();
          });

          setData(sorted);

          const months = getUniqueMonths(sorted);
          setAvailableMonths(months);

          // Default Filter: Bulan berjalan atau bulan data paling baru
          const now = new Date();
          const currentMonthYear = now.toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
          });

          if (months.includes(currentMonthYear)) {
            setSelectedMonth(currentMonthYear);
          } else if (months.length > 0) {
            setSelectedMonth(months[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching kesiapsiagaan data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filteredData = selectedMonth
    ? data.filter((item) => {
        if (!item.releaseDate) return false;
        const itemDate = new Date(item.releaseDate);
        const monthYear = itemDate.toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        });
        return monthYear === selectedMonth;
      })
    : data;

  const handleDownload = (e, url, title) => {
    e.stopPropagation(); // Mencegah modal terbuka saat tombol download diklik
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "Dokumen-Kesiapsiagaan"}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <img
        className="w-full h-[50vh] md:h-[60vh] object-cover"
        src={bendungPerjaya}
        alt="Kesiapsiagaan Bencana"
      />

      <section className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo mb-6">
          Kesiapsiagaan Bencana
        </h1>

        {/* Month Dropdown Filter */}
        <DropdownSelect
          className="w-[220px] p-2 border rounded-md mb-8 bg-white"
          data={availableMonths.map((month) => ({
            value: month,
            label: month,
          }))}
          defaultValue={selectedMonth}
          value={selectedMonth}
          name="monthSelect"
          placeholder="Pilih Bulan"
          emptyState="Tidak ada dokumen tersedia"
          onChange={handleMonthChange}
        />

        {loading ? (
          <div className="flex justify-center p-12">
            <p className="text-gray-500">Memuat data dokumen...</p>
          </div>
        ) : filteredData.length > 0 ? (
          /* Grid 2 Kolom pada layar md ke atas */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalPdf(item)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between cursor-pointer overflow-hidden group"
              >
                {/* Preview Halaman Utama PDF */}
                <PdfPagePreview
                  pdfUrl={item.url}
                  title={item.description || "Dokumen Kesiapsiagaan"}
                />

                {/* Konten & Aksi */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {item.description || "Dokumen Kesiapsiagaan Bencana"}
                    </h2>
                    {item.releaseDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.releaseDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-indigo font-medium">
                      Klik untuk Pratinjau
                    </span>
                    
                    <button
                      type="button"
                      onClick={(e) =>
                        handleDownload(
                          e,
                          item.url,
                          item.description || "Dokumen-Kesiapsiagaan"
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                    >
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center border rounded-lg bg-white text-gray-500">
            Tidak ada dokumen kesiapsiagaan bencana pada periode ini.
          </div>
        )}
      </section>

      {/* Modal Full Preview PDF */}
      {activeModalPdf && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 md:p-8"
          onClick={() => setActiveModalPdf(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800 truncate pr-4">
                {activeModalPdf.description || "Dokumen Kesiapsiagaan Bencana"}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) =>
                    handleDownload(
                      e,
                      activeModalPdf.url,
                      activeModalPdf.description || "Dokumen-Kesiapsiagaan"
                    )
                  }
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Unduh PDF
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalPdf(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Viewer Modal */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <KesiapsiagaanPdfViewer
                pdfUrl={activeModalPdf.url}
                judul={activeModalPdf.description || "Dokumen PDF"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KesiapsiagaanBencanaPage;