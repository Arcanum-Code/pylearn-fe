"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Circle } from "lucide-react";
import { userFormSchema, UserFormData } from "../schema/userFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "../types";
import { userManagementConfig } from "../config/userManagement";
import { useTranslations } from "@/lib/i18n/useTranslation";

interface UserFormProps {
  defaultValues?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  roles?: Role[];
  isLoadingRoles?: boolean;
}

export function UserForm({
  defaultValues,
  onSubmit,
  isLoading,
  roles = [],
  isLoadingRoles,
}: UserFormProps) {
  const t = useTranslations();
  const isEditMode = !!defaultValues?.email;
  const [showPassword, setShowPassword] = useState(false);
  const formConfig = userManagementConfig.form;
  const isSubmittingRef = useRef(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues || {
      userId: "",
      name: "",
      email: "",
      password: "",
      roleId: "",
      status: "active",
    },
  });

  const defaultValuesRef = useRef(defaultValues);

  useEffect(() => {
    if (!isSubmittingRef.current && defaultValues && defaultValuesRef.current !== defaultValues) {
      defaultValuesRef.current = defaultValues;
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleSubmit = (data: UserFormData) => {
    isSubmittingRef.current = true;
    onSubmit(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="-mx-6 space-y-5 px-6"
    >
      <div className="space-y-2">
        <Label htmlFor="userId" className="text-sm font-medium">
          {t(formConfig.userId.labelKey)}
        </Label>
        <Input
          id="userId"
          placeholder={t(formConfig.userId.placeholderKey)}
          className="h-10"
          {...form.register("userId")}
          disabled={isLoading}
        />
        {form.formState.errors.userId && (
          <p className="text-sm text-destructive">
            {form.formState.errors.userId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          {t(formConfig.name.labelKey)}
        </Label>
        <Input
          id="name"
          placeholder={t(formConfig.name.placeholderKey)}
          className="h-10"
          {...form.register("name")}
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          {t(formConfig.email.labelKey)}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t(formConfig.email.placeholderKey)}
          className="h-10"
          {...form.register("email")}
          disabled={isLoading}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          {t(formConfig.password.labelKey)}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t(formConfig.password.placeholderKey)}
            className="h-10 pr-10"
            {...form.register("password")}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
        {!isEditMode && !form.formState.errors.password && (
          <p className="text-xs text-muted-foreground">
            {t(formConfig.password.hintNewKey)}
          </p>
        )}
        {isEditMode && !form.formState.errors.password && (
          <p className="text-xs text-muted-foreground">
            {t(formConfig.password.hintEditKey)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium">
            {t(formConfig.role.labelKey)}
          </Label>
          <Select
            value={form.watch("roleId")}
            onValueChange={(value) =>
              form.setValue("roleId", value as UserFormData["roleId"])
            }
            disabled={isLoading || isLoadingRoles}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder={t(formConfig.role.placeholderKey)} />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.roleId && (
            <p className="text-sm text-destructive">
              {form.formState.errors.roleId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            {t(formConfig.status.labelKey)}
          </Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) =>
              form.setValue("status", value as UserFormData["status"])
            }
            disabled={isLoading}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder={t(formConfig.status.placeholderKey)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <div className="flex items-center gap-2">
                  <Circle className="h-2.5 w-2.5 fill-green-500 text-green-500" />
                  {t("common.active")}
                </div>
              </SelectItem>
              <SelectItem value="inactive">
                <div className="flex items-center gap-2">
                  <Circle className="h-2.5 w-2.5 fill-red-500 text-red-500" />
                  {t("common.inactive")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <p className="text-sm text-destructive">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isLoading}
        >
          {t(formConfig.resetButton)}
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-branding-dark">
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              {t(formConfig.savingText)}
            </>
          ) : (
            t(formConfig.saveButton)
          )}
        </Button>
      </div>
    </form>
  );
}
