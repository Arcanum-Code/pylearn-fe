"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLecturerQuiz } from "../hooks/useLecturerQuizzes";
import { CreateLecturerQuizFormData, createLecturerQuizSchema } from "../schemas/lecturerQuizSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Loader2 } from "lucide-react";

interface CreateLecturerQuizDialogProps {
  groupId: string;
}

export function CreateLecturerQuizDialog({ groupId }: CreateLecturerQuizDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createQuiz, isPending: isSubmitting } = useCreateLecturerQuiz(groupId);

  const form = useForm<CreateLecturerQuizFormData>({
    resolver: zodResolver(createLecturerQuizSchema) as any,
    defaultValues: {
      level: 1,
      title: "",
      pass_threshold: 70,
    },
  });

  const onSubmit = (data: CreateLecturerQuizFormData) => {
    createQuiz(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed border-[#10B981] text-[#10B981] hover:bg-[#10B981]/5 hover:text-[#10B981]">
          <Plus className="w-4 h-4 mr-2" /> Tambah Kuis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Kuis Baru</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Level"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pass_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kriteria Kelulusan (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="70"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buat
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
