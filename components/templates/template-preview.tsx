"use client";

import { templateComponents } from "@/templates";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

type Props = {
 templateId: string;
 mode: "card" | "dialog";
 className?: string;
};

export default function TemplatePreview({ templateId, mode, className }: Props) {
 const iframeRef = useRef<HTMLIFrameElement>(null);
 const rootRef = useRef<ReactDOM.Root | null>(null);

 useEffect(() => {
   const iframe = iframeRef.current;
   if (!iframe) return;

   const handleLoad = () => {
     const component = templateComponents[templateId as keyof typeof templateComponents] as React.ComponentType<any>;
     if (!component) return;

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
           <div id="root"></div>
         </body>
       </html>
     `);
     iframeDoc.close();

     const rootDiv = iframeDoc.getElementById("root");
     if (!rootDiv) return;

     if (rootRef.current) {
       rootRef.current.unmount();
     }
     rootRef.current = ReactDOM.createRoot(rootDiv);
     rootRef.current.render(React.createElement(component));
   };

   iframe.addEventListener("load", handleLoad);
   iframe.src = "about:blank";

   return () => {
     iframe.removeEventListener("load", handleLoad);
     rootRef.current?.unmount();
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