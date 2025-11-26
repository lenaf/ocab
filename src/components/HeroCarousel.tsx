"use client";

import { useState, useEffect } from "react";
import { SanityImage } from "./ui/sanity-image";
import { CarouselNav } from "./CarouselNav";
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
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}
        >
          {slide.image?.asset?._ref && (
            <>
              <SanityImage
                asset={slide.image.asset}
                alt=""
                className="w-full h-full object-cover"
                width={1920}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: slide.overlayColor?.value || "#000000",
                  opacity: (slide.overlayOpacity || 40) / 100,
                }}
              />
            </>
          )}
          <div className="absolute inset-0 flex items-center justify-center px-20 md:px-32">
            <div className="max-w-5xl w-full text-white text-center">
              {slide.heading && (
                <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tight mb-6 leading-none">
                  {slide.heading}
                </h1>
              )}
              {slide.text && (
                <p className="text-xl md:text-3xl font-light mb-8 max-w-3xl mx-auto">
                  {slide.text}
                </p>
              )}
              {slide.buttonText && (
                <a
                  href={slide.buttonLink || "#"}
                  className="inline-block px-8 py-4 text-lg font-bold uppercase tracking-wide border-2 transition-all hover:scale-105"
                  style={{
                    borderColor: slide.buttonColor?.value || "#ffffff",
                    color: slide.buttonTextColor?.value || "#ffffff",
                    backgroundColor: "transparent",
                  }}
                >
                  {slide.buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

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
