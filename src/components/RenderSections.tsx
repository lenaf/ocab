"use client";

import Link from "next/link";
import { LexicalRenderer } from "./LexicalRenderer";
import { HeroCarousel } from "./HeroCarousel";
import { themeConfig } from "@/config/theme";
import { useState, useEffect } from "react";
import type {
  Page,
  Media,
} from "@/payload-types";

type Section = NonNullable<Page["sections"]>[number];

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
            const [items, setItems] = useState<Record<string, any>[]>([]);
            const sectionData = section as unknown as Record<string, unknown>;
            const dataSource = sectionData.dataSource as string;
            const layout = (sectionData.layout as string) || "grid";
            const columns = (sectionData.columns as string) || "3";
            const limit = (sectionData.limit as number) || 6;
            const sortField = (sectionData.sortField as string) || "createdAt_desc";
            const filterFeatured = sectionData.filterFeatured as boolean;
            const upcomingOnly = sectionData.upcomingOnly as boolean;
            const title = sectionData.title as string | undefined;
            const subtitle = sectionData.subtitle as string | undefined;
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

            const getItemImage = (item: Record<string, any>): string => {
              const imgFields = ["image", "coverImage", "cover", "photo"];
              for (const f of imgFields) {
                const media = item[f];
                if (media && typeof media === "object" && (media as Record<string, unknown>).url) {
                  return (media as Record<string, unknown>).url as string;
                }
              }
              return "";
            };

            const getItemTitle = (item: Record<string, any>): string => {
              return (item.title || item.name || "") as string;
            };

            const getItemHref = (item: Record<string, any>): string | null => {
              if (item.slug && dataSource) {
                const pathMap: Record<string, string> = {
                  "blog-posts": "/blog",
                  "press-articles": "/press",
                  events: "/events",
                  campaigns: "/campaigns",
                  research: "/research",
                };
                const base = pathMap[dataSource];
                if (base) return `${base}/${item.slug}`;
              }
              if (item.url) return item.url as string;
              if (item.externalUrl) return item.externalUrl as string;
              return null;
            };

            const getItemSubtitle = (item: Record<string, any>): string => {
              return (item.excerpt || item.summary || item.role || item.author || item.publication || "") as string;
            };

            const getItemMeta = (item: Record<string, any>): string => {
              if (item.publishedAt) return new Date(item.publishedAt as string).toLocaleDateString();
              if (item.startDate) return new Date(item.startDate as string).toLocaleDateString();
              if (item.year) return String(item.year);
              if (item.category) return item.category as string;
              if (item.type) return (item.type as string).replace("-", " ");
              return "";
            };

            const isItemExternal = (item: Record<string, any>): boolean => {
              if (item.accessType === "url") return true;
              if (dataSource === "press-articles" || dataSource === "books" || dataSource === "products") return true;
              return false;
            };

            const colsClass: Record<string, string> = {
              "2": "md:grid-cols-2",
              "3": "md:grid-cols-2 lg:grid-cols-3",
              "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            };

            const wrapWithLink = (content: React.ReactNode, item: Record<string, any>, i: number) => {
              const href = getItemHref(item);
              const external = isItemExternal(item);
              if (!href) return <div key={i}>{content}</div>;
              if (external) return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a>;
              return <Link key={i} href={href} className="block h-full">{content}</Link>;
            };

            const renderCard = (item: Record<string, any>, i: number) => {
              switch (dataSource) {
                case "events": {
                  const imageUrl = getItemImage(item);
                  const startDate = item.startDate ? new Date(item.startDate as string) : null;
                  const location = item.location as Record<string, any> | undefined;
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
                      {imageUrl && <img src={imageUrl} alt={item.title as string} className="w-full h-44 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        {startDate && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5">
                              {startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </span>
                            {item.eventType && <span className="text-xs opacity-60 capitalize">{(item.eventType as string).replace("-", " ")}</span>}
                          </div>
                        )}
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
                        {location?.venue && <p className="text-sm opacity-60">{location.venue as string}</p>}
                      </div>
                    </div>,
                    item, i
                  );
                }

                case "blog-posts": {
                  const imageUrl = getItemImage(item);
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
                      {imageUrl && <img src={imageUrl} alt={item.title as string} className="w-full h-44 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          {item.category && <span className="text-xs font-bold uppercase text-primary">{item.category as string}</span>}
                          {item.publishedAt && <span className="text-xs opacity-50">{new Date(item.publishedAt as string).toLocaleDateString()}</span>}
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
                        {item.excerpt && <p className="text-sm opacity-75 line-clamp-3 flex-1">{item.excerpt as string}</p>}
                      </div>
                    </div>,
                    item, i
                  );
                }

                case "press-articles": {
                  const imageUrl = getItemImage(item);
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
                      {imageUrl && <img src={imageUrl} alt={item.title as string} className="w-full h-44 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          {item.publication && <span className="text-xs font-bold text-accent">{item.publication as string}</span>}
                          {item.type && <span className="text-xs opacity-50 capitalize">{(item.type as string).replace("-", " ")}</span>}
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
                        {item.excerpt && <p className="text-sm opacity-75 line-clamp-3 flex-1">{item.excerpt as string}</p>}
                        {item.publishedAt && <p className="text-xs opacity-50 mt-auto pt-2">{new Date(item.publishedAt as string).toLocaleDateString()}</p>}
                      </div>
                    </div>,
                    item, i
                  );
                }

                case "campaigns": {
                  const imageUrl = getItemImage(item);
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-neutral text-neutral-content transition-shadow hover:shadow-lg h-full flex flex-col">
                      {imageUrl && <img src={imageUrl} alt={item.title as string} className="w-full h-44 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
                        {item.summary && <p className="text-sm opacity-80 line-clamp-3 flex-1">{item.summary as string}</p>}
                        <span className="inline-block mt-3 text-sm font-bold underline">
                          {(item.callToAction as string) || "Learn More"}
                        </span>
                      </div>
                    </div>,
                    item, i
                  );
                }

                case "team-members": {
                  const photoUrl = getItemImage(item);
                  return (
                    <div key={i} className="text-center">
                      {photoUrl ? (
                        <img src={photoUrl} alt={item.name as string} className="w-32 h-32 rounded-full object-cover mx-auto mb-3" />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-base-200 mx-auto mb-3 flex items-center justify-center text-3xl font-bold opacity-40">
                          {(item.name as string)?.charAt(0)}
                        </div>
                      )}
                      <h3 className="font-bold text-lg">{item.name as string}</h3>
                      {item.role && <p className="text-sm opacity-75">{item.role as string}</p>}
                      {item.pronouns && <p className="text-xs opacity-50">{item.pronouns as string}</p>}
                    </div>
                  );
                }

                case "books": {
                  const coverUrl = getItemImage(item);
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
                      {coverUrl ? (
                        <img src={coverUrl} alt={item.title as string} className="w-full h-52 object-cover" />
                      ) : (
                        <div className="w-full h-52 bg-primary/10 flex items-center justify-center text-4xl">📚</div>
                      )}
                      <div className="p-4 flex-1">
                        <h3 className="font-bold text-sm mb-1 line-clamp-2">{item.title as string}</h3>
                        {item.author && <p className="text-xs opacity-75">{item.author as string}</p>}
                        {item.year && <p className="text-xs opacity-50">{item.year as string}</p>}
                      </div>
                    </div>,
                    item, i
                  );
                }

                case "products": {
                  const imageUrl = getItemImage(item);
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.name as string} className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-base-200 flex items-center justify-center text-3xl">🛍️</div>
                      )}
                      <div className="p-4 flex-1">
                        <h3 className="font-bold text-sm mb-1">{item.name as string}</h3>
                        <div className="flex items-center gap-2">
                          {item.price && <span className="font-bold text-primary">{item.price as string}</span>}
                          {item.outOfStock && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">Out of Stock</span>}
                        </div>
                      </div>
                    </div>,
                    item, i
                  );
                }

                case "research": {
                  const coverUrl = getItemImage(item);
                  return wrapWithLink(
                    <div className="overflow-hidden shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-lg h-full flex flex-col">
                      {coverUrl && <img src={coverUrl} alt={item.title as string} className="w-full h-40 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        {item.type && <span className="text-xs font-bold uppercase text-primary mb-1">{(item.type as string).replace("-", " ")}</span>}
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title as string}</h3>
                        {item.summary && <p className="text-sm opacity-75 line-clamp-3 flex-1">{item.summary as string}</p>}
                        <span className="inline-block mt-3 text-sm font-bold text-primary">{(item.ctaLabel as string) || "Read More"} →</span>
                      </div>
                    </div>,
                    item, i
                  );
                }

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
                    {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
                    {subtitle && <p className="text-lg opacity-75 mb-8">{subtitle}</p>}
                    <p className="text-center opacity-60 py-8">{emptyMessage}</p>
                  </div>
                </section>
              );
            }

            return (
              <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
                  {subtitle && <p className="text-lg opacity-75 mb-8">{subtitle}</p>}

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
                    <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                      {items.map((item, i) => (
                        <div key={i} className="flex-shrink-0 w-72">
                          {renderCard(item, i)}
                        </div>
                      ))}
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
              {getMediaUrl(section.backgroundImage) && (
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
