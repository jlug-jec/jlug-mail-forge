// components/ToolbarButton.tsx
import { Button } from "@/components/ui/button"
import { Plus, Type, Image, Divide, Layout, FootprintsIcon, LinkIcon,LucideIcon } from "lucide-react"

interface ToolbarProps {
  onAddComponent: (type: string) => void
}

interface ToolbarButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
}

export function ToolbarButton({ icon: Icon, label, onClick }: ToolbarButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}



export function Toolbar({ onAddComponent }: ToolbarProps) {
  const tools = [
    { icon: Plus, label: "Button", type: "button" },
    { icon: Type, label: "Header", type: "header" },
    { icon: FootprintsIcon, label: "Footer", type: "footer" },
    { icon: Plus, label: "Text", type: "text" },
    { icon: Image, label: "Image", type: "image" },
    { icon: Divide, label: "Divider", type: "divider" },
    { icon: Layout, label: "Container", type: "container" },
    { icon: Image, label: "Header Banner", type: "headerBanner" },
    { icon: LinkIcon, label: "Link", type: "link" },
  ]

  return (
    <div className="flex flex-wrap gap-2 border-b pb-4">
      {tools.map((tool) => (
        <ToolbarButton
          key={tool.type}
          icon={tool.icon}
          label={tool.label}
          onClick={() => onAddComponent(tool.type)}
        />
      ))}
    </div>
  )
}
