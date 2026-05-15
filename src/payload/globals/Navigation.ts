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
      type: "tabs",
      tabs: [
        {
          label: "Navigation Items",
          fields: [
            {
              name: "navItems",
              type: "array",
              label: false,
              admin: { initCollapsed: true },
              fields: [
                {
                  type: "row",
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
                      admin: { width: "30%" },
                    },
                    {
                      name: "page",
                      type: "relationship",
                      relationTo: "pages",
                      label: "Page",
                      admin: { width: "70%", condition: (_, s) => s?.linkType !== "url" },
                    },
                    {
                      name: "url",
                      type: "text",
                      label: "External URL",
                      admin: { width: "70%", condition: (_, s) => s?.linkType === "url" },
                    },
                  ],
                },
                {
                  name: "label",
                  type: "text",
                  label: "Label Override",
                  admin: { description: "Required for external URLs; optional for internal pages" },
                },
                {
                  type: "collapsible",
                  label: "Sub-navigation Items",
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      name: "subItems",
                      type: "array",
                      label: false,
                      fields: [
                        {
                          type: "row",
                          fields: [
                            {
                              name: "linkType",
                              type: "select",
                              options: [
                                { label: "Internal Page", value: "page" },
                                { label: "External URL", value: "url" },
                              ],
                              defaultValue: "page",
                              admin: { width: "30%" },
                            },
                            {
                              name: "page",
                              type: "relationship",
                              relationTo: "pages",
                              admin: { width: "40%", condition: (_, s) => s?.linkType !== "url" },
                            },
                            {
                              name: "url",
                              type: "text",
                              admin: { width: "40%", condition: (_, s) => s?.linkType === "url" },
                            },
                            {
                              name: "label",
                              type: "text",
                              admin: { width: "30%" },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "CTA Buttons",
          description: "Buttons shown at the top-right of the header",
          fields: [
            {
              name: "ctaButtons",
              type: "array",
              label: false,
              maxRows: 3,
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      admin: { width: "30%" },
                    },
                    {
                      name: "style",
                      type: "select",
                      label: "Color",
                      options: [
                        { label: "Primary (Blue)", value: "primary" },
                        { label: "Accent (Orange/Red)", value: "accent" },
                        { label: "Success (Amber)", value: "success" },
                        { label: "Neutral (Dark)", value: "neutral" },
                        { label: "Outline", value: "outline" },
                      ],
                      defaultValue: "primary",
                      admin: { width: "30%" },
                    },
                    {
                      name: "linkType",
                      type: "select",
                      options: [
                        { label: "Internal Page", value: "page" },
                        { label: "External URL", value: "url" },
                      ],
                      defaultValue: "url",
                      admin: { width: "40%" },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "page",
                      type: "relationship",
                      relationTo: "pages",
                      label: "Page",
                      admin: { width: "100%", condition: (_, s) => s?.linkType !== "url" },
                    },
                    {
                      name: "url",
                      type: "text",
                      label: "URL",
                      admin: { width: "100%", condition: (_, s) => s?.linkType === "url" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Settings",
          fields: [
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
        },
      ],
    },
  ],
};
