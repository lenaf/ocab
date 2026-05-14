import type { CollectionConfig } from "payload";
import { slugify } from "../utils/slugify";

export const Campaigns: CollectionConfig = {
  slug: "campaigns",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "featured"],
    description: "Issue-based campaigns OCAB is running or has run",
    group: "📚 Collections",
    listSearchableFields: ["title", "slug"],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/campaigns/${doc.slug}`,
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
      name: "featured",
      type: "checkbox",
      label: "Feature on Homepage",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "order",
      type: "number",
      label: "Display Order",
      admin: { position: "sidebar", description: "Lower numbers appear first" },
    },
    { name: "summary", type: "textarea", label: "Short Summary (for cards)" },
    { name: "content", type: "richText", label: "Full Description" },
    { name: "image", type: "upload", relationTo: "media" as never },
    { name: "learnMoreUrl", type: "text", label: "Learn More URL" },
    { name: "callToAction", type: "text", label: "CTA Button Label", defaultValue: "Learn More" },
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
