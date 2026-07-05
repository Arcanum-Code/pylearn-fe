"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { setApiLocale } from "@/app/utils/axios";

import commonEn from "../../messages/en.json";
import commonEs from "../../messages/es.json";
import commonId from "../../messages/id.json";

import userEn from "@/features/user/config/locales/en.json";
import userEs from "@/features/user/config/locales/es.json";
import userId from "@/features/user/config/locales/id.json";

import roleEn from "@/features/rbac/config/locales/en.json";
import roleEs from "@/features/rbac/config/locales/es.json";
import roleId from "@/features/rbac/config/locales/id.json";

import authEn from "@/features/auth/config/locales/en.json";
import authEs from "@/features/auth/config/locales/es.json";
import authId from "@/features/auth/config/locales/id.json";

import dashboardEn from "@/features/dashboard/config/locales/en.json";
import dashboardEs from "@/features/dashboard/config/locales/es.json";
import dashboardId from "@/features/dashboard/config/locales/id.json";

import navigationEn from "@/features/layout/config/locales/en.json";
import navigationEs from "@/features/layout/config/locales/es.json";
import navigationId from "@/features/layout/config/locales/id.json";

import materialsEn from "@/features/materials/config/locales/en.json";
import materialsEs from "@/features/materials/config/locales/es.json";
import materialsId from "@/features/materials/config/locales/id.json";

const messages = {
  en: {
    common: commonEn.common,
    user: userEn,
    role: roleEn,
    auth: authEn,
    dashboard: dashboardEn,
    navigation: navigationEn,
    materials: materialsEn,
  },
  es: {
    common: commonEs.common,
    user: userEs,
    role: roleEs,
    auth: authEs,
    dashboard: dashboardEs,
    navigation: navigationEs,
    materials: materialsEs,
  },
  id: {
    common: commonId.common,
    user: userId,
    role: roleId,
    auth: authId,
    dashboard: dashboardId,
    navigation: navigationId,
    materials: materialsId,
  },
};

type Locale = "en" | "es" | "id";

const supportedLocales: Locale[] = ["en", "es", "id"];

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "id";

  const cookieLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="))
    ?.split("=")[1] as Locale;

  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  return "id";
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: typeof messages.en;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale());

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
  };

  useEffect(() => {
    setApiLocale(locale);
  }, [locale]);

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, messages: messages[locale] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
