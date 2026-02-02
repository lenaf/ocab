import type { CollectionConfig, Field } from "payload";

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
          type: "relationship",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          relationTo: "brand-colors" as any,
          label: "Background Color",
          admin: {
            components: {
              Field: "@/payload/components/ColorSelectField#ColorSelectField",
            },
            width: "50%",
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
      type: "row",
      fields: [
        {
          name: "textColor",
          type: "select",
          label: "Text Color",
          options: [
            { label: "Dark", value: "dark" },
            { label: "Light", value: "light" },
          ],
          defaultValue: "dark",
          admin: { width: includeMaxWidth ? "33%" : "50%" },
        },
        {
          name: "contentAlignment",
          type: "select",
          label: "Content Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          defaultValue: "center",
          admin: { width: includeMaxWidth ? "33%" : "50%" },
        },
        ...(includeMaxWidth
          ? [
              {
                name: "maxWidth",
                type: "select" as const,
                label: "Content Max Width",
                options: [
                  { label: "Full Width", value: "full" },
                  { label: "2/3 Width", value: "2/3" },
                  { label: "1/2 Width", value: "1/2" },
                  { label: "1/3 Width", value: "1/3" },
                ],
                defaultValue: "full",
                admin: { width: "34%" },
              },
            ]
          : []),
      ],
    },
  ],
});

const carouselSectionFields = (itemType: string): Field[] => [
  { name: "title", type: "text", label: "Section Title" },
  {
    name: "limit",
    type: "number",
    label: `Number of ${itemType}`,
    defaultValue: 6,
    min: 1,
    max: 20,
  },
];

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

const columnFields: Field[] = [contentField, designLayoutCollapsible()];

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
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  versions: {
    drafts: true,
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
      name: "sections",
      type: "blocks",
      admin: {
        initCollapsed: true,
      },
      blocks: [
        {
          slug: "bannerSection",
          labels: { singular: "Banner Section", plural: "Banner Sections" },
          fields: [contentField, designLayoutCollapsible()],
        },
        {
          slug: "heroCarouselSection",
          labels: { singular: "Hero Carousel", plural: "Hero Carousels" },
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
          slug: "blogPostsCarouselSection",
          labels: {
            singular: "Blog Posts Carousel",
            plural: "Blog Posts Carousels",
          },
          fields: carouselSectionFields("Posts"),
        },
        {
          slug: "eventsCarouselSection",
          labels: { singular: "Events Carousel", plural: "Events Carousels" },
          fields: carouselSectionFields("Events"),
        },
        {
          slug: "pressCarouselSection",
          labels: { singular: "Press Carousel", plural: "Press Carousels" },
          fields: carouselSectionFields("Articles"),
        },
        {
          slug: "fullWidthSection",
          labels: {
            singular: "Full Width Section",
            plural: "Full Width Sections",
          },
          fields: [
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
          labels: {
            singular: "Three Column Section",
            plural: "Three Column Sections",
          },
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
      ],
    },
  ],
};
