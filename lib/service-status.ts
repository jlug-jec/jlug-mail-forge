import nodemailer from 'nodemailer';
import { sheets } from './google-sheets';


export async function checkServicesStatus() {
  const status = {
    smtp2go: false,
    sheets: false,
    emailProvider: '',
    lastSendAttempt: null,
    sendRate: '0/hour',
    queueStatus: 'Checking...',
    loading: true
  };

  // Check SMTP2GO
  try {
    const [statusResponse, activityResponse] = await Promise.all([
      fetch('https://api.smtp2go.com/v3/system/status', {
        headers: {
          'Authorization': `Bearer ${process.env.SMTP2GO_API_KEY || ''}`
        }
      }),
      fetch('https://api.smtp2go.com/v3/email_activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.SMTP2GO_API_KEY || ''
        },
        body: JSON.stringify({
          date_from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date_to: new Date().toISOString().split('T')[0],
          limit: 100
        })
      })
    ]);

    if (statusResponse.ok && activityResponse.ok) {
      const activity = await activityResponse.json();
      status.smtp2go = true;
      status.sendRate = `${activity.data.length} in 24h`;
      
      const failed = activity.data.filter(email => email.status !== 'completed').length;
      status.queueStatus = failed > 0 
        ? `${failed} failed in last 24h` 
        : 'All emails delivered';
    } else {
      console.error('SMTP2GO API returned non-OK status:', 
        statusResponse.status, activityResponse.status);
    }
  } catch (error) {
    console.error('SMTP2GO status check failed:', error);
  }

  // Check Google Sheets
  try {
    await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      ranges: [], // Empty range to just verify access
      includeGridData: false,
    });
    status.sheets = true;
  } catch (error) {
    console.error('Google Sheets status check failed:', error);
  }

  // Check email provider configuration
  if (process.env.SMTP2GO_API_KEY) {
    status.emailProvider = 'smtp2go';
  } else if (process.env.SENDER_EMAIL && process.env.SENDER_PASSWORD) {
    status.emailProvider = 'gmail';
    
    // Test Gmail connection
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_PASSWORD,
        },
      });
      await transporter.verify();
      status.smtp2go = true; // Using smtp2go field to indicate email service status
    } catch (error) {
      console.error('Gmail connection test failed:', error);
    }
  }

  status.loading = false;
  return status;
}