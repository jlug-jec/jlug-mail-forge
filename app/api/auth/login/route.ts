import { NextResponse } from 'next/server'


const validUser = {
    username: process.env.ADMIN_USERNAME ,
    password: process.env.ADMIN_PASSWORD 
  }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (username === validUser.username && password === validUser.password) {
      // Set HTTP-only cookie
      const response = NextResponse.json({ success: true })
      response.cookies.set('isAuthenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}