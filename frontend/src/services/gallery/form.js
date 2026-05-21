import { z } from "zod";

// Define the schema
export const gallerySchema = (isEdit) =>
  z.object({
    description: z.string(),
    category: z.string().min(1, "Kategori harus dipilih"),
    gallery: isEdit
      ? z.any().optional() // Optional when editing
      : z
          .any()
          .refine((file) => file?.length > 0, { message: "Image is required" }), // Required when creating
  });
