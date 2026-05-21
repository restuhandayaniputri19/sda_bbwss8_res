import { CustomFormField, Form } from "../../../../components/form";
import React, { useEffect, useState } from "react";
import { editGallery, postGallery } from "../../../../services/gallery";

import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem, 
  SelectContent, 
} from "../../../../components/select/based";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { gallerySchema } from "../../../../services/gallery/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useGalleryDetail } from "../hooks/useGalleryDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../../hooks/useQuery";
import { zodResolver } from "@hookform/resolvers/zod";

const categories = ["Bendungan", "Irigasi & Rawa", "Sungai", "Danau", "Embung", "Air Tanah & Air Baku"];

const DetailPage = () => {
  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const galleryDetail = useGalleryDetail(id);

  const [imgUrl, setImgUrl] = useState("");

  const isEdit = !!id;

  const form = useForm({
    resolver: zodResolver(gallerySchema(isEdit)),
    defaultValues: {
      description: "",
      category: "",
      gallery: "",
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("gallery");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("category", data.category);

    // Only append the file if it exists
    if (data.gallery && data.gallery.length > 0) {
      formData.append("gallery", data.gallery[0]);
    }

    try {
      if (isEdit) {
        await editGallery(id, formData);
        toast.success("Gallery has been updated");
      } else {
        await postGallery(formData);
        toast.success("Gallery has been created");
      }
      navigate("/admin/gallery", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (galleryDetail) {
      form.reset({
        ...galleryDetail,
        category: galleryDetail.category || "",
      });
      setImgUrl(galleryDetail.url);
    }
  }, [galleryDetail, form]);

  useEffect(() => {
    if (fileWatcher?.length > 0) {
      setImgUrl(URL.createObjectURL(fileWatcher[0]));
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Gallery" : "Tambah Gallery"}
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

          <CustomFormField control={form.control} name="category" label="Category">
            {( field ) => {
              console.log("Status Field Category:", field);
              return (
              <Select 
                onValueChange={field?.onChange} 
                defaultValue={field?.value}
                value={field?.value}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}}
          </CustomFormField>

          <CustomFormField control={form.control} name="gallery" label="Image">
            {() => (
              <>
                {imgUrl && (
                  <div className="flex w-full justify-center">
                    <img src={imgUrl} className="max-h-72" alt="Preview" />
                  </div>
                )}

                <Input
                  {...form.register("gallery")}
                  id="gallery"
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
              variant="secondary"
              onClick={() => navigate("/admin/gallery", { replace: true })}
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
