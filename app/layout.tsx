import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { WalletProvider } from "@/context/wallet-context"
import { AuthProvider } from "@/context/auth-context"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
import { ToastProviderWithContext } from "@/components/ui/toast" // Import the ToastProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WAGA Academy",
  description: "Empowering the future of coffee with Web3 and blockchain technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <WalletProvider>
              <ScrollToTop>
                <ToastProviderWithContext> 
                  <div className="relative min-h-screen bg-background font-sans antialiased">
                    <div className="relative flex min-h-screen flex-col">
                      <MainNav />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                  </div>
                  <WalletConnectionModal />
                </ToastProviderWithContext>
              </ScrollToTop>
            </WalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'