"use client";

import Link from "next/link";
import { useFetchMaterialById } from "@/features/materials/hooks/useMaterials";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  User,
  Calendar,
  ExternalLink,
} from "lucide-react";
import dynamic from "next/dynamic";
import { API_ENDPOINTS } from "@/app/api/api";

const PdfViewer = dynamic(
  () => import("./PdfViewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />,
  },
);

// Mocking component jika belum diimport
const HtmlRenderer = ({ content }: { content: string }) => (
  <div
    className="prose max-w-none"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

interface MaterialDetailViewProps {
  id: string;
}

export function MaterialDetailView({ id }: MaterialDetailViewProps) {
  // 1. Fetch data materi
  const { data: material, isLoading } = useFetchMaterialById(id);

  // Resolve PDF URL
  const pdfUrl =
    material?.materialType === "file"
      ? material.sourceUrl || material.content
      : null;

  // We use the Next.js API route (/api/storage/...) to proxy storage requests.
  // This ensures the browser always fetches through the frontend domain.
  const absolutePdfUrl =
    pdfUrl && !pdfUrl.startsWith("http")
      ? API_ENDPOINTS.STORAGE(pdfUrl)
      : pdfUrl;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Materi tidak ditemukan</p>
        <Button variant="outline" asChild>
          <Link href="/materials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="w-fit pl-0" asChild>
          <Link href="/materials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Link>
        </Button>

        {absolutePdfUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={absolutePdfUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Browser
            </a>
          </Button>
        )}
      </div>

      {/* HEADER PANEL MATERI */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-xl font-bold text-white uppercase">
              {material.title.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-tight">
              {material.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className="text-xs uppercase tracking-wider"
              >
                {material.materialType}
              </Badge>
              <Badge
                variant={material.isPublished ? "default" : "outline"}
                className="text-xs"
              >
                {material.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        {material.description && (
          <p className="text-muted-foreground">{material.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{material.lecturerName || "Instructor"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(material.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* ISI KONTEN MATERI MODUL */}
      <Card>
        <CardContent className="p-6">
          {absolutePdfUrl ? (
            <PdfViewer url={absolutePdfUrl} />
          ) : material.content ? (
            <HtmlRenderer content={material.content} />
          ) : (
            <p className="text-muted-foreground italic">Konten kosong</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

