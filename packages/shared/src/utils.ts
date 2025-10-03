import { createHash } from 'crypto';

/**
 * Normalize a string for comparison
 */
export function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Create SHA1 hash
 */
export function sha1(data: string): string {
  return createHash('sha1').update(data).digest('hex');
}

/**
 * Generate dedupe key for an application
 */
export function generateDedupeKey(
  company: string,
  title: string,
  url: string | null | undefined,
  appliedAt: Date
): string {
  const normalizedCompany = normalize(company);
  const normalizedTitle = normalize(title);
  const canonicalUrl = url ? extractDomain(url) || '' : '';
  const day = appliedAt.toISOString().split('T')[0];
  
  const data = `${normalizedCompany}|${normalizedTitle}|${canonicalUrl}|${day}`;
  return sha1(data);
}

/**
 * Check if date is within ±1 day
 */
export function isWithinOneDay(date1: Date, date2: Date): boolean {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const oneDayMs = 24 * 60 * 60 * 1000;
  return diff <= oneDayMs;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

