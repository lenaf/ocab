"use client";

import Link from "next/link";
import { LexicalRenderer } from "./LexicalRenderer";
import { HeroCarousel } from "./HeroCarousel";
import { themeConfig } from "@/config/theme";
import { useState, useEffect } from "react";
import type {
  Page,
  BlogPost,
  Event,
  PressArticle,
  Campaign,
  TeamMember,
  Research,
  Book,
  Product,
  Media,
} from "@/payload-types";

type Section = NonNullable<Page["sections"]>[number];

export function RenderSections({ sections }: { sections: Section[] }) {
  if (!sections || sections.length === 0) {
    return <div>No sections to display</div>;
  }

  const getBgClass = (bgColor: string | null | undefined) => {
    if (!bgColor) return "";
    const colorMap: Record<string, string> = {
      primary: themeConfig.colors.primary,
      secondary: themeConfig.colors.secondary,
      accent: themeConfig.colors.accent,
      neutral: themeConfig.colors.neutral,
      "base-100": themeConfig.colors.base100,
      "base-200": themeConfig.colors.base200,
      "base-300": themeConfig.colors.base300,
      info: themeConfig.colors.info,
      success: themeConfig.colors.success,
      warning: themeConfig.colors.warning,
      error: themeConfig.colors.error,
    };
    return colorMap[bgColor] || bgColor;
  };

  const getContentClass = (bgColor: string | null | undefined) => {
    if (!bgColor) return "";
    const contentColorMap: Record<string, string> = {
      primary: themeConfig.colors.primaryContent,
      secondary: themeConfig.colors.secondaryContent,
      accent: themeConfig.colors.accentContent,
      neutral: themeConfig.colors.neutralContent,
      "base-100": themeConfig.colors.baseContent,
      "base-200": themeConfig.colors.baseContent,
      "base-300": themeConfig.colors.baseContent,
      info: themeConfig.colors.infoContent,
      success: themeConfig.colors.successContent,
      warning: themeConfig.colors.warningContent,
      error: themeConfig.colors.errorContent,
    };
    return contentColorMap[bgColor] || themeConfig.colors.baseContent;
  };

  const getMediaUrl = (media: string | Media | null | undefined): string => {
    if (!media) return "";
    if (typeof media === "string") return "";
    return media.url || (media.filename ? `/media/${media.filename}` : "");
  };

  return (
    <>
      {sections.map((section, index) => {
        if (section.blockType === "bannerSection") {
          const bannerPaddingMap: Record<string, string> = {
            none: "py-0 px-0",
            small: "py-2 px-4 md:px-8",
            standard: "py-3 px-6 md:px-12 lg:px-24",
            large: "py-8 px-8 md:px-16 lg:px-32",
          };
          const bannerPadding = bannerPaddingMap[section.padding || "standard"];

          return (
            <section
              key={index}
              className={`relative ${bannerPadding}`}
              style={{
                backgroundColor: getBgClass(section.backgroundColor),
                color: getContentClass(section.backgroundColor),
              }}
            >
              {section.backgroundImage && (
                <>
                  <img
                    src={getMediaUrl(section.backgroundImage)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {section.darkScrim && (
                    <div className="absolute inset-0 bg-black/50" />
                  )}
                </>
              )}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LexicalRenderer content={section.content} />
              </div>
            </section>
          );
        }

        if (section.blockType === "fullWidthSection") {
          return (
            <section
              key={index}
              className={`relative py-16 md:py-24 ${
                section.padding === "none"
                  ? "px-0"
                  : section.padding === "small"
                    ? "px-4 sm:px-8"
                    : section.padding === "large"
                      ? "px-16 sm:px-32 lg:px-48"
                      : "px-8 sm:px-16 lg:px-24"
              }`}
              style={{
                backgroundColor: getBgClass(section.backgroundColor),
                color: getContentClass(section.backgroundColor),
              }}
            >
              {section.backgroundImage && (
                <>
                  <img
                    src={getMediaUrl(section.backgroundImage)}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {section.darkScrim && (
                    <div className="absolute inset-0 bg-black/50" />
                  )}
                </>
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
              <div className="relative z-10 mx-auto">
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
                    backgroundColor: getBgClass(slide.backgroundColor),
                    color: getContentClass(slide.backgroundColor),
                  }}
                >
                  {slide.backgroundImage && (
                    <>
                      <img
                        src={getMediaUrl(slide.backgroundImage)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {slide.darkScrim && (
                        <div className="absolute inset-0 bg-black/50" />
                      )}
                    </>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
                    <div className="max-w-5xl w-full">
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
                              backgroundColor: getBgClass("primary"),
                              color: getContentClass("primary"),
                            }}
                          >
                            <div className="p-6 h-full flex flex-col justify-between">
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
                              backgroundColor: getBgClass(
                                event.backgroundColor || "secondary",
                              ),
                              color: getContentClass(
                                event.backgroundColor || "secondary",
                              ),
                            }}
                          >
                            <div className="p-6 h-full flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl font-bold mb-3">
                                  {event.title}
                                </h3>
                                <p className="text-sm mb-2">
                                  {event.location && [
                                    event.location.venue,
                                    event.location.city,
                                    event.location.state
                                  ].filter(Boolean).join(', ')}
                                </p>
                              </div>
                              <div className="text-sm">
                                {new Date(event.startDate).toLocaleDateString()}
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
                              backgroundColor: getBgClass("accent"),
                              color: getContentClass("accent"),
                            }}
                          >
                            <div className="p-6 h-full flex flex-col justify-between">
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

        if (section.blockType === "campaignsSection") {
          const CampaignsGrid = () => {
            const [campaigns, setCampaigns] = useState<Campaign[]>([]);
            useEffect(() => {
              const filterParam = section.filter && section.filter !== "all"
                ? `&where[status][equals]=${section.filter}`
                : "";
              fetch(`/api/campaigns?limit=${section.limit || 6}&sort=order${filterParam}`)
                .then((res) => res.json())
                .then((data) => setCampaigns(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign, i) => (
                      <Link key={i} href={`/campaigns/${campaign.slug}`} className="block">
                        <div
                          className="h-full rounded-lg overflow-hidden shadow-lg p-6"
                          style={{
                            backgroundColor: getBgClass("accent"),
                            color: getContentClass("accent"),
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                              campaign.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                            }`}>
                              {campaign.status}
                            </span>
                            {campaign.year && (
                              <span className="text-sm opacity-75">{campaign.year}</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                          <p className="text-sm opacity-90">{campaign.summary}</p>
                          <span className="inline-block mt-4 text-sm font-bold underline">
                            {campaign.callToAction || "Learn More"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          };
          return <CampaignsGrid key={index} />;
        }

        if (section.blockType === "teamMembersSection") {
          const TeamGrid = () => {
            const [members, setMembers] = useState<TeamMember[]>([]);
            useEffect(() => {
              const filterParam = section.filter && section.filter !== "all"
                ? `&where[type][equals]=${section.filter}`
                : "";
              fetch(`/api/team-members?sort=order${filterParam}`)
                .then((res) => res.json())
                .then((data) => setMembers(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {members.map((member, i) => {
                      const photoUrl = member.photo && typeof member.photo === "object" ? (member.photo as Media).url : "";
                      return (
                        <div key={i} className="text-center">
                          {photoUrl ? (
                            <img src={photoUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-3" />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-base-200 mx-auto mb-3 flex items-center justify-center text-3xl font-bold opacity-40">
                              {member.name.charAt(0)}
                            </div>
                          )}
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          {member.role && <p className="text-sm opacity-75">{member.role}</p>}
                          {member.pronouns && <p className="text-xs opacity-50">{member.pronouns}</p>}
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                            member.type === "staff" ? "bg-primary/10 text-primary" :
                            member.type === "board" ? "bg-accent/10 text-accent" :
                            "bg-base-200 text-base-content"
                          }`}>
                            {member.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          };
          return <TeamGrid key={index} />;
        }

        if (section.blockType === "researchSection") {
          const ResearchGrid = () => {
            const [items, setItems] = useState<Research[]>([]);
            useEffect(() => {
              fetch(`/api/research?limit=${section.limit || 6}&sort=-publishedAt`)
                .then((res) => res.json())
                .then((data) => setItems(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    {items.map((item, i) => {
                      const coverUrl = item.coverImage && typeof item.coverImage === "object" ? (item.coverImage as Media).url : "";
                      const href = item.accessType === "url" && item.externalUrl
                        ? item.externalUrl
                        : `/research/${item.slug}`;
                      return (
                        <a key={i} href={href} target={item.accessType === "url" ? "_blank" : undefined} rel="noopener noreferrer" className="flex-shrink-0 w-72 block">
                          <div className="h-[380px] rounded-lg overflow-hidden shadow-lg bg-white border border-gray-100">
                            {coverUrl && (
                              <img src={coverUrl} alt={item.title} className="w-full h-40 object-cover" />
                            )}
                            <div className="p-5">
                              <span className="text-xs font-bold uppercase text-primary mb-1 block">{item.type?.replace("-", " ")}</span>
                              <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                              <p className="text-sm opacity-75 line-clamp-3">{item.summary}</p>
                              <span className="inline-block mt-3 text-sm font-bold text-primary">{item.ctaLabel || "Check it out"} →</span>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          };
          return <ResearchGrid key={index} />;
        }

        if (section.blockType === "booksSection") {
          const BooksGrid = () => {
            const [books, setBooks] = useState<Book[]>([]);
            useEffect(() => {
              fetch(`/api/books?limit=${section.limit || 6}&sort=order`)
                .then((res) => res.json())
                .then((data) => setBooks(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    {books.map((book, i) => {
                      const coverUrl = book.cover && typeof book.cover === "object" ? (book.cover as Media).url : "";
                      return (
                        <a key={i} href={book.url || "#"} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-56 block">
                          <div className="h-[360px] rounded-lg overflow-hidden shadow-lg bg-white border border-gray-100">
                            {coverUrl ? (
                              <img src={coverUrl} alt={book.title} className="w-full h-52 object-cover" />
                            ) : (
                              <div className="w-full h-52 bg-primary/10 flex items-center justify-center text-4xl">📚</div>
                            )}
                            <div className="p-4">
                              <h3 className="font-bold text-sm mb-1 line-clamp-2">{book.title}</h3>
                              {book.author && <p className="text-xs opacity-75">{book.author}</p>}
                              {book.year && <p className="text-xs opacity-50">{book.year}</p>}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          };
          return <BooksGrid key={index} />;
        }

        if (section.blockType === "productsGridSection") {
          const ProductsGrid = () => {
            const [products, setProducts] = useState<Product[]>([]);
            useEffect(() => {
              fetch(`/api/products?limit=${section.limit || 12}&sort=order`)
                .then((res) => res.json())
                .then((data) => setProducts(data.docs || []));
            }, []);

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => {
                      const imageUrl = product.image && typeof product.image === "object" ? (product.image as Media).url : "";
                      return (
                        <a key={i} href={product.url || section.shopUrl || "#"} target="_blank" rel="noopener noreferrer" className="block group">
                          <div className="rounded-lg overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow group-hover:shadow-lg">
                            {imageUrl ? (
                              <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                            ) : (
                              <div className="w-full h-48 bg-base-200 flex items-center justify-center text-3xl">🛍️</div>
                            )}
                            <div className="p-4">
                              <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                              <div className="flex items-center gap-2">
                                {product.price && <span className="font-bold text-primary">{product.price}</span>}
                                {product.outOfStock && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Out of Stock</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                  {section.shopUrl && (
                    <div className="mt-8 text-center">
                      <a href={section.shopUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                        View All Products
                      </a>
                    </div>
                  )}
                </div>
              </section>
            );
          };
          return <ProductsGrid key={index} />;
        }

        if (section.blockType === "contentGridSection") {
          const gapMap: Record<string, string> = {
            none: "0",
            sm: "0.5rem",
            md: "1.5rem",
            lg: "3rem",
          };
          const paddingMap: Record<string, string> = {
            none: "0",
            sm: "1rem",
            md: "2rem",
            lg: "3rem",
          };
          const alignMap: Record<string, string> = {
            left: "flex-start",
            center: "center",
            right: "flex-end",
          };
          const vAlignMap: Record<string, string> = {
            top: "flex-start",
            center: "center",
            bottom: "flex-end",
          };
          const items = section.items || [];
          return (
            <section key={index}>
              <div
                className={`grid ${section.wrapOnMobile !== false ? `md:grid-cols-${items.length}` : `grid-cols-${items.length}`}`}
                style={{ gap: gapMap[section.gap || "md"] }}
              >
                {items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: paddingMap[section.padding || "md"],
                      backgroundColor: getBgClass(item.backgroundColor),
                      color: getContentClass(item.backgroundColor),
                      display: "flex",
                      flexDirection: "column",
                      alignItems: alignMap[section.alignment || "left"],
                      justifyContent: vAlignMap[section.verticalAlignment || "top"],
                      textAlign: (section.alignment || "left") as "left" | "center" | "right",
                    }}
                  >
                    <LexicalRenderer content={item.content} />
                  </div>
                ))}
              </div>
            </section>
          );
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

          const renderColumn = (col: typeof section.leftColumn) => {
            const bgImageUrl = getMediaUrl(col?.backgroundImage);
            return (
              <div className="relative min-h-[200px]">
                {bgImageUrl && (
                  <>
                    <img src={bgImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    {col?.darkScrim && <div className="absolute inset-0 bg-black/50" />}
                  </>
                )}
                <div className="relative z-10 py-12 md:py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                  <LexicalRenderer content={col?.content} />
                </div>
              </div>
            );
          };

          return (
            <section key={index}>
              <div
                className={`grid ${section.wrapOnMobile !== false ? ratioMap[section.ratio || "1-1"] : `grid-cols-2 ${ratioMap[section.ratio || "1-1"].replace("md:", "")}`}`}
              >
                <div
                  className={leftSpan}
                  style={{
                    backgroundColor: getBgClass(section.leftColumn?.backgroundColor),
                    color: getContentClass(section.leftColumn?.backgroundColor),
                  }}
                >
                  {renderColumn(section.leftColumn)}
                </div>
                <div
                  className={rightSpan}
                  style={{
                    backgroundColor: getBgClass(section.rightColumn?.backgroundColor),
                    color: getContentClass(section.rightColumn?.backgroundColor),
                  }}
                >
                  {renderColumn(section.rightColumn)}
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
                        backgroundColor: getBgClass(col?.backgroundColor),
                        color: getContentClass(col?.backgroundColor),
                      }}
                    >
                      <div className="py-12 md:py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
                        <LexicalRenderer content={col?.content} />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          );
        }

        if (section.blockType === "contactSection") {
          return (
            <section
              key={index}
              className="relative py-16 md:py-24"
              style={{
                backgroundColor: getBgClass(section.backgroundColor),
                color: getContentClass(section.backgroundColor),
              }}
            >
              {section.backgroundImage && (
                <>
                  <img src={getMediaUrl(section.backgroundImage)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  {section.darkScrim && <div className="absolute inset-0 bg-black/50" />}
                </>
              )}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    {section.title && <h2 className="text-3xl font-bold mb-4">{section.title}</h2>}
                    <LexicalRenderer content={section.body} />
                  </div>
                  <div>
                    <p className="text-sm opacity-60 italic">Contact form coming soon.</p>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </>
  );
}
