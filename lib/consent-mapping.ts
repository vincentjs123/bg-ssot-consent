import { CONSENT_CATEGORIES, CONSENT_SECTIONS, CONSENTS_WITH_RESPONSES } from "./search-data";

// Test codes for each consent category
const WGS_WES_CODES = new Set([
  "1500","1603","1600","1604","1550","1551","1601","1602","1605",
  "1729","1723","1722","1724","1900","1810","1803","1800","1804",
  "1850","1829","1823","1822","1824","1897","60061","8981","60071","1520",
]);

const PRENATAL_CODES = new Set([
  "1622","1623","1842","1843","1844","1845",
]);

const BIOCHEM_CODES = new Set([
  "4000","4100","4130","4150","4160","4175","4200","4240","4250","4260",
  "4300","4310","4330","4536","4555","4569","4627","4650","4651","4900",
  "4901","8501","8550","4015","4225","4811","4620","8945","8940","8955","8950",
]);

const HD_CODES = new Set(["6034"]);

// Test codes for specific Consents with Responses
const ACMG_CODES = new Set([
  "1500","1551","1603","1600","1604","1601","1602","1605",
  "1729","1723","1722","1724","1900","1810","1803","1800","1804",
  "1850","1829","1823","1822","1824","1897","60061","8981","60071","1520",
  "1622","1623","1843","1844","1845",
]);

const INCIDENTAL_CODES = new Set([
  "1500","1603","1600","1604","1550","1601","1602","1605",
  "1729","1723","1722","1724","1900","1810","1803","1800","1804",
  "1850","1829","1823","1822","1824","1897","60061","8981","60071","1520",
]);

const GWNKDA_CODES = new Set([
  "1722","1724","1600","1604","1601","1602","1822","1824","1800","1804",
]);

const MCC_CODES = new Set([
  "1622","1623","1822","1824","1800","1804",
]);

export type ConsentMapping = {
  category: string | null;
  sections: string[];
  responses: string[];
};

export function getConsentMapping(testCode: string): ConsentMapping {
  // Determine consent category
  let category: string | null = null;
  if (WGS_WES_CODES.has(testCode)) {
    category = "Informed Consent for WES and WGS";
  } else if (PRENATAL_CODES.has(testCode)) {
    category = "Prenatal WGS/WES Consent";
  } else if (HD_CODES.has(testCode)) {
    category = "Huntington Disease Consent";
  } else if (BIOCHEM_CODES.has(testCode)) {
    category = "Biochemical Genetic Consent";
  } else {
    category = "General Genetic Testing Consent";
  }

  // All 6 sections apply to all test codes
  const sections = [...CONSENT_SECTIONS];

  // Determine applicable Consents with Responses
  const responses: string[] = [
    "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    "Use of Data and Specimen for Research Purposes",
    "For Samples Submitted from New York State Residents",
  ];

  if (ACMG_CODES.has(testCode)) {
    responses.push("Reporting of ACMG Secondary Findings");
  }
  if (INCIDENTAL_CODES.has(testCode)) {
    responses.push("Reporting of Incidental Findings");
  }
  if (GWNKDA_CODES.has(testCode)) {
    responses.push("Reporting of Findings in Genes with No Known Disease Association");
  }
  if (MCC_CODES.has(testCode)) {
    responses.push("Use of Sample for MCC studies for Surrogates");
  }

  return { category, sections, responses };
}

// Check if a test code passes the active filter state
export function testCodeMatchesFilters(
  testCode: string,
  categories: Record<string, boolean>,
  sections: Record<string, boolean>,
  responses: Record<string, boolean>
): boolean {
  const mapping = getConsentMapping(testCode);

  // Consent category filter: at least one active category must match
  const activeCats = CONSENT_CATEGORIES.filter((c) => categories[c]);
  if (activeCats.length > 0 && !activeCats.includes(mapping.category as typeof CONSENT_CATEGORIES[number])) {
    return false;
  }

  // Consent section filter: at least one active section must be in the test's sections
  const activeSecs = CONSENT_SECTIONS.filter((s) => sections[s]);
  if (activeSecs.length > 0 && !activeSecs.some((s) => mapping.sections.includes(s))) {
    return false;
  }

  // Response filter: at least one active response must be in the test's responses
  const activeResps = CONSENTS_WITH_RESPONSES.filter((r) => responses[r]);
  if (activeResps.length > 0 && !activeResps.some((r) => mapping.responses.includes(r))) {
    return false;
  }

  return true;
}
