import { CustomFormField, Form } from "../../../../components/form";
import { useEffect, useState } from "react";
import {
  editKesiapsiagaanBencana,
  postKesiapsiagaanBencana,
} from "../../../../services/kesiapsiagaan_bencana";

import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { kesiapsiagaanBencanaSchema } from "../../../../services/kesiapsiagaan_bencana/form"; // Sesuaikan jika ada schema khusus
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useKesiapsiagaanBencanaDetail } from "../hooks/useKesiapsiagaanBencanaDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../../hooks/useQuery";
import { zodResolver } from "@hookform/resolvers/zod";

const DetailPage = () => {
  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const kesiapsiagaanBencanaDetail = useKesiapsiagaanBencanaDetail(id);
  const [imgUrl, setImgUrl] = useState("");
  const isEdit = !!id;

  const form = useForm({
    // Jika masih memakai infografisSchema, pastikan schemanya disesuaikan/dikendurkan
    resolver: zodResolver(kesiapsiagaanBencanaSchema ? kesiapsiagaanBencanaSchema(isEdit) : undefined),
    defaultValues: {
      description: "",
      releaseDate: "",
      infografis: "",
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("infografis");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("description", data.description || "");
    
    // 1. Ganti category dengan releaseDate
    if (data.releaseDate) {
      formData.append("releaseDate", data.releaseDate);
    }

    // 2. Ambil file dari field infografis
    if (data.infografis && data.infografis.length > 0) {
      formData.append("infografis", data.infografis[0]);
    }

    try {
      if (isEdit) {
        await editKesiapsiagaanBencana(id, formData);
        toast.success("Kesiapsiagaan Bencana has been updated");
      } else {
        await postKesiapsiagaanBencana(formData);
        toast.success("Kesiapsiagaan Bencana has been created");
      }
      navigate("/admin/kesiapsiagaan-bencana", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Log error validasi jika submit gagal karena Zod
  const onError = (formErrors) => {
    console.error("Validation Errors:", formErrors);
    toast.error("Mohon lengkapi semua field yang wajib diisi");
  };

  // 1. Effect Reset Data saat Edit
  useEffect(() => {
    if (kesiapsiagaanBencanaDetail) {
      const data = kesiapsiagaanBencanaDetail.data || kesiapsiagaanBencanaDetail;

      if (data && data.id) {
        reset({
          description: data.description || "",
          releaseDate: data.releaseDate || "",
          infografis: "",
        });

        if (data.url) {
          setImgUrl(data.url);
        }
      }
    }
  }, [kesiapsiagaanBencanaDetail, reset]);

  // 2. Effect Preview jika ada file baru yang di-upload
  useEffect(() => {
    if (
      fileWatcher &&
      fileWatcher.length > 0 &&
      fileWatcher[0] instanceof File
    ) {
      const newImgUrl = URL.createObjectURL(fileWatcher[0]);
      setImgUrl(newImgUrl);

      return () => URL.revokeObjectURL(newImgUrl);
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Dokumen Kesiapsiagaan Bencana" : "Tambah Dokumen Kesiapsiagaan Bencana"}
      </h1>

      <Form {...form}>
        {/* Tambahkan onError pada handleSubmit untuk menangkap error validasi */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit, onError)}>
          
          {/* Field Description */}
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
              />
            )}
          </CustomFormField>

          {/* Field Release Date (Pengganti Category) */}
          <CustomFormField
            control={form.control}
            name="releaseDate"
            label="Release Date"
          >
            {(field) => (
              <Input
                {...field}
                type="date"
                disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          {/* Field File Upload (Nama disamakan: infografis) */}
          <CustomFormField
            control={form.control}
            name="infografis"
            label="Dokumen Kesiapsiagaan Bencana (PDF)"
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
                  accept="application/pdf"
                  disabled={isSubmitting}
                />
              </>
            )}
          </CustomFormField>

          <div className="flex flex-row gap-5 mt-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/kesiapsiagaan-bencana", { replace: true })}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : isEdit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DetailPage;