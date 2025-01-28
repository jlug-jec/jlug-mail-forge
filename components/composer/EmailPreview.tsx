import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { ReactNode } from 'react'

interface EmailPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  from: string
  emails: string[]
  subject: string
  content: string
  title?: string
  children?: ReactNode
}

export function EmailPreview({
  open,
  onOpenChange,
  from,
  emails,
  subject,
  content,
  title = "Email Preview",
  children
}: EmailPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="overflow-hidden">
            <p className="text-sm text-gray-500">From</p>
            <p className="truncate">{from}</p>
          </div>
          
          {emails.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">To</p>
              <div className="flex flex-wrap gap-2">
                {emails.map((email, index) => (
                  <Badge key={index} variant="secondary" className="truncate max-w-full sm:max-w-[200px]">
                    {email}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium break-words">{subject}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Content</p>
            <div 
              className="prose max-w-none prose-sm sm:prose-base"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  )
}