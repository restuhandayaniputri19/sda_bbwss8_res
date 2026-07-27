import { useState } from "react";

const PdfPagePreview = ({ pdfUrl, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-[320px] bg-gray-100 rounded-t-lg overflow-hidden border-b">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
          Memuat preview...
        </div>
      )}
      
      {/* Parameter #page=1&toolbar=0&navpanes=0 memaksa iframe menampilkan halaman 1 tanpa kontrol */}
      <iframe
        src={`${pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
        title={`Preview ${title}`}
        className="w-full h-full pointer-events-none select-none"
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Overlay transparan untuk menyerap klik agar membuka modal */}
      <div className="absolute inset-0 bg-transparent cursor-pointer hover:bg-black/5 transition-colors" />
    </div>
  );
};

export default PdfPagePreview;