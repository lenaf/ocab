"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Action Network signup — custom OCAB-styled UI over a hidden AN widget.
 *
 * AN's Cloudflare blocks server-side API writes, and AN's visible embed widget
 * can't be styled to match the site. So we load the AN form widget hidden
 * off-screen, render our own on-brand form, and on submit copy the values into
 * the hidden AN form and trigger its native submit. The visitor's browser does
 * the POST to Action Network (which handles storage, opt-in, and compliance).
 *
 * `formUrl` accepts the full widget URL, a plain form URL, or just the slug.
 */

function parseSlug(formUrl: string): string | null {
  const trimmed = (formUrl || "").trim();
  if (!trimmed) return null;
  const match = trimmed.match(/\/forms?\/([^/?#]+)/);
  if (match) return match[1];
  if (!trimmed.includes("/") && !trimmed.includes(" ")) return trimmed;
  return null;
}

/** Set a value on an AN input so its framework notices the change. */
function setNativeValue(el: HTMLInputElement | HTMLSelectElement, value: string) {
  const proto = el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else (el as HTMLInputElement).value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new Event("blur", { bubbles: true }));
}

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  formUrl: string;
  successMessage?: string;
  buttonLabel?: string;
}

export function ActionNetworkForm({
  formUrl,
  successMessage = "You're in! Watch your inbox for ways to take action.",
  buttonLabel = "Sign Up",
}: Props) {
  const slug = parseSlug(formUrl);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const anFormRef = useRef<HTMLFormElement | null>(null);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Load the AN widget hidden off-screen so it's ready when the user submits.
  useEffect(() => {
    if (!slug) return;
    const container = hiddenRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = `https://actionnetwork.org/widgets/v6/form/${slug}?format=js&source=widget`;
    script.async = true;
    container.appendChild(script);

    let attempts = 0;
    const interval = setInterval(() => {
      const form = container.querySelector("form");
      if (form) {
        anFormRef.current = form as HTMLFormElement;
        clearInterval(interval);
      } else if (++attempts > 100) {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const anForm = anFormRef.current;
    if (!anForm) {
      setError("The signup form is still loading — please try again in a moment.");
      setStatus("error");
      return;
    }

    const emailEl = anForm.querySelector<HTMLInputElement>("#form-email, input[name='answer[email]']");
    const firstEl = anForm.querySelector<HTMLInputElement>("#form-first_name, input[name='answer[first_name]']");
    if (!emailEl) {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    setNativeValue(emailEl, email);
    if (firstEl && firstName) setNativeValue(firstEl, firstName);

    // Opt in to the email group if the form offers it.
    anForm
      .querySelectorAll<HTMLInputElement>("input[type='checkbox'][name^='subscription']")
      .forEach((cb) => {
        if (!cb.checked) cb.click();
      });

    // Watch for AN's success/error response, which replaces the form contents.
    const container = hiddenRef.current;
    let settled = false;
    if (container) {
      const observer = new MutationObserver(() => {
        const text = container.textContent || "";
        if (/thank|you're in|success|added you|confirm/i.test(text)) {
          settled = true;
          observer.disconnect();
          setStatus("success");
        } else if (/error|problem|try again|invalid/i.test(text)) {
          settled = true;
          observer.disconnect();
          setError("Something went wrong signing you up. Please try again.");
          setStatus("error");
        }
      });
      observer.observe(container, { childList: true, subtree: true, characterData: true });
      // Optimistic fallback: AN's cross-origin POST succeeds even when we can't read the response.
      setTimeout(() => {
        if (!settled) {
          observer.disconnect();
          setStatus("success");
        }
      }, 4000);
    }

    await new Promise((r) => setTimeout(r, 250));
    const submitBtn = anForm.querySelector<HTMLElement>("input[type='submit'], button[type='submit']");
    if (submitBtn) submitBtn.click();
    else anForm.requestSubmit?.();
  }

  if (!slug) {
    return <p className="mt-8 text-sm opacity-70">Signup form is not configured yet.</p>;
  }

  const inputClass =
    "w-full p-3 bg-white text-neutral border border-black/10 placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-accent transition";

  return (
    <>
      {/* Hidden AN widget — loaded on mount, used only for submission. */}
      <div
        ref={hiddenRef}
        id={`can-form-area-${slug}`}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          opacity: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {status === "success" ? (
        <div className="mt-8 border border-current/20 p-6 text-center" role="status">
          <p className="text-2xl font-bold">{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`${inputClass} sm:max-w-[34%]`}
              autoComplete="given-name"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-accent text-accent-content font-bold uppercase tracking-wide px-8 py-3 whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Signing up…" : buttonLabel}
            </button>
          </div>
          {status === "error" && error && (
            <p className="mt-3 text-sm font-semibold">{error}</p>
          )}
        </form>
      )}
    </>
  );
}
