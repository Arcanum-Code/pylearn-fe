"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, AlertCircle, ZoomIn, ZoomOut } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  onScroll?: (percentage: number) => void;
  initialScrollPercentage?: number;
  currentStatus?: string;
}

export function PdfViewer({ 
  url, 
  onScroll,
  initialScrollPercentage = 0,
  currentStatus = "not_started"
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasJumpedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // Reset jump tracker when URL changes
  useEffect(() => {
    hasJumpedRef.current = false;
  }, [url]);

  // Jump to last saved progress once PDF pages render
  useEffect(() => {
    if (
      !loading &&
      numPages !== null &&
      initialScrollPercentage > 0 &&
      currentStatus !== "completed" &&
      !hasJumpedRef.current
    ) {
      hasJumpedRef.current = true;

      const timer = setTimeout(() => {
        if (containerRef.current) {
          const { scrollHeight, clientHeight } = containerRef.current;
          const totalScrollableHeight = scrollHeight - clientHeight;

          if (totalScrollableHeight > 0) {
            const targetScrollTop = (initialScrollPercentage / 100) * totalScrollableHeight;
            containerRef.current.scrollTo({ top: targetScrollTop });
            
            toast(`Melanjutkan membaca dari ${initialScrollPercentage}%`, {
              icon: "📖",
              duration: 3000,
            });
          }
        }
      }, 500); // 500ms delay to let pages finish rendering

      return () => clearTimeout(timer);
    }
  }, [loading, numPages, initialScrollPercentage, currentStatus]);

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onScroll) return;
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const totalScrollableHeight = scrollHeight - clientHeight;
    
    console.log("PDF Container scroll event:", { scrollTop, scrollHeight, clientHeight, totalScrollableHeight });
    
    if (totalScrollableHeight <= 0) return;
    
    const percentage = Math.min(100, Math.max(0, Math.round((scrollTop / totalScrollableHeight) * 100)));
    console.log("PDF Scroll percentage calculated:", percentage);
    onScroll(percentage);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(err: Error) {
    console.error("PDF Load Error:", err);
    setError(err.message);
    setLoading(false);
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="flex flex-col items-center w-full bg-muted/30 rounded-lg p-1 sm:p-4 gap-3 sm:gap-4">
      {error ? (
        <Alert variant="destructive" className="m-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading PDF</AlertTitle>
          <AlertDescription>
            {error}. You can try opening it directly in a new tab.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex items-center justify-end w-full gap-2 px-2 sm:px-0">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 3.0}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div 
            ref={containerRef}
            className="relative w-full overflow-auto flex flex-col items-center border rounded-md bg-white max-h-[800px] min-h-[500px]"
            onScroll={handleContainerScroll}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 min-h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<Skeleton className="h-[500px] w-full" />}
              className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4 min-w-max items-center"
            >
              {Array.from(new Array(numPages || 0), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md shrink-0"
                  scale={scale}
                  width={
                    containerWidth > 0
                      ? Math.min(containerWidth - (typeof window !== "undefined" && window.innerWidth < 640 ? 8 : 32), 850)
                      : typeof window !== "undefined" && window.innerWidth > 800
                      ? 700
                      : typeof window !== "undefined"
                      ? window.innerWidth - 32
                      : 600
                  }
                />
              ))}
            </Document>
          </div>
        </>
      )}
    </div>
  );
}
