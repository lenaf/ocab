/**
 * Action Network server-side helpers.
 *
 * AN is the single source of truth for forms. We can (a) list the org's forms
 * via the OSDI API, (b) discover a form's fields by fetching its widget in
 * clean-HTML format and parsing the markup (the API does NOT expose fields),
 * and (c) record a real submission against a form server-side. The API key
 * never leaves the server.
 *
 * Gotcha: AN's endpoints return a 500 for reserved test domains like
 * example.com — always test with a real email.
 */

const AN_API = "https://actionnetwork.org/api/v2";
const WIDGET = (slug: string) =>
  `https://actionnetwork.org/widgets/v6/form/${encodeURIComponent(slug)}?format=html`;

function apiKey(): string {
  const key = process.env.ACTION_NETWORK_API_KEY;
  if (!key || key === "your_action_network_api_key_here") {
    throw new Error("ACTION_NETWORK_API_KEY is not configured");
  }
  return key;
}

function anHeaders() {
  return {
    "OSDI-API-Token": apiKey(),
    "Content-Type": "application/json",
    // AN's Cloudflare 403s API requests without a browser-like User-Agent.
    "User-Agent": "Mozilla/5.0 (OCAB site)",
  };
}

// Fields AN includes for its own machinery — never shown to visitors.
const SYSTEM_FIELD = /^(utf8|authenticity_token|version|redirect|commit|ch_|subscription\[)/;

export interface ANFormSummary {
  id: string;
  slug: string;
  title: string;
}

export interface ANFieldOption {
  value: string;
  label: string;
}

export interface ANField {
  /** Raw input name, e.g. "answer[email]". */
  name: string;
  /** Inner key, e.g. "email", "first_name", "message_to_target". */
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  options?: ANFieldOption[];
}

function slugFromUrl(url: string | undefined): string {
  if (!url) return "";
  const m = url.match(/\/forms?\/([^/?#]+)/);
  return m ? m[1] : "";
}

/** List the org's Action Network forms. */
export async function listForms(): Promise<ANFormSummary[]> {
  // Cache 5 min — AN rate-limits the API, and the form list rarely changes.
  const res = await fetch(`${AN_API}/forms?per_page=100`, { headers: anHeaders(), next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Action Network forms list failed: ${res.status}`);
  const json = await res.json();
  const forms = (json?._embedded?.["osdi:forms"] ?? []) as Record<string, unknown>[];
  return forms
    .map((f) => {
      const id =
        ((f.identifiers as string[]) || [])
          .find((i) => i.startsWith("action_network:"))
          ?.replace("action_network:", "") ?? "";
      return {
        id,
        slug: slugFromUrl(f.browser_url as string),
        title: (f.title as string) || (f.name as string) || "Untitled form",
      };
    })
    .filter((f) => f.id && f.slug);
}

/** Resolve a form slug to its Action Network id. */
export async function resolveFormId(slug: string): Promise<string | null> {
  const forms = await listForms();
  return forms.find((f) => f.slug === slug)?.id ?? null;
}

const decodeEntities = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag: string, name: string): string =>
  (tag.match(new RegExp(`${name}="([^"]*)"`, "i")) || [])[1] || "";

/** Fetch a form's widget as clean HTML and parse its visible fields. */
export async function getFormFields(slug: string): Promise<ANField[]> {
  const res = await fetch(WIDGET(slug), {
    headers: { "User-Agent": "Mozilla/5.0 (OCAB site)" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Action Network widget fetch failed: ${res.status}`);
  const html = await res.text();

  const fields: ANField[] = [];
  const re = /<(input|select|textarea)\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const name = attr(tag, "name");
    if (!name || SYSTEM_FIELD.test(name)) continue;

    const key = (name.match(/answer\[([^\]]+)\]/) || [])[1] || name;
    const rawType = m[1].toLowerCase() === "input" ? attr(tag, "type") || "text" : m[1].toLowerCase();
    const type = (["email", "tel", "textarea", "select"].includes(rawType) ? rawType : "text") as ANField["type"];
    const placeholder = decodeEntities(attr(tag, "placeholder"));
    const required = /\brequired\b/i.test(tag) || /\*/.test(placeholder);
    const label = placeholder.replace(/\s*\*\s*$/, "").trim() || humanize(key);

    const field: ANField = { name, key, label, type, required };

    if (type === "select") {
      // Pull the matching <select>…</select> block for its options.
      const block = html.slice(m.index).match(/<select[\s\S]*?<\/select>/i)?.[0] || "";
      const opts: ANFieldOption[] = [];
      const optRe = /<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi;
      let o: RegExpExecArray | null;
      while ((o = optRe.exec(block))) opts.push({ value: o[1], label: decodeEntities(o[2]) });
      if (opts.length) field.options = opts;
    }

    fields.push(field);
  }
  return fields;
}

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** A value keyed by the AN field's inner key (email, first_name, message_to_target, …). */
export type SubmissionValues = Record<string, string>;

const STANDARD_KEYS = new Set(["email", "first_name", "last_name", "zip_code", "country", "phone", "phone_number"]);

/** Build the OSDI person object from submitted values. */
function buildPerson(values: SubmissionValues): Record<string, unknown> {
  const person: Record<string, unknown> = {};
  const postal: Record<string, string> = {};
  const custom: Record<string, string> = {};

  for (const [key, raw] of Object.entries(values)) {
    const value = (raw ?? "").trim();
    if (!value) continue;
    switch (key) {
      case "email": person.email_addresses = [{ address: value }]; break;
      case "first_name": person.given_name = value; break;
      case "last_name": person.family_name = value; break;
      case "zip_code": postal.postal_code = value; break;
      case "country": postal.country = value; break;
      case "phone":
      case "phone_number": person.phone_numbers = [{ number: value }]; break;
      default: custom[key] = value; break;
    }
  }
  if (Object.keys(postal).length) person.postal_addresses = [postal];
  if (Object.keys(custom).length) person.custom_fields = custom;
  return person;
}

/** Record a submission against a form (by AN id). Returns true on success. */
export async function submitForm(
  formId: string,
  values: SubmissionValues,
  tags: string[] = [],
): Promise<{ ok: boolean; status: number }> {
  const person = buildPerson(values);
  const body: Record<string, unknown> = { person };
  if (tags.length) body.add_tags = tags;

  const res = await fetch(`${AN_API}/forms/${encodeURIComponent(formId)}/submissions`, {
    method: "POST",
    headers: anHeaders(),
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}

export { STANDARD_KEYS };
