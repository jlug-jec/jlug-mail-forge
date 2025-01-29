import { ReactElement, ReactNode } from 'react';
import { ComponentProps } from '../composer/editor/Editor';


function extractTextContent(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }
  
  if (Array.isArray(children)) {
    return children
      .map(child => {
        if (typeof child === 'string') {
          return child;
        }
        if (typeof child === 'object' && child !== null) {
          return extractTextContent((child as any).props?.children);
        }
        return '';
      })
      .join(' ');
  }
  
  if (typeof children === 'object' && children !== null) {
    return extractTextContent((children as any).props?.children || '');
  }
  
  return '';
}

export function templateToComponents(template: ReactElement): ComponentProps[] {
  const components: ComponentProps[] = [];
  
  function processElement(element: any) {
    if (!element || !element.type) return;
    
    const typeMap: { [key: string]: string } = {
      'Text': 'text',
      'Button': 'button',
      'Hr': 'divider',
      'Container': 'container',
      'Img': 'image',
      'Link': 'link',
      'Section': 'container',
      'Body': 'container',
      'Preview': 'text'
    };

    // Get component type from the display name or fall back to element type name
    const componentName = element.type.displayName || element.type.name;
    const type = typeMap[componentName];
    
    // Only process if it's a known component type
    if (type) {
      let content = '';
      let props: any = { style: {} };
      
      switch (type) {
        case 'text':
          content = extractTextContent(element.props.children);
          if (element.props.style) {
            props.style = {
              color: element.props.style.color,
              textAlign: element.props.style.textAlign
            };
          }
          break;
          
        case 'button':
          content = extractTextContent(element.props.children);
          props = {
            href: element.props.href,
            style: {
              backgroundColor: element.props.style?.backgroundColor,
              color: element.props.style?.color
            }
          };
          break;
          
        case 'image':
          content = element.props.src || '';
          props = {
            alt: element.props.alt,
            style: {
              width: element.props.width ? `${element.props.width}px` : undefined,
              height: element.props.height ? `${element.props.height}px` : undefined
            }
          };
          break;
          
        case 'link':
          content = extractTextContent(element.props.children);
          props = {
            href: element.props.href,
            style: {
              color: element.props.style?.color
            }
          };
          break;
          
        case 'divider':
          props.style = {
            borderColor: element.props.style?.borderColor
          };
          break;
          
        case 'container':
          if (typeof element.props.children === 'string') {
            content = element.props.children;
          }
          props.style = {
            backgroundColor: element.props.style?.backgroundColor,
            padding: element.props.style?.padding
          };
          break;
      }

      // Add component if it has content or is not a text component
      if (type !== 'text' || content.trim() !== '') {
        components.push({
          id: Date.now().toString() + components.length,
          type,
          content,
          props
        });
      }
    }

    // Process children
    if (element.props.children) {
      if (Array.isArray(element.props.children)) {
        element.props.children.forEach((child: any) => {
          if (child && typeof child === 'object') {
            processElement(child);
          }
        });
      } else if (typeof element.props.children === 'object') {
        processElement(element.props.children);
      }
    }
  }

  processElement(template);
  return components;
}