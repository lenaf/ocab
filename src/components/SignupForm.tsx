"use client";

import { useState } from "react";

type Mode = "newsletter" | "contact";

interface SignupFormProps {
  mode?: Mode;
  /** Shown after a successful submit. */
  successMessage?: string;
  /** Label for the submit button. */
  buttonLabel?: string;
  /** Tag recorded in Action Network so signups can be traced to their source. */
  source?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function SignupForm({
  mode = "newsletter",
  successMessage = "Thanks! We'll be in touch.",
  buttonLabel,
  source,
}: SignupFormProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const isContact = mode === "contact";
  const label = buttonLabel || (isContact ? "Send" : "Sign Up");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          message: isContact ? message : undefined,
          source: source || mode,
        }),
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
        <p className="text-xl font-bold">{successMessage}</p>
      </div>
    );
  }

  const inputClass =
    "w-full p-3 border border-current/20 bg-transparent focus:outline-none focus:border-current transition-colors";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
      {isContact ? (
        <>
          <input
            type="text"
            placeholder="Your name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
            autoComplete="name"
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
          <textarea
            placeholder="Message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-primary text-primary-content font-bold uppercase tracking-wide px-6 py-3 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending…" : label}
          </button>
        </>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`${inputClass} sm:max-w-[38%]`}
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
            className="bg-primary text-primary-content font-bold uppercase tracking-wide px-6 py-3 whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Signing up…" : label}
          </button>
        </div>
      )}

      {status === "error" && error && (
        <p className="text-sm font-semibold" style={{ color: "var(--color-error, #C5341B)" }}>
          {error}
        </p>
      )}
    </form>
  );
}
