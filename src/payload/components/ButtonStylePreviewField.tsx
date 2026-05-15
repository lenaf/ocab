"use client";

import { useState, useRef, useEffect } from "react";
import { useField } from "@payloadcms/ui";

const BUTTON_STYLES: {
  label: string;
  value: string;
  bg: string;
  color: string;
  border?: string;
}[] = [
  { label: "Primary (Blue)", value: "btn-primary", bg: "#1C86EE", color: "#fff" },
  { label: "Secondary (Dark)", value: "btn-secondary", bg: "#1A1A1A", color: "#fff" },
  { label: "Accent (Orange)", value: "btn-accent", bg: "#E05B2B", color: "#fff" },
  { label: "Neutral", value: "btn-neutral", bg: "#1A1A1A", color: "#fff" },
  { label: "Outline", value: "btn-outline", bg: "transparent", color: "#1A1A1A", border: "2px solid #1A1A1A" },
  { label: "Outline Primary", value: "btn-outline btn-primary", bg: "transparent", color: "#1C86EE", border: "2px solid #1C86EE" },
  { label: "Outline Accent", value: "btn-outline btn-accent", bg: "transparent", color: "#E05B2B", border: "2px solid #E05B2B" },
  { label: "Ghost", value: "btn-ghost", bg: "transparent", color: "#1A1A1A" },
  { label: "Link Style", value: "btn-link", bg: "transparent", color: "#1C86EE" },
];

function ButtonPreview({ style, size = "small" }: { style: typeof BUTTON_STYLES[number]; size?: "small" | "normal" }) {
  const padding = size === "small" ? "4px 10px" : "6px 14px";
  const fontSize = size === "small" ? "11px" : "12px";
  return (
    <span
      style={{
        display: "inline-block",
        padding,
        fontSize,
        fontWeight: 700,
        borderRadius: "4px",
        backgroundColor: style.bg,
        color: style.color,
        border: style.border || (style.bg === "transparent" ? "1px solid #e5e7eb" : "none"),
        textDecoration: style.value === "btn-link" ? "underline" : "none",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      Button
    </span>
  );
}

export const ButtonStylePreviewField = () => {
  const { value, setValue } = useField<string>();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = BUTTON_STYLES.find((s) => s.value === value) || BUTTON_STYLES[0];

  return (
    <div ref={ref} style={{ position: "relative", marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>
        Button Style
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "#fff",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          textAlign: "left",
        }}
      >
        <ButtonPreview style={selected} />
        <span style={{ flex: 1, color: "#374151" }}>{selected.label}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path d="M4 6l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: "4px",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 100,
          maxHeight: "280px",
          overflowY: "auto",
        }}>
          {BUTTON_STYLES.map((style) => (
            <div
              key={style.value}
              onClick={() => { setValue(style.value); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                cursor: "pointer",
                backgroundColor: value === style.value ? "#eff6ff" : "transparent",
                borderLeft: value === style.value ? "3px solid #3b82f6" : "3px solid transparent",
                transition: "background-color 0.1s",
              }}
              onMouseEnter={(e) => { if (value !== style.value) (e.currentTarget.style.backgroundColor = "#f9fafb"); }}
              onMouseLeave={(e) => { if (value !== style.value) (e.currentTarget.style.backgroundColor = "transparent"); }}
            >
              <ButtonPreview style={style} size="normal" />
              <span style={{ fontSize: "13px", color: "#374151" }}>{style.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
