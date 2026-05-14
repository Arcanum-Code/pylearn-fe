"use client";

import Image from "next/image";
import { authConfig } from "@/features/auth/config/auth";
import { useTranslations } from "@/lib/i18n/useTranslation";

interface LoginBrandingProps {
  logoUrl?: string;
}

export function LoginBranding({ logoUrl }: LoginBrandingProps) {
  const t = useTranslations();

  return (
    <div className="text-center px-2">
      {logoUrl ? (
        <div className="relative w-16 h-16 mx-auto mb-4">
          <Image src={logoUrl} alt="Logo" fill className="object-contain" />
        </div>
      ) : (
        <div className="w-16 h-16 mx-auto mb-4 bg-branding rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-branding-foreground">P</span>
        </div>
      )}
      <h1 className="text-4xl font-bold tracking-tight text-branding-foreground">
        {t(authConfig.systemNameKey)}
      </h1>
      <p className="mt-4 text-lg text-branding-foreground">
        {t(authConfig.systemDescriptionKey)}
      </p>
    </div>
  );
}
