"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MailCheck, Users, Send, RefreshCw } from "lucide-react"

export default function SystemActions() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      toast.error("Failed to fetch status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 rounded-lg border bg-gray-50 animate-pulse" />
          ))
        ) : (
          <>
            <div className="p-4 rounded-lg border bg-white">
              <h3 className="text-sm font-medium text-gray-500">Email Service</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-semibold">
                  {status?.emailService ? "Active" : "Inactive"}
                </p>
                <MailCheck className={`w-5 h-5 ${status?.emailService ? "text-green-500" : "text-red-500"}`} />
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white">
              <h3 className="text-sm font-medium text-gray-500">Total Recipients</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-semibold">{status?.totalRecipients || 0}</p>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white">
              <h3 className="text-sm font-medium text-gray-500">Emails Sent</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-semibold">{status?.emailsSent || 0}</p>
                <Send className="w-5 h-5 text-purple-500" />
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-white">
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm">
                  {status?.lastUpdated 
                    ? new Date(status.lastUpdated).toLocaleString()
                    : "Never"
                  }
                </p>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={fetchStatus}
                  className="hover:text-blue-500"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}