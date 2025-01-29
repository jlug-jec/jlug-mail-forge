import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { EmailPreview } from "./EmailPreview"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  from: string
  emails: string[]
  subject: string
  content: string
  isSending: boolean
  onSend: () => void
}

export function ReviewDialog({
  open,
  onOpenChange,
  from,
  emails,
  subject,
  content,
  isSending,
  onSend
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle>Review & Send Email</DialogTitle>
        </DialogHeader>
        
        <EmailPreview
          preview={true}
          open={open}
          onOpenChange={onOpenChange}
          from={from}
          emails={emails}
          subject={subject}
          content={content}
        >
          <div className="sticky bottom-0 left-0 right-0 flex justify-end gap-2 pt-4 mt-4  bg-white">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={onSend}
            disabled={isSending}
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
        </EmailPreview>
        
    
      </DialogContent>
    </Dialog>
  )
}