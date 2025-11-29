"use client";

import { useState, useEffect } from "react";
import { SanityImage } from "./ui/sanity-image";
import { CarouselNav } from "./CarouselNav";
import { PortableTextRenderer } from "./portable-text-renderer";
import type { HeroSlide } from "@/types/sanity.types";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, idx) => {
        const bgColor = slide.backgroundColor?.value || 'transparent';
        
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundColor: bgColor }}
          >
            {slide.backgroundImage?.asset && (
              <SanityImage
                asset={slide.backgroundImage.asset}
                alt=""
                className="w-full h-full object-cover"
                width={1920}
              />
            )}
            {slide.collageItems?.map((item, i: number) => (
              <div
                key={i}
                className="absolute hidden md:block"
                style={{
                  left: `${item.position?.x || 0}%`,
                  top: `${item.position?.y || 0}%`,
                  width: `${item.position?.width || 30}%`,
                  height: `${item.position?.height || 30}%`,
                }}
              >
                <SanityImage asset={item.image?.asset} alt={item.alt || ''} className="w-full h-full object-contain" />
              </div>
            ))}
            {slide.collageItems?.map((item, i: number) => (
              <div
                key={`mobile-${i}`}
                className="absolute md:hidden"
                style={{
                  left: `${item.mobilePosition?.x || 0}%`,
                  top: `${item.mobilePosition?.y || 0}%`,
                  width: `${item.mobilePosition?.width || 40}%`,
                  height: `${item.mobilePosition?.height || 40}%`,
                }}
              >
                <SanityImage asset={item.image?.asset} alt={item.alt || ''} className="w-full h-full object-contain" />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center px-20 md:px-32 z-10">
              <div className={`max-w-5xl w-full prose prose-lg max-w-none text-${slide.contentAlignment || 'center'} ${slide.textColor === 'light' ? 'text-white prose-invert' : 'text-gray-900'}`}>
                <PortableTextRenderer value={slide.content} />
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${idx === current ? "bg-white w-8" : "bg-white/50"}`}
          />
        ))}
      </div>

      <CarouselNav
        onPrev={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        onNext={() => setCurrent((prev) => (prev + 1) % slides.length)}
        color="white"
        leftPosition="left-4 md:left-8"
        rightPosition="right-4 md:right-8"
      />
    </div>
  );
}
