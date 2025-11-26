export function SanityImage({asset, alt = '', className = '', width = 1200}: {asset?: {_ref: string}; alt?: string; className?: string; width?: number}) {
  if (!asset?._ref) return null
  const isSvg = asset._ref.includes('-svg')
  const url = `https://cdn.sanity.io/images/mttfjag0/production/${asset._ref.replace('image-', '').replace(/-([a-z]+)$/, '.$1')}${isSvg ? '' : `?w=${width}&auto=format`}`
  return <img src={url} alt={alt} className={className} loading="lazy" />
}
