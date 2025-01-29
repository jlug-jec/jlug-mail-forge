"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"



const ITEMS_PER_PAGE = 5

export default function RecentCampaigns() {
  interface Campaign {
    subject: string;
    from: string;
    to: string;
    sentDate: string;
  }
  
  // Update the state type
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  })

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          startDate: dateRange.from?.toISOString() || '',
          endDate: dateRange.to?.toISOString() || ''
        })
        const response = await fetch(`/api/campaigns?${params}`)
        if (!response.ok) throw new Error('Failed to fetch campaigns')
        const data = await response.json()
        setCampaigns(data)
        setError(null)
      } catch (err) {
        setError('Failed to load campaigns')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [dateRange])

  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCampaigns = useMemo(() => 
    campaigns.slice(startIndex, endIndex),
    [campaigns, startIndex, endIndex]
  )

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="rounded-lg border bg-white overflow-x-auto"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Subject</TableHead>
            <TableHead className="whitespace-nowrap">From</TableHead>
            <TableHead className="whitespace-nowrap">To</TableHead>
            <TableHead className="whitespace-nowrap">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="relative" style={{ minHeight: `${ITEMS_PER_PAGE * 53}px` }}>
          <AnimatePresence mode="wait">
            {paginatedCampaigns.map((campaign, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border-b"
              >
                <TableCell className="font-medium min-w-[180px]">{campaign.subject}</TableCell>
                <TableCell className="min-w-[200px]">{campaign.from}</TableCell>
                <TableCell className="min-w-[200px]">{campaign.to}</TableCell>
                <TableCell className="min-w-[150px]">
                  {new Date(campaign.sentDate).toLocaleString()}
                </TableCell>
              </motion.tr>
            ))}
            {Array.from({ length: ITEMS_PER_PAGE - paginatedCampaigns.length }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-[53px]" />
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
      
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          {campaigns.length === 0 
            ? "No campaigns found"
            : `Showing ${((currentPage - 1) * ITEMS_PER_PAGE) + 1} to ${Math.min(currentPage * ITEMS_PER_PAGE, campaigns.length)} of ${campaigns.length}`
          }
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0 transition-all duration-200 shrink-0"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

