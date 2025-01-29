// app/recipients/page.tsx
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SheetImport } from "@/components/table/SheetImport"
import WorksheetTable from "@/components/table/WorksheetTable"
import { cookies } from 'next/headers'


export default function RecipientsPage() {
  const cookieStore = cookies()
  const sheetId = cookieStore.get('sheetId')
  const selectedSheet = cookieStore.get('selectedSheet')
  const availableSheets = cookieStore.get('availableSheets')
  const hasRequiredCookies = !!sheetId && !!selectedSheet && !!availableSheets

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">
        {hasRequiredCookies ? 'Worksheet Data' : 'Import Worksheet'}
      </h2>
      
      <Suspense fallback={<LoadingSpinner />}>
        {hasRequiredCookies ? (
          <WorksheetTable 
            initialSheets={JSON.parse(availableSheets.value)}
            initialWorksheet={selectedSheet.value}
            sheetId={sheetId.value}
          />
        ) : (
          <SheetImport />
        )}
      </Suspense>
    </div>
  )
}