"use client"

import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ConnectWalletButton() {
  const { address, isConnected, openConnectModal, disconnectWallet } = useWallet()

  // Format address for display (0x71C7...976F)
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Generate avatar fallback from address
  const generateAvatarFallback = (address: string) => {
    return address.slice(2, 4).toUpperCase()
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 h-8 px-2"
          >
            <Avatar className="h-4 w-4 mr-1">
              <AvatarFallback className="bg-purple-900/50 text-xs">{generateAvatarFallback(address)}</AvatarFallback>
            </Avatar>
            {formatAddress(address)}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="web3-card-purple">
          <DropdownMenuItem className="text-red-400 focus:text-red-400 cursor-pointer" onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button size="sm" onClick={openConnectModal} className="web3-button h-8 px-2">
      <Wallet className="mr-1 h-3 w-3" />
      Connect Wallet
    </Button>
  )
}

