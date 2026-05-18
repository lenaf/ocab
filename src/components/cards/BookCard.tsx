// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function BookCard({ item, getItemImage }: { item: AnyRecord; getItemImage: (item: AnyRecord) => string }) {
  const coverUrl = getItemImage(item);

  return (
    <div className="overflow-hidden shadow-md bg-white text-gray-900 border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
      {coverUrl ? (
        <img src={coverUrl} alt={item.title as string} className="w-full h-52 object-cover" />
      ) : (
        <div className="w-full h-52 bg-primary/10 flex items-center justify-center text-4xl">📚</div>
      )}
      <div className="p-4 flex-1">
        <h3 className="font-bold text-sm mb-1 line-clamp-2">{item.title as string}</h3>
        {item.author && <p className="text-xs opacity-75">{item.author as string}</p>}
        {item.year && <p className="text-xs opacity-50">{item.year as string}</p>}
      </div>
    </div>
  );
}
