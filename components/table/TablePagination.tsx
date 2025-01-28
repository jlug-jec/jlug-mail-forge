import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TablePaginationProps {
  page: number
  totalPages: number
  itemsPerPage: number
  setPage: (page: number) => void
  setItemsPerPage: (size: number) => void
}

export function TablePagination({
  page,
  totalPages,
  itemsPerPage,
  setPage,
  setItemsPerPage
}: TablePaginationProps) {
  return (
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
        
        <PaginationNumbers page={page} totalPages={totalPages} setPage={setPage} />
        
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
  )
}

function PaginationNumbers({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (page: number) => void }) {
  return (
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
            <Button variant="default" size="sm" className="w-8 sm:w-10">
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
  )
}