'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export type EmailProvider = 'gmail' | 'smtp'

export async function setEmailProvider(provider: EmailProvider) {
  await cookies().set('emailProvider', provider, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, 
  })
  revalidatePath('/')
}