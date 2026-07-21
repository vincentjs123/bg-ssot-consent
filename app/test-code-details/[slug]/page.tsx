"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CaretLeft, Wrench } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";

export default function TestCodeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const label = decodeURIComponent(slug ?? "");

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="test-codes" />

      <main className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ padding: "32px 64px 64px", gap: 32 }}>
        <Link
          href="/consents"
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
          style={{ fontSize: 14, lineHeight: "20px", fontFamily: "var(--font-barlow), sans-serif" }}
        >
          <CaretLeft size={14} />
          Home
        </Link>

        <div className="flex flex-col items-center justify-center" style={{ gap: 24, paddingTop: 80, paddingBottom: 80 }}>
          <div
            className="flex items-center justify-center rounded-full bg-bg-body"
            style={{ width: 80, height: 80 }}
          >
            <Wrench size={36} style={{ color: "var(--text-text-muted)" }} />
          </div>

          <div className="flex flex-col items-center" style={{ gap: 8 }}>
            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 600,
                fontSize: 24,
                lineHeight: "32px",
                color: "var(--text-text-primary)",
              }}
            >
              Test Code Detail
            </p>
            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "var(--text-text-secondary)",
              }}
            >
              {label}
            </p>
          </div>

          <div
            className="flex items-center justify-center rounded-[4px] bg-bg-body border border-border-subtle"
            style={{ padding: "12px 20px" }}
          >
            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "20px",
                color: "var(--text-text-muted)",
              }}
            >
              This screen is under construction. A design is coming soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
