import { useState } from "react";

import { Button } from "../../../../components/button";
import CustomPagination from "../../../../components/pagination";
import CustomTable from "../../../../components/table";
import { Hash } from "../../../../constants";
import { Input } from "../../../../components/input";
import KesiapsiagaanPdfViewer from "../../../kesiapsiagaan-bencana/KesiapsiagaanPdfViewer";
import { deleteKesiapsiagaanBencana } from "../../../../services/kesiapsiagaan_bencana";
import { toast } from "sonner";
import { useKesiapsiagaanBencanaData } from "../hooks/useKesiapsiagaanBencanaData";
import { useNavigate } from "react-router-dom";

const ListPage = () => {
  const navigate = useNavigate();
  const { kesiapsiagaanBencanaData, setParams, params, paginationInfo } =
    useKesiapsiagaanBencanaData();
  const [keyword, setKeyword] = useState("");

  // State untuk kontrol Modal Preview PDF
  const [selectedPdf, setSelectedPdf] = useState({ url: "", title: "" });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Columns definition
  const columns = [
    {
      header: "Description",
      accessor: "description",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Release Date",
      accessor: "releaseDate",
      headerClassName: "text-left font-bold",
    },
    {
      header: "PDF File",
      accessor: "pdfPreview",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Action",
      accessor: "action",
    }
  ];

  const handleOpenPreview = (url, title) => {
    setSelectedPdf({ url, title });
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedPdf({ url: "", title: "" });
  };

  // Table Data
  const data = (kesiapsiagaanBencanaData || []).map((item) => {
    return {
      ...item,
      releaseDate: item.releaseDate,
      pdfPreview: item.url ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenPreview(item.url, item.description)}
        >
          Lihat PDF
        </Button>
      ) : (
        <span className="text-gray-400 text-sm">Tidak ada file</span>
      ),
      action: (
        <div className="flex flex-row gap-3">
          <Button onClick={() => handleDetail(item.id)}>Edit</Button>
          <Button onClick={() => handleDelete(item.id)} variant="destructive">
            Delete
          </Button>
        </div>
      ),
    };
  });

  const handlePageChange = (page) => {
    setParams({
      ...params,
      page: page,
    });
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    setParams({
      ...params,
      search: keyword,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteKesiapsiagaanBencana(id);
      setParams({
        ...params,
      });
      toast.success("Kesiapsiagaan Bencana has been deleted");
    } catch (error) {
      console.error("Error deleting kesiapsiagaan bencana:", error);
    }
  };

  const handleAdd = () => {
    navigate(Hash.DETAIL);
  };

  const handleDetail = (id) => {
    navigate(`?id=${id}${Hash.DETAIL}`);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Data Kesiapsiagaan Bencana</h1>
      <br />
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <Input
            variant={"default"}
            fieldSize={"default"}
            type={"text"}
            placeholder={"Enter keyword"}
            onChange={handleChangeKeyword}
          />
          <Button onClick={handleSearch}>Cari</Button>
        </div>
        <Button onClick={handleAdd}>Tambah Kesiapsiagaan Bencana</Button>
      </div>

      <CustomTable
        columns={columns}
        data={data}
        className="mt-4 mb-10 border-collapse border border-gray-200 shadow-lg"
        headerClassName="bg-gray-100 text-gray-700"
        bodyClassName="bg-white"
      />
      
      {paginationInfo.totalPages > 1 && (
        <CustomPagination
          currentPage={paginationInfo.currentPage}
          totalPageCount={paginationInfo.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal Overlay Preview PDF */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-6 py-3 border-b bg-gray-50">
              <h2 className="font-semibold text-lg truncate">
                Preview: {selectedPdf.title || "Dokumen PDF"}
              </h2>
              <Button variant="secondary" onClick={handleClosePreview}>
                Tutup
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <KesiapsiagaanPdfViewer
                pdfUrl={selectedPdf.url}
                judul={selectedPdf.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPage;