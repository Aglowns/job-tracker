import { ParsedApplication } from '@job-tracker/shared';
import { parseGreenhouse } from './greenhouse';
import { parseLever } from './lever';
import { parseWorkday } from './workday';
import { parseFallback } from './fallback';

export interface EmailData {
  content: string;
  subject: string;
  sender: string;
}

/**
 * Parse an email receipt and extract job application information
 * Uses dictionary-first approach with fallback heuristics
 */
export function parseReceipt(email: EmailData): ParsedApplication | null {
  const { content, subject, sender } = email;

  // Try dictionary-first parsers
  const parsers = [
    () => parseGreenhouse(content, sender),
    () => parseLever(content, sender),
    () => parseWorkday(content),
  ];

  for (const parser of parsers) {
    const result = parser();
    if (result) {
      return result;
    }
  }

  // Fallback to heuristic parser
  return parseFallback(content, subject, sender);
}

/**
 * Parse shared content (from PWA or bookmarklet)
 */
export function parseSharedContent(
  url?: string,
  title?: string,
  text?: string
): ParsedApplication {
  let confidence = 0.5;
  let company = 'Unknown Company';
  let jobTitle = title || 'Unknown Position';

  // Try to extract company from URL domain
  if (url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/^www\./, '');
      const parts = hostname.split('.');
      if (parts.length > 1) {
        company = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        confidence += 0.15;
      }
    } catch {
      // Invalid URL, ignore
    }
  }

  // Try to extract better info from title
  if (title) {
    const atMatch = title.match(/(.+?)\s+at\s+(.+?)(?:\s*-|$)/i);
    if (atMatch) {
      jobTitle = atMatch[1].trim();
      company = atMatch[2].trim();
      confidence += 0.2;
    }
  }

  // Try to extract info from text
  if (text) {
    const companyMatch = text.match(/company[:\s]+([^\n]+)/i);
    if (companyMatch) {
      company = companyMatch[1].trim();
      confidence += 0.1;
    }

    const positionMatch = text.match(/position[:\s]+([^\n]+)/i);
    if (positionMatch) {
      jobTitle = positionMatch[1].trim();
      confidence += 0.1;
    }
  }

  return {
    title: jobTitle,
    company,
    job_url: url,
    vendor: 'unknown',
    confidence: Math.min(1, confidence),
  };
}

export * from './greenhouse';
export * from './lever';
export * from './workday';
export * from './fallback';

