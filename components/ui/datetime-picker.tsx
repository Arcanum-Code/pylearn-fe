"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "./button";

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  mode?: "popover" | "inline";
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal dan waktu...",
  disabled = false,
  mode = "popover",
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track currently viewed month/year in calendar
  const [viewDate, setViewDate] = useState(() => value ? new Date(value) : new Date());
  
  // Keep track of the previous value to sync the viewed month if it changes externally
  const [prevValue, setPrevValue] = useState<Date | null | undefined>(value);
  if (value && value.getTime() !== prevValue?.getTime()) {
    setPrevValue(value);
    setViewDate(new Date(value));
  } else if (!value && prevValue) {
    setPrevValue(null);
  }

  const selectedDate = value || null;

  // Close calendar popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && mode === "popover") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, mode]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Helper calculations for calendar grid
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayOfMonth(viewYear, viewMonth);

  // Generate date array
  const calendarCells: (Date | null)[] = [];
  
  // Add empty placeholders for offset days before the 1st of the month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  
  // Fill the month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(new Date(viewYear, viewMonth, day));
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setViewDate(prev => {
      const nextDate = new Date(prev);
      if (direction === "prev") {
        nextDate.setMonth(prev.getMonth() - 1);
      } else {
        nextDate.setMonth(prev.getMonth() + 1);
      }
      return nextDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    const newDate = new Date(date);
    if (selectedDate) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    } else {
      newDate.setHours(12);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    }
    onChange(newDate);
  };

  const handleTimeChange = (type: "hour" | "minute", val: number) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    if (type === "hour") {
      newDate.setHours(val);
    } else {
      newDate.setMinutes(val);
    }
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    
    onChange(newDate);
  };

  const formatDisplay = (date: Date | null) => {
    if (!date) return placeholder;
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date) + " WIB";
  };

  const selectedHour = selectedDate ? selectedDate.getHours() : 12;
  const selectedMinute = selectedDate ? selectedDate.getMinutes() : 0;

  const pickerPanel = (
    <div className="flex flex-col gap-3 w-full">
      {/* Selected Date & Clear Button */}
      {selectedDate && (
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-100 bg-[#6366F1]/5 animate-in fade-in duration-200">
          <span className="text-xs font-semibold text-[#6366F1] flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            Terjadwal: {formatDisplay(selectedDate)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="text-xs text-destructive hover:text-destructive/80 h-7 px-2.5 hover:bg-destructive/10 rounded-lg font-medium cursor-pointer transition-colors"
          >
            Hapus Jadwal
          </Button>
        </div>
      )}

      {/* Main Grid Calendar & Time */}
      <div 
        className={`bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col sm:flex-row gap-4 max-w-full justify-center ${
          mode === "inline" 
            ? "w-full shadow-xs" 
            : "absolute z-50 mt-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
        }`}
      >
        {/* Calendar Picker Panel */}
        <div className="w-full sm:w-[270px] shrink-0">
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm text-neutral-800">
              {months[viewMonth]} {viewYear}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-400 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="h-7 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              if (!cell) return <div key={`empty-${idx}`} className="h-8" />;
              
              const isSelected = selectedDate && 
                cell.getDate() === selectedDate.getDate() && 
                cell.getMonth() === selectedDate.getMonth() && 
                cell.getFullYear() === selectedDate.getFullYear();
                
              const isToday = (() => {
                const today = new Date();
                return cell.getDate() === today.getDate() && 
                  cell.getMonth() === today.getMonth() && 
                  cell.getFullYear() === today.getFullYear();
              })();

              return (
                <button
                  key={cell.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(cell)}
                  className={`h-8 w-8 text-xs font-medium rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#6366F1] text-white hover:bg-[#6366F1]/90"
                      : isToday
                        ? "bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/20 font-semibold"
                        : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Picker Panel */}
        <div className="border-t sm:border-t-0 sm:border-l border-neutral-150 pt-4 sm:pt-0 sm:pl-4 flex flex-col justify-start shrink-0">
          <div className="flex items-center gap-1.5 mb-3 text-neutral-800 font-semibold text-sm">
            <Clock className="w-4 h-4 text-[#6366F1]" />
            <span>Jam</span>
          </div>
          
          <div className="flex gap-2 h-[200px]">
            {/* Hours Column */}
            <div className="flex flex-col overflow-y-auto w-12 border rounded-lg scrollbar-thin scrollbar-thumb-neutral-250">
              {Array.from({ length: 24 }).map((_, h) => (
                <button
                  key={`h-${h}`}
                  type="button"
                  onClick={() => handleTimeChange("hour", h)}
                  className={`py-1.5 text-xs shrink-0 font-mono transition-colors hover:bg-neutral-100 ${
                    selectedHour === h ? "bg-[#6366F1]/10 font-bold text-[#6366F1]" : "text-neutral-700"
                  }`}
                >
                  {String(h).padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col overflow-y-auto w-12 border rounded-lg scrollbar-thin scrollbar-thumb-neutral-250">
              {Array.from({ length: 12 }).map((_, idx) => {
                const m = idx * 5;
                return (
                  <button
                    key={`m-${m}`}
                    type="button"
                    onClick={() => handleTimeChange("minute", m)}
                    className={`py-1.5 text-xs shrink-0 font-mono transition-colors hover:bg-neutral-100 ${
                      selectedMinute === m ? "bg-[#6366F1]/10 font-bold text-[#6366F1]" : "text-neutral-700"
                    }`}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === "inline") {
    return pickerPanel;
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full justify-start text-left font-sans font-normal border-gray-200 shadow-xs hover:bg-neutral-50/80 rounded-xl h-10 px-3 py-2 ${
          !selectedDate && "text-muted-foreground"
        }`}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
        {formatDisplay(selectedDate)}
      </Button>

      {isOpen && pickerPanel}
    </div>
  );
}
