import type { TeamMember } from "@/payload-types";

export function TeamMemberCard({ item }: { item: TeamMember }) {
  const photoUrl = typeof item.photo === "object" ? item.photo?.url : null;

  return (
    <div className="text-center">
      {photoUrl
        ? <img src={photoUrl} alt={item.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-3 shadow-md" />
        : (
          <div className="w-32 h-32 rounded-full bg-base-300 mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-base-content/40">
            {item.name.charAt(0)}
          </div>
        )
      }
      <h3 className="font-bold text-base">{item.name}</h3>
      {item.role && <p className="text-sm opacity-70 mt-1">{item.role}</p>}
      {item.type && <span className="text-xs font-semibold uppercase text-accent mt-1 block">{item.type}</span>}
    </div>
  );
}
