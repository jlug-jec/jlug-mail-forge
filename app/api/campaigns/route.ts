import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('startDate') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Default 7 days ago
  const endDate = searchParams.get('endDate') || new Date().toISOString()

  try {
    const response = await fetch('https://api.smtp2go.com/v3/activity/search', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY!
      },
      body: JSON.stringify({
        include_headers: false,
        start_date: startDate,
        end_date: endDate,
        limit: 100
      })
    })

    const data = await response.json()
    
    const campaigns = data.data.events.map((event: any) => ({
      subject: event.subject || 'No Subject',
      from: event.from,
      to: event.to,
      sentDate: event.date,
      event: event.event
    }))

    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}