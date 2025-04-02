"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Menu, X, LogIn, UserPlus, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  // Check if user is on login or register page
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-2 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold web3-gradient-text">WAGA Academy</span>
          </Link>
          <nav className="hidden md:flex gap-2">
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
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {!isInCommunity && !isAuthPage && (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 h-8 px-2"
                  >
                    Account
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-card/95 backdrop-blur border-purple-500/20 web3-card-purple"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="flex items-center cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div>
                <ConnectWalletButton />
              </div>
            </div>
          )}

          {isInCommunity && (
            <div className="hidden md:block">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 h-8"
              >
                <Link href="/community/profile" scroll={true}>
                  My Profile
                </Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-3 p-4 bg-card/90 backdrop-blur border-t border-purple-500/20 web3-card-purple">
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
                <Button
                  variant="outline"
                  asChild
                  className="border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10"
                >
                  <Link href="/community/profile" scroll={true} onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Link>
                </Button>
              ) : (
                !isAuthPage && (
                  <>
                    <div className="flex flex-col space-y-2 border-t border-purple-500/20 pt-3">
                      <h3 className="text-sm font-medium text-muted-foreground px-2">Account</h3>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                    <div className="pt-2">
                      <ConnectWalletButton />
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

