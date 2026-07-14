import type { GlobalConfig } from "payload";

/**
 * Cached list of the org's Action Network forms, populated by
 * `pnpm sync:an-forms`. Action Network's Cloudflare blocks the forms-list API
 * from the Next.js server runtime (undici + node:https, local + Vercel), but a
 * plain Node script reaches it fine — so the script fetches the real list and
 * stores it here, and the CMS form picker reads it from the DB (no live call).
 */
export const ActionNetworkForms: GlobalConfig = {
  slug: "action-network-forms",
  admin: { group: "⚙️ Settings", hidden: true },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "syncedAt",
      type: "date",
      admin: { readOnly: true, description: "Last time `pnpm sync:an-forms` ran." },
    },
    {
      name: "forms",
      type: "array",
      admin: { readOnly: true, description: "Synced from Action Network — run `pnpm sync:an-forms` to refresh." },
      fields: [
        { name: "formId", type: "text" },
        { name: "slug", type: "text" },
        { name: "title", type: "text" },
      ],
    },
  ],
};
