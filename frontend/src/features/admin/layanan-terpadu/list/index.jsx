import React, { useState } from "react";

import { Button } from "../../../../components/button";
import CustomPagination from "../../../../components/pagination";
import CustomTable from "../../../../components/table";
import { Hash } from "../../../../constants";
import { Input } from "../../../../components/input";
import { deleteLayananTerpadu } from "../../../../services/layanan-terpadu";
import { toast } from "sonner";
import { useLayananTerpaduData } from "../hooks/useLayananTerpaduData";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import {
  isLayananIcon,
  isLayananImageUrl,
  LAYANAN_COLOR_PALETTE,
  LAYANAN_ICON_MAP,
} from "../../../layanan/layanan-terpadu/icons";

const IconCell = ({ item }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const palette = LAYANAN_COLOR_PALETTE[(item.displayOrder || 0) % LAYANAN_COLOR_PALETTE.length];
  const Icon = isLayananIcon(item.img) ? LAYANAN_ICON_MAP[item.img] : Globe;

  return (
    <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${palette.background}`}>
      {isLayananImageUrl(item.img) && !imageFailed ? (
        <img
          src={item.img}
          alt={item.title}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon className={`h-5 w-5 ${palette.color}`} />
      )}
    </div>
  );
};

const ListPage = () => {
  const navigate = useNavigate();
  const { layananTerpaduData, setParams, params, paginationInfo } =
    useLayananTerpaduData();
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
      header: "Icon",
      accessor: "icon",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Platform",
      accessor: "platform",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Urutan",
      accessor: "displayOrder",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Aktif",
      accessor: "isVisible",
      headerClassName: "text-left font-bold",
    },
    {
      header: "Action",
      accessor: "action",
    },
  ];

  // Table Data
  const data = layananTerpaduData.map((item) => {
    return {
      ...item,
      icon: <IconCell item={item} />,
      isVisible: item.isVisible ? "Ya" : "Tidak",
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
      await deleteLayananTerpadu(id);
      setParams({
        ...params,
      });
      toast.success("Layanan Terpadu has been deleted");
    } catch (error) {
      console.error("Error deleting layanan terpadu:", error);
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
      <h1 className="text-2xl font-bold">Data Layanan Terpadu</h1>
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
        <Button onClick={handleAdd}>Tambah Layanan Terpadu</Button>
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
