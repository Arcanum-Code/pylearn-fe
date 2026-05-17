"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Eye, Pencil, Trash2, Circle, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User } from "../types";

interface UserCardProps {
  user: User;
  index: number;
  page: number;
  limit: number;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  permissions?: {
    canRead?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  };
}

export function UserCard({
  user,
  index,
  page,
  limit,
  onView,
  onEdit,
  onDelete,
  permissions,
}: UserCardProps) {
  const t = useTranslations();

  const canView = permissions?.canRead ?? true;
  const canEdit = permissions?.canUpdate ?? true;
  const canDelete = permissions?.canDelete ?? true;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-branding-dark text-white text-xs">
              {(page - 1) * limit + index + 1}
            </span>
            <div>
              <p className="font-semibold text-base">{user.name}</p>
              <p className="text-xs text-muted-foreground">ID: {user.userId || "-"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Badge variant={user.isActive ? "default" : "destructive"}>
            <Circle
              className={`mr-1 h-2 w-2 fill-current ${
                user.isActive ? "text-green-500" : "text-red-500"
              }`}
            />
            {user.isActive ? t("common.active") : t("common.inactive")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{user.roleName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {canView && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-branding-dark text-white hover:bg-branding-dark/80"
            onClick={() => onView(user)}
          >
            <Eye className="h-3 w-3 mr-1" />
            {t("user.button.view")}
          </Button>
        )}
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-orange-500 text-white hover:bg-orange-500/80"
            onClick={() => onEdit(user)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            {t("user.button.edit")}
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-destructive text-white hover:bg-destructive/80"
            onClick={() => onDelete(user)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {t("user.button.delete")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface UserCardsListProps {
  data: User[];
  page: number;
  limit: number;
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

export function UserCardsList({
  data,
  page,
  limit,
  onView,
  onEdit,
  onDelete,
  permissions,
}: UserCardsListProps) {
  const t = useTranslations();

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-24 items-center justify-center text-muted-foreground">
          {t("user.table.noResults")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((user, index) => (
        <UserCard
          key={user.id}
          user={user}
          index={index}
          page={page}
          limit={limit}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          permissions={permissions}
        />
      ))}
    </div>
  );
}
