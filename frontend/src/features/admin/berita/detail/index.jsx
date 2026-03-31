import "react-quill/dist/quill.snow.css";

import { CustomFormField, Form } from "../../../../components/form";
import { useEffect, useState } from "react";
import { editBerita, postBerita } from "../../../../services/berita/api";

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

  const beritaDetail = useBeritaDetail(id);

  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");

  const isEdit = !!id;

  const form = useForm({
    resolver: zodResolver(beritaSchema(isEdit)),
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

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("highlighted", data.highlighted === "true");

    // Only append the file if it exists
    if (data.img && data.img.length > 0) {
      formData.append("img", data.img[0]);
    }

    try {
      if (isEdit) {
        await editBerita(id, formData); // Pass FormData to edit function
        toast.success("Berita has been updated");
      } else {
        await postBerita(formData); // Pass FormData to post function
        toast.success("Berita has been created");
      }
      navigate("/admin/berita", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = form;

  useEffect(() => {
    if (beritaDetail) {
      form.reset({
        ...beritaDetail,
        highlighted: beritaDetail.highlighted ? "true" : "false",
        img: "",
      });
      setImgUrl(beritaDetail.img);
      setDescription(beritaDetail.description); // Initialize the description state
    }
  }, [beritaDetail, form]);

  useEffect(() => {
    if (fileWatcher?.length > 0) {
      setImgUrl(URL.createObjectURL(fileWatcher?.[0]));
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Berita" : "Tambah Berita"}
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

          <CustomFormField
            control={form.control}
            name="highlighted"
            label="Highlighted"
          >
            {(field) => (
              <DropdownSelect
                name="highlighted"
                placeholder="Select Option"
                emptyState="No options available"
                data={highlightOptions}
                value={
                  highlightOptions.find(
                    (option) => option.value === field.value
                  )?.value
                }
                onChange={(e) => field.onChange(e?.target.value)}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              />
            )}
          </CustomFormField>

          <CustomFormField control={form.control} name="img" label="Image">
            {() => (
              <>
                {imgUrl && (
                  <div className="flex w-full justify-center ">
                    <img src={imgUrl} className=" max-h-72" />
                  </div>
                )}

                <Input
                  {...form.register("img")}
                  id="image"
                  type="file"
                  variant="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                />
              </>
            )}
          </CustomFormField>

          <div className="flex flex-row gap-5 mt-4 justify-end">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/berita", { replace: true })}
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
