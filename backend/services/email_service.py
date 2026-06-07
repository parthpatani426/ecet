"""
Email service for ECETX
Gmail/Google Mail only (SMTP via smtp.gmail.com).
"""

import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from config import settings


class EmailService:
    """Email service (Gmail/Google Mail only via SMTP)."""

    def __init__(self):
        self._validate_smtp_config()

    def _validate_smtp_config(self) -> None:
        allowed_smtp_hosts = {"smtp.gmail.com", "smtp.googlemail.com"}
        smtp_host = (settings.SMTP_SERVER or "").strip().lower()

        if smtp_host not in allowed_smtp_hosts:
            raise RuntimeError(
                "❌ Email sending is restricted to Gmail/Google Mail only. "
                f"Configured SMTP_SERVER='{settings.SMTP_SERVER}' is not allowed."
            )

        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            raise RuntimeError(
                "❌ SMTP credentials are not configured. Set SMTP_USER and SMTP_PASSWORD."
            )

    @staticmethod
    def _is_allowed_recipient(recipient_email: str) -> bool:
        email = (recipient_email or "").strip().lower()
        return email.endswith("@gmail.com") or email.endswith("@googlemail.com")

    def _assert_allowed_recipient(self, recipient_email: str) -> None:
        if not self._is_allowed_recipient(recipient_email):
            raise ValueError(
                "❌ Only Gmail/Google Mail addresses are allowed to receive ECETX emails."
            )

    async def send_verification_email(self, email: str, name: str, otp_code: str):
        """Send email verification OTP"""
        
        subject = "🎓 Verify Your ECETX Email"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto;">
                    <h1 style="color: #6366f1; text-align: center;">Welcome to ECETX! 🎓</h1>
                    
                    <p>Hi <strong>{name}</strong>,</p>
                    
                    <p>Thank you for registering with ECETX. To complete your registration and verify your email address, please use the following verification code:</p>
                    
                    <div style="background-color: #f0f0f0; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <h2 style="text-align: center; color: #333; margin: 0; letter-spacing: 2px;">{otp_code}</h2>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
                    
                    <p>If you didn't register for ECETX, you can safely ignore this email.</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2024 ECETX. All rights reserved.<br>
                        Premium Learning Platform for AP ECET Students
                    </p>
                </div>
            </body>
        </html>
        """
        
        await self._send_email(email, subject, html_body)
    
    async def send_password_reset_email(self, email: str, name: str, otp_code: str):
        """Send password reset OTP"""
        
        subject = "🔐 Reset Your ECETX Password"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto;">
                    <h1 style="color: #ef4444; text-align: center;">Password Reset 🔐</h1>
                    
                    <p>Hi <strong>{name}</strong>,</p>
                    
                    <p>We received a request to reset your password. Use the code below to create a new password:</p>
                    
                    <div style="background-color: #f0f0f0; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <h2 style="text-align: center; color: #333; margin: 0; letter-spacing: 2px;">{otp_code}</h2>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
                    
                    <p style="color: #ef4444; font-weight: bold;">If you didn't request a password reset, please ignore this email and your account remains secure.</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2024 ECETX. All rights reserved.<br>
                        Premium Learning Platform for AP ECET Students
                    </p>
                </div>
            </body>
        </html>
        """
        
        await self._send_email(email, subject, html_body)
    
    async def send_password_reset_confirmation(self, email: str, name: str):
        """Send password reset confirmation"""
        
        subject = "✅ Your Password Has Been Reset"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto;">
                    <h1 style="color: #10b981; text-align: center;">Password Reset Successful ✅</h1>
                    
                    <p>Hi <strong>{name}</strong>,</p>
                    
                    <p>Your password has been successfully reset. You can now login to your ECETX account with your new password.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://ecetx.com/login" style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                            Go to Login
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">If you didn't reset your password, please contact our support team immediately.</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2024 ECETX. All rights reserved.<br>
                        Premium Learning Platform for AP ECET Students
                    </p>
                </div>
            </body>
        </html>
        """
        
        await self._send_email(email, subject, html_body)
    
    async def send_welcome_email(self, email: str, name: str, branch: str):
        """Send welcome email after successful registration"""
        
        subject = "🎉 Welcome to ECETX!"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto;">
                    <h1 style="color: #6366f1; text-align: center;">Welcome to ECETX! 🎉</h1>
                    
                    <p>Hi <strong>{name}</strong>,</p>
                    
                    <p>Your email has been verified and your account is now active!</p>
                    
                    <p>You're now enrolled in the <strong>{branch}</strong> program with access to:</p>
                    
                    <ul style="color: #666;">
                        <li>📚 Comprehensive courses and study materials</li>
                        <li>✏️ Unlimited practice problems</li>
                        <li>📝 Full-length mock tests</li>
                        <li>🤖 AI-powered tutor (24/7 support)</li>
                        <li>📊 Detailed performance analytics</li>
                        <li>🏆 Gamification and leaderboards</li>
                    </ul>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://ecetx.com/dashboard" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                            Start Learning Now
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2024 ECETX. All rights reserved.<br>
                        Premium Learning Platform for AP ECET Students
                    </p>
                </div>
            </body>
        </html>
        """
        
        await self._send_email(email, subject, html_body)
    
    async def _send_email(self, to_email: str, subject: str, html_body: str):
        """Internal method to send email (SMTP via Gmail/Google Mail)."""
        self._assert_allowed_recipient(to_email)
        await self._send_via_smtp(to_email, subject, html_body)
    
    async def _send_via_smtp(self, to_email: str, subject: str, html_body: str):
        """Send email via SMTP"""
        
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = settings.FROM_EMAIL
        message["To"] = to_email
        
        message.attach(MIMEText(html_body, "html"))
        
        try:
            async with aiosmtplib.SMTP(
                hostname=settings.SMTP_SERVER,
                port=settings.SMTP_PORT
            ) as smtp:
                await smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                await smtp.send_message(message)
                print(f"✅ Email sent via SMTP to {to_email}")
        except Exception as e:
            print(f"❌ SMTP error: {e}")
            raise
