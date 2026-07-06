import { LucideIcon, LayoutDashboard, Users, Shield, BookOpen, GraduationCap } from "lucide-react";

/**
 * Sidebar navigation item configuration.
 *
 * @property labelKey - Translation key for the menu item
 * @property icon - Lucide icon component
 * @property href - Route path (for single items)
 * @property children - Sub-menu items (for collapsible menus)
 * @property feature - Feature name for permission checking (e.g., "user_management", "RBAC_management")
 *
 * @example
 * // Single menu item
 * { labelKey: "navigation.dashboard", icon: LayoutDashboard, href: "/dashboard" }
 *
 * @example
 * // Menu item with permission check
 * { labelKey: "navigation.users", icon: Users, href: "/management/users", feature: "user_management" }
 *
 * @example
 * // Collapsible menu with children
 * {
 *   labelKey: "navigation.management",
 *   icon: Users,
 *   children: [
 *     { labelKey: "navigation.users", icon: Users, href: "/management/users", feature: "user_management" },
 *     { labelKey: "navigation.roles", icon: Shield, href: "/management/roles", feature: "RBAC_management" }
 *   ]
 * }
 */
export interface SidebarNavItem {
  labelKey: string;
  label?: string;
  icon: LucideIcon;
  href?: string;
  children?: SidebarNavItem[];
  feature?: string;
}

/**
 * System information displayed at the bottom of the sidebar.
 */
export interface SidebarFooter {
  nameKey: string;
  versionKey?: string;
}

/**
 * Sidebar configuration.
 * 
 * Feature names for permission checking:
 * - user_management: "user_management"
 * - rbac_management: "RBAC_management"
 * 
 * Note: Dashboard is always visible to all users (no feature property)
 */
export const sidebarConfig: SidebarNavItem[] = [
  {
    labelKey: "navigation.dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    labelKey: "navigation.materials",
    icon: BookOpen,
    href: "/materials",
  },
  {
    labelKey: "navigation.management",
    icon: Users,
    children: [
      {
        labelKey: "navigation.users",
        icon: Users,
        href: "/management/users",
        feature: "user_management",
      },
      {
        labelKey: "navigation.roles",
        icon: Shield,
        href: "/management/roles",
        feature: "RBAC_management",
      },
    ],
  },
];

/**
 * Sidebar footer configuration.
 * Edit here to change the system name and version.
 */
export const sidebarFooterConfig: SidebarFooter = {
  nameKey: "navigation.systemName",
  versionKey: "navigation.systemVersion",
};
