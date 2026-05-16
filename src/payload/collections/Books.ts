import type { CollectionConfig } from "payload";

export const Books: CollectionConfig = {
  slug: "books",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "year", "featured", "order"],
    description: "Books on the OCAB bookshelf",
    group: "📚 Collections",
    listSearchableFields: ["title", "author"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "author", type: "text" },
    { name: "year", type: "number", label: "Publication Year", admin: { position: "sidebar" } },
    { name: "isbn", type: "text", label: "ISBN (optional)", admin: { position: "sidebar" } },
    { name: "description", type: "textarea" },
    { name: "cover", type: "upload", relationTo: "media" as never },
    { name: "url", type: "text", label: "Purchase / Info Link" },
    { name: "featured", type: "checkbox", label: "Feature on Homepage", defaultValue: true, admin: { position: "sidebar" } },
    { name: "order", type: "number", label: "Display Order", admin: { position: "sidebar" } },
  ],
};
