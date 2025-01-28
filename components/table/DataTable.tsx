import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface DataTableProps {
  fields: string[]
  paginatedData: any[]
  selectedItems: any[]
  selectedDomain: string | null
  expandedCells: Set<string>
  toggleAll: () => void
  toggleItem: (item: any) => void
  toggleCellExpansion: (key: string) => void
}

export function DataTable({
  fields,
  paginatedData,
  selectedItems,
  selectedDomain,
  expandedCells,
  toggleAll,
  toggleItem,
  toggleCellExpansion
}: DataTableProps) {
  return (
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
          {paginatedData.map((item, index) => {
            const { initial, animate, exit, transition, className } = renderTableRow(
              item, 
              index, 
              selectedDomain, 
              selectedItems, 
              fields, 
              expandedCells, 
              toggleItem, 
              toggleCellExpansion
            )
            return (
              <motion.tr
                key={index}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={transition}
                className={className}
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
                    {renderTableCell(item, field, index, expandedCells, toggleCellExpansion)}
                  </TableCell>
                ))}
              </motion.tr>
            )
          })}
        </AnimatePresence>
      </TableBody>
    </Table>
  )
}

function renderTableRow(item: any, index: number, selectedDomain: string | null, selectedItems: any[], fields: string[], expandedCells: Set<string>, toggleItem: (item: any) => void, toggleCellExpansion: (key: string) => void) {
  return (
    <motion.tr
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
          {renderTableCell(item, field, index, expandedCells, toggleCellExpansion)}
        </TableCell>
      ))}
    </motion.tr>
  )
}

function renderTableCell(item: any, field: string, index: number, expandedCells: Set<string>, toggleCellExpansion: (key: string) => void) {
  return (
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
        <Badge variant="outline" className="truncate max-w-[120px]" title={item[field]}>
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
  )
}