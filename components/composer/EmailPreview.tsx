
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"

// import { ReactNode } from 'react'

// interface EmailPreviewProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   from: string
//   emails: string[]
//   subject: string
//   content: string
//   title?: string
//   children?: ReactNode
// }

// export function EmailPreview({
//   open,
//   onOpenChange,
//   from,
//   emails,
//   subject,
//   content,
//   title = "Email Preview",
//   children
// }: EmailPreviewProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-3 sm:p-6">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>x
        
//         <div className="space-y-4">
//           <div className="overflow-hidden">
//             <p className="text-sm text-gray-500">From</p>
//             <p className="truncate">{from}</p>
//           </div>
          
//           {emails.length > 0 && (
//             <div>
//               <p className="text-sm text-gray-500">To</p>
//               <div className="flex flex-wrap gap-2">
//                 {emails.map((email, index) => (
//                   <Badge key={index} variant="secondary" className="truncate max-w-full sm:max-w-[200px]">
//                     {email}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           <div>
//             <p className="text-sm text-gray-500">Subject</p>
//             <p className="font-medium break-words">{subject}</p>
//           </div>
          
//           <div>
//             <p className="text-sm text-gray-500">Content</p>
//             <div 
//               className="prose max-w-none prose-sm sm:prose-base"
//               dangerouslySetInnerHTML={{ __html: content }}
//             />
//           </div>
//         </div>
//         {children}
//       </DialogContent>
//     </Dialog>
//   )
// }
import {
  Button as EmailButton,
  Container,
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
import { renderEmailContainer } from "../email/emailPreview"




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

function renderEmailComponent(component: any) {
  switch (component.type) {
    case "button":
      return (
        <Section key={component.id} style={{ textAlign: component.props.style?.textAlign }}>
          <EmailButton
            href={component.props.href || "#"}
            style={{
              ...component.props.style,
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: "6px",
            }}
          >
            {component.content}
          </EmailButton>
        </Section>
      )
    case "text":
      return (
        <Text
          key={component.id}
          style={{
            ...component.props.style,
            margin: "10px 0",
          }}
        >
          {component.content}
        </Text>
      )
    case "image":
      return (
        <Section key={component.id} style={{ textAlign: component.props.style?.textAlign }}>
          <div style={{ textAlign: component.props.style?.textAlign || 'left' }}>
            <Img 
              src={component.content} 
              alt={component.props.alt || ""} 
              width={component.props.style?.width?.replace('px', '') || "100%"} 
              height={component.props.style?.height?.replace('px', '')}
              style={{ 
                maxWidth: "100%",
                width: component.props.style?.width || 'auto',
                height: component.props.style?.height || 'auto',
                display: 'inline-block'
              }} 
            />
          </div>
        </Section>
      )
    case "divider":
      return (
        <Section key={component.id} style={{ textAlign: component.props.style?.textAlign }}>
          {component.content && <Text style={{ color: component.props.style?.borderColor }}>{component.content}</Text>}
          <Hr
            style={{
              borderColor: component.props.style?.borderColor || "#000000",
              margin: "10px 0",
            }}
          />
        </Section>
      )
    case "container":
      return (
        <Section
          key={component.id}
          style={{
            backgroundColor: component.props.style?.backgroundColor || 'transparent',
            padding: "20px",
            margin: "10px 0",
            borderRadius: "4px",
          }}
        >
          <Text style={{
            ...component.props.style,
            color: component.props.style?.color || '#000000',
            textAlign: component.props.style?.textAlign || 'left',
            margin: 0,
          }}>
            {component.content}
          </Text>
        </Section>
      )
    case "header":
      if (component.props.logo) {
        return (
          <Section
            key={component.id}
            style={{
              ...component.props.style,
              margin: "0 0 24px",
              textAlign: "center",
            }}
          >
            <Img src={component.props.logo} alt="Logo" width="120" height="40" style={{ marginBottom: "16px" }} />
            <Text style={{ fontSize: "24px", margin: 0 }}>{component.content}</Text>
          </Section>
        )
      }
      return (
        <Section
          key={component.id}
          style={{
            ...component.props.style,
            margin: "0 0 24px",
          }}
        >
          <Text>{component.content}</Text>
        </Section>
      )
    case "footer":
      if (component.props.type === "social") {
        return (
          <Section
            key={component.id}
            style={{
              ...component.props.style,
              textAlign: "center",
            }}
          >
            <Row style={{ marginBottom: "16px" }}>
              <Column align="center">
                {component.props.twitter && (
                  <Link
                    href={component.props.twitter}
                    style={{ color: "#000000", textDecoration: "none", margin: "0 8px" }}
                  >
                    Twitter
                  </Link>
                )}
                {component.props.linkedin && (
                  <Link
                    href={component.props.linkedin}
                    style={{ color: "#000000", textDecoration: "none", margin: "0 8px" }}
                  >
                    LinkedIn
                  </Link>
                )}
                {component.props.github && (
                  <Link
                    href={component.props.github}
                    style={{ color: "#000000", textDecoration: "none", margin: "0 8px" }}
                  >
                    GitHub
                  </Link>
                )}
              </Column>
            </Row>
            <Text style={{ margin: 0, color: "#666666" }}>{component.content}</Text>
          </Section>
        )
      }
      return (
        <Section
          key={component.id}
          style={{
            ...component.props.style,
            margin: "24px 0 0",
          }}
        >
          <Text>{component.content}</Text>
        </Section>
      )
    case "headerBanner":
      return (
        <Section key={component.id} style={{ margin: "0 0 24px", textAlign: component.props.style?.textAlign }}>
          <div style={{ textAlign: component.props.style?.textAlign || 'left' }}>
            <Img 
              src={component.content} 
              alt={component.props.alt || ""} 
              width={component.props.style?.width?.replace('px', '') || "100%"} 
              height={component.props.style?.height?.replace('px', '')}
              style={{ 
                maxWidth: "100%",
                width: component.props.style?.width || 'auto',
                height: component.props.style?.height || 'auto',
                display: 'inline-block'
              }} 
            />
          </div>
        </Section>
      )
    case "link":
      return (
        <Link key={component.id} href={component.props.href || "#"} style={{ color: "#067df7" }}>
          {component.content}
        </Link>
      )
    default:
      return null
  }
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