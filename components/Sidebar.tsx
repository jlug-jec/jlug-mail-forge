"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Mail, FileText, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Recipients",
    icon: Users,
    href: "/receipients",
  },
  {
    title: "Composer",
    icon: Mail,
    href: "/compose",
  },
  {
    title: "Templates",
    icon: FileText,
    href: "/templates",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isCollapsed ? 70 : 250 }}
      className="border-r bg-white h-screen flex flex-col"
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold">
            EmailPro
          </motion.h1>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg mb-2 transition-colors",
                pathname === item.href ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.title}</span>}
            </motion.div>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          {!isCollapsed && (
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-500">john@example.com</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

