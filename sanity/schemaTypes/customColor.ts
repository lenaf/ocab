import { defineType } from 'sanity';

export default defineType({
  name: 'customColor',
  title: 'Color',
  type: 'object',
  fields: [
    {
      name: 'value',
      type: 'string',
      options: {
        list: [
          { title: 'Transparent', value: 'transparent' },
          { title: 'Black', value: '#000000' },
          { title: 'White', value: '#ffffff' },
          { title: 'OurCity Blue', value: '#3D9BE9' },
          { title: 'OurCity Yellow', value: '#F7B32B' },
          { title: 'OurCity Orange', value: '#FF6B35' },
          { title: 'Light Gray', value: '#f3f4f6' },
          { title: 'Dark Gray', value: '#374151' },
        ],
      },
    },
  ],
  initialValue: {
    value: 'transparent',
  },
});
