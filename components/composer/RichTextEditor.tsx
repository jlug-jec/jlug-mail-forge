"use client"
import 'react-quill-new/dist/quill.snow.css';
import { useState } from "react"

import { useRecipientStore } from '@/store/recipientStore'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { FieldSelector } from "../../components/composer/FieldSelector"
import { Editor } from "./editor/Editor"
import { isValidEmail } from '@/lib/utils'
import { useTemplateStore } from '@/store/template-store';
import Link from 'next/link';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const { getTemplate,setSelectedTemplate } = useTemplateStore()
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const { setEmails, selectedRecipients, availableFields } = useRecipientStore()
  const currentTemplate = getTemplate()

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


const clearTemplate = () => {
  
  onChange("")
  setSelectedTemplate(null)
  window.location.reload()  
  toast.success("Template cleared")
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
          {currentTemplate ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearTemplate()}
              className="whitespace-nowrap"
            >
             Clear Template
            </Button>
          ):
          <Link href="/templates" className="whitespace-nowrap">
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              Choose Template
            </Button>
            </Link>
            }
        </div>
      </div>
      <Editor 
        value={value} 
        onChange={onChange}
      />
     
    </div>
  )
}