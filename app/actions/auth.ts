'use server'

import { cookies } from 'next/headers'


export async function login(username: string, password: string) {
  const cookieStore=await cookies()
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    cookieStore.set('isAuthenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    })
    return { success: true }
  }
  return { success: false, message: 'Invalid credentials' }
}

