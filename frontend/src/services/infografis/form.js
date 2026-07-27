import { z } from "zod";

// Define the schema
export const infografisSchema = (isEdit) =>
  z.object({
    description: z.string(),
    category: z.string().min(1, "Category is required"),
    infografis: isEdit
      ? z.any().optional() // Optional when editing
      : z
          .any()
          .refine((file) => file?.length > 0, { message: "Image is required" }), // Required when creating
  });
