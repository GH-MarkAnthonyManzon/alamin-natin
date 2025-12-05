// src/lib/official-sources.ts
/**
 * Whitelist of verified official Philippine government and academic sources.
 * Used to identify and badge official sources in the Verify Tool.
 * 
 * This is NOT a "reliability rating" - it's a factual registry of official entities.
 */

export interface OfficialSource {
  name: string;
  domain: string; // Primary domain (without www.)
  type: 'Government Agency' | 'Legislative' | 'Judicial' | 'Academic' | 'Electoral';
  description: string;
}

export const officialSources: OfficialSource[] = [
  // ELECTORAL BODIES
  {
    name: 'Commission on Elections (COMELEC)',
    domain: 'comelec.gov.ph',
    type: 'Electoral',
    description: 'Official Philippine election authority',
  },
  
  // GOVERNMENT AGENCIES
  {
    name: 'Commission on Audit (COA)',
    domain: 'coa.gov.ph',
    type: 'Government Agency',
    description: 'Official government auditing body',
  },
  {
    name: 'Presidential Communications Office (PCO)',
    domain: 'pco.gov.ph',
    type: 'Government Agency',
    description: 'Official government communications office',
  },
  {
    name: 'Department of the Interior and Local Government (DILG)',
    domain: 'dilg.gov.ph',
    type: 'Government Agency',
    description: 'Official local governance authority',
  },
  
  // LEGISLATIVE
  {
    name: 'Senate of the Philippines',
    domain: 'senate.gov.ph',
    type: 'Legislative',
    description: 'Official upper house of Congress',
  },
  {
    name: 'House of Representatives',
    domain: 'congress.gov.ph',
    type: 'Legislative',
    description: 'Official lower house of Congress',
  },
  
  // JUDICIAL
  {
    name: 'Supreme Court of the Philippines',
    domain: 'sc.judiciary.gov.ph',
    type: 'Judicial',
    description: 'Official highest court',
  },
  
  // ACADEMIC (Major state universities)
  {
    name: 'University of the Philippines',
    domain: 'up.edu.ph',
    type: 'Academic',
    description: 'State university and research institution',
  },
];

/**
 * Check if a URL is from an official source
 * @param url - The URL to check
 * @returns OfficialSource object if official, null otherwise
 */
export function isOfficialSource(url: string): OfficialSource | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '').toLowerCase();
    
    return officialSources.find(source => 
      hostname === source.domain || hostname.endsWith(`.${source.domain}`)
    ) || null;
  } catch {
    return null;
  }
}

/**
 * Get a badge label for official sources
 * @param source - The official source object
 * @returns Badge text
 */
export function getOfficialSourceBadge(source: OfficialSource): string {
  switch (source.type) {
    case 'Electoral':
      return '✓ Official Electoral Body';
    case 'Government Agency':
      return '✓ Official Government Agency';
    case 'Legislative':
      return '✓ Official Legislative Body';
    case 'Judicial':
      return '✓ Official Judicial Body';
    case 'Academic':
      return '✓ State Academic Institution';
    default:
      return '✓ Official Source';
  }
}