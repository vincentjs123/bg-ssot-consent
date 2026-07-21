"use client";

import { useState } from "react";
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

function TextAreaField({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col items-start w-full" style={{ gap: 4 }}>
      <p style={labelStyle}>{label}</p>
      <div className="flex w-full border border-border-subtle rounded-[4px]" style={{ padding: 12 }}>
        <textarea className="w-full resize-none outline-none bg-transparent" style={{ ...inputBase, height: 120 }} defaultValue={defaultValue} />
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

export default function EditConsent() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();
  const role = useRole();

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>

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
                Germline Research Consent
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full" style={{ gap: 60 }}>

            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Consent Content" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <TextField label="Title*" defaultValue="Germline Research Consent" width={400} />
                <SelectField label="System*" defaultValue="Portal" options={SYSTEMS} width={200} />
              </div>
              <TextAreaField label="Consent Language*" defaultValue="By signing below, I authorize Baylor Genetics to use my de-identified genetic information for research purposes. I understand this is voluntary and will not affect my medical care. I may withdraw consent at any time by contacting my healthcare provider." />
            </div>

            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Associated Test" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <TextField label="Test Code*" defaultValue="2010" width={180} />
                <TextField label="Test Name*" defaultValue="Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing" width={400} />
                <SelectField label="Test Category*" defaultValue="Mito" options={CATEGORIES} width={200} />
              </div>
            </div>

            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Response Configuration" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <SelectField label="Expected Response*" defaultValue="Yes" options={EXPECTED_RESPONSE_OPTS} width={220} />
                <SelectField label="Acceptable Responses*" defaultValue="Opt-in" options={ACCEPTABLE_RESPONSE_OPTS} width={220} />
                <SelectField label="Default Response*" defaultValue="Opt-out" options={DEFAULT_RESPONSE_OPTS} width={220} />
              </div>
            </div>

            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Dates & Status" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <div className="flex flex-col items-start shrink-0" style={{ width: 200, gap: 4 }}>
                  <p style={labelStyle}>Effective Date*</p>
                  <div className="flex items-center w-full border border-border-subtle rounded-[4px]" style={{ height: 36, paddingLeft: 12, paddingRight: 12 }}>
                    <input type="date" style={{ ...inputBase, colorScheme: "light" }} defaultValue="2024-04-01" />
                  </div>
                </div>
                <div className="flex flex-col items-start shrink-0" style={{ width: 200, gap: 4 }}>
                  <p style={labelStyle}>Retirement Date</p>
                  <div className="flex items-center w-full border border-border-subtle rounded-[4px]" style={{ height: 36, paddingLeft: 12, paddingRight: 12 }}>
                    <input type="date" style={{ ...inputBase, colorScheme: "light" }} defaultValue="2099-12-31" />
                  </div>
                </div>
                <SelectField label="Status*" defaultValue="Active" options={STATUS_OPTS} width={200} />
              </div>
            </div>

            <div className="flex items-center justify-end w-full" style={{ gap: 16 }}>
              <Link href="/consent-details" className="flex items-center justify-center border border-border-primary rounded-[4px]" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))" }}>Cancel</span>
              </Link>
              <button
                onClick={() => {
                  const dest = "/consents-admin-status-queue";
                  router.push(`${dest}?toast=submitted`);
                }}
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
