// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function EventCard({ item, getItemImage }: { item: AnyRecord; getItemImage: (item: AnyRecord) => string }) {
  const imageUrl = getItemImage(item);
  const startDate = item.startDate ? new Date(item.startDate as string) : null;
  const location = item.location as AnyRecord | undefined;

  return (
    <div className="overflow-hidden shadow-md bg-white text-gray-900 border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
      {imageUrl && <img src={imageUrl} alt={item.title as string} className="w-full h-44 object-cover" />}
      <div className="p-5 flex-1 flex flex-col">
        {startDate && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5">
              {startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
            {item.eventType && <span className="text-xs opacity-60 capitalize">{(item.eventType as string).replace("-", " ")}</span>}
          </div>
        )}
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
        {location?.venue && <p className="text-sm opacity-60">{location.venue as string}</p>}
      </div>
    </div>
  );
}
