"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BrandColor } from "@/payload-types";

export const BrandColorsGridView = () => {
  const [colors, setColors] = useState<BrandColor[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/brand-colors?limit=100")
      .then((res) => res.json())
      .then((data) => setColors(data.docs || []));
  }, []);

  const getColorStyle = (color: BrandColor) => {
    if (color.colorType === "gradient" && color.gradient?.stops) {
      const stops = color.gradient.stops
        .map((stop) => `${stop.hexValue} ${stop.position}%`)
        .join(", ");
      return {
        background: `linear-gradient(${color.gradient.angle || 90}deg, ${stops})`,
        opacity: color.opacity || 1,
      };
    }
    return {
      backgroundColor: color.hexValue || "#000000",
      opacity: color.opacity || 1,
    };
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {colors.map((color) => (
          <div
            key={color.id}
            onClick={() => router.push(`/admin/collections/brand-colors/${color.id}`)}
            style={{
              cursor: "pointer",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ ...getColorStyle(color), height: "120px" }} />
            <div style={{ padding: "12px", backgroundColor: "#fff" }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                {color.name}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {color.colorType === "gradient" ? "Gradient" : color.hexValue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
