import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
        ],
        annotations: [
          {type: 'linkAnnotation'},
          {
            name: 'highlight',
            type: 'object',
            title: 'Highlight',
            fields: [
              {
                name: 'variant',
                type: 'string',
                title: 'Color',
                options: {
                  list: [
                    {title: 'Blue', value: 'blue'},
                    {title: 'Yellow', value: 'yellow'},
                    {title: 'Orange', value: 'orange'},
                    {title: 'Dark', value: 'dark'},
                    {title: 'Light', value: 'light'},
                  ],
                  layout: 'radio',
                },
                initialValue: 'blue',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({type: 'richTextImage'}),
    defineArrayMember({type: 'richTextButton'}),
  ],
})
