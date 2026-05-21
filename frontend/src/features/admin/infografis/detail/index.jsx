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


const categories = ["Bendungan", "Irigasi & Rawa", "Sungai", "Danau", "Embung", "Air Tanah & Air Baku"];

import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem, 
  SelectContent, 
} from "../../../../components/select/based";

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
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("infografis");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("description", data.description);

    // Only append the file if it exists
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
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (infografisDetail) {
      form.reset(infografisDetail);
      setImgUrl(infografisDetail.url);
    }
  }, [infografisDetail, form]);

  useEffect(() => {
    if (fileWatcher?.length > 0) {
      setImgUrl(URL.createObjectURL(fileWatcher[0]));
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Berita" : "Tambah Berita"}
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

          <CustomFormField
            control={form.control}
            name="infografis"
            label="Image"
          >
            {() => (
              <>
                {imgUrl && (
                  <div className="flex w-full justify-center">
                    <img src={imgUrl} className="max-h-72" alt="Preview" />
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
