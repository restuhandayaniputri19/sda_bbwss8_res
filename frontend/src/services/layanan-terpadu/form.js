import { z } from "zod";

// Define the schema
export const layananTerpaduSchema = () =>
  z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" }),
    platform: z.enum(["internal", "external", "android", "ios", "deeplink", "download"], {
      errorMap: () => ({ message: "Platform selection is required" }),
    }),
    url: z.string().min(1, { message: "url is required" }),
    description: z.string(),
    isVisible: z.boolean().default(true),
    isClickable: z.boolean().default(true),
    displayOrder: z.coerce.number().int().min(0, { message: "Urutan harus 0 atau lebih" }),
    imgIcon: z.string().optional(),
    img: z.any().optional(),
  });
