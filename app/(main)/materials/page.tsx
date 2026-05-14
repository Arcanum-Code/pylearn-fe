"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import {
  MaterialHeader,
  MaterialFilters,
  MaterialsList,
  useFetchMaterials,
  useMaterialFilters,
} from "@/features/materials";
import { TablePagination } from "@/components/ui/table-pagination";
import { useRef } from "react";

export default function MaterialsPage() {
  const t = useTranslations();
  const filters = useMaterialFilters();
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useFetchMaterials({
    page: filters.page,
    limit: filters.limit,
    lecturerId: filters.lecturerId,
    materialType: filters.materialType || undefined,
    isPublished: filters.isPublished,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <MaterialHeader />

      {/* <MaterialFilters */}
      {/*   materialType={filters.materialType} */}
      {/*   isPublished={filters.isPublished} */}
      {/*   onTypeChange={filters.setMaterialType} */}
      {/*   onStatusChange={filters.setIsPublished} */}
      {/* /> */}

      <div ref={listRef}>
        <MaterialsList data={data?.data || []} isLoading={isLoading} />
      </div>

      {data && data.pagination.total > 0 && (
        <TablePagination
          page={filters.page}
          limit={filters.limit}
          total={data.pagination.total}
          onPageChange={filters.setPage}
          onLimitChange={filters.setLimit}
          showingText={t("common.showing")}
          rowsText={t("common.rows")}
          scrollRef={listRef}
        />
      )}
    </div>
  );
}
