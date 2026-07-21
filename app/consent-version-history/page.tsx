"use client";

import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";

const cellTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const HISTORY = [
  { version: "v3", changedBy: "Jane Doe", date: "04/01/2024", field: "Consent Language", previous: "…authorization for research use of samples…", current: "…authorization for research use of de-identified genetic information…", status: "Active" },
  { version: "v2", changedBy: "Marcus Hill", date: "09/15/2023", field: "Default Response", previous: "Null", current: "Opt-out", status: "Archived" },
  { version: "v1", changedBy: "Sarah Chen", date: "01/10/2022", field: "—", previous: "—", current: "Initial creation", status: "Archived" },
];

export default function ConsentVersionHistory() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>

          <div className="flex flex-col w-full" style={{ gap: 24 }}>
            <Link href="/consent-details" className="flex items-center" style={{ gap: 4 }}>
              <CaretDown size={12} weight="bold" className="rotate-90" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
              <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--button-ghost-btn-ghost-text)" }}>Back to Consent Details</span>
            </Link>
            <div className="flex flex-col items-start w-full" style={{ gap: 8 }}>
              <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h2)", lineHeight: "var(--font-line-height-line-height-h2)", letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)" }}>
                Version History
              </p>
              <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px", color: "var(--text-text-primary)" }}>
                Germline Research Consent — Portal
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="flex items-end w-full bg-bg-body border-b-2 border-border-subtle" style={{ paddingTop: 16, paddingBottom: 8 }}>
              {[
                { label: "Version", w: 100 },
                { label: "Changed By", flex: 2 },
                { label: "Date", w: 140 },
                { label: "Field Changed", flex: 2 },
                { label: "Previous Value", flex: 3 },
                { label: "New Value", flex: 3 },
                { label: "Status", flex: 1 },
              ].map((col) => (
                <div
                  key={col.label}
                  className={col.w ? "shrink-0" : "min-w-0"}
                  style={{ paddingLeft: 8, paddingRight: 8, ...(col.w ? { width: col.w } : { flex: (col as { flex: number }).flex }) }}
                >
                  <span style={{ ...cellTextStyle, fontWeight: 700 }}>{col.label}</span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {HISTORY.map((row, i) => (
              <div key={i} className="flex items-start w-full bg-bg-page border-b border-border-subtle hover:bg-bg-body" style={{ paddingTop: 16, paddingBottom: 16 }}>
                <div className="shrink-0" style={{ width: 100, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={{ ...cellTextStyle, fontWeight: 600 }}>{row.version}</span>
                </div>
                <div className="min-w-0" style={{ flex: 2, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={cellTextStyle}>{row.changedBy}</span>
                </div>
                <div className="shrink-0" style={{ width: 140, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={cellTextStyle}>{row.date}</span>
                </div>
                <div className="min-w-0" style={{ flex: 2, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={cellTextStyle}>{row.field}</span>
                </div>
                <div className="min-w-0" style={{ flex: 3, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={{ ...cellTextStyle, color: "var(--text-text-secondary)", fontStyle: "italic", whiteSpace: "normal" }}>{row.previous}</span>
                </div>
                <div className="min-w-0" style={{ flex: 3, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={{ ...cellTextStyle, whiteSpace: "normal" }}>{row.current}</span>
                </div>
                <div className="min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={cellTextStyle}>{row.status}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
