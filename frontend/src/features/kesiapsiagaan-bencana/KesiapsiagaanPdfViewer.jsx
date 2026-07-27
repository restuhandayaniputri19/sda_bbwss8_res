const KesiapsiagaanPdfViewer = ({ pdfUrl, judul }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full min-h-[600px]">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={judul}
            width="100%"
            height="100%"
            className="w-full h-full rounded border-0"
          />
        ) : (
          <p className="p-4 text-center text-gray-500">Memuat dokumen...</p>
        )}
      </div>
    </div>
  );
};

export default KesiapsiagaanPdfViewer;