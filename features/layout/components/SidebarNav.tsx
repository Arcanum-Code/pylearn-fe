"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, GraduationCap, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarNavItem,
  sidebarConfig,
  sidebarFooterConfig,
} from "@features/layout/config/sidebar";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { usePermissions } from "@/features/rbac/context/PermissionsProvider";
import { useAuth } from "@features/auth/context/AuthProvider";
import { useFetchLecturerGroups } from "@features/dashboard/hooks/useLecturerDashboard";
import { useFetchStudentDashboard } from "@features/dashboard/hooks/useDashboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Collapsible nav item with smooth animation.
 * Filters children based on user permissions.
 */
const NavItem = ({
  item,
  depth = 0,
  isCollapsed = false,
  onNavigate,
}: {
  item: SidebarNavItem;
  depth?: number;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentGroupId = searchParams.get("groupId") || "all";
  const expandParam = searchParams.get("expand");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { canRead, isLoading: isLoadingPermissions } = usePermissions();

  const isActive = React.useMemo(() => {
    if (!item.href) return false;
    const isDashboardPath = item.href.startsWith("/dashboard");
    const currentPathIsDashboard = pathname === "/dashboard";
    if (isDashboardPath && currentPathIsDashboard) {
      const hasGroupIdQuery = item.href.includes("groupId=");
      const targetGroupId = hasGroupIdQuery
        ? item.href.split("groupId=")[1]?.split("&")[0]
        : "all";
      return currentGroupId === targetGroupId;
    }
    return item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(item.href + "/");
  }, [item.href, pathname, currentGroupId]);

  const visibleChildren = React.useMemo(() => {
    if (!item.children) return [];
    return item.children.filter((child) => {
      if (!child.feature) return true;
      return canRead(child.feature);
    });
  }, [item.children, canRead]);

  const hasActiveChild = React.useMemo(() => {
    return visibleChildren.some((child) => {
      if (!child.href) return false;
      const isDashboardPath = child.href.startsWith("/dashboard");
      const currentPathIsDashboard = pathname === "/dashboard";
      if (isDashboardPath && currentPathIsDashboard) {
        const hasGroupIdQuery = child.href.includes("groupId=");
        const targetGroupId = hasGroupIdQuery
          ? child.href.split("groupId=")[1]?.split("&")[0]
          : "all";
        return currentGroupId === targetGroupId;
      }
      return child.href === "/"
        ? pathname === "/"
        : pathname === child.href || pathname.startsWith(child.href + "/");
    });
  }, [visibleChildren, pathname, currentGroupId]);

  const highlightClass = React.useMemo(() => {
    if (isActive || hasActiveChild) {
      return "bg-indigo-600 text-white shadow-xs";
    }
    if (expandParam === "groups" && item.labelKey === "navigation.activeGroups") {
      return "bg-indigo-500/80 text-white shadow-xs animate-pulse";
    }
    return "";
  }, [isActive, hasActiveChild, expandParam, item.labelKey]);

  // Expand automatically if a child is active or if requested by the expand parameter
  React.useEffect(() => {
    if (hasActiveChild) {
      setIsExpanded(true);
    } else if (expandParam === "groups" && item.labelKey === "navigation.activeGroups") {
      setIsExpanded(true);
    }
  }, [hasActiveChild, expandParam, item.labelKey]);

  if (item.feature && !isLoadingPermissions) {
    const hasPermission = canRead(item.feature);
    if (!hasPermission) return null;
  }

  if (item.children && visibleChildren.length === 0 && !isLoadingPermissions) {
    return null;
  }

  const handleClick = () => {
    if (item.children && !isCollapsed) {
      setIsExpanded(!isExpanded);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  const Icon = item.icon;
  const labelText = item.label ?? t(item.labelKey);

  // --- COLLAPSED (w-16) MODE ---
  if (isCollapsed) {
    if (item.children) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center justify-center rounded-md p-2.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white",
                highlightClass,
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-52 bg-slate-900 text-slate-100 border-slate-800">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-800 mb-1">
              {labelText}
            </div>
            {visibleChildren.map((child) => {
              const ChildIcon = child.icon;
              return (
                <DropdownMenuItem key={child.href || child.labelKey || child.label} asChild>
                  <Link
                    href={child.href || "#"}
                    onClick={onNavigate}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                  >
                    <ChildIcon className="h-4 w-4 text-slate-400" />
                    <span className="font-mono">{child.label ?? t(child.labelKey)}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {item.href ? (
              <Link
                href={item.href}
                onClick={handleClick}
                className={cn(
                  "flex w-full items-center justify-center rounded-md p-2.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white",
                  isActive && "bg-indigo-600 text-white shadow-xs",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
              </Link>
            ) : (
              <button
                onClick={handleClick}
                className={cn(
                  "flex w-full items-center justify-center rounded-md p-2.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white",
                  isActive && "bg-indigo-600 text-white shadow-xs",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-mono">
            {labelText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // --- FULL (w-64) MODE ---
  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={handleClick}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "text-slate-400 hover:bg-slate-800 hover:text-white",
            highlightClass,
          )}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="font-mono truncate">{labelText}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 flex-shrink-0 transition-transform duration-200",
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
                key={child.href || child.labelKey || child.label}
                item={child}
                depth={depth + 1}
                isCollapsed={isCollapsed}
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
      href={item.href!}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors min-w-0",
        "text-slate-400 hover:bg-slate-800 hover:text-white",
        isActive && "bg-indigo-600 text-white shadow-xs",
      )}
      style={{ paddingLeft: `${12 + depth * 12}px` }}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="font-mono truncate">{labelText}</span>
    </Link>
  );
};

function SidebarNavItems({
  isCollapsed = false,
  handleNavigate,
}: {
  isCollapsed?: boolean;
  handleNavigate: () => void;
}) {
  const { user } = useAuth();
  const roleName = user?.roleName?.toLowerCase() || "";
  const { data: groups = [] } = useFetchLecturerGroups();
  const { data: studentDashboard } = useFetchStudentDashboard();

  const activeGroupsItem: SidebarNavItem | null = React.useMemo(() => {
    if (roleName === "dosen" && groups.length > 0) {
      return {
        labelKey: "navigation.activeGroups",
        icon: GraduationCap,
        children: groups.map((g) => ({
          labelKey: "",
          label: g.name,
          href: `/groups/${g.id}`,
          icon: GraduationCap,
        })),
      };
    }

    if (
      roleName === "mahasiswa" &&
      studentDashboard?.enrolledGroups &&
      studentDashboard.enrolledGroups.length > 0
    ) {
      return {
        labelKey: "navigation.activeGroups",
        icon: GraduationCap,
        children: studentDashboard.enrolledGroups.map((g) => ({
          labelKey: "",
          label: g.groupName,
          href: `/groups/${g.groupId}`,
          icon: GraduationCap,
        })),
      };
    }

    return null;
  }, [roleName, groups, studentDashboard]);

  const menuItems = React.useMemo(() => {
    const items = [...sidebarConfig];
    if (activeGroupsItem) {
      const dashboardIdx = items.findIndex((item) => item.href === "/dashboard");
      if (dashboardIdx !== -1) {
        items.splice(dashboardIdx + 1, 0, activeGroupsItem);
      } else {
        items.unshift(activeGroupsItem);
      }
    }
    return items;
  }, [activeGroupsItem]);

  return (
    <>
      {menuItems.map((item) => (
        <NavItem
          key={item.href || item.labelKey || item.label}
          item={item}
          isCollapsed={isCollapsed}
          onNavigate={handleNavigate}
        />
      ))}
    </>
  );
}

/**
 * Sidebar navigation component.
 * Renders the sidebar with logo badge, navigation items, and logout footer.
 */
export function SidebarNav({
  isOpen,
  isCollapsed = false,
  onClose,
}: {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}) {
  const t = useTranslations();
  const { logout } = useAuth();

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
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-800 bg-slate-900 text-slate-100 transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo / Brand Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-800 transition-all duration-300",
            isCollapsed ? "justify-center px-0" : "px-6 gap-3",
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
            <span className="font-mono text-base font-bold text-white">
              {`>_`}
            </span>
          </div>
          {!isCollapsed && (
            <h1 className="font-mono text-xl font-bold tracking-tight text-white truncate">
              {t(sidebarFooterConfig.nameKey)}
            </h1>
          )}
        </div>

        {/* Navigation Items */}
        <nav className={cn("flex-1 space-y-1 overflow-y-auto p-3", isCollapsed && "px-2")}>
          <Suspense fallback={<div className="h-8 w-full bg-slate-800 animate-pulse rounded-md" />}>
            <SidebarNavItems
              isCollapsed={isCollapsed}
              handleNavigate={handleNavigate}
            />
          </Suspense>
        </nav>

        {/* Logout Button Footer */}
        <div className="border-t border-slate-800 p-3">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className={cn(
                    "flex w-full items-center rounded-md text-sm font-medium text-red-400 transition-colors hover:bg-slate-800 hover:text-red-300",
                    isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                  )}
                >
                  <LogOut className={cn(isCollapsed ? "h-5 w-5 flex-shrink-0" : "h-4 w-4 flex-shrink-0")} />
                  {!isCollapsed && (
                    <span className="font-mono truncate">{t("navigation.logout")}</span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="font-mono">
                  {t("navigation.logout")}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
}
