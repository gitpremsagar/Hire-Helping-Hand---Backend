/**
 * Email service for sending notifications
 */
declare class EmailService {
    private transporter;
    constructor();
    /**
     * Send login success notification email
     */
    sendLoginSuccessNotification(userEmail: string, userName: string): Promise<void>;
    /**
     * Send email verification email
     */
    sendEmailVerification(userEmail: string, userName: string, verificationToken: string): Promise<void>;
    /**
     * Test email configuration
     */
    testConnection(): Promise<boolean>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map