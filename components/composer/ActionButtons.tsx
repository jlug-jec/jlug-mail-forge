import { Button } from "@/components/ui/button"
import { Eye, Save, Send } from "lucide-react"

interface ActionButtonsProps {
  onPreview: () => void
  onSaveDraft: () => void
  onReview: () => void
}

export function ActionButtons({ onPreview, onSaveDraft, onReview }: ActionButtonsProps) {
  return (
    <div className="border-t p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 bg-gray-50">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 flex-1 sm:flex-none justify-center"  
          onClick={onPreview}
        >
          <Eye className="h-4 w-4" />
          <span className="sm:inline">Preview</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 flex-1 sm:flex-none justify-center" 
          onClick={onSaveDraft}
        >
          <Save className="h-4 w-4" />
          <span className="sm:inline">Save Draft</span>
        </Button>
      </div>
      <Button 
        className="flex items-center gap-2 justify-center"
        onClick={onReview}
      >
        <Send className="h-4 w-4" />
        <span>Review & Send</span>
      </Button>
    </div>
  )
}