"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Menu, X, LogIn, UserPlus, ChevronDown, LogOut, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/toast"

export function MainNav() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
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
      href: "/bootcamp",
      label: "Bootcamp",
      active: pathname === "/bootcamp",
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
    // Admin route will be conditionally rendered below
  ]

  // Check if user is on login or register page
  const isAuthPage = pathname === "/login" || pathname === "/register"

  // Only show Admin nav if user is admin (from profile table)
  const isAdmin = profile && profile.role === "admin"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-emerald-950/80 backdrop-blur supports-[backdrop-filter]:bg-emerald-950/60">
      <div className="container flex h-16 items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 min-w-0">
          <Link href="/" className="flex items-center space-x-2 min-w-0">
            <span className="truncate text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 transition-all duration-300">
              WAGA Academy
            </span>
          </Link>
          {/* Hide nav on <=md screens, show only on lg+ */}
          <nav className="hidden lg:flex gap-2 sm:gap-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                scroll={true}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative web3-glow group whitespace-nowrap",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-emerald-400 transition-all duration-300">
                  {route.label}
                </span>
                {route.active ? (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-purple-500"></span>
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-purple-500 to-emerald-500 transition-transform duration-300 origin-left"></span>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                key="/admin"
                href="/admin"
                scroll={true}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative web3-glow group whitespace-nowrap",
                  pathname === "/admin" || pathname.startsWith("/admin/") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-emerald-400 transition-all duration-300">
                  Admin
                </span>
                {(pathname === "/admin" || pathname.startsWith("/admin/")) ? (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-purple-500"></span>
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-purple-500 to-emerald-500 transition-transform duration-300 origin-left"></span>
                )}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {!user && !isAuthPage && (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 h-8 px-2 emerald-glow relative overflow-hidden group"
                  >
                    <span className="relative z-10">Account</span>
                    <ChevronDown className="ml-1 h-3 w-3 relative z-10" />
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-emerald-950/95 backdrop-blur border-emerald-500/20 web3-card-emerald"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center cursor-pointer group">
                      <LogIn className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                      <span>Login</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="flex items-center cursor-pointer group">
                      <UserPlus className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
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

          {user && !isAuthPage && (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 h-8 px-2 emerald-glow relative overflow-hidden group"
                  >
                    <span className="relative z-10">Account</span>
                    <ChevronDown className="ml-1 h-3 w-3 relative z-10" />
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-emerald-950/95 backdrop-blur border-emerald-500/20 web3-card-emerald"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/community/profile" className="flex items-center cursor-pointer group">
                      <User className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await signOut();
                        router.push("/login");
                        toast({
                          title: "Logged Out 😔",
                          description: "You have successfully logged out.",
                          variant: "default",
                        });
                      } catch (error) {
                        console.error("Error during sign out:", error);
                        toast({
                          title: "Logout Failed",
                          description: "An error occurred while logging out. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="flex items-center cursor-pointer group"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Hamburger always visible on <=lg screens */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden relative overflow-hidden group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="relative z-10">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet menu: show on <=lg screens */}
      {isMenuOpen && (
        <div className="lg:hidden w-full">
          <div className="flex flex-col space-y-3 p-4 bg-emerald-950/90 backdrop-blur border-t border-emerald-500/20 web3-card-emerald">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                scroll={true}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary p-2 relative overflow-hidden group whitespace-nowrap",
                  route.active
                    ? "text-primary bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-md"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">{route.label}</span>
                {route.active && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-purple-500"></span>
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            ))}
            {isAdmin && (
              <Link
                key="/admin"
                href="/admin"
                scroll={true}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary p-2 relative overflow-hidden group whitespace-nowrap",
                  (pathname === "/admin" || pathname.startsWith("/admin/"))
                    ? "text-primary bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-md"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">Admin</span>
                {(pathname === "/admin" || pathname.startsWith("/admin/")) && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-purple-500"></span>
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex flex-col space-y-2 border-t border-emerald-500/20 pt-3">
                <h3 className="text-sm font-medium text-muted-foreground px-2">Account</h3>
                {user ? (
                  <>
                    <Button variant="ghost" asChild className="justify-start group">
                      <Link href="/community/profile" onClick={() => setIsMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                        <span>My Profile</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start group"
                      onClick={async () => {
                        try {
                          await signOut();
                          setIsMenuOpen(false);
                          router.push("/login");
                          toast({
                            title: "Logged Out 😔",
                            description: "You have successfully logged out.",
                            variant: "default",
                          });
                        } catch (error) {
                          console.error("Error during sign out:", error);
                          toast({
                            title: "Logout Failed",
                            description: "An error occurred while logging out. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  !isAuthPage && (
                    <>
                      <Button variant="ghost" asChild className="justify-start group">
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                          <span>Login</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start group">
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                          <UserPlus className="mr-2 h-4 w-4 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                          <span>Sign Up</span>
                        </Link>
                      </Button>
                    </>
                  )
                )}
              </div>
              {/* {!user && !isAuthPage && (
                <div className="pt-2">
                  <ConnectWalletButton />
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
