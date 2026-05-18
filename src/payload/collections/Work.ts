import type { CollectionConfig } from "payload";
import { slugify } from "../utils/slugify";
import { revalidate } from "../utils/revalidate";

export const Work: CollectionConfig = {
  slug: "campaigns",
  labels: { singular: "Work", plural: "Work" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "year", "tags"],
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
    afterChange: [
      async ({ doc }) => { await revalidate(["/", "/work", `/work/${doc.slug}`]); },
    ],
    afterDelete: [
      async () => { await revalidate(["/", "/work"]); },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", unique: true, admin: { position: "sidebar" } },
    {
      name: "year",
      type: "number",
      label: "Start Year",
      admin: { position: "sidebar" },
    },
    {
      name: "endYear",
      type: "select",
      label: "End Year",
      options: [
        { label: "Same year (ended)", value: "same" },
        { label: "Present (ongoing)", value: "present" },
        ...Array.from({ length: 30 }, (_, i) => {
          const y = new Date().getFullYear() - i;
          return { label: String(y), value: String(y) };
        }),
      ],
      admin: {
        position: "sidebar",
        condition: (_, s) => !!s?.year,
        description: "Leave as 'Same year' if it started and ended in the same year",
      },
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
      ],
    },
  ],
};
