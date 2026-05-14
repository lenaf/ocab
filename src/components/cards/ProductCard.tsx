import type { Product } from "@/payload-types";

export function ProductCard({ item }: { item: Product }) {
  const imageUrl = typeof item.image === "object" ? item.image?.url : null;

  return (
    <a href={item.url || "#"} className={`block group ${item.outOfStock ? "opacity-60" : ""}`}>
      <div className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {imageUrl && (
          <img src={imageUrl} alt={item.name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
        <div className="pt-3">
          <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
          <div className="mt-1">
            {item.outOfStock
              ? <span className="text-sm opacity-50">Out of stock</span>
              : <span className="text-sm font-semibold">{item.price}</span>}
          </div>
        </div>
      </div>
    </a>
  );
}
