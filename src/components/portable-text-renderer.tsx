import {PortableText} from '@portabletext/react'
import {SanityImage} from './ui/sanity-image'

export const portableTextComponents = {
  types: {
    richTextImage: ({value}: any) => (
      <figure className="my-8">
        <SanityImage asset={value.asset} alt={value.alt} className="rounded-lg w-full shadow-md" />
        {value.caption && <figcaption className="text-center text-sm text-gray-600 mt-3">{value.caption}</figcaption>}
      </figure>
    ),
    richTextButton: ({value}: any) => (
      <a
        href={value.link}
        className="inline-block px-6 py-3 font-bold uppercase tracking-wide transition-all my-4"
        style={{
          backgroundColor: value.style === 'solid' ? (value.color?.value || '#000') : 'transparent',
          color: value.textColor?.value || (value.style === 'solid' ? '#fff' : '#000'),
          border: value.style === 'transparent' ? `2px solid ${value.color?.value || '#000'}` : 'none',
        }}
      >
        {value.text}
      </a>
    ),
    table: ({value}: any) => (
      <div className="overflow-x-auto my-8 rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {value.rows?.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50">
                {row.cells?.map((cell: string, j: number) => (
                  <td key={j} className="px-6 py-4 text-sm">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  marks: {
    link: ({value, children}: any) => (
      <a href={value.href} target={value.blank ? '_blank' : '_self'} rel="noopener noreferrer" className="text-[#3D9BE9] hover:text-[#116dff] underline transition-colors">{children}</a>
    ),
    color: ({value, children}: any) => (
      <span style={{color: value.value?.value}}>{children}</span>
    ),
    backgroundColor: ({value, children}: any) => (
      <span style={{backgroundColor: value.value?.value}} className="px-1">{children}</span>
    ),
  },
  block: {
    h1: ({children}: any) => <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold my-6 leading-tight">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold my-5 leading-tight">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold my-4 leading-snug">{children}</h3>,
    h4: ({children}: any) => <h4 className="text-xl md:text-2xl lg:text-3xl font-bold my-3 leading-snug">{children}</h4>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-[#3D9BE9] pl-6 italic my-6 text-lg text-gray-700">{children}</blockquote>,
    normal: ({children}: any) => <p className="my-4 text-base md:text-lg leading-relaxed">{children}</p>,
  },
}

export function PortableTextRenderer({value}: {value: any}) {
  if (!value) return null
  return <PortableText value={value} components={portableTextComponents} />
}
