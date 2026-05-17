import type { CollectionConfig } from "payload";
import { slugify } from "../utils/slugify";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
    group: "📚 Collections",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data?.slug) data.slug = slugify(data.name);
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", unique: true, admin: { position: "sidebar" } },
  ],
};
