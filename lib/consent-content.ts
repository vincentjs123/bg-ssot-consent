// ─── Shared TRF & Test Code lists ─────────────────────────────────────────────

const WGS_TRFS = [
  "Additional Affected Sibling for Trio",
  "Adult Screening Exome",
  "Additional Testing Req",
  "Whole Genome Sequencing",
  "Whole Exome Sequencing Reanalysis",
  "Whole Exome Sequencing",
  "Sequential Trio Whole Exome Sequencing",
];

const PRENATAL_TRFS = [
  "Prenatal Trio Whole Exome Sequencing",
  "Prenatal WGS",
];

const GENERAL_TRFS = [
  "Custom Family Sequencing",
  "Custom Proband Sequencing",
  "Autism Testing",
  "Cytogenetics",
  "Global MAPS",
  "Inherited Eye Disorders",
  "Mitochondrial",
  "Molecular Diagnostic",
  "NGS Panel",
  "Total BluePrint Panel",
  "GeneAware",
  "Hereditary Cancer",
  "Oncology",
  "Cytogenetics- POC",
  "Prenatal Comprehensive",
  "Prenatal Chromosomal Microarray Analysis",
  "PreSeek",
  "Postnatal Chromosomal Microarry Analysis/Cytogenetics",
];

const WGS_CODES = "1500, 1603, 1600, 1604, 1550, 1551, 1601, 1602, 1605, 1729, 1723, 1722, 1724, 1900, 1810, 1803, 1800, 1804, 1850, 1829, 1823, 1822, 1824, 1897, 60061, 8981, 60071, 1520";
const PRENATAL_CODES = "1622, 1623, 1842, 1843, 1844, 1845";
const BIOCHEM_CODES = "4000, 4100, 4130, 4150, 4160, 4175, 4200, 4240, 4250, 4260, 4300, 4310, 4330, 4536, 4555, 4569, 4627, 4650, 4651, 4900, 4901, 8501, 8550, 4015, 4225, 4811, 4620, 8945, 8940, 8955, 8950";
const GENERAL_CODES = "1300, BG-1300-P142-1, BG-1300-P463-1, BG-1300-P92-1, BG-1300-P397-1, BG-1300-P76-1, BG-1300-P236-1, BG-1300-P419-1, BG-1300-P354-1, 1522, 1560, 1580, 24001, BG-24001-P12-5, BG-24001-P43-1, BG-24001-P2-2, BG-24001-P94-1, BG-24001-P25-1, BG-24001-P27-1, BG-24001-P37-1, BG-24001-P22-2, BG-24001-P22-1, BG-24001-P18-1, BG-24001-P10-1, BG-24001-P21-1, BG-24001-P12-2, BG-24001-P12-1, BG-24001-P19-1, BG-24001-P9-1, 1390, 1593, 1594, 2090, 22100, 2126, 2300, 2625, 3135, 3143, 3348, 3359, 4015, 4225, 4811, 6006, 6031, 6036, 6037, 6041, 6050, 6059, 6350, 6351, 6373, 6376, 6573, 6574, 21200, 21900, 25000, 25001, 25002, 64000, 64005, 2010, 2055, 2056, 2085, 2110, 3200, 3210, 8000, 8005, 8010, 8012, 8015, 8020, 8040, 8300, 8405, 8425, 8530, 8600, 8700, 8705, 8715, 8725, 8730, 8735, 8750, 8760, 8770, 8775, 8790, 8795, 8800, 8639, 8655, 8656, 8657, 8665, 8670, 8671, 8672, 8673, 8675, 8676";
const HD_CODES = "6034";

export const LOREM_GAP = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.";

// ─── Proposed language blocks ──────────────────────────────────────────────────

const LANG = {
  // Test Reporting and Results
  TRR_WGS: `Reporting can be grouped into two main categories:\n\n• Primary – related to the reason for testing\n\n• Additional Reporting – not related to the reason for testing but may be associated with health risks in the future.\n\nBased on current scientific knowledge, there are several types of test results that may be reported including:\n\n• Positive:\nOne or more variants in the DNA were identified that are expected to cause health issues which are also known as pathogenic or likely pathogenic variants.\n\n• Negative:\nNo variants in the DNA were found that are known to cause health issues.\n\n• Variant of Uncertain Clinical Significance (VUS):\nA variant in the DNA was found that we do not know its effect, if any, on health. Additional testing may help us learn whether this change is related to existing health conditions or if it could be important for health information in the future.`,

  TRR_BIOCHEM: `There are several types of test results that may be reported including:\n\nPositive: A change was found that is expected to cause health issues which may be related to the reason for testing or can cause health issues in the future. The amount and/or function of proteins or analytes appears to be abnormal.\n\nNegative: No changes were found that are known to cause health issues which may be related to the reason for testing or can cause health issues in the future. The amount and/or function of proteins or analytes appears to be normal.`,

  TRR_GENERAL: `There are several types of test results that may be reported including:\n\nPositive: A disease-associated genetic or biochemical findings has been identified that is expected to cause or contribute to health issues. These findings may relate to the reason for testing or indicate a risk for future health conditions.\n\nNegative: No disease-associated genetic or biochemical findings have been identified that are expected to cause or contribute to health issues, either related to the reason for testing or expected to increase the risk of a health issue in the future.\n\nVariant of Uncertain Clinical Significance (VUS): A variant in the DNA was found that we do not know its effect, if any, on health. Additional testing may help us learn whether this change is related to the reason for this testing or if it could be important for health information in the future.`,

  TRR_HD: `Most people have two copies of the HD gene, one from each parent. Each gene copy has a number of repeating sections of DNA (“CAG”s). The number of CAGs are tested to see if there is any risk for developing HD.\n\nThere are several types of test results that may be reported including:\n\nNegative: Both gene copies have 26 or less CAG repeats. There is no expected risk for HD.\n\nIntermediate: At least one gene copy has 27-35 CAG repeats. There is no expected risk for HD for the individual tested. However, the repeat size may expand when passed from parent to child, which may increase the risk of HD in their children.\n\nReduced Penetrance: At least one gene copy has 36-39 CAG repeats. There may be a risk for HD for the individual tested, and their children may also be at risk.\n\nPositive (Full Penetrance): At least one gene copy has 40 or more CAG repeats. The individual tested is expected to have or develop HD. Each child of the individual tested has a 50% (1 in 2) chance for HD.`,

  // Test Information
  TI_WGS: `A genetic test called Whole Genome Sequencing (WGS) or Whole Exome Sequencing (WES) is being ordered by a healthcare provider (doctor, genetic counselor, or other authorized person with medical training) in connection with ongoing clinical care. The healthcare provider has determined that this testing is medically necessary, and this testing is not available through Baylor Genetics as a direct-to-consumer genetic testing product or service. These tests look for changes, called variants, in a person’s DNA that can cause health issues. DNA is our genetic material. These variants can be in certain genes, specific parts of our DNA that are needed for our health. They can also be found in other places in the genome (all DNA that a person has). These tests may identify DNA variants that may be associated with current or future health issues or health issues for other family members. Even if this test identifies DNA variants that are associated with health issues, the results may not help inform clinical decision-making, including diagnosis, prognosis, medical management, and/or treatment of your condition.\n\nTesting may compare one or more family members’ DNA. This may help better understand the test results or show if family members have the same variant.\n\nBefore deciding on testing, a review of this consent between the individual(s) tested and ordering provider is recommended.`,

  TI_GENERAL_BIOCHEM: `One or more tests are being ordered by a healthcare provider (doctor, genetic counselor, or other authorized person with medical training) to help identify potential causes of current health concerns and/or to assess the risk of certain health conditions for the individual being tested and, where applicable, their family members, in connection with ongoing clinical care. The healthcare provider has determined that this testing is medically necessary, and this testing is not available through Baylor Genetics as a direct-to-consumer genetic testing product or service. Genetic tests look at changes in either the DNA or chromosomes. DNA contains genes, which tell our bodies how to work. Chromosomes are the structures that organize and hold our DNA. Changes in our genes or chromosomes can lead to health issues. Biochemical tests look for changes in proteins or analytes that cause health issues. Based on the reason for testing, differences that may cause health issues will be reported. This test may explain current or future health issues or health issues for other family members. Even if this test finds a cause that leads to health issues, these results may not help inform clinical decision-making, including diagnosis, prognosis, medical management, and/or treatment of your condition.\n\nBefore deciding on testing, a review of this consent between the individual(s) tested and ordering provider is recommended.`,

  TI_HD: `A genetic test for Huntington disease (HD) is being ordered by a healthcare provider (doctor, genetic counselor, or other authorized person with medical training) in connection with ongoing clinical care. The healthcare provider has determined that this testing is medically necessary, and this testing is not available through Baylor Genetics as a direct-to-consumer genetic testing product or service. HD affects movement, psychiatric, and cognitive abilities. These health issues get worse over time. While treatments may help with some health issues, there is currently no cure for HD. Genetic testing for HD can determine if current health issues are caused by HD or if an individual might be at increased risk to have HD later in life.\n\nThis test looks at the gene (specific part of DNA needed for our health) that causes HD. DNA is our genetic material. The gene that causes HD is HTT. Certain changes, called variants, in this gene cause HD. These variants can be passed along from parent to child. They can also change from parent to child. These changes might cause health issues at an earlier age or that are more serious than other affected family members.\n\nBefore deciding on testing, a review of this consent between the individual(s) tested and ordering provider is recommended.`,

  // Additional Reporting
  AR_WGS: `The following categories of variants are not expected to cause current health issues. However, knowing about these variants might affect future medical care.\n\nIncidental Findings (Optional for proband): Other variants known to cause significant health issues but are not related to the reason testing is being performed.\n\nNote: Certain issues within the brain start in adulthood and get worse over time (neurodegenerative). They often have no cure or treatment. These variants will not be reported unless they are related to the reason for testing.\n\nACMG Secondary Findings (Optional for proband and comparators): The American College of Medical Genetics and Genomics (ACMG) recommends reporting disease-causing variants in certain genes that cause health issues.\n\nGenes of No Known Disease Association (Optional for proband for trio and quad orders where both parents have submitted samples for testing): Testing may find a variant in a gene that is not known to cause disease. This may be helpful to learn more about these genes in the future. These results do not currently impact medical management or indicate a diagnosis.`,

  AR_PRENATAL: `The following categories of variants are not expected to cause current health issues. However, knowing about these variants might affect future medical care.\n\nIncidental Findings: Other variants known to cause significant health issues but are not related to the reason testing is being performed. These findings will be reported in the fetus as they may provide important health information.\n\nNote: Certain issues within the brain start in adulthood and get worse over time (neurodegenerative). They often have no cure or treatment. These variants will not be reported unless they are related to any clinical findings in the fetus.\n\nACMG Secondary Findings (Optional for comparators): The American College of Medical Genetics and Genomics (ACMG) recommends reporting disease-causing variants in certain genes that cause health issues. For prenatal testing, these variants are not reported for the fetus, but each other family member having testing can opt into reporting these variants.`,

  // Considerations and Limitations
  CL_SHARED: `The ordering provider is responsible for explaining the risks, benefits, and alternatives to testing. Beyond impacting healthcare treatment, it is important to consider that learning about test results may have emotional and psychological effects.\n\nWhen a variant(s) is found that is known to cause health issues, the progression of the condition or treatment might not be known. Family members with the same variant might not be affected in the same way.\n\nA negative result does not rule out the chance for health issues. Our knowledge of variants and how they cause disease may change over time as we learn more about genetics. Testing has limitations to what it can find as well.\n\nIf several family members are tested, knowing the correct biological relationships among them is important. In rare cases, testing can show that family members are not related as expected (e.g., unassigned familial relationships). If this is found, we may contact the provider who ordered the testing.\n\nCertain factors may lead to incorrect or less accurate results. These include mislabeled samples, incorrect information in the test order, rare technical errors, or unassigned familial relationships.\n\nThe final test report may not fully reflect the original test order and may be modified based on laboratory policies and procedures (e.g., unassigned familial relationships, or delays or absence of comparator samples). The reason for any changes may not be detailed in the report; however, the ordering healthcare provider may contact the laboratory for additional information.\n\nMore sample and/or a different type of sample may be needed if the first sample is not sufficient to complete testing.`,

  CL_BIOCHEM: `The ordering provider is responsible for explaining the risks, benefits, and alternatives to testing. Beyond impacting healthcare treatment, it is important to consider that learning about test results may have emotional and psychological effects.\n\nTesting may show a change that is expected to cause health issues or may cause health issues in the future. In addition, it may show an increased chance of having a child with a health issue.\n\nEven if the change(s) in proteins or analytes that cause health issues are found, this may not predict how these issues might progress or improve with treatment. Affected family members with the same change might not be affected in the same way.\n\nDepending on the results of testing, additional testing may be needed to understand any findings. This testing might be needed for the individual tested and/or other family members.\n\nA negative result does not rule out the chance for health issues. Our knowledge of proteins and analytes and how they cause disease may change over time as we learn more about genetics. Testing has limitations to what it can find as well.\n\nCertain factors may lead to incorrect results. These include mislabeled samples, incorrect information in the test order, and rare technical errors.\n\nMore sample and/or a different type of sample may be needed if the first sample is not sufficient to complete testing.`,

  CL_HD: `The ordering provider is responsible for explaining the risks, benefits, and alternatives to testing. Beyond impacting healthcare treatment, it is important to consider that learning about test results may have emotional and psychological effects.\n\nMinors without health issues related to HD usually do not have HD testing.\n\nThis testing cannot predict when health issues may start. This is checked through a clinical exam.\n\nA Reduced Penetrance and Positive (Full Penetrance) result cannot determine how health issues might progress. Family members with the same findings might not have the same issues or progression as the individual tested.\n\nDepending on the results of testing, more testing may be needed to understand these results.\n\nA negative result does not rule out the chance for health issues. Our knowledge of variants and how they cause disease may change over time as we learn more about genetics. Testing has limitations to what it can find as well.\n\nIf several family members are tested, knowing the correct biological relationships among them is important. In rare cases, testing can show that family members are not related as expected (unassigned familial relationships). If this is found, we may contact the provider who ordered the testing.\n\nCertain factors may lead to incorrect or less accurate results. These include mislabeled samples, incorrect information in the test order, rare technical errors, or unassigned familial relationships.\n\nThe final test report may not fully reflect the original test order and may be modified based on laboratory policies and procedures (e.g. unassigned familial relationships, or delays or absence of comparator samples). The reason for any changes may not be detailed in the report; however, the ordering healthcare provider may contact the laboratory for additional information.\n\nMore sample and/or a different type of sample may be needed if the first sample is not sufficient to complete testing.\n\nThe Huntington’s Disease Society of America (https://hdsa.org/) and other groups have patient resources about HD.`,

  // Confidentiality and Sample Retention (same for all)
  CSR_ALL: `If this testing is requested to be cancelled after the order and sample are sent to the laboratory, please see our Test Cancellation Policy at www.baylorgenetics.com/cancel-test/. Once testing has been completed and results have been reported, the test results become part of your clinical medical record maintained by your healthcare provider. Because this testing is ordered in connection with medically necessary clinical care, test results documented in your medical record are subject to applicable medical records retention requirements and generally cannot be deleted from the medical record upon patient request, though you retain the right to request amendment of information you believe to be inaccurate or incomplete under applicable law, including the HIPAA Privacy Rule (45 C.F.R. § 164.526).\n\nOnly Baylor Genetics and its contracted partners will have access to this sample for the ordered testing. Results from testing will only be released to: (i) a licensed healthcare provider, (ii) those authorized in writing, (iii) the individual(s) tested or their personal representative, and (iv) those allowed access to test results by law. The individual(s) tested has the right to access their test results from Baylor Genetics by providing a written request. They also have the right to request raw data obtained from their sample by providing a written request or HIPAA Authorization Form. Because this testing is ordered by a healthcare provider for clinical care, state-level direct-to-consumer genetic privacy laws generally do not apply.\n\nIn rare cases, people with genetic diseases may have problems with health insurance and employment. Certain federal laws may apply to protect genetic information. The Genetic Information Nondiscrimination Act (GINA) primarily protects predictive genetic information (e.g., risk or carrier status before a condition develops). Because this test is ordered for an existing or suspected condition, confirmed diagnoses are generally not covered by GINA. However, GINA may apply to incidental or secondary findings that reveal future health risks.\n\nSamples will be kept in the laboratory based on our retention policy. Once testing is completed, the biological sample may be destroyed in accordance with applicable state law requirements (e.g., within sixty (60) days for New York residents unless longer retention is expressly authorized). The destruction of a biological sample does not affect the retention of test results in the medical record. De-identified samples may be used for quality assurance and training purposes prior to destruction. Samples are not returned to individuals tested or providers unless requested prior to testing. The individual(s) tested and their heirs will not receive payments, benefits, or rights to any resulting products or discoveries.\n\nThe information from this testing may be used in scientific research, publications or presentations, but the individual(s) tested specific identity will not be revealed. We may contact the ordering provider to obtain more clinical information. Baylor Genetics also performs other types of scientific research and may contact the individual(s) tested to see if they would like to be involved.\n\nVariants found may be submitted to databases. The medical community uses these databases to collect information about how variants might cause disease to improve testing and treatment for patients. An example is ClinVar, a free, public archive of reports on human genetics. Limited clinical information may need to be shared with these databases. In rare cases, this information may be enough to reveal identity.\n\nFor more information on privacy practices at Baylor Genetics, please visit www.baylorgenetics.com/privacy-practices/`,

  // Financial Agreement
  FA_PORTAL_ALL: `By submitting this order, I hereby authorize Baylor Genetics to provide my patient's insurance carrier any information necessary, including test results, for processing the insurance claim. My patient understands that they are responsible for any co-pay, co-insurance, and unmet deductible that the insurance policy dictates. The patient designates Baylor Genetics as their designated representative for purposes of appealing any denial of benefits by the insurance carrier. My patient irrevocably assigns associated payments to Baylor Genetics, and directs that payment be made directly to Baylor Genetics. Please note, some payers may not cover certain screening tests.\n\nIf my patient's health insurer does not cover the test or my patient does not have health insurance, or if my patient elects to pay out of pocket rather than utilize their insurance coverage, my patient has received a good faith estimate of the cost for the testing ordered and agrees to pay for the cost of the testing billed to them by Baylor Genetics based on that good faith estimate. More information is available in Baylor Genetics’ No Surprises Act and Good Faith Estimate Notice located at http://www.baylorgenetics.com/no-surprises-act/.\n\nA Medicare Advance Beneficiary Notice (ABN) is required for services Medicare identifies as not medically necessary.`,

  FA_PAPER_ALL: `By signing below, I hereby authorize Baylor Genetics to provide my insurance carrier any information necessary, including test results, for processing my insurance claim. I understand that I am responsible for any co-pay, co-insurance, and unmet deductible that the insurance policy dictates. I designate Baylor Genetics as my designated representative for purposes of appealing any denial of benefits by my insurance carrier. I irrevocably assign associated payment to Baylor Genetics, and direct that payment be made directly to Baylor Genetics. Please note, some payers may not cover certain screening tests.\n\nIf my health insurer does not cover the test or I do not have health insurance, or if I elect to pay out of pocket rather than utilize my insurance coverage, I have received a good faith estimate of the cost for the genetic testing ordered by my provider and agree to pay for the cost of the genetic testing billed to me by Baylor Genetics based on that good faith estimate. More information is available in Baylor Genetics’ No Surprises Act and Good Faith Estimate Notice located at https://www.baylorgenetics.com/no-surprises-act/.\n\nA Medicare Advance Beneficiary Notice (ABN) is required for services Medicare identifies as not medically necessary.`,

  FA_PORTAL_PRENATAL: `When selecting Self Payment, by submitting this order, my patient acknowledges that they are paying for the testing ordered from Baylor Genetics on a self-pay basis and my patient hereby instructs Baylor Genetics not to submit this claim to their insurance carrier. My patient has received a Good Faith Estimate of the cost for the testing ordered, as required under the No Surprises Act, and agrees to pay Baylor Genetics for the cost of testing as outlined in that estimate. My patient understands that payment is their sole responsibility and has instructed Baylor Genetics to not submit a claim to Medicare, Medicaid, or any private insurer on my patient’s behalf.`,

  // CKR items
  CKR_SMN: `This requisition incorporates by reference as applicable Baylor Genetics’ Terms and Conditions available at: https://www.baylorgenetics.com/lab-terms-conditions/ or, in the case of international entities, https://www.baylorgenetics.com/terms-conditions-of-the-laboratory-services-international/.\n\nBy submitting this requisition, I attest to the following:\n\nMedical Necessity: The test(s) ordered are medically necessary for the risk assessment, diagnosis, monitoring, or detection of a suspected genetic condition. The results are expected to inform clinical decision-making, including diagnosis, prognosis, medical management and/or treatment.\n\nAuthorization to Order: I am authorized by law to order these test(s).\n\nEducation and Consent: I confirm that I, or my qualified designee, have provided the individual(s) tested (and/or their legal guardian) with appropriate information regarding the nature, purpose, benefits, limitations, and potential outcomes of the genetic test(s), and that informed consent for testing has been obtained in accordance with applicable laws, regulations and institutional policies, and as indicated below.\n\nComparator/Family Member Consent (if applicable): Any individual identified as a comparator (e.g., biological family member) has been provided with appropriate information regarding genetic testing, including the purpose of testing, possible results, and potential implications. Informed consent for testing has been obtained from each comparator, including consent for the return of relevant findings (e.g., ACMG-recommended secondary findings or other medically actionable results), where applicable and selected.\n\nThe individuals tested (and/or their legal guardian) have been given the opportunity to ask questions about the testing and possible results.`,

  CKR_USE_OF_DATA: `In addition to the permitted uses described above, biological specimens, test results, and associated information also may be used by Baylor Genetics and its research partners for other research and development purposes, including but not limited to improving genetic testing, advancing understanding of genetic conditions, developing new technologies, and training computational models, in addition to inclusion in de-identified clinical databases. Baylor Genetics will take reasonable steps to remove or limit identifying information and to protect patient privacy; however, due to the unique nature of genetic data, complete anonymization cannot be guaranteed.\n\nData and specimens from individuals tested will not be used for these additional research and development purposes unless authorized by marking below. The individual(s) tested and their heirs will not receive payments, benefits, or rights to any resulting products or discoveries from authorized research and development activities. An individual’s decision to decline participation will not affect their ability to receive testing or other services from Baylor Genetics.\n\nFor individuals tested in Oregon, please consult the state specific consent form found at www.baylorgenetics.com/forms.\n\nBy checking the box below, the individual(s) tested give Baylor Genetics permission to use the specimens and data from this order for research and development purposes.\n\nOpt-in for use of specimen and data for research`,

  CKR_NYS: `Samples from New York State residents shall not be used for research and development purposes without written consents. Samples will not be retained for more than sixty (60) days after receipt by Baylor Genetics, unless authorized by marking below. No tests other than those authorized shall be performed on the samples.\n\nBy checking the box below, you give Baylor Genetics permission to retain sample(s) from this order for a longer period based on Baylor Genetics’ retention policy for research and development purposes.\n\nOpt-in for sample retention`,

  CKR_ACMG: `Variants in genes included in the ACMG secondary findings guidelines will be reported for each family member marked below. Each marked family member will receive their own report on these findings.\n\nProband- Opt-in for ACMG Secondary Findings (not applicable to prenatal TCs), Mother- Opt-in for ACMG Secondary Findings, Father- Opt-in for ACMG Secondary Findings, Other Family Member- Opt-in for ACMG Secondary Findings`,

  CKR_INCIDENTAL: `I would like to receive test results for pathogenic and likely pathogenic variants in genes that are not related to a current medical condition, but which could significantly affect health.\n\nOpt-in for Incidental Findings`,

  CKR_GWNKDA: `I would like to receive test results that include variants in genes that are not currently known to cause a genetic disorder or other medical conditions but could be found to do so in the future.\n\nOpt-in for biallelic, hemizygous, and de novo variants in genes with no known disease association.`,

  CKR_MCC: `Maternal cell contamination (MCC) studies use blood or another sample from a pregnant person. MCC studies are used to determine that the sample being tested belongs to the fetus and not the pregnant person. The results of MCC studies are not used for the treatment or management of the fetus, pregnant person, or other individuals, and are not part of the pregnant person’s designated medical record.\n\nOpt-in for use of surrogate’s sample for MCC studies`,
};

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ContentBlock {
  portal: string;
  paper: string | null; // null = same as portal
  trfs: string[];
  testCodes: string;
  isGap?: boolean; // true = show lorem ipsum in red
}

export interface CKRItem {
  slug: string;
  title: string;
  portal: string;
  paper: string | null;
  testCodes: string;
  trfs: string[];
}

export interface SectionPageMeta {
  name: string;
  slug: string;
  chip: string;
  description: string;
}

export interface CategoryPageMeta {
  name: string;
  slug: string;
  chip: string;
  description: string;
}

// ─── Section metadata ──────────────────────────────────────────────────────────

export const SECTION_META: Record<string, SectionPageMeta> = {
  "test-information": {
    name: "Test Information",
    slug: "test-information",
    chip: "Consent Section",
    description: "Overview of the test being performed, purpose, and what the patient can expect.",
  },
  "additional-reporting": {
    name: "Additional Reporting",
    slug: "additional-reporting",
    chip: "Consent Section",
    description: "Secondary and incidental findings not directly related to the reason for testing.",
  },
  "considerations-and-limitations": {
    name: "Considerations and Limitations",
    slug: "considerations-and-limitations",
    chip: "Consent Section",
    description: "Risks, benefits, alternatives, and known limitations of the testing methodology.",
  },
  "confidentiality-and-sample-retention": {
    name: "Confidentiality and Sample Retention",
    slug: "confidentiality-and-sample-retention",
    chip: "Consent Section",
    description: "How patient data and biological samples are stored, shared, and protected.",
  },
  "financial-agreement": {
    name: "Financial Agreement",
    slug: "financial-agreement",
    chip: "Consent Section",
    description: "Patient’s acknowledgment of financial responsibility and billing terms.",
  },
  "test-reporting-and-results": {
    name: "Test Reporting and Results",
    slug: "test-reporting-and-results",
    chip: "Consent Section",
    description: "Explains result types — Positive, Negative, VUS — and how findings will be communicated.",
  },
};

// ─── Category metadata ─────────────────────────────────────────────────────────

export const CATEGORY_META: Record<string, CategoryPageMeta> = {
  "informed-consent-for-wes-and-wgs": {
    name: "Informed Consent for WES and WGS",
    slug: "informed-consent-for-wes-and-wgs",
    chip: "Stand-alone Consent",
    description: "Comprehensive consent for whole genome and whole exome sequencing tests, covering test information, result reporting, and optional secondary findings.",
  },
  "prenatal-wgs-wes-consent": {
    name: "Prenatal WGS/WES Consent",
    slug: "prenatal-wgs-wes-consent",
    chip: "Stand-alone Consent",
    description: "Consent for prenatal whole genome and whole exome sequencing, including fetal variant reporting and surrogate-specific provisions.",
  },
  "general-genetic-testing-consent": {
    name: "General Genetic Testing Consent",
    slug: "general-genetic-testing-consent",
    chip: "Stand-alone Consent",
    description: "Broad consent covering cytogenetic, mitochondrial, panel, carrier, and hereditary cancer testing.",
  },
  "huntington-disease-consent": {
    name: "Huntington Disease Consent",
    slug: "huntington-disease-consent",
    chip: "Stand-alone Consent",
    description: "Consent specific to Huntington disease genetic testing, including result interpretation and emotional considerations.",
  },
};

// ─── Section page card data ─────────────────────────────────────────────────────
// Each entry is an array of cards (one per stand-alone consent) for that section page.

export interface SectionCard {
  consentName: string;
  consentSlug: string;
  portal: string;
  paper: string | null;
  trfs: string[];
  testCodes: string;
  isGap?: boolean;
}

export const SECTION_CARDS: Record<string, SectionCard[]> = {
  "test-information": [
    {
      consentName: "Informed Consent for WES and WGS",
      consentSlug: "informed-consent-for-wes-and-wgs",
      portal: LANG.TI_WGS,
      paper: null,
      trfs: WGS_TRFS,
      testCodes: WGS_CODES,
    },
    {
      consentName: "Prenatal WGS/WES Consent",
      consentSlug: "prenatal-wgs-wes-consent",
      portal: LANG.TI_WGS,
      paper: null,
      trfs: PRENATAL_TRFS,
      testCodes: PRENATAL_CODES,
    },
    {
      consentName: "General Genetic Testing Consent",
      consentSlug: "general-genetic-testing-consent",
      portal: LANG.TI_GENERAL_BIOCHEM,
      paper: null,
      trfs: GENERAL_TRFS,
      testCodes: GENERAL_CODES,
    },
    {
      consentName: "Biochemical Genetic Consent",
      consentSlug: "biochemical-genetic-consent",
      portal: LANG.TI_GENERAL_BIOCHEM,
      paper: null,
      trfs: ["Biochemical"],
      testCodes: BIOCHEM_CODES,
    },
    {
      consentName: "Huntington Disease Consent",
      consentSlug: "huntington-disease-consent",
      portal: LANG.TI_HD,
      paper: null,
      trfs: ["Not attached to any paper TRF"],
      testCodes: HD_CODES,
    },
  ],

  "additional-reporting": [
    {
      consentName: "Informed Consent for WES and WGS",
      consentSlug: "informed-consent-for-wes-and-wgs",
      portal: LANG.AR_WGS,
      paper: null,
      trfs: WGS_TRFS,
      testCodes: WGS_CODES,
    },
    {
      consentName: "Prenatal WGS/WES Consent",
      consentSlug: "prenatal-wgs-wes-consent",
      portal: LANG.AR_PRENATAL,
      paper: null,
      trfs: PRENATAL_TRFS,
      testCodes: PRENATAL_CODES,
    },
  ],

  "considerations-and-limitations": [
    {
      consentName: "Informed Consent for WES and WGS",
      consentSlug: "informed-consent-for-wes-and-wgs",
      portal: LANG.CL_SHARED,
      paper: null,
      trfs: WGS_TRFS,
      testCodes: WGS_CODES,
    },
    {
      consentName: "Prenatal WGS/WES Consent",
      consentSlug: "prenatal-wgs-wes-consent",
      portal: LANG.CL_SHARED,
      paper: null,
      trfs: PRENATAL_TRFS,
      testCodes: PRENATAL_CODES,
    },
    {
      consentName: "General Genetic Testing Consent",
      consentSlug: "general-genetic-testing-consent",
      portal: LANG.CL_SHARED,
      paper: null,
      trfs: GENERAL_TRFS,
      testCodes: GENERAL_CODES,
    },
    {
      consentName: "Biochemical Genetic Consent",
      consentSlug: "biochemical-genetic-consent",
      portal: LANG.CL_BIOCHEM,
      paper: null,
      trfs: ["Biochemical"],
      testCodes: BIOCHEM_CODES,
    },
    {
      consentName: "Huntington Disease Consent",
      consentSlug: "huntington-disease-consent",
      portal: LANG.CL_HD,
      paper: null,
      trfs: ["Not attached to any paper TRF"],
      testCodes: HD_CODES,
    },
  ],

  "confidentiality-and-sample-retention": [
    {
      consentName: "Informed Consent for WES and WGS",
      consentSlug: "informed-consent-for-wes-and-wgs",
      portal: LANG.CSR_ALL,
      paper: null,
      trfs: ["All"],
      testCodes: "All",
    },
    {
      consentName: "Prenatal WGS/WES Consent",
      consentSlug: "prenatal-wgs-wes-consent",
      portal: LANG.CSR_ALL,
      paper: null,
      trfs: ["All"],
      testCodes: "All",
    },
    {
      consentName: "General Genetic Testing Consent",
      consentSlug: "general-genetic-testing-consent",
      portal: LANG.CSR_ALL,
      paper: null,
      trfs: ["All"],
      testCodes: "All",
    },
    {
      consentName: "Biochemical Genetic Consent",
      consentSlug: "biochemical-genetic-consent",
      portal: LANG.CSR_ALL,
      paper: null,
      trfs: ["All"],
      testCodes: "All",
    },
    {
      consentName: "Huntington Disease Consent",
      consentSlug: "huntington-disease-consent",
      portal: LANG.CSR_ALL,
      paper: null,
      trfs: ["All"],
      testCodes: "All",
    },
  ],

  "financial-agreement": [
    {
      consentName: "Informed Consent for WES and WGS",
      consentSlug: "informed-consent-for-wes-and-wgs",
      portal: LANG.FA_PORTAL_ALL,
      paper: LANG.FA_PAPER_ALL,
      trfs: ["All"],
      testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)",
    },
    {
      consentName: "Prenatal WGS/WES Consent",
      consentSlug: "prenatal-wgs-wes-consent",
      portal: LANG.FA_PORTAL_PRENATAL,
      paper: null,
      trfs: ["Prenatal WGS"],
      testCodes: PRENATAL_CODES,
    },
    {
      consentName: "General Genetic Testing Consent",
      consentSlug: "general-genetic-testing-consent",
      portal: LANG.FA_PORTAL_ALL,
      paper: LANG.FA_PAPER_ALL,
      trfs: ["All"],
      testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)",
    },
    {
      consentName: "Biochemical Genetic Consent",
      consentSlug: "biochemical-genetic-consent",
      portal: LANG.FA_PORTAL_ALL,
      paper: LANG.FA_PAPER_ALL,
      trfs: ["All"],
      testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)",
    },
    {
      consentName: "Huntington Disease Consent",
      consentSlug: "huntington-disease-consent",
      portal: LANG.FA_PORTAL_ALL,
      paper: LANG.FA_PAPER_ALL,
      trfs: ["All"],
      testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)",
    },
  ],
};

// ─── Category page section card data ──────────────────────────────────────────

export interface CategorySectionCard {
  sectionName: string;
  sectionSlug: string;
  portal: string;
  paper: string | null;
  trfs: string[];
  testCodes: string;
  isGap?: boolean;
}

export const CATEGORY_SECTION_CARDS: Record<string, CategorySectionCard[]> = {
  "informed-consent-for-wes-and-wgs": [
    { sectionName: "Test Reporting and Results", sectionSlug: "test-reporting-and-results", portal: LANG.TRR_WGS, paper: null, trfs: WGS_TRFS, testCodes: WGS_CODES },
    { sectionName: "Test Information", sectionSlug: "test-information", portal: LANG.TI_WGS, paper: null, trfs: WGS_TRFS, testCodes: WGS_CODES },
    { sectionName: "Additional Reporting", sectionSlug: "additional-reporting", portal: LANG.AR_WGS, paper: null, trfs: WGS_TRFS, testCodes: WGS_CODES },
    { sectionName: "Considerations and Limitations", sectionSlug: "considerations-and-limitations", portal: LANG.CL_SHARED, paper: null, trfs: WGS_TRFS, testCodes: WGS_CODES },
    { sectionName: "Confidentiality and Sample Retention", sectionSlug: "confidentiality-and-sample-retention", portal: LANG.CSR_ALL, paper: null, trfs: ["All"], testCodes: "All" },
    { sectionName: "Financial Agreement", sectionSlug: "financial-agreement", portal: LANG.FA_PORTAL_ALL, paper: LANG.FA_PAPER_ALL, trfs: ["All"], testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)" },
  ],

  "prenatal-wgs-wes-consent": [
    { sectionName: "Test Reporting and Results", sectionSlug: "test-reporting-and-results", portal: LANG.TRR_WGS, paper: null, trfs: PRENATAL_TRFS, testCodes: PRENATAL_CODES },
    { sectionName: "Test Information", sectionSlug: "test-information", portal: LANG.TI_WGS, paper: null, trfs: PRENATAL_TRFS, testCodes: PRENATAL_CODES },
    { sectionName: "Additional Reporting", sectionSlug: "additional-reporting", portal: LANG.AR_PRENATAL, paper: null, trfs: PRENATAL_TRFS, testCodes: PRENATAL_CODES },
    { sectionName: "Considerations and Limitations", sectionSlug: "considerations-and-limitations", portal: LANG.CL_SHARED, paper: null, trfs: PRENATAL_TRFS, testCodes: PRENATAL_CODES },
    { sectionName: "Confidentiality and Sample Retention", sectionSlug: "confidentiality-and-sample-retention", portal: LANG.CSR_ALL, paper: null, trfs: ["All"], testCodes: "All" },
    { sectionName: "Financial Agreement", sectionSlug: "financial-agreement", portal: LANG.FA_PORTAL_PRENATAL, paper: null, trfs: ["Prenatal WGS"], testCodes: PRENATAL_CODES },
  ],

  "general-genetic-testing-consent": [
    { sectionName: "Test Reporting and Results", sectionSlug: "test-reporting-and-results", portal: LANG.TRR_GENERAL, paper: null, trfs: GENERAL_TRFS, testCodes: GENERAL_CODES },
    { sectionName: "Test Information", sectionSlug: "test-information", portal: LANG.TI_GENERAL_BIOCHEM, paper: null, trfs: GENERAL_TRFS, testCodes: GENERAL_CODES },
    { sectionName: "Considerations and Limitations", sectionSlug: "considerations-and-limitations", portal: LANG.CL_SHARED, paper: null, trfs: GENERAL_TRFS, testCodes: GENERAL_CODES },
    { sectionName: "Confidentiality and Sample Retention", sectionSlug: "confidentiality-and-sample-retention", portal: LANG.CSR_ALL, paper: null, trfs: ["All"], testCodes: "All" },
    { sectionName: "Financial Agreement", sectionSlug: "financial-agreement", portal: LANG.FA_PORTAL_ALL, paper: LANG.FA_PAPER_ALL, trfs: ["All"], testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)" },
  ],

  "huntington-disease-consent": [
    { sectionName: "Test Reporting and Results", sectionSlug: "test-reporting-and-results", portal: LANG.TRR_HD, paper: null, trfs: ["Not attached to any paper TRF"], testCodes: HD_CODES },
    { sectionName: "Test Information", sectionSlug: "test-information", portal: LANG.TI_HD, paper: null, trfs: ["Not attached to any paper TRF"], testCodes: HD_CODES },
    { sectionName: "Considerations and Limitations", sectionSlug: "considerations-and-limitations", portal: LANG.CL_HD, paper: null, trfs: ["Not attached to any paper TRF"], testCodes: HD_CODES },
    { sectionName: "Confidentiality and Sample Retention", sectionSlug: "confidentiality-and-sample-retention", portal: LANG.CSR_ALL, paper: null, trfs: ["All"], testCodes: "All" },
    { sectionName: "Financial Agreement", sectionSlug: "financial-agreement", portal: LANG.FA_PORTAL_ALL, paper: LANG.FA_PAPER_ALL, trfs: ["All"], testCodes: "All TCs except Prenatal WGS (1842, 1843, 1844, 1845)" },
  ],
};

// ─── CKR items ─────────────────────────────────────────────────────────────────

export const CKR_ITEMS: CKRItem[] = [
  {
    slug: "statement-of-medical-necessity",
    title: "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    portal: LANG.CKR_SMN,
    paper: null,
    testCodes: "All TCs",
    trfs: ["All"],
  },
  {
    slug: "use-of-data-and-specimen",
    title: "Use of Data and Specimen for Research Purposes",
    portal: LANG.CKR_USE_OF_DATA,
    paper: null,
    testCodes: "All TCs (probands and comparators)",
    trfs: ["All"],
  },
  {
    slug: "new-york-state-residents",
    title: "For Samples Submitted from New York State Residents",
    portal: LANG.CKR_NYS,
    paper: null,
    testCodes: "All TCs (probands and comparators)",
    trfs: ["All"],
  },
  {
    slug: "acmg-secondary-findings",
    title: "Reporting of ACMG Secondary Findings",
    portal: LANG.CKR_ACMG,
    paper: null,
    testCodes: "WGS/WES (including prenatal): 1500, 1551, 1603, 1600, 1604, 1601, 1602, 1605, 1729, 1723, 1722, 1724, 1900, 1810, 1803, 1800, 1804, 1850, 1829, 1823, 1822, 1824, 1897, 60061, 8981, 60071, 1520\n\nPrenatal: 1622, 1623, 1843, 1844, 1845",
    trfs: [
      "Additional Affected Sibling for Trio",
      "Adult Screening Exome",
      "Additional Testing Req",
      "Whole Genome Sequencing",
      "Whole Exome Sequencing Reanalysis",
      "Whole Exome Sequencing",
      "Sequential Trio Whole Exome Sequencing",
      "Prenatal Trio Whole Exome Sequencing",
      "Prenatal WGS",
    ],
  },
  {
    slug: "incidental-findings",
    title: "Reporting of Incidental Findings",
    portal: LANG.CKR_INCIDENTAL,
    paper: null,
    testCodes: "WGS/WES: 1500, 1603, 1600, 1604, 1550, 1601, 1602, 1605, 1729, 1723, 1722, 1724, 1900, 1810, 1803, 1800, 1804, 1850, 1829, 1823, 1822, 1824, 1897, 60061, 8981, 60071, 1520",
    trfs: [
      "Additional Affected Sibling for Trio",
      "Adult Screening Exome",
      "Additional Testing Req",
      "Whole Genome Sequencing",
      "Whole Exome Sequencing Reanalysis",
      "Whole Exome Sequencing",
      "Sequential Trio Whole Exome Sequencing",
    ],
  },
  {
    slug: "genes-no-known-disease-association",
    title: "Reporting of Findings in Genes with No Known Disease Association",
    portal: LANG.CKR_GWNKDA,
    paper: null,
    testCodes: "WGS/WES trio and quad only (no prenatal): 1722, 1724, 1600, 1604, 1601, 1602, 1822, 1824, 1800, 1804",
    trfs: [
      "Additional Affected Sibling for Trio",
      "Adult Screening Exome",
      "Additional Testing Req",
      "Whole Genome Sequencing",
      "Whole Exome Sequencing Reanalysis",
      "Whole Exome Sequencing",
      "Sequential Trio Whole Exome Sequencing",
    ],
  },
  {
    slug: "mcc-studies-surrogates",
    title: "Use of Sample for MCC studies for Surrogates",
    portal: LANG.CKR_MCC,
    paper: null,
    testCodes: "Prenatal WGS/WES: 1622, 1623, 1822, 1824, 1800, 1804",
    trfs: ["Prenatal Trio WES", "Prenatal WGS"],
  },
];

// Which CKR items apply to each consent category (by title)
export const CKR_FOR_CONSENT: Record<string, string[]> = {
  "informed-consent-for-wes-and-wgs": [
    "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    "Use of Data and Specimen for Research Purposes",
    "For Samples Submitted from New York State Residents",
    "Reporting of ACMG Secondary Findings",
    "Reporting of Incidental Findings",
    "Reporting of Findings in Genes with No Known Disease Association",
  ],
  "prenatal-wgs-wes-consent": [
    "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    "Use of Data and Specimen for Research Purposes",
    "For Samples Submitted from New York State Residents",
    "Reporting of ACMG Secondary Findings",
    "Use of Sample for MCC studies for Surrogates",
  ],
  "general-genetic-testing-consent": [
    "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    "Use of Data and Specimen for Research Purposes",
    "For Samples Submitted from New York State Residents",
  ],
  "biochemical-genetic-consent": [
    "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    "Use of Data and Specimen for Research Purposes",
    "For Samples Submitted from New York State Residents",
  ],
  "huntington-disease-consent": [
    "Statement of Medical Necessity and Consent to Terms & Conditions for Test Order",
    "Use of Data and Specimen for Research Purposes",
    "For Samples Submitted from New York State Residents",
  ],
};
