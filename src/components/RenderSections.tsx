"use client";

import Link from "next/link";
import { LexicalRenderer } from "./LexicalRenderer";
import { HeroCarousel } from "./HeroCarousel";
import { themeConfig } from "@/config/theme";
import { useState, useEffect, useRef } from "react";
import type {
  Page,
  Media,
} from "@/payload-types";
import { EventCard } from "./cards/EventCard";
import { BlogPostCard } from "./cards/BlogPostCard";
import { PressCard } from "./cards/PressCard";
import { WorkCard } from "./cards/WorkCard";
import { TeamMemberCard } from "./cards/TeamMemberCard";
import { BookCard } from "./cards/BookCard";
import { ProductCard } from "./cards/ProductCard";
import { TagCard } from "./cards/TagCard";
import { SignupForm } from "./SignupForm";
import { ActionNetworkForm, type FormFieldConfig } from "./ActionNetworkForm";

type Section = NonNullable<Page["sections"]>[number];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function resolveLinkHref(section: Record<string, unknown>, prefix: string): string | null {
  const linkType = section[`${prefix}LinkType`];
  if (linkType === "page") {
    const page = section[`${prefix}Page`];
    if (typeof page === "object" && page && (page as Record<string, unknown>).slug) {
      const slug = (page as Record<string, unknown>).slug as string;
      return `/${slug === "home" ? "" : slug}`;
    }
    return null;
  }
  const url = section[`${prefix}Url`] as string | undefined;
  return url || null;
}

function isExternalLink(section: Record<string, unknown>, prefix: string): boolean {
  return section[`${prefix}LinkType`] !== "page";
}

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
      accent2: themeConfig.colors.accent2,
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
      accent2: themeConfig.colors.accent2Content,
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
              {getMediaUrl(section.backgroundImage) && (
                <>
                  <img src={getMediaUrl(section.backgroundImage)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  {section.darkScrim && <div className="absolute inset-0 bg-black/50" />}
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
              {getMediaUrl(section.backgroundImage) && (
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
              {section.floatingItems?.map((item, i) => {
                const mediaAlt =
                  typeof item.image === "object" && item.image?.alt
                    ? item.image.alt
                    : "";
                const itemUrl = getMediaUrl(item.image);
                if (!itemUrl) return null;
                return (
                  <div key={i}>
                    <img
                      src={itemUrl}
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
                      src={itemUrl}
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
                  {getMediaUrl(slide.backgroundImage) && (
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


        if (section.blockType === "collectionListSection") {
          const CollectionList = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [items, setItems] = useState<AnyRecord[]>([]);
            const carouselRef = useRef<HTMLDivElement>(null);
            const sectionData = section as unknown as Record<string, unknown>;
            const dataSource = sectionData.dataSource as string;
            const layout = (sectionData.layout as string) || "grid";
            const columns = (sectionData.columns as string) || "3";
            const limit = (sectionData.limit as number) || 50;
            const sortField = (sectionData.sortField as string) || "createdAt_desc";
            const filterFeatured = sectionData.filterFeatured as boolean;
            const upcomingOnly = sectionData.upcomingOnly as boolean;
            const emptyMessage = (sectionData.emptyMessage as string) || "Nothing to show right now. Check back soon!";

            useEffect(() => {
              if (!dataSource) return;
              const [field, dir] = sortField.split("_");
              const sortParam = dir === "desc" ? `-${field}` : field;
              let whereParams = "";
              if (filterFeatured) whereParams += "&where[featured][equals]=true";
              if (upcomingOnly && dataSource === "events") {
                whereParams += `&where[startDate][greater_than]=${new Date().toISOString()}`;
              }
              fetch(`/api/${dataSource}?limit=${limit}&sort=${sortParam}${whereParams}&depth=1`)
                .then((res) => res.json())
                .then((data) => setItems(data.docs || []));
            }, [dataSource, limit, sortField, filterFeatured, upcomingOnly]);

            const getItemImage = (item: AnyRecord): string => {
              const imgFields = ["image", "coverImage", "cover", "photo"];
              for (const f of imgFields) {
                const media = item[f];
                if (media && typeof media === "object" && (media as Record<string, unknown>).url) {
                  return (media as Record<string, unknown>).url as string;
                }
              }
              return "";
            };

            const getItemTitle = (item: AnyRecord): string => {
              return (item.title || item.name || "") as string;
            };

            const getItemHref = (item: AnyRecord): string | null => {
              if (item.slug && dataSource) {
                const pathMap: Record<string, string> = {
                  "blog-posts": "/blog",
                  "press-articles": "/press",
                  events: "/events",
                  campaigns: "/work",
                  tags: "/tags",
                };
                const base = pathMap[dataSource];
                if (base) return `${base}/${item.slug}`;
              }
              if (item.url) return item.url as string;
              if (item.externalUrl) return item.externalUrl as string;
              return null;
            };

            const getItemSubtitle = (item: AnyRecord): string => {
              return (item.excerpt || item.summary || item.role || item.author || item.publication || "") as string;
            };

            const getItemMeta = (item: AnyRecord): string => {
              if (item.publishedAt) return new Date(item.publishedAt as string).toLocaleDateString();
              if (item.startDate) return new Date(item.startDate as string).toLocaleDateString();
              if (item.year) return String(item.year);
              if (item.category) return item.category as string;
              if (item.type) return (item.type as string).replace("-", " ");
              return "";
            };

            const isItemExternal = (item: AnyRecord): boolean => {
              if (item.accessType === "url") return true;
              if (dataSource === "press-articles" || dataSource === "books" || dataSource === "products") return true;
              return false;
            };

            const colsClass: Record<string, string> = {
              "2": "md:grid-cols-2",
              "3": "md:grid-cols-2 lg:grid-cols-3",
              "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            };

            const wrapWithLink = (content: React.ReactNode, item: AnyRecord, i: number) => {
              const href = getItemHref(item);
              const external = isItemExternal(item);
              if (!href) return <div key={i}>{content}</div>;
              if (external) return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a>;
              return <Link key={i} href={href} className="block h-full">{content}</Link>;
            };

            const renderCard = (item: AnyRecord, i: number) => {
              switch (dataSource) {
                case "events":
                  return wrapWithLink(<EventCard item={item} getItemImage={getItemImage} />, item, i);

                case "blog-posts":
                  return wrapWithLink(<BlogPostCard item={item} getItemImage={getItemImage} />, item, i);

                case "press-articles":
                  return wrapWithLink(<PressCard item={item} getItemImage={getItemImage} />, item, i);

                case "campaigns":
                  return wrapWithLink(<WorkCard item={item} getItemImage={getItemImage} />, item, i);

                case "team-members":
                  return <TeamMemberCard key={i} item={item} getItemImage={getItemImage} />;

                case "books":
                  return wrapWithLink(<BookCard item={item} getItemImage={getItemImage} />, item, i);

                case "products":
                  return wrapWithLink(<ProductCard item={item} getItemImage={getItemImage} />, item, i);

                case "tags":
                  return <TagCard key={i} item={item} />;

                default: {
                  const imageUrl = getItemImage(item);
                  const itemTitle = getItemTitle(item);
                  const sub = getItemSubtitle(item);
                  const meta = getItemMeta(item);
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
                      {imageUrl && <img src={imageUrl} alt={itemTitle} className="w-full h-48 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        {meta && <span className="text-xs font-bold uppercase text-primary mb-1">{meta}</span>}
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{itemTitle}</h3>
                        {sub && <p className="text-sm opacity-75 line-clamp-3 flex-1">{sub}</p>}
                      </div>
                    </div>,
                    item, i
                  );
                }
              }
            };

            if (items.length === 0 && emptyMessage) {
              return (
                <section className="py-12 md:py-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center opacity-60 py-8">{emptyMessage}</p>
                  </div>
                </section>
              );
            }

            const bgColor = sectionData.backgroundColor as string | undefined;

            return (
              <section
                className="relative py-12 md:py-16"
                style={{
                  backgroundColor: getBgClass(bgColor),
                  color: getContentClass(bgColor),
                }}
              >
                {getMediaUrl(sectionData.backgroundImage as string | Media | null | undefined) && (
                  <>
                    <img src={getMediaUrl(sectionData.backgroundImage as string | Media | null | undefined)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    {sectionData.darkScrim && <div className="absolute inset-0 bg-black/50" />}
                  </>
                )}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {(() => {
                    const heading = sectionData.heading as string | undefined;
                    const desc = sectionData.description as string | undefined;
                    if (!heading && !desc) return null;
                    return (
                      <div className="mb-8">
                        {heading && <h2 className="text-3xl md:text-4xl font-bold">{heading}</h2>}
                        {desc && <p className="mt-2 text-lg opacity-75">{desc}</p>}
                      </div>
                    );
                  })()}

                  {layout === "grid" && (
                    <div className={`grid gap-6 ${colsClass[columns] || colsClass["3"]}`}>
                      {items.map((item, i) => renderCard(item, i))}
                    </div>
                  )}

                  {layout === "list" && (
                    <div className="space-y-4">
                      {items.map((item, i) => {
                        const imageUrl = getItemImage(item);
                        const itemTitle = getItemTitle(item);
                        const href = getItemHref(item);
                        const sub = getItemSubtitle(item);
                        const meta = getItemMeta(item);
                        const external = isItemExternal(item);

                        const row = (
                          <div className="flex gap-4 p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            {imageUrl && (
                              <img src={imageUrl} alt={itemTitle} className="w-24 h-24 object-cover shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              {meta && <span className="text-xs font-bold uppercase text-primary">{meta}</span>}
                              <h3 className="font-bold text-lg line-clamp-1">{itemTitle}</h3>
                              {sub && <p className="text-sm opacity-75 line-clamp-2">{sub}</p>}
                            </div>
                          </div>
                        );

                        if (!href) return <div key={i}>{row}</div>;
                        if (external) return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="block">{row}</a>;
                        return <Link key={i} href={href} className="block">{row}</Link>;
                      })}
                    </div>
                  )}

                  {layout === "carousel" && (
                    <div className="relative">
                      <div ref={carouselRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                        {items.map((item, i) => (
                          <div key={i} className={`flex-shrink-0 snap-start ${dataSource === "tags" ? "w-28" : "w-72"}`}>
                            {renderCard(item, i)}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                        className="absolute -left-14 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                        style={{ color: getContentClass(bgColor) || "currentColor" }}
                        aria-label="Scroll left"
                      >
                        <svg className="w-7 h-14" fill="currentColor" viewBox="0 0 10 20"><path d="M8 2L2 10l6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                        className="absolute -right-14 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                        style={{ color: getContentClass(bgColor) || "currentColor" }}
                        aria-label="Scroll right"
                      >
                        <svg className="w-7 h-14" fill="currentColor" viewBox="0 0 10 20"><path d="M2 2l6 8-6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                      </button>
                    </div>
                  )}

                  {layout === "featured" && items.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="lg:row-span-2">
                        {renderCard(items[0], 0)}
                      </div>
                      <div className={`grid gap-4 ${items.length > 2 ? "grid-rows-2" : ""}`}>
                        {items.slice(1, 5).map((item, i) => renderCard(item, i + 1))}
                      </div>
                    </div>
                  )}

                  {(() => {
                    const viewAllHref = resolveLinkHref(sectionData, "viewAll");
                    const viewAllLabel = (sectionData.viewAllLabel as string) || "View All";
                    if (!viewAllHref) return null;
                    const external = isExternalLink(sectionData, "viewAll");
                    return (
                      <div className="mt-8 text-center">
                        {external ? (
                          <a href={viewAllHref} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-primary text-white font-bold hover:opacity-90 transition-opacity">
                            {viewAllLabel}
                          </a>
                        ) : (
                          <Link href={viewAllHref} className="inline-block px-6 py-3 bg-primary text-white font-bold hover:opacity-90 transition-opacity">
                            {viewAllLabel}
                          </Link>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </section>
            );
          };
          return <CollectionList key={index} />;
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

        if (section.blockType === "formSection") {
          const formType = section.formType as string;
          return (
            <section
              key={index}
              className="relative py-16 md:py-24"
              style={{
                backgroundColor: getBgClass(section.backgroundColor),
                color: getContentClass(section.backgroundColor),
              }}
            >
              {getMediaUrl(section.backgroundImage) && (
                <>
                  <img src={getMediaUrl(section.backgroundImage)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  {section.darkScrim && <div className="absolute inset-0 bg-black/50" />}
                </>
              )}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <LexicalRenderer content={section.content} />
                {formType === "embed" && section.embedCode && (
                  <div className="mt-8" dangerouslySetInnerHTML={{ __html: section.embedCode as string }} />
                )}
                {(formType === "actionNetwork" || formType === "contact" || formType === "newsletter") && (
                  section.actionNetworkFormUrl ? (
                    <ActionNetworkForm
                      formUrl={section.actionNetworkFormUrl as string}
                      fields={section.fields as FormFieldConfig[] | null | undefined}
                      buttonLabel={(section.submitLabel as string) || undefined}
                      successMessage={(section.successMessage as string) || undefined}
                    />
                  ) : (
                    <SignupForm
                      mode={formType === "contact" ? "contact" : "newsletter"}
                      source={formType}
                      successMessage={(section.successMessage as string) || undefined}
                    />
                  )
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
