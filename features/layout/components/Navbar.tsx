"use client";

import React from "react";
import Link from "next/link";
import { Menu, LogOut, User } from "lucide-react";
import { useAuth } from "@features/auth/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations, useLocale } from "@/lib/i18n/useTranslation";

/**
 * Navbar component for authenticated pages.
 * Displays page title (optional), hamburger menu (mobile), and user profile dropdown.
 *
 * @param title - Optional page title to display in the navbar
 * @param onMenuClick - Callback for hamburger menu button (mobile)
 *
 * @example
 * <Navbar title="Dashboard" onMenuClick={() => {}} />
 *
 * @example
 * // Without title
 * <Navbar onMenuClick={() => {}} />
 */
export function Navbar({
  title,
  onMenuClick,
}: {
  title?: string;
  onMenuClick?: () => void;
}) {
  const { user, logout } = useAuth();
  const t = useTranslations();
  const locale = useLocale();

  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-6">
      {/* Left side: Menu button (mobile) + Page title */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu button - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title */}
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>

      {/* User Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Clock & Date Section */}
        {time && (
          <div className="hidden md:flex flex-col items-end text-right border-r pr-4 border-border">
            <span className="text-sm font-semibold tabular-nums text-foreground leading-none">
              {time.toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 leading-none">
              {time.toLocaleDateString(locale, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        <LanguageSwitcher />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2">
              <Avatar>
                <AvatarFallback className="bg-branding-dark text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {t("navigation.profile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("navigation.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
