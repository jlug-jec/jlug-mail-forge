// types.ts
export interface ComponentProps {
  id: string
  type: string
  content: string
  props: {
    style?: {
      backgroundColor?: string
      color?: string
      borderColor?: string
      textAlign?: string
      height?: string
      width?: string
    }
    alt?: string
    href?: string
    type?: string
    twitter?: string
    linkedin?: string
    github?: string
  }
}

interface EditorProps {
  value: string
  onChange?: (value: string) => void
}




// components/Editor.tsx
import { useEffect, useState } from "react"

import { EmailPreview } from "../EmailPreview"
import { Toolbar } from "./toolbar"
import { ComponentControls } from "./componentControls"
import { ComponentEditor } from "./componentEditor"
import { useTemplateStore } from "@/store/template-store"
import { templateToComponents } from "../../templates/templateToComponent"

export function Editor({ value, onChange }: EditorProps) {
  const [components, setComponents] = useState<ComponentProps[]>(() => {
    try {
      return value ? JSON.parse(value) : []
    } catch {
      return []
    }
  });
  
  const { getTemplate, selectedTemplate } = useTemplateStore()

  const loadTemplate = async (templateName: string) => {
    const template = getTemplate();
    if (template) {
      const TemplateComponent = template();
      const convertedComponents = templateToComponents(TemplateComponent);
      setComponents(convertedComponents);
      updateValue(convertedComponents);
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  const addComponent = (type: string) => {
    const newComponent = {
      type,
      id: Date.now().toString(),
      content: "",
      props: { style: {} },
    }
    setComponents([...components, newComponent])
    updateValue([...components, newComponent])
  }

  const updateComponent = (id: string, content: string, props: any = {}) => {
    const updatedComponents = components.map((comp) =>
      comp.id === id ? { ...comp, content, props: { ...comp.props, ...props } } : comp
    )
    setComponents(updatedComponents)
    updateValue(updatedComponents)
  }

  const updateValue = (comps: ComponentProps[]) => {
    onChange?.(JSON.stringify(comps))
  }

  const removeComponent = (id: string) => {
    const filtered = components.filter((comp) => comp.id !== id)
    setComponents(filtered)
    updateValue(filtered)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-1/2 border rounded-lg p-4 space-y-4 bg-white">
        <Toolbar onAddComponent={addComponent} />
        <div className="space-y-4 min-h-[200px]">
          {components.map((component) => (
            <div 
              key={component.id} 
              className="group relative p-2 sm:p-4 border rounded-lg hover:bg-gray-50"
            >
              <ComponentControls
                currentAlignment={component.props.style?.textAlign}
                onAlignmentChange={(alignment) =>
                  updateComponent(component.id, component.content, {
                    style: { ...component.props.style, textAlign: alignment },
                  })
                }
                onRemove={() => removeComponent(component.id)}
              />
              <ComponentEditor
                component={component}
                onChange={(content, props) => updateComponent(component.id, content, props)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-1/2 sticky top-4">
        <div className="border rounded-lg p-2 sm:p-4 bg-white">
          {components.length > 0 && <EmailPreview components={components} />}
        </div>
      </div>
    </div>
  )
}

// components/ComponentEditor.tsx

