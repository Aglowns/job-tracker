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

export function extractOutlookEmailData(message: OutlookMessage) {
  return {
    messageId: message.id,
    subject: message.subject,
    sender: `${message.from.emailAddress.name} <${message.from.emailAddress.address}>`,
    content: message.body.content,
  };
}
