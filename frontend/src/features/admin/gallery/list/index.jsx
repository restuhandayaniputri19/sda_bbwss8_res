import React, { useState } from "react";

import { Button } from "../../../../components/button";
import Card from "../../../../components/card";
import CustomPagination from "../../../../components/pagination";
import { Hash } from "../../../../constants";
import { Input } from "../../../../components/input";
import { deleteGallery } from "../../../../services/gallery";
import { toast } from "sonner";
import { useGalleryData } from "../hooks/useGalleryData";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/select/based";

const categories = [
  { label: "Bendungan", value: "bendungan" },
  { label: "Irigasi & Rawa", value: "irigasi & rawa" },
  { label: "Sungai", value: "sungai" },
  { label: "Danau", value: "danau" },
  { label: "Embung", value: "embung" },
  { label: "Air Tanah & Air Baku", value: "air tanah & air baku" },
];

const formatCreatedAt = (createdAt) => {
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
};

const ListPage = () => {
  const navigate = useNavigate();
  const { galleryData, setParams, params, paginationInfo } = useGalleryData();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState("");

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
      category: category === "all" ? undefined : category,
      month: month || undefined,
      page: 1,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteGallery(id);
      setParams({
        ...params,
      });
      toast.success("Gallery has been deleted");
    } catch (error) {
      console.error("Error deleting gallery:", error);
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
      <h1 className="text-2xl font-bold">Data Gallery</h1>
      <br />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <Input
            variant={"default"}
            fieldSize={"default"}
            type={"text"}
            placeholder={"Enter keyword"}
            onChange={handleChangeKeyword}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Semua kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua kategori</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="w-44"
            aria-label="Filter bulan dibuat"
          />
          <Button onClick={handleSearch}>Cari</Button>
        </div>
        <Button
          size="icon"
          aria-label="Tambah gallery"
          title="Tambah Gallery"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {galleryData.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <img
              src={item.url}
              alt={item.description || "Gallery"}
              className="h-64 w-full bg-gray-50 object-cover"
              loading="lazy"
            />
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              <Button
                size="icon"
                aria-label="Edit gallery"
                title="Edit"
                onClick={() => handleDetail(item.id)}
                className="bg-white text-gray-700 shadow-md hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                aria-label="Hapus gallery"
                title="Delete"
                onClick={() => handleDelete(item.id)}
                variant="destructive"
                className="shadow-md"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <footer className="mt-auto space-y-3 border-t border-gray-100 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Description
                </p>
                <p className="mt-1 text-sm text-gray-800">
                  {item.description || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Dibuat
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {formatCreatedAt(item.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Category
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {item.category || "-"}
                  </p>
                </div>
              </div>
            </footer>
          </Card>
        ))}
      </div>
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
