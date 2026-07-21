"use client";

import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";

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
    <div className="flex flex-col items-start w-full">
      <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h3)", lineHeight: "var(--font-line-height-line-height-h3)" }}>
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

export default function ConsentsAdminReview() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="status-queue" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>

          <div className="flex flex-col w-full" style={{ gap: 24 }}>
            <Link href="/consents-admin-status-queue" className="flex items-center" style={{ gap: 4 }}>
              <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
              <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--button-ghost-btn-ghost-text)" }}>Back</span>
            </Link>
            <div className="flex flex-col items-start w-full" style={{ gap: 8 }}>
              <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h2)", lineHeight: "var(--font-line-height-line-height-h2)", letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)" }}>
                Review Request
              </p>
              <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px", color: "var(--text-text-primary)" }}>
                Submitted by Jane Doe on 04/28/2026
              </p>
            </div>
          </div>

          <div className="flex w-full items-start" style={{ gap: 32 }}>

            {/* Left column */}
            <div className="flex flex-col flex-1 min-w-0" style={{ gap: 60 }}>

              <div className="flex flex-col w-full" style={{ gap: 24 }}>
                <SectionHeader title="Consent Content" />
                <div className="flex items-start w-full" style={{ gap: 24 }}>
                  <Field label="Title" value="Biomarker Research Consent" width={400} />
                  <Field label="System" value="Portal" width={180} />
                </div>
                <div className="flex flex-col items-start" style={{ gap: 8, maxWidth: 640 }}>
                  <p style={labelStyle}>Consent Language</p>
                  <p style={valueStyle}>
                    I authorize Baylor Genetics to use my de-identified genomic data for biomarker research. Participation is voluntary and does not affect my care. I understand results will not be returned to me or my provider.
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full" style={{ gap: 24 }}>
                <SectionHeader title="Associated Test" />
                <div className="flex items-start w-full" style={{ gap: 24 }}>
                  <Field label="Test Code" value="BIO-300" width={180} />
                  <Field label="Test Name" value="Biomarker Panel — Research Grade" width={400} />
                  <Field label="Test Category" value="Bio" width={160} />
                </div>
              </div>

              <div className="flex flex-col w-full" style={{ gap: 24 }}>
                <SectionHeader title="Response Configuration" />
                <div className="flex items-start w-full" style={{ gap: 24 }}>
                  <Field label="Expected Response" value="Yes" width={200} />
                  <Field label="Acceptable Responses" value="Opt-in" width={200} />
                  <Field label="Default Response" value="Opt-out" width={200} />
                </div>
              </div>

              <div className="flex flex-col w-full" style={{ gap: 24 }}>
                <SectionHeader title="Dates & Status" />
                <div className="flex items-start w-full" style={{ gap: 24 }}>
                  <Field label="Effective Date" value="05/01/2026" width={200} />
                  <Field label="Retirement Date" value="12/31/2099" width={200} />
                  <Field label="Status" value="Active" width={200} />
                </div>
              </div>

            </div>

            {/* Right column — Submit Decision */}
            <div className="flex flex-col items-start shrink-0" style={{ width: 416 }}>
              <div className="flex flex-col items-start w-full bg-bg-page border border-border-subtle rounded-[4px]" style={{ padding: 24, gap: 24 }}>
                <div className="flex flex-col items-start w-full">
                  <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h3)", lineHeight: "var(--font-line-height-line-height-h3)" }}>
                    Submit Decision
                  </p>
                  <div className="w-full border-b border-border-subtle" />
                </div>
                <div className="flex items-start" style={{ gap: 24 }}>
                  <button
                    onClick={() => router.push("/consents-admin-status-queue?toast=approved")}
                    className="flex items-center justify-center bg-btn-primary-bg rounded-[4px] shrink-0"
                    style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
                  >
                    <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", whiteSpace: "nowrap" }}>
                      Approve Request
                    </span>
                  </button>
                  <button
                    onClick={() => router.push("/consents-admin-status-queue?toast=rejected")}
                    className="flex items-center justify-center bg-bg-page border rounded-[4px] shrink-0"
                    style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36, borderColor: "var(--button-primary-btn-primary-bg, var(--text-text-primary))" }}
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
