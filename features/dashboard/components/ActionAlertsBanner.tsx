"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchLecturerGroups } from "../hooks/useLecturerDashboard";

export function ActionAlertsBanner() {
  const { data: groups } = useFetchLecturerGroups();
  const firstGroup = groups?.[0];
  const targetLink = firstGroup ? `/groups/${firstGroup.id}` : "/groups";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white mt-0.5 sm:mt-0">
          <AlertCircle className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-rose-950">
            🚨 3 siswa gagal melewati kuis Python Dasar Level 2.
          </p>
          <p className="text-xs text-rose-700/80 mt-0.5 font-mono">
            Mereka memerlukan bantuan langsung atau materi remedial tambahan.
          </p>
        </div>
      </div>
      <Link href={targetLink} className="w-full sm:w-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-full sm:w-auto text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-100/50 rounded-xl"
        >
          Lihat Detail
          <ArrowRight className="ml-1 w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  );
}
