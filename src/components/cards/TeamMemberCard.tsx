// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function TeamMemberCard({ item, getItemImage }: { item: AnyRecord; getItemImage: (item: AnyRecord) => string }) {
  const photoUrl = getItemImage(item);

  return (
    <div className="text-center">
      {photoUrl ? (
        <img src={photoUrl} alt={item.name as string} className="w-32 h-32 rounded-full object-cover mx-auto mb-3" />
      ) : (
        <div className="w-32 h-32 rounded-full bg-base-200 mx-auto mb-3 flex items-center justify-center text-3xl font-bold opacity-40">
          {(item.name as string)?.charAt(0)}
        </div>
      )}
      <h3 className="font-bold text-lg">{item.name as string}</h3>
      {item.role && <p className="text-sm opacity-75">{item.role as string}</p>}
      {item.pronouns && <p className="text-xs opacity-50">{item.pronouns as string}</p>}
    </div>
  );
}
