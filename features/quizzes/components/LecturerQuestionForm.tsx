"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateLecturerQuestion,
  useUpdateLecturerQuestion,
  useReplaceLecturerBlanks,
} from "../hooks/useLecturerQuizzes";
import {
  LecturerQuestionFormData,
  lecturerQuestionSchema,
} from "../schemas/lecturerQuizSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2, HelpCircle } from "lucide-react";
import { LecturerQuizQuestion, LecturerQuizBlank } from "../types/lecturer-quiz";

interface LecturerQuestionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  quizId: string;
  mode: "create" | "edit";
  questionId?: string;
  initialData?: {
    question_text: string;
    key_answer_text: string;
    sequence_order: number;
  };
  questions?: LecturerQuizQuestion[];
}

interface Token {
  text: string;
  start: number;
  end: number;
  isSpace: boolean;
}

export function LecturerQuestionForm({
  isOpen,
  onOpenChange,
  quizId,
  mode,
  questionId,
  initialData,
  questions = [],
}: LecturerQuestionFormProps) {
  const { mutateAsync: createQuestion } = useCreateLecturerQuestion(quizId);
  const { mutateAsync: updateQuestion } = useUpdateLecturerQuestion(quizId);
  const { mutateAsync: replaceBlanks } = useReplaceLecturerBlanks(quizId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBlanks, setSelectedBlanks] = useState<Omit<LecturerQuizBlank, "blank_id">[]>([]);

  const form = useForm<LecturerQuestionFormData>({
    resolver: zodResolver(lecturerQuestionSchema) as any,
    defaultValues: {
      question_text: initialData?.question_text || "",
      key_answer_text: initialData?.key_answer_text || "",
      sequence_order: initialData?.sequence_order || questions.length + 1,
    },
  });

  const watchKeyAnswerText = form.watch("key_answer_text");

  // Load existing blanks if in edit mode
  useEffect(() => {
    if (mode === "edit" && questionId) {
      const currentQuestion = questions.find((q) => q.question_id === questionId);
      if (currentQuestion && currentQuestion.blanks) {
        setSelectedBlanks(
          currentQuestion.blanks.map((b) => ({
            keyword: b.keyword,
            start_index: b.start_index,
            end_index: b.end_index,
          }))
        );
      }
    }
  }, [mode, questionId, questions]);

  // Reset selected blanks if the key answer text changes (unless it matches the initial data key answer text)
  useEffect(() => {
    if (watchKeyAnswerText !== initialData?.key_answer_text) {
      setSelectedBlanks([]);
    } else if (mode === "edit" && questionId) {
      const currentQuestion = questions.find((q) => q.question_id === questionId);
      if (currentQuestion && currentQuestion.blanks) {
        setSelectedBlanks(
          currentQuestion.blanks.map((b) => ({
            keyword: b.keyword,
            start_index: b.start_index,
            end_index: b.end_index,
          }))
        );
      }
    }
  }, [watchKeyAnswerText]);

  // Tokenize the answer text for clickable blanks
  const tokens: Token[] = [];
  if (watchKeyAnswerText) {
    const rawTokens = watchKeyAnswerText.split(/(\s+)/);
    let currentIndex = 0;
    rawTokens.forEach((token) => {
      const start = currentIndex;
      const end = currentIndex + token.length;
      currentIndex = end;
      tokens.push({
        text: token,
        start,
        end,
        isSpace: /^\s+$/.test(token),
      });
    });
  }

  const handleTokenClick = (token: Token) => {
    if (token.isSpace) return;

    // Check if this token is already selected as a blank
    const existsIndex = selectedBlanks.findIndex(
      (b) => b.start_index === token.start && b.end_index === token.end
    );

    if (existsIndex > -1) {
      // Remove it
      setSelectedBlanks((prev) => prev.filter((_, idx) => idx !== existsIndex));
    } else {
      // Add it
      setSelectedBlanks((prev) => [
        ...prev,
        {
          keyword: token.text,
          start_index: token.start,
          end_index: token.end,
        },
      ]);
    }
  };

  const isTokenSelected = (token: Token) => {
    return selectedBlanks.some(
      (b) => b.start_index === token.start && b.end_index === token.end
    );
  };

  const onSubmit = async (data: LecturerQuestionFormData) => {
    setIsSubmitting(true);
    try {
      let targetQuestionId = questionId;

      if (mode === "create") {
        const res = await createQuestion(data);
        // Safely extract the created question's ID from multiple possible response formats
        targetQuestionId =
          res.data?.question_id ||
          res.data?.id ||
          res.data?.question?.id ||
          res.data?.question?.question_id;
      } else if (mode === "edit" && questionId) {
        await updateQuestion({ questionId, data });
      }

      if (targetQuestionId) {
        // Save the blanks
        await replaceBlanks({
          questionId: targetQuestionId,
          data: { blanks: selectedBlanks },
        });
      }

      onOpenChange(false);
      form.reset();
      setSelectedBlanks([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Pertanyaan Baru" : "Edit Pertanyaan"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="question_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pertanyaan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan pertanyaan. Contoh: Fungsi print() digunakan untuk apa?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key_answer_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kunci Jawaban Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan teks jawaban lengkap tanpa sensor. Contoh: Untuk menampilkan output ke layar"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ketik teks jawaban yang benar secara utuh terlebih dahulu.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchKeyAnswerText && (
              <div className="space-y-2 border p-4 rounded-lg bg-gray-50/50">
                <FormLabel className="text-[#1A1C1E] flex items-center gap-1.5 font-semibold">
                  Pilih Kata untuk Dijadikan Blanko (Fill in the Blank)
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                </FormLabel>
                <div className="flex flex-wrap gap-y-2 font-mono text-sm bg-white p-3 rounded-md border leading-relaxed">
                  {tokens.map((token, index) => {
                    if (token.isSpace) {
                      return <span key={index} className="whitespace-pre">{token.text}</span>;
                    }
                    const selected = isTokenSelected(token);
                    return (
                      <span
                        key={index}
                        onClick={() => handleTokenClick(token)}
                        className={`cursor-pointer px-1 rounded transition-colors select-none ${
                          selected
                            ? "bg-[#10B981] text-white font-bold"
                            : "hover:bg-gray-150 border border-transparent hover:border-gray-300"
                        }`}
                      >
                        {token.text}
                      </span>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-500 font-mono">
                  Klik pada kata-kata di atas. Kata yang disorot hijau akan dihilangkan dan menjadi input kosong bagi siswa.
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="sequence_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urutan Soal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Order"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
