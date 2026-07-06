"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { useTranslations } from "@/lib/i18n/useTranslation";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = React.createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmOptions | null>(null);
  const resolveRef = React.useRef<((value: boolean) => void) | null>(null);
  const t = useTranslations();

  const confirm = React.useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts);
      setOpen(true);
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setOpen(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  };

  const handleCancel = () => {
    setOpen(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel();
    }
  };

  const getIcon = () => {
    const variant = options?.variant || "default";
    switch (variant) {
      case "destructive":
        return <Trash2 className="text-destructive size-5" />;
      case "warning":
        return <AlertTriangle className="text-amber-600 size-5" />;
      default:
        return <Info className="text-blue-600 size-5" />;
    }
  };

  const getMediaBgColor = () => {
    const variant = options?.variant || "default";
    switch (variant) {
      case "destructive":
        return "bg-destructive/10 border-destructive/20 border";
      case "warning":
        return "bg-amber-550/10 border-amber-500/20 border";
      default:
        return "bg-blue-500/10 border-blue-500/20 border";
    }
  };

  const getActionVariant = (): "default" | "destructive" => {
    if (options?.variant === "destructive") {
      return "destructive";
    }
    return "default";
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent 
          showCloseButton={false}
          className="gap-6 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 rounded-2xl max-w-[90vw] sm:max-w-md border border-gray-150 bg-white"
        >
          <DialogHeader className="flex flex-row items-start gap-4 text-left">
            {options && (
              <div className={`rounded-full shrink-0 flex items-center justify-center size-10 ${getMediaBgColor()}`}>
                {getIcon()}
              </div>
            )}
            <div className="flex-1 space-y-1.5">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                {options?.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {options?.description}
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4 justify-end">
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto min-w-[80px]"
            >
              {options?.cancelText || t("common.cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              variant={getActionVariant()}
              className="w-full sm:w-auto min-w-[80px]"
            >
              {options?.confirmText || (options?.variant === "destructive" ? t("common.delete") : t("common.save"))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = React.useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
}
