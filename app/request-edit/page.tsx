"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
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


export default function RequestEdit() {
  useRoleGuard(["administrator", "data-administrator"]);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="test-codes" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
        {/* Page header */}
        <div className="flex flex-col w-full" style={{ gap: 24 }}>
          <Link href="/test-code-details" className="flex items-center" style={{ gap: 4 }}>
            <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--button-ghost-btn-ghost-text)" }}>
              Back
            </span>
          </Link>

          <div className="flex flex-col w-full" style={{ gap: 8 }}>
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
              Request Edit
            </p>
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px" }}>
              <span style={{ color: "var(--button-ghost-btn-ghost-text)" }}>2010</span>
              <span className="text-text-primary">{" - Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing"}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col w-full" style={{ gap: 60 }}>
          {/* Reasoning section */}
          <div className="flex flex-col w-full" style={{ gap: 24 }}>
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
                Reasoning
              </p>
              <div className="w-full border-b border-border-subtle" />
            </div>

            <div className="flex flex-col items-start bg-bg-page shrink-0" style={{ width: 640, gap: 4 }}>
              <p style={labelStyle}>Reason for Editing*</p>
              <div
                className="flex items-start bg-bg-page border border-border-subtle rounded-[4px] w-full"
                style={{ height: 108, padding: 12 }}
              >
                <textarea
                  placeholder="Explain why this change is needed."
                  className="flex-1 min-w-0 resize-none bg-transparent outline-none"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "var(--text-text-muted, var(--text-text-muted))",
                    height: "100%",
                    width: "100%",
                  }}
                />
              </div>
            </div>
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
              className="flex items-center justify-center bg-btn-primary-bg rounded-[4px] shrink-0"
              style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
              onClick={() => router.push("/test-code-details?toast=edit-request")}
            >
              <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px" }}>
                Submit Request
              </span>
            </button>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
