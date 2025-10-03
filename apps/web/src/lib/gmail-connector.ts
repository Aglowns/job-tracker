export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: any;
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
