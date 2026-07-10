"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Embeds an Action Network form/petition widget on the page.
 *
 * Action Network's Cloudflare blocks server-side API writes, so signups run
 * client-side through AN's official embed widget: the visitor's own browser
 * submits to Action Network, which handles storage, double opt-in, and
 * unsubscribe compliance. Styling is nudged toward the OCAB look via the
 * `.an-embed` overrides in globals.css.
 *
 * `formUrl` accepts either the full widget URL
 * (https://actionnetwork.org/widgets/v6/form/<slug>?format=js&source=widget),
 * a plain form URL (https://actionnetwork.org/forms/<slug>), or just the slug.
 */

function parseSlug(formUrl: string): string | null {
  const trimmed = formUrl.trim();
  if (!trimmed) return null;
  // Full URL with a path segment (…/form/<slug> or …/forms/<slug>)
  const match = trimmed.match(/\/forms?\/([^/?#]+)/);
  if (match) return match[1];
  // Otherwise treat the whole value as a slug if it looks like one
  if (!trimmed.includes("/") && !trimmed.includes(" ")) return trimmed;
  return null;
}

export function ActionNetworkForm({ formUrl }: { formUrl: string }) {
  const slug = parseSlug(formUrl);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = `https://actionnetwork.org/widgets/v6/form/${slug}?format=js&source=widget`;
    script.async = true;
    container.appendChild(script);

    // Poll until AN injects its <form>, then reveal.
    let attempts = 0;
    const interval = setInterval(() => {
      if (container.querySelector("form")) {
        setLoaded(true);
        clearInterval(interval);
      } else if (++attempts > 100) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [slug]);

  if (!slug) {
    return (
      <p className="mt-8 text-sm opacity-70">
        Signup form is not configured yet.
      </p>
    );
  }

  return (
    <div className="an-embed mt-8">
      {!loaded && (
        <p className="text-sm opacity-70" aria-live="polite">
          Loading signup form…
        </p>
      )}
      {/* AN's script targets this specific id. */}
      <div id={`can-form-area-${slug}`} ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
}
