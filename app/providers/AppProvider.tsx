"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth";
import { PermissionsProvider } from "@/features/rbac/context/PermissionsProvider";
import { I18nProvider } from "./I18nProvider";
import { ConfirmProvider } from "@/hooks/use-confirm";

/**
 * AppProviders component that wraps the application with necessary context providers.
 *
 * Provides:
 * - React Query client for data fetching
 * - Auth context for authentication state
 * - Permissions context for RBAC permission checking
 * - I18n context for translations
 * - Confirm context for custom confirmation dialogs
 *
 * React Query configuration:
 * - staleTime: 60s - Data is considered fresh for 60 seconds
 * - refetchOnWindowFocus: false - Don't refetch when window gains focus
 *
 * @example
 * <AppProviders>
 *   <YourApp />
 * </AppProviders>
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PermissionsProvider>
          <I18nProvider>
            <ConfirmProvider>{children}</ConfirmProvider>
          </I18nProvider>
        </PermissionsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
