import { CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useSheetStore } from "@/store/sheet-store"

interface TableHeaderProps {
  currentSheet: string
  initialSheets: any[]
  filteredData: any[]
  selectedRecipients: any[]
  filterField: string
  filterValue: string
  setCurrentSheet: (sheet: string) => void
  selectAllItems: () => void
  clearSelections: () => void
  setSelectedItems: (items: any[]) => void
  setSelectedRecipients: (items: any[]) => void
  setSelectedDomain: (domain: string | null) => void
}

export function TableHeader({
  currentSheet,
  initialSheets,
  filteredData,
  selectedRecipients,
  filterField,
  filterValue,
  setCurrentSheet,
  selectAllItems,
  clearSelections,
  setSelectedItems,
  setSelectedRecipients,
  setSelectedDomain
}: TableHeaderProps) {
  const { setSheetId, setSelectedSheet, setAvailableSheets } = useSheetStore()

  const handleImportNewSheet = () => {
    setSheetId(null)
    setSelectedSheet(null)
    setAvailableSheets([])
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      <CardTitle className="text-xl font-semibold truncate max-w-[300px]">
        {currentSheet || "Worksheet Data"}
      </CardTitle>
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleImportNewSheet}
            className="w-full sm:w-auto"
          >
            Import Another Sheet
          </Button>
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
                setSelectedItems(filteredData)
                setSelectedRecipients(filteredData)
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
            onClick={clearSelections}
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
              <SelectItem 
                key={sheet.id}
                value={sheet.title}
                className="bg-white data-[highlighted]:bg-slate-100"
              >
                <span className="truncate max-w-[180px]">{sheet.title}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}