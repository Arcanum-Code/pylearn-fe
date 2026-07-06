import { z } from "zod";

export const createLecturerQuizSchema = z.object({
  level: z.number({ required_error: "Level wajib diisi" }).int().min(1, "Level minimal 1"),
  title: z.string({ required_error: "Judul wajib diisi" }).min(1, "Judul kuis wajib diisi"),
  pass_threshold: z.number().int().min(0, "Threshold minimal 0").max(100, "Threshold maksimal 100").default(70),
});

export type CreateLecturerQuizFormData = z.infer<typeof createLecturerQuizSchema>;

export const updateLecturerQuizSchema = createLecturerQuizSchema.partial();
export type UpdateLecturerQuizFormData = z.infer<typeof updateLecturerQuizSchema>;

export const lecturerQuestionSchema = z.object({
  question_text: z.string({ required_error: "Pertanyaan wajib diisi" }).min(1, "Pertanyaan wajib diisi"),
  key_answer_text: z.string({ required_error: "Kunci jawaban wajib diisi" }).min(1, "Kunci jawaban wajib diisi"),
  sequence_order: z.number().int().min(1),
});

export type LecturerQuestionFormData = z.infer<typeof lecturerQuestionSchema>;

export const lecturerBlankSchema = z.object({
  keyword: z.string().min(1),
  start_index: z.number().int().min(0),
  end_index: z.number().int().min(1),
});

export const replaceBlanksSchema = z.object({
  blanks: z.array(lecturerBlankSchema),
});

export type ReplaceBlanksFormData = z.infer<typeof replaceBlanksSchema>;
