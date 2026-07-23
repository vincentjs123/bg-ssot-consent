"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CaretLeft, Browser, Files, Notebook, PlugsConnected, X, DotsThreeVertical, Sliders } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRole } from "@/lib/useRole";
import { canManage } from "@/lib/role";
import {
  CATEGORY_META,
  CATEGORY_SECTION_CARDS,
  CKR_ITEMS,
  CKR_FOR_CONSENT,
  LOREM_GAP,
  type CategorySectionCard,
  type CKRItem,
} from "@/lib/consent-content";
import { LinkedTestCodes, LinkedTRFs } from "@/components/ConsentCardLinks";

// ─── Types ────────────────────────────────────────────────────────────────────

type DistributionChannel = "Stand-alone Document" | "Test Requisition Forms" | "Ordering Portal" | "3rd Party Platforms";
type CardStatus = "Live" | "Pending";
type StatusFilter = CardStatus | "Archived";

interface VisibleSections {
  distribution: boolean;
  consentLanguage: boolean;
  correspondingTRFs: boolean;
  testCodes: boolean;
  thirdPartyPlatforms: boolean;
}

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

const DETAIL_SECTIONS: { key: keyof VisibleSections; label: string }[] = [
  { key: "consentLanguage", label: "Consent Language" },
  { key: "correspondingTRFs", label: "TRFs" },
  { key: "testCodes", label: "Test Codes" },
  { key: "thirdPartyPlatforms", label: "3rd Party Platforms" },
  { key: "distribution", label: "Published To" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "Live", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Archived", label: "Archived" },
];

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

// ─── Shared helpers ───────────────────────────────────────────────────────────

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

const statusChipStyle = (status: CardStatus): React.CSSProperties => ({
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
  background: status === "Live" ? "var(--button-success-btn-success-bg)" : "var(--button-caution-btn-caution-bg)",
  color: status === "Live" ? "var(--button-primary-btn-primary-text)" : "var(--text-text-primary)",
});

// ─── Actions Menu ─────────────────────────────────────────────────────────────

function ActionsMenu({ showEdit, name, onOpenChange }: { showEdit: boolean; name: string; onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (v: boolean) => { setOpen(v); onOpenChange(v); };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) toggle(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = showEdit
    ? ["Edit", "View History", "Archive", "Duplicate"]
    : ["View History", "Archive"];

  return (
    <div className="relative flex items-center" style={{ gap: 4 }} ref={ref}>
      <span style={sectionLabel}>Actions</span>
      <button
        className="flex items-center justify-center"
        style={{ width: 24, height: 24 }}
        onClick={() => toggle(!open)}
      >
        <DotsThreeVertical size={20} weight="bold" className="text-text-primary" />
      </button>
      {open && (
        <div className="bg-bg-page border border-border-subtle shadow-dropdown" style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, borderRadius: 4, zIndex: 50, minWidth: 160, padding: "4px 0" }}>
          {items.map((item) => (
            <Link
              key={item}
              href={item === "Edit" ? `/edit-consent?name=${encodeURIComponent(name)}` : item === "View History" ? "/consent-version-history" : "#"}
              onClick={() => toggle(false)}
              className="flex items-center w-full hover:bg-bg-body"
              style={{ padding: "10px 16px", ...bodyText, textDecoration: "none", fontSize: 14 }}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  card: CategorySectionCard;
  visibleSections: VisibleSections;
  visibleChannels: Set<DistributionChannel>;
  showEdit: boolean;
}

function SectionCardComponent({ card, visibleSections, visibleChannels, showEdit }: SectionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shownChannels = ALL_CHANNELS.filter((ch) => visibleChannels.has(ch));

  const consentLanguageNode = visibleSections.consentLanguage ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>Consent Language</p>
      {card.isGap ? (
        <p style={{ ...bodyText, color: "var(--bg-ssot-gap-indicator)", fontStyle: "italic" }}>{LOREM_GAP}</p>
      ) : (
        <div className="flex flex-col">{renderLanguage(card.portal)}</div>
      )}
    </div>
  ) : null;

  const testCodesNode = visibleSections.testCodes ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>Test Codes</p>
      <LinkedTestCodes value={card.testCodes} />
    </div>
  ) : null;

  const trfsNode = visibleSections.correspondingTRFs ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>TRFs</p>
      <LinkedTRFs trfs={card.trfs} />
    </div>
  ) : null;

  const thirdPartyNode = visibleSections.thirdPartyPlatforms ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>3rd Party Platforms</p>
      <p style={bodyText}>None</p>
    </div>
  ) : null;

  const publishedToNode = visibleSections.distribution && shownChannels.length > 0 ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>Published To</p>
      <div className="flex flex-wrap" style={{ gap: "16px 24px" }}>
        {shownChannels.map((ch) => (
          <DistributionRow key={ch} channel={ch} active={SHARED_DISTRIBUTION.includes(ch)} />
        ))}
      </div>
    </div>
  ) : null;

  const hasMiddle = testCodesNode || trfsNode || thirdPartyNode;

  return (
    <div className="flex flex-col border border-border-subtle rounded-[4px]" style={{ alignSelf: "start", position: "relative", zIndex: menuOpen ? 10 : 0 }}>
      <div style={{ background: "var(--deepblue-color-primary-500)", padding: "8px 12px", minHeight: 88, display: "flex", alignItems: "center", borderRadius: "4px 4px 0 0" }}>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 28, lineHeight: "36px", letterSpacing: "-0.14px", color: "var(--button-primary-btn-primary-text)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {card.sectionName}
        </p>
      </div>

      <div className="flex flex-col bg-bg-page" style={{ padding: 24 }}>
        <div className="flex flex-col" style={{ gap: 8 }}>
          <div className="flex items-center justify-between w-full">
            <p style={sectionLabel}>Status</p>
            <ActionsMenu showEdit={showEdit} name={card.sectionName} onOpenChange={setMenuOpen} />
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span style={statusChipStyle("Live")}>Live</span>
            <span style={{ ...bodyText, fontSize: 14, whiteSpace: "pre" }}>Version 2.0  |  TBD</span>
          </div>
        </div>

        {consentLanguageNode && <div><Divider />{consentLanguageNode}</div>}

        {hasMiddle && (
          <div>
            <Divider />
            <div className="flex items-start w-full" style={{ gap: 24 }}>
              {testCodesNode && <div className="flex-1 min-w-0">{testCodesNode}</div>}
              {(trfsNode || thirdPartyNode) && (
                <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 16 }}>
                  {trfsNode}
                  {thirdPartyNode}
                </div>
              )}
            </div>
          </div>
        )}

        {publishedToNode && <div><Divider />{publishedToNode}</div>}
      </div>
    </div>
  );
}

// ─── CKR Card ─────────────────────────────────────────────────────────────────

interface CKRCardProps {
  item: CKRItem;
  visibleSections: VisibleSections;
  visibleChannels: Set<DistributionChannel>;
  showEdit: boolean;
}

function CKRCardComponent({ item, visibleSections, visibleChannels, showEdit }: CKRCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shownChannels = ALL_CHANNELS.filter((ch) => visibleChannels.has(ch));

  const consentLanguageNode = visibleSections.consentLanguage ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>Consent Language</p>
      <div className="flex flex-col">{renderLanguage(item.portal)}</div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col border border-border-subtle rounded-[4px]" style={{ alignSelf: "start", position: "relative", zIndex: menuOpen ? 10 : 0 }}>
      <div style={{ background: `var(--button-secondary-btn-secondary-bg-active)`, padding: "8px 12px", minHeight: 88, display: "flex", alignItems: "center", borderRadius: "4px 4px 0 0" }}>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 28, lineHeight: "36px", letterSpacing: "-0.14px", color: "var(--button-primary-btn-primary-text)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {item.title}
        </p>
      </div>

      <div className="flex flex-col bg-bg-page" style={{ padding: 24 }}>
        <div className="flex flex-col" style={{ gap: 8 }}>
          <div className="flex items-center justify-between w-full">
            <p style={sectionLabel}>Status</p>
            <ActionsMenu showEdit={showEdit} name={item.title} onOpenChange={setMenuOpen} />
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span style={statusChipStyle("Live")}>Live</span>
            <span style={{ ...bodyText, fontSize: 14, whiteSpace: "pre" }}>Version 2.0  |  TBD</span>
          </div>
        </div>

        {consentLanguageNode && <div><Divider />{consentLanguageNode}</div>}

        {(visibleSections.testCodes || visibleSections.correspondingTRFs || visibleSections.thirdPartyPlatforms) && (
          <div>
            <Divider />
            <div className="flex items-start w-full" style={{ gap: 24 }}>
              {visibleSections.testCodes && (
                <div className="flex flex-col flex-1 min-w-0" style={{ gap: 8 }}>
                  <p style={sectionLabel}>Test Codes</p>
                  <LinkedTestCodes value={item.testCodes} />
                </div>
              )}
              {(visibleSections.correspondingTRFs || visibleSections.thirdPartyPlatforms) && (
                <div className="flex flex-col flex-1 min-w-0" style={{ gap: 16 }}>
                  {visibleSections.correspondingTRFs && (
                    <div className="flex flex-col" style={{ gap: 8 }}>
                      <p style={sectionLabel}>TRFs</p>
                      <LinkedTRFs trfs={item.trfs} />
                    </div>
                  )}
                  {visibleSections.thirdPartyPlatforms && (
                    <div className="flex flex-col" style={{ gap: 8 }}>
                      <p style={sectionLabel}>3rd Party Platforms</p>
                      <p style={bodyText}>None</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {visibleSections.distribution && shownChannels.length > 0 && (
          <div>
            <Divider />
            <div className="flex flex-col" style={{ gap: 8 }}>
              <p style={sectionLabel}>Published To</p>
              <div className="flex flex-wrap" style={{ gap: "16px 24px" }}>
                {shownChannels.map((ch) => (
                  <DistributionRow key={ch} channel={ch} active={SHARED_DISTRIBUTION.includes(ch)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Customize View Panel ─────────────────────────────────────────────────────

interface CustomizeViewProps {
  allSectionNames: string[];
  allCKRTitles: string[];
  visibleSectionCards: Set<string>;
  setVisibleSectionCards: (v: Set<string>) => void;
  visibleConsentsWithResponses: Set<string>;
  setVisibleConsentsWithResponses: (v: Set<string>) => void;
  visibleSections: VisibleSections;
  setVisibleSections: (v: VisibleSections) => void;
  visibleChannels: Set<DistributionChannel>;
  setVisibleChannels: (v: Set<DistributionChannel>) => void;
  visibleStatuses: Set<StatusFilter>;
  setVisibleStatuses: (v: Set<StatusFilter>) => void;
  activeStatuses: Set<StatusFilter>;
  onClose: () => void;
  onReset: () => void;
}

function CheckRow({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button className="flex items-start text-left w-full" style={{ gap: 12, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.38 : 1 }} onClick={() => !disabled && onChange()}>
      <div
        className="shrink-0 rounded-[2px] flex items-center justify-center"
        style={{ width: 24, height: 24, marginTop: 0, backgroundColor: checked && !disabled ? "var(--button-primary-btn-primary-bg)" : "transparent", border: checked && !disabled ? "none" : "1px solid var(--borders-border-strong)", padding: checked && !disabled ? 2 : 0 }}
      >
        {checked && !disabled && (
          <svg viewBox="0 0 20 16" fill="none" style={{ width: "100%", height: "100%" }}>
            <path d="M1.5 8L7.5 14L18.5 2" stroke="var(--button-primary-btn-primary-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--text-text-primary)" }}>
        {label}
      </span>
    </button>
  );
}

function PanelColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <div className="flex flex-col" style={{ gap: 4 }}>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 20, lineHeight: "28px", color: "var(--text-text-primary)", whiteSpace: "nowrap" }}>{title}</p>
        <div style={{ height: 1, background: "var(--borders-border-subtle)" }} />
      </div>
      <div className="flex flex-col" style={{ gap: 16 }}>{children}</div>
    </div>
  );
}

function CustomizeViewPanel({
  allSectionNames,
  allCKRTitles,
  visibleSectionCards, setVisibleSectionCards,
  visibleConsentsWithResponses, setVisibleConsentsWithResponses,
  visibleSections, setVisibleSections,
  visibleChannels, setVisibleChannels,
  visibleStatuses, setVisibleStatuses,
  activeStatuses,
  onClose, onReset,
}: CustomizeViewProps) {
  function toggle<T extends string>(set: Set<T>, setFn: (v: Set<T>) => void, val: T) {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setFn(next);
  }

  function toggleSection(key: keyof VisibleSections) {
    setVisibleSections({ ...visibleSections, [key]: !visibleSections[key] });
  }

  return (
    <div style={{ width: "100%", background: "var(--bg-bg-page)", border: "1px solid var(--borders-border-subtle)", borderRadius: 4, padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="flex items-center w-full">
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 24, lineHeight: "32px", color: "var(--text-text-primary)", flex: 1 }}>Customize View</p>
        <button onClick={onClose} className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24 }}>
          <X size={20} className="text-text-primary" />
        </button>
      </div>

      <PanelColumn title="Consent Sections">
        {allSectionNames.map((name) => (
          <CheckRow key={name} label={name} checked={visibleSectionCards.has(name)} onChange={() => toggle(visibleSectionCards, setVisibleSectionCards, name)} />
        ))}
      </PanelColumn>

      <PanelColumn title="Consents with Responses">
        {allCKRTitles.map((name) => (
          <CheckRow key={name} label={name} checked={visibleConsentsWithResponses.has(name)} onChange={() => toggle(visibleConsentsWithResponses, setVisibleConsentsWithResponses, name)} />
        ))}
      </PanelColumn>

      <PanelColumn title="Consent Details">
        {DETAIL_SECTIONS.map(({ key, label }) => (
          <CheckRow key={key} label={label} checked={visibleSections[key]} onChange={() => toggleSection(key)} />
        ))}
      </PanelColumn>

      <PanelColumn title="Status">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <CheckRow key={value} label={label} checked={visibleStatuses.has(value)} onChange={() => toggle(visibleStatuses, setVisibleStatuses, value)} disabled={!activeStatuses.has(value)} />
        ))}
      </PanelColumn>

      <div className="flex items-center justify-end w-full" style={{ gap: 16 }}>
        <button onClick={onReset} className="flex items-center justify-center rounded-[4px]" style={{ height: 36, paddingLeft: 16, paddingRight: 16, border: "1px solid var(--text-text-primary)", background: "var(--bg-bg-page)" }}>
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "var(--text-text-primary)" }}>Reset All</span>
        </button>
        <button onClick={onClose} className="flex items-center justify-center bg-btn-primary-bg rounded-[4px]" style={{ height: 36, paddingLeft: 16, paddingRight: 16 }}>
          <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "24px" }}>Close</span>
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsentCategorySlugPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const role = useRole();
  const showEdit = role === null ? true : canManage(role);

  const meta = CATEGORY_META[slug];
  const sectionCards = CATEGORY_SECTION_CARDS[slug] ?? [];
  const sectionNames = sectionCards.map((c) => c.sectionName);
  const applicableCKRTitles = CKR_FOR_CONSENT[slug] ?? [];
  const ckrCards = CKR_ITEMS.filter((item) => applicableCKRTitles.includes(item.title));

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [visibleSectionCards, setVisibleSectionCards] = useState<Set<string>>(new Set(sectionNames));
  const [visibleConsentsWithResponses, setVisibleConsentsWithResponses] = useState<Set<string>>(new Set(applicableCKRTitles));
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    distribution: true,
    consentLanguage: true,
    correspondingTRFs: true,
    testCodes: true,
    thirdPartyPlatforms: true,
  });
  const [visibleChannels, setVisibleChannels] = useState<Set<DistributionChannel>>(new Set(ALL_CHANNELS));
  const [visibleStatuses, setVisibleStatuses] = useState<Set<StatusFilter>>(new Set<StatusFilter>(["Live", "Pending"]));

  const visibleSectionCardsList = sectionCards.filter((c) => visibleSectionCards.has(c.sectionName));
  const visibleCKRCards = ckrCards.filter((c) => visibleConsentsWithResponses.has(c.title));
  const totalVisible = visibleSectionCardsList.length + visibleCKRCards.length;
  const totalAll = sectionCards.length + ckrCards.length;

  if (!meta) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-page">
        <AppHeader domain="consents" activeTab="consents" />
        <main className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 64, paddingLeft: 64 }}>
          <p style={bodyText}>Stand-alone consent not found.</p>
        </main>
      </div>
    );
  }

  // All cards interleaved: section cards first, then CKR cards
  const allVisibleCards: Array<{ type: "section"; card: CategorySectionCard } | { type: "ckr"; card: CKRItem }> = [
    ...visibleSectionCardsList.map((card) => ({ type: "section" as const, card })),
    ...visibleCKRCards.map((card) => ({ type: "ckr" as const, card })),
  ];

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
                {meta.chip}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 28, lineHeight: "36px", letterSpacing: "-0.14px", color: "var(--text-text-primary)" }}>
              {meta.name}
            </p>
            <div className="flex items-center justify-between w-full" style={{ gap: 16 }}>
              <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--text-text-primary)" }}>
                {meta.description}
              </p>
              <div className="flex items-center shrink-0" style={{ gap: 24 }}>
                <div className="flex items-center" style={{ gap: 6 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, borderRadius: 9999, background: "var(--tag-tag-default-bg)", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--text-text-primary)", padding: "0 6px" }}>{totalVisible}</span>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 15, lineHeight: "20px", color: "var(--text-text-primary)" }}>of</span>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, borderRadius: 9999, background: "var(--tag-tag-default-bg)", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--text-text-primary)", padding: "0 6px" }}>{totalAll}</span>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 15, lineHeight: "20px", color: "var(--text-text-primary)" }}>Records</span>
                </div>
                <button
                  onClick={() => setCustomizeOpen((v) => !v)}
                  className="flex items-center shrink-0 border border-border-subtle rounded-[4px] bg-bg-page hover:bg-bg-body"
                  style={{ gap: 8, height: 40, paddingLeft: 16, paddingRight: 16 }}
                >
                  <Sliders size={16} className="text-text-primary" />
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 15, lineHeight: "20px", color: "var(--text-text-primary)", whiteSpace: "nowrap" }}>Customize View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Left column + card grid */}
          <div className="flex items-start w-full" style={{ gap: customizeOpen ? 32 : 0 }}>
            <div style={{ flexShrink: 0, width: customizeOpen ? 304 : 0, overflow: "hidden", transition: "width 280ms ease" }}>
              <div style={{ width: 304 }}>
                <CustomizeViewPanel
                  allSectionNames={sectionNames}
                  allCKRTitles={applicableCKRTitles}
                  visibleSectionCards={visibleSectionCards}
                  setVisibleSectionCards={setVisibleSectionCards}
                  visibleConsentsWithResponses={visibleConsentsWithResponses}
                  setVisibleConsentsWithResponses={setVisibleConsentsWithResponses}
                  visibleSections={visibleSections}
                  setVisibleSections={setVisibleSections}
                  visibleChannels={visibleChannels}
                  setVisibleChannels={setVisibleChannels}
                  visibleStatuses={visibleStatuses}
                  setVisibleStatuses={setVisibleStatuses}
                  activeStatuses={new Set<StatusFilter>(["Live"])}
                  onClose={() => setCustomizeOpen(false)}
                  onReset={() => {
                    setVisibleSectionCards(new Set(sectionNames));
                    setVisibleConsentsWithResponses(new Set(applicableCKRTitles));
                    setVisibleSections({ distribution: true, consentLanguage: true, correspondingTRFs: true, testCodes: true, thirdPartyPlatforms: true });
                    setVisibleChannels(new Set(ALL_CHANNELS));
                    setVisibleStatuses(new Set<StatusFilter>(["Live", "Pending"]));
                  }}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="grid w-full" style={{ gridTemplateColumns: allVisibleCards.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: 24, alignItems: "start" }}>
                {allVisibleCards.length > 0 ? allVisibleCards.map((item, i) =>
                  item.type === "section" ? (
                    <SectionCardComponent
                      key={`sec-${i}`}
                      card={item.card}
                      visibleSections={visibleSections}
                      visibleChannels={visibleChannels}
                      showEdit={showEdit}
                    />
                  ) : (
                    <CKRCardComponent
                      key={`ckr-${i}`}
                      item={item.card}
                      visibleSections={visibleSections}
                      visibleChannels={visibleChannels}
                      showEdit={showEdit}
                    />
                  )
                ) : (
                  <div className="col-span-2 flex items-center justify-center" style={{ paddingTop: 60 }}>
                    <p style={{ ...bodyText, color: "var(--text-text-secondary)" }}>
                      No sections match the current filter. Adjust your Customize View settings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
