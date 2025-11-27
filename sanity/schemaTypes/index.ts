import page from "./page";
import event from "./event";
import blogPost from "./blogPost";
import pressArticle from "./pressArticle";
import siteSettings from "./siteSettings";
import richText from "./richText";


import linkAnnotation from "./annotations/linkAnnotation";
import colorAnnotation from "./annotations/colorAnnotation";
import backgroundColorAnnotation from "./annotations/backgroundColorAnnotation";
import richTextImage from "./blocks/richTextImage";
import richTextButton from "./blocks/richTextButton";
import bannerSection from "./sections/bannerSection";
import fullWidthSection from "./sections/fullWidthSection";
import twoColumnSection from "./sections/twoColumnSection";
import threeColumnSection from "./sections/threeColumnSection";
import blogPostsCarouselSection from "./sections/blogPostsCarouselSection";
import pressCarouselSection from "./sections/pressCarouselSection";
import eventsCarouselSection from "./sections/eventsCarouselSection";
import heroCarouselSection, { heroSlide } from "./sections/heroCarouselSection";


export const schemaTypes = [
  siteSettings,
  page,
  event,
  blogPost,
  pressArticle,
  linkAnnotation,
  colorAnnotation,
  backgroundColorAnnotation,
  richTextImage,
  richTextButton,
  richText,
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
