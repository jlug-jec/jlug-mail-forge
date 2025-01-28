"use client"
import 'react-quill-new/dist/quill.snow.css';
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[400px] border rounded-lg bg-gray-100 animate-pulse" />,
})

interface EditorProps {
  value: string
  modules?: any
}

export function Editor({ value, modules }: EditorProps) {
  const defaultModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ]
  }

  return (
    <ReactQuill
      theme="snow"
      value={value}
      modules={modules || defaultModules}
      formats={[
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list',
        'color', 'background',
        'link',
        'image'
      ]}
      className="h-[400px] bg-white"
    />
  )
}