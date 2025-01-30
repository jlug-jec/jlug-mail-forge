// This opens in review dialog box

import {
  Button as EmailButton,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
  Row,
  Column,
  Body,
} from "@react-email/components"
import { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "@/components/ui/badge"
import { renderEmailContainer } from "../email/LiveEmailreview"




interface EmailPreviewProps {
  components?: any[]
  isInline?: boolean
  onChange?: (components: any[]) => void
  preview?: boolean
  open?: boolean
  content?:any
  onOpenChange?: (open: boolean) => void
  from?: string
  emails?: string[]
  subject?: string
  title?: string
  children?: ReactNode

}


export function EmailPreview({ 
  components = [], 
  isInline = true,
  preview = false,
  open,
  content,
  onOpenChange,
  from,
  emails = [],
  subject,
  title = "Email Preview",
  children
}: EmailPreviewProps) {
  if (preview) {
    return (
      <PreviewEmail
        open={open}
        onOpenChange={onOpenChange}
        from={from}
        emails={emails}
        subject={subject}
        title={title}
        content={content}
        children={children}
      />
    )
  }
  if (!components || components.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        Add components to preview your email
      </div>
    );
  }


  const emailContent = renderEmailContainer(components)


  if (isInline) {
   
    return (
      <div className="email-preview">
        {emailContent}
      </div>
    );
  }

  return (
    <Html>
      <Head />
      <Preview>Email Preview</Preview>
      <Body className="bg-white my-auto mx-auto font-sans">
        {emailContent}
      </Body>
    </Html>
  );
}

 function PreviewEmail({
  open,
  onOpenChange,
  from,
  emails,
  subject,
  content,
  title = "Email Preview",
  children
}: EmailPreviewProps) {
  const renderContent = () => {

    try {
      // Parse the content JSON string
      const parsedContent = JSON.parse(content);

      // Use renderEmailComponent to generate the React element
      return  renderEmailContainer(parsedContent)
    } catch (err) {
      console.error("Error rendering email content:", err);
      return <p>Error rendering content</p>;
    }
  };

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
          
          {emails && emails.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">To</p>
              <div className="flex flex-wrap gap-2">
                {emails.map((email, index) => (
                  <Badge key={index} className="truncate max-w-full sm:max-w-[200px]">
                     <span className="truncate">{email}</span>
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
            {/* Dynamically render the email content */}
            {renderContent()}
          </div>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}