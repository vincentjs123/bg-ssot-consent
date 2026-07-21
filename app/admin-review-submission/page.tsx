"use client";

import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";
import { useRouter } from "next/navigation";

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "16px",
  color: "var(--text-text-primary)",
  whiteSpace: "nowrap",
};

const valueStyle: React.CSSProperties = {
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

function Field({ label, value, width }: { label: string; value: string; width?: number | string }) {
  return (
    <div className="flex flex-col items-start shrink-0" style={{ gap: 8, width }}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function CheckboxDisplay({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-start" style={{ gap: 12 }}>
      <div
        className="flex items-start shrink-0 rounded-[2px]"
        style={{
          width: 24,
          height: 24,
          padding: 2,
          backgroundColor: checked ? "var(--button-primary-btn-primary-disabled-bg, var(--deepblue-color-primary-200))" : "transparent",
          border: checked ? "none" : "2px solid var(--deepblue-color-primary-200)",
        }}
      >
        {checked && (
          <div className="flex-1 h-full min-w-0 overflow-clip relative">
            <svg viewBox="0 0 20 16" fill="none" className="w-full h-full">
              <path d="M1.5 8L7.5 14L18.5 2" stroke="var(--button-primary-btn-primary-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <span style={valueStyle}>{label}</span>
    </div>
  );
}

export default function AdminReviewSubmission() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="status-queue" />

      <main
        className="flex flex-col w-full bg-bg-page"
        
      >
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
        {/* Page header */}
        <div className="flex flex-col w-full" style={{ gap: 24 }}>
          <Link href="/admin-status-queue" className="flex items-center" style={{ gap: 4 }}>
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
              Review Request
            </p>
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px", color: "var(--text-text-primary)" }}>
              Submitted by [Person&apos;s Name] on 04/28/2026
            </p>
          </div>
        </div>

        {/* Body — two columns */}
        <div className="flex w-full items-start" style={{ gap: 32 }}>

          {/* Left column */}
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: 60 }}>

            {/* Basic Information */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Basic Information" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                {[
                  { label: "Test Code", value: "2010" },
                  { label: "Test Name", value: "Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing" },
                  { label: "Abbreviation", value: "-" },
                  { label: "Test Category", value: "Mito" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col flex-1 min-w-0 items-start" style={{ gap: 8 }}>
                    <p style={labelStyle}>{f.label}</p>
                    <p style={{ ...valueStyle, wordBreak: "break-word" }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start" style={{ gap: 24 }}>
                <div className="flex flex-col items-start shrink-0" style={{ gap: 8, width: 144 }}>
                  <p style={labelStyle}>TAT (Days)</p>
                  <p style={valueStyle}>10</p>
                </div>
                <div className="flex flex-col items-start shrink-0" style={{ gap: 8, width: 310 }}>
                  <p style={labelStyle}>Internal / External</p>
                  <p style={valueStyle}>External</p>
                </div>
                <div className="flex flex-col items-start shrink-0" style={{ gap: 8, width: 310 }}>
                  <p style={labelStyle}>Status</p>
                  <p style={valueStyle}>Active</p>
                </div>
              </div>
              <div className="flex flex-col items-start shrink-0" style={{ width: 640, gap: 8 }}>
                <p style={labelStyle}>Test Description</p>
                <p style={valueStyle}>
                  The MitoMet Plus aCGH Analysis array contains 180,000 oligonucleotide probes targeted at both mitochondrial and nuclear genes involved in mitochondrial and metabolic related diseases.
                </p>
              </div>
            </div>

            {/* Billing */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Billing" />
              <CheckboxDisplay label="Billable Test*" checked={true} />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <Field label="Insurance" value="$ 450.00" width={310} />
                <Field label="Self-Pay" value="$ 1500.00" width={310} />
                <Field label="Institutional" value="$ 4000.00" width={310} />
              </div>
            </div>

            {/* CPT Codes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="CPT Codes" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <Field label="CPT Codes" value="81228x1" width={310} />
                <Field label="DEX-Recommended CPT Code" value="81228" width={310} />
              </div>
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <Field label="Z Codes" value="Z123456" width={310} />
                <Field label="Concert Genetics Units (GTU)" value="a3f2c1b0-1234-5678-abcd-ef0123456789" width={640} />
              </div>
            </div>

            {/* Test Attributes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Test Attributes" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <Field label="Specimen Types" value="Blood, Saliva" width={310} />
                <Field label="Kits" value="Kit A, Kit B" width={310} />
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Dates" />
              <div className="flex items-start w-full" style={{ gap: 24 }}>
                <Field label="Availability Date" value="4/12/2009" width={310} />
                <Field label="Retirement Date" value="5/1/2099" width={310} />
              </div>
            </div>

            {/* Regulatory */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Regulatory" />
              <CheckboxDisplay label="NY State Approval" checked={true} />
            </div>

            {/* Consents */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Consents" />
              <div className="flex items-start w-full">
                <Field label="Associated Consents" value="Standard" width={310} />
              </div>
            </div>

            {/* Documents */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Documents" />
            </div>

          </div>

          {/* Right column — Submit Decision card */}
          <div className="flex flex-col items-start shrink-0" style={{ width: 416 }}>
            <div
              className="flex flex-col items-start w-full bg-bg-page border border-border-subtle rounded-[4px]"
              style={{ padding: 24, gap: 24 }}
            >
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
                  Submit Decision
                </p>
                <div className="w-full border-b border-border-subtle" />
              </div>

              <div className="flex items-start" style={{ gap: 24 }}>
                <button
                  onClick={() => router.push("/admin-status-queue?toast=approved")}
                  className="flex items-center justify-center bg-btn-primary-bg rounded-[4px] shrink-0"
                  style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
                >
                  <span
                    className="text-btn-primary-text"
                    style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", whiteSpace: "nowrap" }}
                  >
                    Approve Request
                  </span>
                </button>
                <button
                  onClick={() => router.push("/admin-status-queue?toast=rejected")}
                  className="flex items-center justify-center bg-bg-page border rounded-[4px] shrink-0"
                  style={{
                    paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36,
                    borderColor: "var(--button-primary-btn-primary-bg, var(--text-text-primary))",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))", whiteSpace: "nowrap" }}>
                    Reject
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
        </div>
      </main>
    </div>
  );
}
