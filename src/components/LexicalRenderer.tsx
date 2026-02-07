import Image from "next/image";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { Media } from "@/payload-types";

function getImageUrl(image: string | Media | null | undefined) {
  if (!image) return null;
  if (typeof image === "string") return `/api/media/file/${image}`;
  if (image.url) return image.url;
  if (image.filename) return `/api/media/file/${image.filename}`;
  return null;
}

import { Button } from "@/components/ui/Button";

export function LexicalRenderer({
  content,
  textColor,
}: {
  content: SerializedEditorState | null | undefined;
  textColor?: string;
}) {
  if (!content?.root?.children) return null;

  // todo: add typography settings in payload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderNode = (node: any, i: number): React.ReactNode => {
    if (node.type === "upload") {
      const imageUrl = getImageUrl(
        typeof node.value === "object" && node.value && "id" in node.value
          ? (node.value as Media)
          : null,
      );
      if (!imageUrl) return null;
      const media =
        typeof node.value === "object" && node.value && "id" in node.value
          ? (node.value as Media)
          : null;
      return (
        <div key={i} className="my-4">
          <Image
            src={imageUrl}
            alt={media?.alt || ""}
            width={media?.width || 800}
            height={media?.height || 600}
            className="max-w-full h-auto rounded"
          />
        </div>
      );
    }
    if (node.type === "block" && node.fields?.blockType === "button") {
      const { text, url, style = "btn-primary", size = "md" } = node.fields;
      return (
        <Button key={i} classNames={style} size={size} href={url}>
          {text}
        </Button>
      );
    }
    if (node.type === "link") {
      return (
        <a key={i} href={node.url} className="text-[#3D9BE9] hover:underline">
          {node.children?.map(renderNode)}
        </a>
      );
    }
    if (node.type === "paragraph") {
      return (
        <p
          key={i}
          className="my-4 text-sm md:text-base lg:text-lg leading-relaxed"
        >
          {node.children?.map(renderNode)}
        </p>
      );
    }
    if (node.type === "heading") {
      const headingClasses: Record<string, string> = {
        h1: "text-5xl md:text-7xl lg:text-[86px] font-extrabold my-6 leading-tight uppercase tracking-normal",
        h2: "text-2xl md:text-4xl lg:text-5xl font-bold my-5 leading-tight uppercase",
        h3: "text-xl md:text-2xl lg:text-4xl font-bold my-4 leading-snug uppercase",
        h4: "text-lg md:text-xl lg:text-2xl font-bold my-3 leading-snug uppercase",
      };
      const classes = headingClasses[node.tag] || "";
      const Tag = node.tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag key={i} className={classes}>
          {node.children?.map(renderNode)}
        </Tag>
      );
    }
    if (node.type === "quote") {
      return (
        <blockquote
          key={i}
          className="border-l-4 border-[#3D9BE9] pl-6 italic my-6 text-base md:text-lg text-gray-700"
        >
          {node.children?.map(renderNode)}
        </blockquote>
      );
    }
    if (node.type === "list") {
      const Tag = node.listType === "number" ? "ol" : "ul";
      return (
        <Tag
          key={i}
          className="my-4 ml-6 space-y-2 text-sm md:text-base lg:text-lg"
        >
          {node.children?.map(renderNode)}
        </Tag>
      );
    }
    if (node.type === "listitem") {
      return (
        <li key={i} className="leading-relaxed">
          {node.children?.map(renderNode)}
        </li>
      );
    }
    if (node.type === "text") {
      let text = node.text;

      if (node.format & 1)
        text = (
          <strong key={i} className="font-bold">
            {text}
          </strong>
        );
      if (node.format & 2)
        text = (
          <em key={i} className="italic">
            {text}
          </em>
        );
      if (node.format & 8)
        text = (
          <mark key={i} className="bg-[#F7B32B] px-1 font-bold">
            {text}
          </mark>
        );

      // Handle TextStateFeature color states - use brand colors with light/dark variants
      if (node.$?.color && node.$?.color !== "default") {
        const colorMap = {
          primary: { light: "#3D9BE9", dark: "#3D9BE9" },
          secondary: { light: "#FF6B35", dark: "#FF6B35" },
          accent: { light: "#F7B32B", dark: "#F7B32B" },
          success: { light: "#10B981", dark: "#10B981" },
          warning: { light: "#EF4444", dark: "#EF4444" },
        };
        const colorName = node.$?.color as keyof typeof colorMap;
        const color =
          colorMap[colorName]?.[textColor === "light" ? "light" : "dark"] ||
          colorMap[colorName]?.light;
        if (color) {
          text = (
            <span key={i} className="font-bold" style={{ color }}>
              {text}
            </span>
          );
        }
      }

      return text;
    }
    return null;
  };

  return <>{content.root.children.map(renderNode)}</>;
}
