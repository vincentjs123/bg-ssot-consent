"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, ArrowsDownUp, CheckCircle, X, Warning } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";

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

const headerTextStyle: React.CSSProperties = {
  ...cellTextStyle,
  fontWeight: 700,
};

const ROWS = [
  { request: "Create", type: "Test Code", title: "TBD", submittedBy: "Jane Doe", status: "Pending", lastUpdated: "04/28/2026" },
  { request: "Delete", type: "Test Code", title: "2010 - Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing", submittedBy: "Marcus Hill", status: "Pending", lastUpdated: "04/15/2026" },
  { request: "Edit", type: "Test Code", title: "1100 - Whole Genome Sequencing", submittedBy: "Sarah Chen", status: "Approved", lastUpdated: "03/30/2026" },
];

const COLS: { label: string; key: string; flex?: number; fixed?: number }[] = [
  { label: "Request", key: "request", flex: 1 },
  { label: "Type", key: "type", flex: 1 },
  { label: "Title", key: "title", flex: 3 },
  { label: "Submitted By", key: "submittedBy", flex: 2 },
  { label: "Status", key: "status", flex: 1 },
  { label: "Last Updated", key: "lastUpdated", fixed: 140 },
];

const TOAST_MESSAGES: Record<string, { text: string; type: "success" | "warning" }> = {
  approved: { text: "The request has been approved successfully.", type: "success" },
  rejected: { text: "The request has been rejected.", type: "warning" },
  created: { text: "The test code has been created successfully.", type: "success" },
  submitted: { text: "The edit request has been submitted for review.", type: "success" },
};

function AdminStatusQueueInner() {
  useRoleGuard(["administrator", "data-administrator"]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState<{ text: string; type: "success" | "warning" } | null>(null);
  const [removedCreate, setRemovedCreate] = useState(false);
  const [sortCol, setSortCol] = useState<string | null>(null);

  useEffect(() => {
    const param = searchParams.get("toast");
    if (param && TOAST_MESSAGES[param]) {
      setToast(TOAST_MESSAGES[param]);
      if (param === "created") setRemovedCreate(true);
      router.replace("/admin-status-queue", { scroll: false });
    }
  }, [searchParams, router]);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

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

  const visibleRows = removedCreate
    ? ROWS.filter((r) => !(r.request === "Create" && r.status === "Pending"))
    : ROWS;

  const sortedRows = [...visibleRows].sort((a, b) => {
    if (!sortCol) return 0;
    const aVal = (a as Record<string, string>)[sortCol] ?? '';
    const bVal = (b as Record<string, string>)[sortCol] ?? '';
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="test-codes" activeTab="status-queue" />

      {toast && (
        <div
          className="flex items-center w-full"
          style={{
            background: toast.type === "success" ? "var(--bg-ssot-toast-success)" : "var(--bg-ssot-toast-warning)",
            color: "var(--button-primary-btn-primary-text)", padding: "12px 64px", gap: 12, marginTop: 12,
          }}
        >
          {toast.type === "success"
            ? <CheckCircle size={20} weight="fill" className="shrink-0" />
            : <Warning size={20} weight="fill" className="shrink-0" />}
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", flex: 1 }}>
            {toast.text}
          </span>
          <button onClick={() => setToast(null)} className="shrink-0 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
      )}

      <main
        className="flex flex-col w-full bg-bg-page"
        
      >
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
        <p
          className="w-full text-text-primary"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: "var(--font-size-font-size-h2)",
            lineHeight: "var(--font-line-height-line-height-h2)",
            letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)",
          }}
        >
          Status Queue
        </p>

        {/* Table */}
        <div className="flex flex-col w-full">
          {/* Header row */}
          <div
            className="flex items-end w-full bg-bg-body border-b-2 border-border-subtle"
            style={{ paddingTop: 16, paddingBottom: 8 }}
          >
            {COLS.map(({ label, key, flex, fixed }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`flex items-center gap-[6px] cursor-pointer ${fixed ? 'shrink-0 justify-center' : 'min-w-0'}`}
                style={{ paddingLeft: 8, paddingRight: 8, ...(fixed ? { width: fixed } : { flex }) }}
              >
                <span style={headerTextStyle}>{label}</span>
                <SortIcon col={key} />
              </button>
            ))}
            <div className="flex items-end shrink-0 justify-center" style={{ width: 140, paddingLeft: 8, paddingRight: 8 }}>
              <span style={{ ...headerTextStyle, textAlign: "center" }}>Actions</span>
            </div>
          </div>

          {/* Data rows */}
          {sortedRows.map((row, i) => (
            <div
              key={i}
              className="flex items-center w-full bg-bg-page border-b border-border-subtle hover:bg-bg-body"
              style={{ paddingTop: 16, paddingBottom: 16 }}
            >
              <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                <span style={cellTextStyle}>{row.request}</span>
              </div>
              <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                <span style={cellTextStyle}>{row.type}</span>
              </div>
              <div className="flex items-center min-w-0" style={{ flex: 3, paddingLeft: 8, paddingRight: 8 }}>
                <span style={cellTextStyle}>{row.title}</span>
              </div>
              <div className="flex items-center min-w-0" style={{ flex: 2, paddingLeft: 8, paddingRight: 8 }}>
                <span style={cellTextStyle}>{row.submittedBy}</span>
              </div>
              <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                <span style={cellTextStyle}>{row.status}</span>
              </div>
              <div className="flex items-center justify-center shrink-0" style={{ width: 140, paddingLeft: 8, paddingRight: 8 }}>
                <span style={{ ...cellTextStyle, textAlign: "center" }}>{row.lastUpdated}</span>
              </div>
              <div className="flex items-center justify-center shrink-0" style={{ width: 140, paddingLeft: 8, paddingRight: 8 }}>
                <Link
                  href="/admin-review-submission"
                  className="flex items-center justify-center bg-bg-page border border-border-primary rounded-[4px] shrink-0"
                  style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, height: 36 }}
                >
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 18, lineHeight: "20px", color: "var(--button-primary-btn-primary-bg, var(--text-text-primary))", whiteSpace: "nowrap" }}>
                    Review
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminStatusQueue() {
  return (
    <Suspense>
      <AdminStatusQueueInner />
    </Suspense>
  );
}
