import { z } from "zod";

// Define the schema
export const kesiapsiagaanBencanaSchema = (isEdit) =>
  z.object({
    description: z.string(),
    releaseDate: z.string().min(1, "Release date is required"),
    infografis: isEdit
      ? z.any().optional() // Optional when editing
      : z
          .any()
          .refine((file) => file?.length > 0, { message: "Image is required" }), // Required when creating
  });
