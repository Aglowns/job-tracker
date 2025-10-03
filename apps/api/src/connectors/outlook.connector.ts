import { Client } from '@microsoft/microsoft-graph-client';
import { env } from '../config';

export interface OutlookMessage {
  id: string;
  subject: string;
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  body: {
    contentType: string;
    content: string;
  };
}

export function initOutlookClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

export async function pollOutlookMessages(accessToken: string): Promise<OutlookMessage[]> {
  try {
    const client = initOutlookClient(accessToken);

    // Search for messages
    const searchQuery = 'application received OR thanks for applying';
    
    const response = await client
      .api('/me/messages')
      .search(searchQuery)
      .top(50)
      .get();

    return response.value || [];
  } catch (error) {
    console.error('Error polling Outlook:', error);
    throw error;
  }
}

export function extractOutlookEmailData(message: OutlookMessage) {
  return {
    messageId: message.id,
    subject: message.subject,
    sender: `${message.from.emailAddress.name} <${message.from.emailAddress.address}>`,
    content: message.body.content,
  };
}

