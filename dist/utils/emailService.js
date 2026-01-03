import nodemailer from 'nodemailer';
import { appConfig } from '../config/app.config.js';
/**
 * Email service for sending notifications
 */
class EmailService {
    transporter;
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
    async sendLoginSuccessNotification(userEmail, userName) {
        try {
            const mailOptions = {
                from: `"Hire Helping Hand" <${appConfig.email.from}>`,
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
        }
        catch (error) {
            console.error('Failed to send login success notification:', error);
            // Don't throw error to avoid breaking the login flow
        }
    }
    /**
     * Send email verification email
     */
    async sendEmailVerification(userEmail, userName, verificationToken) {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
            const mailOptions = {
                from: `"Hire Helping Hand" <${appConfig.email.from}>`,
                to: userEmail,
                subject: 'Verify Your Email Address - Hire Helping Hand',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0;">Welcome to Hire Helping Hand!</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #495057; margin-top: 0;">Hi ${userName},</h2>
              <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
                Thank you for signing up with Hire Helping Hand! To complete your registration and start using our platform, 
                please verify your email address by clicking the button below.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; 
                          border-radius: 5px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #6c757d; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, you can also copy and paste this link into your browser:
              </p>
              <p style="color: #007bff; font-size: 14px; word-break: break-all;">
                ${verificationUrl}
              </p>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your email 
                within this time, you'll need to request a new verification email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                If you didn't create an account with Hire Helping Hand, you can safely ignore this email.
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">
                This is an automated message from Hire Helping Hand. Please do not reply to this email.
              </p>
            </div>
          </div>
        `,
            };
            await this.transporter.sendMail(mailOptions);
            console.log(`Email verification sent to: ${userEmail}`);
        }
        catch (error) {
            console.error('Failed to send email verification:', error);
            throw error; // Re-throw to handle in the calling function
        }
    }
    /**
     * Test email configuration
     */
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('Email service connection verified successfully');
            return true;
        }
        catch (error) {
            console.error('Email service connection failed:', error);
            return false;
        }
    }
}
// Export singleton instance
export const emailService = new EmailService();
//# sourceMappingURL=emailService.js.map