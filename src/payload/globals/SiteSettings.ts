import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "⚙️ Settings" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Branding",
          fields: [
            {
              type: "row",
              fields: [
                { name: "siteName", type: "text", label: "Site Name", admin: { width: "50%" } },
                { name: "tagline", type: "text", label: "Tagline", admin: { width: "50%" } },
              ],
            },
            { name: "logo", type: "upload", relationTo: "media" as never, label: "Site Logo" },
            { name: "donateUrl", type: "text", label: "Donate Link URL", admin: { description: "Link to Zeffy, ActBlue, etc." } },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "contact",
              type: "group",
              label: false,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "email", type: "email", label: "Email", admin: { width: "50%" } },
                    { name: "phone", type: "text", label: "Phone", admin: { width: "50%" } },
                  ],
                },
                { name: "addressLine1", type: "text", label: "Address Line 1" },
                { name: "addressLine2", type: "text", label: "Address Line 2" },
                {
                  type: "row",
                  fields: [
                    { name: "city", type: "text", admin: { width: "40%" } },
                    { name: "state", type: "text", admin: { width: "30%" } },
                    { name: "zip", type: "text", admin: { width: "30%" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Social Media",
          fields: [
            {
              name: "socialMedia",
              type: "group",
              label: false,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "instagram", type: "text", label: "Instagram", admin: { width: "50%" } },
                    { name: "facebook", type: "text", label: "Facebook", admin: { width: "50%" } },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "twitter", type: "text", label: "Twitter / X", admin: { width: "50%" } },
                    { name: "tiktok", type: "text", label: "TikTok", admin: { width: "50%" } },
                  ],
                },
                { name: "youtube", type: "text", label: "YouTube" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
