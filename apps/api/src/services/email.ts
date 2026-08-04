const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_SENDER = process.env.BREVO_SENDER || 'AutoEsperto <noreply@autoesperto.app>';
const WEB_URL = process.env.WEB_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.vercel.app';

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.warn('[email] BREVO_API_KEY mancante — email non inviata a', to);
    return false;
  }
  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: BREVO_SENDER,
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text || html.replace(/<[^>]+>/g, ''),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[email] Brevo errore', res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] invio fallito', err);
    return false;
  }
}

export function sendVerificationEmail(to: string, token: string): Promise<boolean> {
  const link = `${WEB_URL}/accesso?verify=${encodeURIComponent(token)}`;
  const html = `<!DOCTYPE html>
<html lang="it"><body style="font-family:Inter,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0F172A">
<div style="text-align:center;margin-bottom:24px"><strong style="font-size:22px">AutoEsperto</strong></div>
<h1 style="font-size:20px">Verifica la tua email</h1>
<p style="font-size:15px;line-height:1.6">Ciao,</p>
<p style="font-size:15px;line-height:1.6">Conferma la tua email per attivare l'analisi gratuita inclusa nel tuo account. Senza questa verifica non puoi usare il trial.</p>
<p style="margin:28px 0;text-align:center"><a href="${link}" style="display:inline-block;background:#0F172A;color:white;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none">Verifica l'email</a></p>
<p style="font-size:13px;color:#64748B">Oppure copia questo link:<br><a href="${link}" style="word-break:break-all">${link}</a></p>
<p style="font-size:13px;color:#64748B;margin-top:32px">Se non hai creato un account su AutoEsperto, ignora questa email.</p>
</body></html>`;
  return sendEmail({ to, subject: 'AutoEsperto — Verifica la tua email', html });
}