"use client";

import { useField } from "@payloadcms/ui";
import { useState } from "react";
import { Modal } from "./ui/Modal";
import { ColorSwatch } from "./ui/ColorSwatch";
import { colorOptions } from "./ui/colorOptions";

export const ColorSchemeField = () => {
  const { value, setValue } = useField<string>();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = colorOptions.find((opt) => opt.value === value);

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "13px", color: "#333" }}>
        Color Scheme
      </label>
      <ColorSwatch
        label={selectedOption?.label || "Select color..."}
        bg={selectedOption?.bg || "#f3f4f6"}
        text={selectedOption?.text || "#6b7280"}
        onClick={() => setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Color Scheme">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {colorOptions.map((option) => (
            <ColorSwatch
              key={option.value}
              label={option.label}
              bg={option.bg}
              text={option.text}
              isSelected={value === option.value}
              onClick={() => {
                setValue(option.value);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};
