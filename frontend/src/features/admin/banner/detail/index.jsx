import { CustomFormField, Form } from "../../../../components/form";
import { useEffect, useState } from "react";

import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { bannerSchema } from "../../../../services/banner/form";
import { postBanner } from "../../../../services/banner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

const DetailPage = () => {
  const navigate = useNavigate();

  const [imgUrl, setImgUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      banners: "",
    },
    mode: "onChange",
  });

  const fileWatcher = form.watch("banners");

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Only append the file if it exists
      if (data.banners && data.banners.length > 0) {
        formData.append("banners", data.banners[0]);
      }
      await postBanner(formData); // Pass FormData to post function
      toast.success("Banner has been created");

      navigate("/admin/banner", { replace: true });
    } catch (error) {
      toast.error("Failed to submit form");
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (fileWatcher?.length > 0) {
      setImgUrl(URL.createObjectURL(fileWatcher?.[0]));
    }
  }, [fileWatcher]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Tambah Banner</h1>

      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <CustomFormField control={form.control} name="banners" label="Banner">
            {() => (
              <>
                {imgUrl && (
                  <div className="flex w-full justify-center ">
                    <img src={imgUrl} className=" max-h-72" />
                  </div>
                )}

                <Input
                  {...form.register("banners")}
                  id="banners"
                  type="file"
                  variant="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                />
                <span className="text-xs text-gray-500 mt-1">
                  <br /> Disarankan ukuran file 200KB - 500KB. Maksimal: 2MB. Lebar/Panjang maksimal 1290 pixel, tingginya sesuaikan secara proporsional, Format yang didukung: WebP, JPEG, PNG, GIF.
                </span>
              </>
            )}
          </CustomFormField>

          <div className="flex flex-row gap-5 mt-4 justify-end">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/banner", { replace: true })}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? `Submitting` : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DetailPage;
