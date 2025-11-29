import { PortableTextRenderer } from "./portable-text-renderer";
import { SanityImage } from "./ui/sanity-image";
import { Button } from "./ui/Button";
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
        className="py-3 px-6 md:px-12 lg:px-24"
        style={{
          backgroundColor: section.backgroundColor?.value || "transparent",
        }}
      >
        {renderBackgroundImage(section.backgroundImage)}
        <div className="prose max-w-none text-center mx-auto [&>*]:my-0">
          <PortableTextRenderer value={section.content} />
        </div>
      </section>
    );
  }

  if (_type === "fullWidthSection") {
    const bgColor = section.container?.backgroundColor?.value || 'transparent';
    const maxWidthClass = 
      section.container?.maxWidth === '1/2' ? 'max-w-[50%]' :
      section.container?.maxWidth === '1/3' ? 'max-w-[33.333%]' :
      section.container?.maxWidth === '2/3' ? 'max-w-[66.666%]' : 'max-w-none';
    
    return (
      <section className="py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-24 relative" style={{ backgroundColor: bgColor }}>
        {section.container?.backgroundImage?.asset && (
          <div className="absolute inset-0 -z-10">
            <SanityImage asset={section.container.backgroundImage.asset} alt="" className="w-full h-full object-cover" width={1920} />
          </div>
        )}
        {section.container?.collageItems?.map((item, i: number) => (
          <div
            key={i}
            className="absolute z-0 hidden md:block"
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
        {section.container?.collageItems?.map((item, i: number) => (
          <div
            key={`mobile-${i}`}
            className="absolute z-0 md:hidden"
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
        <div className={`relative z-10 flex ${section.container?.contentAlignment === 'left' ? 'justify-start' : section.container?.contentAlignment === 'right' ? 'justify-end' : 'justify-center'}`}>
          <div className={`prose prose-lg ${maxWidthClass} text-${section.container?.contentAlignment || 'center'} ${section.container?.textColor === 'light' ? 'text-white prose-invert' : 'text-gray-900'}`}>
            <PortableTextRenderer value={section.container?.content} />
          </div>
        </div>
      </section>
    );
  }

  if (_type === "twoColumnSection") {
    const ratioClass =
      section.ratio === "3-2" ? "md:grid-cols-[3fr_2fr]" :
      section.ratio === "2-3" ? "md:grid-cols-[2fr_3fr]" :
      section.ratio === "2-1" ? "md:grid-cols-[2fr_1fr]" :
      section.ratio === "1-2" ? "md:grid-cols-[1fr_2fr]" : "md:grid-cols-2";

    const renderCol = (col: TwoColumnSection['leftColumn']) => {
      if (!col) return null;
      const bgColor = col.backgroundColor?.value || 'transparent';
      const textColorClass = col.textColor === 'light' ? 'text-white prose-invert' : 'text-gray-900';
      return (
        <div className="relative p-6 md:p-8 lg:p-12" style={{ backgroundColor: bgColor }}>
          {col.backgroundImage?.asset && (
            <div className="absolute inset-0 -z-10">
              <SanityImage asset={col.backgroundImage.asset} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className={`prose max-w-none text-${col.contentAlignment || 'left'} ${textColorClass}`}>
            <PortableTextRenderer value={col.content} />
          </div>
        </div>
      );
    };

    return (
      <section>
        <div className={`grid ${ratioClass}`}>
          {renderCol(section.leftColumn)}
          {renderCol(section.rightColumn)}
        </div>
      </section>
    );
  }

  if (_type === "threeColumnSection") {
    const ratioClass =
      section.ratio === "2-1-1" ? "md:grid-cols-[2fr_1fr_1fr]" :
      section.ratio === "1-2-1" ? "md:grid-cols-[1fr_2fr_1fr]" :
      section.ratio === "1-1-2" ? "md:grid-cols-[1fr_1fr_2fr]" : "md:grid-cols-3";

    const renderCol = (col: ThreeColumnSection['column1']) => {
      if (!col) return null;
      const bgColor = col.backgroundColor?.value || 'transparent';
      const textColorClass = col.textColor === 'light' ? 'text-white prose-invert' : 'text-gray-900';
      return (
        <div className="relative p-6 md:p-8 lg:p-12" style={{ backgroundColor: bgColor }}>
          {col.backgroundImage?.asset && (
            <div className="absolute inset-0 -z-10">
              <SanityImage asset={col.backgroundImage.asset} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className={`prose max-w-none text-${col.contentAlignment || 'left'} ${textColorClass}`}>
            <PortableTextRenderer value={col.content} />
          </div>
        </div>
      );
    };

    return (
      <section>
        <div className={`grid ${ratioClass}`}>
          {renderCol(section.column1)}
          {renderCol(section.column2)}
          {renderCol(section.column3)}
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
        className="py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-24 relative"
        style={{ backgroundColor: section.backgroundColor?.value || "#f5f3f0" }}
      >
        {section.heading && (
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 uppercase">
            {section.heading}
          </h2>
        )}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24"
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
        className="py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-24 relative"
        style={{ backgroundColor: section.backgroundColor?.value || "#8b7355" }}
      >
        {section.heading && (
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 uppercase text-white">
            {section.heading}
          </h2>
        )}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24"
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
        className="py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-24 relative"
        style={{ backgroundColor: section.backgroundColor?.value || "#2c2c2c" }}
      >
        {section.heading && (
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 uppercase text-white">
            {section.heading}
          </h2>
        )}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24"
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
