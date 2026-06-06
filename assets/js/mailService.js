// Email/Mail Service Integration
class MailService {
  constructor() {
    this.apiEndpoint = process.env.MAIL_API_ENDPOINT || '/api/mail';
    this.senderEmail = 'noreply@ecetx.com';
    this.templates = this.initializeEmailTemplates();
  }

  // Initialize email templates
  initializeEmailTemplates() {
    return {
      welcome: {
        subject: 'Welcome to ECETX - Your Learning Journey Begins!',
        template: (user) => `
          <h2>Welcome to ECETX!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your account has been successfully created. You're now part of our community of ${50000} students!</p>
          <p><strong>Your branch:</strong> ${user.branch}</p>
          <p>Start your learning journey now:</p>
          <a href="https://ecetx.com/dashboard">Go to Dashboard</a>
          <p>Best regards,<br/>ECETX Team</p>
        `,
      },

      'password-reset': {
        subject: 'ECETX - Password Reset Request',
        template: (user) => `
          <h2>Password Reset</h2>
          <p>Hi ${user.email},</p>
          <p>We received a request to reset your password. Click the link below to create a new password:</p>
          <a href="https://ecetx.com/reset-password?token=${user.resetToken}">Reset Password</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br/>ECETX Team</p>
        `,
      },

      'material-available': {
        subject: 'New Study Materials Available!',
        template: (user) => `
          <h2>New Study Materials</h2>
          <p>Hi ${user.firstName},</p>
          <p>New study materials have been added to your branch: <strong>${user.branch}</strong></p>
          <p>Check them out now:</p>
          <a href="https://ecetx.com/learn">View Materials</a>
          <p>Best regards,<br/>ECETX Team</p>
        `,
      },

      'test-results': {
        subject: 'Your ECETX Test Results',
        template: (user) => `
          <h2>Test Results</h2>
          <p>Hi ${user.firstName},</p>
          <p><strong>Test:</strong> ${user.testName}</p>
          <p><strong>Score:</strong> ${user.score}/${user.totalMarks}</p>
          <p><strong>Accuracy:</strong> ${user.accuracy}%</p>
          <p>Review your performance and improve:</p>
          <a href="https://ecetx.com/dashboard">View Analytics</a>
          <p>Best regards,<br/>ECETX Team</p>
        `,
      },

      'newsletter': {
        subject: 'ECETX Newsletter - Stay Updated',
        template: (user) => `
          <h2>ECETX Newsletter</h2>
          <p>Hi ${user.email},</p>
          <p>Thank you for subscribing to our newsletter. You'll now receive updates about:</p>
          <ul>
            <li>New courses and study materials</li>
            <li>Exam tips and strategies</li>
            <li>Success stories from our students</li>
          </ul>
          <p>Best regards,<br/>ECETX Team</p>
        `,
      },

      'contact-reply': {
        subject: 'ECETX - We Received Your Message',
        template: (user) => `
          <h2>Message Received</h2>
          <p>Hi ${user.email},</p>
          <p>Thank you for contacting ECETX. We have received your message and will get back to you within 24 hours.</p>
          <p>In the meantime, check out our <a href="https://ecetx.com/contact">FAQ section</a> for quick answers.</p>
          <p>Best regards,<br/>ECETX Support Team</p>
        `,
      },
    };
  }

  /**
   * Send Email
   * @param {string} to - Recipient email
   * @param {string} templateType - Type of email template
   * @param {object} data - Data to populate template
   */
  async sendEmail(to, templateType, data) {
    const template = this.templates[templateType];
    if (!template) {
      console.error(`Email template '${templateType}' not found`);
      return { success: false, error: 'Template not found' };
    }

    const emailPayload = {
      to: to,
      from: this.senderEmail,
      subject: template.subject,
      htmlContent: template.template(data),
      timestamp: new Date().toISOString(),
      templateType: templateType,
    };

    try {
      // Log for development
      console.log('📧 Email Service - Sending:', {
        to: emailPayload.to,
        subject: emailPayload.subject,
        templateType: templateType,
      });

      // Try to send via API (if backend available)
      const response = await this.sendViaAPI(emailPayload);

      if (response.success) {
        console.log('✅ Email sent successfully');
        return { success: true, messageId: response.messageId };
      } else {
        // Fallback: Store for later sending
        console.warn('⚠️ Email queued for later sending');
        this.storeEmailInQueue(emailPayload);
        return {
          success: true,
          queued: true,
          message: 'Email queued for sending',
        };
      }
    } catch (error) {
      console.error('❌ Email send failed:', error);
      this.storeEmailInQueue(emailPayload);
      return {
        success: true,
        queued: true,
        message: 'Email will be sent when connection is available',
      };
    }
  }

  /**
   * Send via API (Backend Integration)
   */
  async sendViaAPI(payload) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.warn('API call failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Store email in queue for later sending
   */
  storeEmailInQueue(emailPayload) {
    try {
      let queue = JSON.parse(localStorage.getItem('email-queue') || '[]');
      queue.push(emailPayload);
      localStorage.setItem('email-queue', JSON.stringify(queue));
    } catch (error) {
      console.warn('Could not store in queue:', error);
    }
  }

  /**
   * Process queued emails
   */
  async processEmailQueue() {
    try {
      let queue = JSON.parse(localStorage.getItem('email-queue') || '[]');

      for (let email of queue) {
        const response = await this.sendViaAPI(email);
        if (response.success) {
          queue = queue.filter((e) => e.timestamp !== email.timestamp);
        }
      }

      localStorage.setItem('email-queue', JSON.stringify(queue));
      return queue.length === 0;
    } catch (error) {
      console.error('Error processing queue:', error);
      return false;
    }
  }

  /**
   * Send Welcome Email
   */
  async sendWelcomeEmail(user) {
    return this.sendEmail(user.email, 'welcome', user);
  }

  /**
   * Send Password Reset Email
   */
  async sendPasswordResetEmail(email, resetToken) {
    return this.sendEmail(email, 'password-reset', {
      email,
      resetToken,
    });
  }

  /**
   * Send New Material Available Email
   */
  async sendMaterialAvailableEmail(user) {
    return this.sendEmail(user.email, 'material-available', user);
  }

  /**
   * Send Test Results Email
   */
  async sendTestResultsEmail(user, testResults) {
    return this.sendEmail(user.email, 'test-results', {
      ...user,
      ...testResults,
    });
  }

  /**
   * Send Newsletter Subscription Confirmation
   */
  async sendNewsletterConfirmation(email) {
    return this.sendEmail(email, 'newsletter', { email });
  }

  /**
   * Send Contact Form Reply
   */
  async sendContactReply(email) {
    return this.sendEmail(email, 'contact-reply', { email });
  }

  /**
   * Bulk send emails
   */
  async sendBulk(recipients, templateType, data) {
    const results = [];

    for (let email of recipients) {
      const result = await this.sendEmail(email, templateType, {
        ...data,
        email,
      });
      results.push({ email, ...result });
    }

    return results;
  }

  /**
   * Verify email deliverability (basic check)
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    try {
      const queue = JSON.parse(localStorage.getItem('email-queue') || '[]');
      return {
        pending: queue.length,
        emails: queue.map((e) => ({
          to: e.to,
          subject: e.subject,
          timestamp: e.timestamp,
        })),
      };
    } catch (error) {
      return { pending: 0, emails: [] };
    }
  }

  /**
   * Clear all queued emails (use with caution)
   */
  clearQueue() {
    localStorage.removeItem('email-queue');
    return true;
  }
}

// Initialize Mail Service
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mailService = new MailService();
    // Process queued emails on page load
    window.mailService.processEmailQueue();
  });
} else {
  window.mailService = new MailService();
  window.mailService.processEmailQueue();
}
