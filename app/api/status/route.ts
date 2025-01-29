import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const now = new Date().toISOString()

    const emailCountResponse = await fetch('https://api.smtp2go.com/v3/activity/search', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY!
      },
      body: JSON.stringify({
        start_date: startOfDay,
        end_date: now
      })
    })

    const cycleStatsResponse = await fetch('https://api.smtp2go.com/v3/stats/email_cycle', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY!
      },
      body: JSON.stringify({
        start_date: startOfDay,
        end_date: now
      })
    })

    const emailData = await emailCountResponse.json()
    const cycleData = await cycleStatsResponse.json()

    return NextResponse.json({
      emailService: true,
      emailsSent: cycleData.data?.cycle_used,
      emailsQuota: cycleData.data?.cycle_max,
      lastUpdated: now,
      todayStats: {
        delivered: emailData.data?.total_events,
      }
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({
      emailService: false,
      totalRecipients: 0,
      emailsSent: 0,
      lastUpdated: new Date().toISOString(),
      todayStats: {
        delivered: 0,
        opened: 0,
        failed: 0
      }
    }, { status: 500 })
  }
}