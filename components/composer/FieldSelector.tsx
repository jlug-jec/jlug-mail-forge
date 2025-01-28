import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FieldSelectorProps {
  selectedField: string | null
  selectedRecipients: any[]
  availableFields: string[]
  onFieldSelect: (field: string) => void
}

export function FieldSelector({
  selectedField,
  selectedRecipients,
  availableFields,
  onFieldSelect,
}: FieldSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <span className="truncate max-w-[150px]">
            {selectedField || "Select Mail Field"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-white" align="start">
        {selectedRecipients.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 bg-slate-100">
            Please select recipients from the Recipients page first
          </div>
        ) : (
          <>
            <div className="p-2 border-b bg-white">
              <p className="text-sm font-medium text-gray-500 ">Available Fields</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 ">
              {availableFields.map((field) => (
                <Button
                  key={field}
                  variant="ghost"
                  size="sm"
                  className={`justify-start w-full text-left mb-1 ${
                    selectedField === field ? 'bg-blue-50' : 'bg-white'
                  }`}
                  onClick={() => onFieldSelect(field)}
                >
                  <span className="truncate" title={field}>
                    {field}
                  </span>
                </Button>
              ))}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}