"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { useRecipientStore } from '@/store/recipientStore'
import { EmailForm } from "./EmailForm"
import { ActionButtons } from "./ActionButtons"
import { EmailPreview } from "./EmailPreview"
import { ReviewDialog } from "./ReviewDialog"
import { isValidEmail } from '@/lib/utils'

const RichTextEditor = dynamic(() => import("@/components/composer/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[200px] border rounded-md bg-gray-50 animate-pulse" />
})

interface ComposerClientProps {
  initialEmailProvider: string
}

export default function ComposerClient({ initialEmailProvider }: ComposerClientProps) {
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState("")
  const [subject, setSubject] = useState("")
  const [showReview, setShowReview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailProvider, setEmailProvider] = useState(initialEmailProvider)
  const from = "jlug@Club.com"
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

    setIsSending(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          from,
          to: emails,
          provider: emailProvider,
        }),
      })

      if (!response.ok) throw new Error('Failed to send email')

      toast.success('Email sent successfully')
      setShowReview(false)
      setContent('')
      setSubject('')
      setEmails([])
      localStorage.removeItem('emailDraft')
    } catch (error) {
      toast.error('Failed to send email')
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-2 sm:p-4 md:p-6 max-w-4xl"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <EmailForm
              from={from}
              subject={subject}
              setSubject={setSubject}
              emails={emails}
              setEmails={setEmails}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              addEmail={addEmail}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium block">Content:</label>
              <RichTextEditor value={content} />
            </div>
          </div>

          <ActionButtons
            onPreview={() => setShowPreview(true)}
            onSaveDraft={saveDraft}
            onReview={() => setShowReview(true)}
          />
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