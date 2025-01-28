import "./globals.css"
import { Inter, Outfit } from "next/font/google"
import Sidebar from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit'
})

export const metadata = {
  title: "JLUG Mail Forge - Email Dashboard",
  description: "Professional email marketing platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body 
        className={cn(
          inter.className,
          "min-h-screen bg-gradient-to-br from-gray-50 via-gray-50/90 to-gray-100/80",
          "dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-800/80",
          "relative isolate"
        )}
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-gray-100 via-gray-50/0 to-gray-100" />
        
        <div className="flex h-screen relative">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}

