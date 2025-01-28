"use client"
import 'react-quill-new/dist/quill.snow.css';
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[400px] border rounded-lg bg-gray-100 animate-pulse" />,
})

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  return (
    <ReactQuill 
      theme="snow" 
      value={value} 
      onChange={onChange}
      className="min-h-[200px]"
    />
  )
}