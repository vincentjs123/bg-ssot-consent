"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CaretDown, Plus, Trash } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";

const STATUS_OPTS = ["Live", "Pending"];

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

function TextField({ label, defaultValue, width = 304 }: { label: string; defaultValue?: string; width?: number | string }) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}</p>
      <div className="flex items-center w-full border border-border-subtle rounded-[4px]" style={{ height: 36, padding: 12 }}>
        <input style={inputBase} defaultValue={defaultValue} />
      </div>
    </div>
  );
}

function SelectField({ label, defaultValue, options, width = 304 }: { label: string; defaultValue?: string; options: string[]; width?: number | string }) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}</p>
      <div className="relative w-full">
        <select className="w-full border border-border-subtle rounded-[4px] appearance-none" style={{ height: 36, paddingLeft: 12, paddingRight: 32, ...inputBase }} defaultValue={defaultValue}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary" />
      </div>
    </div>
  );
}

function TextAreaField({ label, defaultValue, rows = 6 }: { label: string; defaultValue?: string; rows?: number }) {
  return (
    <div className="flex flex-col items-start w-full" style={{ gap: 4 }}>
      <p style={labelStyle}>{label}</p>
      <div className="flex w-full border border-border-subtle rounded-[4px]" style={{ padding: 12 }}>
        <textarea
          className="w-full resize-none outline-none bg-transparent"
          style={{ ...inputBase, height: rows * 24 }}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
}

function TRFList() {
  const [trfs, setTrfs] = useState(["Custom Family Sequencing", "Custom Proband Sequencing"]);

  const add = () => setTrfs((prev) => [...prev, ""]);
  const remove = (i: number) => setTrfs((prev) => prev.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => setTrfs((prev) => prev.map((v, idx) => idx === i ? val : v));

  return (
    <div className="flex flex-col w-full" style={{ gap: 8 }}>
      <p style={labelStyle}>Test Requisition Forms</p>
      <div className="flex flex-col" style={{ gap: 6 }}>
        {trfs.map((trf, i) => (
          <div key={i} className="flex items-center" style={{ gap: 8 }}>
            <div className="flex items-center flex-1 border border-border-subtle rounded-[4px]" style={{ height: 36, padding: "0 12px" }}>
              <input
                style={inputBase}
                value={trf}
                onChange={(e) => update(i, e.target.value)}
              />
            </div>
            <button
              onClick={() => remove(i)}
              className="flex items-center justify-center text-text-secondary hover:text-text-primary"
              style={{ width: 24, height: 24, flexShrink: 0 }}
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="flex items-center self-start text-text-secondary hover:text-text-primary"
        style={{ gap: 4, fontFamily: "var(--font-barlow), sans-serif", fontSize: 14, fontWeight: 400 }}
      >
        <Plus size={14} />
        Add TRF
      </button>
    </div>
  );
}

function PaperLanguageField() {
  const [sameAsPortal, setSameAsPortal] = useState(false);

  return (
    <div className="flex flex-col w-full" style={{ gap: 8 }}>
      <div className="flex items-center justify-between w-full">
        <p style={labelStyle}>Consent Language — Paper</p>
        <label className="flex items-center" style={{ gap: 6, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={sameAsPortal}
            onChange={(e) => setSameAsPortal(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: "var(--deepblue-color-primary-500)" }}
          />
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontSize: 14, fontWeight: 400, color: "var(--text-text-secondary)" }}>
            Same as portal
          </span>
        </label>
      </div>
      {!sameAsPortal && (
        <div className="flex w-full border border-border-subtle rounded-[4px]" style={{ padding: 12 }}>
          <textarea
            className="w-full resize-none outline-none bg-transparent"
            style={{ ...inputBase, height: 144 }}
            defaultValue=""
            placeholder="Enter paper consent language…"
          />
        </div>
      )}
      {sameAsPortal && (
        <div className="flex w-full border border-border-subtle rounded-[4px] bg-bg-body" style={{ padding: 12, opacity: 0.5 }}>
          <p style={{ ...inputBase, color: "var(--text-text-secondary)", fontStyle: "italic" }}>Same as portal language</p>
        </div>
      )}
    </div>
  );
}

function EditConsentInner() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const consentName = searchParams.get("name") ?? "Consent";

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>

          {/* Page title */}
          <div className="flex flex-col w-full" style={{ gap: 24 }}>
            <Link href="/consent-details" className="flex items-center" style={{ gap: 4 }}>
              <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
              <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--button-ghost-btn-ghost-text)" }}>Back</span>
            </Link>
            <div className="flex flex-col items-start w-full" style={{ gap: 8 }}>
              <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h2)", lineHeight: "var(--font-line-height-line-height-h2)", letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)" }}>
                Edit Consent
              </p>
              <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px", color: "var(--button-ghost-btn-ghost-text)" }}>
                {consentName}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full" style={{ gap: 60 }}>

            {/* Identity */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Consent Identity" />
              <div className="flex items-start w-full flex-wrap" style={{ gap: 24 }}>
                <TextField label="Consent Name*" defaultValue={consentName} width={400} />
                <SelectField label="Status*" defaultValue="Live" options={STATUS_OPTS} width={160} />
                <TextField label="Version" defaultValue="2.0" width={120} />
                <div className="flex flex-col items-start shrink-0" style={{ width: 200, gap: 4 }}>
                  <p style={labelStyle}>Effective Date</p>
                  <div className="flex items-center w-full border border-border-subtle rounded-[4px]" style={{ height: 36, paddingLeft: 12, paddingRight: 12 }}>
                    <input type="date" style={{ ...inputBase, colorScheme: "light" }} defaultValue="2024-04-01" />
                  </div>
                </div>
              </div>
            </div>

            {/* Portal language */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Consent Language" />
              <TextAreaField
                label="Consent Language — Portal"
                defaultValue="By signing below, I authorize Baylor Genetics to use my de-identified genetic information for research purposes. I understand this is voluntary and will not affect my medical care. I may withdraw consent at any time by contacting my healthcare provider."
                rows={6}
              />
              <PaperLanguageField />
            </div>

            {/* Test codes & TRFs */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Test Codes & TRFs" />
              <TextField label="Test Codes (comma-separated)" defaultValue="1600, 1601, 1700" width={400} />
              <TRFList />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end w-full" style={{ gap: 16 }}>
              <Link
                href="/consent-details"
                className="flex items-center justify-center border border-border-primary rounded-[4px]"
                style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
              >
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))" }}>Cancel</span>
              </Link>
              <button
                onClick={() => router.push("/consents-admin-status-queue?toast=submitted")}
                className="flex items-center justify-center bg-btn-primary-bg rounded-[4px]"
                style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
              >
                <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px" }}>Submit for Review</span>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function EditConsent() {
  return (
    <Suspense>
      <EditConsentInner />
    </Suspense>
  );
}
