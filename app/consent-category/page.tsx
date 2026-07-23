"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CaretLeft, Browser, Files, Notebook, PlugsConnected, X, DotsThreeVertical, Sliders } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRole } from "@/lib/useRole";
import { canManage } from "@/lib/role";
import { LinkedTestCodes, LinkedTRFs } from "@/components/ConsentCardLinks";

// ─── Types ────────────────────────────────────────────────────────────────────

type DistributionChannel = "Stand-alone Document" | "Test Requisition Forms" | "Ordering Portal" | "3rd Party Platforms";
type CardStatus = "Live" | "Pending";

interface ConsentCard {
  id: string;
  consentName: string;
  status: CardStatus;
  version: string;
  distribution: DistributionChannel[];
  consentLanguage: string[];
  correspondingTRFs: string[];
  testCodes: string;
  thirdPartyPlatforms: string;
}

interface VisibleSections {
  distribution: boolean;
  consentLanguage: boolean;
  correspondingTRFs: boolean;
  testCodes: boolean;
  thirdPartyPlatforms: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WGS_TEST_CODES = "1500, 1603, 1600, 1604, 1550, 1551, 1601, 1602, 1605, 1729, 1723, 1722, 1724, 1900, 1810, 1803, 1800, 1804, 1850, 1829, 1823, 1822, 1824, 1897, 60061, 8981, 60071, 1520, 1622, 1623, 1842, 1843, 1844, 1845";

const WGS_TRFS = [
  "Additional Affected Sibling for Trio",
  "Adult Screening Exome",
  "Additional Testing Req",
  "Whole Genome Sequencing",
  "Whole Exome Sequencing Reanalysis",
  "Whole Exome Sequencing",
  "Sequential Trio Whole Exome Sequencing",
  "Prenatal Trio Whole Exome Sequencing- Prenatal Consent",
  "Prenatal WGS- Prenatal Consent",
];

const WGS_LANGUAGE = [
  "There are several types of test results that may be found including:",
  "Positive: A variant in the DNA was found that is related to your health issues or a health issue that you are at an increased risk of having in the future. These changes that cause disease are also known as pathogenic variants.",
  "Negative: No variants in the DNA were found that are related to your health issues or that would increase your risk of a health issue in the future.",
  "Variant of Uncertain Clinical Significance (VUS): A variant in the DNA was found that we do not know its effect, if any, on health. More testing may be needed for you or your family if a VUS is found that may be associated with your health issues.",
  "Secondary and Incidental Findings (Optional): Testing can sometimes find a variant in the DNA not related to the reason for testing but can change your medical care.\nNote: Certain issues within the brain start in adulthood and get worse over time (neurodegenerative). They often have no cure or treatment. By default, these variants will not be reported unless they are related to your health issues.",
  "Genes of No Known Disease Association (Optional): Testing may find a variant in a gene that is not known to cause disease. This may be helpful to learn more about these genes in the future.",
];

const ALL_CARDS: ConsentCard[] = [
  {
    id: "wes-wgs-live",
    consentName: "Informed Consent for WES and WGS",
    status: "Live",
    version: "Version 2.1  |  04.15.2024",
    distribution: ["Stand-alone Document", "Test Requisition Forms", "Ordering Portal"],
    consentLanguage: WGS_LANGUAGE,
    correspondingTRFs: WGS_TRFS,
    testCodes: WGS_TEST_CODES,
    thirdPartyPlatforms: "None",
  },
  {
    id: "wes-wgs-pending",
    consentName: "Informed Consent for WES and WGS",
    status: "Pending",
    version: "Version 2.2  TBD",
    distribution: ["Stand-alone Document", "Test Requisition Forms", "Ordering Portal"],
    consentLanguage: WGS_LANGUAGE,
    correspondingTRFs: WGS_TRFS,
    testCodes: WGS_TEST_CODES,
    thirdPartyPlatforms: "None",
  },
  {
    id: "prenatal-live",
    consentName: "Prenatal WGS/WES Consent",
    status: "Live",
    version: "Version 2.1  |  04.15.2024",
    distribution: ["Stand-alone Document", "Test Requisition Forms", "Ordering Portal"],
    consentLanguage: WGS_LANGUAGE,
    correspondingTRFs: [
      "Prenatal Trio Whole Exome Sequencing- Prenatal Consent",
      "Prenatal WGS- Prenatal Consent",
    ],
    testCodes: WGS_TEST_CODES,
    thirdPartyPlatforms: "None",
  },
  {
    id: "general-live",
    consentName: "General Genetic Testing Consent",
    status: "Live",
    version: "Version 2.1  03.30.2024",
    distribution: ["Stand-alone Document", "Test Requisition Forms", "Ordering Portal"],
    consentLanguage: [
      "There are several types of test results that may be reported including:",
      "Positive: A variant in the DNA was found that is related to your health issues or a health issue that you are at an increased risk of having in the future.",
      "Negative: No variants in the DNA were found that are related to your health issues or that would increase your risk of a health issue in the future.",
      "Variant of Uncertain Clinical Significance (VUS): A variant in the DNA was found that we do not know its effect, if any, on health.",
      "Secondary and Incidental Findings: Testing can sometimes find a variant in the DNA not related to the reason for testing.",
    ],
    correspondingTRFs: [
      "Custom Family Sequencing", "Custom Proband Sequencing", "Autism Testing",
      "Cytogenetics", "Global MAPS", "Inherited Eye Disorders", "Mitochondrial",
      "Molecular Diagnostic", "NGS Panel", "Total BluePrint Panel", "GeneAware",
      "Hereditary Cancer", "Oncology", "Cytogenetics- POC", "Prenatal Comprehensive",
      "Prenatal Chromosomal Microarray Analysis", "PreSeek",
    ],
    testCodes: "1300, BG-1300-P142-1, BG-1300-P463-1, 1522, 1560, 1580, 24001, 1390, 1593, 1594, 2090, 22100, 2300, 2625, 3135, 3143, 3348, 6006, 6031, 6034, 6036, 6050, 6350, 6351, 21200, 25000, 25001, 25002, 64000, 64005",
    thirdPartyPlatforms: "None",
  },
  {
    id: "biochem-live",
    consentName: "Biochemical Genetic Consent",
    status: "Live",
    version: "Version 2.1  |  04.15.2024",
    distribution: ["Stand-alone Document", "Test Requisition Forms", "Ordering Portal"],
    consentLanguage: [
      "There are several types of test results that may be found including:",
      "Positive: A change was found that is related to your health issues or that you have an increased chance of having a health issue in the future.",
      "Negative: No changes were found that are related to your health issues or that would increase your risk of a health issue in the future.",
    ],
    correspondingTRFs: ["Biochemical"],
    testCodes: "4000, 4100, 4130, 4150, 4160, 4175, 4200, 4240, 4250, 4260, 4300, 4310, 4330, 4536, 4555, 4569, 4627, 4650, 4651, 4900, 4901, 8501, 8550",
    thirdPartyPlatforms: "None",
  },
  {
    id: "hd-live",
    consentName: "Huntington Disease Consent",
    status: "Live",
    version: "Version 2.0  01.10.2024",
    distribution: ["Stand-alone Document", "Test Requisition Forms", "Ordering Portal"],
    consentLanguage: [
      "Most people have two copies of the HD gene, one from each parent. Each gene copy has a number of repeating sections of DNA ('CAG's). The number of CAGs are tested to see what, if any, risk for HD your patient might have.",
      "There are several types of test results that may be reported including:",
      "Negative: Both gene copies have 26 or less CAG repeats. You are not expected to be at risk for HD.",
      "Intermediate: At least one gene copy has 27-35 CAG repeats. You are not expected to be at risk for HD. However, this repeat number can get larger from you to your child.",
      "Reduced Penetrance: At least one gene copy has 36-39 CAG repeats. You may be at risk for HD. Your children could also be at risk for HD.",
      "Positive (Full Penetrance): At least one gene copy has 40 or more CAG repeats. You are expected to have or develop HD.",
    ],
    correspondingTRFs: ["None"],
    testCodes: "6034",
    thirdPartyPlatforms: "None",
  },
];

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

const ALL_CONSENT_NAMES = [...new Set(ALL_CARDS.map((c) => c.consentName))];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function DistributionRow({ channel, active }: { channel: DistributionChannel; active: boolean }) {
  return (
    <div className="flex items-center shrink-0" style={{ gap: 4, width: 230, opacity: active ? 1 : 0.5 }}>
      <span className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, color: "var(--button-ghost-btn-ghost-text)" }}>
        {CHANNEL_ICONS[channel]}
      </span>
      <span style={{
        fontFamily: "var(--font-barlow), sans-serif",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: "24px",
        color: "var(--text-text-primary)",
        whiteSpace: "nowrap",
      }}>
        {channel}
      </span>
    </div>
  );
}

const PLAIN_PREFIXES = [
  "There are", "Based on", "Reporting can", "Most people",
  "• Primary", "• Additional", "Note:",
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

function renderLanguage(paragraphs: string[]): React.ReactNode {
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
        <div
          className="bg-bg-page border border-border-subtle shadow-dropdown"
          style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, borderRadius: 4, zIndex: 50, minWidth: 160, padding: "4px 0" }}
        >
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

// ─── Consent Card ─────────────────────────────────────────────────────────────

interface CardProps {
  card: ConsentCard;
  visibleSections: VisibleSections;
  visibleChannels: Set<DistributionChannel>;
  showEdit: boolean;
  href?: string;
}

function ConsentCardComponent({ card, visibleSections, visibleChannels, showEdit, href }: CardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shownChannels = ALL_CHANNELS.filter((ch) => visibleChannels.has(ch));

  const consentLanguageNode = visibleSections.consentLanguage ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>Consent Language</p>
      <div className="flex flex-col">{renderLanguage(card.consentLanguage)}</div>
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
      <LinkedTRFs trfs={card.correspondingTRFs} />
    </div>
  ) : null;

  const thirdPartyNode = visibleSections.thirdPartyPlatforms ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>3rd Party Platforms</p>
      <p style={bodyText}>{card.thirdPartyPlatforms}</p>
    </div>
  ) : null;

  const publishedToNode = visibleSections.distribution && shownChannels.length > 0 ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>Published To</p>
      <div className="flex flex-wrap" style={{ gap: "16px 24px" }}>
        {shownChannels.map((ch) => (
          <DistributionRow key={ch} channel={ch} active={card.distribution.includes(ch)} />
        ))}
      </div>
    </div>
  ) : null;

  const hasMiddle = testCodesNode || trfsNode || thirdPartyNode;

  return (
    <div className="flex flex-col border border-border-subtle rounded-[4px]" style={{ alignSelf: "start", position: "relative", zIndex: menuOpen ? 10 : 0 }}>
      {/* Dark header */}
      <div style={{ background: "var(--deepblue-color-primary-500)", padding: "8px 12px", minHeight: 88, display: "flex", alignItems: "center", borderRadius: "4px 4px 0 0" }}>
        {href ? (
          <Link href={href} style={{ textDecoration: "none" }}>
            <p style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 300,
              fontSize: 28,
              lineHeight: "36px",
              letterSpacing: "-0.14px",
              color: "var(--button-primary-btn-primary-text)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}>
              {card.consentName}
            </p>
          </Link>
        ) : (
          <p style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: 28,
            lineHeight: "36px",
            letterSpacing: "-0.14px",
            color: "var(--button-primary-btn-primary-text)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {card.consentName}
          </p>
        )}
      </div>

      {/* Content body */}
      <div className="flex flex-col bg-bg-page" style={{ padding: 24 }}>
        {/* Status & Actions row */}
        <div className="flex flex-col" style={{ gap: 8 }}>
          <div className="flex items-center justify-between w-full">
            <p style={sectionLabel}>Status</p>
            <ActionsMenu showEdit={showEdit} name={card.consentName} onOpenChange={setMenuOpen} />
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span style={statusChipStyle(card.status)}>{card.status}</span>
            <span style={{ ...bodyText, fontSize: 14, whiteSpace: "pre" }}>{card.version}</span>
          </div>
        </div>

        {/* Consent Language — full width */}
        {consentLanguageNode && (
          <div><Divider />{consentLanguageNode}</div>
        )}

        {/* Middle — 2-column: Test Codes (left) | TRFs + 3rd Party Platforms (right) */}
        {hasMiddle && (
          <div>
            <Divider />
            <div className="flex items-start w-full" style={{ gap: 24 }}>
              {/* Left col: Test Codes */}
              {testCodesNode && (
                <div className="flex-1 min-w-0">{testCodesNode}</div>
              )}
              {/* Right col: TRFs, then 3rd Party Platforms */}
              {(trfsNode || thirdPartyNode) && (
                <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 16 }}>
                  {trfsNode}
                  {thirdPartyNode}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Published To — full width */}
        {publishedToNode && (
          <div><Divider />{publishedToNode}</div>
        )}
      </div>
    </div>
  );
}

// ─── Customize View Panel ─────────────────────────────────────────────────────

type StatusFilter = CardStatus | "Archived";

interface CustomizeViewProps {
  visibleConsents: Set<string>;
  setVisibleConsents: (v: Set<string>) => void;
  visibleConsentsWithResponses: Set<string>;
  setVisibleConsentsWithResponses: (v: Set<string>) => void;
  visibleSections: VisibleSections;
  setVisibleSections: (v: VisibleSections) => void;
  visibleChannels: Set<DistributionChannel>;
  setVisibleChannels: (v: Set<DistributionChannel>) => void;
  visibleStatuses: Set<StatusFilter>;
  setVisibleStatuses: (v: Set<StatusFilter>) => void;
  onClose: () => void;
  onReset: () => void;
}

const DETAIL_SECTIONS: { key: keyof VisibleSections; label: string }[] = [
  { key: "consentLanguage", label: "Consent Language" },
  { key: "correspondingTRFs", label: "TRFs" },
  { key: "testCodes", label: "Test Codes" },
  { key: "thirdPartyPlatforms", label: "3rd Party Platforms" },
  { key: "distribution", label: "Published To" },
];

const CONSENTS_WITH_RESPONSES_LIST = [
  "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
  "Use of Data and Specimen for Research Purposes",
  "For Samples Submitted from New York State Residents",
  "Reporting of ACMG Secondary Findings",
  "Reporting of Incidental Findings",
  "Reporting of Findings in Genes with No Known Disease Association",
  "Use of Sample for MCC studies for Surrogates",
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "Live", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Archived", label: "Archived" },
];

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button className="flex items-start text-left w-full" style={{ gap: 12 }} onClick={onChange}>
      <div
        className="shrink-0 rounded-[2px] flex items-center justify-center"
        style={{
          width: 24, height: 24, marginTop: 0,
          backgroundColor: checked ? "var(--button-primary-btn-primary-bg)" : "transparent",
          border: checked ? "none" : "1px solid var(--borders-border-strong)",
          padding: checked ? 2 : 0,
        }}
      >
        {checked && (
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
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 20, lineHeight: "28px", color: "var(--text-text-primary)", whiteSpace: "nowrap" }}>
          {title}
        </p>
        <div style={{ height: 1, background: "var(--borders-border-subtle)" }} />
      </div>
      <div className="flex flex-col" style={{ gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

function CustomizeViewPanel({ visibleConsents, setVisibleConsents, visibleConsentsWithResponses, setVisibleConsentsWithResponses, visibleSections, setVisibleSections, visibleChannels, setVisibleChannels, visibleStatuses, setVisibleStatuses, onClose, onReset }: CustomizeViewProps) {
  function toggle<T extends string>(set: Set<T>, setFn: (v: Set<T>) => void, val: T) {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setFn(next);
  }

  function toggleSection(key: keyof VisibleSections) {
    setVisibleSections({ ...visibleSections, [key]: !visibleSections[key] });
  }

  return (
    <div
      style={{
        width: "100%",
        background: "var(--bg-bg-page)",
        border: "1px solid var(--borders-border-subtle)",
        borderRadius: 4,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Header */}
      <div className="flex items-center w-full">
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: 24, lineHeight: "32px", color: "var(--text-text-primary)", flex: 1 }}>
          Customize View
        </p>
        <button onClick={onClose} className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24 }}>
          <X size={20} className="text-text-primary" />
        </button>
      </div>

      <PanelColumn title="Consent Categories">
        {ALL_CONSENT_NAMES.map((name) => (
          <CheckRow key={name} label={name} checked={visibleConsents.has(name)} onChange={() => toggle(visibleConsents, setVisibleConsents, name)} />
        ))}
      </PanelColumn>

      <PanelColumn title="Consents with Responses">
        {CONSENTS_WITH_RESPONSES_LIST.map((name) => (
          <CheckRow key={name} label={name} checked={visibleConsentsWithResponses.has(name)} onChange={() => toggle(visibleConsentsWithResponses, setVisibleConsentsWithResponses, name)} />
        ))}
      </PanelColumn>

      <PanelColumn title="Consent Details">
        {DETAIL_SECTIONS.map(({ key, label }) => (
          <CheckRow key={key} label={label} checked={visibleSections[key]} onChange={() => toggleSection(key)} />
        ))}
      </PanelColumn>

      {/* Published To — hidden, reinstate by uncommenting
      <PanelColumn title="Published To">
        {ALL_CHANNELS.map((ch) => (
          <CheckRow key={ch} label={ch === "Test Requisition Forms" ? "Test Requisition Form(s)" : ch === "3rd Party Platforms" ? "3rd Party Platform(s)" : ch} checked={visibleChannels.has(ch)} onChange={() => toggle(visibleChannels, setVisibleChannels, ch)} />
        ))}
      </PanelColumn>
      */}

      <PanelColumn title="Status">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <CheckRow key={value} label={label} checked={visibleStatuses.has(value)} onChange={() => toggle(visibleStatuses, setVisibleStatuses, value)} />
        ))}
      </PanelColumn>

      {/* Footer */}
      <div className="flex items-center justify-end w-full" style={{ gap: 16 }}>
        <button
          onClick={onReset}
          className="flex items-center justify-center rounded-[4px]"
          style={{ height: 36, paddingLeft: 16, paddingRight: 16, border: "1px solid var(--text-text-primary)", background: "var(--bg-bg-page)" }}
        >
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "var(--text-text-primary)" }}>
            Reset All
          </span>
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center bg-btn-primary-bg rounded-[4px]"
          style={{ height: 36, paddingLeft: 16, paddingRight: 16 }}
        >
          <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "24px" }}>
            Close
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsentCategoryPage() {
  const role = useRole();
  const showEdit = role === null ? true : canManage(role);

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [visibleConsents, setVisibleConsents] = useState<Set<string>>(new Set(ALL_CONSENT_NAMES));
  const [visibleConsentsWithResponses, setVisibleConsentsWithResponses] = useState<Set<string>>(new Set(CONSENTS_WITH_RESPONSES_LIST));
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    distribution: true,
    consentLanguage: true,
    correspondingTRFs: true,
    testCodes: true,
    thirdPartyPlatforms: true,
  });
  const [visibleChannels, setVisibleChannels] = useState<Set<DistributionChannel>>(
    new Set(ALL_CHANNELS)
  );
  const [visibleStatuses, setVisibleStatuses] = useState<Set<StatusFilter>>(
    new Set<StatusFilter>(["Live", "Pending"])
  );

  const visibleCards = ALL_CARDS.filter(
    (c) => visibleConsents.has(c.consentName) && visibleStatuses.has(c.status)
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" />

      <main className="flex flex-col w-full bg-bg-page">
        <div
          className="flex flex-col w-full max-w-[1280px] mx-auto"
          style={{ paddingTop: 32, paddingBottom: 64, paddingLeft: 64, paddingRight: 64, gap: 32 }}
        >
          {/* Breadcrumb */}
          <Link href="/consents" className="flex items-center" style={{ gap: 4 }}>
            <CaretLeft size={14} weight="bold" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "var(--button-ghost-btn-ghost-text)" }}>
              Home
            </span>
          </Link>

          {/* Page header block */}
          <div className="flex flex-col w-full" style={{ gap: 8 }}>
            {/* Pre-label chip */}
            <div className="flex">
              <span style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "18px",
                textTransform: "uppercase",
                color: "var(--text-text-primary)",
                background: "var(--tag-tag-default-bg)",
                borderRadius: 24,
                padding: "8px 12px",
                whiteSpace: "nowrap",
              }}>
                Consent Section
              </span>
            </div>

            {/* Title */}
            <p style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 300,
              fontSize: 28,
              lineHeight: "36px",
              letterSpacing: "-0.14px",
              color: "var(--text-text-primary)",
            }}>
              Test Reporting and Results
            </p>

            {/* Description + Customize View */}
            <div className="flex items-center justify-between w-full" style={{ gap: 16 }}>
              <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--text-text-primary)" }}>
                Explains results types — Positive, Negative, VUS — and how findings will be communicated.
              </p>
              <div className="flex items-center shrink-0" style={{ gap: 24 }}>
                {/* Records counter */}
                <div className="flex items-center" style={{ gap: 6 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: 24, height: 24, borderRadius: 9999,
                    background: "var(--tag-tag-default-bg)",
                    fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--text-text-primary)",
                    padding: "0 6px",
                  }}>
                    {visibleCards.length}
                  </span>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 15, lineHeight: "20px", color: "var(--text-text-primary)" }}>
                    of
                  </span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: 24, height: 24, borderRadius: 9999,
                    background: "var(--tag-tag-default-bg)",
                    fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--text-text-primary)",
                    padding: "0 6px",
                  }}>
                    {ALL_CARDS.length}
                  </span>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 15, lineHeight: "20px", color: "var(--text-text-primary)" }}>
                    Records
                  </span>
                </div>
              <button
                onClick={() => setCustomizeOpen((v) => !v)}
                className="flex items-center shrink-0 border border-border-subtle rounded-[4px] bg-bg-page hover:bg-bg-body"
                style={{ gap: 8, height: 40, paddingLeft: 16, paddingRight: 16 }}
              >
                <Sliders size={16} className="text-text-primary" />
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 15, lineHeight: "20px", color: "var(--text-text-primary)", whiteSpace: "nowrap" }}>
                  Customize View
                </span>
              </button>
              </div>
            </div>
          </div>

          {/* Left column + card grid */}
          <div className="flex items-start w-full" style={{ gap: customizeOpen ? 32 : 0 }}>

            {/* Animated left column */}
            <div style={{ flexShrink: 0, width: customizeOpen ? 304 : 0, overflow: "hidden", transition: "width 280ms ease" }}>
              <div style={{ width: 304 }}>
                <CustomizeViewPanel
                  visibleConsents={visibleConsents}
                  setVisibleConsents={setVisibleConsents}
                  visibleConsentsWithResponses={visibleConsentsWithResponses}
                  setVisibleConsentsWithResponses={setVisibleConsentsWithResponses}
                  visibleSections={visibleSections}
                  setVisibleSections={setVisibleSections}
                  visibleChannels={visibleChannels}
                  setVisibleChannels={setVisibleChannels}
                  visibleStatuses={visibleStatuses}
                  setVisibleStatuses={setVisibleStatuses}
                  onClose={() => setCustomizeOpen(false)}
                  onReset={() => {
                    setVisibleConsents(new Set(ALL_CONSENT_NAMES));
                    setVisibleConsentsWithResponses(new Set(CONSENTS_WITH_RESPONSES_LIST));
                    setVisibleSections({ distribution: true, consentLanguage: true, correspondingTRFs: true, testCodes: true, thirdPartyPlatforms: true });
                    setVisibleChannels(new Set(ALL_CHANNELS));
                    setVisibleStatuses(new Set<StatusFilter>(["Live", "Pending"]));
                  }}
                />
              </div>
            </div>

            {/* Card grid */}
            <div className="flex-1 min-w-0">
              <div
                className="grid w-full"
                style={{ gridTemplateColumns: visibleCards.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: 24, alignItems: "start" }}
              >
                {visibleCards.length > 0 ? visibleCards.map((card) => (
                  <ConsentCardComponent
                    key={card.id}
                    card={card}
                    visibleSections={visibleSections}
                    visibleChannels={visibleChannels}
                    showEdit={showEdit}
                    href={card.consentName === "Biochemical Genetic Consent" ? "/consent-details" : undefined}
                  />
                )) : (
                  <div className="col-span-2 flex items-center justify-center" style={{ paddingTop: 60 }}>
                    <p style={{ ...bodyText, color: "var(--text-text-secondary)" }}>
                      No consent categories match the current filter. Adjust your Customize View settings.
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
