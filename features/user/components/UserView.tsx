"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Circle } from "lucide-react";
import { User as UserType, Role } from "../types";
import { userManagementConfig } from "../config/userManagement";
import { UserViewSkeleton } from "./UserViewSkeleton";

interface UserViewProps {
  user: UserType | null | undefined;
  roles?: Role[];
  isLoading?: boolean;
}

export function UserView({ user, roles, isLoading }: UserViewProps) {
  const t = useTranslations();

  if (isLoading) {
    return <UserViewSkeleton />;
  }

  if (!user) {
    return null;
  }

  const roleName = roles?.find((r) => r.id === user.roleId)?.name || user.roleId;

  const fields = userManagementConfig.viewFields.map((field) => {
    let value: string | React.ReactNode = "";

    switch (field.value) {
      case "userId":
        value = user.userId || "-";
        break;
      case "name":
        value = user.name;
        break;
      case "email":
        value = user.email;
        break;
      case "role":
        value = roleName;
        break;
      case "status":
        value = user.isActive ? t("common.active") : t("common.inactive");
        break;
    }

    return {
      ...field,
      label: t(field.labelKey),
      value,
    };
  });

  const AvatarIcon = userManagementConfig.avatarIcon;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-branding-dark">
          <AvatarIcon className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-semibold">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="rounded-lg border">
        {fields.map((field, index) => (
          <div
            key={field.labelKey}
            className={`flex items-center gap-3 px-3 py-2.5 ${
              index !== fields.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{field.label}</p>
              {field.isStatus ? (
                <div className="flex items-center gap-1.5">
                  <Circle
                    className={`h-2 w-2 fill-current ${
                      user.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className={user.isActive ? "text-green-700 font-medium text-sm" : "text-red-700 font-medium text-sm"}>
                    {field.value}
                  </span>
                </div>
              ) : (
                <p className="font-medium text-sm">{field.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-muted-foreground space-y-0.5">
        <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
        {user.updatedAt && (
          <p>Last Updated: {new Date(user.updatedAt).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
