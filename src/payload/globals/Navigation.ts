import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
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
          name: "page",
          type: "relationship",
          relationTo: "pages",
          required: true,
          label: "Page",
        },
        {
          name: "label",
          type: "text",
          label: "Custom Label (optional)",
          admin: {
            description: "Leave blank to use page title",
          },
        },
        {
          name: "icon",
          type: "select",
          label: "Icon (optional)",
          options: [
            { label: "None", value: "" },
            { label: "Home", value: "home" },
            { label: "Info", value: "info" },
            { label: "Calendar", value: "calendar" },
            { label: "Users", value: "users" },
            { label: "Mail", value: "mail" },
            { label: "Phone", value: "phone" },
            { label: "Map Pin", value: "map-pin" },
            { label: "Heart", value: "heart" },
            { label: "Star", value: "star" },
          ],
        },
        {
          name: "subItems",
          type: "array",
          label: "Sub-navigation Items",
          admin: {
            description: "Add dropdown menu items under this navigation item",
          },
          fields: [
            {
              name: "page",
              type: "relationship",
              relationTo: "pages",
              required: true,
              label: "Page",
            },
            {
              name: "label",
              type: "text",
              label: "Custom Label (optional)",
              admin: {
                description: "Leave blank to use page title",
              },
            },
          ],
        },
      ],
    },
    {
      name: "ctaButton",
      type: "group",
      label: "Call-to-Action Button",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Show CTA Button",
          defaultValue: true,
        },
        {
          name: "label",
          type: "text",
          label: "Button Label",
          defaultValue: "Join",
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
          label: "Link to Page",
        },
      ],
    },
    {
      name: "style",
      type: "select",
      label: "Navigation Style",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Glass (Overlay)", value: "glass" },
      ],
      defaultValue: "glass",
    },
  ],
};
