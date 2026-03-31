import { useState } from "react";

import { Button } from "../../../../components/button";
import CustomPagination from "../../../../components/pagination";
import CustomTable from "../../../../components/table";
import { Hash } from "../../../../constants";
import { Input } from "../../../../components/input";
import { deleteBerita } from "../../../../services/berita/api";
import { toast } from "sonner";
import { useBeritaData } from "../hooks/useBeritaData";
import { useNavigate } from "react-router-dom";

const ListPage = () => {
  const navigate = useNavigate();
  const { beritaData, setParams, params, paginationInfo } = useBeritaData();
  const [keyword, setKeyword] = useState("");

  // Columns definition
  const columns = [
    {
      header: "Title",
      accessor: "title",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Description",
      accessor: "description",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Highlighted",
      accessor: "highlighted",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Action",
      accessor: "action",
    },
  ];

  // Table Data
  const data = beritaData.map((item) => {
    return {
      ...item,
      highlighted: item.highlighted ? "Active" : "Inactive",
      action: (
        <div className="flex flex-row gap-3">
          <Button onClick={() => handleDetailBerita(item.id)}>Edit</Button>
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
      await deleteBerita(id);
      setParams({
        ...params,
      });
      toast.success("Berita has been deleted");
    } catch (error) {
      console.error("Error deleting berita:", error);
    }
  };

  const handleAddBerita = () => {
    navigate(Hash.DETAIL);
  };

  const handleDetailBerita = (id) => {
    navigate(`?id=${id}${Hash.DETAIL}`);
  };

  //   useEffect(() => {
  //     if (userDetail) {
  //       form.reset({
  //         ...userDetail,
  //         locked: userDetail.locked ? "true" : "false",
  //         active: userDetail.active ? "true" : "false",
  //         branch: userDetail.branchCode,
  //       });
  //     }
  //   }, [userDetail, form]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Data Berita</h1>
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
        <Button onClick={handleAddBerita}>Tambah Berita</Button>
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
    </div>
  );
};

export default ListPage;
