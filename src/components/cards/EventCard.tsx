import type { Event } from "@/payload-types";

export function EventCard({ item }: { item: Event }) {
  const date = item.startDate
    ? new Date(item.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : null;
  const imageUrl = typeof item.image === "object" ? item.image?.url : null;

  return (
    <a href={`/events/${item.slug}`} className="block group h-full">
      <div className="rounded-lg overflow-hidden border border-base-300 hover:shadow-lg transition-shadow h-full flex flex-col">
        {imageUrl && <img src={imageUrl} alt={item.title} className="w-full aspect-video object-cover" />}
        <div className="p-4 flex-1 flex flex-col">
          {date && <p className="text-sm font-semibold text-accent mb-1">{date}</p>}
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex-1">{item.title}</h3>
          {item.location?.venue && (
            <p className="text-sm opacity-70 mt-1">{item.location.venue}{item.location.city ? ` — ${item.location.city}` : ""}</p>
          )}
          <div className="mt-3 flex gap-2 flex-wrap">
            {item.ticketed && <span className="badge badge-accent text-xs">Ticketed</span>}
            {item.eventType && <span className="badge badge-ghost text-xs capitalize">{item.eventType.replace("-", " ")}</span>}
          </div>
        </div>
      </div>
    </a>
  );
}
