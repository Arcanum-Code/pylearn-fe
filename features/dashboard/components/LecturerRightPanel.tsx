"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FileText,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFetchCalendarEvents, useFetchRecentActivity } from "../hooks/useLecturerDashboard";

interface LecturerRightPanelProps {
  groupId?: string;
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getDotColor(type: string): string {
  switch (type) {
    case "quiz_close":
      return "bg-red-500";
    case "quiz_open":
      return "bg-blue-500";
    case "material_release":
      return "bg-emerald-500";
    default:
      return "bg-neutral-500";
  }
}

export function LecturerRightPanel({ groupId }: LecturerRightPanelProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 9)); // Default to July 9, 2026
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-09");

  useEffect(() => {
    const today = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentDate(today);
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    setSelectedDate(`${y}-${m}-${d}`);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-indexed for the API

  const { data: calendarEvents = [], isLoading: isEventsLoading } = useFetchCalendarEvents(
    year,
    month,
    groupId
  );

  const { data: recentActivities = [], isLoading: isActivityLoading } = useFetchRecentActivity(
    10,
    groupId
  );

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  // Helper to format Date as YYYY-MM-DD
  const formatDateString = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Calculate calendar days
  const getDays = () => {
    const days: (Date | null)[] = [];
    const firstDay = new Date(year, currentDate.getMonth(), 1);
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday

    // Padding for first week
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    const lastDay = new Date(year, currentDate.getMonth() + 1, 0);
    const numDays = lastDay.getDate();

    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, currentDate.getMonth(), i));
    }

    return days;
  };

  const calendarDays = getDays();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const selectedDateEvents = calendarEvents.filter((e) => e.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-gray-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-neutral-800 font-bold">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <span>
              {monthNames[currentDate.getMonth()]} {year}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400 mb-2 font-mono">
          <span>Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Calendar Grid */}
        {isEventsLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner className="h-6 w-6 text-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-9" />;

              const dateStr = formatDateString(day);
              const isSelected = dateStr === selectedDate;
              const dateEvents = calendarEvents.filter((e) => e.date === dateStr);
              const hasEvents = dateEvents.length > 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-9 w-full flex flex-col items-center justify-between py-1 rounded-xl text-xs font-semibold font-mono relative transition-colors focus:outline-none ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span>{day.getDate()}</span>
                  {/* Micro dots */}
                  <div className="flex gap-0.5 justify-center h-1.5 w-full">
                    {hasEvents &&
                      dateEvents.slice(0, 3).map((e, eIdx) => (
                        <span
                          key={eIdx}
                          className={`h-1 w-1 rounded-full ${
                            isSelected ? "bg-white" : getDotColor(e.type)
                          }`}
                        />
                      ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Agenda Section */}
      <div className="bg-white rounded-2xl border border-gray-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-5">
        <h4 className="text-sm font-bold text-neutral-800 mb-3 flex items-center justify-between">
          <span>Agenda Kelas</span>
          <span className="text-xs font-semibold text-neutral-400 font-mono">
            {selectedDate.split("-").reverse().join("/")}
          </span>
        </h4>

        {isEventsLoading ? (
          <div className="flex h-16 items-center justify-center">
            <Spinner className="h-5 w-5 text-indigo-600" />
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
            {selectedDateEvents.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono py-2 text-center">
                Tidak ada agenda pada tanggal ini.
              </p>
            ) : (
              selectedDateEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-50/50 border border-neutral-100/50"
                >
                  <div className="mt-0.5">
                    {event.type === "quiz_close" && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {event.type === "quiz_open" && (
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                    )}
                    {event.type === "material_release" && (
                      <FileText className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-700 leading-normal">
                      {event.title}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                      Jam {event.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Recent Activity Widget */}
      <div className="bg-white rounded-2xl border border-gray-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-5">
        <h4 className="text-sm font-bold text-neutral-800 mb-3 flex items-center justify-between">
          <span>Aktivitas Terkini</span>
          <span className="flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200/50">
            {recentActivities.length} Terbaru
          </span>
        </h4>

        {isActivityLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Spinner className="h-6 w-6 text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono py-6 text-center">
                Belum ada aktivitas pengerjaan.
              </p>
            ) : (
              recentActivities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 hover:border-indigo-100 bg-white hover:bg-indigo-50/10 transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-700 truncate">
                      {item.studentName}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                      {item.taskName}
                    </p>
                  </div>
                  <div className="text-right ml-2 flex flex-col items-end shrink-0">
                    <span className="text-[9px] text-neutral-400 font-mono">
                      {formatRelativeTime(item.submittedAt)}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-[10px] font-bold font-mono ${item.score >= 80 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        Skor: {item.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
