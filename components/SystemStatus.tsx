"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getSystemStatus } from '@/app/actions/status'

interface SystemStatusData {
  smtp2go: boolean
  sheets: boolean
  emailProvider: string
  dailyEmailsSent: number
  dailyEmailsRemaining: number
  cycleStats: {
    used: number
    max: number
  }
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatusData>({
    smtp2go: false,
    sheets: false,
    emailProvider: '',
    dailyEmailsSent: 0,
    dailyEmailsRemaining: 200,
    cycleStats: {
      used: 0,
      max: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true)
        const data = await getSystemStatus()
        
        setStatus({
          smtp2go: data.emailService,
          sheets: data.sheet,
          emailProvider: 'SMTP2GO',
          dailyEmailsSent: data.todayStats.delivered,
          dailyEmailsRemaining: 200 - data.todayStats.delivered,
          cycleStats: {
            used: data.emailsSent,
            max: 1000
          }
        })
      } catch (error) {
        console.error('Failed to fetch status:', error)
        setStatus(prev => ({ ...prev, smtp2go: false, sheets: false }))
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Existing status items */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Daily Emails</span>
                <div className="text-right">
                  <span className="font-medium">{status.dailyEmailsSent}/200</span>
                  <div className="text-xs text-gray-500">
                    {200 - status.dailyEmailsSent} remaining today
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Monthly Cycle</span>
                <div className="text-right">
                  <span className="font-medium">
                    {status.cycleStats.used}/{status.cycleStats.max}
                  </span>
                  <div className="text-xs text-gray-500">
                  {status.cycleStats.max-status.cycleStats.used} emails remaining this month
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Email Service</span>
                <span className={`px-2 py-1 rounded-full text-xs ${status.smtp2go ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {status.smtp2go ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Google Sheets</span>
                <span className={`px-2 py-1 rounded-full text-xs ${status.sheets ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {status.sheets ? "Connected" : "Disconnected"}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

