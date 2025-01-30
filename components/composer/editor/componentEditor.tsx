import { ComponentProps } from "./Editor"

interface ComponentEditorProps {
    component: ComponentProps
    onChange: (content: string, props?: any) => void
  }
  
export function ComponentEditor({ component, onChange }: ComponentEditorProps) {
    const baseInputClass = "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  
    switch (component.type) {
        case "button":
          return (
            <div className="space-y-2">
              <input
                type="text"
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Button text"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p>Background Color</p>
                  <input
                    type="color"
                    className="block w-full h-10 p-1 rounded-md"
                    value={component.props.style?.backgroundColor || "#000000"}
                    onChange={(e) =>
                      onChange(component.content, {
                        style: { ...component.props.style, backgroundColor: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <p>Text Color</p>
                  <input
                    type="color"
                    className="block w-full h-10 p-1 rounded-md"
                    value={component.props.style?.color || "#ffffff"}
                    onChange={(e) =>
                      onChange(component.content, {
                        style: { ...component.props.style, color: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )
        case "text":
          return (
            <div className="space-y-2">
              <textarea
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter text here..."
                rows={3}
              />
              <div>
                <p>Text Color</p>
                <input
                  type="color"
                  className="block w-full h-10 p-1 rounded-md"
                  value={component.props.style?.color || "#000000"}
                  onChange={(e) =>
                    onChange(component.content, {
                      style: { ...component.props.style, color: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )
        case "image":
          return (
            <div className="space-y-2">
              <input
                type="text"
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Image URL"
              />
              <input
                type="text"
                className={baseInputClass}
                value={component.props.alt}
                onChange={(e) => onChange(component.content, { alt: e.target.value })}
                placeholder="Image alt text"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Width (px)</p>
                  <input
                    type="number"
                    className={baseInputClass}
                    value={component.props.style?.width?.replace('px', '') || ''}
                    onChange={(e) => onChange(component.content, {
                      style: { ...component.props.style, width: `${e.target.value}px` }
                    })}
                    placeholder="Auto"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Height (px)</p>
                  <input
                    type="number"
                    className={baseInputClass}
                    value={component.props.style?.height?.replace('px', '') || ''}
                    onChange={(e) => onChange(component.content, {
                      style: { ...component.props.style, height: `${e.target.value}px` }
                    })}
                    placeholder="Auto"
                  />
                </div>
              </div>
              {component.content && (
                <div className="mt-2">
                  <img
                    src={component.content || "/placeholder.svg"}
                    alt={component.props.alt || "alt image"}
                    className="max-w-full h-auto"
                    style={{
                      width: component.props.style?.width || 'auto',
                      height: component.props.style?.height || 'auto'
                    }}
                  />
                </div>
              )}
            </div>
          )
        case "divider":
          return (
            <div className="space-y-2">
              <input
                type="text"
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Divider text (optional)"
              />
              <div>
                <p>Color</p>
                <input
                  type="color"
                  className="block w-full h-10 p-1 rounded-md"
                  value={component.props.style?.borderColor || "#000000"}
                  onChange={(e) =>
                    onChange(component.content, {
                      style: { ...component.props.style, borderColor: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )
        case "container":
          return (
            <div className="space-y-2">
              <textarea
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Container content..."
                rows={3}
              />
              <div>
                <p>Background Color</p>
                <input
                  type="color"
                  className="block w-full h-10 p-1 rounded-md"
                  value={component.props.style?.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    onChange(component.content, {
                      style: { ...component.props.style, backgroundColor: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )
        case "footer":
          if (component.props.type === "social") {
            return (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p>Social Media Links</p>
                  <input
                    type="url"
                    className={baseInputClass}
                    value={component.props.twitter || ""}
                    onChange={(e) =>
                      onChange(component.content, {
                        ...component.props,
                        twitter: e.target.value,
                      })
                    }
                    placeholder="Twitter URL"
                  />
                  <input
                    type="url"
                    className={baseInputClass}
                    value={component.props.linkedin || ""}
                    onChange={(e) =>
                      onChange(component.content, {
                        ...component.props,
                        linkedin: e.target.value,
                      })
                    }
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="url"
                    className={baseInputClass}
                    value={component.props.github || ""}
                    onChange={(e) =>
                      onChange(component.content, {
                        ...component.props,
                        github: e.target.value,
                      })
                    }
                    placeholder="GitHub URL"
                  />
                </div>
                <div className="space-y-2">
                  <p>Copyright Text</p>
                  <input
                    type="text"
                    className={baseInputClass}
                    value={component.content}
                    onChange={(e) => onChange(e.target.value, component.props)}
                    placeholder="© 2024 Your Company. All rights reserved."
                  />
                </div>
                <div>
                  <p>Background Color</p>
                  <input
                    type="color"
                    className="block w-full h-10 p-1 rounded-md"
                    value={component.props.style?.backgroundColor || "#f3f4f6"}
                    onChange={(e) =>
                      onChange(component.content, {
                        ...component.props,
                        style: { ...component.props.style, backgroundColor: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            )
          }
          return (
            <div className="space-y-2">
              <textarea
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Footer content..."
                rows={3}
              />
            </div>
          )
        case "header":
          return (
            <div className="space-y-2">
              <textarea
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Header content..."
                rows={3}
              />
            </div>
          )
        case "headerBanner":
          return (
            <div className="space-y-2">
              <input
                type="text"
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Banner Image URL"
              />
              <input
                type="text"
                className={baseInputClass}
                value={component.props.alt}
                onChange={(e) => onChange(component.content, { alt: e.target.value })}
                placeholder="Banner Image alt text"
              />
            </div>
          )
        case "link":
          return (
            <div className="space-y-2">
              <input
                type="text"
                className={baseInputClass}
                value={component.content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Link text"
              />
              <input
                type="text"
                className={baseInputClass}
                value={component.props.href || ""}
                onChange={(e) => onChange(component.content, { href: e.target.value })}
                placeholder="Link URL"
              />
            </div>
          )
        default:
          return null
      
    }
  }
  
  