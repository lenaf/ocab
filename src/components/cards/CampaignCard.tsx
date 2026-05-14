import type { Campaign } from "@/payload-types";

export function CampaignCard({ item }: { item: Campaign }) {
  const imageUrl = typeof item.image === "object" ? item.image?.url : null;

  return (
    <a href={item.learnMoreUrl || `/campaigns/${item.slug}`} className="block group h-full">
      <div className="rounded-lg overflow-hidden border border-base-300 hover:shadow-lg transition-shadow h-full flex flex-col">
        {imageUrl && <img src={imageUrl} alt={item.title} className="w-full aspect-video object-cover" />}
        <div className="p-4 flex-1 flex flex-col">
          {item.status && (
            <span className={`text-xs font-bold uppercase mb-2 block ${item.status === "active" ? "text-accent" : "opacity-50"}`}>
              {item.status}
            </span>
          )}
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex-1">{item.title}</h3>
          {item.summary && <p className="text-sm opacity-70 mt-2 line-clamp-3">{item.summary}</p>}
          <span className="mt-4 text-sm font-bold text-primary group-hover:underline">{item.callToAction || "Learn More"} →</span>
        </div>
      </div>
    </a>
  );
}
