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
          {title: 'Code', value: 'code'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike', value: 'strike-through'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'linkAnnotation',
            icon: () => '🔗',
            components: {
              annotation: (props: any) => <span className="text-blue-500 underline">{props.children}</span>
            }
          },
          {
            name: 'color',
            type: 'colorAnnotation',
            icon: () => '🎨',
            components: {
              annotation: (props: any) => <span style={{color: props.value?.value?.value}}>{props.children}</span>
            }
          },
          {
            name: 'backgroundColor',
            type: 'backgroundColorAnnotation',
            icon: () => '🖍️',
            components: {
              annotation: (props: any) => <span style={{backgroundColor: props.value?.value?.value}} className="px-1">{props.children}</span>
            }
          },
        ],
      },
    }),
    defineArrayMember({type: 'richTextImage'}),
    defineArrayMember({type: 'richTextButton'}),
    defineArrayMember({type: 'table'}),
  ],
})
