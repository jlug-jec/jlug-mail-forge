// app/recipients/page.tsx
import { Suspense } from "react"
import WorksheetTable from "@/components/table/WorksheetTable"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

async function getSheets(worksheetName?: string) {
  try {
    let res
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
    
    if (worksheetName) {
      res = await fetch(`${baseUrl}/api/sheets?worksheet=${worksheetName}`, {
        next: { revalidate: 60 } 
      });
    } else {
      res = await fetch(`${baseUrl}/api/sheets`, {
        next: { revalidate: 60 } 
      });
    }
  
    if (!res.ok) throw new Error('Failed to fetch sheets');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching sheets:', error);
    return { sheets: [] };
  }
}

export default async function RecipientsPage() {
  const { sheets } = await getSheets();
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Worksheets</h2>
      
      <Suspense fallback={<LoadingSpinner />}>
        <WorksheetTable 
          initialSheets={sheets} 
          initialWorksheet={sheets[0]?.title}
        />
      </Suspense>
    </div>
  );
}