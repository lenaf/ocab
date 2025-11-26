import { PortableTextRenderer } from "./portable-text-renderer";
import { SanityImage } from "./ui/sanity-image";
import { Button } from "./ui/button";
import { client } from "@/lib/sanity";
import { HeroCarousel } from "./HeroCarousel";
import { CarouselNav } from "./CarouselNav";
import type {
  HeroCarouselSection,
  BannerSection,
  FullWidthSection,
  TwoColumnSection,
  ThreeColumnSection,
  BlogPostsCarouselSection,
  PressCarouselSection,
  EventsCarouselSection,
  RichTextElement,
  ButtonElement,
  MediaElement,
  CarouselElement,
  ColumnElement,
  SimplerColor,
} from "@/types/sanity.types";

type Element = RichTextElement | ButtonElement | MediaElement | CarouselElement;

type Section =
  | HeroCarouselSection
  | BannerSection
  | FullWidthSection
  | TwoColumnSection
  | ThreeColumnSection
  | BlogPostsCarouselSection
  | PressCarouselSection
  | EventsCarouselSection;

// Helper function to render elements
function renderElement(
  element: Element,
  i: number,
  proseClass = "prose prose-lg max-w-none"
) {
  if (element._type === "richTextElement") {
    return (
      <div key={i} className={proseClass}>
        <PortableTextRenderer value={element.content} />
      </div>
    );
  }
  if (element._type === "buttonElement") {
    return (
      <Button
        key={i}
        href={element.link}
        variant={element.style}
        size={element.size}
        color={element.color?.value}
        textColor={element.textColor?.value}
      >
        {element.text}
      </Button>
    );
  }
  if (element._type === "mediaElement") {
    return (
      <SanityImage
        key={i}
        asset={element.image?.asset}
        alt={element.alt}
        className="rounded-lg w-full"
      />
    );
  }
  return null;
}

// Helper function to render background image
function renderBackgroundImage(image?: FullWidthSection['backgroundImage']) {
  if (!image?.asset?._ref) return null;
  return (
    <div className="absolute inset-0 -z-10">
      <SanityImage
        asset={image.asset}
        alt=""
        className="w-full h-full object-cover"
        width={1920}
      />
    </div>
  );
}

// Helper function to render column
function renderColumn(column: ColumnElement | undefined, key: string) {
  if (!column) return null;
  return (
    <div
      key={key}
      className="relative p-6 md:p-8 lg:p-12"
      style={{
        backgroundColor: column.backgroundColor?.value || "transparent",
      }}
    >
      {renderBackgroundImage(column.backgroundImage)}
      <div className="flex flex-col gap-6 md:gap-8">
        {column.elements?.map((element, i) => renderElement(element, i))}
      </div>
    </div>
  );
}

export async function RenderSections({ sections }: { sections: Section[] }) {
  if (!sections) return null;

  return (
    <>
      {sections.map((section, i) => (
        <SectionComponent key={i} section={section} />
      ))}
    </>
  );
}

async function SectionComponent({ section }: { section: Section }) {
  const { _type } = section;

  if (_type === "heroCarouselSection") {
    return <HeroCarousel slides={section.slides || []} />;
  }

  if (_type === "bannerSection") {
    return (
      <section
        className="py-4"
        style={{
          backgroundColor: section.backgroundColor?.value || "transparent",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {section.elements?.map((element, i) => {
              if (element._type === "mediaElement") {
                return (
                  <SanityImage
                    key={i}
                    asset={element.image?.asset}
                    alt={element.alt}
                    className="h-12"
                  />
                );
              }
              return renderElement(element, i, "prose");
            })}
          </div>
        </div>
      </section>
    );
  }

  if (_type === "fullWidthSection") {
    const alignClass =
      section.alignment === "center"
        ? "items-center text-center"
        : section.alignment === "right"
          ? "items-end text-right"
          : "items-start text-left";

    return (
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{
          backgroundColor: section.backgroundColor?.value || "transparent",
        }}
      >
        {renderBackgroundImage(section.backgroundImage)}
        <div className="container mx-auto px-6 md:px-12">
          <div className={`flex flex-col gap-6 md:gap-8 ${alignClass}`}>
            {section.elements?.map((element, i) =>
              renderElement(
                element,
                i,
                "prose prose-lg max-w-none prose-headings:text-inherit prose-p:text-inherit"
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (_type === "twoColumnSection") {
    const ratioClass =
      section.ratio === "3-2"
        ? "md:grid-cols-[3fr_2fr]"
        : section.ratio === "2-3"
          ? "md:grid-cols-[2fr_3fr]"
          : section.ratio === "2-1"
            ? "md:grid-cols-[2fr_1fr]"
            : section.ratio === "1-2"
              ? "md:grid-cols-[1fr_2fr]"
              : "md:grid-cols-2";

    return (
      <section
        style={{
          backgroundColor: section.backgroundColor?.value || "transparent",
        }}
      >
        <div className={`grid ${ratioClass}`}>
          {renderColumn(section.leftColumn, "left")}
          {renderColumn(section.rightColumn, "right")}
        </div>
      </section>
    );
  }

  if (_type === "threeColumnSection") {
    const ratioClass =
      section.ratio === "2-1-1"
        ? "md:grid-cols-[2fr_1fr_1fr]"
        : section.ratio === "1-2-1"
          ? "md:grid-cols-[1fr_2fr_1fr]"
          : section.ratio === "1-1-2"
            ? "md:grid-cols-[1fr_1fr_2fr]"
            : "md:grid-cols-3";

    return (
      <section
        style={{
          backgroundColor: section.backgroundColor?.value || "transparent",
        }}
      >
        <div className={`grid ${ratioClass}`}>
          {renderColumn(section.column1, "col1")}
          {renderColumn(section.column2, "col2")}
          {renderColumn(section.column3, "col3")}
        </div>
      </section>
    );
  }

  if (_type === "blogPostsCarouselSection") {
    const articles = await client.fetch<
      Array<{
        slug: string;
        title: string;
        category?: string;
        image?: FullWidthSection['backgroundImage'];
        backgroundColor?: SimplerColor;
      }>
    >(
      `*[_type == "blogPost"] | order(publishedAt desc)[0...${section.limit || 12}]{
      title,
      excerpt,
      image,
      backgroundColor,
      "slug": slug.current,
      category
    }`
    );

    return (
      <section
        className="py-20 px-6 md:px-12 relative"
        style={{ backgroundColor: section.backgroundColor?.value || "#f5f3f0" }}
      >
        {section.heading && (
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 uppercase">
            {section.heading}
          </h2>
        )}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 md:-mx-12 px-6 md:px-12"
          id="blog-posts-carousel"
        >
          <div className="flex gap-4 pb-4">
            {articles.map((article) => (
              <a
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group relative flex-none w-[85vw] md:w-[400px] aspect-[4/5] overflow-hidden"
                style={{
                  backgroundColor: article.backgroundColor?.value || "#8b7355",
                }}
              >
                {article.image?.asset?._ref && (
                  <SanityImage
                    asset={article.image.asset}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={800}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                  {article.category && (
                    <span className="text-xs tracking-[0.2em] uppercase text-white/80 mb-3 block font-bold">
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-white font-bold text-2xl leading-tight uppercase">
                    {article.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
        <CarouselNav id="blog-posts-carousel" color="white" />
      </section>
    );
  }

  if (_type === "pressCarouselSection") {
    const press = await client.fetch<
      Array<{
        url: string;
        title: string;
        publication: string;
        image?: FullWidthSection['backgroundImage'];
        backgroundColor?: SimplerColor;
      }>
    >(
      `*[_type == "pressArticle"] | order(publishedAt desc)[0...${section.limit || 8}]{
      title,
      publication,
      url,
      image,
      backgroundColor
    }`
    );

    return (
      <section
        className="py-20 px-6 md:px-12 relative"
        style={{ backgroundColor: section.backgroundColor?.value || "#8b7355" }}
      >
        {section.heading && (
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 uppercase text-white">
            {section.heading}
          </h2>
        )}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 md:-mx-12 px-6 md:px-12"
          id="press-carousel"
        >
          <div className="flex gap-4 pb-4">
            {press.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener"
                className="group relative flex-none w-[70vw] md:w-[350px] aspect-square overflow-hidden"
                style={{
                  backgroundColor: item.backgroundColor?.value || "#a0826d",
                }}
              >
                {item.image?.asset?._ref && (
                  <SanityImage
                    asset={item.image.asset}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={500}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-xs tracking-[0.2em] uppercase text-white/80 mb-2 block font-bold">
                      {item.publication}
                    </span>
                    <h3 className="font-bold text-lg leading-tight uppercase">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <CarouselNav id="press-carousel" color="white" />
      </section>
    );
  }

  if (_type === "eventsCarouselSection") {
    const events = await client.fetch<
      Array<{
        slug: string;
        title: string;
        date: string;
        location: string;
        actionNetworkUrl?: string;
        image?: FullWidthSection['backgroundImage'];
        backgroundColor?: SimplerColor;
      }>
    >(
      `*[_type == "event"] | order(date asc)[0...${section.limit || 12}]{
      title,
      date,
      location,
      image,
      backgroundColor,
      actionNetworkUrl,
      "slug": slug.current
    }`
    );

    return (
      <section
        className="py-20 px-6 md:px-12 relative"
        style={{ backgroundColor: section.backgroundColor?.value || "#2c2c2c" }}
      >
        {section.heading && (
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 uppercase text-white">
            {section.heading}
          </h2>
        )}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 md:-mx-12 px-6 md:px-12"
          id="events-carousel"
        >
          <div className="flex gap-4 pb-4">
            {events.map((event) => (
              <div
                key={event.slug}
                className="group relative flex-none w-[85vw] md:w-[400px] aspect-[4/5] overflow-hidden"
                style={{
                  backgroundColor: event.backgroundColor?.value || "#9ca38f",
                }}
              >
                {event.image?.asset?._ref && (
                  <SanityImage
                    asset={event.image.asset}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={800}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                  <span className="text-xs tracking-[0.2em] uppercase text-white/80 mb-4 block font-bold">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="text-white font-bold text-2xl leading-tight mb-3 uppercase">
                    {event.title}
                  </h3>
                  <span className="text-sm text-white/80 font-bold tracking-wide uppercase mb-4">
                    {event.location}
                  </span>
                  {event.actionNetworkUrl && (
                    <a
                      href={event.actionNetworkUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-block px-4 py-2 text-sm font-bold uppercase tracking-wide border-2 border-white text-white hover:bg-white/20 transition-all"
                    >
                      RSVP
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <CarouselNav id="events-carousel" color="white" />
      </section>
    );
  }

  return null;
}
