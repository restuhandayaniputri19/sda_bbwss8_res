import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 6 characters" }),
});
