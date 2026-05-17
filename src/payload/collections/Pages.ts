import type { CollectionConfig, Field } from "payload";

const linkFields = (prefix: string, label: string): Field[] => [
  {
    name: `${prefix}Label`,
    type: "text",
    label: `${label} Text`,
    admin: { width: "30%" },
  },
  {
    name: `${prefix}LinkType`,
    type: "select",
    label: "Links to",
    options: [
      { label: "A page on this site", value: "page" },
      { label: "An external URL", value: "url" },
    ],
    defaultValue: "url",
    admin: { width: "25%" },
  },
  {
    name: `${prefix}Page`,
    type: "relationship",
    relationTo: "pages" as never,
    label: "Page",
    admin: {
      width: "45%",
      condition: (_, s) => s?.[`${prefix}LinkType`] === "page",
    },
  },
  {
    name: `${prefix}Url`,
    type: "text",
    label: "URL",
    admin: {
      width: "45%",
      condition: (_, s) => s?.[`${prefix}LinkType`] !== "page",
      placeholder: "https://...",
    },
  },
];

const contentField: Field = {
  name: "content",
  type: "richText",
  label: "Content",
};

const designLayoutCollapsible = (includeMaxWidth = false): Field => ({
  type: "collapsible",
  label: "Design & Layout",
  admin: {
    initCollapsed: false,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "backgroundColor",
          type: "select",
          label: "Color Scheme",
          options: [
            { label: "Primary (blue bg, white text)", value: "primary" },
            { label: "Secondary (dark blue bg, white text)", value: "secondary" },
            { label: "Accent (orange bg, dark text)", value: "accent" },
            { label: "Neutral (charcoal bg, white text)", value: "neutral" },
            { label: "White", value: "base-100" },
            { label: "Light Gray", value: "base-200" },
            { label: "Medium Gray", value: "base-300" },
          ],
          admin: {
            width: "50%",
            components: {
              Field: "@/payload/components/ColorSchemeField#ColorSchemeField",
            },
          },
        },
        ...(includeMaxWidth
          ? [
              {
                name: "padding",
                type: "select" as const,
                label: "Padding",
                options: [
                  { label: "None", value: "none" },
                  { label: "Small", value: "small" },
                  { label: "Standard", value: "standard" },
                  { label: "Large", value: "large" },
                ],
                defaultValue: "standard",
                admin: { width: "50%" },
              },
            ]
          : []),
      ],
    },
    {
      type: "collapsible",
      label: "Background Image",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "backgroundImage",
          type: "upload",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          relationTo: "media" as any,
          label: false,
        },
        {
          name: "darkScrim",
          type: "checkbox",
          label: "Dark Overlay",
          defaultValue: false,
          admin: {
            description: "Semi-transparent overlay to improve text readability over the image",
            condition: (_, s) => !!s?.backgroundImage,
          },
        },
      ],
    },
  ],
});

const positionGroupField = (name: string): Field => ({
  name,
  type: "group",
  label: false,
  admin: { style: { display: "none" } },
  fields: [
    { name: "x", type: "number", required: true, defaultValue: 10 },
    { name: "y", type: "number", required: true, defaultValue: 10 },
    { name: "width", type: "number", required: true, defaultValue: 200 },
    { name: "height", type: "number", required: true, defaultValue: 200 },
  ],
});

const floatingImagesCollapsible: Field = {
  type: "collapsible",
  label: "Decorative Images (Floating)",
  admin: {
    initCollapsed: true,
    description:
      "Add PNG images that float over the background. Perfect for logos, icons, or decorative elements.",
  },
  fields: [
    {
      name: "floatingItems",
      type: "array",
      label: "Floating Images",
      admin: {
        description:
          "Add PNG images that overlay the section background. Position and resize them after adding.",
        components: {
          Field: "@/payload/components/FloatingArrayField#FloatingArrayField",
        },
      },
      fields: [
        {
          name: "image",
          type: "upload",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          relationTo: "media" as any,
          required: true,
          label: "Image",
        },
        positionGroupField("position"),
        positionGroupField("mobilePosition"),
      ],
    },
  ],
};


const columnFields: Field[] = [contentField, designLayoutCollapsible()];

const revalidatePage = async (slug: string) => {
  try {
    const revalidateUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`;

    const res = await fetch(revalidateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, collection: 'pages' }),
    });

    if (!res.ok) {
      console.error(`Failed to revalidate ${slug}:`, await res.text());
    } else {
      console.log(`Successfully revalidated ${slug}`);
    }
  } catch (error) {
    console.error(`Error revalidating ${slug}:`, error);
  }
};

export const Pages: CollectionConfig = {
  slug: "pages" as const,
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description: "All pages on the site. Build pages by adding sections below.",
    group: "🌐 Website",
    listSearchableFields: ["title", "slug"],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/${doc.slug === "home" ? "" : doc.slug}`,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const pageId = typeof id === "string" ? id : String(id);
        const reasons: string[] = [];

        // Check navigation global (nav items, sub-items, CTA buttons)
        const navigation = await req.payload.findGlobal({ slug: "navigation" as never, depth: 0 }) as { navItems?: Record<string, unknown>[]; ctaButtons?: Record<string, unknown>[] };
        const inNav = navigation.navItems?.some(
          (item: Record<string, unknown>) =>
            item.page === pageId ||
            (item.subItems as Record<string, unknown>[] | undefined)?.some(
              (sub: Record<string, unknown>) => sub.page === pageId,
            ),
        );
        if (inNav) reasons.push("Navigation links");

        const inCta = navigation.ctaButtons?.some(
          (btn: Record<string, unknown>) => btn.page === pageId,
        );
        if (inCta) reasons.push("CTA buttons");

        // Check other pages that reference this page via link fields in sections
        const allPages = await req.payload.find({
          collection: "pages" as never,
          depth: 0,
          limit: 0,
          where: { id: { not_equals: pageId } },
        });
        const linkedFromPages = allPages.docs.some((p: Record<string, unknown>) => {
          const sections = p.sections as Record<string, unknown>[] | undefined;
          if (!sections) return false;
          return sections.some((s) => {
            const vals = Object.values(s);
            return vals.includes(pageId);
          });
        });
        if (linkedFromPages) reasons.push("links in other page sections");

        if (reasons.length > 0) {
          throw new Error(
            `Cannot delete: this page is referenced in ${reasons.join(", ")}. Remove those references first.`,
          );
        }
      },
    ],
    afterChange: [
      async ({ doc }) => {
        if (doc.slug) {
          await revalidatePage(doc.slug);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (doc.slug) {
          await revalidatePage(doc.slug);
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      admin: { position: "sidebar" },
      fields: [
        { name: "title", type: "text", label: "Page Title (overrides default)", admin: { description: "50–60 characters recommended" } },
        { name: "description", type: "textarea", label: "Meta Description", maxLength: 160, admin: { description: "150–160 characters. Shown in search results." } },
        { name: "ogImage", type: "upload", relationTo: "media" as never, label: "Social Share Image", admin: { description: "Recommended: 1200×630px" } },
        { name: "noIndex", type: "checkbox", label: "Hide from search engines", defaultValue: false },
      ],
    },
    {
      name: "sections",
      type: "blocks",
      admin: {
        initCollapsed: true,
      },
      blocks: [
        {
          slug: "bannerSection",
          labels: { singular: "Announcement Bar", plural: "Announcement Bars" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%231e293b'/%3E%3Crect x='15' y='20' width='60' height='5' rx='2' fill='%23f8fafc'/%3E%3Crect x='80' y='19' width='18' height='7' rx='3' fill='%233b82f6'/%3E%3Crect x='83' y='21' width='12' height='3' rx='1' fill='%23fff'/%3E%3Ctext x='60' y='55' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3EShort alert or promo strip%3C/text%3E%3C/svg%3E",
          imageAltText: "Announcement bar",

          fields: [contentField, designLayoutCollapsible(true)],
        },
        {
          slug: "heroCarouselSection",
          labels: { singular: "Hero Slideshow", plural: "Hero Slideshows" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%2364748b'/%3E%3Crect x='30' y='14' width='60' height='5' rx='2' fill='%23fff'/%3E%3Crect x='38' y='24' width='44' height='3' rx='1' fill='%23fff' opacity='.6'/%3E%3Crect x='44' y='32' width='32' height='7' rx='3' fill='%233b82f6'/%3E%3Ccircle cx='54' cy='48' r='2.5' fill='%23fff'/%3E%3Ccircle cx='60' cy='48' r='2.5' fill='%23fff' opacity='.4'/%3E%3Ccircle cx='66' cy='48' r='2.5' fill='%23fff' opacity='.4'/%3E%3Cpath d='M12 30l-5 4 5 4' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M108 30l5 4-5 4' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ctext x='60' y='68' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3EFull-screen rotating slides%3C/text%3E%3C/svg%3E",
          imageAltText: "Full-screen rotating slides with text overlays",

          fields: [

            {
              name: "slides",
              type: "array",
              label: "Slides",
              fields: [contentField, designLayoutCollapsible()],
            },
          ],
        },
        {
          slug: "fullWidthSection",
          labels: { singular: "Full Width", plural: "Full Width Sections" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%23f1f5f9'/%3E%3Crect x='15' y='12' width='50' height='5' rx='2' fill='%231e293b'/%3E%3Crect x='15' y='22' width='90' height='3' rx='1' fill='%2394a3b8'/%3E%3Crect x='15' y='28' width='80' height='3' rx='1' fill='%2394a3b8'/%3E%3Crect x='15' y='34' width='70' height='3' rx='1' fill='%2394a3b8'/%3E%3Crect x='15' y='44' width='24' height='7' rx='3' fill='%233b82f6'/%3E%3Ctext x='60' y='68' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3ERich text, images, and CTA buttons%3C/text%3E%3C/svg%3E",
          imageAltText: "Single content block spanning the full page width with optional background",

          fields: [

            contentField,
            designLayoutCollapsible(true),
            floatingImagesCollapsible,
          ],
        },
        {
          slug: "twoColumnSection",
          labels: { singular: "Two Columns", plural: "Two Column Sections" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%23f1f5f9'/%3E%3Crect x='8' y='10' width='48' height='40' rx='2' fill='%23e2e8f0'/%3E%3Crect x='14' y='16' width='26' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='14' y='22' width='36' height='2' rx='1' fill='%2394a3b8'/%3E%3Crect x='14' y='26' width='30' height='2' rx='1' fill='%2394a3b8'/%3E%3Crect x='64' y='10' width='48' height='40' rx='2' fill='%23e2e8f0'/%3E%3Crect x='70' y='16' width='26' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='70' y='22' width='36' height='2' rx='1' fill='%2394a3b8'/%3E%3Crect x='70' y='26' width='30' height='2' rx='1' fill='%2394a3b8'/%3E%3Ctext x='60' y='68' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3ESide-by-side text, image, or mixed%3C/text%3E%3C/svg%3E",
          imageAltText: "Side-by-side layout — great for text + image or text + text",

          fields: [

            {
              name: "wrapOnMobile",
              type: "checkbox",
              label: "Stack on Mobile",
              defaultValue: true,
            },
            {
              name: "ratio",
              type: "select",
              label: "Column Ratio",
              options: [
                { label: "50/50", value: "1-1" },
                { label: "60/40", value: "3-2" },
                { label: "40/60", value: "2-3" },
              ],
              defaultValue: "1-1",
            },
            {
              name: "leftColumn",
              type: "group",
              label: "Left Column",
              fields: columnFields,
            },
            {
              name: "rightColumn",
              type: "group",
              label: "Right Column",
              fields: columnFields,
            },
          ],
        },
        {
          slug: "threeColumnSection",
          labels: { singular: "Three Columns", plural: "Three Column Sections" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%23f1f5f9'/%3E%3Crect x='6' y='10' width='33' height='38' rx='2' fill='%23e2e8f0'/%3E%3Crect x='11' y='16' width='18' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='11' y='22' width='24' height='2' rx='1' fill='%2394a3b8'/%3E%3Crect x='43' y='10' width='33' height='38' rx='2' fill='%23e2e8f0'/%3E%3Crect x='48' y='16' width='18' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='48' y='22' width='24' height='2' rx='1' fill='%2394a3b8'/%3E%3Crect x='80' y='10' width='33' height='38' rx='2' fill='%23e2e8f0'/%3E%3Crect x='85' y='16' width='18' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='85' y='22' width='24' height='2' rx='1' fill='%2394a3b8'/%3E%3Ctext x='60' y='68' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3EThree equal areas for highlights%3C/text%3E%3C/svg%3E",
          imageAltText: "Three equal content areas — good for feature highlights or stats",

          fields: [

            {
              name: "wrapOnMobile",
              type: "checkbox",
              label: "Stack on Mobile",
              defaultValue: true,
            },
            {
              name: "column1",
              type: "group",
              label: "Column 1",
              fields: columnFields,
            },
            {
              name: "column2",
              type: "group",
              label: "Column 2",
              fields: columnFields,
            },
            {
              name: "column3",
              type: "group",
              label: "Column 3",
              fields: columnFields,
            },
          ],
        },
        {
          slug: "formSection",
          labels: { singular: "Form", plural: "Forms" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%23f1f5f9'/%3E%3Crect x='25' y='8' width='70' height='9' rx='2' fill='%23e2e8f0' stroke='%23cbd5e1'/%3E%3Crect x='25' y='21' width='70' height='9' rx='2' fill='%23e2e8f0' stroke='%23cbd5e1'/%3E%3Crect x='25' y='34' width='70' height='14' rx='2' fill='%23e2e8f0' stroke='%23cbd5e1'/%3E%3Crect x='25' y='52' width='24' height='7' rx='3' fill='%233b82f6'/%3E%3Ctext x='60' y='72' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3EContact, signup, or embed%3C/text%3E%3C/svg%3E",
          imageAltText: "Embeddable form — contact, signup, RSVP, etc.",

          fields: [

            contentField,
            {
              name: "formType",
              type: "select",
              label: "Form Type",
              required: true,
              options: [
                { label: "Contact Form", value: "contact" },
                { label: "Newsletter Signup", value: "newsletter" },
                { label: "Custom Embed", value: "embed" },
              ],
              defaultValue: "contact",
            },
            {
              name: "embedCode",
              type: "textarea",
              label: "Embed Code (HTML)",
              admin: {
                condition: (_, s) => s?.formType === "embed",
                description: "Paste embed code from Action Network, Mailchimp, Google Forms, etc.",
              },
            },
            {
              name: "successMessage",
              type: "text",
              label: "Success Message",
              defaultValue: "Thanks! We'll be in touch.",
            },
            designLayoutCollapsible(),
          ],
        },
        {
          slug: "contentGridSection",
          labels: { singular: "Content Grid", plural: "Content Grids" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%23f1f5f9'/%3E%3Crect x='6' y='6' width='33' height='26' rx='2' fill='%23e2e8f0'/%3E%3Crect x='10' y='10' width='24' height='12' rx='1' fill='%23cbd5e1'/%3E%3Crect x='10' y='25' width='18' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='43' y='6' width='33' height='26' rx='2' fill='%23e2e8f0'/%3E%3Crect x='47' y='10' width='24' height='12' rx='1' fill='%23cbd5e1'/%3E%3Crect x='47' y='25' width='18' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='80' y='6' width='33' height='26' rx='2' fill='%23e2e8f0'/%3E%3Crect x='84' y='10' width='24' height='12' rx='1' fill='%23cbd5e1'/%3E%3Crect x='84' y='25' width='18' height='3' rx='1' fill='%2364748b'/%3E%3Crect x='6' y='36' width='33' height='26' rx='2' fill='%23e2e8f0'/%3E%3Crect x='43' y='36' width='33' height='26' rx='2' fill='%23e2e8f0'/%3E%3Crect x='80' y='36' width='33' height='26' rx='2' fill='%23e2e8f0'/%3E%3Ctext x='60' y='74' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3EManual cards you write yourself%3C/text%3E%3C/svg%3E",
          imageAltText: "Manually-curated grid of cards — you write each one",

          fields: [

            {
              type: "row",
              fields: [
                {
                  name: "alignment",
                  type: "select",
                  label: "Alignment",
                  defaultValue: "left",
                  options: [
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                  ],
                  admin: { width: "20%" },
                },
                {
                  name: "verticalAlignment",
                  type: "select",
                  label: "Vertical Align",
                  defaultValue: "top",
                  options: [
                    { label: "Top", value: "top" },
                    { label: "Center", value: "center" },
                    { label: "Bottom", value: "bottom" },
                  ],
                  admin: { width: "20%" },
                },
                {
                  name: "padding",
                  type: "select",
                  label: "Item Padding",
                  defaultValue: "md",
                  options: [
                    { label: "None", value: "none" },
                    { label: "Small", value: "sm" },
                    { label: "Medium", value: "md" },
                    { label: "Large", value: "lg" },
                  ],
                  admin: { width: "20%" },
                },
                {
                  name: "gap",
                  type: "select",
                  label: "Gap",
                  defaultValue: "md",
                  options: [
                    { label: "None", value: "none" },
                    { label: "Small", value: "sm" },
                    { label: "Medium", value: "md" },
                    { label: "Large", value: "lg" },
                  ],
                  admin: { width: "20%" },
                },
                {
                  name: "wrapOnMobile",
                  type: "checkbox",
                  label: "Stack on Mobile",
                  defaultValue: true,
                  admin: { width: "20%" },
                },
              ],
            },
            {
              name: "items",
              type: "array",
              label: "Content Items",
              minRows: 1,
              fields: [
                contentField,
                designLayoutCollapsible(),
              ],
            },
          ],
        },
        {
          slug: "collectionListSection",
          labels: { singular: "Dynamic List", plural: "Dynamic Lists" },
          imageURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='none'%3E%3Crect width='120' height='80' fill='%23f1f5f9'/%3E%3Crect x='18' y='8' width='26' height='36' rx='2' fill='%233b82f6' opacity='.15'/%3E%3Crect x='22' y='12' width='18' height='14' rx='1' fill='%233b82f6' opacity='.3'/%3E%3Crect x='22' y='30' width='14' height='3' rx='1' fill='%233b82f6'/%3E%3Crect x='48' y='8' width='26' height='36' rx='2' fill='%233b82f6' opacity='.15'/%3E%3Crect x='52' y='12' width='18' height='14' rx='1' fill='%233b82f6' opacity='.3'/%3E%3Crect x='52' y='30' width='14' height='3' rx='1' fill='%233b82f6'/%3E%3Crect x='78' y='8' width='26' height='36' rx='2' fill='%233b82f6' opacity='.15'/%3E%3Crect x='82' y='12' width='18' height='14' rx='1' fill='%233b82f6' opacity='.3'/%3E%3Crect x='82' y='30' width='14' height='3' rx='1' fill='%233b82f6'/%3E%3Cpath d='M8 24l-4 4 4 4' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M112 24l4 4-4 4' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ctext x='60' y='60' text-anchor='middle' font-size='7' fill='%2394a3b8' font-family='sans-serif'%3EAuto-pulls from Events, Blog, etc.%3C/text%3E%3C/svg%3E",
          imageAltText: "Auto-populated from a data source like Events, Blog, Work, etc.",
          admin: { components: { Label: "@/payload/components/RowLabel#BlockLabel" } },
          fields: [
            {
              name: "dataSource",
              type: "select",
              label: "Data Source",
              required: true,
              admin: { description: "Which collection to pull items from" },
              options: [
                { label: "Events", value: "events" },
                { label: "Blog Posts", value: "blog-posts" },
                { label: "Press Articles", value: "press-articles" },
                { label: "Books (Bookshelf)", value: "books" },
                { label: "Team Members", value: "team-members" },
                { label: "Work (Campaigns & Research)", value: "campaigns" },
                { label: "Products / Merch", value: "products" },
              ],
            },
            {
              name: "layout",
              type: "select",
              label: "Layout",
              defaultValue: "grid",
              options: [
                { label: "Grid", value: "grid" },
                { label: "List (stacked rows)", value: "list" },
                { label: "Carousel (horizontal scroll)", value: "carousel" },
                { label: "Featured (large first + grid)", value: "featured" },
              ],
            },
            {
              name: "columns",
              type: "select",
              label: "Columns (Grid only)",
              defaultValue: "3",
              options: [
                { label: "2 Columns", value: "2" },
                { label: "3 Columns", value: "3" },
                { label: "4 Columns", value: "4" },
              ],
              admin: { condition: (_, s) => s?.layout === "grid" || s?.layout === "featured" },
            },
            { name: "limit", type: "number", label: "Max Items to Show", defaultValue: 6, min: 1, max: 24 },
            {
              name: "sortField",
              type: "select",
              label: "Sort By",
              defaultValue: "createdAt_desc",
              options: [
                { label: "Newest First", value: "createdAt_desc" },
                { label: "Oldest First", value: "createdAt_asc" },
                { label: "Alphabetical (A→Z)", value: "title_asc" },
                { label: "Manual Order (use Order field)", value: "order_asc" },
                { label: "Event Date (soonest first)", value: "startDate_asc" },
              ],
            },
            { name: "filterFeatured", type: "checkbox", label: "Show Featured Items Only", defaultValue: false },
            {
              name: "upcomingOnly",
              type: "checkbox",
              label: "Future Events Only (Events collection)",
              defaultValue: true,
              admin: { condition: (_, s) => s?.collection === "events" },
            },
            {
              type: "row",
              fields: linkFields("viewAll", "View All"),
            },
            { name: "emptyMessage", type: "text", label: "Empty State Message", defaultValue: "Nothing to show right now. Check back soon!" },
            {
              name: "pinnedItems",
              type: "array",
              label: "Pinned Items (always shown first)",
              admin: {
                description: "Manually select items to always appear at the top, regardless of sort order",
                initCollapsed: true,
              },
              fields: [
                {
                  name: "item",
                  type: "relationship",
                  label: "Item",
                  relationTo: ["events", "blog-posts", "press-articles", "books", "campaigns", "products", "team-members"] as never,
                },
              ],
            },
            designLayoutCollapsible(),
          ],
        },
      ],
    },
  ],
};
