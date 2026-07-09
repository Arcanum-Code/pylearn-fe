"use client";

import React from "react";
import { SidebarNav, Navbar } from "@features/layout";
import { cn } from "@/lib/utils";

/**
 * Main layout for authenticated pages.
 * Wraps all pages in app/(main) with the sidebar and navbar.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar - fixed position with mobile toggle support */}
      <div className="lg:hidden">
        <SidebarNav
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={false}
        />
      </div>

      {/* Desktop sidebar - always visible, supports collapse to w-16 */}
      <div className="hidden lg:block">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      {/* Main content area - dynamic left padding based on isCollapsed */}
      <div
        className={cn(
          "flex flex-1 flex-col w-full min-w-0 transition-all duration-300",
          isCollapsed ? "lg:pl-16" : "lg:pl-64",
        )}
      >
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-6 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
