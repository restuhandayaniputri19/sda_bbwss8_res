import "react-quill/dist/quill.snow.css";

import { CustomFormField, Form } from "../../../../components/form";
import { useEffect, useState, useRef } from "react";
import { editBerita, postBerita } from "../../../../services/berita/api";
// ✅ GUNAKAN postGallery DAN deleteGallery DARI API SERVICE
import { postGallery, deleteGallery } from "../../../../services/gallery/api";

import { Button } from "../../../../components/button";
import DropdownSelect from "../../../../components/select";
import { Input } from "../../../../components/input";
import ReactQuill from "react-quill";
import { beritaSchema } from "../../../../services/berita/form";
import { toast } from "sonner";
import { useBeritaDetail } from "../hooks/useBeritaDetail";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../../hooks/useQuery";
import { zodResolver } from "@hookform/resolvers/zod";

const highlightOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["link"],
    ["clean"],
    ["blockquote", "code-block"],
    [{ direction: "rtl" }],
    [{ size: ["small", "medium", "large", "huge"] }],
  ],
};

const DetailPage = () => {
  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const beritaDetail = useBeritaDetail(id);

  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");

  // State untuk foto galeri yang SUDAH TERSIMPAN di DB untuk Berita ini
  const [existingGalleries, setExistingGalleries] = useState([]);

  // State untuk antrean foto BARU yang siap diunggah per foto
  const [newGalleryItems, setNewGalleryItems] = useState([]);

  const galleryInputRef = useRef(null);
  const isEdit = !!id;

  const form = useForm({
    resolver: typeof beritaSchema === "function" ? zodResolver(beritaSchema(isEdit)) : undefined,
    defaultValues: {
      title: "",
      description: "",
      location: "",
      highlighted: "false",
      img: "",
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("img");

  // ==========================================
  // HANDLER FORM BERITA UTAMA
  // ==========================================
  const onSubmitBerita = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title || "");
    formData.append("description", description || data.description || "");
    formData.append("location", data.location || "");
    formData.append("highlighted", data.highlighted === "true");

    // File Gambar Utama Berita
    if (data.img && data.img.length > 0 && data.img[0] instanceof File) {
      formData.append("img", data.img[0]);
    }

    try {
      if (isEdit) {
        await editBerita(id, formData);
        toast.success("Data Berita berhasil diperbarui");
      } else {
        const res = await postBerita(formData);
        toast.success("Data Berita berhasil dibuat");
        
        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          navigate(`/admin/berita/detail?id=${createdId}`, { replace: true });
          return;
        }
      }
      navigate("/admin/berita", { replace: true });
    } catch (error) {
      console.error("Error submitting berita:", error);
      toast.error("Gagal menyimpan data berita");
    }
  };

  // ==========================================
  // HANDLER MANAJEMEN FOTO GALERI TAMBAHAN
  // ==========================================
  
  const handleGalleryFileChange = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f instanceof File);
    if (files.length === 0) return;

    const mappedNewItems = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      description: "",
      previewUrl: URL.createObjectURL(file),
      isUploading: false,
    }));

    setNewGalleryItems((prev) => [...prev, ...mappedNewItems]);

    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  const handleGalleryItemDescriptionChange = (index, value) => {
    setNewGalleryItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, description: value } : item))
    );
  };

  const handleRemoveNewGalleryItem = (indexToRemove) => {
    setNewGalleryItems((prev) => {
      const itemToRemove = prev[indexToRemove];
      if (itemToRemove?.previewUrl) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // ✅ SIMPAN / SUBMIT 1 FOTO MENGGUNAKAN postGallery API
  const handleSaveSingleGalleryItem = async (index) => {
    const item = newGalleryItems[index];
    if (!item || !item.file) return;

    setNewGalleryItems((prev) =>
      prev.map((it, idx) => (idx === index ? { ...it, isUploading: true } : it))
    );

    const formData = new FormData();
    // Sesuaikan nama field sesuai payload backend (biasanya 'file' atau 'img')
    formData.append("file", item.file);
    formData.append("title", item.description || form.getValues("title") || "Galeri Berita");
    
    if (id) {
      formData.append("beritaId", id);
    }

    try {
      // Panggil postGallery
      const res = await postGallery(formData);
      const savedGallery = res?.data || res;

      toast.success(`Foto #${index + 1} berhasil disimpan ke galeri!`);

      // Tambahkan ke daftar galeri eksis
      setExistingGalleries((prev) => [...prev, savedGallery]);

      // Hapus dari antrean upload baru
      handleRemoveNewGalleryItem(index);
    } catch (err) {
      console.error("Gagal mengunggah foto galeri:", err);
      toast.error(`Gagal menyimpan foto #${index + 1}`);

      setNewGalleryItems((prev) =>
        prev.map((it, idx) => (idx === index ? { ...it, isUploading: false } : it))
      );
    }
  };

  // Hapus foto dari galeri
  const handleRemoveExistingGalleryItem = async (galleryId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus foto galeri ini?")) return;

    try {
      if (typeof deleteGallery === "function") {
        await deleteGallery(galleryId);
      }
      setExistingGalleries((prev) => prev.filter((item) => item.id !== galleryId));
      toast.success("Foto galeri berhasil dihapus");
    } catch (err) {
      console.error("Gagal menghapus foto galeri:", err);
      toast.error("Gagal menghapus foto galeri");
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = form;

  useEffect(() => {
    if (beritaDetail) {
      const data = beritaDetail.data || beritaDetail;
      form.reset({
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        highlighted: data.highlighted ? "true" : "false",
        img: "",
      });

      setImgUrl(data.img || "");
      setDescription(data.description || "");

      if (Array.isArray(data.galleries)) {
        setExistingGalleries(data.galleries);
      } else {
        setExistingGalleries([]);
      }

      setNewGalleryItems([]);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  }, [beritaDetail, form]);

  useEffect(() => {
    if (fileWatcher?.length > 0 && fileWatcher[0] instanceof File) {
      const url = URL.createObjectURL(fileWatcher[0]);
      setImgUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [fileWatcher]);

  useEffect(() => {
    return () => {
      newGalleryItems.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [newGalleryItems]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Berita" : "Tambah Berita"}
      </h1>

      {/* 1. FORM UTAMA BERITA */}
      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmitBerita)}>
          <CustomFormField control={form.control} name="title" label="Title">
            {(field) => (
              <Input
                {...field}
                placeholder="Input title"
                type="text"
                disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="description" label="Description">
            {() => (
              <ReactQuill
                theme="snow"
                modules={modules}
                value={description}
                onChange={(value) => {
                  setDescription(value);
                  setValue("description", value);
                }}
                disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="location" label="Location">
            {(field) => (
              <Input
                {...field}
                placeholder="Input location"
                type="text"
                disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="highlighted" label="Highlighted">
            {(field) => (
              <DropdownSelect
                name="highlighted"
                placeholder="Select Option"
                emptyState="No options available"
                data={highlightOptions}
                value={
                  highlightOptions.find((option) => option.value === field.value)?.value
                }
                onChange={(e) => field.onChange(e?.target.value)}
                disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="img" label="Main Image">
            {() => (
              <>
                {imgUrl && (
                  <div className="flex flex-col items-center justify-center mb-2 p-2 border rounded bg-gray-50">
                    <span className="text-xs font-semibold text-gray-500 mb-1">
                      Preview Gambar Utama:
                    </span>
                    <img
                      src={imgUrl}
                      className="max-h-72 rounded border object-contain"
                      alt="Main Preview"
                    />
                  </div>
                )}

                <Input
                  {...form.register("img")}
                  id="image"
                  type="file"
                  variant="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  disabled={isSubmitting}
                />
              </>
            )}
          </CustomFormField>

          {/* Action Buttons Form Utama */}
          <div className="flex flex-row gap-4 mt-2 justify-end border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/berita", { replace: true })}
            >
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEdit ? "Update Berita" : "Submit Berita"}
            </Button>
          </div>
        </form>
      </Form>

      {/* 2. MANAJEMEN FOTO GALERI TAMBAHAN (DITERAPKAN DILUAR & DIBAWAH FORM UTAMA) */}
      <div className="flex flex-col gap-4 p-5 border rounded-lg bg-white shadow-sm mt-4">
        <div className="flex flex-col gap-1 border-b pb-3">
          <h2 className="text-lg font-bold text-gray-800">
            Manajemen Foto Galeri Tambahan
          </h2>
          <p className="text-xs text-gray-500">
            {isEdit
              ? "Kelola dan unggah foto-foto galeri terkait untuk berita ini secara independen."
              : "Simpan berita terlebih dahulu sebelum menambahkan galeri foto tambahan."}
          </p>
        </div>

        {!isEdit ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 font-medium">
            ⚠️ Fitur upload galeri tambahan akan aktif setelah Anda menekan tombol <strong>Submit Berita</strong> di atas.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* DAFTAR FOTO GALERI TERSIMPAN */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-700">
                Foto Galeri Terkait Saat Ini ({existingGalleries.length} Foto):
              </span>

              {existingGalleries.length === 0 ? (
                <span className="text-xs text-gray-400 italic">Belum ada foto galeri terlampir.</span>
              ) : (
                <div className="flex flex-wrap gap-4 pt-1">
                  {existingGalleries.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="relative group flex flex-col items-center p-1 border rounded bg-gray-50 w-32 shadow-sm"
                    >
                      <img
                        src={item.url || item.img}
                        alt={item.description || `Gallery ${idx + 1}`}
                        className="h-24 w-full object-cover rounded border"
                      />
                      <span className="text-[11px] text-gray-600 truncate w-full text-center mt-1 font-medium px-1">
                        {item.description || "Tersimpan"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingGalleryItem(item.id)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700 shadow transition-transform transform group-hover:scale-105"
                        title="Hapus foto dari galeri"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* UPLOAD FOTO GALERI BARU */}
            <div className="flex flex-col gap-3 border-t pt-4">
              <label className="text-xs font-bold text-gray-700">
                Tambah Foto Galeri Baru (Upload per Foto):
              </label>

              <Input
                ref={galleryInputRef}
                onChange={handleGalleryFileChange}
                id="newGalleryFiles"
                type="file"
                variant="file"
                multiple
                accept="image/jpeg, image/png, image/gif, image/webp"
              />

              {newGalleryItems.length > 0 && (
                <div className="flex flex-col gap-3 p-3 border rounded bg-gray-50 mt-1">
                  <span className="text-xs font-semibold text-gray-700 border-b pb-2">
                    Daftar Foto Siap Unggah ({newGalleryItems.length} foto):
                  </span>

                  <div className="flex flex-col gap-3">
                    {newGalleryItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border rounded shadow-sm"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={item.previewUrl}
                            alt={`Gallery Upload #${idx + 1}`}
                            className="h-20 w-24 object-cover rounded border"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white font-bold text-[10px] px-1 rounded">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="flex flex-col flex-1 gap-1 w-full">
                          <label className="text-xs font-medium text-gray-600">
                            Judul / Deskripsi Foto #{idx + 1}:
                          </label>
                          <Input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleGalleryItemDescriptionChange(idx, e.target.value)
                            }
                            placeholder="Masukkan deskripsi foto galeri ini..."
                            disabled={item.isUploading}
                          />
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                          <button
                            type="button"
                            disabled={item.isUploading}
                            onClick={() => handleSaveSingleGalleryItem(idx)}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-xs font-semibold shadow-sm transition-colors"
                          >
                            {item.isUploading ? "Menyimpan..." : "Simpan Foto Ini"}
                          </button>

                          <button
                            type="button"
                            disabled={item.isUploading}
                            onClick={() => handleRemoveNewGalleryItem(idx)}
                            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 px-3 py-2 rounded text-xs font-semibold border border-red-200"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;