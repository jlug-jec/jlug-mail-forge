"use client"
import 'react-quill-new/dist/quill.snow.css';
import { useState } from "react"

import { useRecipientStore } from '@/store/recipientStore'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { FieldSelector } from "../../components/composer/FieldSelector"
import { Editor } from "../../components/composer/Editor"
import { isValidEmail } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
}

export default function RichTextEditor({ value, }: RichTextEditorProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const { setEmails,selectedRecipients, availableFields } = useRecipientStore()

  const handleFieldSelect = (field: string) => {
    if (selectedRecipients.length === 0) {
      toast.error("Please select recipients from the Recipients page first")
      return
    }

    const firstValue = selectedRecipients[0][field]
    if (!firstValue || !isValidEmail(firstValue)) {
      toast.error("Please select a valid email field")
      return
    }

    setSelectedField(field)
  }

  const insertField = () => {
    if (!selectedField) {
      toast.error("Please select a field first")
      return
    }

    setEmails(selectedRecipients.map((recipient) => recipient[selectedField] as string))
    setSelectedField(null)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 bg-gray-50 flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <FieldSelector
            selectedField={selectedField}
            selectedRecipients={selectedRecipients}
            availableFields={availableFields}
            onFieldSelect={handleFieldSelect}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={insertField}
            disabled={!selectedField}
            className="whitespace-nowrap"
          >
            Insert Mails from Field
          </Button>
        </div>
      </div>
      <Editor value={value} />
      <style jsx global>{`
        .ql-container {
          font-size: 16px;
        }
        @media (max-width: 640px) {
          .ql-container {
            font-size: 14px;
          }
          .ql-toolbar {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}