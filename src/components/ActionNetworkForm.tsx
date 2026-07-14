"use client";

import { useState } from "react";

/**
 * Signup / Take Action form — submits server-side to Action Network via
 * `/api/subscribe`, which posts to AN's people API with the server-side key.
 * The person is created with exactly what the visitor typed (no browser-session
 * override), and there is no third-party widget on the page.
 *
 * Fields are configurable in the CMS; each maps to an Action Network field.
 */

export interface FormFieldConfig {
  label: string;
  mapsTo: string; // email | first_name | last_name | zip_code | phone | country | custom
  customField?: string | null;
  inputType?: string | null; // text | email | tel
  required?: boolean | null;
  fullWidth?: boolean | null;
}

const DEFAULT_FIELDS: FormFieldConfig[] = [
  { label: "First name (optional)", mapsTo: "first_name", inputType: "text", required: false },
  { label: "Email address", mapsTo: "email", inputType: "email", required: true },
];

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  fields?: FormFieldConfig[] | null;
  successMessage?: string;
  buttonLabel?: string;
  /** Recorded as a "Source: …" tag in Action Network. */
  source?: string;
}

export function ActionNetworkForm({
  fields,
  successMessage = "You're in! Watch your inbox for ways to take action.",
  buttonLabel = "Sign Up",
  source,
}: Props) {
  const activeFields = fields && fields.length > 0 ? fields : DEFAULT_FIELDS;

  const [values, setValues] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    // Map configured fields → the normalized payload the API route expects.
    const payload: Record<string, unknown> = { source };
    const customFields: Record<string, string> = {};
    activeFields.forEach((field, i) => {
      const value = (values[i] || "").trim();
      if (!value) return;
      switch (field.mapsTo) {
        case "email": payload.email = value; break;
        case "first_name": payload.givenName = value; break;
        case "last_name": payload.familyName = value; break;
        case "zip_code": payload.postalCode = value; break;
        case "country": payload.country = value; break;
        case "phone": payload.phone = value; break;
        case "custom":
          if (field.customField) customFields[field.customField] = value;
          break;
      }
    });
    if (Object.keys(customFields).length > 0) payload.customFields = customFields;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  if (status === "success") {
    return (
      <div className="mt-8 border border-current/20 p-6 text-center" role="status">
        <p className="text-2xl font-bold">{successMessage}</p>
      </div>
    );
  }

  const inputClass =
    "w-full p-3 bg-white text-neutral border border-black/10 placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-accent transition";

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl" noValidate>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-start">
        {activeFields.map((field, i) => (
          <input
            key={i}
            type={field.inputType || "text"}
            required={!!field.required}
            placeholder={field.label}
            aria-label={field.label}
            value={values[i] || ""}
            onChange={(e) => setValues((v) => ({ ...v, [i]: e.target.value }))}
            className={`${inputClass} ${field.fullWidth ? "sm:basis-full" : "sm:flex-1 sm:min-w-[160px]"}`}
          />
        ))}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-accent text-accent-content font-bold uppercase tracking-wide px-8 py-3 whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Signing up…" : buttonLabel}
        </button>
      </div>
      {status === "error" && error && <p className="mt-3 text-sm font-semibold">{error}</p>}
    </form>
  );
}
