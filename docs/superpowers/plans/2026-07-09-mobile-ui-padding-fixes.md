# Mobile UI Padding & Layout Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize mobile screen padding across the application layout, student dashboard progress cards, and PDF reader (`/groups/[groupId]/materials/[materialId]`) to prevent cramped components and cut-off buttons.

**Architecture:** We will replace rigid desktop-oriented padding (`p-6`, `p-8`) with responsive utility classes (`p-3 sm:p-6 md:p-8`), eliminate stacked double-padding (`MainLayout` + `DashboardPage`), restructure `Progress Belajar Kelas` card headers to stack vertically on mobile (`flex-col sm:flex-row`), and equip `PdfViewer` with a `ResizeObserver` that dynamically scales PDF page width to exact container dimensions (`containerWidth - 8px` on mobile).

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, `shadcn/ui`, `react-pdf`, Bun.

---

### Task 1: Global Layout & Dashboard Double-Padding Cleanup

**Files:**
- Modify: `app/(main)/layout.tsx:33-38`
- Modify: `app/(main)/dashboard/page.tsx:37-44`

- [ ] **Step 1: Make `<main>` padding inside `app/(main)/layout.tsx` responsive**

In `app/(main)/layout.tsx`, change `<main className="flex-1 overflow-y-auto bg-muted/30 p-6 md:pb-6">` to `<main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-6 md:pb-6">` so small mobile devices (`< 640px`) gain 24px of horizontal width (`p-3` vs `p-6`).

```tsx
// app/(main)/layout.tsx (Lines 33-38)
      {/* Main content area */}
      <div className="flex flex-1 flex-col w-full min-w-0 lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-6 md:pb-6">
          {children}
        </main>
      </div>
```

- [ ] **Step 2: Remove redundant outer double-padding in `app/(main)/dashboard/page.tsx`**

In `app/(main)/dashboard/page.tsx`, change `<div className="p-8">` (`32px` padding on all screen sizes on top of `MainLayout` padding) to `<div className="p-0 sm:p-2 md:p-4">`. This removes the double-padding penalty on mobile (`112px` total -> `24px` total).

```tsx
// app/(main)/dashboard/page.tsx (Lines 37-44)
  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div>
        {renderDashboard()}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify the build and check dashboard layout**

Run: `bun run lint`
Expected: PASS with 0 errors.

---

### Task 2: Responsive Progress Belajar Kelas Card Header (`StudentDashboardView.tsx`)

**Files:**
- Modify: `features/dashboard/components/StudentDashboardView.tsx:377-435`

- [ ] **Step 1: Restructure card headers to stack vertically on mobile screens**

In `features/dashboard/components/StudentDashboardView.tsx`, update the `Progress Belajar Kelas` card mapping (`enrolledGroups.map`) around lines 377 to 435. We will:
1. Make `CardHeader` padding responsive (`p-3.5 sm:p-6 pb-3.5 sm:pb-4`).
2. Change the inner layout from `flex items-center justify-between gap-4` to `flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4`.
3. Give the right section (`Detail Kelas` button + chevron) full width on mobile (`w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-150/60 sm:border-none`) so the `Detail Kelas` button and chevron sit cleanly underneath on mobile without getting squeezed or cut off.
4. Make `CardContent` padding responsive (`p-3.5 sm:p-6 pt-4 sm:pt-6`).

```tsx
// features/dashboard/components/StudentDashboardView.tsx (Lines 377-435 drop-in replacement)
                  return (
                    <Card 
                      key={group.groupId} 
                      onClick={() => toggleGroup(group.groupId)}
                      className="overflow-hidden border border-gray-150/85 shadow-xs hover:shadow-sm cursor-pointer transition-all duration-200 bg-white"
                    >
                      <CardHeader className={`bg-gray-50/40 p-3.5 sm:p-6 pb-3.5 sm:pb-4 transition-all duration-300 ${isExpanded ? "border-b border-gray-150/60" : ""}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                            <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#6366F1] transition-all duration-300 flex-shrink-0">
                              <GraduationCap className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1 sm:flex-initial">
                              <CardTitle className="text-sm md:text-base font-bold truncate">{group.groupName}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {group.materialsCompleted} dari {group.materialsTotal} materi selesai
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-150/60 sm:border-none">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-[#6366F1]">{percentage}% Selesai</span>
                              <div className="w-20 sm:w-24 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                <div 
                                  className="bg-gradient-to-r from-[#6366F1] to-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                                  style={{ width: mounted ? `${percentage}%` : "0%" }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/groups/${group.groupId}`);
                                }}
                                className="text-xs text-[#6366F1] hover:text-[#4F46E5] hover:bg-[#6366F1]/10 font-semibold h-8 py-0 px-2.5 rounded-lg flex items-center gap-1 flex-shrink-0"
                              >
                                Detail Kelas
                                <ArrowRight className="h-3 w-3" />
                              </Button>

                              <div className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0">
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="p-3.5 sm:p-6 pt-4 sm:pt-6 bg-white transition-all duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

- [ ] **Step 2: Verify the build after StudentDashboardView update**

Run: `bun run lint`
Expected: PASS with 0 errors.

---

### Task 3: Edge-to-Edge PDF Reader Layout (`StudentMaterialDetailView.tsx` & `PdfViewer.tsx`)

**Files:**
- Modify: `features/materials/components/StudentMaterialDetailView.tsx:246-248, 319-344`
- Modify: `features/materials/components/PdfViewer.tsx:27-33, 70-165`

- [ ] **Step 1: Reduce outer and card padding around PDF in `StudentMaterialDetailView.tsx`**

In `features/materials/components/StudentMaterialDetailView.tsx`, make the root wrapper padding responsive (`p-3 sm:p-6 md:p-8` instead of `p-8`), and adjust the `CardContent` wrapping the PDF viewer so when `absolutePdfUrl` is present, it uses `p-1 sm:p-6 md:p-8` instead of `p-8 md:p-12`.

Update line 246:
```tsx
// features/materials/components/StudentMaterialDetailView.tsx (Line 246)
      <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-[#F7F8FA] min-h-screen font-sans text-[#1A1C1E]">
```

Update lines 319-345:
```tsx
// features/materials/components/StudentMaterialDetailView.tsx (Lines 319-345 drop-in replacement)
        {/* Material Content Area */}
        <Card className="border border-gray-150/60 shadow-xs overflow-hidden">
          <CardContent className={absolutePdfUrl ? "p-1 sm:p-6 md:p-8" : "p-4 sm:p-8 md:p-12"}>
            {absolutePdfUrl ? (
              <div className="space-y-4">
                <div className="flex justify-end px-2 sm:px-0 pt-2 sm:pt-0">
                  <Button variant="outline" size="sm" asChild>
                    <a href={absolutePdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buka PDF di Tab Baru
                    </a>
                  </Button>
                </div>
                <PdfViewer 
                  url={absolutePdfUrl} 
                  onScroll={handlePdfScroll} 
                  initialScrollPercentage={scrollPercentage}
                  currentStatus={currentStatus}
                />
              </div>
            ) : material.content ? (
              <HtmlRenderer content={material.content} />
            ) : (
              <p className="text-muted-foreground italic text-center py-12">Konten materi kosong.</p>
            )}
          </CardContent>
        </Card>
```

- [ ] **Step 2: Add dynamic container width ResizeObserver and minimize wrapper padding in `PdfViewer.tsx`**

In `features/materials/components/PdfViewer.tsx`, reduce wrapper `div` padding to `p-1 sm:p-4 gap-3 sm:gap-4`, and add `containerWidth` tracking via `ResizeObserver` so `react-pdf`'s `<Page width={...} />` renders dynamically to exactly fit the container width (`containerWidth - (isMobile ? 8 : 32)`).

```tsx
// features/materials/components/PdfViewer.tsx (Lines 27-38 drop-in replacement)
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

  // Track container width dynamically with ResizeObserver for exact auto-fit
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
```

And update the returned JSX (`lines 100-166`):
```tsx
// features/materials/components/PdfViewer.tsx (Lines 100-166 drop-in replacement)
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
```

- [ ] **Step 3: Run linter and build verification**

Run: `bun run lint && bun run build`
Expected: PASS with 0 errors.

---

### Task Final: Commit all plan changes

- [ ] **Step 1: Commit everything**

> This is the **only** commit step in the entire plan. All files modified are committed together.

```bash
git add app/\(main\)/layout.tsx app/\(main\)/dashboard/page.tsx features/dashboard/components/StudentDashboardView.tsx features/materials/components/StudentMaterialDetailView.tsx features/materials/components/PdfViewer.tsx
git commit -m "fix(ui): optimize mobile padding and layout for dashboard progress cards and pdf reader"
```
