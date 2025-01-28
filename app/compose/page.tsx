import ComposerClient from '@/components/composer/ComposerClient'
import { cookies } from 'next/headers'


export default async function ComposerPage() {
  const cookieStore = await cookies()
  const emailProvider = cookieStore.get('emailProvider')?.value || 'gmail'
  
  return (
    <ComposerClient
      initialEmailProvider={emailProvider}
    />
  )
}