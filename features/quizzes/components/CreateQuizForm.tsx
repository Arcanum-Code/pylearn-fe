"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { quizSchema, QuizFormData } from "../schemas/quizSchema";
import { useCreateQuiz } from "../hooks/useQuizzes";
import { Loader2 } from "lucide-react";

interface CreateQuizFormProps {
  materialId: string;
  onSuccess?: () => void; // Prop added to dynamically handle dialog closing
}

export default function CreateQuizForm({
  materialId,
  onSuccess,
}: CreateQuizFormProps) {
  // Injecting materialId into useCreateQuiz context for accurate query cache invalidation on success
  const { mutate: createQuiz, isPending: isSubmitting } =
    useCreateQuiz(materialId);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      materialId: materialId,
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      isPublished: true, // Remains true in form background state
    },
  });

  const onSubmit = (data: QuizFormData) => {
    const formattedPayload = {
      ...data,
      isPublished: true, // Hardcoded fallback assurance for data transmission
      startTime: data.startTime ? new Date(data.startTime).toISOString() : "",
      endTime: data.endTime ? new Date(data.endTime).toISOString() : "",
    };

    createQuiz(formattedPayload, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess(); // Triggers the state update to close modal in dashboard view
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Kolom Judul */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Kuis</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan judul kuis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kolom Deskripsi */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan deskripsi kuis (opsional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Matriks Pengaturan Waktu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Waktu Mulai */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Mulai</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Waktu Selesai */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Selesai</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Baris Tombol Aksi Form */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buat Kuis
          </Button>
        </div>
      </form>
    </Form>
  );
}
