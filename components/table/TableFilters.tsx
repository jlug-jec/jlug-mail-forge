import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface TableFiltersProps {
  fields: string[]
  sortConfig: { field: string; order: "asc" | "desc" }
  filterField: string
  filterValue: string
  setSortConfig: (config: { field: string; order: "asc" | "desc" }) => void
  setFilterField: (field: string) => void
  setFilterValue: (value: string) => void
  getUniqueValues: (field: string) => any[]
}

export function TableFilters({
  fields,
  sortConfig,
  filterField,
  filterValue,
  setSortConfig,
  setFilterField,
  setFilterValue,
  getUniqueValues
}: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-2 mt-4 sm:flex-row">
      <div className="flex-1">
        <Select
          value={sortConfig.field}
          onValueChange={(value) => {
            const order: "asc" | "desc" = sortConfig.field === value 
              ? (sortConfig.order === "asc" ? "desc" : "asc")
              : "asc";
            setSortConfig({ field: value, order });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {fields.map(field => (
              <SelectItem key={field} value={field} className="bg-white data-[highlighted]:bg-slate-100">
                <span className="truncate max-w-[180px]">{field}</span>
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
              <SelectItem key={field} value={field} className="bg-white data-[highlighted]:bg-slate-100">
                <span className="truncate max-w-[180px]">{field}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filterField && (
        <div className="flex-1">
          <Select value={filterValue} onValueChange={setFilterValue}>
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
  )
}