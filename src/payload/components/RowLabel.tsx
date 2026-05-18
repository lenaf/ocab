"use client";

import { useRowLabel } from "@payloadcms/ui";

const DATA_SOURCE_LABELS: Record<string, string> = {
  events: "Events",
  "blog-posts": "Blog",
  "press-articles": "Press",
  books: "Books",
  "team-members": "Team",
  campaigns: "Work",
  products: "Products",
  tags: "Tags",
};

const LAYOUT_LABELS: Record<string, string> = {
  grid: "Grid",
  list: "List",
  carousel: "Carousel",
  featured: "Featured",
};

export function BlockLabel() {
  const { data } = useRowLabel<{ label?: string; title?: string; dataSource?: string; layout?: string }>();
  if (data?.label) return <span>{data.label}</span>;
  if (data?.title) return <span>{data.title}</span>;
  if (data?.dataSource) {
    const source = DATA_SOURCE_LABELS[data.dataSource] || data.dataSource;
    const layout = data.layout ? LAYOUT_LABELS[data.layout] || data.layout : "";
    return <span>{layout ? `${source} — ${layout}` : source}</span>;
  }
  return null;
}

export function NavItemRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string }>();
  if (data?.label) return <span>{data.label}</span>;
  return <span>{`Item ${String(rowNumber).padStart(2, "0")}`}</span>;
}

export function CtaButtonRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string }>();
  if (data?.label) return <span>{data.label}</span>;
  return <span>{`Button ${String(rowNumber).padStart(2, "0")}`}</span>;
}
