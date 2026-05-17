"use client";

import { useState, useRef } from "react";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { Eye, Pencil, Trash2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { User } from "../types";
import { userManagementConfig } from "../config/userManagement";
import { UserCardsList } from "./UserCardsList";

export interface UsersTableProps {
  data: User[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  permissions?: {
    canCreate?: boolean;
    canRead?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  };
}

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-4 w-[30px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-4 w-[80px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-4 w-[120px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-4 w-[180px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-6 w-[80px] rounded-full" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-6 w-[70px] rounded-full" />
        </TableCell>
        <TableCell className="hidden md:table-cell px-4 py-3">
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);



export function UsersTable({
  data,
  isLoading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
  permissions,
}: UsersTableProps) {
  const t = useTranslations();
  const [viewingId, setViewingId] = useState<string | null>(null);
  const tableConfig = userManagementConfig.table;
  const tableRef = useRef<HTMLDivElement>(null);

  // Default to true if permissions not provided (backward compatibility)
  const canView = permissions?.canRead ?? true;
  const canEdit = permissions?.canUpdate ?? true;
  const canDelete = permissions?.canDelete ?? true;
  const showActions = canView || canEdit || canDelete;

  const handleView = async (user: User) => {
    setViewingId(user.id);
    setTimeout(async () => {
      await onView(user);
      setViewingId(null);
    }, 0);
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Desktop Table View - hidden on mobile, visible on lg+ */}
        <div ref={tableRef} className="hidden md:block relative w-full overflow-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] px-4 py-3">
                  {t(tableConfig.no)}
                </TableHead>
                <TableHead className="min-w-[100px] px-4 py-3">
                  {t(tableConfig.userId)}
                </TableHead>
                <TableHead className="min-w-[120px] px-4 py-3">
                  {t(tableConfig.name)}
                </TableHead>
                <TableHead className="min-w-[180px] px-4 py-3">
                  {t(tableConfig.email)}
                </TableHead>
                <TableHead className="min-w-[100px] px-4 py-3">
                  {t(tableConfig.role)}
                </TableHead>
                <TableHead className="min-w-[100px] px-4 py-3">
                  {t(tableConfig.status)}
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[120px] px-4 py-3">
                  {t(tableConfig.createdAt)}
                </TableHead>
                {showActions && (
                  <TableHead className="w-[100px] px-4 py-3">
                    {t(tableConfig.actions)}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t(tableConfig.noResults)}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-branding-dark text-white text-xs">
                        {(page - 1) * limit + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {user.userId || "-"}
                    </TableCell>
                    <TableCell className="font-medium px-4 py-3">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-4 py-3">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="secondary">{user.roleName}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Circle
                          className={`h-2.5 w-2.5 fill-current ${
                            user.isActive ? "text-green-500" : "text-red-500"
                          }`}
                        />
                        <span
                          className={
                            user.isActive ? "text-green-700" : "text-red-700"
                          }
                        >
                          {user.isActive
                            ? t("common.active")
                            : t("common.inactive")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground px-4 py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    {showActions && (
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {canView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-branding-dark hover:bg-branding-dark/90"
                              onClick={() => handleView(user)}
                              disabled={viewingId !== null}
                            >
                              <Eye className="h-4 w-4 text-white" />
                            </Button>
                          )}
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                              onClick={() => onEdit(user)}
                              disabled={viewingId !== null}
                            >
                              <Pencil className="h-4 w-4 text-white" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-destructive hover:bg-destructive/90"
                              onClick={() => onDelete(user)}
                              disabled={viewingId !== null}
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards View - visible on mobile, hidden on lg+ */}
        <div ref={tableRef} className="md:hidden p-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-4 w-[180px] mb-2" />
                    <Skeleton className="h-4 w-[100px]" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <UserCardsList
              data={data}
              page={page}
              limit={limit}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              permissions={permissions}
            />
          )}
        </div>

        <TablePagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          showingText={t(userManagementConfig.pagination.showingKey)}
          rowsText={t(userManagementConfig.pagination.rowsKey)}
          scrollRef={tableRef}
        />
      </CardContent>
    </Card>
  );
}
