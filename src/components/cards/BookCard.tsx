import type { Book } from "@/payload-types";

export function BookCard({ item }: { item: Book }) {
  const coverUrl = typeof item.cover === "object" ? item.cover?.url : null;

  return (
    <a href={item.url || "#"} className="block group">
      {coverUrl && (
        <img src={coverUrl} alt={item.title}
          className="w-full aspect-[2/3] object-cover shadow-lg group-hover:shadow-xl transition-shadow" />
      )}
      <div className="mt-3">
        <h3 className="font-bold text-sm leading-tight">{item.title}</h3>
        {item.author && <p className="text-sm opacity-60 mt-0.5">{item.author}</p>}
      </div>
    </a>
  );
}
