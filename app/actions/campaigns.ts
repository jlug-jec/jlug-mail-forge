'use server'

import { cookies } from 'next/headers'

export async function fetchCampaigns(startDate?: string, endDate?: string) {
  // Check authentication
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('isAuthenticated')
  
  if (!isAuthenticated) {
    throw new Error('Unauthorized')
  }

  const defaultStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const defaultEndDate = new Date().toISOString()

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
        start_date: startDate || defaultStartDate,
        end_date: endDate || defaultEndDate,
        limit: 100 
      })
    })

    const data = await response.json()
    
    return data.data.events.map((event: any) => ({
      subject: event.subject || 'No Subject',
      from: event.from,
      to: event.to,
      sentDate: event.date,
      event: event.event
    }))
  } catch (error) {
    throw new Error('Failed to fetch campaigns')
  }
}