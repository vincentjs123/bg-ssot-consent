"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/lib/useRole";
import { canEdit } from "@/lib/role";
import {
  MagnifyingGlass,
  Funnel,
  Table,
  Export,
  ArrowCounterClockwise,
  X,
  DotsThree,
  CaretDown,
  CalendarBlank,
  ArrowUp,
  ArrowDown,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";

const MOCK_ROWS = [
  { code: "2010", name: "Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing", category: "Mito", cpt: "81228x1, 89398", price: "$ 450.00", billable: true, nyApproval: true },
  { code: "1100", name: "Whole Genome Sequencing [Placeholder]", category: "WGS", cpt: "81425", price: "$ 6,000.00", billable: true, nyApproval: false },
  { code: "3200", name: "Hereditary Breast and Ovarian Cancer Panel [Placeholder]", category: "NGS", cpt: "81432, 81433", price: "$ 2,800.00", billable: true, nyApproval: true },
  { code: "4050", name: "Chromosomal Microarray Analysis [Placeholder]", category: "CMA", cpt: "81228", price: "$ 1,200.00", billable: false, nyApproval: false },
  { code: "5500", name: "Non-Invasive Prenatal Testing [Placeholder]", category: "NIPT", cpt: "81422", price: "$ 900.00", billable: true, nyApproval: true },
];

const toolbarBtnClass =
  "flex h-[36px] items-center justify-center gap-[4px] px-[16px] py-[12px] bg-bg-page border border-border-subtle rounded-[4px] cursor-pointer shrink-0";

const toolbarBtnTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "normal",
  color: "var(--button-primary-btn-primary-bg)",
  whiteSpace: "nowrap",
};

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  background: "var(--background-bg-page, white)",
  border: "1px solid var(--borders-border-subtle, var(--borders-border-subtle))",
  borderRadius: 4,
  boxShadow: "0px 3px 2px var(--bg-ssot-shadow-hover)",
  zIndex: 20,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "normal",
  color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))",
  whiteSpace: "nowrap",
};

const menuLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "normal",
  color: "var(--text-text-primary, var(--text-text-primary))",
  textDecoration: "underline",
  whiteSpace: "nowrap",
  display: "block",
};

const CUSTOMIZE_COLUMNS = [
  { label: "Test Code", checked: true },
  { label: "Test Name", checked: true },
  { label: "Category", checked: true },
  { label: "Billing (Insurance)", checked: true },
  { label: "Billing (Self-Pay)", checked: false },
  { label: "Billing (Institutional)", checked: false },
  { label: "CPT Codes", checked: true },
  { label: "Specimen Type", checked: false },
  { label: "Kit Type", checked: false },
  { label: "Availability Date", checked: false },
  { label: "Retirement Date", checked: false },
  { label: "NY State Approved", checked: false },
  { label: "Consent", checked: false },
];

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start" style={{ gap: 12 }}>
      <button
        onClick={onChange}
        className="flex items-start shrink-0 rounded-[2px]"
        style={{
          width: 24,
          height: 24,
          padding: 2,
          backgroundColor: checked ? "var(--button-primary-btn-primary-bg, var(--text-text-primary))" : "transparent",
          border: checked ? "none" : "1px solid var(--borders-border-strong)",
        }}
      >
        {checked && (
          <svg viewBox="0 0 20 16" fill="none" className="w-full h-full">
            <path d="M1.5 8L7.5 14L18.5 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "24px",
          color: "var(--text-text-primary, var(--text-text-primary))",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const role = useRole();
  const [searchValue, setSearchValue] = useState("");
  const [actionsOpen, setActionsOpen] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBilling, setFilterBilling] = useState('');
  const [filterNyApproval, setFilterNyApproval] = useState(false);

  function resetFilters() {
    setFilterCategory('');
    setFilterBilling('');
    setFilterNyApproval(false);
  }

  // Customize Table state
  const [columns, setColumns] = useState(CUSTOMIZE_COLUMNS.map((c) => c.checked));

  const toggleColumn = (i: number) => {
    setColumns((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const resetColumns = () => setColumns(CUSTOMIZE_COLUMNS.map((c) => c.checked));

  function handleSort(col: string) {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ArrowsDownUp size={12} className="shrink-0" style={{ color: "var(--text-text-muted)" }} />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="shrink-0 text-text-primary" />
      : <ArrowDown size={12} className="shrink-0 text-text-primary" />;
  }

  const COLS: { label: string; key: string; flex: number }[] = [
    { label: "Test Code", key: "code", flex: 1 },
    { label: "Test Name", key: "name", flex: 4 },
    { label: "Category", key: "category", flex: 1 },
    { label: "CPT Codes", key: "cpt", flex: 2 },
    { label: "Price (Ins)", key: "price", flex: 1 },
  ];

  const sortedRows = [...MOCK_ROWS].sort((a, b) => {
    if (!sortCol) return 0;
    const aVal = String((a as unknown as Record<string, unknown>)[sortCol] ?? '');
    const bVal = String((b as unknown as Record<string, unknown>)[sortCol] ?? '');
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const filteredRows = sortedRows.filter(row => {
    if (filterCategory && row.category !== filterCategory) return false;
    if (filterBilling === 'Billable' && !row.billable) return false;
    if (filterBilling === 'Non-Billable' && row.billable) return false;
    if (filterNyApproval && !row.nyApproval) return false;
    return true;
  });

  // Per-overlay refs for outside-click dismissal
  const filterRef = useRef<HTMLDivElement>(null);
  const customizeRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (filterRef.current && !filterRef.current.contains(t)) setFiltersOpen(false);
      if (customizeRef.current && !customizeRef.current.contains(t)) setCustomizeOpen(false);
      if (exportRef.current && !exportRef.current.contains(t)) setExportOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAll = () => {
    setActionsOpen(null);
    setFiltersOpen(false);
    setCustomizeOpen(false);
    setExportOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="test-codes" />

      <main className="flex flex-col w-full">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
        {/* Page header: title + search bar */}
        <div className="flex flex-col w-full" style={{ gap: 24 }}>
          <p
            className="text-text-primary w-full"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 300,
              fontSize: "var(--font-size-font-size-h2)",
              lineHeight: "var(--font-line-height-line-height-h2)",
              letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)",
              maxWidth: 1272,
            }}
          >
            Search Test Codes
          </p>

          {/* Search input row */}
          <div className="flex items-center w-full" style={{ gap: 16, height: 36 }}>
              {/* Search input */}
              <div
                className="flex flex-1 items-center bg-bg-page border border-border-subtle rounded-[4px]"
                style={{ height: 36, paddingLeft: 12, paddingRight: 4 }}
              >
                <MagnifyingGlass size={24} className="text-text-primary shrink-0" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search by test name, test code, category, etc."
                  className="flex-1 min-w-0 bg-transparent outline-none px-[12px]"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "var(--text-text-primary)",
                  }}
                />
                {searchValue && (
                  <button
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 24, height: 24 }}
                    onClick={() => setSearchValue("")}
                    aria-label="Clear search"
                  >
                    <X size={24} className="text-text-primary" />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="relative shrink-0" ref={filterRef}>
                <button
                  className={toolbarBtnClass}
                  onClick={() => { closeAll(); setFiltersOpen((v) => !v); }}
                >
                  <Funnel size={20} style={{ color: "var(--button-primary-btn-primary-bg)", flexShrink: 0 }} />
                  <span style={toolbarBtnTextStyle}>Filter</span>
                </button>
                {filtersOpen && (
                  <div style={{ ...overlayStyle, padding: 16, display: "flex", flexDirection: "column", gap: 24, minWidth: 336 }}>
                    {/* Header */}
                    <div className="flex flex-col items-start w-full bg-bg-page">
                      <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px", color: "var(--text-text-primary)", width: "100%" }}>
                        Filters
                      </p>
                      <div className="w-full border-b border-border-subtle" />
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col items-start" style={{ gap: 16 }}>
                      {/* Test Category */}
                      <div className="flex flex-col items-start bg-bg-page w-full" style={{ gap: 4 }}>
                        <p style={labelStyle}>Test Category</p>
                        <div className="relative w-full">
                          <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full bg-bg-page border border-border-subtle rounded-[4px] appearance-none cursor-pointer"
                            style={{ height: 36, paddingLeft: 12, paddingRight: 32, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: filterCategory ? "var(--text-text-primary)" : "var(--text-text-muted, var(--text-text-muted))", outline: "none" }}
                          >
                            <option value="">All Categories</option>
                            <option value="Bio">Bio</option>
                            <option value="Carrier">Carrier</option>
                            <option value="CMA">CMA</option>
                            <option value="Cyto">Cyto</option>
                            <option value="Mito">Mito</option>
                            <option value="NGS">NGS</option>
                            <option value="NIPT">NIPT</option>
                            <option value="Other">Other</option>
                            <option value="PGx">PGx</option>
                            <option value="WES">WES</option>
                            <option value="WGS">WGS</option>
                          </select>
                          <CaretDown size={14} className="pointer-events-none text-text-primary absolute right-[10px] top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Billing */}
                      <div className="flex flex-col items-start bg-bg-page w-full" style={{ gap: 4 }}>
                        <p style={labelStyle}>Billing</p>
                        <div className="relative w-full">
                          <select
                            value={filterBilling}
                            onChange={(e) => setFilterBilling(e.target.value)}
                            className="w-full bg-bg-page border border-border-subtle rounded-[4px] appearance-none cursor-pointer"
                            style={{ height: 36, paddingLeft: 12, paddingRight: 32, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", color: filterBilling ? "var(--text-text-primary)" : "var(--text-text-muted, var(--text-text-muted))", outline: "none" }}
                          >
                            <option value="">All</option>
                            <option value="Billable">Billable</option>
                            <option value="Non-Billable">Non-Billable</option>
                          </select>
                          <CaretDown size={14} className="pointer-events-none text-text-primary absolute right-[10px] top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Availability Date */}
                      <div className="flex flex-col items-start w-full" style={{ gap: 4 }}>
                        <p style={labelStyle}>Availability Date</p>
                        <div className="relative w-full">
                          <input
                            type="date"
                            className="w-full bg-bg-page border border-border-subtle rounded-[4px]"
                            style={{ height: 36, paddingLeft: 12, paddingRight: 12, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, color: "var(--text-text-primary)", outline: "none" }}
                          />
                        </div>
                      </div>

                      {/* Retirement Date */}
                      <div className="flex flex-col items-start w-full" style={{ gap: 4 }}>
                        <p style={labelStyle}>Retirement Date</p>
                        <div className="relative w-full">
                          <input
                            type="date"
                            className="w-full bg-bg-page border border-border-subtle rounded-[4px]"
                            style={{ height: 36, paddingLeft: 12, paddingRight: 12, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, color: "var(--text-text-primary)", outline: "none" }}
                          />
                        </div>
                      </div>

                      {/* Regulatory */}
                      <div className="flex flex-col items-start" style={{ gap: 8 }}>
                        <p style={labelStyle}>Regulatory</p>
                        <CheckboxRow label="NY State Approval" checked={filterNyApproval} onChange={() => setFilterNyApproval((v) => !v)} />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center w-full" style={{ gap: 16 }}>
                      <button
                        className="flex flex-1 items-center justify-center bg-bg-page border rounded-[4px]"
                        style={{ height: 36, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, borderColor: "var(--text-text-primary)" }}
                        onClick={resetFilters}
                      >
                        <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "20px", color: "var(--text-text-primary)", whiteSpace: "nowrap" }}>Reset</span>
                      </button>
                      <button
                        className="flex flex-1 items-center justify-center bg-btn-primary-bg rounded-[4px]"
                        style={{ height: 36, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}
                        onClick={() => setFiltersOpen(false)}
                      >
                        <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "20px", whiteSpace: "nowrap" }}>Close</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Customize Table */}
              <div className="relative shrink-0" ref={customizeRef}>
                <button
                  className={toolbarBtnClass}
                  onClick={() => { closeAll(); setCustomizeOpen((v) => !v); }}
                >
                  <Table size={20} style={{ color: "var(--button-primary-btn-primary-bg)", flexShrink: 0 }} />
                  <span style={toolbarBtnTextStyle}>Customize Table</span>
                </button>
                {customizeOpen && (
                  <div style={{ ...overlayStyle, padding: 16, display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Title */}
                    <div className="flex flex-col items-start w-full bg-bg-page">
                      <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "28px", color: "var(--text-text-primary)", width: "100%" }}>
                        Customize Table
                      </p>
                      <div className="w-full border-b border-border-subtle" />
                    </div>
                    {/* Checkboxes */}
                    <div className="flex flex-col items-start" style={{ gap: 16 }}>
                      {CUSTOMIZE_COLUMNS.map((col, i) => (
                        <CheckboxRow key={col.label} label={col.label} checked={columns[i]} onChange={() => toggleColumn(i)} />
                      ))}
                    </div>
                    {/* Buttons */}
                    <div className="flex items-center w-full" style={{ gap: 16 }}>
                      <button
                        className="flex flex-1 items-center justify-center bg-bg-page border rounded-[4px]"
                        style={{ height: 36, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, borderColor: "var(--text-text-primary)" }}
                        onClick={resetColumns}
                      >
                        <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "20px", color: "var(--text-text-primary)", whiteSpace: "nowrap" }}>Reset</span>
                      </button>
                      <button
                        className="flex flex-1 items-center justify-center bg-btn-primary-bg rounded-[4px]"
                        style={{ height: 36, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}
                        onClick={() => setCustomizeOpen(false)}
                      >
                        <span className="text-btn-primary-text" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "20px", whiteSpace: "nowrap" }}>Close</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Export */}
              <div className="relative shrink-0" ref={exportRef}>
                <button
                  className={toolbarBtnClass}
                  onClick={() => { closeAll(); setExportOpen((v) => !v); }}
                >
                  <Export size={20} style={{ color: "var(--button-primary-btn-primary-bg)", flexShrink: 0 }} />
                  <span style={toolbarBtnTextStyle}>Export</span>
                </button>
                {exportOpen && (
                  <div style={{ ...overlayStyle, padding: 20, minWidth: 180, display: "flex", flexDirection: "column", gap: 16 }}>
                    <span style={menuLinkStyle} className="cursor-pointer" onClick={() => setExportOpen(false)}>Export Current Results (CSV)</span>
                    <span style={menuLinkStyle} className="cursor-pointer" onClick={() => setExportOpen(false)}>Export Full Catalog (CSV)</span>
                  </div>
                )}
              </div>

              {/* Reset filters */}
              <button
                className="flex items-center justify-center bg-bg-page border border-border-subtle rounded-[4px] shrink-0 cursor-pointer"
                style={{ width: 36, height: 36, padding: 10 }}
                aria-label="Reset filters"
                onClick={() => { closeAll(); resetFilters(); }}
              >
                <ArrowCounterClockwise size={24} className="text-text-primary" />
              </button>

            {/* CTA — visible to editors and admins only */}
            {canEdit(role) && (
              <button
                className="flex items-center justify-center bg-btn-primary-bg rounded-[4px] shrink-0"
                style={{ height: 36, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}
              >
                <span
                  className="text-btn-primary-text whitespace-nowrap"
                  style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: "20px" }}
                >
                  Request New Test Code
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="flex flex-col w-full" style={{ gap: 60 }}>
          <div className="flex flex-col w-full" style={{ gap: 24 }}>
            <p
              className="text-text-primary w-full"
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 20,
                lineHeight: "28px",
              }}
            >
              Top 5 Viewed Tests
            </p>

            {/* Table */}
            <div className="flex flex-col w-full">
              {/* Header row */}
              <div
                className="flex items-end w-full bg-bg-body border-b-2 border-border-subtle"
                style={{ paddingTop: 16, paddingBottom: 8 }}
              >
                {COLS.map(({ label, key, flex }) => (
                  <button key={key} onClick={() => handleSort(key)} className="flex items-center min-w-0 gap-[6px] cursor-pointer" style={{ flex, paddingLeft: 8, paddingRight: 8 }}>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px" }}>
                      {label}
                    </span>
                    <SortIcon col={key} />
                  </button>
                ))}
                <div className="flex items-end shrink-0 justify-center" style={{ width: 71, paddingLeft: 8, paddingRight: 8 }}>
                  <span className="text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px" }}>Actions</span>
                </div>
              </div>

              {/* Data rows */}
              {filteredRows.map((row, i) => (
                <div
                  key={i}
                  className="relative flex items-center w-full bg-bg-page border-b border-border-subtle hover:bg-bg-body"
                  style={{ paddingTop: 16, paddingBottom: 16 }}
                >
                  <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                    <Link
                      href="/test-code-details"
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-text-primary hover:underline"
                      style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px" }}
                    >
                      {row.code}
                    </Link>
                  </div>
                  <div className="flex items-center min-w-0" style={{ flex: 4, paddingLeft: 8, paddingRight: 8 }}>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px" }}>
                      {row.name}
                    </span>
                  </div>
                  <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px" }}>
                      {row.category}
                    </span>
                  </div>
                  <div className="flex items-center min-w-0" style={{ flex: 2, paddingLeft: 8, paddingRight: 8 }}>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px" }}>
                      {row.cpt}
                    </span>
                  </div>
                  <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px" }}>
                      {row.price}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center justify-center relative shrink-0" style={{ width: 71, paddingLeft: 8, paddingRight: 8 }}>
                    <button
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => { closeAll(); setActionsOpen(actionsOpen === i ? null : i); }}
                      aria-label="Actions menu"
                    >
                      <DotsThree size={24} weight="bold" className="text-text-primary" />
                    </button>
                    {actionsOpen === i && (
                      <div style={{ ...overlayStyle, padding: 20, minWidth: 180, right: 0, left: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                        <Link href="/test-code-details" style={menuLinkStyle} onClick={closeAll}>View Details</Link>
                        {canEdit(role) && <Link href="/request-edit" style={menuLinkStyle} onClick={closeAll}>Request Edit</Link>}
                        {canEdit(role) && <Link href="/request-delete" style={menuLinkStyle} onClick={closeAll}>Request Delete</Link>}
                        <span style={{ ...menuLinkStyle, cursor: "default" }}>Export Details</span>
                        <Link href="/test-code-version-history" style={menuLinkStyle} onClick={closeAll}>View History</Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
