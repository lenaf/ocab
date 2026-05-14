import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "⚙️ Settings" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: "logo", type: "upload", relationTo: "media" as never, label: "Site Logo" },
    { name: "siteName", type: "text", label: "Site Name" },
    { name: "tagline", type: "text", label: "Tagline" },
    { name: "donateUrl", type: "text", label: "Donate Link URL", admin: { description: "Link to Zeffy, ActBlue, etc." } },
    {
      name: "contact",
      type: "group",
      label: "Contact Info",
      fields: [
        { name: "email", type: "email", label: "Contact Email" },
        { name: "phone", type: "text", label: "Phone (optional)" },
        { name: "addressLine1", type: "text", label: "Address Line 1" },
        { name: "addressLine2", type: "text", label: "Address Line 2 (optional)" },
        { name: "city", type: "text" },
        { name: "state", type: "text" },
        { name: "zip", type: "text" },
      ],
    },
    {
      name: "socialMedia",
      type: "group",
      label: "Social Media",
      fields: [
        { name: "instagram", type: "text", label: "Instagram URL" },
        { name: "facebook", type: "text", label: "Facebook URL" },
        { name: "twitter", type: "text", label: "Twitter / X URL" },
        { name: "tiktok", type: "text", label: "TikTok URL" },
        { name: "youtube", type: "text", label: "YouTube URL" },
      ],
    },
  ],
};
