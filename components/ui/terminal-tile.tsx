import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A dark "terminal" surface tile component.
 * Uses the terminal design tokens: --terminal-bg, --terminal-fg, etc.
 *
 * Renders a macOS-style title bar with traffic-light dots and a monospace content area.
 * Use as a deliberate dark accent tile within the light bento grid to evoke a code editor.
 *
 * @example
 * <TerminalTile title="python3 — script.py">
 *   <p>print("Hello, World!")</p>
 * </TerminalTile>
 */

interface TerminalTileProps extends React.ComponentProps<"div"> {
  /** Text displayed in the title bar next to the traffic-light dots */
  title?: string;
}

function TerminalTile({
  title = "terminal",
  className,
  children,
  ...props
}: TerminalTileProps) {
  return (
    <div
      data-slot="terminal-tile"
      className={cn(
        "overflow-hidden rounded-xl bg-terminal-bg text-terminal-fg",
        className,
      )}
      {...props}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-error" />
          <div className="h-3 w-3 rounded-full bg-warning" />
          <div className="h-3 w-3 rounded-full bg-success" />
        </div>
        <span className="ml-2 font-mono text-xs text-terminal-muted">
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-4 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export { TerminalTile };
