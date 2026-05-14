import type { Research } from "@/payload-types";

const TYPE_LABELS: Record<string, string> = {
  "report": "Research Report",
  "field-guide": "Field Guide",
  "policy-brief": "Policy Brief",
  "white-paper": "White Paper",
  "toolkit": "Toolkit",
  "survey": "Survey / Data",
};

export function ResearchCard({ item }: { item: Research }) {
  const coverUrl = typeof item.coverImage === "object" ? item.coverImage?.url : null;
  const href = item.accessType === "url" && item.externalUrl
    ? item.externalUrl
    : item.accessType === "pdf" && typeof item.pdf === "object" && item.pdf?.url
    ? item.pdf.url
    : `/research/${item.slug}`;
  const isExternal = item.accessType === "url" || item.accessType === "pdf";
  const date = item.publishedAt
    ? new Date(item.publishedAt).getFullYear().toString()
    : null;

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block group h-full"
    >
      <div className="rounded-lg overflow-hidden border border-base-300 hover:shadow-lg transition-shadow h-full flex flex-col">
        {coverUrl
          ? <img src={coverUrl} alt={item.title} className="w-full aspect-[3/4] object-cover" />
          : (
            <div className="w-full aspect-[3/4] bg-neutral flex items-center justify-center p-6">
              <span className="text-neutral-content text-center font-bold text-lg leading-tight">{item.title}</span>
            </div>
          )
        }
        <div className="p-4 flex-1 flex flex-col">
          {item.type && (
            <span className="text-xs font-bold uppercase text-accent mb-1 block">
              {TYPE_LABELS[item.type] || item.type}
            </span>
          )}
          <h3 className="font-bold text-base group-hover:text-primary transition-colors flex-1 leading-tight">
            {item.title}
          </h3>
          {item.authors && <p className="text-sm opacity-60 mt-1">{item.authors}</p>}
          {date && <p className="text-xs opacity-40 mt-1">{date}</p>}
          <span className="mt-3 text-sm font-bold text-primary group-hover:underline">
            {item.ctaLabel || "Read more"} →
          </span>
        </div>
      </div>
    </a>
  );
}
