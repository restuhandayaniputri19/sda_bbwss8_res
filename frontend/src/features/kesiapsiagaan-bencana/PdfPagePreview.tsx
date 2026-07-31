import { useState } from "react";

const PdfPagePreview = ({ pdfUrl, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const formattedPdfUrl = pdfUrl?.replace(/^http:\/\//i, 'https://');

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-t-lg overflow-hidden border-b">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
          Memuat preview...
        </div>
      )}
      
      <iframe
        src={`${formattedPdfUrl}#page=1&toolbar=0&navpanes=0`}
        title={`Preview ${title}`}
        className="w-full h-full"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default PdfPagePreview;