"use client";

import Link from "next/link";
import { TEST_CODE_CONSENTS } from "@/lib/consent-content";

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "var(--text-text-primary)",
};

/**
 * Renders a comma-separated test-codes string as individual clickable links.
 * Each code routes to /test-code/[code] if it has a consent mapping, otherwise /test-code-details/[code].
 * Accepts either a single comma-separated string, or multiple newline-separated blocks of such strings.
 */
export function LinkedTestCodes({ value }: { value: string }) {
  const blocks = value.split("\n\n");
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      {blocks.map((block, bi) => {
        const codes = block.split(",").map((c) => c.trim()).filter(Boolean);
        return (
          <p key={bi} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 400, fontSize: 16, lineHeight: "24px", margin: 0 }}>
            {codes.map((code, i) => (
              <span key={code}>
                <Link
                  href={TEST_CODE_CONSENTS[code] ? `/test-code/${code}` : `/test-code-details/${code}`}
                  style={linkStyle}
                  className="hover:underline hover:text-text-primary"
                >
                  {code}
                </Link>
                {i < codes.length - 1 && <span style={{ color: "var(--text-text-primary)" }}>, </span>}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Renders an array of TRF name strings as individual clickable links to /trf-details/[encoded-name].
 */
export function LinkedTRFs({ trfs }: { trfs: string[] }) {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      {trfs.map((trf) => (
        <Link
          key={trf}
          href={`/trf-details/${encodeURIComponent(trf)}`}
          style={linkStyle}
          className="hover:underline hover:text-text-primary"
        >
          {trf}
        </Link>
      ))}
    </div>
  );
}
