import { z } from "zod";

export const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  materialId: z.string().min(1, "Material selection is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  isPublished: z.boolean().default(true),
});

export const quizLevelSchema = z.object({
  quizId: z.string().min(1, "Quiz ID relation is required"),
  title: z.string().min(1, "Level title is required"),
  levelOrder: z.number().int().min(1),
});

export const quizQuestionSchema = z.object({
  quizLevelId: z.string().min(1, "Quiz Level ID relation is required"),
  questionText: z.string().min(1, "Pertanyaan wajib diisi"),
  answerText: z.string().min(1, "Kunci jawaban wajib diisi"),
  maxScore: z.number().int().min(1, "Skor minimal adalah 1").default(100),
  questionOrder: z.number().int().min(1),
});

export const quizAttemptSchema = z.object({
  quizLevelId: z
    .string()
    .min(1, "Quiz Level ID wajib diisi untuk memulai percobaan tingkat kuis"),
});

export const quizAnswerSchema = z.object({
  quizAttemptId: z.string().min(1, "Quiz Attempt ID wajib disertakan"),
  quizQuestionId: z.string().min(1, "Quiz Question ID wajib disertakan"),
  answerText: z.string().min(1, "Jawaban esai tidak boleh kosong"),
});

export const quizQuestionAttemptSchema = z.object({
  quizLevelId: z.string().min(1, "Quiz Level ID relation is required"),
  questionText: z.string().min(1, "Pertanyaan wajib diisi"),
  maxScore: z.number().int().min(1),
  questionOrder: z.number().int().min(1),
});

export const quizSingleAnswerSchema = z.object({
  quizQuestionId: z.string().min(1, "Quiz Question ID wajib disertakan"),
  answerText: z.string().min(1, "Jawaban tidak boleh kosong"),
});

export const quizBulkAnswersSchema = z.object({
  quizAttemptId: z.string().min(1, "Quiz Attempt ID wajib disertakan"),
  quizId: z.string().min(1, "Quiz ID wajib disertakan"),
  quizLevelId: z.string().min(1, "Quiz Level ID relation is required"),
  answers: z
    .array(quizSingleAnswerSchema)
    .min(1, "Minimal harus ada satu jawaban yang dikirim"),
});

export const myQuizStatusQuerySchema = z.object({
  quizId: z
    .string()
    .min(1, "Quiz ID wajib disertakan dalam parameter pencarian"),
});

export const quizResultParamSchema = z.object({
  attemptId: z.string().min(1, "Attempt ID parameter is required"),
});

export const quizResultsFilterSchema = z.object({
  quizLevelId: z.string().optional(),
  studentId: z.string().optional(),
});

export type QuizLevelFormData = z.infer<typeof quizLevelSchema>;
export type QuizFormData = z.infer<typeof quizSchema>;
export type QuizQuestionFormData = z.infer<typeof quizQuestionSchema>;
export type QuizAttemptFormData = z.infer<typeof quizAttemptSchema>;
export type QuizAnswerFormData = z.infer<typeof quizAnswerSchema>;
export type QuizSingleAnswerFormData = z.infer<typeof quizSingleAnswerSchema>;
export type QuizBulkAnswersFormData = z.infer<typeof quizBulkAnswersSchema>;
export type MyQuizStatusQueryFormData = z.infer<typeof myQuizStatusQuerySchema>;
export type QuizResultParamData = z.infer<typeof quizResultParamSchema>;
export type QuizResultsFilterFormData = z.infer<typeof quizResultsFilterSchema>;
