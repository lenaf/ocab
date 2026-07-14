import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import {
  lexicalEditor,
  BlocksFeature,
  TextStateFeature,
} from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { Users } from "./payload/collections/Users";
import { Pages } from "./payload/collections/Pages";
import { BlogPosts } from "./payload/collections/BlogPosts";
import { Events } from "./payload/collections/Events";
import { PressArticles } from "./payload/collections/PressArticles";
import { Media } from "./payload/collections/Media";
import { Work } from "./payload/collections/Work";
import { Tags } from "./payload/collections/Tags";
import { TeamMembers } from "./payload/collections/TeamMembers";
import { Books } from "./payload/collections/Books";
import { Products } from "./payload/collections/Products";
import { SiteSettings } from "./payload/globals/SiteSettings";

import { themeConfig } from "@/config/theme";

import { Navigation } from "./payload/globals/Navigation";
import { ActionNetworkForms } from "./payload/globals/ActionNetworkForms";

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
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
          generateFileURL: ({ filename, prefix }: { filename: string; prefix: string }) => {
            return `${process.env.S3_PUBLIC_URL}/${prefix}/${filename}`;
          },
        },
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || "auto",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
      },
    }),
  ],
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
    Pages,
    Users,
    Media,
    BlogPosts, Events, Work, PressArticles, TeamMembers, Books, Products, Tags,
  ],
  globals: [Navigation, SiteSettings, ActionNetworkForms],
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
              {
                type: "row",
                fields: [
                  { name: "text", type: "text", required: true, label: "Button Text", admin: { width: "30%" } },
                  {
                    name: "linkType",
                    type: "select",
                    label: "Links to",
                    defaultValue: "url",
                    options: [
                      { label: "A page on this site", value: "page" },
                      { label: "An external URL", value: "url" },
                    ],
                    admin: { width: "20%" },
                  },
                  {
                    name: "page",
                    type: "relationship",
                    relationTo: "pages" as never,
                    label: "Page",
                    admin: { width: "30%", condition: (_, s) => s?.linkType === "page" },
                  },
                  {
                    name: "url",
                    type: "text",
                    label: "URL",
                    admin: { width: "30%", condition: (_, s) => s?.linkType !== "page", placeholder: "https://..." },
                  },
                  {
                    name: "size",
                    type: "select",
                    label: "Size",
                    defaultValue: "md",
                    options: [
                      { label: "XS", value: "xs" },
                      { label: "SM", value: "sm" },
                      { label: "MD", value: "md" },
                      { label: "LG", value: "lg" },
                    ],
                    admin: { width: "20%" },
                  },
                ],
              },
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
