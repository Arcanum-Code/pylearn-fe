"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarNavItem,
  sidebarConfig,
  sidebarFooterConfig,
} from "@features/layout/config/sidebar";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { usePermissions } from "@/features/rbac/context/PermissionsProvider";

/**
 * Collapsible nav item with smooth animation.
 * Filters children based on user permissions.
 */
const NavItem = ({
  item,
  depth = 0,
  onNavigate,
}: {
  item: SidebarNavItem;
  depth?: number;
  onNavigate?: () => void;
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  const { canRead, isLoading: isLoadingPermissions } = usePermissions();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const isActive = item.href
    ? item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(item.href + "/")
    : false;
  const hasActiveChild = item.children?.some(
    (child) =>
      child.href
        ? child.href === "/"
          ? pathname === "/"
          : pathname === child.href || pathname.startsWith(child.href + "/")
        : false,
  );

  const Icon = item.icon;

  // Filter children based on permissions
  const visibleChildren = React.useMemo(() => {
    if (!item.children) return [];
    return item.children.filter((child) => {
      // If no feature is specified, show the item
      if (!child.feature) return true;
      // Check if user has read permission for this feature
      return canRead(child.feature);
    });
  }, [item.children, canRead]);

  // Don't render if this item requires a permission the user doesn't have
  if (item.feature && !isLoadingPermissions) {
    const hasPermission = canRead(item.feature);
    if (!hasPermission) return null;
  }

  // Don't render parent if no children are visible
  if (item.children && visibleChildren.length === 0 && !isLoadingPermissions) {
    return null;
  }

  const handleClick = () => {
    if (item.children) {
      setIsExpanded(!isExpanded);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={handleClick}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "text-slate-400 hover:bg-slate-800 hover:text-white",
            (isActive || hasActiveChild) && "bg-indigo-600 text-white shadow-xs",
          )}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            <span className="font-mono">{t(item.labelKey)}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              !isExpanded && "-rotate-90",
            )}
          />
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="space-y-1 pt-1">
            {visibleChildren.map((child) => (
              <NavItem
                key={child.href}
                item={child}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-slate-400 hover:bg-slate-800 hover:text-white",
        isActive && "bg-indigo-600 text-white shadow-xs",
      )}
      style={{ paddingLeft: `${12 + depth * 12}px` }}
    >
      <Icon className="h-4 w-4" />
      <span className="font-mono">{t(item.labelKey)}</span>
    </Link>
  );
};

/**
 * Sidebar navigation component.
 * Renders the sidebar with logo, navigation items, and system info footer.
 * Uses branding-dark color theme.
 *
 * @param isOpen - Whether the sidebar is open (for mobile)
 * @param onClose - Callback to close the sidebar (for mobile)
 *
 * @example
 * <SidebarNav />
 */
export function SidebarNav({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const t = useTranslations();
  const handleNavigate = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-100 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <h1 className="text-xl font-bold font-mono tracking-tight text-white">
            {t(sidebarFooterConfig.nameKey)}
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {sidebarConfig.map((item) => (
            <NavItem
              key={item.labelKey}
              item={item}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        {/* System Info Footer */}
        <div className="border-t border-slate-800 px-6 py-4 pb-8 md:pb-4">
          <p className="text-sm font-medium font-mono text-slate-400">
            {t(sidebarFooterConfig.nameKey)}
          </p>
          {sidebarFooterConfig.versionKey && (
            <p className="text-xs font-mono text-slate-600">
              {t(sidebarFooterConfig.versionKey)}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
