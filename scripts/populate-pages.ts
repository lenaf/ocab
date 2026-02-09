/**
 * Payload CMS Page Population Script - ChoiceEQ Content
 * 
 * Usage:
 * export MONGODB_URI="USE_ENVIRONMENT_VARIABLE_INSTEAD" && npx tsx scripts/populate-pages.ts
 */

import { getPayload } from "payload";
import config from "@payload-config";

async function populate() {
  const payload = await getPayload({ config });

  const existing = await payload.find({ collection: "pages", limit: 1000 });
  for (const page of existing.docs) {
    await payload.delete({ collection: "pages", id: page.id });
  }

  await payload.create({
    collection: "pages",
    data: {
      title: "Home",
      slug: "home",
      sections: [
        {
          blockType: "bannerSection",
          content: {
            root: {
              type: "root",
              children: [
                {
                  type: "heading",
                  tag: "h1",
                  children: [
                    {
                      type: "text",
                      text: "TRAVELING INSTRUCTOR FOCUSED ON DRESSAGE FOR THE MINDFUL RIDER",
                    },
                  ],
                },
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "Located in Irving NY Serving the WNY area",
                    },
                  ],
                },
              ],
            },
          },
          backgroundColor: "primary",
          contentAlignment: "center",
        },
        {
          blockType: "fullWidthSection",
          content: {
            root: {
              type: "root",
              children: [
                {
                  type: "heading",
                  tag: "h2",
                  children: [{ type: "text", text: "the choice. philosophy" }],
                },
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "We start and end each day with a choice. Our lives are defined by choice - they are a summation of every choice that we have made and will continue to make. We choose how we act, how we speak, what we wear, what we do, how we treat others and how we treat ourselves. There is great beauty in choice, there is also great power. The power to change. The power to be whoever we choose. If we do not like who we are one day, we can wake up the next and choose to be someone different. Someone who is more kind, more generous, more patient. We can choose to be the greatest versions of ourselves - for us, for those we love, and for our equine partners.",
                    },
                  ],
                },
              ],
            },
          },
          backgroundColor: "base-100",
          contentAlignment: "center",
          maxWidth: "2/3",
        },
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
                    children: [{ type: "text", text: "TRAINING" }],
                  },
                  {
                    type: "paragraph",
                    children: [
                      { type: "text", text: "sustainable partnerships" },
                    ],
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
                    children: [{ type: "text", text: "TEACHING" }],
                  },
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "with intention" }],
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
                    children: [{ type: "text", text: "MINDFULNESS" }],
                  },
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "a healthy balance" }],
                  },
                ],
              },
            },
            backgroundColor: "secondary",
            contentAlignment: "center",
          },
        },
        {
          blockType: "fullWidthSection",
          content: {
            root: {
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "The choice program offers dressage focused teaching and training that incorporates a knowledge of both horse and rider biomechanics. Dressage can benefit all equine athletes regardless of discipline. It focuses on proper use and carriage of the body and helps both horse and rider to become straighter and more balanced. It is important to me that along with improving your knowledge and skills you also feel that your relationship with your equine partner and the equestrian sport continues to grow. Teaching and training with intention will lead to greater effectiveness in the saddle and a more sustainable partnership.",
                    },
                  ],
                },
              ],
            },
          },
          backgroundColor: "base-100",
          contentAlignment: "center",
          maxWidth: "2/3",
        },
      ],
    },
  });

  console.log("✅ Pages created successfully");
  process.exit(0);
}

populate().catch(console.error);
