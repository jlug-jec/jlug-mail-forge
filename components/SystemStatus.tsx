"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface SystemStatusData {
  smtp2go: boolean
  sheets: boolean
  emailProvider: string
  sendRate: string
  queueStatus: string
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatusData>({
    smtp2go: false,
    sheets: false,
    emailProvider: '',
    sendRate: 'Loading...',
    queueStatus: 'Checking...'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/status')
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error('Error checking status:', error)
      }
      setLoading(false)
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Email Service</span>
            <Badge 
              variant="secondary" 
              className={status.smtp2go ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {status.smtp2go ? "Operational" : "Down"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Google Sheets</span>
            <Badge 
              variant="secondary" 
              className={status.sheets ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {status.sheets ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Email Provider</span>
            <span className="capitalize">{status.emailProvider || 'Not configured'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Send Rate</span>
            <span>{status.sendRate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Queue Status</span>
            <span>{status.queueStatus}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

