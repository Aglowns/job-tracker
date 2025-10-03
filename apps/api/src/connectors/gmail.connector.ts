import { google } from 'googleapis';
import { env } from '../config';

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: any;
}

const SEARCH_QUERY = `
  (subject:("application received" OR "thanks for applying" OR "application submitted")
   OR ("thanks for applying" OR "we received your application"))
  -in:chats newer_than:30d
`.replace(/\s+/g, ' ').trim();

export async function initGmailClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    env.GMAIL_CLIENT_ID,
    env.GMAIL_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ access_token: accessToken });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function pollGmailMessages(accessToken: string): Promise<GmailMessage[]> {
  try {
    const gmail = await initGmailClient(accessToken);

    // Search for messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: SEARCH_QUERY,
      maxResults: 50,
    });

    const messages = response.data.messages || [];
    const fullMessages: GmailMessage[] = [];

    // Fetch full message details
    for (const message of messages) {
      if (message.id) {
        const full = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full',
        });
        fullMessages.push(full.data as GmailMessage);
      }
    }

    return fullMessages;
  } catch (error) {
    console.error('Error polling Gmail:', error);
    throw error;
  }
}

export function extractEmailData(message: GmailMessage) {
  const headers = message.payload.headers || [];
  
  const getHeader = (name: string) => {
    const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
    return header?.value || '';
  };

  const subject = getHeader('Subject');
  const from = getHeader('From');
  
  // Extract body
  let body = '';
  
  const extractBody = (part: any): string => {
    if (part.body && part.body.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf-8');
    }
    
    if (part.parts) {
      for (const subpart of part.parts) {
        const text = extractBody(subpart);
        if (text) return text;
      }
    }
    
    return '';
  };
  
  body = extractBody(message.payload);

  return {
    messageId: message.id,
    subject,
    sender: from,
    content: body,
  };
}

