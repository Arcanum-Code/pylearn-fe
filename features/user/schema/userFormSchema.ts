import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  roleId: z.string().min(1, "Please select a role"),
  status: z.enum(["active", "inactive"]),
  userId: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;
