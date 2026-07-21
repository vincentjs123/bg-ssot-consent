"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { DotsThree, ArrowUp, ArrowDown, ArrowsDownUp, CheckCircle, X } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useRoleGuard } from "@/lib/useRoleGuard";
import { useRole } from "@/lib/useRole";
import { canEdit } from "@/lib/role";

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
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 700,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const ROWS = [
  { request: "Create", type: "Test Code", title: "TBD", status: "Approved", lastUpdate: "04/28/2026" },
  { request: "Delete", type: "Test Code", title: "2010 - Advanced mtDNA Point Mutations and Deletions by Massively Parallel Sequencing", status: "Pending", lastUpdate: "04/15/2026" },
  { request: "Edit", type: "Test Code", title: "1100 - Whole Genome Sequencing", status: "Approved", lastUpdate: "03/30/2026" },
];

const COLS: { label: string; key: string; flex?: number; fixed?: number }[] = [
  { label: "Request", key: "request", flex: 1 },
  { label: "Type", key: "type", flex: 1 },
  { label: "Title", key: "title", flex: 3 },
  { label: "Status", key: "status", flex: 1 },
  { label: "Last Update", key: "lastUpdate", fixed: 120 },
];

const TOAST_MESSAGES: Record<string, string> = {
  created: "The test code has been created successfully.",
};

function EditorStatusQueueInner() {
  useRoleGuard(["administrator", "data-administrator"]);
  const role = useRole();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [removedCreate, setRemovedCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const param = searchParams.get("toast");
    if (param && TOAST_MESSAGES[param]) {
      setToast(TOAST_MESSAGES[param]);
      if (param === "created") setRemovedCreate(true);
      router.replace("/editor-status-queue", { scroll: false });
    }
  }, [searchParams, router]);

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
    ? ROWS.filter((r) => !(r.request === "Create" && r.status === "Approved"))
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
          style={{ background: "var(--bg-ssot-toast-success)", color: "white", padding: "12px 64px", gap: 12, marginTop: 12 }}
        >
          <CheckCircle size={20} weight="fill" className="shrink-0" />
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", flex: 1 }}>
            {toast}
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
                <span style={{ ...headerTextStyle, overflow: fixed ? undefined : 'hidden' }}>{label}</span>
                <SortIcon col={key} />
              </button>
            ))}
            {canEdit(role) && (
              <div className="flex items-end justify-center shrink-0" style={{ width: 71, paddingLeft: 8, paddingRight: 8 }}>
                <span style={headerTextStyle}>Actions</span>
              </div>
            )}
          </div>

          {/* Data rows */}
          {sortedRows.map((row, i) => (
            <div
              key={i}
              className="relative flex items-center w-full bg-bg-page border-b border-border-subtle hover:bg-bg-body"
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
              <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
                <span style={cellTextStyle}>{row.status}</span>
              </div>
              <div className="flex items-center justify-center shrink-0" style={{ width: 120, paddingLeft: 8, paddingRight: 8 }}>
                <span style={{ ...cellTextStyle, textAlign: "center" }}>{row.lastUpdate}</span>
              </div>
              {canEdit(role) && <div className="flex items-center justify-center relative shrink-0" style={{ width: 71, paddingLeft: 8, paddingRight: 8 }}>
                <button
                  className="flex items-center justify-center cursor-pointer"
                  onClick={() => setMenuOpen(menuOpen === i ? null : i)}
                  aria-label="Actions menu"
                >
                  <DotsThree size={24} weight="bold" className="text-text-primary" />
                </button>
                {menuOpen === i && (
                  <div
                    className="absolute bg-bg-page border border-border-subtle rounded-[4px] shadow-popover z-10"
                    style={{ right: 8, top: "100%", minWidth: 180, padding: 16 }}
                  >
                    <div className="flex flex-col" style={{ gap: 16 }}>
                      {row.request === "Create" && row.status === "Approved" ? (
                        <Link
                          href="/create-new-test-code"
                          className="underline whitespace-nowrap"
                          style={{ ...cellTextStyle, display: "block" }}
                          onClick={() => setMenuOpen(null)}
                        >
                          Create New Test Code
                        </Link>
                      ) : (
                        <span
                          className="whitespace-nowrap cursor-default"
                          style={{ ...cellTextStyle, display: "block", color: "var(--text-text-muted, var(--text-text-muted))" }}
                        >
                          Create New Test Code
                        </span>
                      )}
                      <span
                        className="underline whitespace-nowrap cursor-pointer"
                        style={{ ...cellTextStyle, display: "block" }}
                        onClick={() => setMenuOpen(null)}
                      >
                        Cancel Request
                      </span>
                    </div>
                  </div>
                )}
              </div>}
            </div>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}

export default function EditorStatusQueue() {
  return (
    <Suspense>
      <EditorStatusQueueInner />
    </Suspense>
  );
}
