"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useRecipientStore } from '@/store/recipientStore'
import { EmailForm } from "./EmailForm"
import { ActionButtons } from "./ActionButtons"
import { EmailPreview } from "./EmailPreview"
import { ReviewDialog } from "./ReviewDialog"
import { isValidEmail } from '@/lib/utils'

import { render } from '@react-email/render';
import { renderEmailContainer } from "../email/emailPreview"
import RichTextEditor from "./RichTextEditor"
import { sendEmail } from '@/app/actions/email'


interface ComposerClientProps {
  initialEmailProvider: string
}

export default function ComposerClient({ initialEmailProvider }: ComposerClientProps) {
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState("")
  const [subject, setSubject] = useState("")
  const [showReview, setShowReview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailProvider] = useState(initialEmailProvider)
  const [from, setFrom] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const { emails, setEmails } = useRecipientStore()

  useEffect(() => {
    setMounted(true)
    const savedDraft = localStorage.getItem('emailDraft')
    if (savedDraft) {
      const draft = JSON.parse(savedDraft)
      setContent(draft.content || '')
      setSubject(draft.subject || '')
      setEmails(draft.emails || [])
    }
  }, [setEmails])

  const saveDraft = () => {
    const draft = {
      content,
      subject,
      from,
      emails,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem('emailDraft', JSON.stringify(draft))
    toast.success('Draft saved successfully')
  }

  const addEmail = () => {
    if (!isValidEmail(newEmail)) {
      toast.error("Please enter a valid email address")
      return
    }
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail])
      setNewEmail("")
    } else if (emails.includes(newEmail)) {
      toast.error("This email is already added")
    }
  }

  const handleSend = async () => {
    if (!subject) {
      toast.error("Please enter a subject")
      return
    }
    if (!content) {
      toast.error("Please enter email content")
      return
    }
    if (emails.length === 0) {
      toast.error("Please add at least one recipient email")
      return
    }

    const reactComponent = renderEmailContainer(JSON.parse(content))
    const htmlContent = await render(reactComponent, { pretty: true })

    setIsSending(true)
    try {
      const response = await sendEmail({
        subject,
        content: htmlContent,
        from,
        to: emails,
        provider: emailProvider,
      })
      
      if (response.success && response.result?.data?.succeeded > 0) {
        toast.success('Email sent successfully')
        setShowReview(false)
        setContent('')
        setSubject('')
        setFrom('')
        setEmails([])
        handleContentChange('')
        localStorage.removeItem('emailDraft')
      } else {
        throw new Error(response.error || 'Failed to send email')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send email')
      console.error('Send email error:', error)
    } finally {
      setIsSending(false)
    }
  }

  if (!mounted) {
    return null
  }

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-2 sm:p-4 md:p-6 max-w-4xl"
      >
        <h1 className="font-outfit text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Compose Email
        </h1>
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
          <div className="relative p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <EmailForm
              from={from}
              subject={subject}
              setSubject={setSubject}
              emails={emails}
              setEmails={setEmails}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              addEmail={addEmail}
              setFrom={setFrom}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium block">Content:</label>
              <RichTextEditor 
                key={content || 'empty'} // Add key to force re-render
                value={content} 
                onChange={(value) => handleContentChange(value)} 
              />
            </div>
          </div>

          <div className="relative p-4 bg-gray-50 border-t">
            <ActionButtons

              onSaveDraft={saveDraft}
              onReview={() => setShowReview(true)}
              content={content}
            />
          </div>
        </div>
      </motion.div>

      <EmailPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        from={from}
        emails={emails}
        subject={subject}
        content={content}
      />

      <ReviewDialog
        open={showReview}
        onOpenChange={setShowReview}
        from={from}
        emails={emails}
        subject={subject}
        content={content}
        isSending={isSending}
        onSend={handleSend}
      />

    </>
  )
}