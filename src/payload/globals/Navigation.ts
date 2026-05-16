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
                      label: "Links to",
                      options: [
                        { label: "A page on this site", value: "page" },
                        { label: "An external website", value: "url" },
                      ],
                      defaultValue: "page",
                      admin: { width: "30%" },
                    },
                    {
                      name: "page",
                      type: "relationship",
                      relationTo: "pages",
                      label: "Page",
                      required: true,
                      admin: { width: "70%", condition: (_, s) => s?.linkType !== "url" },
                    },
                    {
                      name: "url",
                      type: "text",
                      label: "URL",
                      required: true,
                      admin: {
                        width: "70%",
                        condition: (_, s) => s?.linkType === "url",
                        placeholder: "https://example.com",
                        description: "Must start with https://. Opens in a new tab.",
                      },
                    },
                  ],
                },
                {
                  name: "label",
                  type: "text",
                  label: "Display Label",
                  admin: {
                    description: "What shows in the nav bar. If blank, uses the page title.",
                  },
                },
                {
                  type: "collapsible",
                  label: "Dropdown Items",
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
                              label: "Links to",
                              options: [
                                { label: "A page on this site", value: "page" },
                                { label: "An external website", value: "url" },
                              ],
                              defaultValue: "page",
                              admin: { width: "25%" },
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
                              admin: {
                                width: "40%",
                                condition: (_, s) => s?.linkType === "url",
                                placeholder: "https://...",
                              },
                            },
                            {
                              name: "label",
                              type: "text",
                              label: "Label",
                              admin: { width: "35%" },
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
          description: "Buttons shown at the top-right of the header (max 3)",
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
                      label: "Button Text",
                      admin: { width: "30%", placeholder: "e.g. Donate Now" },
                    },
                    {
                      name: "style",
                      type: "select",
                      label: "Color",
                      options: [
                        { label: "Blue (Primary)", value: "primary" },
                        { label: "Orange (Accent)", value: "accent" },
                        { label: "Amber (Success)", value: "success" },
                        { label: "Dark (Neutral)", value: "neutral" },
                        { label: "Outline", value: "outline" },
                      ],
                      defaultValue: "primary",
                      admin: { width: "30%" },
                    },
                    {
                      name: "linkType",
                      type: "select",
                      label: "Links to",
                      options: [
                        { label: "A page on this site", value: "page" },
                        { label: "An external URL", value: "url" },
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
                      admin: {
                        width: "100%",
                        condition: (_, s) => s?.linkType === "url",
                        placeholder: "https://donate.example.com",
                      },
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
              label: "Header Style",
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
