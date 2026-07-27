const KesiapsiagaanPdfViewer = ({ pdfUrl, judul }) => {
  return (
    <div className="flex flex-col w-full px-10 mb-10">
      <div className="w-full">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={judul}
            width="100%"
            height="100%"
            className="h-screen"
            style={{ border: "none" }}
          />
        ) : (
          <p>Memuat dokumen...</p>
        )}
      </div>
    </div>
  );
};

export default KesiapsiagaanPdfViewer;