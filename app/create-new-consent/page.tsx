"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";
import { useRole } from "@/lib/useRole";

const CATEGORIES = ["Bio", "Carrier", "CMA", "Cyto", "Mito", "NGS", "NIPT", "Other", "PGx", "WES", "WGS"];
const SYSTEMS = ["Portal", "Paper", "Epic"];
const EXPECTED_RESPONSE_OPTS = ["Yes", "No"];
const ACCEPTABLE_RESPONSE_OPTS = ["Opt-in", "Opt-out"];
const DEFAULT_RESPONSE_OPTS = ["Opt-in", "Opt-out", "N/A", "Null"];
const STATUS_OPTS = ["Active", "Retired"];

const CHAR_LIMITS = { title: 50, consentLanguage: 2500, testCode: 15, testName: 100 };

interface FormState {
  title: string;
  consentLanguage: string;
  testCode: string;
  testName: string;
  testCategory: string;
  system: string;
  expectedResponse: string;
  acceptableResponses: string;
  defaultResponse: string;
  effectiveDate: string;
  retirementDate: string;
  status: string;
}

const EMPTY: FormState = {
  title: "", consentLanguage: "", testCode: "", testName: "",
  testCategory: "", system: "", expectedResponse: "", acceptableResponses: "",
  defaultResponse: "", effectiveDate: "", retirementDate: "", status: "",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "16px",
  color: "var(--text-text-primary)",
};

const inputBase: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
  width: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start w-full">
      <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h3)", lineHeight: "var(--font-line-height-line-height-h3)" }}>
        {title}
      </p>
      <div className="w-full border-b border-border-subtle" />
    </div>
  );
}

function TextField({ id, label, value, onChange, error, maxLen, width = 304, required }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; maxLen?: number; width?: number | string; required?: boolean;
}) {
  return (
    <div id={`field-${id}`} className="flex flex-col items-start shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}{required && "*"}</p>
      <div className="flex items-center w-full border rounded-[4px]" style={{ height: 36, padding: 12, borderColor: error ? "var(--bg-ssot-form-error)" : "var(--borders-border-subtle)" }}>
        <input style={inputBase} value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLen} />
        {maxLen && value.length > 0 && (
          <span style={{ fontSize: 12, color: value.length >= maxLen ? "var(--bg-ssot-form-error)" : "var(--text-text-secondary)", whiteSpace: "nowrap", marginLeft: 8 }}>
            {value.length}/{maxLen}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: 13, color: "var(--bg-ssot-form-error)" }}>{error}</span>}
    </div>
  );
}

function TextAreaField({ id, label, value, onChange, error, maxLen, required }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; maxLen?: number; required?: boolean;
}) {
  return (
    <div id={`field-${id}`} className="flex flex-col items-start w-full" style={{ gap: 4 }}>
      <p style={labelStyle}>{label}{required && "*"}</p>
      <div className="flex flex-col w-full border rounded-[4px]" style={{ padding: 12, borderColor: error ? "var(--bg-ssot-form-error)" : "var(--borders-border-subtle)" }}>
        <textarea
          className="w-full resize-none outline-none bg-transparent"
          style={{ ...inputBase, height: 120 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLen}
        />
        {maxLen && value.length > 0 && (
          <span style={{ fontSize: 12, color: value.length >= maxLen ? "var(--bg-ssot-form-error)" : "var(--text-text-secondary)", textAlign: "right" }}>
            {value.length}/{maxLen}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: 13, color: "var(--bg-ssot-form-error)" }}>{error}</span>}
    </div>
  );
}

function SelectField({ id, label, value, onChange, options, error, width = 304, required }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  options: string[]; error?: string; width?: number | string; required?: boolean;
}) {
  return (
    <div id={`field-${id}`} className="flex flex-col items-start shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}{required && "*"}</p>
      <div className="relative w-full">
        <select
          className="w-full border rounded-[4px] appearance-none"
          style={{ height: 36, paddingLeft: 12, paddingRight: 32, paddingTop: 6, paddingBottom: 6, ...inputBase, borderColor: error ? "var(--bg-ssot-form-error)" : "var(--borders-border-subtle)" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary" />
      </div>
      {error && <span style={{ fontSize: 13, color: "var(--bg-ssot-form-error)" }}>{error}</span>}
    </div>
  );
}

function DateField({ id, label, value, onChange, error, required }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; required?: boolean;
}) {
  return (
    <div id={`field-${id}`} className="flex flex-col items-start shrink-0" style={{ width: 200, gap: 4 }}>
      <p style={labelStyle}>{label}{required && "*"}</p>
      <div className="flex items-center w-full border rounded-[4px]" style={{ height: 36, paddingLeft: 12, paddingRight: 12, borderColor: error ? "var(--bg-ssot-form-error)" : "var(--borders-border-subtle)" }}>
        <input type="date" style={{ ...inputBase, colorScheme: "light" }} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      {error && <span style={{ fontSize: 13, color: "var(--bg-ssot-form-error)" }}>{error}</span>}
    </div>
  );
}

export default function CreateNewConsent() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();
  const role = useRole();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) e.title = "Required.";
    if (!form.consentLanguage.trim()) e.consentLanguage = "Required.";
    if (!form.testCode.trim()) e.testCode = "Required.";
    if (!form.testName.trim()) e.testName = "Required.";
    if (!form.testCategory) e.testCategory = "Required.";
    if (!form.system) e.system = "Required.";
    if (!form.expectedResponse) e.expectedResponse = "Required.";
    if (!form.acceptableResponses) e.acceptableResponses = "Required.";
    if (!form.defaultResponse) e.defaultResponse = "Required.";
    if (!form.effectiveDate) e.effectiveDate = "Required.";
    if (!form.status) e.status = "Required.";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      const dest = "/consents-admin-status-queue";
      router.push(`${dest}?toast=created`);
    } else {
      const firstKey = Object.keys(e)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>

          {/* Breadcrumb + title */}
          <div className="flex flex-col w-full" style={{ gap: 24 }}>
            <Link href="/consents" className="flex items-center" style={{ gap: 4 }}>
              <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
              <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--button-ghost-btn-ghost-text)" }}>Back to Consents</span>
            </Link>
            <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h2)", lineHeight: "var(--font-line-height-line-height-h2)", letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)" }}>
              Create New Consent
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col w-full" style={{ gap: 60 }}>

            {/* Consent Content */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Consent Content" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <TextField id="title" label="Title" value={form.title} onChange={(v) => set("title", v)} error={errors.title} maxLen={CHAR_LIMITS.title} width={400} required />
                <SelectField id="system" label="System" value={form.system} onChange={(v) => set("system", v)} options={SYSTEMS} error={errors.system} width={200} required />
              </div>
              <TextAreaField id="consentLanguage" label="Consent Language" value={form.consentLanguage} onChange={(v) => set("consentLanguage", v)} error={errors.consentLanguage} maxLen={CHAR_LIMITS.consentLanguage} required />
            </div>

            {/* Associated Test */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Associated Test" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <TextField id="testCode" label="Test Code" value={form.testCode} onChange={(v) => set("testCode", v)} error={errors.testCode} maxLen={CHAR_LIMITS.testCode} width={180} required />
                <TextField id="testName" label="Test Name" value={form.testName} onChange={(v) => set("testName", v)} error={errors.testName} maxLen={CHAR_LIMITS.testName} width={400} required />
                <SelectField id="testCategory" label="Test Category" value={form.testCategory} onChange={(v) => set("testCategory", v)} options={CATEGORIES} error={errors.testCategory} width={200} required />
              </div>
            </div>

            {/* Response Configuration */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Response Configuration" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <SelectField id="expectedResponse" label="Expected Response" value={form.expectedResponse} onChange={(v) => set("expectedResponse", v)} options={EXPECTED_RESPONSE_OPTS} error={errors.expectedResponse} width={220} required />
                <SelectField id="acceptableResponses" label="Acceptable Responses" value={form.acceptableResponses} onChange={(v) => set("acceptableResponses", v)} options={ACCEPTABLE_RESPONSE_OPTS} error={errors.acceptableResponses} width={220} required />
                <SelectField id="defaultResponse" label="Default Response" value={form.defaultResponse} onChange={(v) => set("defaultResponse", v)} options={DEFAULT_RESPONSE_OPTS} error={errors.defaultResponse} width={220} required />
              </div>
            </div>

            {/* Dates & Status */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Dates & Status" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <DateField id="effectiveDate" label="Effective Date" value={form.effectiveDate} onChange={(v) => set("effectiveDate", v)} error={errors.effectiveDate} required />
                <DateField id="retirementDate" label="Retirement Date" value={form.retirementDate} onChange={(v) => set("retirementDate", v)} />
                <SelectField id="status" label="Status" value={form.status} onChange={(v) => set("status", v)} options={STATUS_OPTS} error={errors.status} width={200} required />
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end w-full" style={{ gap: 16 }}>
              <Link href="/consents" className="flex items-center justify-center border border-border-primary rounded-[4px]" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))" }}>Cancel</span>
              </Link>
              <button onClick={handleSubmit} className="flex items-center justify-center bg-btn-primary-bg rounded-[4px]" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}>
                <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px" }}>Submit for Review</span>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
