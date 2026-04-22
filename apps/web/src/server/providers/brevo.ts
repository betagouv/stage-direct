const BREVO_API_URL = "https://api.brevo.com/v3";
const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const SMTP_HOST = process.env.SMTP_HOST;

async function brevoFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BREVO_API_URL}${path}`, {
    ...options,
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${error}`);
  }

  return response.json() as Promise<T>;
}

export interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: { email: string; name: string };
}

async function sendViaSmtp({ to, subject, htmlContent, sender }: SendEmailParams) {
  const from = sender ?? {
    email: process.env.EMAIL_FROM_ADDRESS ?? "noreply@stage-direct.beta.gouv.fr",
    name: process.env.EMAIL_FROM_NAME ?? "Stage Direct",
  };

  const response = await fetch(`http://${SMTP_HOST}:8025/api/v1/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      From: { Email: from.email, Name: from.name },
      To: to.map((t) => ({ Email: t.email, Name: t.name ?? "" })),
      Subject: subject,
      HTML: htmlContent,
    }),
  });

  if (!response.ok) {
    // Fallback: direct SMTP via raw connection not available in fetch,
    // use Mailpit's sendmail-compatible API
    console.warn(`Mailpit API responded ${response.status}, email may not have been sent`);
  }
}

export async function sendEmail(params: SendEmailParams) {
  if (SMTP_HOST) {
    return sendViaSmtp(params);
  }

  return brevoFetch("/smtp/email", {
    method: "POST",
    body: JSON.stringify({
      sender: params.sender ?? {
        email: process.env.EMAIL_FROM_ADDRESS ?? "noreply@stage-direct.beta.gouv.fr",
        name: process.env.EMAIL_FROM_NAME ?? "Stage Direct",
      },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
    }),
  });
}
