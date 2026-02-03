import type { CollectionConfig } from "payload";

export const ButtonVariants: CollectionConfig = {
  slug: "button-variants",
  labels: {
    singular: "Button Variant",
    plural: "Button Variants",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "preview"],
    group: "Design Options",
  },
  fields: [
    {
      name: "preview",
      type: "ui",
      label: "Preview",
      admin: {
        components: {
          Field: "@/payload/components/ButtonPreview#ButtonPreview",
          Cell: "@/payload/components/ButtonPreviewCell#ButtonPreviewCell",
        },
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Variant Name",
      admin: {
        width: "100%",
        style: {
          marginBottom: "20px",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "colorSettings",
          type: "group",
          label: "🎨 Normal State",
          admin: {
            width: "25%",
            style: {
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "16px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            },
          },
          fields: [
            {
              name: "backgroundColor",
              type: "relationship",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              relationTo: "brand-colors" as any,
              label: "Background",
              admin: {
                components: {
                  Field:
                    "@/payload/components/ColorSelectField#ColorSelectField",
                },
              },
            },
            {
              name: "textColor",
              type: "relationship",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              relationTo: "brand-colors" as any,
              required: true,
              label: "Text",
              admin: {
                components: {
                  Field:
                    "@/payload/components/ColorSelectField#ColorSelectField",
                },
              },
            },
          ],
        },
        {
          name: "colorSettingsHovered",
          type: "group",
          label: "✨ Hover Effect",
          admin: {
            width: "25%",
            style: {
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "16px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            },
          },
          fields: [
            {
              name: "hoverEffect",
              type: "select",
              label: "Hover Effect",
              defaultValue: "darken",
              options: [
                { label: "Darken (10%)", value: "darken" },
                { label: "Lighten (10%)", value: "lighten" },
                { label: "Fade (80% opacity)", value: "fade" },
                { label: "Lift (shadow)", value: "lift" },
                { label: "Scale (105%)", value: "scale" },
                { label: "None", value: "none" },
              ],
            },
          ],
        },
        {
          name: "borderSettings",
          type: "group",
          label: "🔲 Border",
          admin: {
            width: "25%",
            style: {
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "16px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            },
          },
          fields: [
            {
              name: "borderColor",
              type: "relationship",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              relationTo: "brand-colors" as any,
              label: "Color",
              admin: {
                components: {
                  Field:
                    "@/payload/components/ColorSelectField#ColorSelectField",
                },
              },
            },
            {
              name: "borderWidth",
              type: "number",
              min: 0,
              max: 10,
              defaultValue: 0,
              label: "Width (px)",
              admin: {
                style: {
                  maxWidth: "80px",
                },
              },
            },
            {
              name: "hoverBorderEffect",
              type: "select",
              label: "Hover Border Effect",
              defaultValue: "same",
              options: [
                { label: "Same as Background", value: "same" },
                { label: "Darken Border", value: "darken" },
                { label: "Lighten Border", value: "lighten" },
                { label: "Custom Color", value: "custom" },
              ],
            },
            {
              name: "hoverBorderColor",
              type: "relationship",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              relationTo: "brand-colors" as any,
              label: "Custom Hover Color",
              admin: {
                condition: (data) =>
                  data.borderSettings?.hoverBorderEffect === "custom",
                components: {
                  Field:
                    "@/payload/components/ColorSelectField#ColorSelectField",
                },
              },
            },
          ],
        },
        {
          name: "shapeSettings",
          type: "group",
          label: "🔘 Shape",
          admin: {
            width: "25%",
            style: {
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "16px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            },
          },
          fields: [
            {
              name: "borderRadius",
              type: "select",
              label: "Corner Style",
              defaultValue: "rounded",
              options: [
                { label: "Sharp", value: "0" },
                { label: "Slightly Rounded", value: "4" },
                { label: "Rounded", value: "8" },
                { label: "Very Rounded", value: "16" },
                { label: "Pill/Capsule", value: "999" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
