"use client";

import { Lock, LogIn, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useLoginForm, useAuth } from "@/features/auth";
import { authConfig } from "@/features/auth/config/auth";
import { useTranslations } from "@/lib/i18n/useTranslation";

export function LoginForm() {
  const {
    form,
    passwordVisible,
    togglePasswordVisibility,
    onSubmit,
    clearRootError,
  } = useLoginForm();
  const { isLoading } = useAuth();
  const t = useTranslations();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-branding-dark">
            <User className="h-8 w-8 text-branding-foreground" />
          </div>
          <h2 className="text-2xl font-bold">
            {t(authConfig.form.welcomeTitleKey)}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(authConfig.form.welcomeDescriptionKey)}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_id">{t(authConfig.form.userId.labelKey)}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user_id"
                type="text"
                placeholder={t(authConfig.form.userId.placeholderKey)}
                {...register("user_id", { onChange: clearRootError })}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.user_id && (
              <p className="text-sm text-destructive">{errors.user_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {t(authConfig.form.password.labelKey)}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder={t(authConfig.form.password.placeholderKey)}
                {...register("password", { onChange: clearRootError })}
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
                aria-label={
                  passwordVisible
                    ? t(authConfig.form.password.hideKey)
                    : t(authConfig.form.password.showKey)
                }
              >
                {passwordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-branding-dark hover:bg-branding-dark/90 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4 text-branding-foreground" />
                {t(authConfig.form.submit.loggingInKey)}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t(authConfig.form.submit.loginKey)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
