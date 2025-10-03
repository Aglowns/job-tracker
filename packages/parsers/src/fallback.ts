import { ParsedApplication } from '@job-tracker/shared';

const TITLE_FROM_SUBJECT_PATTERN = /(?:application|applied|applying)\s+(?:to|for)\s+(.+?)\s+at/i;
const COMPANY_FROM_SUBJECT_PATTERN = /at\s+([^-\n]+?)(?:\s*-|$)/i;
const URL_PATTERN = /(https?:\/\/[^\s"<]+(?:jobs|careers|workday|greenhouse|lever|icims|smartrecruiters|ashby)[^\s"<]*)/i;
const GENERIC_URL_PATTERN = /(https?:\/\/[^\s"<]+)/i;

export function parseFallback(
  emailContent: string, 
  subject: string, 
  sender: string
): ParsedApplication | null {
  let title: string | undefined;
  let company: string | undefined;
  let job_url: string | undefined;
  let confidence = 0.3;

  // Try to extract title from subject
  const titleMatch = subject.match(TITLE_FROM_SUBJECT_PATTERN);
  if (titleMatch) {
    title = titleMatch[1].trim();
    confidence += 0.15;
  } else {
    // Try to find title in first lines of email
    const lines = emailContent.split('\n').slice(0, 10);
    for (const line of lines) {
      if (line.match(/position|role|job/i) && line.length < 100) {
        const parts = line.split(/[:]/);
        if (parts.length > 1) {
          title = parts[1].trim();
          confidence += 0.1;
          break;
        }
      }
    }
  }

  // Try to extract company from subject
  const companyMatch = subject.match(COMPANY_FROM_SUBJECT_PATTERN);
  if (companyMatch) {
    company = companyMatch[1].trim();
    confidence += 0.15;
  } else {
    // Try from sender display name
    const senderNameMatch = sender.match(/^(.+?)\s*</);
    if (senderNameMatch) {
      company = senderNameMatch[1].trim();
      confidence += 0.05;
    }
  }

  // Try to find job URL
  const urlMatch = emailContent.match(URL_PATTERN);
  if (urlMatch) {
    job_url = urlMatch[1].trim();
    confidence += 0.1;
  } else {
    const genericUrlMatch = emailContent.match(GENERIC_URL_PATTERN);
    if (genericUrlMatch) {
      job_url = genericUrlMatch[1].trim();
      confidence += 0.05;
    }
  }

  // Need at least title or company
  if (!title && !company) {
    return null;
  }

  // Use placeholder if one is missing
  if (!title) {
    title = 'Unknown Position';
    confidence -= 0.2;
  }
  if (!company) {
    company = 'Unknown Company';
    confidence -= 0.2;
  }

  return {
    title,
    company,
    job_url,
    vendor: 'unknown',
    confidence: Math.max(0, Math.min(1, confidence)),
  };
}

