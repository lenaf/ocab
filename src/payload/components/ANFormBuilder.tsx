"use client";

import { useField } from "@payloadcms/ui";
import { useCallback, useEffect, useState } from "react";

/**
 * CMS control for an Action Network-backed form. Picks one of the org's AN
 * forms (live from /api/an-forms), then lists that form's fields (live from
 * /api/an-forms/[slug]/fields) so the editor can hide, relabel, or full-width
 * each one. Everything is stored in a single JSON value:
 *   { id, slug, title, overrides: { [fieldKey]: { hidden?, label?, fullWidth? } } }
 */

interface FormSummary {
  id: string;
  slug: string;
  title: string;
}
interface ANField {
  name: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
}
interface Override {
  hidden?: boolean;
  label?: string;
  fullWidth?: boolean;
}
interface Value {
  id?: string;
  slug?: string;
  title?: string;
  overrides?: Record<string, Override>;
}

export const ANFormBuilder = () => {
  const { value, setValue } = useField<Value>();
  const v = value || {};

  const [forms, setForms] = useState<FormSummary[]>([]);
  const [formsError, setFormsError] = useState<string | null>(null);
  const [fields, setFields] = useState<ANField[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [fieldsError, setFieldsError] = useState<string | null>(null);

  // Load the list of AN forms once.
  useEffect(() => {
    fetch("/api/an-forms")
      .then((r) => r.json())
      .then((d) => {
        if (d.forms) setForms(d.forms);
        if (d.error) setFormsError(d.error);
      })
      .catch(() => setFormsError("Could not load Action Network forms."));
  }, []);

  // Load fields whenever the selected form changes.
  useEffect(() => {
    if (!v.slug) {
      setFields([]);
      return;
    }
    setLoadingFields(true);
    setFieldsError(null);
    fetch(`/api/an-forms/${encodeURIComponent(v.slug)}/fields`)
      .then((r) => r.json())
      .then((d) => {
        setFields(d.fields || []);
        if (d.error) setFieldsError(d.error);
      })
      .catch(() => setFieldsError("Could not load form fields."))
      .finally(() => setLoadingFields(false));
  }, [v.slug]);

  const onPick = (slug: string) => {
    const form = forms.find((f) => f.slug === slug);
    if (!form) {
      setValue(undefined);
      return;
    }
    setValue({ id: form.id, slug: form.slug, title: form.title, overrides: {} });
  };

  const setOverride = useCallback(
    (key: string, patch: Override) => {
      const overrides = { ...(v.overrides || {}) };
      overrides[key] = { ...(overrides[key] || {}), ...patch };
      setValue({ ...v, overrides });
    },
    [v, setValue],
  );

  const labelStyle = { display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#333" };
  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: 10,
    alignItems: "center",
    padding: "8px 10px",
    border: "1px solid #e5e5e5",
    borderRadius: 4,
    marginBottom: 6,
    background: "#fafafa",
  } as const;

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>Action Network Form</label>
      <select
        value={v.slug || ""}
        onChange={(e) => onPick(e.target.value)}
        style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 4, fontSize: 14 }}
      >
        <option value="">— Select a form —</option>
        {forms.map((f) => (
          <option key={f.id} value={f.slug}>
            {f.title} ({f.slug})
          </option>
        ))}
      </select>
      {formsError && <p style={{ color: "#c5341b", fontSize: 12, marginTop: 6 }}>{formsError}</p>}

      {v.slug && (
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>Fields (from Action Network)</label>
          {loadingFields && <p style={{ fontSize: 12, color: "#666" }}>Loading fields…</p>}
          {fieldsError && <p style={{ color: "#c5341b", fontSize: 12 }}>{fieldsError}</p>}
          {!loadingFields && fields.length === 0 && !fieldsError && (
            <p style={{ fontSize: 12, color: "#666" }}>No editable fields found on this form.</p>
          )}
          {fields.map((f) => {
            const ov = v.overrides?.[f.key] || {};
            const visible = !ov.hidden;
            return (
              <div key={f.key} style={rowStyle}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#333" }}>
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setOverride(f.key, { hidden: !e.target.checked })}
                  />
                  Show
                </label>
                <input
                  type="text"
                  value={ov.label ?? ""}
                  placeholder={f.label + (f.required ? " (required)" : "")}
                  onChange={(e) => setOverride(f.key, { label: e.target.value })}
                  disabled={!visible}
                  style={{
                    width: "100%",
                    padding: 6,
                    border: "1px solid #ddd",
                    borderRadius: 3,
                    fontSize: 13,
                    opacity: visible ? 1 : 0.5,
                  }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#333" }}>
                  <input
                    type="checkbox"
                    checked={!!ov.fullWidth}
                    onChange={(e) => setOverride(f.key, { fullWidth: e.target.checked })}
                    disabled={!visible}
                  />
                  Full width
                </label>
              </div>
            );
          })}
          <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
            Leave a label blank to use Action Network&apos;s default. Uncheck &ldquo;Show&rdquo; to hide a field.
          </p>
        </div>
      )}
    </div>
  );
};
