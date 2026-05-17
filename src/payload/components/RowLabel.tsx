"use client";

import { useRowLabel } from "@payloadcms/ui";

export function SectionRowLabel() {
  const { data } = useRowLabel<{ label?: string; title?: string }>();
  const label = data?.label || data?.title;
  if (label) return <span>{label}</span>;
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
