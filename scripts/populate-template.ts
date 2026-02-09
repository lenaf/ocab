/**
 * Payload CMS Page Population Script
 * 
 * Usage:
 * export MONGODB_URI="your-mongodb-uri" && npx tsx scripts/populate.ts
 * 
 * This script demonstrates how to:
 * - Connect to Payload CMS programmatically
 * - Delete existing pages
 * - Create pages with various section types
 * - Structure Lexical editor content
 */

import { getPayload } from "payload";
import config from "@payload-config";

async function populate() {
  const payload = await getPayload({ config });

  // Delete all existing pages
  const existing = await payload.find({ collection: "pages", limit: 1000 });
  for (const page of existing.docs) {
    await payload.delete({ collection: "pages", id: page.id });
  }

  // Create a page with multiple section types
  await payload.create({
    collection: "pages",
    data: {
      title: "Home",
      slug: "home",
      sections: [
        // Banner Section - Simple header/hero
        {
          blockType: "bannerSection",
          content: {
            root: {
              type: "root",
              children: [
                {
                  type: "heading",
                  tag: "h1",
                  children: [{ type: "text", text: "Page Title" }],
                },
                {
                  type: "paragraph",
                  children: [{ type: "text", text: "Subtitle or tagline" }],
                },
              ],
            },
          },
          backgroundColor: "primary",
          contentAlignment: "center",
        },

        // Full Width Section - Main content area
        {
          blockType: "fullWidthSection",
          content: {
            root: {
              type: "root",
              children: [
                {
                  type: "heading",
                  tag: "h2",
                  children: [{ type: "text", text: "Section Heading" }],
                },
                {
                  type: "paragraph",
                  children: [{ type: "text", text: "Your content here." }],
                },
              ],
            },
          },
          backgroundColor: "base-100",
          contentAlignment: "center",
          maxWidth: "2/3", // Options: "full", "2/3", "1/2", "1/3"
        },

        // Three Column Section - Feature grid
        {
          blockType: "threeColumnSection",
          wrapOnMobile: true,
          column1: {
            content: {
              root: {
                type: "root",
                children: [
                  {
                    type: "heading",
                    tag: "h3",
                    children: [{ type: "text", text: "Feature 1" }],
                  },
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "Description" }],
                  },
                ],
              },
            },
            backgroundColor: "secondary",
            contentAlignment: "center",
          },
          column2: {
            content: {
              root: {
                type: "root",
                children: [
                  {
                    type: "heading",
                    tag: "h3",
                    children: [{ type: "text", text: "Feature 2" }],
                  },
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "Description" }],
                  },
                ],
              },
            },
            backgroundColor: "secondary",
            contentAlignment: "center",
          },
          column3: {
            content: {
              root: {
                type: "root",
                children: [
                  {
                    type: "heading",
                    tag: "h3",
                    children: [{ type: "text", text: "Feature 3" }],
                  },
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "Description" }],
                  },
                ],
              },
            },
            backgroundColor: "secondary",
            contentAlignment: "center",
          },
        },

        // Two Column Section
        {
          blockType: "twoColumnSection",
          wrapOnMobile: true,
          ratio: "1-1", // Options: "1-1", "3-2", "2-3"
          leftColumn: {
            content: {
              root: {
                type: "root",
                children: [
                  {
                    type: "heading",
                    tag: "h3",
                    children: [{ type: "text", text: "Left Column" }],
                  },
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "Content" }],
                  },
                ],
              },
            },
            backgroundColor: "base-200",
            contentAlignment: "left",
          },
          rightColumn: {
            content: {
              root: {
                type: "root",
                children: [
                  {
                    type: "heading",
                    tag: "h3",
                    children: [{ type: "text", text: "Right Column" }],
                  },
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "Content" }],
                  },
                ],
              },
            },
            backgroundColor: "base-200",
            contentAlignment: "left",
          },
        },
      ],
    },
  });

  console.log("✅ Pages created successfully");
  process.exit(0);
}

populate().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
