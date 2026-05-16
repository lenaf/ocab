"use client";

import { useState, useEffect, useCallback } from "react";
import { CarouselNav } from "./CarouselNav";
import type { Page } from "@/payload-types";

type HeroCarouselSection = Extract<NonNullable<Page['sections']>[number], { blockType: 'heroCarouselSection' }>
type HeroSlide = NonNullable<HeroCarouselSection['slides']>[number]

interface HeroCarouselProps {
  slides: HeroSlide[];
  renderSlide: (slide: HeroSlide, index: number) => React.ReactNode;
  autoRotateInterval?: number;
}

export function HeroCarousel({ slides, renderSlide, autoRotateInterval = 5000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, autoRotateInterval);
    return () => clearInterval(timer);
  }, [next, autoRotateInterval, slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {renderSlide(slide, idx)}
        </div>
      ))}

      {slides.length > 1 && (
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
      )}

      {slides.length > 1 && (
        <CarouselNav
          onPrev={prev}
          onNext={next}
          color="white"
          leftPosition="left-4 md:left-8"
          rightPosition="right-4 md:right-8"
        />
      )}
    </section>
  );
}
