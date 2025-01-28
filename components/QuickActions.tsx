import { Plus} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers'
import { EmailProviderForm } from "./EmailProviderForm"
import Link from 'next/link'

export default async function QuickActions() {
  const cookieStore = await cookies()
  const provider = cookieStore.get('emailProvider')?.value || 'gmail'
  if(!provider) {
    return null
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EmailProviderForm defaultProvider={provider} />
          <Link href={'/receipients'} className="w-full justify-start" >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
          {/* <Button className="w-full justify-start" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Import Recipients
          </Button> */}
        </CardContent>
      </Card>
    </div>
  )
}

