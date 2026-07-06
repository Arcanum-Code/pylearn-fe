"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMaterialSchema,
  updateMaterialSchema,
  UpdateMaterialRequest,
} from "../schemas/materialSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { FileText, Upload, Eye, EyeOff } from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/api";

interface MaterialFormProps {
  initialValues?: Partial<UpdateMaterialRequest>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  existingFileUrl?: string;
}

export function MaterialForm({
  initialValues,
  onSubmit,
  isLoading,
  existingFileUrl,
}: MaterialFormProps) {
  const isEdit = !!initialValues;
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const formSchema = isEdit ? updateMaterialSchema : createMaterialSchema;

  const form = useForm<any>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialValues || {
      title: "",
      description: "",
      materialType: "file",
      isPublished: true,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Handle local object URL lifecycle for previews
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFormSubmit = (values: any) => {
    const data = { ...values };
    if (file) {
      data.file = file;
    }
    onSubmit(data);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        form.setError("file", {
          type: "manual",
          message: "File harus berupa PDF",
        });
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        form.setError("file", {
          type: "manual",
          message: "Ukuran file maksimal 10MB",
        });
        return;
      }
      setFile(droppedFile);
      form.setValue("file", droppedFile);
      form.clearErrors("file");
    }
  };

  const activePdfUrl =
    previewUrl ||
    (existingFileUrl
      ? existingFileUrl.startsWith("http")
        ? existingFileUrl
        : API_ENDPOINTS.STORAGE(existingFileUrl)
      : null);

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="space-y-5 px-1 py-1"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Judul Materi
          </Label>
          <Input
            id="title"
            placeholder="Contoh: Pengenalan Dasar React"
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message as string}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Deskripsi Singkat
          </Label>
          <Textarea
            id="description"
            placeholder="Jelaskan apa yang akan dipelajari..."
            className="resize-none"
            {...form.register("description")}
            disabled={isLoading}
          />
          {form.formState.errors.description && (
            <p className="text-xs text-destructive">
              {form.formState.errors.description.message as string}
            </p>
          )}
        </div>

        {/* PDF File Upload */}
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-sm font-medium">File PDF Materi</Label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-muted-foreground/35 bg-muted/30"
            }`}
          >
            {file ? (
              <div className="flex items-center gap-3 bg-background p-3 rounded-md border w-full">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    form.setValue("file", undefined);
                    setShowPreview(false);
                  }}
                >
                  Ganti
                </Button>
              </div>
            ) : existingFileUrl ? (
              <div className="flex items-center gap-3 bg-background p-3 rounded-md border w-full">
                <FileText className="h-8 w-8 text-emerald-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    PDF Terunggah Sebelumnya
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {existingFileUrl.split("/").pop()}
                  </p>
                </div>
                <div>
                  <Input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    id="pdf-upload"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      if (selectedFile) {
                        setFile(selectedFile);
                        form.setValue("file", selectedFile);
                        form.clearErrors("file");
                      }
                    }}
                  />
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <Label htmlFor="pdf-upload" className="cursor-pointer">
                      Ganti File
                    </Label>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  Seret & taruh file PDF di sini, atau pilih dari komputer
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Maksimal ukuran file: 10MB
                </p>
                <Input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  id="pdf-upload"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    if (selectedFile) {
                      setFile(selectedFile);
                      form.setValue("file", selectedFile);
                      form.clearErrors("file");
                    }
                  }}
                />
                <Button type="button" variant="secondary" asChild>
                  <Label htmlFor="pdf-upload" className="cursor-pointer">
                    Pilih File
                  </Label>
                </Button>
              </div>
            )}
            {form.formState.errors.file && (
              <p className="text-xs text-destructive mt-2">
                {form.formState.errors.file.message as string}
              </p>
            )}

            {/* Collapsible PDF Inline Preview */}
            {activePdfUrl && (
              <div className="mt-4 w-full border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full flex items-center justify-center gap-2 border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10 rounded-xl font-mono text-xs cursor-pointer transition-all duration-200"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Sembunyikan Preview PDF
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Tampilkan Preview PDF
                    </>
                  )}
                </Button>

                {showPreview && (
                  <div className="mt-3 border rounded-xl overflow-hidden bg-neutral-100 h-[380px] shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <iframe
                      src={`${activePdfUrl}#toolbar=0`}
                      className="w-full h-full border-none"
                      title="PDF Preview"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-branding-dark px-8"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Menyimpan...
            </>
          ) : (
            "Simpan Materi"
          )}
        </Button>
      </div>
    </form>
  );
}
