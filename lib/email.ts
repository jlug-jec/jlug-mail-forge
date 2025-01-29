import nodemailer from 'nodemailer';

interface EmailDetails {
  to: string[];
  subject: string;
  html: string;
  from: string;
  provider?: 'gmail' | 'smtp2go';
}

async function sendWithGmail(emailDetails: EmailDetails) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: emailDetails.to.join(', '),
      subject: emailDetails.subject,
      html: emailDetails.html
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email with Gmail:', error);
    return { success: false, error };
  }
}

async function sendWithSmtp2go(emailDetails: EmailDetails) {
  const myHeaders = {
    "Content-Type": "application/json",
    "X-Smtp2go-Api-Key": process.env.SMTP2GO_API_KEY
  };

  console.log(emailDetails)

  const raw = JSON.stringify({
    "sender": process.env.SENDER_EMAIL,
    "to": emailDetails.to,
    "subject": emailDetails.subject,
    "html_body": emailDetails.html
  });

  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: myHeaders,
      body: raw
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }
    
    return { success: true, result };
  } catch (error) {
    console.error('Error sending email with SMTP2GO:', error);
    return { success: false, error };
  }
}

export async function sendEmail(emailDetails: EmailDetails) {
  const provider = emailDetails.provider || 'gmail';
  
  switch (provider) {
    case 'smtp2go':
      return sendWithSmtp2go(emailDetails);
    case 'gmail':
    default:
      return sendWithGmail(emailDetails);
  }
}