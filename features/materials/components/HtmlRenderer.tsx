"use client";

import { useMemo } from "react";

interface HtmlRendererProps {
  content: string;
  className?: string;
}

export function HtmlRenderer({ content, className = "" }: HtmlRendererProps) {
  const html = useMemo(() => {
    if (!content) return "";
    return content;
  }, [content]);

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}