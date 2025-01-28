import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmailFormProps {
  from: string
  subject: string
  setSubject: (value: string) => void
  emails: string[]
  setEmails: (emails: string[]) => void
  newEmail: string
  setNewEmail: (email: string) => void
  addEmail: () => void
}

export function EmailForm({
  from,
  subject,
  setSubject,
  emails,
  setEmails,
  newEmail,
  setNewEmail,
  addEmail
}: EmailFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <label className="w-full sm:w-20 text-sm font-medium">From:</label>
        <span className="text-sm sm:text-base">{from}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <label className="w-full sm:w-20 text-sm font-medium">Subject:</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject line..."
          className="flex-1"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block">Recipients:</label>
        <div className="flex flex-wrap gap-2">
          {emails.map((email, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-2 max-w-full sm:max-w-[200px] overflow-hidden"
            >
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{email}</span>
              <button
                onClick={() => {
                  const updatedEmails = emails.filter((_, i) => i !== index);
                  setEmails(updatedEmails);
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Add email..."
              className="flex-1 sm:w-40"
            />
            <Button size="sm" onClick={addEmail} className="flex-shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}