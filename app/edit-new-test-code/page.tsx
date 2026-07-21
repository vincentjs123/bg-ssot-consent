"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CaretDown, CalendarBlank, X } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";
import { useRole } from "@/lib/useRole";

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "16px",
  color: "var(--text-text-primary)",
  whiteSpace: "nowrap",
};

const inputTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start w-full bg-bg-page">
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
      <div className="w-full border-b border-border-subtle" />
    </div>
  );
}

function TextField({ label, value, width = 304 }: { label: string; value?: string; width?: number | string }) {
  return (
    <div className="flex flex-col items-start bg-bg-page shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}</p>
      <div
        className="flex items-center justify-between bg-bg-page border border-border-subtle rounded-[4px] w-full"
        style={{ height: 36, padding: 12 }}
      >
        <span
          className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          style={inputTextStyle}
        >
          {value || ""}
        </span>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  width = 304,
}: {
  label: string;
  value?: string;
  width?: number | string;
}) {
  return (
    <div className="flex flex-col items-start bg-bg-page shrink-0" style={{ width, gap: 4 }}>
      <p style={labelStyle}>{label}</p>
      <div
        className="flex items-center justify-between bg-bg-page border border-border-subtle rounded-[4px] w-full"
        style={{ height: 36, padding: 12 }}
      >
        <span
          className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          style={inputTextStyle}
        >
          {value || "Select"}
        </span>
        <CaretDown size={14} className="shrink-0 text-text-primary" />
      </div>
    </div>
  );
}

function DateField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col items-start bg-bg-page shrink-0" style={{ width: 304, gap: 4 }}>
      <p style={labelStyle}>{label}</p>
      <div
        className="flex items-center justify-between bg-bg-page border border-border-subtle rounded-[4px] w-full"
        style={{ height: 36, padding: 12 }}
      >
        <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" style={inputTextStyle}>
          {value || ""}
        </span>
        <CalendarBlank size={14} className="shrink-0 text-text-primary" />
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-[8px] bg-bg-body border border-border-subtle rounded-[16px] overflow-clip shrink-0"
      style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4 }}
    >
      <span style={{ ...inputTextStyle, whiteSpace: "nowrap" }}>{label}</span>
      <X size={12} className="shrink-0 text-text-primary" />
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start overflow-clip" style={{ gap: 12 }}>
      <button
        onClick={onChange}
        className="flex items-start shrink-0 rounded-[2px]"
        style={{
          width: 24,
          height: 24,
          padding: 2,
          backgroundColor: checked ? "var(--button-primary-btn-primary-bg, var(--text-text-primary))" : "transparent",
          border: checked ? "none" : "1px solid var(--borders-border-strong)",
        }}
      >
        {checked && (
          <svg viewBox="0 0 20 16" fill="none" className="w-full h-full">
            <path d="M1.5 8L7.5 14L18.5 2" stroke="var(--button-primary-btn-primary-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span style={{ ...inputTextStyle }}>
        {label}
      </span>
    </div>
  );
}

export default function EditNewTestCode() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();
  const role = useRole();
  const [billable, setBillable] = useState(true);
  const [nyApproval, setNyApproval] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="test-codes" />

      <main
        className="flex flex-col w-full bg-bg-page"
        
      >
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
        {/* Breadcrumb + title */}
        <div className="flex flex-col w-full" style={{ gap: 24 }}>
          <Link href="/test-code-details" className="flex items-center" style={{ gap: 4 }}>
            <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--button-ghost-btn-ghost-text)" }}>
              Back
            </span>
          </Link>
          <div className="flex flex-col items-start w-full" style={{ gap: 8 }}>
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
              Edit Test Code
            </p>
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px" }}>
              <span style={{ color: "var(--button-ghost-btn-ghost-text)" }}>2010</span>
              <span className="text-text-primary">{" - Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing"}</span>
            </p>
          </div>
        </div>

        {/* Form body */}
        <div className="flex w-full" style={{ gap: 32 }}>
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: 60 }}>

            {/* Basic Information */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Basic Information" />
              <div className="flex items-start w-full" style={{ gap: 32 }}>
                <TextField label="Test Code*" value="2010" width="auto" />
                <TextField label="Test Name*" value="Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing" width="auto" />
                <TextField label="Abbreviation" width="auto" />
                <SelectField label="Test Category*" value="Mito" width="auto" />
              </div>
              <div className="flex items-start" style={{ gap: 32 }}>
                <TextField label="TAT (Days)" value="10" width={144} />
                <SelectField label="Internal / External" value="External" width={304} />
                <SelectField label="Status*" value="Active" width={304} />
              </div>
              <div
                className="flex flex-col items-start bg-bg-page shrink-0"
                style={{ width: 640, gap: 4 }}
              >
                <p style={labelStyle}>Test Description</p>
                <div
                  className="flex items-start bg-bg-page border border-border-subtle rounded-[4px] w-full"
                  style={{ height: 108, padding: 12 }}
                >
                  <textarea
                    className="flex-1 min-w-0 resize-none bg-transparent outline-none"
                    defaultValue="The MitoMet Plus aCGH Analysis array contains 180,000 oligonucleotide probes targeted at both mitochondrial and nuclear genes involved in mitochondrial and metabolic related diseases."
                    style={{ ...inputTextStyle, height: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Billing" />
              <CheckboxField label="Billable Test*" checked={billable} onChange={() => setBillable(!billable)} />
              <div className="flex items-start w-full" style={{ gap: 32, opacity: billable ? 1 : 0.5 }}>
                <TextField label="Insurance*" value="$  450.00" width={304} />
                <TextField label="Self-Pay" value="$  1500.00" width={304} />
                <TextField label="Institutional" value="$  4000.00" width={304} />
              </div>
            </div>

            {/* CPT Codes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="CPT Codes" />
              <div className="flex flex-col items-start" style={{ gap: 16 }}>
                <SelectField label="CPT Codes" value="9921" width={304} />
                <div className="flex items-start" style={{ gap: 8 }}>
                  <Chip label="81228x1" />
                  <Chip label="89398" />
                </div>
              </div>
              <TextField label="DEX-Recommended CPT Code" value="81228" width={304} />
              <TextField label="Z Codes" value="Z123456" width={304} />
              <TextField label="Concert Genetics Units (GTU)" value="a3f2c1b0-1234-5678-abcd-ef0123456789" width={640} />
            </div>

            {/* Test Attributes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Test Attributes" />
              <div className="flex flex-col items-start" style={{ gap: 16 }}>
                <SelectField label="Specimen Types" value="Select" width={304} />
                <div className="flex items-start" style={{ gap: 8 }}>
                  <Chip label="Blood" />
                  <Chip label="Saliva" />
                </div>
              </div>
              <div className="flex flex-col items-start" style={{ gap: 16 }}>
                <SelectField label="Kits" value="Select" width={304} />
                <div className="flex items-start" style={{ gap: 8 }}>
                  <Chip label="Kit A" />
                  <Chip label="Kit B" />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Dates" />
              <div className="flex items-start" style={{ gap: 32 }}>
                <DateField label="Availability Date" value="4/12/2009" />
                <DateField label="Retirement Date" value="5/1/2099" />
              </div>
            </div>

            {/* Regulatory */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Regulatory" />
              <CheckboxField label="NY State Approval" checked={nyApproval} onChange={() => setNyApproval(!nyApproval)} />
            </div>

            {/* Documents */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Documents" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end w-full" style={{ gap: 32, height: 36 }}>
              <Link
                href="/test-code-details"
                className="flex items-center justify-center bg-bg-page border border-border-primary rounded-[4px] shrink-0"
                style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
              >
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))" }}>
                  Cancel
                </span>
              </Link>
              <button
                onClick={() => router.push("/admin-status-queue?toast=submitted")}
                className="flex items-center justify-center bg-btn-primary-bg rounded-[4px] shrink-0"
                style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
              >
                <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px" }}>
                  Submit
                </span>
              </button>
            </div>

          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
