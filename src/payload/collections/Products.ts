import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "outOfStock", "order"],
    description: "OCAB merch and products",
    group: "📚 Collections",
    listSearchableFields: ["name"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "price", type: "text", label: "Price (e.g. $25.00)" },
    { name: "outOfStock", type: "checkbox", label: "Out of Stock", defaultValue: false, admin: { position: "sidebar" } },
    { name: "featured", type: "checkbox", label: "Feature on Homepage", defaultValue: true, admin: { position: "sidebar" } },
    { name: "order", type: "number", label: "Display Order", admin: { position: "sidebar" } },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" as never },
    { name: "url", type: "text", label: "Product Link (external shop)" },
  ],
};
