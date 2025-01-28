import { Suspense } from "react"
import RecentCampaigns from "@/components/RecentCampaigns"
import QuickActions from "@/components/QuickActions"
import SystemStatus from "@/components/SystemStatus"
import { Skeleton } from "@/components/ui/skeleton"

export default async function  DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recent Mail Campaigns</h1>
      </div>
      <Suspense fallback={<Skeleton className="h-[200px]" />}>
        <RecentCampaigns />
      </Suspense>

      <div className="grid md:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <QuickActions />
        </Suspense>
        {/* <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <SystemStatus />
        </Suspense> */}
      </div>
    </div>
  )
}

