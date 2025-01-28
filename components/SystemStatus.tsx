"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SystemStatus() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">API Status</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Operational
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Send Rate</span>
            <span>2.3k/hour</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Queue Status</span>
            <span>No pending emails</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

