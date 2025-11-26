export function Button({
  href,
  children,
  variant = "solid",
  size = "default",
  color,
  textColor,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "transparent";
  size?: "sm" | "default" | "lg";
  color?: string;
  textColor?: string;
  className?: string;
}) {
  const sizeClasses =
    size === "sm"
      ? "px-4 py-2 text-sm"
      : size === "lg"
        ? "px-8 py-4 text-lg"
        : "px-6 py-3";
  const baseClasses = `inline-block transition-all hover:opacity-90 hover:scale-105 ${sizeClasses}`;
  const variantClasses =
    variant === "transparent" ? "border-2 bg-transparent" : "";
  const style =
    variant === "transparent"
      ? {
          borderColor: color || "#3D9BE9",
          color: textColor || color || "#3D9BE9",
          backgroundColor: "transparent",
        }
      : { backgroundColor: color || "#3D9BE9", color: textColor || "#ffffff" };

  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
    >
      {children}
    </a>
  );
}
