import { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const FlipbookViewer = ({ pdfUrl }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bookRef = useRef();

  useEffect(() => {
    if (!pdfUrl) return;

    const renderPdfToImages = async () => {
      setLoading(true);
      try {
        const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
        const imgs = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          imgs.push(canvas.toDataURL());
        }

        setPages(imgs);
      } catch (err) {
        console.error("Gagal render PDF:", err);
      } finally {
        setLoading(false);
      }
    };

    renderPdfToImages();
  }, [pdfUrl]);

  if (loading) {
    return <p className="text-center py-10">Memuat dokumen...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-sm text-gray-500">Klik tepi halaman atau geser untuk membuka lembar berikutnya</p>

      <HTMLFlipBook
        ref={bookRef}
        width={550}
        height={750}
        size="stretch"
        minWidth={315}
        maxWidth={900}
        minHeight={400}
        maxHeight={1000}
        showCover={true}
        className="shadow-lg"
      >
        {pages.map((imgSrc, index) => (
          <div key={index} className="bg-white">
            <img src={imgSrc} alt={`Halaman ${index + 1}`} className="w-full h-full object-contain" />
          </div>
        ))}
      </HTMLFlipBook>

      <div className="flex gap-4">
        <button
          onClick={() => bookRef.current.pageFlip().flipPrev()}
          className="px-4 py-2 bg-indigo text-white rounded-lg hover:bg-blue-950"
        >
          ← Sebelumnya
        </button>
        <button
          onClick={() => bookRef.current.pageFlip().flipNext()}
          className="px-4 py-2 bg-indigo text-white rounded-lg hover:bg-blue-950"
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  );
};

export default FlipbookViewer;