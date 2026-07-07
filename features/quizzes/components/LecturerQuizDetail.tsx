"use client";

import { useLecturerQuizDetail, usePublishLecturerQuiz, useDeleteLecturerQuiz } from "../hooks/useLecturerQuizzes";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Trash2, CheckCircle2, AlertCircle, Plus, Edit3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LecturerQuestionForm } from "./LecturerQuestionForm";
import { useConfirm } from "@/hooks/use-confirm";

interface LecturerQuizDetailProps {
  groupId: string;
  quizId: string;
}

export function LecturerQuizDetail({ groupId, quizId }: LecturerQuizDetailProps) {
  const router = useRouter();
  const { data: quiz, isLoading } = useLecturerQuizDetail(quizId);
  const { mutate: publishQuiz, isPending: isPublishing } = usePublishLecturerQuiz(groupId, quizId);
  const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteLecturerQuiz(groupId);
  const { confirm } = useConfirm();

  const [questionModal, setQuestionModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    questionId?: string;
    initialData?: {
      question_text: string;
      key_answer_text: string;
      sequence_order: number;
    };
  }>({ isOpen: false, mode: "create" });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F7F8FA]">
        <Spinner className="w-10 h-10 text-[#6366F1]" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 text-center font-mono bg-[#F7F8FA] min-h-screen">
        Kuis tidak ditemukan
      </div>
    );
  }

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Hapus Kuis?",
      description: "Apakah Anda yakin ingin menghapus kuis ini? Semua data pertanyaan di dalamnya akan hilang.",
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "destructive",
    });

    if (isConfirmed) {
      deleteQuiz(quizId, {
        onSuccess: () => {
          router.push(`/groups/${groupId}`);
        },
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
      <Link
        href={`/groups/${groupId}`}
        className="inline-flex items-center text-[#6366F1] font-mono text-sm hover:underline mb-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Kelas
      </Link>

      <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl shadow-lg border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-white">{quiz.title}</h1>
            <span
              className={`font-mono text-xs px-2.5 py-1 rounded-full font-semibold tracking-wider ${
                quiz.status === "published"
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                  : "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
              }`}
            >
              {quiz.status.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400">
            <div>
              <span className="text-gray-500">Group ID:</span> {quiz.group_id}
            </div>
            <div>
              <span className="text-gray-500">Level:</span> {quiz.level}
            </div>
            <div>
              <span className="text-gray-500">Kriteria Kelulusan:</span> {quiz.pass_threshold}%
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {quiz.status === "draft" && (
            <div
              title={
                quiz.can_publish === false
                  ? "Grup ini belum memiliki materi yang dipublikasikan, sehingga kuis ini tidak dapat dikunci."
                  : ""
              }
            >
              <Button
                onClick={() => publishQuiz()}
                disabled={isPublishing || quiz.can_publish === false}
                className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold"
              >
                {isPublishing ? "Publishing..." : "Publish Kuis"}
              </Button>
            </div>
          )}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="font-semibold"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Hapus Kuis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Questions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1C1E] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                Daftar Pertanyaan ({quiz.questions?.length || 0})
              </h2>
              <Button
                onClick={() =>
                  setQuestionModal({
                    isOpen: true,
                    mode: "create",
                    initialData: {
                      question_text: "",
                      key_answer_text: "",
                      sequence_order: (quiz.questions?.length || 0) + 1,
                    },
                  })
                }
                size="sm"
                className="bg-[#6366F1] hover:bg-[#6366F1]/90"
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Soal
              </Button>
            </div>

            <div className="space-y-4">
              {!quiz.questions || quiz.questions.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl border-gray-200">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-mono text-sm">Belum ada pertanyaan pada kuis ini.</p>
                </div>
              ) : (
                quiz.questions.map((q) => (
                  <div key={q.question_id} className="p-5 rounded-xl bg-[#F7F8FA] border border-gray-150/40 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-[#6366F1] font-semibold">Soal {q.sequence_order}</span>
                        <p className="text-sm font-medium text-[#1A1C1E]">{q.question_text}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#6366F1]"
                          onClick={() =>
                            setQuestionModal({
                              isOpen: true,
                              mode: "edit",
                              questionId: q.question_id,
                              initialData: {
                                question_text: q.question_text,
                                key_answer_text: q.key_answer_text,
                                sequence_order: q.sequence_order,
                              },
                            })
                          }
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-2">
                      <span className="font-semibold text-gray-500 block">Kunci Jawaban &amp; Blanko:</span>
                      <p className="font-mono bg-gray-50 p-2 rounded text-gray-800 whitespace-pre-wrap">
                        {q.key_answer_text}
                      </p>
                      {q.blanks && q.blanks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {q.blanks.map((b) => (
                            <span
                              key={b.blank_id}
                              className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-mono text-[10px] font-semibold border border-[#10B981]/20"
                            >
                              {b.keyword} ({b.start_index}-{b.end_index})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Gating Materials / Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60">
            <h2 className="text-lg font-bold text-[#1A1C1E] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#6366F1]" />
              Materi Prasyarat
            </h2>
            <div className="space-y-3">
              {!quiz.gating_materials || quiz.gating_materials.length === 0 ? (
                <p className="text-xs text-gray-400 font-mono">Tidak ada materi prasyarat untuk kuis ini.</p>
              ) : (
                quiz.gating_materials.map((m) => (
                  <div key={m.material_id} className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg text-xs">
                    <span className="font-semibold">{m.title}</span>
                    <span className="font-mono text-gray-500">Seq: {m.sequence}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {questionModal.isOpen && (
        <LecturerQuestionForm
          isOpen={questionModal.isOpen}
          onOpenChange={(open) => !open && setQuestionModal({ isOpen: false, mode: "create" })}
          groupId={groupId}
          quizId={quizId}
          mode={questionModal.mode}
          questionId={questionModal.questionId}
          initialData={questionModal.initialData}
          questions={quiz.questions}
        />
      )}
    </div>
  );
}
