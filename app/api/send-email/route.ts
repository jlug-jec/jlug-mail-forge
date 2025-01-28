import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const provider = cookieStore.get('emailProvider')?.value || 'gmail';

    const result = await sendEmail({
      to: body.to,
      subject: body.subject,
      html: body.content,
      from: body.from,
      provider: provider as 'gmail' | 'smtp2go'
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