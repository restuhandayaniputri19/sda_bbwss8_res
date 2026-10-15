import { CustomFormField, Form } from "../../../../components/form";
import { useEffect, useState } from "react";
import {
  editKesiapsiagaanBencana,
  postKesiapsiagaanBencana,
} from "../../../../services/kesiapsiagaan_bencana";

import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { kesiapsiagaanBencanaSchema } from "../../../../services/kesiapsiagaan_bencana/form";
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
  // Ubah nama state agar mencerminkan dokumen PDF
  const [pdfUrl, setPdfUrl] = useState("");
  const isEdit = !!id;

  const form = useForm({
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
    
    if (data.releaseDate) {
      formData.append("releaseDate", data.releaseDate);
    }

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
    formState: { isSubmitting },
  } = form;

  const onError = (formErrors) => {
    console.error("Validation Errors:", formErrors);
    toast.error("Mohon lengkapi semua field yang wajib diisi");
  };

  // 1. Reset Data saat Edit
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
          setPdfUrl(data.url);
        }
      }
    }
  }, [kesiapsiagaanBencanaDetail, reset]);

  // 2. Preview jika ada file PDF baru yang di-upload
  useEffect(() => {
    if (
      fileWatcher &&
      fileWatcher.length > 0 &&
      fileWatcher[0] instanceof File
    ) {
      const newPdfUrl = URL.createObjectURL(fileWatcher[0]);
      setPdfUrl(newPdfUrl);

      return () => URL.revokeObjectURL(newPdfUrl);
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Dokumen Kesiapsiagaan Bencana" : "Tambah Dokumen Kesiapsiagaan Bencana"}
      </h1>

      <Form {...form}>
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

          {/* Field Release Date */}
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

          {/* Field File Upload (PDF) */}
          <CustomFormField
            control={form.control}
            name="infografis"
            label="Dokumen Kesiapsiagaan Bencana (PDF)"
          >
            {() => (
              <>
                {/* DITUKAR KE IFRAME SUPAYA DAPAT MEMERIKSA PREVIEW FILE PDF */}
                {pdfUrl && (
                  <div className="flex w-full justify-center mb-3">
                    <iframe
                      src={pdfUrl}
                      width="100%"
                      height="400"
                      style={{ border: "none" }}
                      title="PDF Viewer"
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