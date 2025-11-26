import page from "./page";
import event from "./event";
import blogPost from "./blogPost";
import pressArticle from "./pressArticle";
import siteSettings from "./siteSettings";
import richText from "./richText";
import richTextElement from "./elements/richTextElement";
import mediaElement from "./elements/mediaElement";
import buttonElement from "./elements/buttonElement";
import carouselElement, {carouselImage} from "./elements/carouselElement";
import columnElement from "./elements/columnElement";
import linkAnnotation from "./annotations/linkAnnotation";
import colorAnnotation from "./annotations/colorAnnotation";
import richTextImage from "./blocks/richTextImage";
import bannerSection from "./sections/bannerSection";
import fullWidthSection from "./sections/fullWidthSection";
import twoColumnSection from "./sections/twoColumnSection";
import threeColumnSection from "./sections/threeColumnSection";
import blogPostsCarouselSection from "./sections/blogPostsCarouselSection";
import pressCarouselSection from "./sections/pressCarouselSection";
import eventsCarouselSection from "./sections/eventsCarouselSection";
import heroCarouselSection, {heroSlide} from "./sections/heroCarouselSection";

export const schemaTypes = [
  siteSettings,
  page,
  event,
  blogPost,
  pressArticle,
  linkAnnotation,
  colorAnnotation,
  richTextImage,
  richText,
  richTextElement,
  mediaElement,
  buttonElement,
  carouselElement,
  carouselImage,
  columnElement,
  heroSlide,
  bannerSection,
  fullWidthSection,
  twoColumnSection,
  threeColumnSection,
  blogPostsCarouselSection,
  pressCarouselSection,
  eventsCarouselSection,
  heroCarouselSection,
];
