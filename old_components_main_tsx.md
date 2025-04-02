"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Menu, X } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/academy",
      label: "Academy",
      active: pathname === "/academy",
    },
    {
      href: "/courses",
      label: "Courses",
      active: pathname === "/courses" || pathname.startsWith("/courses/"),
    },
    {
      href: "/summer-camp",
      label: "Summer Camp",
      active: pathname === "/summer-camp",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
    {
      href: "/community/dashboard",
      label: "Community",
      active: pathname.startsWith("/community"),
    },
    {
      href: "/admin",
      label: "Admin",
      active: pathname === "/admin" || pathname.startsWith("/admin/"),
    },
  ]

  // Check if user is on a community page
  const isInCommunity = pathname.startsWith("/community")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold web3-gradient-text">WAGA Academy</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                scroll={true}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative web3-glow",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.label}
                {route.active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-2">
            {isInCommunity ? (
              <Button variant="outline" asChild className="border-purple-500/30 hover:border-purple-500/60">
                <Link href="/community/profile" scroll={true}>
                  My Profile
                </Link>
              </Button>
            ) : (
              <>
                <ConnectWalletButton />
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-3 p-4 bg-card/90 backdrop-blur border-t border-purple-500/20">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                scroll={true}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary p-2",
                  route.active ? "text-primary bg-purple-500/10 rounded-md" : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {isInCommunity ? (
                <Button variant="outline" asChild className="border-purple-500/30 hover:border-purple-500/60">
                  <Link href="/community/profile" scroll={true}>
                    My Profile
                  </Link>
                </Button>
              ) : (
                <>
                  <ConnectWalletButton />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

