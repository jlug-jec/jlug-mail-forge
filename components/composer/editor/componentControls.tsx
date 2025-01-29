import { Button } from "@/components/ui/button"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface ComponentControlsProps {
  onAlignmentChange: (alignment: string) => void
  onRemove: () => void
  currentAlignment?: string
}

export function ComponentControls({ 
  onAlignmentChange, 
  onRemove, 
  currentAlignment = 'left' 
}: ComponentControlsProps) {
  return (
    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
      <div className="flex items-center gap-1 bg-white border rounded-md p-1">
        <Button 
          variant={currentAlignment === "left" ? "default" : "ghost"} 
          size="sm" 
          onClick={() => onAlignmentChange("left")} 
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant={currentAlignment === "center" ? "default" : "ghost"} 
          size="sm" 
          onClick={() => onAlignmentChange("center")} 
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant={currentAlignment === "right" ? "default" : "ghost"} 
          size="sm" 
          onClick={() => onAlignmentChange("right")} 
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0">
        ✕
      </Button>
    </div>
  )
}
