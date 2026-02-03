"use client";

import type { BrandColor } from "@/payload-types";

export const ColorCell = ({ rowData }: { rowData: BrandColor }) => {
  const getColorStyle = () => {
    if (rowData.colorType === "gradient" && rowData.gradient?.stops) {
      const stops = rowData.gradient.stops
        .map((stop) => `${stop.hexValue} ${stop.position}%`)
        .join(", ");
      return {
        background: `linear-gradient(${rowData.gradient.angle || 90}deg, ${stops})`,
        opacity: rowData.opacity || 1,
      };
    }
    return {
      backgroundColor: rowData.hexValue || "#000000",
      opacity: rowData.opacity || 1,
    };
  };

  return (
    <div
      style={{
        ...getColorStyle(),
        width: "60px",
        height: "40px",
        borderRadius: "4px",
        border: "1px solid #e5e7eb",
      }}
    />
  );
};
