// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function WorkCard({ item, getItemImage }: { item: AnyRecord; getItemImage: (item: AnyRecord) => string }) {
  const imageUrl = getItemImage(item);

  return (
    <div className="overflow-hidden shadow-md bg-neutral text-neutral-content transition-shadow hover:shadow-lg h-full flex flex-col">
      {imageUrl && <img src={imageUrl} alt={item.title as string} className="w-full h-44 object-cover" />}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
        {item.summary && <p className="text-sm opacity-80 line-clamp-3 flex-1">{item.summary as string}</p>}
      </div>
    </div>
  );
}
