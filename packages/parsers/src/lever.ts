import { ParsedApplication } from '@job-tracker/shared';

const LEVER_SENDER_PATTERN = /@hire\.lever\.co$/i;
const LEVER_URL_PATTERN = /lever\.co/i;
const APPLIED_TO_PATTERN = /applied\s+(?:to|for)\s+(.+?)\s+at\s+(.+?)(?:\n|\.|\s+in\s+)/i;
const POSITION_PATTERN = /position[:\s]+(.+?)(?:\n|$)/i;
const COMPANY_PATTERN = /company[:\s]+(.+?)(?:\n|$)/i;
const JOB_URL_PATTERN = /(https?:\/\/[^\s]+lever\.co[^\s"<]+)/i;

export function parseLever(emailContent: string, sender: string): ParsedApplication | null {
  const isLeverSender = LEVER_SENDER_PATTERN.test(sender);
  const hasLeverUrl = LEVER_URL_PATTERN.test(emailContent);

  if (!isLeverSender && !hasLeverUrl) {
    return null;
  }

  // Try the "applied to X at Y" pattern first
  const appliedToMatch = emailContent.match(APPLIED_TO_PATTERN);
  if (appliedToMatch) {
    const urlMatch = emailContent.match(JOB_URL_PATTERN);
    
    return {
      title: appliedToMatch[1].trim(),
      company: appliedToMatch[2].trim(),
      job_url: urlMatch?.[1]?.trim(),
      vendor: 'lever',
      confidence: 0.9,
    };
  }

  // Fallback to generic patterns
  const titleMatch = emailContent.match(POSITION_PATTERN);
  const companyMatch = emailContent.match(COMPANY_PATTERN);
  const urlMatch = emailContent.match(JOB_URL_PATTERN);

  if (!titleMatch || !companyMatch) {
    return null;
  }

  return {
    title: titleMatch[1].trim(),
    company: companyMatch[1].trim(),
    job_url: urlMatch?.[1]?.trim(),
    vendor: 'lever',
    confidence: 0.85,
  };
}

