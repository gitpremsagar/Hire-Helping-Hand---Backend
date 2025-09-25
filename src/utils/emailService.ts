import nodemailer from 'nodemailer';
import { appConfig } from '../config/app.config.js';

/**
 * Email service for sending notifications
 */
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: appConfig.email.smtp.host,
      port: appConfig.email.smtp.port,
      secure: appConfig.email.smtp.secure,
      auth: {
        user: appConfig.email.smtp.auth.user,
        pass: appConfig.email.smtp.auth.pass,
      },
    });
  }

  /**
   * Send login success notification email
   */
  async sendLoginSuccessNotification(userEmail: string, userName: string): Promise<void> {
    try {
      const mailOptions = {
        from: appConfig.email.from,
        to: appConfig.email.adminEmail, // Send to psagar172@gmail.com
        subject: 'User Login Success Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Login Success Notification</h2>
            <p>A user has successfully logged into the system.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">User Details:</h3>
              <p><strong>Name:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #6c757d; font-size: 14px;">
              This is an automated notification from the Hire Helping Hand system.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Login success notification sent for user: ${userEmail}`);
    } catch (error) {
      console.error('Failed to send login success notification:', error);
      // Don't throw error to avoid breaking the login flow
    }
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
