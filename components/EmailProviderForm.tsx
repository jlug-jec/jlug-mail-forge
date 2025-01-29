"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import Cookies from 'js-cookie'

interface EmailProviderFormProps {
  defaultProvider: string
}

export function EmailProviderForm({ defaultProvider }: EmailProviderFormProps) {
  const [provider, setProvider] = useState(defaultProvider)

  const handleSubmit = async (formData: FormData) => {
    const newProvider = formData.get('provider') as string
    
    // Set client-side cookie
    Cookies.set('emailProvider', newProvider, { 
      expires: 30,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    
    setProvider(newProvider)
    toast.success(`Email provider changed to ${newProvider === 'smtp2go' ? 'SMTP2GO' : 'Gmail'}`)
  }

  return (
    <form action={handleSubmit} className="space-y-3 w-full max-w-sm mx-auto sm:max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <label className="text-sm font-medium sm:w-32 flex-shrink-0">Email Provider</label>
        <div className="flex-1">
          <select 
            name="provider" 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <option value="smtp2go">SMTP2GO</option>
            <option value="gmail" disabled> Google (Coming Soon)</option>
          </select>
        </div>
      </div>
      <div className="sm:ml-36">
        <Button 
          type="submit" 
          className="w-full sm:w-auto min-w-[120px] transition-all duration-200 hover:scale-105"
        >
          Save Provider
        </Button>
      </div>
    </form>
  )
}