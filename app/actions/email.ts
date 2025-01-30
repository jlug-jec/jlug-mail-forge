'use server'

import { cookies } from 'next/headers'

export async function sendEmail(data: {
  subject: string
  content: string
  from: string
  to: string[]
  provider: string
}) {
  const cookieStore = await cookies()
  const isAuthenticated = await cookieStore.get('isAuthenticated')
  if (!isAuthenticated) throw new Error('Unauthorized')

  try {
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY!
      },
      body: JSON.stringify({
        sender: data.from || process.env.SENDER_EMAIL,
        to: data.to,
        subject: data.subject,
        html_body: data.content
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    const result = await response.json()
    return { success: true, result }
  } catch (error: any) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}