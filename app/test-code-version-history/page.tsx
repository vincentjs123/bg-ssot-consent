"use client";

import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";

const VERSIONS = [
  { version: "v3", label: "Multi-Field Update", fields: "4 Fields", role: "Admin", date: "Last updated: 12/30/2025 12:40PM", expandable: true },
  { version: "v2", label: "Multi-Field Update", fields: "4 Fields", role: "Admin", date: "Last updated: 12/30/2025 12:40PM", expandable: true },
  { version: "v1", label: "Test Code Created", fields: "15 Fields", role: "Admin", date: "Last updated: 12/30/2025 12:40PM", expandable: false },
];

const metaStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "22px",
  color: "var(--text-text-muted, var(--text-text-muted))",
  whiteSpace: "nowrap",
};

export default function TestCodeVersionHistory() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="test-codes" />

      <main
        className="flex flex-col w-full bg-bg-page"
        
      >
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
        {/* Page header */}
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
              Test Code Version History
            </p>
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px" }}>
              <span style={{ color: "var(--button-ghost-btn-ghost-text)" }}>2010</span>
              <span className="text-text-primary">{" - Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing"}</span>
            </p>
          </div>
        </div>

        {/* History section */}
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
              History
            </p>
            <div className="w-full border-b border-border-subtle" />
          </div>

          {/* Timeline entries */}
          <div className="flex flex-col items-start">
            {VERSIONS.map((v, i) => {
              const isLast = i === VERSIONS.length - 1;
              return (
                <div key={v.version} className="flex items-center bg-bg-page w-full" style={{ height: v.expandable ? 128 : 80 }}>
                  {/* Rail: line + dot */}
                  <div className="relative flex flex-col items-center self-stretch shrink-0" style={{ width: 12 }}>
                    <div className="flex-1" style={{ width: 1, backgroundColor: "var(--borders-border-subtle, var(--borders-border-subtle))" }} />
                    <div className="shrink-0 rounded-full" style={{ width: 12, height: 12, backgroundColor: "var(--deepblue-color-primary-500)" }} />
                    <div className="flex-1" style={{ width: 1, backgroundColor: isLast ? "transparent" : "var(--borders-border-subtle, var(--borders-border-subtle))" }} />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col items-start" style={{ marginLeft: 24, gap: 4 }}>
                    <p
                      className="text-text-primary whitespace-nowrap"
                      style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: "var(--font-size-font-size-h5)", lineHeight: "var(--font-line-height-line-height-h5)" }}
                    >
                      {v.version}
                    </p>
                    <div className="flex items-center justify-between" style={{ width: 488 }}>
                      <p
                        className="text-text-primary whitespace-nowrap"
                        style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px" }}
                      >
                        {v.label}
                      </p>
                      {v.expandable && <CaretDown size={20} className="text-text-primary" />}
                    </div>
                    <div className="flex items-center" style={{ gap: 8, paddingBottom: v.expandable ? 48 : 0 }}>
                      <span style={metaStyle}>{v.fields}</span>
                      <span className="rounded-full shrink-0" style={{ width: 4, height: 4, backgroundColor: "var(--text-text-muted)" }} />
                      <span style={metaStyle}>{v.role}</span>
                      <span className="rounded-full shrink-0" style={{ width: 4, height: 4, backgroundColor: "var(--text-text-muted)" }} />
                      <span style={metaStyle}>{v.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
