"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CaretDown, CheckCircle, X } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRole } from "@/lib/useRole";
import { canEdit } from "@/lib/role";

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

function FieldContainer({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start" style={{ gap: 8 }}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

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
      <div className="w-full shrink-0 border-b border-border-subtle" />
    </div>
  );
}

function CheckboxField({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-start overflow-clip" style={{ gap: 12 }}>
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
          <svg viewBox="0 0 20 16" fill="none" className="w-full h-full">
            <path d="M1.5 8L7.5 14L18.5 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div
        className="flex flex-col justify-center text-text-primary"
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "24px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

const TOAST_MESSAGES: Record<string, string> = {
  "edit-request": "Your edit request for test code 2010 has been submitted successfully.",
  "delete-request": "Your delete request for test code 2010 has been submitted successfully.",
};

export default function TestCodeDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = useRole();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const param = searchParams.get("toast");
    if (param && TOAST_MESSAGES[param]) {
      setToast(TOAST_MESSAGES[param]);
      router.replace("/test-code-details", { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="test-codes" />

      {/* Toast notification */}
      {toast && (
        <div
          className="flex items-center w-full"
          style={{ background: "var(--bg-ssot-toast-success)", color: "white", padding: "12px 64px", gap: 12, marginTop: 12 }}
        >
          <CheckCircle size={20} weight="fill" className="shrink-0" />
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", flex: 1 }}>
            {toast}
          </span>
          <button onClick={() => setToast(null)} className="shrink-0 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
      )}

      <main
        className="flex flex-col w-full bg-bg-page"
        
      >
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
        {/* Page header */}
        <div className="flex flex-col w-full" style={{ gap: 24 }}>
          {/* Breadcrumb */}
          <Link
            href="/dashboard"
            className="flex items-center"
            style={{ gap: 4 }}
          >
            <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
            <span
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "var(--button-ghost-btn-ghost-text)",
              }}
            >
              Back
            </span>
          </Link>

          {/* Title block */}
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
              Test Code Details
            </p>
            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 20,
                lineHeight: "28px",
              }}
            >
              <span style={{ color: "var(--button-ghost-btn-ghost-text)" }}>2010</span>
              <span className="text-text-primary">
                {" - Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing"}
              </span>
            </p>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex items-start w-full" style={{ gap: 32 }}>
          {/* Left column */}
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: 60 }}>

            {/* Basic Information */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Basic Information" />
              {/* Grid: col 1 narrow | col 2 wide (Test Name) | col 3 narrow | col 4 narrow */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", gap: 24 }}>
                <FieldContainer label="Test Code" value="2010" />
                <FieldContainer label="Test Name" value="Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing" />
                <FieldContainer label="Abbreviation" value="-" />
                <FieldContainer label="Test Category" value="Mito" />
                <FieldContainer label="TAT (Days)" value="10" />
                <FieldContainer label="Internal / External" value="External" />
                <FieldContainer label="Status" value="Active" />
                <div /> {/* empty cell to complete the row */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <FieldContainer label="Test Description" value="The MitoMet Plus aCGH Analysis array contains 180,000 oligonucleotide probes targeted at both mitochondrial and nuclear genes involved in mitochondrial and metabolic related diseases." />
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Billing" />
              <CheckboxField label="Billable Test*" checked={true} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                <FieldContainer label="Insurance" value="$ 450.00" />
                <FieldContainer label="Self-Pay" value="$ 1500.00" />
                <FieldContainer label="Institutional" value="$ 4000.00" />
              </div>
            </div>

            {/* CPT Codes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="CPT Codes" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <FieldContainer label="CPT Codes" value="81228x1" />
                <FieldContainer label="DEX-Recommended CPT Code" value="81228" />
                <FieldContainer label="Z Codes" value="Z123456" />
                <FieldContainer label="Concert Genetics Units (GTU)" value="a3f2c1b0-1234-5678-abcd-ef0123456789" />
              </div>
            </div>

            {/* Test Attributes */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Test Attributes" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <FieldContainer label="Specimen Types" value="Blood, Saliva" />
                <FieldContainer label="Kits" value="Kit A, Kit B" />
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Dates" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <FieldContainer label="Availability Date" value="4/12/2009" />
                <FieldContainer label="Retirement Date" value="5/1/2099" />
              </div>
            </div>

            {/* Regulatory */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Regulatory" />
              <CheckboxField label="NY State Approval" checked={true} />
            </div>

            {/* Consents */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Consents" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <FieldContainer label="Associated Consents" value="Standard" />
              </div>
            </div>

            {/* Documents */}
            <div className="flex flex-col w-full" style={{ gap: 24 }}>
              <SectionHeader title="Documents" />
            </div>

          </div>

          {/* Right column */}
          <div className="flex flex-col items-start shrink-0" style={{ width: 416 }}>
            <div
              className="flex flex-col items-start w-full bg-bg-page border border-border-subtle rounded-[4px]"
              style={{ padding: 24, gap: 16 }}
            >
              {/* Card title */}
              <div className="flex flex-col items-start w-full" style={{ gap: 4 }}>
                <p
                  className="w-full"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: "var(--font-size-font-size-h4)",
                    lineHeight: "var(--font-line-height-line-height-h4)",
                    color: "var(--button-primary-btn-primary-bg)",
                  }}
                >
                  Test Code Actions
                </p>
                <div className="w-full shrink-0 border-b border-border-subtle" />
              </div>

              {/* Action links — filtered by role */}
              {[
                { label: "Export Data (.csv)", href: "#", always: true },
                { label: "View Version History", href: "/test-code-version-history", always: true },
                { label: "Request Edit", href: "/request-edit", always: false },
                { label: "Request Delete", href: "/request-delete", always: false },
              ]
                .filter((a) => a.always || canEdit(role))
                .map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="underline whitespace-nowrap text-center"
                    style={{
                      fontFamily: "var(--font-barlow), sans-serif",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "normal",
                      color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))",
                    }}
                  >
                    {action.label}
                  </Link>
                ))}
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
