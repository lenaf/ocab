"use client";

import React from "react";
import { useField, FieldLabel } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";

export const ColorPickerField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path });

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <FieldLabel label={field.label || "Color"} path={path} />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
        <input
          type="color"
          value={value || "#3CA0DB"}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "40px",
            height: "40px",
            padding: 0,
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: "4px",
            cursor: "pointer",
            background: "none",
          }}
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#3CA0DB"
          style={{
            flex: 1,
            padding: "0.5rem",
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: "4px",
            background: "var(--theme-input-bg)",
            color: "var(--theme-elevation-1000)",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            style={{
              padding: "0.5rem",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--theme-elevation-500)",
              fontSize: "14px",
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
