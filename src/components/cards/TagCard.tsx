import Link from "next/link";
import { themeConfig } from "@/config/theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function TagCard({ item }: { item: AnyRecord }) {
  const tagColor = (item.color as string) || themeConfig.colors.primary;

  return (
    <Link href={`/tags/${item.slug as string}`} className="block">
      <div
        className="aspect-square w-full flex items-center justify-center p-4 transition-opacity hover:opacity-80"
        style={{ backgroundColor: tagColor }}
      >
        <span className="font-bold text-base text-white text-center uppercase tracking-wide">{item.name as string}</span>
      </div>
    </Link>
  );
}
