export type ApplicationSource = 'Email' | 'Share' | 'Bookmarklet';

export type ApplicationStatus = 
  | 'Applied' 
  | 'PhoneScreen' 
  | 'Interview' 
  | 'Offer' 
  | 'Rejected' 
  | 'Ghosted';

export type FollowupKind = '+7d' | '+14d';

export type Vendor = 
  | 'greenhouse' 
  | 'lever' 
  | 'workday' 
  | 'icims' 
  | 'smartrecruiters' 
  | 'ashby' 
  | 'unknown';

export interface Application {
  id: string;
  title: string;
  company: string;
  location: string | null;
  job_url: string | null;
  job_id: string | null;
  source: ApplicationSource;
  applied_at: Date;
  status: ApplicationStatus;
  needs_review: boolean;
  last_email_msg_id: string | null;
  dedupe_key: string;
  notes: string | null;
  user_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Followup {
  id: string;
  application_id: string;
  due_at: Date;
  kind: FollowupKind;
  sent_at: Date | null;
  created_at: Date;
}

export interface User {
  id: string;
  email: string;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  source: string;
  payload_hash: string;
  user_id: string | null;
  created_at: Date;
}

export interface ParsedApplication {
  title: string;
  company: string;
  location?: string;
  job_url?: string;
  job_id?: string;
  applied_at?: Date;
  vendor?: Vendor;
  confidence?: number;
}

