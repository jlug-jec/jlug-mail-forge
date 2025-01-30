'use server'

import { getSheetDocuments } from '@/lib/google-sheets'
import { cookies } from 'next/headers'

export async function getSystemStatus() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('isAuthenticated')
  
  if (!isAuthenticated) {
    throw new Error('Unauthorized')
  }

  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const now = new Date().toISOString()

    const [emailCountResponse, cycleStatsResponse] = await Promise.all([
      fetch('https://api.smtp2go.com/v3/activity/search', {
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
      }),
      fetch('https://api.smtp2go.com/v3/stats/email_cycle', {
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
    ])

    const [emailData, cycleData] = await Promise.all([
      emailCountResponse.json(),
      cycleStatsResponse.json()
    ])

    return {
      emailService: true,
      emailsSent: cycleData.data?.cycle_used,
      emailsQuota: cycleData.data?.cycle_max,
      sheet: (await checkSheetsService()).status=="operational",
      lastUpdated: now,
      todayStats: {
        delivered: emailData.data?.total_events,
      }
    }

  } catch (error) {
    console.error('Status check failed:', error)
    return {
      emailService: false,
      totalRecipients: 0,
      emailsSent: 0,
      lastUpdated: new Date().toISOString(),
      todayStats: {
        delivered: 0,
        opened: 0,
        failed: 0
      }
    }
  }
}


async function checkSheetsService() {
  try {
    await getSheetDocuments(process.env.GOOGLE_SHEETS_ID!)
    return { status: 'operational' }
  } catch {
    return { status: 'error' }
  }
}