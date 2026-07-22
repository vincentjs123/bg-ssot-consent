"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { UserCircle } from "@phosphor-icons/react";
import { useRole } from "@/lib/useRole";
import { canManage } from "@/lib/role";

export type AppTab = "test-codes" | "consents" | "payers" | "status-queue";
export type Domain = "test-codes" | "consents" | "payers";

interface AppHeaderProps {
  domain: Domain;
  activeTab?: AppTab;
  showCreateConsent?: boolean;
}

const DOMAIN_CONFIG: Record<Domain, { tabId: AppTab; label: string; icon: string; href: string; statusQueueHref: string }> = {
  "consents": {
    tabId: "consents",
    label: "Consents",
    icon: "/assets/icon.png",
    href: "/consents",
    statusQueueHref: "/consents-admin-status-queue",
  },
  "test-codes": {
    tabId: "test-codes",
    label: "Test Codes",
    icon: "/assets/test-kit.png",
    href: "/dashboard",
    statusQueueHref: "/admin-status-queue",
  },
  "payers": {
    tabId: "payers",
    label: "Payers",
    icon: "/assets/insurance.png",
    href: "/dashboard",
    statusQueueHref: "/admin-status-queue",
  },
};

const MENU_ITEMS: { label: string; id: Domain }[] = [
  { label: "Test Codes", id: "test-codes" },
  { label: "Consents", id: "consents" },
  { label: "Payers", id: "payers" },
];

export default function AppHeader({ domain, activeTab, showCreateConsent = false }: AppHeaderProps) {
  const role = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const config = DOMAIN_CONFIG[domain];
  const showStatusQueue = false && canManage(role);

  const TABS: { id: AppTab; label: string; icon: string; href: string }[] = [
    { id: config.tabId, label: config.label, icon: config.icon, href: config.href },
    ...(showStatusQueue
      ? [{ id: "status-queue" as AppTab, label: "Status Queue", icon: "/assets/queue.png", href: config.statusQueueHref }]
      : []),
  ];

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  return (
    <header
      className="bg-bg-page w-full shrink-0 sticky top-0 z-10"
      style={{ boxShadow: "0px 4px 12px var(--bg-ssot-shadow-header)" }}
    >
      {/* Primary navigation */}
      <div className="flex items-center w-full max-w-[1280px] mx-auto" style={{ paddingLeft: 64, paddingRight: 64, paddingTop: 16, paddingBottom: 16, gap: 24 }}>
        {/* Logo + subtitle */}
        <div className="flex flex-1 flex-col items-start justify-center" style={{ gap: 8 }}>
          <div style={{ width: 176, height: 20.849, position: "relative" }}>
            <Image src="/assets/logo.png" alt="Baylor Genetics" fill sizes="176px" className="object-contain object-left" />
          </div>
          <span
            className="text-text-primary whitespace-nowrap"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontSize: "var(--font-size-font-size-h2)",
              fontWeight: "var(--font-weight-font-weight-h2)",
              lineHeight: "var(--font-line-height-line-height-h2)",
              letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)",
            }}
          >
            Source Repositories
          </span>
        </div>

        {/* Right side — role label + profile + hamburger */}
        <div className="flex items-center justify-end" style={{ gap: 24 }}>
          {/* Role label */}
          {role && (
            <span
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "var(--text-text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              {role === "administrator"
                ? "Administrator"
                : role === "data-administrator"
                ? "Data Administrator"
                : "Viewer"}
            </span>
          )}

          {/* User icon — returns to role selection */}
          <Link
            href="/"
            className="flex items-center justify-center text-text-primary"
            aria-label="Return to role selection"
            style={{ width: 32, height: 32 }}
          >
            <UserCircle size={32} />
          </Link>

          {/* Hamburger menu */}
          <div className="relative" ref={menuRef}>
            <button
              aria-label="Main menu"
              className="flex items-center justify-center"
              style={{ width: 32, height: 32 }}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-primary" />
              </svg>
            </button>
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "var(--bg-bg-page, white)",
                  border: "1px solid var(--borders-border-subtle, var(--borders-border-subtle))",
                  borderRadius: 4,
                  boxShadow: "0px 4px 12px var(--bg-ssot-shadow-dropdown)",
                  minWidth: 180,
                  zIndex: 30,
                  padding: "8px 0",
                }}
              >
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={DOMAIN_CONFIG[item.id].href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center w-full hover:bg-bg-body"
                    style={{
                      padding: "10px 16px",
                      fontFamily: "var(--font-barlow), sans-serif",
                      fontWeight: item.id === domain ? 600 : 400,
                      fontSize: 15,
                      lineHeight: "22px",
                      color: "var(--text-text-primary)",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary navigation — tab bar */}
      <nav className="bg-bg-body border-b border-border-subtle" style={{ height: 58 }}>
        <div className="flex items-center w-full max-w-[1280px] mx-auto" style={{ paddingLeft: 64, paddingRight: 64, paddingTop: 8, gap: 60 }}>
          <div className="flex items-start flex-1" style={{ gap: 60 }}>
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <Link key={tab.id} href={tab.href} className="flex flex-col items-start" style={{ height: 50 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ padding: 12, gap: 8, borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
                  >
                    <div style={{ width: 24, height: 24, position: "relative", flexShrink: 0 }}>
                      <Image src={tab.icon} alt="" fill sizes="24px" className="object-contain" />
                    </div>
                    <span
                      className="text-text-primary whitespace-nowrap"
                      style={{
                        fontFamily: "var(--font-barlow), sans-serif",
                        fontSize: "var(--font-size-font-size-body-lg)",
                        fontWeight: "var(--font-weight-font-weight-body-lg-regular)",
                        lineHeight: "var(--font-line-height-line-height-body-lg)",
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-full shrink-0" style={{ height: 2, backgroundColor: "var(--borders-border-primary)" }} />
                  )}
                </Link>
              );
            })}
          </div>
          {showCreateConsent && canManage(role) && (
            <Link
              href="/create-new-consent"
              className="flex items-center justify-center bg-btn-primary-bg rounded-[4px] shrink-0"
              style={{ height: 36, paddingLeft: 16, paddingRight: 16, marginBottom: 8 }}
            >
              <span
                className="text-btn-primary-text whitespace-nowrap"
                style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 500, fontSize: 15, lineHeight: "20px" }}
              >
                Create New Consent
              </span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
