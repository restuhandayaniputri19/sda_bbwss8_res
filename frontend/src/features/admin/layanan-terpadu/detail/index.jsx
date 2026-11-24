import { CustomFormField, Form } from "../../../../components/form";
import React, { useEffect, useState } from "react";
import {
  editLayananTerpadu,
  postLayananTerpadu,
} from "../../../../services/layanan-terpadu";

import { Button } from "../../../../components/button";
import DropdownSelect from "../../../../components/select";
import { Input } from "../../../../components/input";
import { layananTerpaduSchema } from "../../../../services/layanan-terpadu/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useLayananTerpaduDetail } from "../hooks/useLayananTerpaduDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../../hooks/useQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  isLayananIcon,
  isLayananImageUrl,
  LAYANAN_ICON_OPTIONS,
} from "../../../layanan/layanan-terpadu/icons";

const platformOptions = [
  { value: "internal", label: "Internal (React Router)" },
  { value: "external", label: "Website eksternal" },
  { value: "android", label: "Google Play Store" },
  { value: "ios", label: "Apple App Store" },
  { value: "deeplink", label: "Deep link aplikasi" },
  { value: "download", label: "File / download" },
];

const imageModeOptions = [
  { value: "icon", label: "Ikon Lucide" },
  { value: "upload", label: "Upload gambar" },
  { value: "none", label: "Tanpa gambar / ikon" },
];

const DetailPage = () => {
  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const { layananTerpaduDetail, loading: loadingDetail, error: detailError } =
    useLayananTerpaduDetail(id);

  const [imgUrl, setImgUrl] = useState("");
  const [imageMode, setImageMode] = useState("icon");

  const isEdit = !!id;

  const form = useForm({
    resolver: zodResolver(layananTerpaduSchema()),
    defaultValues: {
      title: "",
      platform: "",
      description: "",
      url: "",
      img: "",
      isVisible: true,
      isClickable: true,
      displayOrder: 0,
      imgIcon: "Globe",
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("img");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("url", data.url);
    formData.append("platform", data.platform);
    formData.append("description", data.description);
    formData.append("isVisible", String(data.isVisible));
    formData.append("isClickable", "true");
    formData.append("displayOrder", String(data.displayOrder));

    if (imageMode === "icon") {
      formData.append("imgIcon", data.imgIcon || "Globe");
    } else if (imageMode === "none") {
      formData.append("clearImg", "true");
    } else if (data.img && data.img.length > 0) {
      formData.append("img", data.img[0]);
    } else if (isEdit && !imgUrl) {
      formData.append("clearImg", "true");
    }

    try {
      if (isEdit) {
        await editLayananTerpadu(id, formData);
        toast.success("Layanan Terpadu has been updated");
      } else {
        await postLayananTerpadu(formData);
        toast.success("Layanan Terpadu has been created");
      }
      navigate("/admin/layanan-terpadu", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (layananTerpaduDetail) {
      const storedImg = layananTerpaduDetail.img;
      const imageIsUrl = isLayananImageUrl(storedImg);
      reset({
        ...layananTerpaduDetail,
        img: "",
        isClickable: true,
        imgIcon: isLayananIcon(storedImg) ? storedImg : "Globe",
      });
      setImageMode(imageIsUrl ? "upload" : isLayananIcon(storedImg) ? "icon" : "none");
      setImgUrl(imageIsUrl ? storedImg : "");
    }
  }, [layananTerpaduDetail, reset]);

  useEffect(() => {
    if (fileWatcher?.length > 0) {
      setImgUrl(URL.createObjectURL(fileWatcher[0]));
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Layanan Terpadu" : "Tambah Layanan Terpadu"}
      </h1>

      {isEdit && loadingDetail && !layananTerpaduDetail && (
        <p className="text-sm text-gray-500">Memuat data layanan...</p>
      )}
      {detailError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Gagal memuat layanan ID {id}: {detailError}
        </div>
      )}

      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <CustomFormField control={form.control} name="title" label="Title">
            {(field) => (
              <Input
                {...field}
                placeholder="Input Title"
                type="text"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="url" label="Url">
            {(field) => (
              <Input
                {...field}
                placeholder="Input Url"
                type="text"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            name="description"
            label="Description"
          >
            {(field) => (
              <Input
                {...field}
                placeholder="Input description"
                type="text"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            name="platform"
            label="Platform"
          >
            {(field) => (
              <DropdownSelect
                name="platform"
                placeholder="Select Option"
                emptyState="No options available"
                data={platformOptions}
                value={
                  platformOptions.find((option) => option.value === field.value)
                    ?.value
                }
                onChange={(e) => field.onChange(e?.target.value)}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="displayOrder" label="Urutan Tampilan">
            {(field) => (
              <Input {...field} type="number" min="0" step="1" disabled={isSubmitting} />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="isVisible" label="Tampilkan di halaman publik">
            {(field) => (
              <input type="checkbox" checked={!!field.value} onChange={field.onChange} disabled={isSubmitting} />
            )}
          </CustomFormField>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Gambar atau ikon</label>
            <DropdownSelect
              name="imageMode"
              value={imageMode}
              data={imageModeOptions}
              onChange={(event) => setImageMode(event.target.value)}
              disabled={isSubmitting}
            />

            {imageMode === "icon" && (
              <CustomFormField control={form.control} name="imgIcon" label="Ikon Lucide">
                {(field) => (
                  <DropdownSelect
                    name="imgIcon"
                    placeholder="Pilih ikon"
                    data={LAYANAN_ICON_OPTIONS.map(({ value, label }) => ({ value, label }))}
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    disabled={isSubmitting}
                  />
                )}
              </CustomFormField>
            )}

            {imageMode === "upload" && (
              <>
                {imgUrl && (
                  <div className="flex w-full justify-center">
                    <img src={imgUrl} className="max-h-72" alt="Preview" />
                  </div>
                )}
                <Input
                  {...form.register("img")}
                  id="img"
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                />
                {isEdit && imgUrl && !fileWatcher?.length && (
                  <p className="text-sm text-gray-500">Gambar saat ini tetap dipakai jika tidak memilih file baru.</p>
                )}
              </>
            )}

            {imageMode === "none" && (
              <p className="text-sm text-gray-500">Halaman publik akan memakai ikon Globe.</p>
            )}
          </div>

          <div className="flex flex-row gap-5 mt-4 justify-end">
            <Button
              variant="secondary"
              onClick={() =>
                navigate("/admin/layanan-terpadu", { replace: true })
              }
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? `Submitting` : isEdit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DetailPage;
