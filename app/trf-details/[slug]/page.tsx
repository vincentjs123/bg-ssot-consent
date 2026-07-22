"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CaretLeft, Clock } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 600,
  fontSize: 20,
  lineHeight: "28px",
  color: "var(--text-text-primary)",
};

function Divider() {
  return <div style={{ height: 1, background: "var(--borders-border-subtle)", margin: "24px 0" }} />;
}

function PlaceholderLines({ count = 2 }: { count?: number }) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[2px] bg-bg-body"
          style={{ height: 20, width: i % 2 === 0 ? "72%" : "55%" }}
        />
      ))}
    </div>
  );
}

export default function TrfDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const label = decodeURIComponent(slug ?? "");

  return (
    <div className="flex flex-col min-h-screen bg-bg-body">
      <AppHeader domain="consents" activeTab="consents" />

      <main className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ padding: "32px 64px 64px", gap: 24 }}>
        {/* Back */}
        <Link
          href="/consents"
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
          style={{ fontSize: 14, lineHeight: "20px", fontFamily: "var(--font-barlow), sans-serif" }}
        >
          <CaretLeft size={14} />
          Home
        </Link>

        {/* Coming soon banner */}
        <div
          className="flex items-center gap-3 rounded-[4px] border border-border-subtle bg-bg-page"
          style={{ padding: "12px 20px" }}
        >
          <Clock size={20} style={{ color: "var(--text-text-muted)", flexShrink: 0 }} />
          <p
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "20px",
              color: "var(--text-text-secondary)",
            }}
          >
            This page is coming soon. The content below is a structural preview only.
          </p>
        </div>

        {/* Page content — inactive/greyed */}
        <div className="flex flex-col" style={{ gap: 24, opacity: 0.38, pointerEvents: "none" }}>

          {/* Page header */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <div
              className="inline-flex items-center rounded-[40px] border border-border-subtle bg-bg-page"
              style={{
                padding: "4px 12px",
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 600,
                fontSize: 12,
                lineHeight: "16px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-text-secondary)",
                alignSelf: "flex-start",
              }}
            >
              Test Requisition Form
            </div>
            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 300,
                fontSize: "var(--font-size-font-size-h2)",
                lineHeight: "var(--font-line-height-line-height-h2)",
                letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)",
                color: "var(--text-text-primary)",
              }}
            >
              {label}
            </p>
            <p style={{ ...bodyText, color: "var(--text-text-secondary)", fontSize: 14 }}>
              Version 1.0 &nbsp;|&nbsp; Effective TBD
            </p>
          </div>

          {/* Status row */}
          <div
            className="flex items-center rounded-[4px] border border-border-subtle bg-bg-page"
            style={{ padding: "12px 20px", gap: 16 }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "20px",
                border: "1px solid var(--borders-border-primary)",
                borderRadius: 40,
                padding: "4px 12px",
                background: "var(--button-success-btn-success-bg)",
                color: "var(--button-primary-btn-primary-text)",
                whiteSpace: "nowrap",
              }}
            >
              Live
            </span>
            <span style={{ ...bodyText, fontSize: 14, color: "var(--text-text-secondary)" }}>
              Last updated TBD
            </span>
          </div>

          {/* Detail card */}
          <div className="flex flex-col border border-border-subtle rounded-[4px] overflow-hidden bg-bg-page">
            <div style={{ background: "var(--deepblue-color-primary-500)", padding: "12px 24px" }}>
              <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 20, lineHeight: "28px", color: "var(--button-primary-btn-primary-text)" }}>
                Form Details
              </p>
            </div>
            <div className="flex flex-col" style={{ padding: 24, gap: 0 }}>
              <div className="flex items-start" style={{ gap: 40 }}>
                <div className="flex flex-col flex-1 min-w-0" style={{ gap: 8 }}>
                  <p style={sectionLabel}>Form Name</p>
                  <p style={bodyText}>{label}</p>
                </div>
                <div className="flex flex-col flex-1 min-w-0" style={{ gap: 8 }}>
                  <p style={sectionLabel}>Form Type</p>
                  <PlaceholderLines count={1} />
                </div>
              </div>

              <Divider />

              <div className="flex flex-col" style={{ gap: 8 }}>
                <p style={sectionLabel}>Applicable Test Codes</p>
                <PlaceholderLines count={3} />
              </div>

              <Divider />

              <div className="flex flex-col" style={{ gap: 8 }}>
                <p style={sectionLabel}>Associated Consents</p>
                <PlaceholderLines count={2} />
              </div>

              <Divider />

              <div className="flex flex-col" style={{ gap: 8 }}>
                <p style={sectionLabel}>Distribution</p>
                <PlaceholderLines count={2} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
