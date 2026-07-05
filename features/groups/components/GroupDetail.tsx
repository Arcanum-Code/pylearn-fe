"use client";

import { useGroup } from "../hooks/useGroups";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, GraduationCap } from "lucide-react";

export function GroupDetail({ id }: { id: string }) {
  const { data: group, isLoading } = useGroup(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-24 bg-[#F7F8FA] min-h-screen">
        <Spinner className="w-10 h-10 text-[#6366F1]" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-8 text-center font-mono bg-[#F7F8FA] min-h-screen">
        Kelas tidak ditemukan
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
      <Link
        href="/groups"
        className="inline-flex items-center text-[#6366F1] font-mono text-sm hover:underline mb-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Kelas
      </Link>

      {/* Dark Editor Accent Tile for Header */}
      <div className="bg-[#1E1E2E] text-white p-8 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden">
        <div className="absolute right-8 top-8 opacity-5 text-gray-400">
          <GraduationCap className="w-36 h-36" />
        </div>
        <div className="relative z-10 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {group.name}
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/40 border border-gray-800 font-mono text-xs text-[#10B981]">
            <span>uuid:</span>
            <span>{group.id}</span>
          </div>
          <p className="text-gray-300 max-w-3xl leading-relaxed text-sm">
            {group.description || "Tidak ada deskripsi untuk kelas ini."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Materials Bento Tile */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#6366F1]/10 text-[#6366F1] rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A1C1E]">Materi Pembelajaran</h2>
                <p className="text-xs text-gray-500 mt-0.5">Daftar materi yang ditugaskan ke kelas ini.</p>
              </div>
            </div>
            <div className="space-y-3">
              {group.materials?.length === 0 && (
                <p className="text-gray-400 font-mono text-sm py-4">
                  Belum ada materi untuk kelas ini.
                </p>
              )}
              {group.materials?.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/40"
                >
                  <span className="font-semibold text-sm text-[#1A1C1E]">{m.title}</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider ${
                      m.isPublished
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "bg-[#F59E0B]/10 text-[#F59E0B]"
                    }`}
                  >
                    {m.isPublished ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quizzes Bento Tile */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#10B981]/10 text-[#10B981] rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A1C1E]">Kuis Kelas</h2>
                <p className="text-xs text-gray-500 mt-0.5">Daftar latihan kuis yang ditugaskan ke kelas ini.</p>
              </div>
            </div>
            <div className="space-y-3">
              {group.quizzes?.length === 0 && (
                <p className="text-gray-400 font-mono text-sm py-4">
                  Belum ada kuis untuk kelas ini.
                </p>
              )}
              {group.quizzes?.map((q) => (
                <div
                  key={q.id}
                  className="flex justify-between items-center p-4 rounded-xl bg-[#F7F8FA] border border-gray-150/40"
                >
                  <div>
                    <span className="font-semibold text-sm text-[#1A1C1E] block">{q.title}</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Level: {q.levelNumber}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider ${
                      q.isPublished
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "bg-[#EF4444]/10 text-[#EF4444]"
                    }`}
                  >
                    {q.isPublished ? "ACTIVE" : "OFFLINE"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
