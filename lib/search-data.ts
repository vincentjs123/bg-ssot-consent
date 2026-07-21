export const CONSENT_CATEGORIES = [
  "Informed Consent for WES and WGS",
  "Prenatal WGS/WES Consent",
  "General Genetic Testing Consent",
  "Biochemical Genetic Consent",
  "Huntington Disease Consent",
] as const;

export const CONSENT_SECTIONS = [
  "Test Reporting and Results",
  "Test Information",
  "Additional Reporting",
  "Considerations and Limitations",
  "Confidentiality and Sample Retention",
  "Financial Agreement",
] as const;

export const CONSENTS_WITH_RESPONSES = [
  "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
  "Use of Data and Specimen for Research Purposes",
  "For Samples Submitted from New York State Residents",
  "Reporting of ACMG Secondary Findings",
  "Reporting of Incidental Findings",
  "Reporting of Findings in Genes with No Known Disease Association",
  "Use of Sample for MCC studies for Surrogates",
] as const;

export type ConsentCategory = typeof CONSENT_CATEGORIES[number];
export type ConsentSection = typeof CONSENT_SECTIONS[number];
export type ConsentWithResponse = typeof CONSENTS_WITH_RESPONSES[number];

export type SuggestionType = "category" | "section" | "response" | "test-code";

export interface Suggestion {
  type: SuggestionType;
  label: string;
  sublabel?: string;
}

export function getTypeaheadSuggestions(query: string, maxPerGroup = 5): Suggestion[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: Suggestion[] = [];

  const cats = CONSENT_CATEGORIES.filter((c) => c.toLowerCase().includes(q)).slice(0, maxPerGroup);
  cats.forEach((c) => results.push({ type: "category", label: c }));

  const secs = CONSENT_SECTIONS.filter((c) => c.toLowerCase().includes(q)).slice(0, maxPerGroup);
  secs.forEach((c) => results.push({ type: "section", label: c }));

  const resps = CONSENTS_WITH_RESPONSES.filter((c) => c.toLowerCase().includes(q)).slice(0, maxPerGroup);
  resps.forEach((c) => results.push({ type: "response", label: c }));

  return results;
}

// Maps exact suggestion labels to their detail page routes.
export const DETAIL_ROUTES: Record<string, string> = {
  // Consent Sections
  "Test Reporting and Results": "/consent-category",
  "Test Information": "/consent-section/test-information",
  "Additional Reporting": "/consent-section/additional-reporting",
  "Considerations and Limitations": "/consent-section/considerations-and-limitations",
  "Confidentiality and Sample Retention": "/consent-section/confidentiality-and-sample-retention",
  "Financial Agreement": "/consent-section/financial-agreement",
  // Stand-alone Consents
  "Informed Consent for WES and WGS": "/consent-category/informed-consent-for-wes-and-wgs",
  "Prenatal WGS/WES Consent": "/consent-category/prenatal-wgs-wes-consent",
  "General Genetic Testing Consent": "/consent-category/general-genetic-testing-consent",
  "Biochemical Genetic Consent": "/consent-details",
  "Huntington Disease Consent": "/consent-category/huntington-disease-consent",
};

export const SUGGESTION_TYPE_LABELS: Record<SuggestionType, string> = {
  category: "Consent Category",
  section: "Consent Section",
  response: "Consents with Responses",
  "test-code": "Test Code",
};
