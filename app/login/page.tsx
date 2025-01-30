import { cookies } from 'next/headers'
import { LoginForm } from '@/components/auth/LoginForm'

async function login(username: string, password: string) {
  'use server'
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const cookieStore=await cookies()
    cookieStore.set('isAuthenticated', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    })
    return { success: true }
  }
  
  return { success: false, message: 'Invalid credentials' }
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-gray-50/90 to-gray-100/80">
      <LoginForm onLogin={login} />
    </div>
  )
}