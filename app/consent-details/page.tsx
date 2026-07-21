"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CaretLeft, Browser, Files, Notebook, PlugsConnected, X, DotsThreeVertical, Sliders } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRole } from "@/lib/useRole";
import { canManage } from "@/lib/role";

// ─── Types ────────────────────────────────────────────────────────────────────

type DistributionChannel = "Stand-alone Document" | "Test Requisition Forms" | "Ordering Portal" | "3rd Party Platforms";
type CardStatus = "Live" | "Pending";
type StatusFilter = CardStatus | "Archived";

interface SectionCard {
  id: string;
  sectionName: string;
  status: CardStatus;
  version: string;
  distribution: DistributionChannel[];
  consentLanguage: string[];
  correspondingTRFs: string[];
  testCodes: string;
  thirdPartyPlatforms: string;
  isCKR?: boolean;
}

interface VisibleSections {
  distribution: boolean;
  consentLanguage: boolean;
  correspondingTRFs: boolean;
  testCodes: boolean;
  thirdPartyPlatforms: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GENERAL_TRFS = [
  "Custom Family Sequencing",
  "Custom Proband Sequencing",
  "Autism Testing",
  "Cytogenetics",
  "Global MAPS",
  "Inherited Eye Disorders",
  "Mitochondrial",
  "Molecular Diagnostic",
  "NGS Panel",
  "Total BluePrint Panel",
  "GeneAware",
  "Hereditary Cancer",
  "Oncology",
  "Cytogenetics- POC",
  "Prenatal Comprehensive",
  "Prenatal Chromosomal Microarray Analysis",
  "PreSeek",
  "Postnatal Chromosomal Microarry Analysis/Cytogenetics",
];

const GENERAL_TEST_CODES = "General (cyto, mito, panels, carrier, HC): 1300, BG-1300-P142-1, BG-1300-P463-1, BG-1300-P92-1, BG-1300-P397-1, BG-1300-P76-1, BG-1300-P236-1, BG-1300-P419-1, BG-1300-P354-1, 1522, 1560, 1580, 24001, BG-24001-P12-5, BG-24001-P43-1, BG-24001-P2-2, BG-24001-P94-1, BG-24001-P25-1, BG-24001-P27-1, BG-24001-P37-1, BG-24001-P22-2, BG-24001-P22-1, BG-24001-P18-1, BG-24001-P10-1, BG-24001-P21-1, BG-24001-P12-2, BG-24001-P12-1, BG-24001-P19-1, 1390, 1593, 1594, 2090, 22100, 2126, 2300, 2625, 3135, 3143, 3348, 3359, 4015, 4225, 4811, 6006, 6031, 6034, 6036, 6037, 6041, 6050, 6059, 6350, 6351, 6373, 6376, 6573, 6574, 21200, 21900, 25000, 25001, 25002, 64000, 64005, 2010, 2055, 2056, 2085, 2110, 3200, 3210, 8000, 8005, 8010, 8012, 8015, 8020, 8040, 8300, 8405, 8425, 8530, 8600, 8700, 8705, 8715, 8725, 8730, 8735, 8750, 8760, 8770, 8775, 8790, 8795, 8800, 8639, 8655, 8656, 8657, 8665, 8670, 8671, 8672, 8673, 8675, 8676.";

const LOREM_IPSUM = "Worem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.";

const SHARED_DISTRIBUTION: DistributionChannel[] = ["Stand-alone Document", "Ordering Portal", "Test Requisition Forms"];

const ALL_CARDS: SectionCard[] = [
  {
    id: "test-reporting",
    sectionName: "Test Reporting and Results",
    status: "Live",
    version: "Last Edited  |  MM.DD.YYYY",
    distribution: SHARED_DISTRIBUTION,
    consentLanguage: [LOREM_IPSUM, LOREM_IPSUM, LOREM_IPSUM],
    correspondingTRFs: GENERAL_TRFS,
    testCodes: GENERAL_TEST_CODES,
    thirdPartyPlatforms: "None",
  },
  {
    id: "test-information",
    sectionName: "Test Information",
    status: "Live",
    version: "Last Edited  |  MM.DD.YYYY",
    distribution: SHARED_DISTRIBUTION,
    consentLanguage: [LOREM_IPSUM, LOREM_IPSUM, LOREM_IPSUM],
    correspondingTRFs: GENERAL_TRFS,
    testCodes: GENERAL_TEST_CODES,
    thirdPartyPlatforms: "None",
  },
  {
    id: "considerations-limitations",
    sectionName: "Considerations and Limitations",
    status: "Live",
    version: "Version #.#  |  MM.DD.YYYY",
    distribution: SHARED_DISTRIBUTION,
    consentLanguage: [
      "The ordering provider is responsible for explaining the risks, benefits, and alternatives to testing. Beyond impacting healthcare treatment, it is important to consider that learning about test results may have emotional and psychological effects.\nWhen a variant(s) is found that is known to cause health issues, the progression of the condition or treatment might not be known. Family members with the same variant might not be affected in the same way.",
      "A negative result does not rule out the chance for health issues. Our knowledge of variants and how they cause disease may change over time as we learn more about genetics. Testing has limitations to what it can find as well.",
      "If several family members are tested, knowing the correct biological relationships among them is important. In rare cases, testing can show that family members are not related as expected (e.g., unassigned familial relationships). If this is found, we may contact the provider who ordered the testing.",
      "Certain factors may lead to incorrect or less accurate results. These include mislabeled samples, incorrect information in the test order, rare technical errors, or unassigned familial relationships.",
      "The final test report may not fully reflect the original test order and may be modified based on laboratory policies and procedures (e.g., unassigned familial relationships, or delays or absence of comparator samples). The reason for any changes may not be detailed in the report; however, the ordering healthcare provider may contact the laboratory for additional information.\nMore sample and/or a different type of sample may be needed if the first sample is not sufficient to complete testing.",
    ],
    correspondingTRFs: ["Biochemical"],
    testCodes: "Biochem: 4000, 4100, 4130, 4150, 4160, 4175, 4200, 4240, 4250, 4260, 4300, 4310, 4330, 4536, 4555, 4569, 4627, 4650, 4651, 4900, 4901, 8501, 8550, 4015, 4225, 4811, 4620, 8945, 8940, 8955, 8950",
    thirdPartyPlatforms: "None",
  },
  {
    id: "confidentiality-sample-rate",
    sectionName: "Confidentiality and Sample Rate",
    status: "Live",
    version: "Version #.#  |  MM.DD.YYYY",
    distribution: SHARED_DISTRIBUTION,
    consentLanguage: [
      "If this testing is requested to be cancelled after the order and sample are sent to the laboratory, please see our Test Cancellation Policy at www.baylorgenetics.com/cancel-test/. Once testing has been completed and results have been reported, the test results become part of your clinical medical record maintained by your healthcare provider. Because this testing is ordered in connection with medically necessary clinical care, test results documented in your medical record are subject to applicable medical records retention requirements and generally cannot be deleted from the medical record upon patient request, though you retain the right to request amendment of information you believe to be inaccurate or incomplete under applicable law, including the HIPAA Privacy Rule (45 C.F.R. § 164.526).",
      "Only Baylor Genetics and its contracted partners will have access to this sample for the ordered testing. Results from testing will only be released to: (i) a licensed healthcare provider, (ii) those authorized in writing, (iii) the individual(s) tested or their personal representative, and (iv) those allowed access to test results by law. The individual(s) tested has the right to access their test results from Baylor Genetics by providing a written request. They also have the right to request raw data obtained from their sample by providing a written request or HIPAA Authorization Form. Because this testing is ordered by a healthcare provider for clinical care, state-level direct-to-consumer genetic privacy laws generally do not apply.",
      "In rare cases, people with genetic diseases may have problems with health insurance and employment. Certain federal laws may apply to protect genetic information. The Genetic Information Nondiscrimination Act (GINA) primarily protects predictive genetic information (e.g., risk or carrier status before a condition develops). Because this test is ordered for an existing or suspected condition, confirmed diagnoses are generally not covered by GINA. However, GINA may apply to incidental or secondary findings that reveal future health risks.",
      "Samples will be kept in the laboratory based on our retention policy. Once testing is completed, the biological sample may be destroyed in accordance with applicable state law requirements (e.g., within sixty (60) days for New York residents unless longer retention is expressly authorized). The destruction of a biological sample does not affect the retention of test results in the medical record. De-identified samples may be used for quality assurance and training purposes prior to destruction. Samples are not returned to individuals tested or providers unless requested prior to testing. The individual(s) tested and their heirs will not receive payments, benefits, or rights to any resulting products or discoveries.",
      "The information from this testing may be used in scientific research, publications or presentations, but the individual(s) tested specific identity will not be revealed. We may contact the ordering provider to obtain more clinical information. Baylor Genetics also performs other types of scientific research and may contact the individual(s) tested to see if they would like to be involved.",
      "Variants found may be submitted to databases. The medical community uses these databases to collect information about how variants might cause disease to improve testing and treatment for patients. An example is ClinVar, a free, public archive of reports on human genetics. Limited clinical information may need to be shared with these databases. In rare cases, this information may be enough to reveal identity.",
      "For more information on privacy practices at Baylor Genetics, please visit www.baylorgenetics.com/privacy-practices/",
    ],
    correspondingTRFs: ["All"],
    testCodes: "All",
    thirdPartyPlatforms: "None",
  },
  {
    id: "financial-agreement",
    sectionName: "Financial Agreement",
    status: "Live",
    version: "Version #.#  |  MM.DD.YYYY",
    distribution: SHARED_DISTRIBUTION,
    consentLanguage: [
      "By signing below, I hereby authorize Baylor Genetics to provide my insurance carrier any information necessary, including test results, for processing my insurance claim. I understand that I am responsible for any co-pay, co-insurance, and unmet deductible that the insurance policy dictates. I designate Baylor Genetics as my designated representative for purposes of appealing any denial of benefits by my insurance carrier. I irrevocably assign associated payment to Baylor Genetics, and direct that payment be made directly to Baylor Genetics. Please note, some payers may not cover certain screening tests.",
      "If my health insurer does not cover the test or I do not have health insurance, or if I elect to pay out of pocket rather than utilize my insurance coverage, I have received a good faith estimate of the cost for the genetic testing ordered by my provider and agree to pay for the cost of the genetic testing billed to me by Baylor Genetics based on that good faith estimate. More information is available in Baylor Genetics' No Surprises Act and Good Faith Estimate Notice located at https://www.baylorgenetics.com/no-surprises-act/.\nA Medicare Advance Beneficiary Notice (ABN) is required for services Medicare identifies as not medically necessary.",
    ],
    correspondingTRFs: ["All"],
    testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)",
    thirdPartyPlatforms: "None",
  },
  {
    id: "statement-medical-necessity",
    isCKR: true,
    sectionName: "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    status: "Live",
    version: "Version #.#  |  MM.DD.YYYY",
    distribution: SHARED_DISTRIBUTION,
    consentLanguage: [
      "This requisition incorporates by reference as applicable Baylor Genetics' Terms and Conditions available at: https://www.baylorgenetics.com/lab-terms-conditions/ or, in the case of international entities, https://www.baylorgenetics.com/terms-conditions-of-the-laboratory-services-international/.\nBy submitting this requisition, I attest to the following:",
      "Medical Necessity: The test(s) ordered are medically necessary for the risk assessment, diagnosis, monitoring, or detection of a suspected genetic condition. The results are expected to inform clinical decision-making, including diagnosis, prognosis, medical management and/or treatment.\nAuthorization to Order: I am authorized by law to order these test(s).\nEducation and Consent: I confirm that I, or my qualified designee, have provided the individual(s) tested (and/or their legal guardian) with appropriate information regarding the nature, purpose, benefits, limitations, and potential outcomes of the genetic test(s), and that informed consent for testing has been obtained in accordance with applicable laws, regulations and institutional policies.",
      "Comparator/Family Member Consent (if applicable): Any individual identified as a comparator (e.g., biological family member) has been provided with appropriate information regarding genetic testing, including the purpose of testing, possible results, and potential implications. Informed consent for testing has been obtained from each comparator, including consent for the return of relevant findings (e.g., ACMG-recommended secondary findings or other medically actionable results), where applicable and selected.\nThe individuals tested (and/or their legal guardian) have been given the opportunity to ask questions about the testing and possible results.",
    ],
    correspondingTRFs: ["All"],
    testCodes: "All",
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

const ALL_SECTION_NAMES = ALL_CARDS
  .filter((c) => c.id !== "statement-medical-necessity")
  .map((c) => c.sectionName);

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

const CONSENTS_WITH_RESPONSES_LIST = [
  "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
  "Use of Data and Specimen for Research Purposes",
  "For Samples Submitted from New York State Residents",
  "Reporting of ACMG Secondary Findings",
  "Reporting of Incidental Findings",
  "Reporting of Findings in Genes with No Known Disease Association",
  "Use of Sample for MCC studies for Surrogates",
];

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
  "• Primary", "• Additional", "Note:", "Component Plans:",
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

function ActionsMenu({ showEdit }: { showEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
        onClick={() => setOpen((v) => !v)}
      >
        <DotsThreeVertical size={20} weight="bold" className="text-text-primary" />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "var(--bg-bg-page)",
            border: "1px solid var(--borders-border-subtle)",
            borderRadius: 4,
            boxShadow: "0px 4px 12px var(--bg-ssot-shadow-dropdown)",
            zIndex: 20,
            minWidth: 160,
            padding: "4px 0",
          }}
        >
          {items.map((item) => (
            <Link
              key={item}
              href={item === "Edit" ? "/edit-consent" : item === "View History" ? "/consent-version-history" : "#"}
              onClick={() => setOpen(false)}
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

interface CardProps {
  card: SectionCard;
  visibleSections: VisibleSections;
  visibleChannels: Set<DistributionChannel>;
  showEdit: boolean;
}

function SectionCardComponent({ card, visibleSections, visibleChannels, showEdit }: CardProps) {
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
      <p style={bodyText}>{card.testCodes}</p>
    </div>
  ) : null;

  const trfsNode = visibleSections.correspondingTRFs ? (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <p style={sectionLabel}>TRFs</p>
      <div className="flex flex-col">
        {card.correspondingTRFs.map((t, i) => <p key={i} style={bodyText}>{t}</p>)}
      </div>
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
    <div className="flex flex-col border border-border-subtle rounded-[4px] overflow-hidden" style={{ alignSelf: "start" }}>
      <div style={{ background: card.isCKR ? `var(--button-secondary-btn-secondary-bg-active)` : "var(--deepblue-color-primary-500)", padding: "8px 12px", minHeight: 88, display: "flex", alignItems: "center" }}>
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
          {card.sectionName}
        </p>
      </div>

      <div className="flex flex-col bg-bg-page" style={{ padding: 24 }}>
        <div className="flex flex-col" style={{ gap: 8 }}>
          <div className="flex items-center justify-between w-full">
            <p style={sectionLabel}>Status</p>
            <ActionsMenu showEdit={showEdit} />
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
              {testCodesNode && (
                <div className="flex-1 min-w-0">{testCodesNode}</div>
              )}
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

interface CustomizeViewProps {
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
  onClose: () => void;
  onReset: () => void;
}

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

function CustomizeViewPanel({
  visibleSectionCards, setVisibleSectionCards,
  visibleConsentsWithResponses, setVisibleConsentsWithResponses,
  visibleSections, setVisibleSections,
  visibleChannels, setVisibleChannels,
  visibleStatuses, setVisibleStatuses,
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

      <PanelColumn title="Consent Sections">
        {ALL_SECTION_NAMES.map((name) => (
          <CheckRow key={name} label={name} checked={visibleSectionCards.has(name)} onChange={() => toggle(visibleSectionCards, setVisibleSectionCards, name)} />
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

export default function ConsentDetailsPage() {
  const role = useRole();
  const showEdit = role === null ? true : canManage(role);

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [visibleSectionCards, setVisibleSectionCards] = useState<Set<string>>(new Set(ALL_SECTION_NAMES));
  const [visibleConsentsWithResponses, setVisibleConsentsWithResponses] = useState<Set<string>>(new Set(CONSENTS_WITH_RESPONSES_LIST));
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    distribution: true,
    consentLanguage: true,
    correspondingTRFs: true,
    testCodes: true,
    thirdPartyPlatforms: true,
  });
  const [visibleChannels, setVisibleChannels] = useState<Set<DistributionChannel>>(new Set(ALL_CHANNELS));
  const [visibleStatuses, setVisibleStatuses] = useState<Set<StatusFilter>>(new Set<StatusFilter>(["Live", "Pending"]));

  const visibleCards = ALL_CARDS.filter(
    (c) => (visibleSectionCards.has(c.sectionName) || visibleConsentsWithResponses.has(c.sectionName)) && visibleStatuses.has(c.status)
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
          <Link href="/consent-category" className="flex items-center" style={{ gap: 4 }}>
            <CaretLeft size={14} weight="bold" style={{ color: "var(--button-ghost-btn-ghost-text)" }} />
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "var(--button-ghost-btn-ghost-text)" }}>
              Consent Categories
            </span>
          </Link>

          {/* Page header block */}
          <div className="flex flex-col w-full" style={{ gap: 8 }}>
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
                Stand-alone Consent
              </span>
            </div>

            <p style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 300,
              fontSize: 28,
              lineHeight: "36px",
              letterSpacing: "-0.14px",
              color: "var(--text-text-primary)",
            }}>
              Biochemical Genetic Consent
            </p>

            <div className="flex items-center justify-between w-full" style={{ gap: 16 }}>
              <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "var(--text-text-primary)" }}>
                Describes biochemical test procedures, result types, reporting options, limitations, and patient rights regarding genetic testing for metabolic and enzyme-related conditions.
              </p>
              <div className="flex items-center shrink-0" style={{ gap: 24 }}>
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
                  onClose={() => setCustomizeOpen(false)}
                  onReset={() => {
                    setVisibleSectionCards(new Set(ALL_SECTION_NAMES));
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
                  <SectionCardComponent
                    key={card.id}
                    card={card}
                    visibleSections={visibleSections}
                    visibleChannels={visibleChannels}
                    showEdit={showEdit}
                  />
                )) : (
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
