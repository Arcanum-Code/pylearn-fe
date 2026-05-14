"use client";

import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useFetchQuizQuestions,
  useCreateQuizQuestion,
  useDeleteQuizQuestion,
} from "../hooks/useQuizQuestions";

import {
  quizQuestionSchema,
  QuizQuestionFormData,
} from "../schemas/quizSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Plus,
  Trash2,
  HelpCircle,
  Loader2,
  X,
  Check,
  MessageSquareQuote,
  KeyRound,
  Star,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const RichTextEditor = dynamic(
  () => import("@/features/materials").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] rounded-md border bg-muted animate-pulse" />
    ),
  },
);

interface QuizLevelSectionProps {
  levelId: string;
  levelTitle: string;
  levelOrder: number;
  materialId: string;
}

export default function QuizLevelSection({
  levelId,
  levelTitle,
  levelOrder,
  materialId,
}: QuizLevelSectionProps) {
  const { data: questions, isLoading } = useFetchQuizQuestions(levelId);

  const { mutate: createQuestion, isPending: isCreating } =
    useCreateQuizQuestion(levelId, materialId);

  const { mutate: deleteQuestion, isPending: isDeleting } =
    useDeleteQuizQuestion(levelId, materialId);

  const totalQuestions = questions?.length ?? 0;

  const form = useForm<QuizQuestionFormData>({
    resolver: zodResolver(quizQuestionSchema),
    defaultValues: {
      quizLevelId: levelId,
      questionText: "",
      answerText: "",
      maxScore: 100,
      questionOrder: 1,
    },
  });

  const handleOpenForm = () => {
    form.reset({
      quizLevelId: levelId,
      questionText: "",
      answerText: "",
      maxScore: 100,
      questionOrder: totalQuestions + 1,
    });
    setIsFormOpen(true);
  };

  const [isFormOpen, setIsFormOpen] = useState(false);

  const onSubmit = (data: QuizQuestionFormData) => {
    createQuestion(data, {
      onSuccess: () => {
        setIsFormOpen(false);
        form.reset({
          quizLevelId: levelId,
          questionText: "",
          answerText: "",
          maxScore: 100,
          questionOrder: totalQuestions + 1,
        });
      },
    });
  };

  return (
    <div className="mb-6 rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-muted/30 border-b border-border/60">
        <div className="flex items-center gap-3">
          {/* Level badge */}
          <div className="h-9 w-9 rounded-lg bg-emerald-600 text-emerald-50 flex items-center justify-center font-mono font-semibold text-xs flex-shrink-0">
            L{levelOrder}
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground leading-tight">
              {levelTitle}
            </h3>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
              {totalQuestions} soal terdaftar
            </p>
          </div>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenForm}
            disabled={isLoading || isCreating || isDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-background hover:bg-muted/60 text-sm font-medium text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-600" />
            Tambah pertanyaan
          </button>
        )}
      </div>

      {/* FORM */}
      {isFormOpen && (
        <div className="p-5 border-b border-border/60 bg-background">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Form header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-semibold font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Soal #{totalQuestions + 1}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Draft pertanyaan baru
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Question field */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <MessageSquareQuote className="h-3.5 w-3.5" />
                  Deskripsi soal
                </div>

                <Controller
                  name="questionText"
                  control={form.control}
                  render={({ field }) => (
                    <div className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden">
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Tuliskan pertanyaan esai secara detail..."
                        disabled={isCreating}
                      />
                    </div>
                  )}
                />

                {form.formState.errors.questionText && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.questionText.message}
                  </p>
                )}
              </div>

              {/* Answer field */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  <KeyRound className="h-3.5 w-3.5" />
                  Kunci jawaban instruktur
                </div>

                <Controller
                  name="answerText"
                  control={form.control}
                  render={({ field }) => (
                    <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-muted/20 overflow-hidden">
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Tuliskan poin-poin ekspektasi jawaban benar..."
                        disabled={isCreating}
                      />
                    </div>
                  )}
                />

                {form.formState.errors.answerText && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.answerText.message}
                  </p>
                )}
              </div>

              {/* Score field */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Skor maks
                </span>
                <FormField
                  control={form.control}
                  name="maxScore"
                  render={({ field }) => (
                    <FormItem className="mb-0">
                      <FormControl>
                        <Input
                          type="number"
                          className="w-24 text-center font-mono font-semibold text-sm bg-muted/30 border-border/60"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isCreating}
                  className="px-4 py-1.5 rounded-lg border border-border/70 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4"
                >
                  {isCreating ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {isCreating ? "Menyimpan..." : "Simpan soal"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* QUESTION LIST */}
      <div className="flex flex-col divide-y divide-border/50 bg-background">
        {isLoading ? (
          <div className="p-5 space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="group flex items-start gap-3 px-5 py-4 hover:bg-muted/20 transition-colors"
            >
              {/* Ordinal number */}
              <div className="h-7 w-7 rounded-md border border-border/60 bg-muted/40 flex items-center justify-center font-mono text-[11px] font-semibold text-muted-foreground flex-shrink-0 mt-0.5">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  <MessageCircle className="h-3 w-3" />
                  Soal
                </div>

                <div
                  className="prose prose-sm max-w-none text-sm text-foreground/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: question.questionText }}
                />

                {question.answerText && (
                  <div className="mt-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 px-3 py-2.5">
                    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1.5">
                      <KeyRound className="h-3 w-3" />
                      Kunci jawaban
                    </div>
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground prose-p:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: question.answerText }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Star className="h-2.5 w-2.5" />
                    {question.maxScore ?? 100} poin
                  </span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => deleteQuestion(question.id)}
                disabled={isDeleting}
                className="h-7 w-7 rounded-md border border-transparent flex items-center justify-center text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:border-red-200 hover:text-red-500 hover:bg-red-50 dark:hover:border-red-900 dark:hover:bg-red-950/40 transition-all disabled:opacity-30 flex-shrink-0"
                aria-label="Hapus soal"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        ) : (
          !isFormOpen && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="h-11 w-11 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-center mb-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Belum ada soal
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Klik tombol di atas untuk menambahkan pertanyaan pertama.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
