import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TEMPLATES } from '@/components/templates/templates'

interface TemplateSelectorProps {
  onSelect: (template: string) => void
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Choose Template
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            {Object.entries(TEMPLATES).map(([category, templates]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold capitalize mb-3">
                  {category.replace('_', ' ')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      onClick={() => {
                        onSelect(template.id)
                        setOpen(false)
                      }}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}