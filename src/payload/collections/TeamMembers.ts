import type { CollectionConfig } from "payload";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "type", "order"],
    description: "OCAB staff, board members, and volunteer leaders",
    group: "📚 Collections",
    listSearchableFields: ["name", "role", "email"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", label: "Title / Role" },
    { name: "pronouns", type: "text", label: "Pronouns", admin: { placeholder: "e.g. she/her, he/they" } },
    {
      name: "type",
      type: "select",
      label: "Member Type",
      options: [
        { label: "Staff", value: "staff" },
        { label: "Board Member", value: "board" },
        { label: "Volunteer Leader", value: "volunteer" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "featured", type: "checkbox", label: "Feature on Team Page", defaultValue: true, admin: { position: "sidebar" } },
    { name: "order", type: "number", label: "Display Order", admin: { position: "sidebar", description: "Lower numbers appear first" } },
    { name: "bio", type: "richText" },
    { name: "photo", type: "upload", relationTo: "media" as never },
    { name: "email", type: "email", admin: { position: "sidebar" } },
  ],
};
