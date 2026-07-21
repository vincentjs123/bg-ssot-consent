"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, X, CaretDown } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { TEST_CATALOG } from "@/lib/test-catalog";
import {
  CONSENT_CATEGORIES as SEARCH_CATEGORIES,
  CONSENT_SECTIONS as SEARCH_SECTIONS,
  CONSENTS_WITH_RESPONSES as SEARCH_RESPONSES,
  DETAIL_ROUTES,
  type Suggestion,
  type SuggestionType,
} from "@/lib/search-data";

type BrowseFilter = "all" | "consent-sections" | "consent-categories" | "consents-with-responses";

interface Category {
  name: string;
  active: number;
  pending?: number;
  description: string;
  href: string;
  connected: boolean;
}

const CONSENT_SECTIONS: Category[] = [
  {
    name: "Test Information",
    active: 5,
    description: "Overview of the test being performed, purpose, and what the patient can expect.",
    href: "/consent-section/test-information",
    connected: true,
  },
  {
    name: "Test Reporting and Results",
    active: 5,
    pending: 1,
    description: "Explains result types — Positive, Negative, VUS — and how findings will be communicated.",
    href: "/consent-category",
    connected: true,
  },
  {
    name: "Additional Reporting",
    active: 2,
    description: "Secondary and incidental findings not directly related to the reason for testing.",
    href: "/consent-section/additional-reporting",
    connected: true,
  },
  {
    name: "Considerations and Limitations",
    active: 5,
    description: "Risks, benefits, alternatives, and known limitations of the testing methodology.",
    href: "/consent-section/considerations-and-limitations",
    connected: true,
  },
  {
    name: "Confidentiality and Sample Retention",
    active: 5,
    description: "How patient data and biological samples are stored, shared, and protected.",
    href: "/consent-section/confidentiality-and-sample-retention",
    connected: true,
  },
  {
    name: "Financial Agreement",
    active: 5,
    description: "Patient's acknowledgment of financial responsibility and billing terms.",
    href: "/consent-section/financial-agreement",
    connected: true,
  },
];

const ADDITIONAL_CONSENT_REPORTING: Category[] = [
  {
    name: "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    active: 1,
    description: "Patient acknowledgment of medical necessity and agreement to testing terms and conditions.",
    href: "/consent-response/statement-of-medical-necessity",
    connected: false,
  },
  {
    name: "Use of Data and Specimen for Research Purposes",
    active: 1,
    description: "Patient consent for de-identified data and sample use in scientific research.",
    href: "/consent-response/use-of-data-and-specimen",
    connected: false,
  },
  {
    name: "For Samples from New York State Residents",
    active: 1,
    description: "State-specific language required for samples collected from New York residents.",
    href: "/consent-response/new-york-state-residents",
    connected: false,
  },
  {
    name: "Reporting of Incidental Findings",
    active: 1,
    description: "Disclosure of findings discovered incidentally that may affect patient health.",
    href: "/consent-response/incidental-findings",
    connected: false,
  },
  {
    name: "Reporting of ACMG Secondary Findings",
    active: 1,
    description: "Optional reporting for ACMG-recommended secondary findings in comparator cases.",
    href: "/consent-response/acmg-secondary-findings",
    connected: false,
  },
  {
    name: "Reporting of Findings in Genes with No Known Disease Association",
    active: 1,
    description: "Reporting of variants in genes not yet associated with a recognized clinical condition.",
    href: "/consent-response/genes-no-known-disease-association",
    connected: false,
  },
  {
    name: "Use of Sample for MCC studies for Surrogates",
    active: 1,
    description: "Consent for surrogate sample use in maternal cell contamination studies.",
    href: "/consent-response/mcc-studies-surrogates",
    connected: false,
  },
];

const CONSENT_CATEGORIES: Category[] = [
  {
    name: "Informed Consent for WES and WGS",
    active: 12,
    description: "Consent framework for whole exome and whole genome sequencing tests.",
    href: "/consent-category/informed-consent-for-wes-and-wgs",
    connected: true,
  },
  {
    name: "Prenatal WGS/WES Consent",
    active: 11,
    description: "Consent framework for prenatal whole genome and exome sequencing.",
    href: "/consent-category/prenatal-wgs-wes-consent",
    connected: true,
  },
  {
    name: "General Genetic Testing Consent",
    active: 8,
    description: "Broad consent framework applicable to general genetic testing panels.",
    href: "/consent-category/general-genetic-testing-consent",
    connected: true,
  },
  {
    name: "Biochemical Genetic Consent",
    active: 6,
    description: "Consent framework for biochemical genetic testing and metabolic panels.",
    href: "/consent-details",
    connected: true,
  },
  {
    name: "Huntington Disease Consent",
    active: 8,
    description: "Specialized consent framework for predictive Huntington Disease testing.",
    href: "/consent-category/huntington-disease-consent",
    connected: true,
  },
];

const badgeBase: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 600,
  fontSize: 16,
  lineHeight: "24px",
  border: "1px solid var(--borders-border-primary)",
  borderRadius: 40,
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 4,
  paddingBottom: 4,
  whiteSpace: "nowrap",
};

function CategoryCard({ category }: { category: Category }) {
  const containerClass = "flex flex-col bg-bg-page border border-border-subtle rounded-[4px]";
  const inner = (
    <>
      {/* Title + divider */}
      <div className="flex flex-col w-full" style={{ gap: 4 }}>
        <p
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 400,
            fontSize: 20,
            lineHeight: "28px",
            color: "var(--text-text-primary)",
          }}
        >
          {category.name}
        </p>
        <div style={{ width: "100%", height: 1, background: "var(--borders-border-subtle)" }} />
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "24px",
          color: "var(--text-text-primary)",
          flex: 1,
        }}
      >
        {category.description}
      </p>

      {/* Badges */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <span style={{ ...badgeBase, color: "white", background: "var(--button-success-btn-success-bg)" }}>
          {category.active} Live
        </span>
        {category.pending && (
          <span style={{ ...badgeBase, color: "var(--text-text-primary)", background: "var(--button-caution-btn-caution-bg)" }}>
            {category.pending} Pending
          </span>
        )}
      </div>
    </>
  );

  if (category.connected) {
    return (
      <Link
        href={category.href}
        className={`${containerClass} hover:border-border-primary hover:shadow-card transition-all`}
        style={{ padding: 24, gap: 24 }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={containerClass} style={{ padding: 24, gap: 24 }}>
      {inner}
    </div>
  );
}

interface SectionProps {
  label: string;
  items: Category[];
}

function Section({ label, items }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col w-full" style={{ gap: 24 }}>
      <p
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 400,
          fontSize: 20,
          lineHeight: "28px",
          color: "var(--text-text-primary)",
        }}
      >
        {label}
      </p>
      <div className="grid w-full" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "24px 32px" }}>
        {items.map((cat) => (
          <CategoryCard key={cat.name} category={cat} />
        ))}
      </div>
    </div>
  );
}

const GROUP_LABELS: Record<SuggestionType, string> = {
  category: "Consent Category",
  section: "Consent Section",
  response: "Consents with Responses",
  "test-code": "Test Code",
};

function buildSuggestions(query: string): Suggestion[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: Suggestion[] = [];

  SEARCH_CATEGORIES.filter((c) => c.toLowerCase().includes(q))
    .slice(0, 4)
    .forEach((c) => results.push({ type: "category", label: c }));

  SEARCH_SECTIONS.filter((c) => c.toLowerCase().includes(q))
    .slice(0, 4)
    .forEach((c) => results.push({ type: "section", label: c }));

  SEARCH_RESPONSES.filter((c) => c.toLowerCase().includes(q))
    .slice(0, 4)
    .forEach((c) => results.push({ type: "response", label: c }));

  TEST_CATALOG.filter(
    (r) => r.testCode.toLowerCase().includes(q) || r.testName.toLowerCase().includes(q)
  )
    .slice(0, 5)
    .forEach((r) =>
      results.push({ type: "test-code", label: r.testName, sublabel: r.testCode })
    );

  return results;
}

export default function ConsentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [browseFilter, setBrowseFilter] = useState<BrowseFilter>("all");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = buildSuggestions(search);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);
    setDropdownOpen(value.trim().length > 0);
  }

  function handleSuggestionClick(s: Suggestion) {
    setDropdownOpen(false);
    const detailRoute = DETAIL_ROUTES[s.label];
    if (detailRoute) {
      router.push(detailRoute);
      return;
    }
    const q = s.type === "test-code" ? s.sublabel ?? s.label : s.label;
    router.push(`/search?q=${encodeURIComponent(q)}&type=${s.type}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    setDropdownOpen(false);
    const detailRoute = DETAIL_ROUTES[trimmed];
    if (detailRoute) {
      router.push(detailRoute);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const q = search.toLowerCase();

  function filterCards(list: Category[]) {
    if (!q) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }

  const filteredSections = filterCards(CONSENT_SECTIONS);
  const filteredAdditional = filterCards(ADDITIONAL_CONSENT_REPORTING);
  const filteredCategories = filterCards(CONSENT_CATEGORIES);

  const showSections = browseFilter === "all" || browseFilter === "consent-sections";
  const showAdditional = browseFilter === "all" || browseFilter === "consents-with-responses";
  const showCategories = browseFilter === "all" || browseFilter === "consent-categories";

  const additionalLabel =
    browseFilter === "consents-with-responses" ? "Consents with Responses" : "Additional Consent Reporting";

  const hasResults =
    (showSections && filteredSections.length > 0) ||
    (showAdditional && filteredAdditional.length > 0) ||
    (showCategories && filteredCategories.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" showCreateConsent />

      <main className="flex flex-col w-full bg-bg-page">
        <div
          className="flex flex-col w-full max-w-[1280px] mx-auto"
          style={{ paddingTop: 32, paddingBottom: 64, paddingLeft: 64, paddingRight: 64, gap: 32 }}
        >
          {/* Search — typeahead */}
          <div className="flex flex-col" style={{ gap: 8, maxWidth: 466 }} ref={searchContainerRef}>
            <span
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 20,
                lineHeight: "28px",
                color: "var(--text-text-primary)",
              }}
            >
              Search
            </span>
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <div
                  className="flex items-center bg-bg-page border border-border-subtle rounded-[4px]"
                  style={{ height: 40, paddingLeft: 12, paddingRight: 12, gap: 8 }}
                >
                  <MagnifyingGlass size={16} className="shrink-0 text-text-secondary" />
                  <input
                    className="flex-1 min-w-0 bg-transparent outline-none"
                    style={{
                      fontFamily: "var(--font-barlow), sans-serif",
                      fontWeight: 400,
                      fontSize: 15,
                      lineHeight: "22px",
                      color: "var(--text-text-primary)",
                    }}
                    placeholder="Search by Test Code, Consent Category or Consent Section"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => search.trim() && setDropdownOpen(true)}
                    onKeyDown={(e) => e.key === "Escape" && setDropdownOpen(false)}
                    autoComplete="off"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => { setSearch(""); setDropdownOpen(false); }}
                      className="shrink-0"
                    >
                      <X size={14} className="text-text-secondary" />
                    </button>
                  )}
                </div>
              </form>

              {/* Typeahead dropdown */}
              {dropdownOpen && suggestions.length > 0 && (
                <div
                  className="absolute z-20 w-full bg-bg-page border border-border-subtle rounded-[4px]"
                  style={{
                    top: "calc(100% + 4px)",
                    boxShadow: "0px 4px 12px var(--bg-ssot-shadow-dropdown)",
                    maxHeight: 360,
                    overflowY: "auto",
                  }}
                >
                  {(["category", "section", "response", "test-code"] as SuggestionType[]).map((type) => {
                    const group = suggestions.filter((s) => s.type === type);
                    if (group.length === 0) return null;
                    return (
                      <div key={type} style={{ marginTop: 8 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px 4px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-barlow), sans-serif",
                              fontWeight: 600,
                              fontSize: 11,
                              lineHeight: "16px",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              color: "var(--text-text-secondary)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {GROUP_LABELS[type]}
                          </span>
                          <div style={{ flex: 1, height: 1, background: "var(--borders-border-subtle)" }} />
                        </div>
                        {group.map((s, i) => (
                          <button
                            key={i}
                            className="flex flex-col w-full text-left hover:bg-bg-body"
                            style={{ padding: "8px 12px" }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionClick(s);
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-barlow), sans-serif",
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "var(--text-text-primary)",
                              }}
                            >
                              {s.type === "test-code" && s.sublabel
                                ? `${s.sublabel} - ${s.label}`
                                : s.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                  {/* View all results */}
                  <div style={{ borderTop: "1px solid var(--borders-border-subtle)" }}>
                    <button
                      className="flex items-center w-full text-left hover:bg-bg-body"
                      style={{ padding: "10px 12px", gap: 8 }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setDropdownOpen(false);
                        router.push(`/search?q=${encodeURIComponent(search.trim())}`);
                      }}
                    >
                      <MagnifyingGlass size={14} className="text-text-secondary shrink-0" />
                      <span
                        style={{
                          fontFamily: "var(--font-barlow), sans-serif",
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: "20px",
                          color: "var(--text-text-secondary)",
                        }}
                      >
                        Search for &ldquo;{search}&rdquo;
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grey container — Browse + separator + all card sections */}
          <div className="flex flex-col w-full bg-bg-body" style={{ padding: 24, gap: 24 }}>
            {/* Browse */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "var(--text-text-secondary)",
                }}
              >
                Browse Consents by:
              </span>
              <div className="relative" style={{ width: 280 }}>
                <select
                  className="w-full appearance-none bg-bg-page border border-border-subtle rounded-[4px] cursor-pointer outline-none"
                  style={{
                    height: 40,
                    paddingLeft: 12,
                    paddingRight: 36,
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: "22px",
                    color: "var(--text-text-primary)",
                  }}
                  value={browseFilter}
                  onChange={(e) => setBrowseFilter(e.target.value as BrowseFilter)}
                >
                  <option value="all">All</option>
                  <option value="consent-categories">Consent Categories</option>
                  <option value="consent-sections">Consent Sections</option>
                  <option value="consents-with-responses">Additional Consent Reporting</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <CaretDown size={14} className="text-text-secondary" />
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="w-full" style={{ height: 1, background: "var(--borders-border-subtle)" }} />

            {/* Card sections */}
            {hasResults ? (
              <div className="flex flex-col w-full" style={{ gap: 32 }}>
                {showCategories && <Section label="Consent Categories" items={filteredCategories} />}
                {showSections && <Section label="Consent Sections" items={filteredSections} />}
                {showAdditional && <Section label={additionalLabel} items={filteredAdditional} />}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full" style={{ paddingTop: 60, paddingBottom: 60 }}>
                <span
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "var(--text-text-secondary)",
                  }}
                >
                  No results match your search.
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
