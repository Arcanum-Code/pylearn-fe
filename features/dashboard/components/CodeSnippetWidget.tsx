"use client";

import { TerminalTile } from "@/components/ui/terminal-tile";

/**
 * "Code Snippet of the Day" widget for the dashboard.
 * Displays a Python code snippet inside a terminal-styled tile.
 * This is the signature dark accent tile in the bento grid.
 *
 * Syntax highlighting uses inline Tailwind arbitrary color values
 * matching a Material-style code theme:
 *   - #C792EA  → keywords (for, in, if) and variable declarations
 *   - #82AAFF  → built-in functions (print) and identifiers
 *   - #F78C6C  → numeric literals
 *   - #C3E88D  → string literals
 *
 * @example
 * <CodeSnippetWidget />
 */
export function CodeSnippetWidget() {
  return (
    <TerminalTile title="python3 — tip_of_the_day.py">
      <div className="space-y-0.5">
        {/* Prompt line */}
        <p className="text-terminal-muted">
          <span className="text-terminal-accent">$</span> python3
          tip_of_the_day.py
        </p>

        {/* Comment */}
        <p className="mt-3 text-terminal-muted">
          # 💡 List comprehension with condition
        </p>

        {/* Code: numbers = [...] */}
        <p>
          <span className="text-[#C792EA]">numbers</span>
          {" = ["}
          <span className="text-[#F78C6C]">1, 2, 3, 4, 5, 6, 7, 8, 9, 10</span>
          {"]"}
        </p>

        {/* Code: evens = [x for x in numbers if x % 2 == 0] */}
        <p>
          <span className="text-[#C792EA]">evens</span>
          {" = ["}
          <span className="text-[#82AAFF]">x</span>
          <span className="text-[#C792EA]"> for </span>
          <span className="text-[#82AAFF]">x</span>
          <span className="text-[#C792EA]"> in </span>
          <span className="text-[#82AAFF]">numbers</span>
          <span className="text-[#C792EA]"> if </span>
          <span className="text-[#82AAFF]">x</span>
          {" % "}
          <span className="text-[#F78C6C]">2</span>
          {" == "}
          <span className="text-[#F78C6C]">0</span>
          {"]"}
        </p>

        {/* Code: print(...) */}
        <p className="mt-1">
          <span className="text-[#82AAFF]">print</span>
          {"("}
          <span className="text-[#C3E88D]">
            {`f"Even numbers: {evens}"`}
          </span>
          {")"}
        </p>

        {/* Output */}
        <p className="mt-3 text-terminal-accent">
          <span className="text-terminal-muted">→</span> Even numbers: [2, 4,
          6, 8, 10]
        </p>
      </div>
    </TerminalTile>
  );
}
