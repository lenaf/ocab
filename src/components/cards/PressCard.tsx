import type { PressArticle } from "@/payload-types";

export function PressCard({ item }: { item: PressArticle }) {
  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
  const imageUrl = typeof item.image === "object" ? item.image?.url : null;

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
      <div className="overflow-hidden border border-base-300 hover:shadow-lg transition-shadow h-full flex flex-col">
        {imageUrl && <img src={imageUrl} alt={item.title} className="w-full aspect-video object-cover" />}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-base group-hover:text-primary transition-colors flex-1">{item.title}</h3>
          <div className="mt-3 flex justify-between items-center text-sm">
            {item.publication && <span className="font-semibold text-accent">{item.publication}</span>}
            {date && <span className="opacity-60">{date}</span>}
          </div>
        </div>
      </div>
    </a>
  );
}
