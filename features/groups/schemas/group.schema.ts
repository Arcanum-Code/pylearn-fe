import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, "Nama kelas diperlukan"),
  description: z.string().optional().nullable(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
