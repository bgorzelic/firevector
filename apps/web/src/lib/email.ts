import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'Firevector <noreply@firevector.org>';
const BASE_URL = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${BASE_URL}/verify-email?token=${token}`;

  const { emailVerificationTemplate } = await import('./email-templates');

  await getResend().emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Verify your email — Firevector',
    html: emailVerificationTemplate(name, verifyUrl),
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const { passwordResetTemplate } = await import('./email-templates');

  await getResend().emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Reset your password — Firevector',
    html: passwordResetTemplate(name, resetUrl),
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const loginUrl = `${BASE_URL}/login`;

  const { welcomeTemplate } = await import('./email-templates');

  await getResend().emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Welcome to Firevector',
    html: welcomeTemplate(name, loginUrl),
  });
}
