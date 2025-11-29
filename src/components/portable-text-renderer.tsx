import {PortableText} from '@portabletext/react'
import {SanityImage} from './ui/sanity-image'

export const portableTextComponents = {
  types: {
    richTextButton: ({value}: {text: string; link: string; variant?: string; size?: string; icon?: string}) => {
      const variants: Record<string, string> = {
        primary: { bg: '#3D9BE9', text: '#ffffff', border: 'none' },
        secondary: { bg: '#FF6B35', text: '#ffffff', border: 'none' },
        accent: { bg: '#F7B32B', text: '#000000', border: 'none' },
        'outline-dark': { bg: 'transparent', text: '#000000', border: '2px solid #000000' },
        'outline-light': { bg: 'transparent', text: '#ffffff', border: '2px solid #ffffff' },
      };
      const icons: Record<string, string> = {
        'arrow-right': '→',
        'arrow-left': '←',
        'arrow-down': '↓',
        'external': '↗',
      };
      const style = variants[value.variant] || variants.primary;
      const sizeClass = value.size === 'sm' ? 'px-4 py-2 text-sm' : value.size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3';
      const icon = value.icon && value.icon !== 'none' ? icons[value.icon] : null;
      return (
        <a
          href={value.link}
          className={`inline-flex items-center gap-2 ${sizeClass} font-bold uppercase tracking-wide transition-all my-4`}
          style={{
            backgroundColor: style.bg,
            color: style.text,
            border: style.border,
          }}
        >
          {value.text}
          {icon && <span>{icon}</span>}
        </a>
      );
    },
    richTextImage: ({value}: {asset?: {asset?: {_ref: string}}; alt?: string; caption?: string}) => (
      <figure className="my-8">
        <SanityImage asset={value.asset?.asset} alt={value.alt} className="rounded-lg w-full shadow-md" />
        {value.caption && <figcaption className="text-center text-sm text-gray-600 mt-3">{value.caption}</figcaption>}
      </figure>
    ),
    table: ({value}: {rows?: Array<{_key: string; cells?: string[]}>}) => (
      <div className="overflow-x-auto my-8 rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {value.rows?.map((row, i: number) => (
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
    linkAnnotation: ({value, children}: {value?: {href?: string; blank?: boolean}; children: React.ReactNode}) => (
      <a href={value.href} target={value.blank ? '_blank' : '_self'} rel="noopener noreferrer" className="text-[#3D9BE9] hover:text-[#116dff] underline transition-colors">{children}</a>
    ),
    highlight: ({value, children}: {value?: {variant?: string}; children: React.ReactNode}) => {
      const colors: Record<string, string> = {
        blue: '#3D9BE9',
        yellow: '#F7B32B',
        orange: '#FF6B35',
        dark: '#000000',
        light: '#FFFFFF',
      };
      return <span style={{color: colors[value.variant] || colors.blue}} className="font-bold">{children}</span>;
    },

  },
  block: {
    h1: ({children}: {children: React.ReactNode}) => <h1 className="text-5xl md:text-7xl lg:text-[86px] font-extrabold my-6 leading-tight uppercase tracking-normal">{children}</h1>,
    h2: ({children}: {children: React.ReactNode}) => <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold my-5 leading-tight uppercase">{children}</h2>,
    h3: ({children}: {children: React.ReactNode}) => <h3 className="text-xl md:text-2xl lg:text-4xl font-bold my-4 leading-snug uppercase">{children}</h3>,
    h4: ({children}: {children: React.ReactNode}) => <h4 className="text-lg md:text-xl lg:text-2xl font-bold my-3 leading-snug uppercase">{children}</h4>,
    blockquote: ({children}: {children: React.ReactNode}) => <blockquote className="border-l-4 border-[#3D9BE9] pl-6 italic my-6 text-base md:text-lg text-gray-700">{children}</blockquote>,
    normal: ({children}: {children: React.ReactNode}) => <p className="my-4 text-sm md:text-base lg:text-lg leading-relaxed">{children}</p>,
  },
}

export function PortableTextRenderer({value}: {value: unknown}) {
  if (!value) return null
  return <PortableText value={value} components={portableTextComponents} />
}
