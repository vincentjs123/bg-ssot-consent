"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, ArrowsDownUp, DotsThree, CheckCircle, X } from "@phosphor-icons/react";
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

const headerTextStyle: React.CSSProperties = { ...cellTextStyle, fontWeight: 700 };

const ROWS = [
  { request: "Create", type: "Consent", title: "Biomarker Research Consent", status: "Approved", lastUpdate: "04/28/2026" },
  { request: "Edit", type: "Consent", title: "Germline Research Consent", status: "Pending", lastUpdate: "04/20/2026" },
  { request: "Edit", type: "Consent", title: "Standard Genetic Testing Consent", status: "Approved", lastUpdate: "04/10/2026" },
];

const COLS = [
  { label: "Request", key: "request", flex: 1 },
  { label: "Type", key: "type", flex: 1 },
  { label: "Title", key: "title", flex: 3 },
  { label: "Status", key: "status", flex: 1 },
  { label: "Last Update", key: "lastUpdate", fixed: 120 },
];

const TOAST_MESSAGES: Record<string, string> = {
  created: "The consent has been created successfully.",
  submitted: "Your edit request has been submitted successfully.",
};

function ConsentsEditorStatusQueueInner() {
  useRoleGuard(["administrator", "data-administrator"]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [removedCreate, setRemovedCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const param = searchParams.get("toast");
    if (param && TOAST_MESSAGES[param]) {
      setToast(TOAST_MESSAGES[param]);
      if (param === "created") setRemovedCreate(true);
      router.replace("/consents-editor-status-queue", { scroll: false });
    }
  }, [searchParams, router]);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ArrowsDownUp size={12} className="shrink-0" style={{ color: "var(--text-text-muted)" }} />;
    return sortDir === "asc" ? <ArrowUp size={12} className="shrink-0 text-text-primary" /> : <ArrowDown size={12} className="shrink-0 text-text-primary" />;
  }

  const visibleRows = removedCreate
    ? ROWS.filter((r) => !(r.request === "Create" && r.status === "Approved"))
    : ROWS;

  const sortedRows = [...visibleRows].sort((a, b) => {
    if (!sortCol) return 0;
    const aVal = (a as Record<string, string>)[sortCol] ?? "";
    const bVal = (b as Record<string, string>)[sortCol] ?? "";
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <AppHeader domain="consents" activeTab="status-queue" />

      {toast && (
        <div className="flex items-center w-full" style={{ background: "var(--bg-ssot-toast-success)", color: "white", padding: "12px 64px", gap: 12, marginTop: 12 }}>
          <CheckCircle size={20} weight="fill" className="shrink-0" />
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} className="shrink-0"><X size={20} /></button>
        </div>
      )}

      <main className="flex flex-col w-full bg-bg-page">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto" style={{ paddingTop: 32, paddingBottom: 60, paddingLeft: 64, paddingRight: 64, gap: 32 }}>
          <p className="w-full text-text-primary" style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "var(--font-size-font-size-h2)", lineHeight: "var(--font-line-height-line-height-h2)", letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)" }}>
            Status Queue — Consents
          </p>

          <div className="flex flex-col w-full">
            <div className="flex items-end w-full bg-bg-body border-b-2 border-border-subtle" style={{ paddingTop: 16, paddingBottom: 8 }}>
              {COLS.map(({ label, key, flex, fixed }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`flex items-center gap-[6px] cursor-pointer ${fixed ? "shrink-0 justify-center" : "min-w-0"}`}
                  style={{ paddingLeft: 8, paddingRight: 8, ...(fixed ? { width: fixed } : { flex }) }}
                >
                  <span style={headerTextStyle}>{label}</span>
                  <SortIcon col={key} />
                </button>
              ))}
              <div className="flex items-end shrink-0 justify-center" style={{ width: 71, paddingLeft: 8, paddingRight: 8 }}>
                <span style={headerTextStyle}>Actions</span>
              </div>
            </div>

            {sortedRows.map((row, i) => (
              <div key={i} className="relative flex items-center w-full bg-bg-page border-b border-border-subtle hover:bg-bg-body" style={{ paddingTop: 16, paddingBottom: 16 }}>
                <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}><span style={cellTextStyle}>{row.request}</span></div>
                <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}><span style={cellTextStyle}>{row.type}</span></div>
                <div className="flex items-center min-w-0" style={{ flex: 3, paddingLeft: 8, paddingRight: 8 }}><span style={cellTextStyle}>{row.title}</span></div>
                <div className="flex items-center min-w-0" style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}><span style={cellTextStyle}>{row.status}</span></div>
                <div className="flex items-center justify-center shrink-0" style={{ width: 120, paddingLeft: 8, paddingRight: 8 }}><span style={{ ...cellTextStyle, textAlign: "center" }}>{row.lastUpdate}</span></div>
                <div className="flex items-center justify-center relative shrink-0" style={{ width: 71, paddingLeft: 8, paddingRight: 8 }}>
                  <button className="flex items-center justify-center cursor-pointer" onClick={() => setMenuOpen(menuOpen === i ? null : i)} aria-label="Actions menu">
                    <DotsThree size={24} weight="bold" className="text-text-primary" />
                  </button>
                  {menuOpen === i && (
                    <div className="absolute bg-bg-page border border-border-subtle rounded-[4px] shadow-popover z-10" style={{ right: 8, top: "100%", minWidth: 200, padding: 16 }}>
                      <div className="flex flex-col" style={{ gap: 16 }}>
                        {row.request === "Create" && row.status === "Approved" ? (
                          <a href="/create-new-consent" className="underline whitespace-nowrap" style={{ ...cellTextStyle, display: "block" }} onClick={() => setMenuOpen(null)}>
                            Create New Consent
                          </a>
                        ) : (
                          <span className="whitespace-nowrap cursor-default" style={{ ...cellTextStyle, display: "block", color: "var(--text-text-muted, var(--text-text-muted))" }}>
                            Create New Consent
                          </span>
                        )}
                        <span className="underline whitespace-nowrap cursor-pointer" style={{ ...cellTextStyle, display: "block" }} onClick={() => setMenuOpen(null)}>
                          Cancel Request
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ConsentsEditorStatusQueue() {
  return (
    <Suspense>
      <ConsentsEditorStatusQueueInner />
    </Suspense>
  );
}
