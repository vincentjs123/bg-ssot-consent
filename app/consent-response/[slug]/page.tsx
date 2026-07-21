"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CaretLeft, Browser, Files, Notebook, PlugsConnected } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { CKR_ITEMS, type CKRItem } from "@/lib/consent-content";

// ─── Types ────────────────────────────────────────────────────────────────────

type DistributionChannel = "Stand-alone Document" | "Test Requisition Forms" | "Ordering Portal" | "3rd Party Platforms";

// ─── Constants ────────────────────────────────────────────────────────────────

const SHARED_DISTRIBUTION: DistributionChannel[] = ["Stand-alone Document", "Ordering Portal", "Test Requisition Forms"];

const ALL_CHANNELS: DistributionChannel[] = [
  "Stand-alone Document",
  "Test Requisition Forms",
  "Ordering Portal",
  "3rd Party Platforms",
];

const CHANNEL_ICONS: Record<DistributionChannel, React.ReactNode> = {
  "Stand-alone Document": <Notebook size={36} weight="regular" />,
  "Test Requisition Forms": <Files size={36} weight="regular" />,
  "Ordering Portal": <Browser size={36} weight="regular" />,
  "3rd Party Platforms": <PlugsConnected size={36} weight="regular" />,
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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

const radioLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 600,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ height: 1, background: "var(--borders-border-subtle)", margin: "24px 0" }} />;
}

function DistributionRow({ channel, active }: { channel: DistributionChannel; active: boolean }) {
  return (
    <div className="flex items-center shrink-0" style={{ gap: 4, width: 230, opacity: active ? 1 : 0.5 }}>
      <span className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, color: "var(--button-ghost-btn-ghost-text)" }}>
        {CHANNEL_ICONS[channel]}
      </span>
      <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--text-text-primary)", whiteSpace: "nowrap" }}>
        {channel}
      </span>
    </div>
  );
}

const PLAIN_PREFIXES = [
  "There are", "Based on", "Reporting can", "Most people",
  "• Primary", "• Additional", "Note:", "The following",
  "By submitting", "By checking", "Samples from", "Variants in",
  "I would like", "Maternal cell", "In addition", "Only Baylor",
  "If this testing", "The ordering", "Testing may",
  "A genetic test", "One or more", "Proband-",
];

function renderLanguageLine(text: string, key: string | number): React.ReactNode | null {
  const t = text.trim();
  if (!t) return null;
  if (PLAIN_PREFIXES.some((p) => t.startsWith(p))) {
    return <p key={key} style={bodyText}>{t}</p>;
  }
  const m1 = t.match(/^([^:]{1,90}): (.+)/s);
  if (m1) {
    return (
      <p key={key} style={bodyText}>
        <span style={{ fontWeight: 500 }}>{m1[1]}:</span>{" "}{m1[2]}
      </p>
    );
  }
  const m2 = t.match(/^([^:]{1,90}):$/);
  if (m2) {
    return <p key={key} style={bodyText}><span style={{ fontWeight: 500 }}>{m2[1]}:</span></p>;
  }
  return <p key={key} style={bodyText}>{t}</p>;
}

function renderLanguage(text: string): React.ReactNode {
  const paragraphs = text.split("\n\n");
  const els: React.ReactNode[] = [];
  paragraphs.forEach((para, i) => {
    para.split("\n").forEach((line, j) => {
      const el = renderLanguageLine(line, `${i}-${j}`);
      if (el) els.push(el);
    });
    if (i < paragraphs.length - 1) {
      els.push(<p key={`sp-${i}`} aria-hidden style={{ ...bodyText, color: "transparent" }}>&nbsp;</p>);
    }
  });
  return <>{els}</>;
}

function RadioDisplay({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, opacity: 0.45 }}>
        <circle cx="10" cy="10" r="9" stroke="var(--borders-border-strong)" strokeWidth="1.5" fill="var(--bg-bg-page)" />
        {checked && (
          <>
            <circle cx="10" cy="10" r="9" fill="var(--text-text-primary)" stroke="var(--text-text-primary)" strokeWidth="1.5" />
            <path d="M6 10L8.5 12.5L14 7" stroke="var(--bg-bg-page)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <span style={{ ...bodyText, color: "var(--text-text-secondary)" }}>{label}</span>
    </div>
  );
}

// ─── Detail Content ───────────────────────────────────────────────────────────

function CKRDetail({ item }: { item: CKRItem }) {
  return (
    <div className="flex flex-col border border-border-subtle rounded-[4px] overflow-hidden" style={{ alignSelf: "start" }}>
      <div style={{ background: "var(--button-secondary-btn-secondary-bg-active)", padding: "8px 12px", minHeight: 88, display: "flex", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 28, lineHeight: "36px", letterSpacing: "-0.14px", color: "var(--button-primary-btn-primary-text)" }}>
          {item.title}
        </p>
      </div>

      <div className="flex flex-col bg-bg-page" style={{ padding: 24 }}>
        {/* Status */}
        <div className="flex flex-col" style={{ gap: 8 }}>
          <p style={sectionLabel}>Status</p>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 600,
              fontSize: 14,
              lineHeight: "20px",
              border: "1px solid var(--borders-border-primary)",
              borderRadius: 40,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 4,
              paddingBottom: 4,
              whiteSpace: "nowrap",
              background: "var(--button-success-btn-success-bg)",
              color: "var(--button-primary-btn-primary-text)",
            }}>Live</span>
            <span style={{ ...bodyText, fontSize: 14, whiteSpace: "pre" }}>Version 2.0  |  TBD</span>
          </div>
        </div>

        {/* Consent Language */}
        <div><Divider />
          <div className="flex flex-col" style={{ gap: 8 }}>
            <p style={sectionLabel}>Consent Language</p>
            <div className="flex flex-col">{renderLanguage(item.portal)}</div>
          </div>
        </div>

        {/* Responses */}
        <div><Divider />
          <div className="flex flex-col" style={{ gap: 12 }}>
            <p style={sectionLabel}>Responses</p>
            <div className="flex items-start w-full" style={{ gap: 24 }}>
              <div className="flex flex-col" style={{ gap: 8, flex: 1, minWidth: 0 }}>
                <p style={radioLabelStyle}>Options &amp; Default</p>
                {item.defaultResponse === "required" ? (
                  <p style={bodyText}>Required (no opt-in/opt-out)</p>
                ) : (
                  <>
                    <RadioDisplay checked={item.defaultResponse === "opt-in"} label="Opt-in" />
                    <RadioDisplay checked={item.defaultResponse === "opt-out"} label="Opt-out" />
                  </>
                )}
              </div>
              <div className="flex flex-col" style={{ gap: 8, flex: 1, minWidth: 0 }}>
                <p style={radioLabelStyle}>Data Location</p>
                <p style={bodyText}>[Name-of-Database]</p>
                <p style={bodyText}>[Specific Field or Column Name]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Codes + TRFs + 3rd Party */}
        <div><Divider />
          <div className="flex items-start w-full" style={{ gap: 24 }}>
            <div className="flex flex-col flex-1 min-w-0" style={{ gap: 8 }}>
              <p style={sectionLabel}>Test Codes</p>
              {item.testCodes.split("\n\n").map((block, i) => (
                <p key={i} style={bodyText}>{block}</p>
              ))}
            </div>
            <div className="flex flex-col flex-1 min-w-0" style={{ gap: 16 }}>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <p style={sectionLabel}>TRFs</p>
                {item.trfs.map((t, i) => <p key={i} style={bodyText}>{t}</p>)}
              </div>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <p style={sectionLabel}>3rd Party Platforms</p>
                <p style={bodyText}>None</p>
              </div>
            </div>
          </div>
        </div>

        {/* Published To */}
        <div><Divider />
          <div className="flex flex-col" style={{ gap: 8 }}>
            <p style={sectionLabel}>Published To</p>
            <div className="flex flex-wrap" style={{ gap: "16px 24px" }}>
              {ALL_CHANNELS.map((ch) => (
                <DistributionRow key={ch} channel={ch} active={SHARED_DISTRIBUTION.includes(ch)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsentResponseSlugPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const item = CKR_ITEMS.find((i) => i.slug === slug);

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-page">
        <AppHeader domain="consents" activeTab="consents" />
        <main className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 64, paddingLeft: 64 }}>
          <p style={bodyText}>Consent with responses not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" />

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 64, paddingLeft: 64, paddingRight: 64, gap: 32 }}>

          {/* Breadcrumb */}
          <Link href="/consents" className="flex items-center" style={{ gap: 4 }}>
            <CaretLeft size={14} weight="bold" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "var(--button-ghost-btn-ghost-text)" }}>
              Home
            </span>
          </Link>

          {/* Page header */}
          <div className="flex flex-col w-full" style={{ gap: 8 }}>
            <div className="flex">
              <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontSize: 14, lineHeight: "18px", textTransform: "uppercase", color: "var(--text-text-primary)", background: "var(--tag-tag-default-bg)", borderRadius: 24, padding: "8px 12px", whiteSpace: "nowrap" }}>
                Consent with Response
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 28, lineHeight: "36px", letterSpacing: "-0.14px", color: "var(--text-text-primary)" }}>
              {item.title}
            </p>
          </div>

          {/* Detail card — single column */}
          <CKRDetail item={item} />

        </div>
      </main>
    </div>
  );
}
