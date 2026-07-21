"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CaretDown, CalendarBlank, FileArrowUp } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";
import { useRole } from "@/lib/useRole";

// PRD-defined option lists
const TEST_CATEGORIES = ["Bio", "Carrier", "CMA", "Cyto", "Mito", "NGS", "NIPT", "Other", "PGx", "WES", "WGS"];
const STATUS_OPTIONS = ["Active", "Retired"];
const INTERNAL_EXTERNAL_OPTIONS = ["Internal", "External"];
const SPECIMEN_TYPE_OPTIONS = ["Blood", "Saliva", "Buccal Swab", "Tissue", "Amniotic Fluid", "Cord Blood"];
const KIT_OPTIONS = ["Kit A", "Kit B", "Kit C"];

// PRD character limits
const CHAR_LIMITS = { testCode: 15, testName: 100 };

interface FormState {
  testCode: string;
  testName: string;
  abbreviation: string;
  testCategory: string;
  tat: string;
  internalExternal: string;
  status: string;
  description: string;
  billable: boolean;
  insurance: string;
  selfPay: string;
  institutional: string;
  cptCodes: string;
  dexCpt: string;
  zCodes: string;
  concertGtu: string;
  specimenTypes: string;
  kits: string;
  availabilityDate: string;
  retirementDate: string;
  nyApproval: boolean;
}

const EMPTY_FORM: FormState = {
  testCode: "", testName: "", abbreviation: "", testCategory: "",
  tat: "", internalExternal: "", status: "", description: "",
  billable: false, insurance: "", selfPay: "", institutional: "",
  cptCodes: "", dexCpt: "", zCodes: "", concertGtu: "",
  specimenTypes: "", kits: "", availabilityDate: "", retirementDate: "",
  nyApproval: false,
};

// Styles
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "16px",
  color: "var(--text-text-primary)",
  whiteSpace: "nowrap",
};

const inputBaseStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
  background: "transparent",
  outline: "none",
  width: "100%",
  border: "none",
};

const errorTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "16px",
  color: "var(--bg-ssot-form-error)",
  marginTop: 4,
};

const hintTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "16px",
  color: "var(--text-text-muted, var(--text-text-muted))",
  marginTop: 4,
};

function fieldBorderStyle(error?: string): React.CSSProperties {
  return {
    height: 36,
    padding: 12,
    border: error ? "1px solid var(--bg-ssot-form-error)" : "1px solid var(--borders-border-subtle, var(--borders-border-subtle))",
    borderRadius: 4,
    background: "var(--bg-page, white)",
    display: "flex",
    alignItems: "center",
  };
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start w-full">
      <p
        className="w-full text-text-primary"
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 300,
          fontSize: "var(--font-size-font-size-h3)",
          lineHeight: "var(--font-line-height-line-height-h3)",
        }}
      >
        {title}
      </p>
      <div className="w-full shrink-0 border-b border-border-subtle" />
    </div>
  );
}

function TextField({
  label, value, onChange, placeholder, width = 304,
  maxLength, required, error, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; width?: number | string; maxLength?: number;
  required?: boolean; error?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}{required && <span style={{ color: "var(--bg-ssot-form-error)" }}> *</span>}</p>
      <div style={fieldBorderStyle(error)}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1 min-w-0"
          style={inputBaseStyle}
        />
      </div>
      {error && <p style={errorTextStyle}>{error}</p>}
      {!error && maxLength && value.length > 0 && (
        <p style={{ ...hintTextStyle, color: value.length >= maxLength ? "var(--bg-ssot-form-error)" : "var(--text-text-muted, var(--text-text-muted))" }}>
          {value.length}/{maxLength}
        </p>
      )}
      {!error && hint && !maxLength && <p style={hintTextStyle}>{hint}</p>}
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder, width = 304,
  required, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; width?: number | string;
  required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}{required && <span style={{ color: "var(--bg-ssot-form-error)" }}> *</span>}</p>
      <div style={{ ...fieldBorderStyle(error), position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...inputBaseStyle,
            appearance: "none",
            WebkitAppearance: "none",
            color: value ? "var(--text-text-primary)" : "var(--text-text-muted, var(--text-text-muted))",
            paddingRight: 20,
          }}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <CaretDown size={14} className="shrink-0 text-text-primary" style={{ pointerEvents: "none", position: "absolute", right: 12 }} />
      </div>
      {error && <p style={errorTextStyle}>{error}</p>}
    </div>
  );
}

function DateField({
  label, value, onChange, required, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ width: 304, gap: 4 }}>
      <p style={labelStyle}>{label}{required && <span style={{ color: "var(--bg-ssot-form-error)" }}> *</span>}</p>
      <div style={{ ...fieldBorderStyle(error), position: "relative" }}>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...inputBaseStyle,
            color: value ? "var(--text-text-primary)" : "var(--text-text-muted, var(--text-text-muted))",
            paddingRight: 20,
          }}
        />
        <CalendarBlank size={14} className="shrink-0 text-text-primary" style={{ pointerEvents: "none", position: "absolute", right: 12 }} />
      </div>
      {error && <p style={errorTextStyle}>{error}</p>}
    </div>
  );
}

function CurrencyField({
  label, value, onChange, required, error, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; error?: string; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ width: 304, gap: 4, opacity: disabled ? 0.45 : 1 }}>
      <p style={labelStyle}>{label}{required && <span style={{ color: "var(--bg-ssot-form-error)" }}> *</span>}</p>
      <div style={fieldBorderStyle(error)}>
        <span style={{ ...inputBaseStyle, width: "auto", marginRight: 4, color: "var(--text-text-muted, var(--text-text-muted))" }}>$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          disabled={disabled}
          className="flex-1 min-w-0"
          style={inputBaseStyle}
        />
      </div>
      {error && !disabled && <p style={errorTextStyle}>{error}</p>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-start" style={{ gap: 12, cursor: "pointer" }} onClick={onChange}>
      <div
        className="flex items-start shrink-0 rounded-[2px]"
        style={{
          width: 24, height: 24, padding: 2,
          backgroundColor: checked ? "var(--button-primary-btn-primary-bg, var(--text-text-primary))" : "transparent",
          border: checked ? "none" : "1px solid var(--borders-border-strong)",
        }}
      >
        {checked && (
          <svg viewBox="0 0 20 16" fill="none" className="w-full h-full">
            <path d="M1.5 8L7.5 14L18.5 2" stroke="var(--button-primary-btn-primary-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px" }}>
        {label}
      </span>
    </div>
  );
}

export default function CreateNewTestCode() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();
  const role = useRole();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.testCode.trim()) e.testCode = "Test Code is required.";
    else if (form.testCode.length > CHAR_LIMITS.testCode) e.testCode = `Must not exceed ${CHAR_LIMITS.testCode} characters.`;
    if (!form.testName.trim()) e.testName = "Test Name is required.";
    else if (form.testName.length > CHAR_LIMITS.testName) e.testName = `Must not exceed ${CHAR_LIMITS.testName} characters.`;
    if (!form.testCategory) e.testCategory = "Test Category is required.";
    if (!form.status) e.status = "Status is required.";
    if (!form.availabilityDate) e.availabilityDate = "Availability Date is required.";
    if (!form.retirementDate) e.retirementDate = "Retirement Date is required.";
    if (form.billable) {
      if (!form.insurance.trim()) e.insurance = "Required when test is billable.";
      if (!form.selfPay.trim()) e.selfPay = "Required when test is billable.";
      if (!form.institutional.trim()) e.institutional = "Required when test is billable.";
    }
    return e;
  }

  function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      router.push("/admin-status-queue?toast=created");
    } else {
      // Scroll to first error
      const firstKey = Object.keys(e)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="test-codes" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>

          {/* Breadcrumb + title */}
          <div className="flex flex-col w-full" style={{ gap: 24 }}>
            <Link href="/dashboard" className="flex items-center" style={{ gap: 4 }}>
              <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
              <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--button-ghost-btn-ghost-text)" }}>
                Back
              </span>
            </Link>
            <p
              className="w-full text-text-primary"
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 300,
                fontSize: "var(--font-size-font-size-h2)",
                lineHeight: "var(--font-line-height-line-height-h2)",
                letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)",
              }}
            >
              Create New Test Code
            </p>
          </div>

          {/* Form sections */}
          <div className="flex flex-col w-full" style={{ gap: 60 }}>

            {/* Basic Information */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Basic Information" />
              <div className="flex flex-wrap items-start" style={{ gap: 32 }}>
                <div id="field-testCode">
                  <TextField
                    label="Test Code" required
                    value={form.testCode} onChange={(v) => set("testCode", v)}
                    placeholder="e.g., 1800"
                    maxLength={CHAR_LIMITS.testCode}
                    error={errors.testCode}
                  />
                </div>
                <div id="field-testName">
                  <TextField
                    label="Test Name" required
                    value={form.testName} onChange={(v) => set("testName", v)}
                    placeholder="e.g., Whole Genome Sequencing"
                    maxLength={CHAR_LIMITS.testName}
                    width={400}
                    error={errors.testName}
                  />
                </div>
                <TextField
                  label="Abbreviation"
                  value={form.abbreviation} onChange={(v) => set("abbreviation", v)}
                  placeholder="e.g., WGS"
                />
                <div id="field-testCategory">
                  <SelectField
                    label="Test Category" required
                    value={form.testCategory} onChange={(v) => set("testCategory", v)}
                    options={TEST_CATEGORIES} placeholder="Select"
                    error={errors.testCategory}
                  />
                </div>
                <TextField
                  label="TAT (Days)"
                  value={form.tat} onChange={(v) => set("tat", v.replace(/\D/, ""))}
                  placeholder="1–40" width={144}
                  hint="Numeric value only"
                />
                <SelectField
                  label="Internal / External"
                  value={form.internalExternal} onChange={(v) => set("internalExternal", v)}
                  options={INTERNAL_EXTERNAL_OPTIONS} placeholder="Select"
                />
                <div id="field-status">
                  <SelectField
                    label="Status" required
                    value={form.status} onChange={(v) => set("status", v)}
                    options={STATUS_OPTIONS} placeholder="Select"
                    error={errors.status}
                  />
                </div>
                {/* Description — full width textarea */}
                <div className="flex flex-col items-start shrink-0" style={{ width: 640, gap: 4 }}>
                  <p style={labelStyle}>Test Description</p>
                  <div
                    style={{
                      height: 108, padding: 12,
                      border: "1px solid var(--borders-border-subtle, var(--borders-border-subtle))",
                      borderRadius: 4, background: "var(--bg-page, white)",
                      display: "flex", alignItems: "flex-start", width: "100%",
                    }}
                  >
                    <textarea
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Enter a brief description of the test."
                      className="flex-1 min-w-0 resize-none"
                      style={{ ...inputBaseStyle, height: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Billing" />
              <Checkbox label="Billable Test" checked={form.billable} onChange={() => set("billable", !form.billable)} />
              <div className="flex flex-wrap items-start" style={{ gap: 32 }}>
                <div id="field-insurance">
                  <CurrencyField
                    label="Insurance" required={form.billable}
                    value={form.insurance} onChange={(v) => set("insurance", v)}
                    error={errors.insurance} disabled={!form.billable}
                  />
                </div>
                <div id="field-selfPay">
                  <CurrencyField
                    label="Self-Pay" required={form.billable}
                    value={form.selfPay} onChange={(v) => set("selfPay", v)}
                    error={errors.selfPay} disabled={!form.billable}
                  />
                </div>
                <div id="field-institutional">
                  <CurrencyField
                    label="Institutional" required={form.billable}
                    value={form.institutional} onChange={(v) => set("institutional", v)}
                    error={errors.institutional} disabled={!form.billable}
                  />
                </div>
              </div>
            </div>

            {/* CPT Codes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="CPT Codes" />
              <div className="flex flex-wrap items-start" style={{ gap: 32 }}>
                <TextField
                  label="CPT Codes"
                  value={form.cptCodes} onChange={(v) => set("cptCodes", v)}
                  placeholder="e.g., 81228x1, 89398"
                />
                <TextField
                  label="DEX-Recommended CPT Code"
                  value={form.dexCpt} onChange={(v) => set("dexCpt", v)}
                  placeholder="e.g., 81228"
                />
                <TextField
                  label="Z Codes"
                  value={form.zCodes} onChange={(v) => set("zCodes", v)}
                  placeholder="e.g., Z123456"
                />
                <TextField
                  label="Concert Genetics Units (GTU)"
                  value={form.concertGtu} onChange={(v) => set("concertGtu", v)}
                  placeholder="e.g., UUID" width={640}
                />
              </div>
            </div>

            {/* Test Attributes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Test Attributes" />
              <div className="flex flex-wrap items-start" style={{ gap: 32 }}>
                <SelectField
                  label="Specimen Types"
                  value={form.specimenTypes} onChange={(v) => set("specimenTypes", v)}
                  options={SPECIMEN_TYPE_OPTIONS} placeholder="Select"
                />
                <SelectField
                  label="Kits"
                  value={form.kits} onChange={(v) => set("kits", v)}
                  options={KIT_OPTIONS} placeholder="Select"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Dates" />
              <div className="flex items-start" style={{ gap: 32 }}>
                <div id="field-availabilityDate">
                  <DateField
                    label="Availability Date" required
                    value={form.availabilityDate} onChange={(v) => set("availabilityDate", v)}
                    error={errors.availabilityDate}
                  />
                </div>
                <div id="field-retirementDate">
                  <DateField
                    label="Retirement Date" required
                    value={form.retirementDate} onChange={(v) => set("retirementDate", v)}
                    error={errors.retirementDate}
                  />
                </div>
              </div>
            </div>

            {/* Regulatory */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Regulatory" />
              <Checkbox label="NY State Approval" checked={form.nyApproval} onChange={() => set("nyApproval", !form.nyApproval)} />
            </div>

            {/* Documents */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Documents" />
              <div className="flex flex-col items-start shrink-0" style={{ width: 640 }}>
                <label
                  className="flex flex-col items-center justify-center bg-bg-page border border-border-subtle rounded-[4px] w-full cursor-pointer"
                  style={{ height: 156, gap: 8 }}
                >
                  <input type="file" multiple className="hidden" />
                  <FileArrowUp size={32} className="text-text-primary" />
                  <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "18px", color: "var(--text-text-primary)", textAlign: "center" }}>
                    Drag &amp; drop documents here or{" "}
                    <span style={{ color: "var(--button-ghost-btn-ghost-text)" }}>browse</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--text-text-muted, var(--text-text-muted))", textAlign: "center" }}>
                    Maximum file size: 20 MB
                  </p>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center w-full" style={{ gap: 32 }}>
              <div className="flex-1 min-w-0" />
              <Link
                href="/dashboard"
                className="flex items-center justify-center bg-bg-page border border-border-primary rounded-[4px] shrink-0"
                style={{ paddingLeft: 16, paddingRight: 16, height: 36 }}
              >
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))" }}>
                  Cancel
                </span>
              </Link>
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center bg-btn-primary-bg rounded-[4px] shrink-0"
                style={{ paddingLeft: 16, paddingRight: 16, height: 36 }}
              >
                <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px" }}>
                  Submit
                </span>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
