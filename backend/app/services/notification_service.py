from typing import Optional, List
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import get_settings

settings = get_settings()


class EmailService:
    
    @staticmethod
    def send_alert_email(recipient: str, alert_type: str, alert_details: dict) -> bool:
        """Send alert notification email"""
        
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            return False
        
        subject = f"AI Shield Alert: {alert_type}"
        
        body = f"""
        <h2>Security Alert</h2>
        <p><strong>Alert Type:</strong> {alert_type}</p>
        <p><strong>Severity:</strong> {alert_details.get('severity', 'Unknown')}</p>
        <p><strong>Time:</strong> {datetime.utcnow().isoformat()}</p>
        <p><strong>Details:</strong> {alert_details.get('description', '')}</p>
        
        <p><a href="https://aishield.io/dashboard">View in Dashboard</a></p>
        """
        
        return EmailService._send_email(recipient, subject, body)
    
    @staticmethod
    def send_compliance_summary(recipient: str, summary: dict) -> bool:
        """Send weekly compliance summary"""
        
        subject = "AI Shield - Weekly Compliance Summary"
        
        body = f"""
        <h2>Weekly Compliance Report</h2>
        <p><strong>Critical Issues:</strong> {summary.get('critical_count', 0)}</p>
        <p><strong>High Priority Issues:</strong> {summary.get('high_count', 0)}</p>
        <p><strong>Compliance Status:</strong> {summary.get('status', 'Unknown')}</p>
        
        <p>View full report: <a href="https://aishield.io/reports">Here</a></p>
        """
        
        return EmailService._send_email(recipient, subject, body)
    
    @staticmethod
    def _send_email(recipient: str, subject: str, body: str) -> bool:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SENDER_EMAIL
            msg['To'] = recipient
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'html'))
            
            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False


class SlackService:
    
    @staticmethod
    def send_alert(alert_type: str, severity: str, description: str) -> bool:
        """Send Slack notification for alerts"""
        
        if not settings.SLACK_WEBHOOK_URL:
            return False
        
        color = {
            'critical': '#FF0000',
            'high': '#FF9800',
            'medium': '#FFC107',
            'low': '#4CAF50',
        }.get(severity, '#CCCCCC')
        
        import requests
        
        payload = {
            "attachments": [
                {
                    "color": color,
                    "title": f"AI Shield Alert: {alert_type}",
                    "text": description,
                    "fields": [
                        {
                            "title": "Severity",
                            "value": severity.upper(),
                            "short": True
                        },
                        {
                            "title": "Time",
                            "value": datetime.utcnow().isoformat(),
                            "short": True
                        }
                    ],
                    "footer": "AI Shield Security Platform"
                }
            ]
        }
        
        try:
            requests.post(settings.SLACK_WEBHOOK_URL, json=payload)
            return True
        except Exception as e:
            print(f"Error sending Slack notification: {e}")
            return False
