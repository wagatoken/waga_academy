import Link from "next/link"
import { Twitter, Linkedin, Send, MessageSquare, FileText } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-black/40 backdrop-blur">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-gradient-text">WAGA Academy</h3>
            <p className="text-sm text-muted-foreground">
              Empowering the future of coffee through Web3 and blockchain technology
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-gradient-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" scroll={true} className="text-sm text-muted-foreground hover:text-primary">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/summer-camp" scroll={true} className="text-sm text-muted-foreground hover:text-primary">
                  Summer Camp
                </Link>
              </li>
              <li>
                <Link href="/about" scroll={true} className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" scroll={true} className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-gradient-text">Learning Paths</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses?category=cultivation"
                  scroll={true}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Coffee Cultivation
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=processing"
                  scroll={true}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Coffee Processing
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=web3"
                  scroll={true}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Web3 & Blockchain
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=finance"
                  scroll={true}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  DeFi & Finance
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-gradient-text">Contact</h3>
            <p className="text-sm text-muted-foreground">Email: academy@wagatoken.io</p>
            <p className="text-sm text-muted-foreground">Website: www.academy.wagatoken.io</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 border-t border-purple-500/20 pt-8">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-medium web3-gradient-text">Connect With Us</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://x.com/WagaAcademy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border border-purple-500/30 p-3 rounded-full hover:border-purple-500/60 hover:bg-purple-500/10 transition-colors"
              >
                <Twitter className="h-5 w-5 text-purple-400" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://www.linkedin.com/company/waga-token-official/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border border-purple-500/30 p-3 rounded-full hover:border-purple-500/60 hover:bg-purple-500/10 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-purple-400" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://t.me/wagatoken"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border border-purple-500/30 p-3 rounded-full hover:border-purple-500/60 hover:bg-purple-500/10 transition-colors"
              >
                <Send className="h-5 w-5 text-purple-400" />
                <span className="sr-only">Telegram</span>
              </Link>
              <Link
                href="https://discord.gg/wagacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border border-purple-500/30 p-3 rounded-full hover:border-purple-500/60 hover:bg-purple-500/10 transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <span className="sr-only">Discord</span>
              </Link>
              <Link
                href="https://medium.com/@wagacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 border border-purple-500/30 p-3 rounded-full hover:border-purple-500/60 hover:bg-purple-500/10 transition-colors"
              >
                <FileText className="h-5 w-5 text-purple-400" />
                <span className="sr-only">Medium</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WAGA Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

