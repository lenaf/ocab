export function Button({
  classNames,
  size,
  children,
  href,
  onClick,
}: {
  classNames: string;
  size?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const sizeClass = size ? `btn-${size}` : "";
  const buttonClass = `btn ${classNames} ${sizeClass}`.trim();

  if (href) {
    return (
      <a href={href} className={buttonClass}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
}
