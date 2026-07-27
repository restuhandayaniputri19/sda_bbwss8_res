import { CustomFormField, Form } from "../../../../components/form";
import React, { useEffect, useState } from "react";
import {
  editInfoGrafis,
  postInfoGrafis,
} from "../../../../services/infografis";

import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { infografisSchema } from "../../../../services/infografis/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useInfografisDetail } from "../hooks/useInfografisDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../../hooks/useQuery";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../../../../components/select/based";

// Ubah value kategori agar presisi dengan enum/string di database (lowercase)
const categories = [
  { label: "Bendungan", value: "bendungan" },
  { label: "Irigasi & Rawa", value: "irigasi & rawa" },
  { label: "Sungai", value: "sungai" },
  { label: "Danau", value: "danau" },
  { label: "Embung", value: "embung" },
  { label: "Air Tanah & Air Baku", value: "air tanah & air baku" },
];

const DetailPage = () => {
  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const infografisDetail = useInfografisDetail(id);

  const [imgUrl, setImgUrl] = useState("");

  const isEdit = !!id;

  const form = useForm({
    resolver: zodResolver(infografisSchema(isEdit)),
    defaultValues: {
      description: "",
      infografis: "",
      category: "",
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("infografis");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("category", data.category);

    if (data.infografis && data.infografis.length > 0) {
      formData.append("infografis", data.infografis[0]);
    }

    try {
      if (isEdit) {
        await editInfoGrafis(id, formData);
        toast.success("Infografis has been updated");
      } else {
        await postInfoGrafis(formData);
        toast.success("Infografis has been created");
      }
      navigate("/admin/infografis", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = form;

  // 1. Perbaikan Effect Reset Data
  useEffect(() => {
    if (infografisDetail) {
      // Pastikan mengekstrak objek data utama (antisipasi jika di-wrap oleh Axios/React Query)
      const data = infografisDetail.data || infografisDetail;

      if (data && data.id) {
        reset({
          description: data.description || "",
          category: data.category ? String(data.category).toLowerCase() : "",
          infografis: "", // Kosongkan file input di form state
        });

        // Set gambar preview dari URL database
        if (data.url) {
          setImgUrl(data.url);
        }
      }
    }
  }, [infografisDetail, reset]);

  // 2. Effect Preview jika ada file baru yang di-upload
  useEffect(() => {
    if (
      fileWatcher &&
      fileWatcher.length > 0 &&
      fileWatcher[0] instanceof File
    ) {
      const newImgUrl = URL.createObjectURL(fileWatcher[0]);
      setImgUrl(newImgUrl);

      // Cleanup object URL untuk mencegah memory leak
      return () => URL.revokeObjectURL(newImgUrl);
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Infografis" : "Tambah Infografis"}
      </h1>

      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
            name="category"
            label="Category"
          >
            {({ field }) => (
              <Select
                onValueChange={(value) => {
                  // Langsung set nilai ke react-hook-form secara eksplisit
                  setValue("category", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                value={field?.value || form.watch("category") || ""}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CustomFormField>
          <CustomFormField
            control={form.control}
            name="infografis"
            label="Image"
          >
            {() => (
              <>
                {imgUrl && (
                  <div className="flex w-full justify-center mb-3">
                    <img
                      src={imgUrl}
                      className="max-h-72 rounded border object-contain"
                      alt="Preview"
                    />
                  </div>
                )}

                <Input
                  {...form.register("infografis")}
                  id="infografis"
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                />
              </>
            )}
          </CustomFormField>

          <div className="flex flex-row gap-5 mt-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/infografis", { replace: true })}
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
