"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useRecipientStore } from '@/store/recipientStore'
import { TableHeader } from "./TableHeader"
import { TableFilters } from "./TableFilters"
import { DataTable } from "./DataTable"
import { TablePagination } from "./TablePagination"
import { LoadingSpinner } from "@/components/ui/loading-spinner"


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
  const { selectedRecipients, setSelectedRecipients, setAvailableFields } = useRecipientStore()

  const { fields, filteredData, paginatedData, totalPages } = useMemo(() => {
    if (!sheetData?.data?.length) {
      return { fields: [], filteredData: [], paginatedData: [], totalPages: 0 }
    }

    const fields = Object.keys(sheetData.data[0] || {})
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

    return { fields, filteredData, paginatedData, totalPages }
  }, [sheetData, filterField, filterValue, sortConfig, page, itemsPerPage])

  // Effects and other hooks
  useEffect(() => {
    async function fetchSheetData() {
      setLoading(true)
      try {
        const response = await fetch(`/api/sheets?worksheet=${currentSheet}`)
        const data = await response.json()
        setSheetData(data)
      } catch (error) {
        console.error('Error fetching sheet data:', error)
      }
      setLoading(false)
    }

    if (currentSheet) fetchSheetData()
  }, [currentSheet])

  useEffect(() => {
    if (sheetData?.data) {
      setAvailableFields(Object.keys(sheetData.data[0] || {}))
    }
  }, [sheetData, setAvailableFields])

  // Toggle functions
  const toggleItem = (item: any) => {
    setSelectedItems(prev => {
      const newItems = prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
      setSelectedRecipients(newItems)
      return newItems
    })
  }

  const toggleAll = useMemo(() => {
    return () => {
      const allSelected = paginatedData.every(item => 
        selectedItems.some(selected => JSON.stringify(selected) === JSON.stringify(item))
      );
      
      const newItems = allSelected ? [] : [...paginatedData];
      setSelectedItems(newItems);
      setSelectedRecipients(newItems);
    };
  }, [paginatedData, selectedItems, setSelectedRecipients]);

  if (loading) return <LoadingSpinner />
  if (!sheetData?.data?.length) return <div className="p-4 text-center">No data available</div>

  return (
    <Card className="relative bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      <div className="relative z-10">
        <CardHeader>
          <TableHeader
            currentSheet={currentSheet}
            initialSheets={initialSheets}
            filteredData={filteredData}
            selectedRecipients={selectedRecipients}
            filterField={filterField}
            filterValue={filterValue}
            setCurrentSheet={setCurrentSheet}
            selectAllItems={() => {
              setSelectedItems(filteredData)
              setSelectedRecipients(filteredData)
            }}
            clearSelections={() => {
              setSelectedItems([])
              setSelectedRecipients([])
              setSelectedDomain(null)
            }}
            setSelectedItems={setSelectedItems}
            setSelectedRecipients={setSelectedRecipients}
            setSelectedDomain={setSelectedDomain}
          />
          <TableFilters
            fields={fields}
            sortConfig={sortConfig}
            filterField={filterField}
            filterValue={filterValue}
            setSortConfig={setSortConfig}
            setFilterField={setFilterField}
            setFilterValue={setFilterValue}
            getUniqueValues={(field) => [...new Set(sheetData.data.map((item: any) => item[field]))]}
          />
        </CardHeader>

        <CardContent className="px-2 sm:px-4">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <DataTable
              fields={fields}
              paginatedData={paginatedData}
              selectedItems={selectedItems}
              selectedDomain={selectedDomain}
              expandedCells={expandedCells}
              toggleAll={toggleAll}
              toggleItem={toggleItem}
              toggleCellExpansion={(key) => {
                const newSet = new Set(expandedCells)
                newSet.has(key) ? newSet.delete(key) : newSet.add(key)
                setExpandedCells(newSet)
              }}
            />
          </div>

          <TablePagination
            page={page}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
            setItemsPerPage={setItemsPerPage}
          />
        </CardContent>
      </div>
    </Card>
  )
}