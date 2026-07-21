"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlass, X, ArrowLeft, DotsThree } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { TEST_CATALOG } from "@/lib/test-catalog";
import {
  CONSENT_CATEGORIES,
  CONSENT_SECTIONS,
  CONSENTS_WITH_RESPONSES,
  DETAIL_ROUTES,
} from "@/lib/search-data";
import { getConsentMapping, testCodeMatchesFilters } from "@/lib/consent-mapping";

const STATUS_OPTIONS = ["Active", "Pending", "Archived"] as const;

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "20px",
  color: "var(--text-text-primary)",
};

const ITEM_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "20px",
  color: "var(--text-text-primary)",
};

const CELL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "20px",
  color: "var(--text-text-primary)",
  padding: "16px 0",
  verticalAlign: "top",
  textAlign: "left",
};

const HEADER_CELL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "20px",
  color: "var(--text-text-primary)",
  padding: "24px 0 24px 0",
  textAlign: "left",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start cursor-pointer" style={{ gap: 8 }}>
      <div
        className="shrink-0 flex items-center justify-center rounded-[2px]"
        style={{
          width: 16,
          height: 16,
          marginTop: 2,
          background: checked ? "var(--text-text-primary)" : "transparent",
          border: checked ? "1px solid var(--text-text-primary)" : "1px solid var(--borders-border-strong)",
        }}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={ITEM_LABEL_STYLE}>{label}</span>
    </label>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <p style={LABEL_STYLE}>{title}</p>
      <div className="flex flex-col" style={{ gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

type SelectionType = "category" | "section" | "response" | "test-code" | null;

function initCategories(type: SelectionType, q: string): Record<string, boolean> {
  if (type === "category") {
    return Object.fromEntries(CONSENT_CATEGORIES.map((c) => [c, c === q]));
  }
  return Object.fromEntries(CONSENT_CATEGORIES.map((c) => [c, true]));
}

function initSections(type: SelectionType, q: string): Record<string, boolean> {
  if (type === "section") {
    return Object.fromEntries(CONSENT_SECTIONS.map((c) => [c, c === q]));
  }
  return Object.fromEntries(CONSENT_SECTIONS.map((c) => [c, true]));
}

function initResponses(type: SelectionType, q: string): Record<string, boolean> {
  if (type === "response") {
    return Object.fromEntries(CONSENTS_WITH_RESPONSES.map((c) => [c, c === q]));
  }
  return Object.fromEntries(CONSENTS_WITH_RESPONSES.map((c) => [c, true]));
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const initialType = (searchParams.get("type") as SelectionType) ?? null;

  const [query, setQuery] = useState(initialQ);
  const [panelOpen, setPanelOpen] = useState(true);

  const [categories, setCategories] = useState<Record<string, boolean>>(
    () => initCategories(initialType, initialQ)
  );
  const [sections, setSections] = useState<Record<string, boolean>>(
    () => initSections(initialType, initialQ)
  );
  const [responses, setResponses] = useState<Record<string, boolean>>(
    () => initResponses(initialType, initialQ)
  );
  const [statuses, setStatuses] = useState<Record<string, boolean>>({
    Active: true,
    Pending: true,
    Archived: false,
  });

  // Re-initialise filter state when URL params change
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const type = (searchParams.get("type") as SelectionType) ?? null;
    setQuery(q);
    setCategories(initCategories(type, q));
    setSections(initSections(type, q));
    setResponses(initResponses(type, q));
  }, [searchParams]);

  function resetAll() {
    setCategories(Object.fromEntries(CONSENT_CATEGORIES.map((c) => [c, true])));
    setSections(Object.fromEntries(CONSENT_SECTIONS.map((c) => [c, true])));
    setResponses(Object.fromEntries(CONSENTS_WITH_RESPONSES.map((c) => [c, true])));
    setStatuses({ Active: true, Pending: true, Archived: false });
  }

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    return TEST_CATALOG.filter((row) => {
      // Text search
      if (q) {
        const textMatch =
          row.testCode.toLowerCase().includes(q) ||
          row.testName.toLowerCase().includes(q);
        if (!textMatch) return false;
      }

      // Consent mapping filters
      if (!testCodeMatchesFilters(row.testCode, categories, sections, responses)) {
        return false;
      }

      return true;
    });
  }, [query, categories, sections, responses, searchParams]);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    const detailRoute = DETAIL_ROUTES[trimmed];
    if (detailRoute) {
      router.push(detailRoute);
      return;
    }
    router.replace(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="consents" showCreateConsent />

      <main className="flex flex-col w-full bg-bg-page">
        <div
          className="flex flex-col w-full max-w-[1280px] mx-auto"
          style={{ paddingTop: 32, paddingBottom: 64, paddingLeft: 64, paddingRight: 64, gap: 32 }}
        >
          {/* Page header */}
          <div className="flex flex-col w-full" style={{ gap: 16 }}>
            <Link
              href="/consents"
              className="flex items-center"
              style={{
                gap: 8,
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "20px",
                color: "var(--text-text-primary)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} />
              Home
            </Link>

            <p
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 28,
                lineHeight: "36px",
                color: "var(--text-text-primary)",
                margin: 0,
              }}
            >
              Search
            </p>

            {/* Search input */}
            <form onSubmit={handleSearchSubmit}>
              <div
                className="flex items-center bg-bg-page border border-border-subtle rounded-[4px]"
                style={{ height: 40, paddingLeft: 12, paddingRight: 12, gap: 8, maxWidth: 400 }}
              >
                <MagnifyingGlass size={16} className="shrink-0 text-text-secondary" />
                <input
                  ref={inputRef}
                  className="flex-1 min-w-0 bg-transparent outline-none"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: "22px",
                    color: "var(--text-text-primary)",
                  }}
                  placeholder="Search by Test Code or Test Name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="shrink-0">
                    <X size={14} className="text-text-secondary" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Body: left panel + table */}
          <div className="flex items-start w-full" style={{ gap: panelOpen ? 32 : 0 }}>
            {/* Left filter panel */}
            <div
              style={{
                width: panelOpen ? 240 : 0,
                overflow: "hidden",
                transition: "width 280ms ease",
                flexShrink: 0,
              }}
            >
              <div
                className="flex flex-col bg-bg-page border border-border-subtle rounded-[4px]"
                style={{ width: 240, padding: 16, gap: 24 }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between">
                  <p
                    style={{
                      fontFamily: "var(--font-barlow), sans-serif",
                      fontWeight: 600,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "var(--text-text-primary)",
                      margin: 0,
                    }}
                  >
                    Filter Results
                  </p>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="flex items-center justify-center"
                    style={{ width: 24, height: 24 }}
                    aria-label="Collapse filter panel"
                  >
                    <ArrowLeft size={16} className="text-text-secondary" />
                  </button>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "var(--borders-border-subtle, var(--borders-border-subtle))" }} />

                {/* Consent Categories */}
                <FilterSection title="Consent Categories">
                  {CONSENT_CATEGORIES.map((c) => (
                    <Checkbox
                      key={c}
                      checked={categories[c]}
                      onChange={(v) => setCategories((prev) => ({ ...prev, [c]: v }))}
                      label={c}
                    />
                  ))}
                </FilterSection>

                <div style={{ height: 1, background: "var(--borders-border-subtle, var(--borders-border-subtle))" }} />

                {/* Consent Sections */}
                <FilterSection title="Consent Sections">
                  {CONSENT_SECTIONS.map((c) => (
                    <Checkbox
                      key={c}
                      checked={sections[c]}
                      onChange={(v) => setSections((prev) => ({ ...prev, [c]: v }))}
                      label={c}
                    />
                  ))}
                </FilterSection>

                <div style={{ height: 1, background: "var(--borders-border-subtle, var(--borders-border-subtle))" }} />

                {/* Consents with Responses */}
                <FilterSection title="Consents with Responses">
                  {CONSENTS_WITH_RESPONSES.map((c) => (
                    <Checkbox
                      key={c}
                      checked={responses[c]}
                      onChange={(v) => setResponses((prev) => ({ ...prev, [c]: v }))}
                      label={c}
                    />
                  ))}
                </FilterSection>

                <div style={{ height: 1, background: "var(--borders-border-subtle, var(--borders-border-subtle))" }} />

                {/* Status */}
                <FilterSection title="Status">
                  {STATUS_OPTIONS.map((s) => (
                    <Checkbox
                      key={s}
                      checked={statuses[s]}
                      onChange={(v) => setStatuses((prev) => ({ ...prev, [s]: v }))}
                      label={s}
                    />
                  ))}
                </FilterSection>

                {/* Reset All */}
                <button
                  onClick={resetAll}
                  className="flex items-center justify-center border border-border-subtle rounded-[4px] bg-bg-page self-end"
                  style={{
                    height: 32,
                    paddingLeft: 12,
                    paddingRight: 12,
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: "20px",
                    color: "var(--text-text-primary)",
                  }}
                >
                  Reset All
                </button>
              </div>
            </div>

            {/* Table area */}
            <div className="flex flex-col flex-1 min-w-0" style={{ gap: 0 }}>
              {/* Expand panel button when closed */}
              {!panelOpen && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="flex items-center justify-center border border-border-subtle rounded-[4px] bg-bg-page mb-4 self-start"
                  style={{
                    height: 32,
                    paddingLeft: 12,
                    paddingRight: 12,
                    gap: 6,
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: "20px",
                    color: "var(--text-text-primary)",
                  }}
                  aria-label="Open filter panel"
                >
                  <MagnifyingGlass size={14} />
                  Filter Results
                </button>
              )}

              {/* Result count */}
              <p
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "var(--text-text-secondary)",
                  marginBottom: 12,
                }}
              >
                {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
              </p>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--borders-border-subtle, var(--borders-border-subtle))" }}>
                      <th style={{ ...HEADER_CELL_STYLE, width: 160 }}>Test</th>
                      <th style={{ ...HEADER_CELL_STYLE, width: 1, whiteSpace: "nowrap", paddingLeft: 16 }}>Consent Category</th>
                      <th style={{ ...HEADER_CELL_STYLE, width: 1, whiteSpace: "nowrap", paddingLeft: 16 }}>Consent Section</th>
                      <th style={{ ...HEADER_CELL_STYLE, width: 1, whiteSpace: "nowrap", paddingLeft: 16 }}>Consents with Responses</th>
                      <th style={{ ...HEADER_CELL_STYLE, width: 1, whiteSpace: "nowrap", paddingLeft: 16 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            ...CELL_STYLE,
                            textAlign: "center",
                            paddingTop: 48,
                            paddingBottom: 48,
                            color: "var(--text-text-secondary)",
                          }}
                        >
                          No results match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredResults.map((row, i) => (
                        <tr
                          key={`${row.testCode}-${i}`}
                          style={{ borderBottom: "1px solid var(--borders-border-subtle, var(--borders-border-subtle))" }}
                        >
                          <td style={{ ...CELL_STYLE, maxWidth: 160 }}>
                            <div>{row.testCode}</div>
                            <div style={{ color: "var(--text-text-secondary)" }}>{row.testName}</div>
                          </td>
                          {(() => {
                            const m = getConsentMapping(row.testCode);
                            return (
                              <>
                                <td style={{ ...CELL_STYLE, paddingLeft: 16, whiteSpace: "nowrap" }}>{m.category ?? "—"}</td>
                                <td style={{ ...CELL_STYLE, paddingLeft: 16, whiteSpace: "nowrap" }}>
                                  {m.sections.map((s, i) => <div key={i}>{s}</div>)}
                                </td>
                                <td style={{ ...CELL_STYLE, paddingLeft: 16, whiteSpace: "nowrap" }}>
                                  {m.responses.map((r, i) => <div key={i}>{r}</div>)}
                                </td>
                              </>
                            );
                          })()}
                          <td style={{ ...CELL_STYLE, paddingLeft: 16, textAlign: "center" }}>
                            <button
                              className="flex items-center justify-center"
                              style={{ width: 32, height: 24, margin: "0 auto" }}
                              aria-label="More actions"
                            >
                              <DotsThree size={20} weight="bold" className="text-text-secondary" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SearchPageInner() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
