"use client";

import Link from "next/link";
import { LexicalRenderer } from "./LexicalRenderer";
import { HeroCarousel } from "./HeroCarousel";
import { getTextColorForBackground } from "@/lib/textColorUtils";
import { themeConfig } from "@/config/theme";
import { useState, useEffect } from "react";
import type { Page, BlogPost, Event, PressArticle } from "@/payload-types";

type Section = NonNullable<Page["sections"]>[number];

export function RenderSections({ sections }: { sections: Section[] }) {
  if (!sections || sections.length === 0) {
    return <div>No sections to display</div>;
  }

  const getBackgroundColor = (bgColor: string | null | undefined) => {
    if (!bgColor) return "transparent";
    const colorMap: Record<string, string> = {
      primary: themeConfig.colors.primary,
      secondary: themeConfig.colors.secondary,
      accent: themeConfig.colors.accent,
      neutral: themeConfig.colors.neutral,
      "base-100": themeConfig.colors.base100,
      "base-200": themeConfig.colors.base200,
      "base-300": themeConfig.colors.base300,
    };
    return colorMap[bgColor] || bgColor;
  };

  const getMediaUrl = (media: string | { id: string } | null | undefined) => {
    if (!media) return "";
    if (typeof media === "string") return `/api/media/file/${media}`;
    return `/api/media/file/${media.id}`;
  };

  return (
    <>
      {sections.map((section, index) => {
        if (section.blockType === "bannerSection") {
          return (
            <section
              key={index}
              className="py-3 px-6 md:px-12 lg:px-24"
              style={{
                backgroundColor: getBackgroundColor(section.backgroundColor),
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LexicalRenderer content={section.content} />
              </div>
            </section>
          );
        }

        if (section.blockType === "fullWidthSection") {
          return (
            <section
              key={index}
              className="relative py-16 md:py-24 min-h-[400px]"
              style={{
                backgroundColor: getBackgroundColor(section.backgroundColor),
              }}
            >
              {section.backgroundImage && (
                <img
                  src={getMediaUrl(section.backgroundImage)}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {section.floatingItems?.map((item, i) => {
                const mediaAlt =
                  typeof item.image === "object" && item.image?.alt
                    ? item.image.alt
                    : "";
                return (
                  <div key={i}>
                    <img
                      src={getMediaUrl(item.image)}
                      alt={mediaAlt}
                      className="absolute hidden md:block"
                      style={{
                        left: `${item.position.x}%`,
                        top: `${item.position.y}%`,
                        width: `${item.position.width}px`,
                        height: `${item.position.height}px`,
                        objectFit: "contain",
                      }}
                    />
                    <img
                      src={getMediaUrl(item.image)}
                      alt={mediaAlt}
                      className="absolute md:hidden"
                      style={{
                        left: `${item.mobilePosition.x}%`,
                        top: `${item.mobilePosition.y}%`,
                        width: `${item.mobilePosition.width}px`,
                        height: `${item.mobilePosition.height}px`,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                );
              })}
              <div
                className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-${section.contentAlignment || "left"} ${getTextColorForBackground(section.backgroundColor) === 'light' ? 'text-white' : 'text-gray-900'}`}
                style={{
                  maxWidth:
                    section.maxWidth === "2/3"
                      ? "66.666%"
                      : section.maxWidth === "1/2"
                        ? "50%"
                        : "100%",
                }}
              >
                <LexicalRenderer content={section.content} />
              </div>
            </section>
          );
        }

        if (section.blockType === "heroCarouselSection") {
          return (
            <HeroCarousel
              key={index}
              slides={section.slides || []}
              renderSlide={(slide) => (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: getBackgroundColor(slide.backgroundColor),
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
                    <div
                      className={`max-w-5xl w-full text-${slide.contentAlignment || "center"} ${getTextColorForBackground(slide.backgroundColor) === 'light' ? 'text-white' : 'text-gray-900'}`}
                    >
                      <LexicalRenderer content={slide.content} />
                    </div>
                  </div>
                </div>
              )}
            />
          );
        }

        if (section.blockType === "blogPostsCarouselSection") {
          const BlogPostsCarousel = () => {
            const [posts, setPosts] = useState<BlogPost[]>([]);
            useEffect(() => {
              fetch(`/api/blog-posts?limit=${section.limit || 6}`)
                .then((res) => res.json())
                .then((data) => setPosts(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    {posts.map((post, i) => (
                      <div key={i} className="flex-shrink-0 w-80">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="block h-full"
                        >
                          <div
                            className="h-[350px] rounded-lg overflow-hidden shadow-lg"
                            style={{
                              backgroundColor:
                                getBackgroundColor(post.backgroundColor) || themeConfig.colors.primary,
                            }}
                          >
                            <div className="p-6 h-full flex flex-col justify-between text-white">
                              <div>
                                <div className="text-sm font-semibold mb-2">
                                  {post.category}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">
                                  {post.title}
                                </h3>
                                <p className="text-sm opacity-90">
                                  {post.excerpt}
                                </p>
                              </div>
                              <div className="text-sm">
                                {new Date(
                                  post.publishedAt,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          };
          return <BlogPostsCarousel key={index} />;
        }

        if (section.blockType === "eventsCarouselSection") {
          const EventsCarousel = () => {
            const [events, setEvents] = useState<Event[]>([]);
            useEffect(() => {
              fetch(`/api/events?limit=${section.limit || 6}`)
                .then((res) => res.json())
                .then((data) => setEvents(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    {events.map((event, i) => (
                      <div key={i} className="flex-shrink-0 w-80">
                        <Link
                          href={`/events/${event.slug}`}
                          className="block h-full"
                        >
                          <div
                            className="h-[350px] rounded-lg overflow-hidden shadow-lg"
                            style={{
                              backgroundColor:
                                getBackgroundColor(event.backgroundColor) || themeConfig.colors.secondary,
                            }}
                          >
                            <div className="p-6 h-full flex flex-col justify-between text-white">
                              <div>
                                <h3 className="text-2xl font-bold mb-3">
                                  {event.title}
                                </h3>
                                <p className="text-sm mb-2">{event.location}</p>
                              </div>
                              <div className="text-sm">
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          };
          return <EventsCarousel key={index} />;
        }

        if (section.blockType === "pressCarouselSection") {
          const PressCarousel = () => {
            const [articles, setArticles] = useState<PressArticle[]>([]);
            useEffect(() => {
              fetch(`/api/press-articles?limit=${section.limit || 6}`)
                .then((res) => res.json())
                .then((data) => setArticles(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    {articles.map((article, i) => (
                      <div key={i} className="flex-shrink-0 w-80">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                          <div
                            className="h-[350px] rounded-lg overflow-hidden shadow-lg"
                            style={{
                              backgroundColor:
                                getBackgroundColor(article.backgroundColor) || themeConfig.colors.accent,
                            }}
                          >
                            <div className="p-6 h-full flex flex-col justify-between text-white">
                              <div>
                                <div className="text-sm font-semibold mb-2">
                                  {article.publication}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">
                                  {article.title}
                                </h3>
                                <p className="text-sm opacity-90">
                                  {article.excerpt}
                                </p>
                              </div>
                              <div className="text-sm">
                                {new Date(
                                  article.publishedAt,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          };
          return <PressCarousel key={index} />;
        }

        if (section.blockType === "twoColumnSection") {
          const ratioMap: Record<string, string> = {
            "1-1": "md:grid-cols-2",
            "3-2": "md:grid-cols-5",
            "2-3": "md:grid-cols-5",
          };
          const leftSpan =
            section.ratio === "3-2"
              ? "md:col-span-3"
              : section.ratio === "2-3"
                ? "md:col-span-2"
                : "md:col-span-1";
          const rightSpan =
            section.ratio === "3-2"
              ? "md:col-span-2"
              : section.ratio === "2-3"
                ? "md:col-span-3"
                : "md:col-span-1";

          return (
            <section key={index}>
              <div
                className={`grid ${section.wrapOnMobile !== false ? ratioMap[section.ratio || "1-1"] : `grid-cols-2 ${ratioMap[section.ratio || "1-1"].replace("md:", "")}`}`}
              >
                <div
                  className={leftSpan}
                  style={{
                    backgroundColor: getBackgroundColor(
                      section.leftColumn?.backgroundColor,
                    ),
                  }}
                >
                  <div
                    className={`py-12 md:py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-${section.leftColumn?.contentAlignment || "left"} ${getTextColorForBackground(section.leftColumn?.backgroundColor) === 'light' ? 'text-white' : 'text-gray-900'}`}
                  >
                    <LexicalRenderer content={section.leftColumn?.content} />
                  </div>
                </div>
                <div
                  className={rightSpan}
                  style={{
                    backgroundColor: getBackgroundColor(
                      section.rightColumn?.backgroundColor,
                    ),
                  }}
                >
                  <div
                    className={`py-12 md:py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-${section.rightColumn?.contentAlignment || "left"} ${getTextColorForBackground(section.rightColumn?.backgroundColor) === 'light' ? 'text-white' : 'text-gray-900'}`}
                  >
                    <LexicalRenderer content={section.rightColumn?.content} />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (section.blockType === "threeColumnSection") {
          return (
            <section key={index}>
              <div
                className={`grid ${section.wrapOnMobile !== false ? "md:grid-cols-3" : "grid-cols-3"}`}
              >
                {[section.column1, section.column2, section.column3].map(
                  (col, colIndex: number) => (
                    <div
                      key={colIndex}
                      style={{
                        backgroundColor: getBackgroundColor(
                          col?.backgroundColor,
                        ),
                      }}
                    >
                      <div
                        className={`py-12 md:py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-${col?.contentAlignment || "left"} ${getTextColorForBackground(col?.backgroundColor) === 'light' ? 'text-white' : 'text-gray-900'}`}
                      >
                        <LexicalRenderer content={col?.content} />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          );
        }

        return null;
      })}
    </>
  );
}
