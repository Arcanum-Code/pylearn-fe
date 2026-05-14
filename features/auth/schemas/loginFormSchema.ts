import { z } from "zod";

export const loginFormSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
