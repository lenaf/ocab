import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import {
  lexicalEditor,
  BlocksFeature,
  TextStateFeature,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { Users } from "./payload/collections/Users";
import { Pages } from "./payload/collections/Pages";
import { BlogPosts } from "./payload/collections/BlogPosts";
import { Events } from "./payload/collections/Events";
import { PressArticles } from "./payload/collections/PressArticles";
import { Media } from "./payload/collections/Media";
import { SiteSettings } from "./payload/globals/SiteSettings";

import { themeConfig } from "@/config/theme";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ["@/payload/components/LogoutButton#LogoutButton"],
    },
    meta: {
      titleSuffix: "- OurCity",
    },
  },
  endpoints: [
    {
      path: "/pages",
      method: "get",
      handler: async (req) => {
        const payload = req.payload;
        const result = await payload.find({
          collection: "pages",
          limit: 100,
        });
        return Response.json(result);
      },
    },
  ],
  cors: [
    "http://localhost:3002",
    "http://localhost:3000",
    "https://ocab.vercel.app",
    process.env.NEXT_PUBLIC_SERVER_URL || "",
  ].filter(Boolean),
  csrf: [
    "http://localhost:3002",
    "http://localhost:3000",
    "https://ocab.vercel.app",
    process.env.NEXT_PUBLIC_SERVER_URL || "",
  ].filter(Boolean),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  collections: [
    Users,
    Media,
    Pages,
    BlogPosts,
    Events,
    PressArticles,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      TextStateFeature({
        state: {
          color: {
            default: { label: "Default", css: {} },
            primary: {
              label: "Primary",
              css: { color: themeConfig.colors.primary, "font-weight": "bold" },
            },
            secondary: {
              label: "Secondary",
              css: { color: themeConfig.colors.secondary, "font-weight": "bold" },
            },
            accent: {
              label: "Accent",
              css: { color: themeConfig.colors.accent, "font-weight": "bold" },
            },
            textLight: {
              label: "Light Text",
              css: { color: "#FFFFFF", "font-weight": "bold" },
            },
            textDark: {
              label: "Dark Text",
              css: { color: "#1F2937", "font-weight": "bold" },
            },
          },
        },
      }),
      BlocksFeature({
        blocks: [
          {
            slug: "button",
            labels: { singular: "Button", plural: "Buttons" },
            fields: [
              { name: "text", type: "text", required: true, label: "Button Text" },
              { name: "url", type: "text", required: true, label: "Link URL" },
              {
                name: "style",
                type: "text",
                required: true,
                label: "Button Style",
                defaultValue: "btn-primary",
                admin: {
                  components: {
                    Field: "@/payload/components/ButtonStylePreviewField#ButtonStylePreviewField",
                  },
                },
              },
              {
                name: "size",
                type: "select",
                label: "Button Size",
                defaultValue: "md",
                options: [
                  { label: "Extra Small", value: "xs" },
                  { label: "Small", value: "sm" },
                  { label: "Medium", value: "md" },
                  { label: "Large", value: "lg" },
                ],
              },
            ],
          },
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "your-secret-key-here",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/ourcity",
  }),
  sharp,
});
