import type { GlobalConfig } from "payload";

export const DesignSettings: GlobalConfig = {
  slug: "design-settings",
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: "lightTextColor",
      type: "relationship",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: "brand-colors" as any,
      label: "Light Text Color",
      required: true,
      admin: {
        description: "Used for text on dark backgrounds",
        components: {
          Field: "@/payload/components/ColorSelectField#ColorSelectField",
        },
      },
    },
    {
      name: "darkTextColor",
      type: "relationship",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: "brand-colors" as any,
      label: "Dark Text Color",
      required: true,
      admin: {
        description: "Used for text on light backgrounds",
        components: {
          Field: "@/payload/components/ColorSelectField#ColorSelectField",
        },
      },
    },
  ],
};
