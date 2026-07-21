"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { authConfig } from "@/features/auth/config/auth";
import Image from "next/image";

export function LoginBranding() {
  const t = useTranslations();

  return (
    <div className="relative z-10 w-full max-w-lg px-8 flex flex-col">
      {/* Glowing Text at the very top */}
      <div className="mb-6">
        <span className="text-sm font-medium tracking-wide text-terminal-accent animate-pulse uppercase">
          SMART-LEARNING PLATFORM
        </span>
      </div>

      {/* Modern Logo & Title (Left aligned) */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-tile">
          <span className="text-xl font-bold font-mono text-white">
            {`>_`}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t(authConfig.systemNameKey)}
          </h1>
          <p className="text-sm text-zinc-300 mt-1">
            {t(authConfig.systemDescriptionKey)}
          </p>
        </div>
      </div>

      {/* Hero Illustration */}
      <div className="relative w-full aspect-[4/3] drop-shadow-2xl">
        <Image
          src="/images/coding.svg"
          alt="Student coding"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
