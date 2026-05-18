// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function ProductCard({ item, getItemImage }: { item: AnyRecord; getItemImage: (item: AnyRecord) => string }) {
  const imageUrl = getItemImage(item);

  return (
    <div className="overflow-hidden shadow-md bg-white text-gray-900 border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
      {imageUrl ? (
        <img src={imageUrl} alt={item.name as string} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-base-200 flex items-center justify-center text-3xl">🛍️</div>
      )}
      <div className="p-4 flex-1">
        <h3 className="font-bold text-sm mb-1">{(item.name || item.title) as string}</h3>
        <span className="font-bold text-primary">{item.price ? `$${item.price}` : "Price TBD"}</span>
        {item.outOfStock && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5">Out of Stock</span>}
      </div>
    </div>
  );
}
