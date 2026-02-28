function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Firevector</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #FFFFFF; letter-spacing: 3px;">FIREVECTOR</h1>
              <p style="margin: 4px 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.85); letter-spacing: 1px; text-transform: uppercase;">Wildfire Observation Intelligence</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; font-size: 13px; color: #9CA3AF;">Firevector &mdash; Wildfire Observation Intelligence</p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #D1D5DB;">&copy; ${new Date().getFullYear()} Firevector. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 32px auto;">
  <tr>
    <td align="center" style="border-radius: 6px; background-color: #F59E0B;">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px;">${label}</a>
    </td>
  </tr>
</table>
<p style="margin: 0; font-size: 13px; color: #9CA3AF; text-align: center; word-break: break-all;">
  Or copy and paste this URL into your browser:<br>
  <a href="${url}" style="color: #F59E0B; text-decoration: underline;">${url}</a>
</p>`;
}

export function emailVerificationTemplate(name: string, verifyUrl: string): string {
  const content = `
<h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #111827;">Verify your email</h2>
<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.6; color: #374151;">Hi ${name},</p>
<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.6; color: #374151;">
  Thanks for signing up for Firevector. Please verify your email address by clicking the button below.
</p>
<p style="margin: 0 0 4px; font-size: 15px; line-height: 1.6; color: #374151;">
  This link will expire in <strong>24 hours</strong>.
</p>
${ctaButton('Verify Email', verifyUrl)}
<p style="margin: 24px 0 0; font-size: 13px; line-height: 1.5; color: #9CA3AF;">
  If you didn't create a Firevector account, you can safely ignore this email.
</p>`;

  return emailWrapper(content);
}

export function passwordResetTemplate(name: string, resetUrl: string): string {
  const content = `
<h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #111827;">Reset your password</h2>
<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.6; color: #374151;">Hi ${name},</p>
<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.6; color: #374151;">
  We received a request to reset your Firevector password. Click the button below to choose a new one.
</p>
<p style="margin: 0 0 4px; font-size: 15px; line-height: 1.6; color: #374151;">
  This link will expire in <strong>1 hour</strong>.
</p>
${ctaButton('Reset Password', resetUrl)}
<p style="margin: 24px 0 0; font-size: 13px; line-height: 1.5; color: #9CA3AF;">
  If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
</p>`;

  return emailWrapper(content);
}

export function welcomeTemplate(name: string, loginUrl: string): string {
  const content = `
<h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #111827;">Welcome to Firevector</h2>
<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.6; color: #374151;">Hi ${name},</p>
<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.6; color: #374151;">
  Your email has been verified and your Firevector account is ready to go. You now have access to wildfire observation tools, fire behavior calculations, and real-time field data capture.
</p>
<p style="margin: 0 0 4px; font-size: 15px; line-height: 1.6; color: #374151;">
  Log in to get started.
</p>
${ctaButton('Get Started', loginUrl)}
<p style="margin: 24px 0 0; font-size: 13px; line-height: 1.5; color: #9CA3AF;">
  If you have any questions, reply to this email and we'll be happy to help.
</p>`;

  return emailWrapper(content);
}
