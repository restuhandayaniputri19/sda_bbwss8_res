import { useState } from "react";
import KesiapsiagaanPdfViewer from "./KesiapsiagaanPdfViewer";

// TODO: ganti dengan URL PDF asli kamu
const PDF_DOKUMEN_1 = `${import.meta.env.BASE_URL}documents/kesiapsiagaan-1.pdf`;
const PDF_DOKUMEN_2 = `${import.meta.env.BASE_URL}documents/kesiapsiagaan-2.pdf`;

const KesiapsiagaanBencana = () => {
  const [activeTab, setActiveTab] = useState("dokumen1");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Judul */}
      <div className="flex flex-col items-center mt-10 mb-6">
        <h1 className="text-3xl font-bold">Kesiapsiagaan Bencana</h1>
      </div>

      {/* Tab Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          {[
            { key: "dokumen1", label: "DOKUMEN 1" },
            { key: "dokumen2", label: "DOKUMEN 2" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-10 py-2.5 text-sm font-semibold tracking-wider transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-indigo border-b-2 border-indigo"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "dokumen1" ? (
        <KesiapsiagaanPdfViewer pdfUrl={PDF_DOKUMEN_1} judul="Dokumen Kesiapsiagaan Bencana 1" />
      ) : (
        <KesiapsiagaanPdfViewer pdfUrl={PDF_DOKUMEN_2} judul="Dokumen Kesiapsiagaan Bencana 2" />
      )}
    </div>
  );
};

export default KesiapsiagaanBencana;