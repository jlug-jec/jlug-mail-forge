"use client";

import React, { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { templateComponents } from "@/templates";

type Props = {
  templateId: string;
  mode: "card" | "dialog";
  className?: string;
};

export default function TemplatePreview({ templateId, mode, className }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const handleLoad = () => {
      const Component = templateComponents[templateId as keyof typeof templateComponents];

      if (!Component) return;

      // Pre-render the component to string
      const htmlContent = renderToString(<Component userFirstname="Preview" />);

      // Extract body content
      const bodyContent =
        htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || htmlContent;

      const iframeDoc = iframe.contentDocument;

      if (!iframeDoc) return;

      iframeDoc.open();

      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                margin: 0;
                padding: ${mode === 'card' ? '0.5rem' : '1rem'};
                font-family: system-ui, -apple-system, sans-serif;
              }
              #root {
                max-width: ${mode === 'card' ? '100%' : '600px'};
                margin: 0 auto;
                transform-origin: top left;
                transform: scale(${mode === 'card' ? '0.4' : '0.8'});
              }
              @media (max-width: 768px) {
                #root {
                  transform: scale(${mode === 'card' ? '0.35' : '0.7'});
                }
              }
            </style>
          </head>
          <body>
            ${bodyContent} 
          </body>
        </html>
      `);

      iframeDoc.close();
    };

    iframe.addEventListener("load", handleLoad);
    iframe.src = "about:blank";

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [templateId, mode]);

  return (
    <iframe
      ref={iframeRef}
      title={`Email Template Preview - ${templateId}`}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "0.5rem",
      }}
    />
  );
}
