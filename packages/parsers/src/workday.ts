import { ParsedApplication } from '@job-tracker/shared';

const WORKDAY_URL_PATTERN = /workday\.com/i;
const SUBMITTED_PATTERN = /successfully\s+submitted\s+your\s+application/i;
const POSITION_PATTERN = /(?:position|role|job)[:\s]+(.+?)(?:\n|$|at)/i;
const COMPANY_PATTERN = /(?:company|organization)[:\s]+(.+?)(?:\n|$)/i;
const LOCATION_PATTERN = /(?:location|city)[:\s]+(.+?)(?:\n|$)/i;
const JOB_URL_PATTERN = /(https?:\/\/[^\s]+workday\.com[^\s"<]+)/i;

export function parseWorkday(emailContent: string): ParsedApplication | null {
  const hasWorkdayUrl = WORKDAY_URL_PATTERN.test(emailContent);
  const hasSubmittedText = SUBMITTED_PATTERN.test(emailContent);

  if (!hasWorkdayUrl && !hasSubmittedText) {
    return null;
  }

  const titleMatch = emailContent.match(POSITION_PATTERN);
  const companyMatch = emailContent.match(COMPANY_PATTERN);
  const locationMatch = emailContent.match(LOCATION_PATTERN);
  const urlMatch = emailContent.match(JOB_URL_PATTERN);

  // Extract company from URL if not found in text
  let company = companyMatch?.[1]?.trim();
  if (!company && urlMatch) {
    const urlParts = urlMatch[1].match(/\/\/(.+?)\.workday\.com/);
    if (urlParts) {
      company = urlParts[1].replace(/-/g, ' ');
    }
  }

  if (!titleMatch || !company) {
    return null;
  }

  return {
    title: titleMatch[1].trim(),
    company,
    location: locationMatch?.[1]?.trim(),
    job_url: urlMatch?.[1]?.trim(),
    vendor: 'workday',
    confidence: 0.85,
  };
}

