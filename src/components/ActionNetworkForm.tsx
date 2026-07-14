"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Public Action Network form. The chosen form (id/slug) + per-field overrides
 * come from the CMS; the field definitions are fetched live from
 * /api/an-forms/[slug]/fields and rendered with our styling. Submitting posts
 * server-side to /api/an-forms/[slug]/submit (a real AN form submission — no
 * on-page widget, no logged-in-browser override).
 */

interface Override {
  hidden?: boolean;
  label?: string;
  fullWidth?: boolean;
}
export interface ANFormValue {
  id?: string;
  slug?: string;
  title?: string;
  overrides?: Record<string, Override>;
}
interface ANField {
  name: string;
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  options?: { value: string; label: string }[];
}

type Status = "idle" | "loading" | "submitting" | "success" | "error";

interface Props {
  anForm?: ANFormValue | null;
  submitLabel?: string;
  successMessage?: string;
  source?: string;
}

export function ActionNetworkForm({ anForm, submitLabel = "Sign Up", successMessage, source }: Props) {
  const slug = anForm?.slug;
  const overrides = useMemo(() => anForm?.overrides || {}, [anForm]);

  const [fields, setFields] = useState<ANField[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setStatus("idle");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    fetch(`/api/an-forms/${encodeURIComponent(slug)}/fields`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setFields(d.fields || []);
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("idle");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Apply CMS overrides: hide, relabel, full-width.
  const visibleFields = fields
    .filter((f) => !overrides[f.key]?.hidden)
    .map((f) => ({
      ...f,
      label: overrides[f.key]?.label?.trim() || f.label,
      fullWidth: overrides[f.key]?.fullWidth || f.type === "textarea" || f.type === "select",
    }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setError(null);
    setStatus("submitting");
    try {
      const res = await fetch(`/api/an-forms/${encodeURIComponent(slug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: anForm?.id, values, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (!slug) {
    return <p className="mt-8 text-sm opacity-70">No Action Network form selected.</p>;
  }

  if (status === "success") {
    return (
      <div className="mt-8 border border-current/20 p-6 text-center" role="status">
        <p className="text-2xl font-bold">{successMessage || "You're in! Watch your inbox for ways to take action."}</p>
      </div>
    );
  }

  const inputClass =
    "w-full p-3 bg-white text-neutral border border-black/10 placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-accent transition";

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl" noValidate>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-start">
        {visibleFields.map((f) => {
          const common = {
            required: f.required,
            "aria-label": f.label,
            value: values[f.key] || "",
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
              setValues((prev) => ({ ...prev, [f.key]: e.target.value })),
            className: `${inputClass} ${f.fullWidth ? "sm:basis-full" : "sm:flex-1 sm:min-w-[160px]"}`,
          };
          if (f.type === "textarea") {
            return <textarea key={f.key} placeholder={f.label} rows={4} {...common} />;
          }
          if (f.type === "select") {
            return (
              <select key={f.key} {...common} aria-label={f.label}>
                <option value="">{f.label || "Select…"}</option>
                {(f.options || []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            );
          }
          return <input key={f.key} type={f.type} placeholder={f.label} {...common} />;
        })}
        <button
          type="submit"
          disabled={status === "submitting" || status === "loading"}
          className="bg-accent text-accent-content font-bold uppercase tracking-wide px-8 py-3 whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Signing up…" : submitLabel}
        </button>
      </div>
      {status === "error" && error && <p className="mt-3 text-sm font-semibold">{error}</p>}
    </form>
  );
}
