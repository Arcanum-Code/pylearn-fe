"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { MaterialType } from "../types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function useMaterialFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
  const lecturerId = searchParams.get("lecturerId") || "";
  const materialType = searchParams.get("materialType") as MaterialType | "";
  const isPublished = searchParams.get("isPublished") === "true" ? true : searchParams.get("isPublished") === "false" ? false : undefined;

  const createQueryString = useCallback(
    (params: Record<string, string | number | boolean | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const setPage = useCallback(
    (value: number) => {
      router.push(`?${createQueryString({ page: value })}`, { scroll: false });
    },
    [router, createQueryString],
  );

  const setLimit = useCallback(
    (value: number) => {
      router.push(
        `?${createQueryString({ limit: value, page: DEFAULT_PAGE })}`,
        { scroll: false },
      );
    },
    [router, createQueryString],
  );

  const setLecturerId = useCallback(
    (value: string) => {
      router.push(
        `?${createQueryString({ lecturerId: value, page: DEFAULT_PAGE })}`,
        { scroll: false },
      );
    },
    [router, createQueryString],
  );

  const setMaterialType = useCallback(
    (value: MaterialType | "") => {
      router.push(
        `?${createQueryString({ materialType: value, page: DEFAULT_PAGE })}`,
        { scroll: false },
      );
    },
    [router, createQueryString],
  );

  const setIsPublished = useCallback(
    (value: boolean | undefined) => {
      router.push(
        `?${createQueryString({ isPublished: value ?? null, page: DEFAULT_PAGE })}`,
        { scroll: false },
      );
    },
    [router, createQueryString],
  );

  const resetFilters = useCallback(() => {
    router.push("?");
  }, [router]);

  return {
    page,
    limit,
    lecturerId,
    materialType,
    isPublished,
    setPage,
    setLimit,
    setLecturerId,
    setMaterialType,
    setIsPublished,
    resetFilters,
  };
}
