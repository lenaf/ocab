"use client";

import { useField } from "@payloadcms/ui";
import { Button } from "@/components/ui/Button";

export const ButtonStylePreviewField = () => {
  const { value, setValue } = useField<string>();

  const buttonStyles = [
    { label: "Primary", value: "btn-primary" },
    { label: "Secondary", value: "btn-secondary" },
    { label: "Accent", value: "btn-accent" },
    { label: "Neutral", value: "btn-neutral" },
    { label: "Outline", value: "btn-outline" },
    { label: "Outline Primary", value: "btn-outline btn-primary" },
    { label: "Outline Secondary", value: "btn-outline btn-secondary" },
    { label: "Outline Accent", value: "btn-outline btn-accent" },
    { label: "Ghost", value: "btn-ghost" },
    { label: "Link", value: "btn-link" },
  ];

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "12px", fontWeight: "600", fontSize: "14px" }}>
        Choose Button Style
      </label>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
        gap: "12px",
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        {buttonStyles.map((style) => (
          <div
            key={style.value}
            onClick={() => setValue(style.value)}
            style={{
              padding: "12px",
              backgroundColor: value === style.value ? "#dbeafe" : "#ffffff",
              border: value === style.value ? "2px solid #3b82f6" : "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Button classNames={style.value}>
              Button
            </Button>
            <span style={{ fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
              {style.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
