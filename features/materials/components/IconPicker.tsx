"use client";

import * as React from "react";
import { Check, Search, icons, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ALL_ICONS = Object.keys(icons).filter(
  (key) => typeof icons[key as keyof typeof icons] !== "undefined"
);

export function IconPicker({ value, onChange, disabled }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredIcons = React.useMemo(() => {
    const searchLower = search.toLowerCase();
    return ALL_ICONS.filter((icon) =>
      icon.toLowerCase().includes(searchLower)
    ).slice(0, 100);
  }, [search]);

  const SelectedIcon = value ? (icons[value as keyof typeof icons] as React.ElementType) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-10 px-3"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {SelectedIcon ? (
              <SelectedIcon className="h-4 w-4 shrink-0" />
            ) : (
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">{value || "Select icon..."}</span>
          </div>
          <Search className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearch("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1">
            {filteredIcons.map((iconName) => {
              const Icon = icons[iconName as keyof typeof icons] as React.ElementType;
              const isSelected = value === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-md border transition-colors hover:bg-muted ${
                    isSelected ? "border-branding-dark bg-branding-dark/5 ring-1 ring-branding-dark" : "border-transparent"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? "text-branding-dark" : ""}`} />
                  <span className="text-[10px] text-center truncate w-full">
                    {iconName}
                  </span>
                </button>
              );
            })}
            {filteredIcons.length === 0 && (
              <div className="col-span-4 py-8 text-center text-sm text-muted-foreground">
                No icons found for "{search}"
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
