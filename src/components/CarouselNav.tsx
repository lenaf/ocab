'use client'

export function CarouselNav({
  id,
  color = 'white',
  onPrev,
  onNext,
  leftPosition = 'left-4',
  rightPosition = 'right-4'
}: {
  id?: string
  color?: 'white' | 'dark'
  onPrev?: () => void
  onNext?: () => void
  leftPosition?: string
  rightPosition?: string
}) {
  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && onPrev) {
      onPrev()
    } else if (direction === 'right' && onNext) {
      onNext()
    } else if (id) {
      const carousel = document.getElementById(id)
      if (carousel) {
        carousel.scrollBy({
          left: direction === 'left' ? -420 : 420,
          behavior: 'smooth'
        })
      }
    }
  }

  const borderColor = color === 'white' ? 'border-white' : 'border-gray-800'
  const bgColor = color === 'white' ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-800/20 hover:bg-gray-800/30'
  const textColor = color === 'white' ? 'text-white' : 'text-gray-800'

  return (
    <>
      <button 
        onClick={() => scroll('left')} 
        className={`hidden md:flex absolute ${leftPosition} top-1/2 -translate-y-1/2 w-14 h-14 border-2 ${borderColor} ${bgColor} backdrop-blur-md transition-all items-center justify-center ${textColor} z-10`}
      >
        <span className="text-3xl" style={{marginTop: '-2px'}}>‹</span>
      </button>
      <button 
        onClick={() => scroll('right')} 
        className={`hidden md:flex absolute ${rightPosition} top-1/2 -translate-y-1/2 w-14 h-14 border-2 ${borderColor} ${bgColor} backdrop-blur-md transition-all items-center justify-center ${textColor} z-10`}
      >
        <span className="text-3xl" style={{marginTop: '-2px'}}>›</span>
      </button>
    </>
  )
}
