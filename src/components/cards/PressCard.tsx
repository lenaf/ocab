// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function PressCard({ item, getItemImage }: { item: AnyRecord; getItemImage: (item: AnyRecord) => string }) {
  const imageUrl = getItemImage(item);

  return (
    <div className="overflow-hidden shadow-md bg-white text-gray-900 border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
      {imageUrl && <img src={imageUrl} alt={item.title as string} className="w-full h-44 object-cover" />}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {item.publication && <span className="text-xs font-bold text-accent">{item.publication as string}</span>}
          {item.type && <span className="text-xs opacity-50 capitalize">{(item.type as string).replace("-", " ")}</span>}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
        {item.excerpt && <p className="text-sm opacity-75 line-clamp-3 flex-1">{item.excerpt as string}</p>}
        {item.publishedAt && <p className="text-xs opacity-50 mt-auto pt-2">{new Date(item.publishedAt as string).toLocaleDateString()}</p>}
      </div>
    </div>
  );
}
