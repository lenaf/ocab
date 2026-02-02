import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import {
  lexicalEditor,
  BlocksFeature,
  TextStateFeature,
  defaultColors,
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
import { BrandColors } from "./payload/collections/BrandColors";
import { ButtonVariants } from "./payload/collections/ButtonDesignVariants";

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
  cors: ["http://localhost:3002", "http://localhost:3000"],
  csrf: ["http://localhost:3002", "http://localhost:3000"],
  serverURL: "http://localhost:3000",
  collections: [
    Users,
    Media,
    Pages,
    BlogPosts,
    Events,
    PressArticles,
    BrandColors,
    ButtonVariants,
  ],
  globals: [],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      TextStateFeature({
        state: {
          color: {
            default: { label: "Default", css: {} },
            primary: {
              label: "Primary",
              css: { color: "#3D9BE9", fontWeight: "bold" },
              preview: { background: "#3D9BE9", color: "white" },
            },
            warning: {
              label: "Warning",
              css: { color: "#EF4444", fontWeight: "bold" },
              preview: { background: "#EF4444", color: "white" },
            },
            success: {
              label: "Success",
              css: { color: "#10B981", fontWeight: "bold" },
              preview: { background: "#10B981", color: "white" },
            },
            textLight: {
              label: "Light Text",
              css: { color: "#FFFFFF", fontWeight: "bold" },
              preview: { background: "#FFFFFF", color: "black" },
            },
            textDark: {
              label: "Dark Text",
              css: { color: "#1F2937", fontWeight: "bold" },
              preview: { background: "#1F2937", color: "white" },
            },
            yellow: {
              label: "Yellow",
              css: { color: "#F7B32B", fontWeight: "bold" },
              preview: { background: "#F7B32B", color: "black" },
            },
            orange: {
              label: "Orange",
              css: { color: "#FF6B35", fontWeight: "bold" },
              preview: { background: "#FF6B35", color: "white" },
            },
          },
        },
      }),
      BlocksFeature({
        blocks: [
          {
            slug: "button",
            fields: [
              { name: "text", type: "text", required: true },
              { name: "url", type: "text", required: true },
              {
                name: "designVariant",
                type: "relationship",
                relationTo: "button-variants",
                required: true,
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
