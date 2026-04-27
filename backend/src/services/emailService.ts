import nodemailer from 'nodemailer';
import { ClaimStatus, IClaim } from '../types';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private static getStatusColor(status: ClaimStatus): string {
    const colors: Record<ClaimStatus, string> = {
      Pending: '#f59e0b',
      'Under Review': '#3b82f6',
      Approved: '#10b981',
      Rejected: '#ef4444',
    };
    return colors[status];
  }

  private static getStatusMessage(status: ClaimStatus): string {
    const messages: Record<ClaimStatus, string> = {
      Pending: 'Your claim has been received and is pending review.',
      'Under Review': 'Our team is actively reviewing your claim. We will update you soon.',
      Approved: 'Congratulations! Your insurance claim has been approved. Our team will contact you regarding the next steps.',
      Rejected: 'We regret to inform you that your claim has been rejected. Please contact our support team for more information.',
    };
    return messages[status];
  }

  private static buildEmailTemplate(claim: IClaim, newStatus: ClaimStatus, note?: string): string {
    const statusColor = EmailService.getStatusColor(newStatus);
    const statusMessage = EmailService.getStatusMessage(newStatus);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>InsureBot - Claim Status Update</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .header p { color: #bfdbfe; margin: 8px 0 0 0; }
    .body { padding: 32px; }
    .status-badge { display: inline-block; padding: 8px 20px; background-color: ${statusColor}; color: white; border-radius: 20px; font-weight: bold; font-size: 16px; margin: 16px 0; }
    .info-box { background: #f8fafc; border-left: 4px solid ${statusColor}; padding: 16px; border-radius: 4px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
    .info-label { color: #6b7280; font-size: 14px; }
    .info-value { color: #111827; font-weight: 600; font-size: 14px; }
    .message { color: #374151; line-height: 1.6; margin: 20px 0; }
    .note-box { background: #fef3c7; border: 1px solid #fbbf24; padding: 12px 16px; border-radius: 8px; margin: 16px 0; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ InsureBot</h1>
      <p>AI-Powered Insurance Claims Assistant</p>
    </div>
    <div class="body">
      <p style="color: #374151; font-size: 18px;">Hello, <strong>${claim.claimerName}</strong></p>
      <p class="message">Your insurance claim status has been updated.</p>
      <div style="text-align: center;">
        <span class="status-badge">${newStatus}</span>
      </div>
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Policy Number</span>
          <span class="info-value">${claim.policyNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Claim Type</span>
          <span class="info-value" style="text-transform: capitalize;">${claim.claimType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Claim Amount</span>
          <span class="info-value">$${claim.amount.toLocaleString()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Incident Type</span>
          <span class="info-value">${claim.incidentType}</span>
        </div>
      </div>
      <p class="message">${statusMessage}</p>
      ${note ? `<div class="note-box"><strong>📝 Note from our team:</strong><p style="margin: 8px 0 0 0; color: #92400e;">${note}</p></div>` : ''}
      <p class="message">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
    </div>
    <div class="footer">
      <p>This is an automated notification from InsureBot.</p>
      <p>© ${new Date().getFullYear()} InsureBot. All rights reserved.</p>
      <p>Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  static async sendStatusUpdateEmail(
    claim: IClaim,
    newStatus: ClaimStatus,
    note?: string
  ): Promise<void> {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass || smtpUser === 'your_email@gmail.com') {
      console.warn('Email service not configured. Skipping email notification.');
      console.log(`[EMAIL MOCK] Would send status update email to ${claim.claimerEmail}: ${newStatus}`);
      return;
    }

    const transporter = EmailService.createTransporter();

    const emailOptions: EmailOptions = {
      to: claim.claimerEmail,
      subject: `InsureBot — Your Claim Status: ${newStatus} | Policy ${claim.policyNumber}`,
      html: EmailService.buildEmailTemplate(claim, newStatus, note),
    };

    try {
      await transporter.verify();
      await transporter.sendMail({
        from: `"InsureBot 🛡️" <${smtpUser}>`,
        ...emailOptions,
      });

      console.log(`Email sent successfully to ${claim.claimerEmail} — Status: ${newStatus}`);

      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await transporter.sendMail({
          from: `"InsureBot 🛡️" <${smtpUser}>`,
          to: adminEmail,
          subject: `[ADMIN] Claim Status Updated: ${newStatus} | Policy ${claim.policyNumber}`,
          html: EmailService.buildEmailTemplate(claim, newStatus, note),
        });
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}
