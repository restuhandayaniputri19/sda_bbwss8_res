import "react-quill/dist/quill.snow.css";

import { CustomFormField, Form } from "../../../../components/form";
import React, { useEffect, useState } from "react";
import { editInformasi, postInformasi } from "../../../../services/informasi";

import { Button } from "../../../../components/button";
import DropdownSelect from "../../../../components/select";
import { Input } from "../../../../components/input";
import ReactQuill from "react-quill";
import { informasiSchema } from "../../../../services/informasi/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useInformasiDetail } from "../hooks/useInformasiDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../../hooks/useQuery";
import { zodResolver } from "@hookform/resolvers/zod";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }], // Headers
    ["bold", "italic", "underline", "strike"], // Text formatting
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    [{ script: "sub" }, { script: "super" }], // Subscript and superscript
    [{ color: [] }, { background: [] }], // Text and background color
    [{ font: [] }], // Font family
    [{ align: [] }], // Text alignment
    ["link"], // Insert link, image, video
    ["clean"], // Remove formatting
    ["blockquote", "code-block"], // Block quotes and code blocks
    [{ direction: "rtl" }], // Right-to-left text direction
    [{ size: ["small", "medium", "large", "huge"] }], // Font sizes
  ],
};

const DetailPage = () => {
  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const informasiDetail = useInformasiDetail(id);

  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");

  const isEdit = !!id;

  const form = useForm({
    resolver: zodResolver(informasiSchema(isEdit)),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      file: "",
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("file");

const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title || "");
    formData.append("description", description || data.description || "");
    formData.append("location", data.location || "");

    // 🔴 Perbaikan Pengiriman File
    if (data.file) {
      if (data.file instanceof FileList && data.file.length > 0) {
        formData.append("file", data.file[0]);
      } else if (data.file instanceof File) {
        formData.append("file", data.file);
      }
    }

    try {
      if (isEdit) {
        await editInformasi(id, formData);
        toast.success("Informasi has been updated");
      } else {
        await postInformasi(formData);
        toast.success("Informasi has been created");
      }
      navigate("/admin/informasi", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Tampilkan detail error dari backend jika ada
      const errorMsg = error.response?.data?.message || "Failed to submit form";
      toast.error(errorMsg);
    }
  };
  
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = form;

  useEffect(() => {
    if (informasiDetail) {
      form.reset({
        ...informasiDetail,
        url: "",
      });
      setFileUrl(informasiDetail.url);
      setDescription(informasiDetail.description);
    }
  }, [informasiDetail, form]);

  useEffect(() => {
    if (fileWatcher?.length > 0) {
      setFileUrl(URL.createObjectURL(fileWatcher?.[0]));
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Informasi" : "Tambah Informasi"}
      </h1>

      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <CustomFormField control={form.control} name="title" label="Title">
            {(field) => (
              <Input
                {...field}
                placeholder="Input title"
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
            {() => (
              <ReactQuill
                theme="snow"
                modules={modules}
                value={description}
                onChange={(value) => {
                  setDescription(value);
                  setValue("description", value); // Update form state
                }}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            name="location"
            label="Location"
          >
            {(field) => (
              <Input
                {...field}
                placeholder="Input location"
                type="text"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="file" label="File">
            {() => (
              <>
                {fileUrl && (
                  <div className="flex w-full justify-center ">
                    <iframe
                      src={fileUrl}
                      width="100%"
                      height="400"
                      style={{ border: "none" }}
                      title="File Viewer"
                    />
                  </div>
                )}

                <Input
                  {...form.register("file")}
                  id="file"
                  type="file"
                  variant="file"
                  accept="application/pdf, image/jpeg, image/png, image/webp"
                />
              </>
            )}
          </CustomFormField>

          <div className="flex flex-row gap-5 mt-4 justify-end">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/informasi", { replace: true })}
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
