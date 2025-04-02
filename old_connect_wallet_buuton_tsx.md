"use client"

import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Toast } from "@/components/ui/toast"
import { toast } from "sonner";

export function ConnectWalletButton() {
  const { address, isConnected, openConnectModal, disconnectWallet, signMessage, chainId } = useWallet()

  // Format address for display (e.g., 0x71C7...976F)
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Generate avatar fallback from address
  const generateAvatarFallback = (address: string) => {
    return address.slice(2, 4).toUpperCase()
  }

  // Handle signing a message
  const handleSignMessage = async () => {
    try {
      const message = "Welcome to WAGA Academy! Please sign this message to authenticate.";
      const signature = await signMessage(message);
      toast(`Message Signed: ${signature}`); // Pass a single string or JSX element
      // Optionally, send the signature to the backend for verification
    } catch (error) {
      toast("Failed to sign the message."); // Pass a single string for the error
    }
  };

  // Check if the user is on the correct chain
  const isCorrectChain = chainId === 1 // Replace with your desired chain ID (e.g., 1 for Ethereum Mainnet)

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10"
          >
            <Avatar className="h-5 w-5 mr-2">
              <AvatarFallback className="bg-purple-900/50 text-xs">
                {generateAvatarFallback(address)}
              </AvatarFallback>
            </Avatar>
            {formatAddress(address)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="web3-card-purple">
          {!isCorrectChain && (
            <DropdownMenuItem className="text-yellow-400 focus:text-yellow-400">
              Please switch to the correct network
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleSignMessage}>
            <Wallet className="mr-2 h-4 w-4" />
            Sign Message
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-400 focus:text-red-400 cursor-pointer"
            onClick={disconnectWallet}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={openConnectModal} className="web3-button">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}