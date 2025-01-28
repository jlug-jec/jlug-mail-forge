"use client"
import { useState, useEffect } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRecipientStore } from '@/store/recipientStore'
import Link from "next/link"

interface WorksheetTableProps {
  initialSheets: any[]
  initialWorksheet?: string
}

export default function WorksheetTable({ initialSheets, initialWorksheet }: WorksheetTableProps) {
  const [currentSheet, setCurrentSheet] = useState(initialWorksheet || initialSheets[0]?.title)
  const [sheetData, setSheetData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" as "asc" | "desc" })
  const [filterField, setFilterField] = useState("")
  const [filterValue, setFilterValue] = useState("")
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchSheetData() {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:3002/api/sheets?worksheet=${currentSheet}`)
        const data = await response.json()
        setSheetData(data)
      } catch (error) {
        console.error('Error fetching sheet data:', error)
      }
      setLoading(false)
    }

    if (currentSheet) fetchSheetData()
  }, [currentSheet])

  const toggleCellExpansion = (key: string) => {
    const newSet = new Set(expandedCells)
    newSet.has(key) ? newSet.delete(key) : newSet.add(key)
    setExpandedCells(newSet)
  }

  const {selectedRecipients, setSelectedRecipients, setAvailableFields } = useRecipientStore()

  useEffect(() => {
    if (sheetData?.data) {
      setAvailableFields(Object.keys(sheetData.data[0] || {}))
    }
  }, [sheetData])

  const selectAllItems = () => {
    setSelectedItems([...filteredData])
    setSelectedDomain(null)
    setSelectedRecipients([...filteredData])
  }

  const clearSelections = () => {
    setSelectedItems([])
    setSelectedDomain(null)
    setSelectedRecipients([])
  }

  if (loading) return <div className="flex justify-center items-center min-h-[200px]">
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
</div>
  if (!sheetData?.data?.length) return <div className="p-4 text-center">No data available</div>

  const fields = Object.keys(sheetData.data[0] || {})
  const uniqueDomains = [...new Set(sheetData.data.map((item: any) => item.domain) || [])]
  const getUniqueValues = (field: string) => [...new Set(sheetData.data.map((item: any) => item[field]))]

  let filteredData = [...sheetData.data]
  if (filterField && filterValue) {
    filteredData = filteredData.filter(item => String(item[filterField]) === filterValue)
  }

  if (sortConfig.field) {
    filteredData.sort((a, b) => {
      const aValue = a[sortConfig.field]
      const bValue = b[sortConfig.field]
      return sortConfig.order === "asc" 
        ? aValue < bValue ? -1 : 1 
        : aValue > bValue ? -1 : 1
    })
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Update the toggleItem function
  const toggleItem = (item: any) => {
    setSelectedItems(prev => {
      const newItems = prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
      setSelectedRecipients(newItems) // Update global store
      return newItems
    })
  }

  // Update the toggleAll function
  const toggleAll = () => {
    setSelectedItems(prev => {
      const newItems = prev.length === paginatedData.length ? [] : [...paginatedData]
      setSelectedRecipients(newItems) // Update global store
      return newItems
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <CardTitle className="text-xl font-semibold truncate max-w-[300px]">
            {currentSheet || "Worksheet Data"}
          </CardTitle>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllItems}
                className={`w-full sm:w-auto ${
                  selectedRecipients.length > 0 ? 'bg-green-50 hover:bg-green-100' : ''
                }`}
              >
                Select All ({filteredData.length})
              </Button>
              {filterField && filterValue && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const filtered = filteredData
                    setSelectedItems(filtered)
                    setSelectedRecipients(filtered)
                  }}
                  className={`w-full sm:w-auto ${
                    selectedRecipients.length > 0 ? 'bg-green-50 hover:bg-green-100' : ''
                  }`}
                >
                  Select Filtered ({filteredData.length})
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  clearSelections()
                  setSelectedRecipients([])
                }}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>
            </div>
            
            <Select value={currentSheet} onValueChange={setCurrentSheet}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select worksheet" />
              </SelectTrigger>
              <SelectContent>
                {initialSheets.map((sheet) => (
                  <SelectItem key={sheet.id} value={sheet.title} className="bg-white data-[highlighted]:bg-slate-100">
                    <span className="truncate max-w-[180px]">{sheet.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 sm:flex-row">
          <div className="flex-1">
            <Select
              value={sortConfig.field}
              onValueChange={(value) => setSortConfig(prev => ({
                field: value,
                order: prev.field === value ? (prev.order === "asc" ? "desc" : "asc") : "asc"
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field} value={field} className=" bg-white data-[highlighted]:bg-slate-100">
                    <span className="truncate max-w-[180px] ">{field}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select
              value={filterField}
              onValueChange={(value) => {
                setFilterField(value)
                setFilterValue("")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem 
                    key={field} 
                    value={field} 
                    className="bg-white data-[highlighted]:bg-slate-100"
                  >
                    <span className="truncate max-w-[180px]">{field}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filterField && (
            <div className="flex-1">
              <Select
                value={filterValue}
                onValueChange={setFilterValue}
              >
                
                <SelectTrigger>
                  <SelectValue placeholder="Select value..." />
                </SelectTrigger>
                <SelectContent>
                  {getUniqueValues(filterField).map(value => (
                    <SelectItem key={String(value)} value={String(value)} className="bg-white data-[highlighted]:bg-slate-100">
                      <span className="truncate max-w-[180px]">{String(value)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-4">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <Table className="text-base min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                {fields.map(field => (
                  <TableHead 
                    key={field} 
                    className="uppercase font-semibold text-sm truncate max-w-[150px]"
                    title={field}
                  >
                    {field}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      backgroundColor: selectedDomain === item.domain ? "rgba(59, 130, 246, 0.1)" : "transparent"
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group transition-colors text-base"
                    layout
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item)}
                        onCheckedChange={() => toggleItem(item)}
                      />
                    </TableCell>

                    {fields.map(field => (
                      <TableCell key={field}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {typeof item[field] === "boolean" ? (
                            <Badge variant={item[field] ? "default" : "destructive"}>
                              {item[field].toString()}
                            </Badge>
                          ) : field === "domain" ? (
                            <Badge 
                              variant="outline" 
                              className={`truncate max-w-[120px] ${
                                selectedDomain === item[field] 
                                  ? "bg-blue-100 text-blue-800 border-blue-300" 
                                  : ""
                              }`}
                              title={item[field]}
                            >
                              {item[field]}
                            </Badge>
                          ) : (
                            <div
                              className={`${
                                typeof item[field] === 'string' && item[field].length > 30 
                                  ? 'cursor-pointer hover:bg-gray-50 rounded px-1' 
                                  : ''
                              } ${
                                expandedCells.has(`${index}-${field}`) 
                                  ? '' 
                                  : 'truncate max-w-[200px]'
                              }`}
                              onClick={() => {
                                if (typeof item[field] === 'string' && item[field].length > 30) {
                                  toggleCellExpansion(`${index}-${field}`)
                                }
                              }}
                              title={typeof item[field] === 'string' ? item[field] : undefined}
                            >
                              {typeof item[field] === 'string' && item[field].length > 30
                                ? expandedCells.has(`${index}-${field}`)
                                ? item[field]
                                : `${item[field].substring(0, 30)}...`
                              : item[field]}
                            </div>
                          )}
                        </motion.div>
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-2 sm:p-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">Show</span>
            <select 
              className="border rounded p-1 text-sm"
              value={itemsPerPage} 
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setPage(1)
              }}
            >
              {[10, 25, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-500 whitespace-nowrap">entries</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="flex-shrink-0"
            >
              Previous
            </Button>
            
            <div className="flex flex-wrap gap-1">
              {totalPages > 7 ? (
                <>
                  {[1, 2, 3].map(i => (
                    <Button
                      key={i}
                      variant={page === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i)}
                      className="w-8 sm:w-10"
                    >
                      {i}
                    </Button>
                  ))}
                  {page > 4 && <span className="px-2 self-center">...</span>}
                  {page > 3 && page < totalPages - 2 && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-8 sm:w-10"
                    >
                      {page}
                    </Button>
                  )}
                  {page < totalPages - 3 && <span className="px-2 self-center">...</span>}
                  {[totalPages - 2, totalPages - 1, totalPages].map(i => (
                    <Button
                      key={i}
                      variant={page === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i)}
                      className="w-8 sm:w-10"
                    >
                      {i}
                    </Button>
                  ))}
                </>
              ) : (
                Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                    className="w-8 sm:w-10"
                  >
                    {i + 1}
                  </Button>
                ))
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex-shrink-0"
            >
              Next
            </Button>
            <Link
              href="/compose"
              className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Draft Mail
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}