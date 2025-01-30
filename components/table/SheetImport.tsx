"use client"

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useSheetStore } from "@/store/sheet-store"
import { useRouter } from 'next/navigation'
import { getSheets } from '@/app/actions/sheets'

export function SheetImport() {
  const router = useRouter()
  const { setSheetId, setSelectedSheet, setAvailableSheets } = useSheetStore()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [tempSheetId, setTempSheetId] = useState<string | null>(null)
  const [worksheets, setWorksheets] = useState<{ title: string, index: number }[]>([])

  const handleImport = async () => {
    if (!url) {
      toast.error('Please enter a Google Sheets URL')
      return
    }

    setLoading(true)
    try {
      const id = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1]
      if (!id) {
        throw new Error('Invalid Google Sheets URL')
      }

      const sheets = await getSheets(id)
      
      setTempSheetId(id)
      setWorksheets(sheets)
      setAvailableSheets(sheets)
      toast.success('Sheet found! Please select a worksheet')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import sheet')
    } finally {
      setLoading(false)
    }
  }

  const handleWorksheetSelect = (worksheet: string) => {
    
    if (tempSheetId) {
      setSheetId(tempSheetId)
      setSelectedSheet(worksheet)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 max-w-2xl mx-auto">
        {!tempSheetId ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Import Google Sheet</h2>
              <p className="text-sm text-gray-500">
                Enter the URL of your Google Sheet to import data
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleImport}
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? <LoadingSpinner /> : 'Import'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2 bg-white">Select Worksheet</h2>
              <p className="text-sm text-gray-500">
                Choose the worksheet you want to import
              </p>
            </div>

            <Select onValueChange={handleWorksheetSelect}>
              <SelectTrigger className="w-full bg-white border">
                <SelectValue placeholder="Select a worksheet" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {worksheets.map((sheet) => (
                  <SelectItem 
                    key={sheet.index} 
                    value={sheet.title}
                    className="cursor-pointer"
                  >
                    {sheet.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setTempSheetId(null)
                  setWorksheets([])
                }}
              >
                Change Sheet
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (tempSheetId) {
                    setSheetId(tempSheetId)
                    setSelectedSheet(worksheets[0]?.title || '')
                    router.push('/receipients')
                  }
                }}
              >
                Add Worksheet
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}