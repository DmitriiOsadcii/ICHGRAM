import 'dotenv/config';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_FROM,
  MAILGUN_REGION, // US | EU
} = process.env;

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_API_KEY и MAILGUN_DOMAIN должны быть заданы в .env');
}

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  url: MAILGUN_REGION === 'EU' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net',
});

export interface IEmailData {
  to: string[] | string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

const sendEmail = async (data: IEmailData) => {
  const to = Array.isArray(data.to) ? data.to : [data.to];
  const from = data.from || MAILGUN_FROM || `no-reply@${MAILGUN_DOMAIN}`;

  const payload = {
    from,
    to,                         // Mailgun принимает массив
    subject: data.subject,
    text: data.text || '',      // на всякий случай
    html: data.html || undefined,
  };

  try {
    const res = await mg.messages.create(MAILGUN_DOMAIN!, payload);
    return res;
  } catch (err: any) {
    // подробный лог — очень помогает понять 403/400/401
    console.error('Mailgun error status:', err?.status);
    console.error('Mailgun error details:', err?.details || err?.message || err);
    throw err;
  }
};

export default sendEmail;