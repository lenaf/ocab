export const ColorSwatch = ({
  label,
  bg,
  text,
  isSelected,
  onClick,
}: {
  label: string;
  bg: string;
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      padding: "8px 16px",
      backgroundColor: bg,
      color: text,
      border: isSelected ? "3px solid #3b82f6" : "1px solid #e5e7eb",
      borderRadius: "4px",
      cursor: onClick ? "pointer" : "default",
      textAlign: "center",
      fontSize: "13px",
      fontWeight: "500",
      transition: "all 0.15s",
      boxShadow: isSelected ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {label}
  </div>
);
