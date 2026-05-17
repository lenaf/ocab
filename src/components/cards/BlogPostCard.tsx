import type { BlogPost } from "@/payload-types";

export function BlogPostCard({ item }: { item: BlogPost }) {
  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;
  const imageUrl = typeof item.image === "object" ? item.image?.url : null;

  return (
    <a href={`/blog/${item.slug}`} className="block group h-full">
      <div className="overflow-hidden border border-base-300 hover:shadow-lg transition-shadow h-full flex flex-col">
        {imageUrl && <img src={imageUrl} alt={item.title} className="w-full aspect-video object-cover" />}
        <div className="p-4 flex-1 flex flex-col">
          {item.category && <span className="text-xs font-bold uppercase text-accent mb-1 block">{item.category.replace("-", " ")}</span>}
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex-1">{item.title}</h3>
          {item.excerpt && <p className="text-sm opacity-70 mt-2 line-clamp-2">{item.excerpt}</p>}
          {date && <p className="text-xs opacity-50 mt-3">{date}</p>}
        </div>
      </div>
    </a>
  );
}
