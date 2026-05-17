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
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Accent", value: "accent" },
            { label: "Neutral", value: "neutral" },
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
        {
          name: "backgroundImage",
          type: "upload",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          relationTo: "media" as any,
          label: "Background Image",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "darkScrim",
      type: "checkbox",
      label: "Dark Overlay on Background Image",
      defaultValue: false,
      admin: {
        description: "Adds a dark semi-transparent overlay to improve text readability",
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
          "Drag and resize images in the preview box, then configure details below.",
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

const labelField: Field = {
  name: "label",
  type: "text",
  label: "Section Label (admin only)",
  admin: {
    description: "Helps identify this section when collapsed in the admin",
    placeholder: "e.g. Hero Banner, About Us, Events List",
  },
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
        { name: "title", type: "text", label: "Page Title (overrides default)" },
        { name: "description", type: "textarea", label: "Meta Description", maxLength: 160 },
        { name: "ogImage", type: "upload", relationTo: "media" as never, label: "Social Share Image" },
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
          labels: { singular: "Banner Section", plural: "Banner Sections" },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [labelField, contentField, designLayoutCollapsible(true)],
        },
        {
          slug: "heroCarouselSection",
          labels: { singular: "Hero Carousel", plural: "Hero Carousels" },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [
            labelField,
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
          labels: {
            singular: "Full Width Section",
            plural: "Full Width Sections",
          },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [
            labelField,
            contentField,
            designLayoutCollapsible(true),
            floatingImagesCollapsible,
          ],
        },
        {
          slug: "twoColumnSection",
          labels: {
            singular: "Two Column Section",
            plural: "Two Column Sections",
          },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [
            labelField,
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
          labels: {
            singular: "Three Column Section",
            plural: "Three Column Sections",
          },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [
            labelField,
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
          slug: "contactSection",
          labels: { singular: "Contact Section", plural: "Contact Sections" },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [
            labelField,
            { name: "title", type: "text", label: "Section Title", defaultValue: "Contact Us" },
            { name: "body", type: "richText", label: "Intro Text" },
            { name: "showAddress", type: "checkbox", label: "Show Address", defaultValue: true },
            { name: "showEmail", type: "checkbox", label: "Show Email", defaultValue: true },
            { name: "showSocialIcons", type: "checkbox", label: "Show Social Media Icons", defaultValue: true },
            { name: "showForm", type: "checkbox", label: "Show Contact Form", defaultValue: true },
            designLayoutCollapsible(),
          ],
        },
        {
          slug: "contentGridSection",
          labels: { singular: "Content Grid", plural: "Content Grids" },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [
            labelField,
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
          labels: { singular: "Collection List", plural: "Collection Lists" },
          admin: { components: { Label: "@/payload/components/RowLabel#SectionRowLabel" } },
          fields: [
            labelField,
            { name: "title", type: "text", label: "Section Title" },
            { name: "subtitle", type: "textarea", label: "Section Subtitle / Description" },
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
