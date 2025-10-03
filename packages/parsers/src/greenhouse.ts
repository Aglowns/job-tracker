import { ParsedApplication } from '@job-tracker/shared';

const GREENHOUSE_SENDER_PATTERN = /@greenhouse\.io$/i;
const POSITION_PATTERN = /position[:\s]+([^\n]+)/i;
const COMPANY_PATTERN = /(?:company[:\s]+|at\s+)([^\n]+)/i;
const LOCATION_PATTERN = /location[:\s]+([^\n]+)/i;
const JOB_URL_PATTERN = /(https?:\/\/[^\s]+greenhouse\.io[^\s"<]+)/i;

export function parseGreenhouse(emailContent: string, sender: string): ParsedApplication | null {
  if (!GREENHOUSE_SENDER_PATTERN.test(sender)) {
    return null;
  }

  const titleMatch = emailContent.match(POSITION_PATTERN);
  const companyMatch = emailContent.match(COMPANY_PATTERN);
  const locationMatch = emailContent.match(LOCATION_PATTERN);
  const urlMatch = emailContent.match(JOB_URL_PATTERN);

  if (!titleMatch || !companyMatch) {
    return null;
  }

  return {
    title: titleMatch[1].trim(),
    company: companyMatch[1].trim(),
    location: locationMatch?.[1]?.trim(),
    job_url: urlMatch?.[1]?.trim(),
    vendor: 'greenhouse',
    confidence: 0.9,
  };
}

