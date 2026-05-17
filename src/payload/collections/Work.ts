import type { CollectionConfig } from "payload";
import { slugify } from "../utils/slugify";

export const Work: CollectionConfig = {
  slug: "campaigns",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "featured"],
    description: "Campaigns, research, reports, and other OCAB work",
    group: "📚 Collections",
    listSearchableFields: ["title", "slug", "summary"],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/work/${doc.slug}`,
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
        if (data?.title && !data?.slug) data.slug = slugify(data.title);
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", unique: true, admin: { position: "sidebar" } },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Past", value: "past" },
        { label: "Upcoming", value: "upcoming" },
      ],
      defaultValue: "active",
      admin: { position: "sidebar" },
    },
    {
      name: "year",
      type: "number",
      label: "Year",
      admin: { position: "sidebar" },
    },
    {
      name: "endYear",
      type: "number",
      label: "End Year (if multi-year)",
      admin: { position: "sidebar", condition: (_, s) => !!s?.year },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Featured",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags" as never,
      hasMany: true,
      label: "Tags",
      admin: { position: "sidebar" },
    },
    { name: "summary", type: "textarea", label: "Short Summary (for cards)" },
    { name: "content", type: "richText", label: "Content" },
    { name: "image", type: "upload", relationTo: "media" as never, label: "Cover Image" },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      admin: { position: "sidebar" },
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea", maxLength: 160 },
        { name: "ogImage", type: "upload", relationTo: "media" as never },
      ],
    },
  ],
};
