import type { CollectionConfig } from "payload";
import { slugify } from "../utils/slugify";

export const Research: CollectionConfig = {
  slug: "research",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "publishedAt", "featured"],
    description: "OCAB's original research, reports, field guides, and publications",
    group: "📚 Collections",
    listSearchableFields: ["title", "authors", "summary"],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/research/${doc.slug}`,
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
      name: "type",
      type: "select",
      label: "Publication Type",
      required: true,
      options: [
        { label: "Research Report", value: "report" },
        { label: "Field Guide", value: "field-guide" },
        { label: "Policy Brief", value: "policy-brief" },
        { label: "White Paper", value: "white-paper" },
        { label: "Toolkit / Resource", value: "toolkit" },
        { label: "Survey / Data", value: "survey" },
      ],
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
    {
      name: "publishedAt",
      type: "date",
      label: "Publication Date",
      required: true,
      admin: { position: "sidebar" },
    },
    { name: "authors", type: "text", label: "Author(s)", admin: { description: "e.g. OCAB Research Team, Jane Smith" } },
    { name: "summary", type: "textarea", label: "Short Summary (shown on cards)" },
    { name: "content", type: "richText", label: "Full Description / Abstract" },
    { name: "coverImage", type: "upload", relationTo: "media" as never, label: "Cover Image" },
    {
      name: "accessType",
      type: "select",
      label: "How to Access",
      options: [
        { label: "Upload PDF", value: "pdf" },
        { label: "External Link", value: "url" },
        { label: "Read on Site (rich text)", value: "onsite" },
      ],
      defaultValue: "url",
      admin: { position: "sidebar" },
    },
    {
      name: "pdf",
      type: "upload",
      relationTo: "media" as never,
      label: "PDF File",
      admin: { condition: (_, s) => s?.accessType === "pdf" },
    },
    {
      name: "externalUrl",
      type: "text",
      label: "External Link URL",
      admin: { condition: (_, s) => s?.accessType === "url", description: "Link to external site where the report lives" },
    },
    {
      name: "quotes",
      type: "array",
      label: "Testimonial Quotes",
      admin: {
        description: "Pull quotes from readers — shown on the homepage section and research detail page",
        initCollapsed: true,
      },
      fields: [
        { name: "quote", type: "textarea", required: true },
        { name: "attribution", type: "text", label: "Attribution (optional)" },
      ],
    },
    {
      name: "ctaLabel",
      type: "text",
      label: "CTA Button Label",
      defaultValue: "Check it out",
    },
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
