"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveRole, clearRole, UserRole } from "@/lib/role";

const DOMAINS = [
  { id: "test-codes", label: "Test Codes", icon: "/assets/test-kit.png", href: "/dashboard" },
  { id: "consents", label: "Consents", icon: "/assets/icon.png", href: "/consents" },
  { id: "payers", label: "Payers", icon: "/assets/insurance.png", href: "/dashboard" },
];

const DOMAIN_ROLES: Record<string, { id: string; title: string; permissions: string[] }[]> = {
  "test-codes": [
    {
      id: "viewer",
      title: "Viewer",
      permissions: [
        "View all test records",
        "Search and filter catalog data",
        "Export reports or reference materials",
        "No editing, approval, or publishing capabilities",
      ],
    },
    {
      id: "data-administrator",
      title: "Data Administrator",
      permissions: [
        "Create and edit test records",
        "Maintain core test attributes (test codes, specimen requirements, methodology, TAT, etc.)",
        "Initiate and manage change requests",
        "Publish approved updates",
        "Retire or archive tests",
        "Manage test code attribute structure",
      ],
    },
    {
      id: "administrator",
      title: "Administrator",
      permissions: [
        "Full system access",
        "Create, edit, archive, or delete test records",
        "Manage users, roles, and permissions",
        "Configure workflows and integrations",
        "Override workflows when required",
        "Access full audit logs and version history",
      ],
    },
  ],
  "consents": [
    {
      id: "viewer",
      title: "Viewer",
      permissions: [
        "View all consent records",
        "Search and filter consent data",
        "Export reports and reference materials",
        "No editing, approval, or publishing capability",
      ],
    },
    {
      id: "data-administrator",
      title: "Data Administrator",
      permissions: [
        "Create and edit consent records",
        "Maintain consent language attributes",
        "Initiate and manage change requests",
        "Publish approved updates",
        "Retire or archive consent language",
        "Manage consent attribute structure",
      ],
    },
    {
      id: "administrator",
      title: "Administrator",
      permissions: [
        "Full system access",
        "Create, edit, archive, or delete consent records",
        "Manage users, roles, and permissions",
        "Configure workflows and integrations",
        "Approve or reject change requests",
        "Override workflows when required",
        "Access full audit logs and version history",
      ],
    },
  ],
  "payers": [
    {
      id: "viewer",
      title: "Viewer",
      permissions: [
        "View all payer records",
        "Search and filter payer data",
        "Export reports and reference materials",
        "No editing, approval, or publishing capability",
      ],
    },
    {
      id: "data-administrator",
      title: "Data Administrator",
      permissions: [
        "Create and edit payer records",
        "Maintain payer attributes",
        "Initiate and manage change requests",
        "Publish approved updates",
        "Retire or archive payer records",
      ],
    },
    {
      id: "administrator",
      title: "Administrator",
      permissions: [
        "Full system access",
        "Create, edit, archive, or delete payer records",
        "Manage users, roles, and permissions",
        "Configure workflows and integrations",
        "Approve or reject change requests",
        "Override workflows when required",
        "Access full audit logs and version history",
      ],
    },
  ],
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 500,
  fontSize: 14,
  lineHeight: "16px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "var(--text-text-secondary)",
};

export default function RoleSelection() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => { clearRole(); }, []);

  // Reset role whenever domain changes
  function handleDomainSelect(id: string) {
    setSelectedDomain(id);
    setSelectedRole(null);
  }

  const roles = selectedDomain ? DOMAIN_ROLES[selectedDomain] : [];
  const canContinue = selectedDomain !== null && selectedRole !== null;

  function handleContinue() {
    if (!selectedRole || !selectedDomain) return;
    saveRole(selectedRole as UserRole);
    const domain = DOMAINS.find((d) => d.id === selectedDomain);
    router.push(domain?.href ?? "/dashboard");
  }

  return (
    <div
      className="flex flex-col items-center bg-bg-body"
      style={{ minHeight: "100vh", padding: "64px 64px 80px" }}
    >
      {/* Logo + product name */}
      <div className="flex flex-col items-center" style={{ gap: 12, marginBottom: 64 }}>
        <div style={{ width: 220, height: 26, position: "relative" }}>
          <Image src="/assets/logo.png" alt="Baylor Genetics" fill className="object-contain" />
        </div>
        <p
          className="text-text-primary"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 300,
            fontSize: "var(--font-size-font-size-h2)",
            lineHeight: "var(--font-line-height-line-height-h2)",
            letterSpacing: "var(--font-letter-spacing-letter-spacing-h2)",
          }}
        >
          Source Repositories
        </p>
      </div>

      <div className="flex flex-col items-center w-full" style={{ gap: 48, maxWidth: 960 }}>

        {/* Step 1 — Domain */}
        <div className="flex flex-col w-full" style={{ gap: 20 }}>
          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            <p style={labelStyle}>Step 1</p>
            <p
              className="text-text-primary"
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 300,
                fontSize: "var(--font-size-font-size-h3)",
                lineHeight: "var(--font-line-height-line-height-h3)",
              }}
            >
              Select a content domain
            </p>
          </div>

          <div className="flex items-stretch w-full" style={{ gap: 24 }}>
            {DOMAINS.map((domain) => {
              const isSelected = selectedDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain.id)}
                  className="flex flex-col flex-1 items-center justify-center bg-bg-page rounded-[4px]"
                  style={{
                    padding: "28px 24px",
                    gap: 16,
                    cursor: "pointer",
                    border: isSelected
                      ? "2px solid var(--borders-border-primary, var(--text-text-primary))"
                      : "1px solid var(--borders-border-subtle, var(--borders-border-subtle))",
                    boxShadow: isSelected ? "0px 4px 12px var(--bg-ssot-shadow-hover)" : "none",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                >
                  <div style={{ width: 40, height: 40, position: "relative", opacity: isSelected ? 1 : 0.6 }}>
                    <Image src={domain.icon} alt="" fill className="object-contain" />
                  </div>
                  <p
                    className="text-text-primary"
                    style={{
                      fontFamily: "var(--font-barlow), sans-serif",
                      fontWeight: isSelected ? 500 : 400,
                      fontSize: 18,
                      lineHeight: "24px",
                    }}
                  >
                    {domain.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 — Role (only renders after domain is selected) */}
        {selectedDomain && (
          <>
            <div className="w-full border-b border-border-subtle" />

            <div className="flex flex-col w-full" style={{ gap: 20 }}>
              <div className="flex flex-col items-center" style={{ gap: 4 }}>
                <p style={labelStyle}>Step 2</p>
                <p
                  className="text-text-primary"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 300,
                    fontSize: "var(--font-size-font-size-h3)",
                    lineHeight: "var(--font-line-height-line-height-h3)",
                  }}
                >
                  Select your role
                </p>
              </div>

              <div className="flex items-stretch w-full" style={{ gap: 24 }}>
                {roles.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className="flex flex-col flex-1 items-start bg-bg-page rounded-[4px] text-left"
                      style={{
                        padding: 24,
                        gap: 12,
                        cursor: "pointer",
                        border: isSelected
                          ? "2px solid var(--borders-border-primary, var(--text-text-primary))"
                          : "1px solid var(--borders-border-subtle, var(--borders-border-subtle))",
                        boxShadow: isSelected ? "0px 4px 12px var(--bg-ssot-shadow-hover)" : "none",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                    >
                      <p
                        className="text-text-primary"
                        style={{
                          fontFamily: "var(--font-barlow), sans-serif",
                          fontWeight: 500,
                          fontSize: "var(--font-size-font-size-h4)",
                          lineHeight: "var(--font-line-height-line-height-h4)",
                        }}
                      >
                        {role.title}
                      </p>
                      <div className="w-full border-b border-border-subtle" />
                      <ul className="w-full" style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6, listStyleType: "disc" }}>
                        {role.permissions.map((p) => (
                          <li
                            key={p}
                            style={{
                              fontFamily: "var(--font-barlow), sans-serif",
                              fontWeight: 400,
                              fontSize: 14,
                              lineHeight: "20px",
                              color: "var(--text-text-secondary)",
                              display: "list-item",
                            }}
                          >
                            {p}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex items-center justify-center rounded-[4px]"
          style={{
            width: 240,
            height: 44,
            backgroundColor: canContinue
              ? "var(--button-primary-btn-primary-bg, var(--text-text-primary))"
              : "var(--button-primary-btn-primary-disabled-bg, var(--deepblue-color-primary-200))",
            cursor: canContinue ? "pointer" : "not-allowed",
            transition: "background-color 0.15s",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "20px",
              color: "var(--button-primary-btn-primary-text)",
            }}
          >
            Continue
          </span>
        </button>

      </div>
    </div>
  );
}
