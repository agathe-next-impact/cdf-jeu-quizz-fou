import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "noreply@commedesfous.com";

export async function sendResetEmail(
  to: string,
  pseudo: string,
  resetUrl: string
): Promise<void> {
  await transporter.sendMail({
    from: `"Comme des Fous" <${FROM}>`,
    to,
    subject: "Réinitialisation de ton mot de passe",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 16px;">
        <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px;">Salut ${pseudo} !</h1>
        <p style="color: #374151; margin: 0 0 24px;">
          Tu as demandé à réinitialiser ton mot de passe sur <strong>Comme des Fous</strong>.
        </p>
        <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: #000; color: #fff; font-weight: 700; text-decoration: none; border-radius: 12px;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #6b7280; font-size: 13px; margin: 24px 0 0;">
          Ce lien expire dans 1 heure. Si tu n'as pas fait cette demande, ignore cet email.
        </p>
      </div>
    `,
  });
}
