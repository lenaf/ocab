import type { CollectionConfig } from 'payload'

export const BrandColors: CollectionConfig = {
  slug: 'brand-colors' as const,
  labels: {
    singular: 'Brand Color',
    plural: 'Brand Colors',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'colorType', 'hexValue'],
    listSearchableFields: ['name'],
    group: 'Design System',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Color Name',
      admin: {
        style: {
          maxWidth: '250px',
        },
      },
    },
    {
      name: 'colorType',
      type: 'radio',
      required: true,
      defaultValue: 'solid',
      options: [
        { 
          label: 'Solid Color', 
          value: 'solid',
        },
        { 
          label: 'Gradient', 
          value: 'gradient',
        },
      ],
      admin: {
        description: 'Choose between a single solid color or a multi-color gradient',
        layout: 'horizontal',
      },
    },
    {
      name: 'hexValue',
      type: 'text',
      required: true,
      label: 'Color',
      defaultValue: '#000000',
      admin: {
        condition: (data) => data.colorType === 'solid',
        components: {
          Field: '@/payload/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'gradient',
      type: 'group',
      label: 'Gradient Settings',
      admin: {
        condition: (data) => data.colorType === 'gradient',
      },
      fields: [
        {
          name: 'angle',
          type: 'number',
          min: 0,
          max: 360,
          defaultValue: 90,
          label: 'Angle (degrees)',
          admin: {
            style: {
              maxWidth: '120px',
            },
          },
        },
        {
          name: 'stops',
          type: 'array',
          label: 'Gradient Colors',
          minRows: 2,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'hexValue',
                  type: 'text',
                  required: true,
                  label: 'Color',
                  defaultValue: '#000000',
                  admin: {
                    width: '60%',
                    components: {
                      Field: '@/payload/components/ColorPickerField#ColorPickerField',
                    },
                    style: {
                      maxWidth: '150px',
                    },
                  },
                },
                {
                  name: 'position',
                  type: 'number',
                  min: 0,
                  max: 100,
                  defaultValue: 0,
                  label: 'Position (%)',
                  admin: {
                    width: '40%',
                    style: {
                      maxWidth: '80px',
                    },
                  },
                },
              ],
            },
          ],
          defaultValue: [
            { color: '#3D9BE9', position: 0 },
            { color: '#6366F1', position: 100 },
          ],
        },
      ],
    },
    {
      name: 'opacity',
      type: 'number',
      min: 0,
      max: 1,
      defaultValue: 1,
      admin: {
        step: 0.1,
        style: {
          maxWidth: '100px',
        },
      },
    },
  ],
}