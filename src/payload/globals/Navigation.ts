import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  admin: { group: "🌐 Website" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      label: "Navigation Items",
      fields: [
        {
          name: "linkType",
          type: "select",
          label: "Link Type",
          options: [
            { label: "Internal Page", value: "page" },
            { label: "External URL", value: "url" },
          ],
          defaultValue: "page",
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
          label: "Page",
          admin: { condition: (_, s) => s?.linkType !== "url" },
        },
        {
          name: "url",
          type: "text",
          label: "External URL",
          admin: { condition: (_, s) => s?.linkType === "url" },
        },
        {
          name: "label",
          type: "text",
          label: "Label",
          admin: { description: "Required for external URLs; optional override for internal pages" },
        },
        {
          name: "subItems",
          type: "array",
          label: "Sub-navigation Items",
          admin: { description: "Add dropdown items under this nav item" },
          fields: [
            {
              name: "linkType",
              type: "select",
              options: [
                { label: "Internal Page", value: "page" },
                { label: "External URL", value: "url" },
              ],
              defaultValue: "page",
            },
            { name: "page", type: "relationship", relationTo: "pages", admin: { condition: (_, s) => s?.linkType !== "url" } },
            { name: "url", type: "text", admin: { condition: (_, s) => s?.linkType === "url" } },
            { name: "label", type: "text" },
          ],
        },
      ],
    },
    {
      name: "ctaButtons",
      type: "array",
      label: "Call-to-Action Buttons",
      maxRows: 3,
      admin: { description: "Buttons shown at the top-right of the header (e.g. Donate Now, Take Action)" },
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "linkType",
          type: "select",
          options: [
            { label: "Internal Page", value: "page" },
            { label: "External URL", value: "url" },
          ],
          defaultValue: "url",
        },
        { name: "page", type: "relationship", relationTo: "pages", admin: { condition: (_, s) => s?.linkType !== "url" } },
        { name: "url", type: "text", label: "External URL", admin: { condition: (_, s) => s?.linkType === "url" } },
        {
          name: "style",
          type: "select",
          label: "Button Color",
          options: [
            { label: "Primary (Blue)", value: "primary" },
            { label: "Accent (Orange/Red)", value: "accent" },
            { label: "Success (Amber/Yellow)", value: "success" },
            { label: "Neutral (Dark)", value: "neutral" },
            { label: "Outline", value: "outline" },
          ],
          defaultValue: "primary",
        },
      ],
    },
    {
      name: "style",
      type: "select",
      label: "Navigation Style",
      options: [
        { label: "Solid (colored background)", value: "solid" },
        { label: "White / Transparent", value: "white" },
      ],
      defaultValue: "white",
    },
  ],
};
