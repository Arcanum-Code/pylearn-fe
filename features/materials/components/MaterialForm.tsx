"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMaterialSchema,
  CreateMaterialRequest,
} from "../schemas/materialSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { IconPicker } from "./IconPicker";

interface MaterialFormProps {
  onSubmit: (data: CreateMaterialRequest) => void;
  isLoading?: boolean;
}

export function MaterialForm({ onSubmit, isLoading }: MaterialFormProps) {
  const t = useTranslations();
  const form = useForm<CreateMaterialRequest>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      materialType: "text",
      content: "",
      iconName: "BookOpen",
      isPublished: false,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 px-1 py-1"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title" className="text-sm font-medium">
            {t("materials.form.title.label")}
          </Label>
          <Input
            id="title"
            placeholder={t("materials.form.title.placeholder")}
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium">
            {t("materials.form.description.label")}
          </Label>
          <Textarea
            id="description"
            placeholder={t("materials.form.description.placeholder")}
            className="resize-none"
            {...form.register("description")}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="icon" className="text-sm font-medium">
            {t("materials.form.icon.label")}
          </Label>
          <IconPicker
            value={form.watch("iconName")}
            onChange={(val) => form.setValue("iconName", val)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="content" className="text-sm font-medium">
            {t("materials.form.content.label")}
          </Label>
          <Textarea
            id="content"
            placeholder={t("materials.form.content.placeholder")}
            className="min-h-[150px]"
            {...form.register("content")}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isPublished"
            checked={form.watch("isPublished")}
            onCheckedChange={(val) => form.setValue("isPublished", !!val)}
            disabled={isLoading}
          />
          <Label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
            {t("materials.form.isPublished.label")}
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="bg-branding-dark px-8">
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              {t("common.save")}
            </>
          ) : (
            t("common.save")
          )}
        </Button>
      </div>
    </form>
  );
}
