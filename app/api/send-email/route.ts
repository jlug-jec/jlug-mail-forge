import { NextResponse } from 'next/server';

interface EmailDetails {
  to: string[];
  subject: string;
  html: string;
  from: string;
}

async function sendEmail(emailDetails: EmailDetails) {
  const headers = {
    "Content-Type": "application/json",
    "X-Smtp2go-Api-Key": process.env.SMTP2GO_API_KEY
  };

  const body = JSON.stringify({
    "sender": process.env.SENDER_EMAIL,
    "to": emailDetails.to,
    "subject": emailDetails.subject,
    "html_body": emailDetails.html
  });

  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers,
      body
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }
    
    return { success: true, result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sendEmail({
      to: body.to,
      subject: body.subject,
      html: body.content,
      from: body.from
    });

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}