"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { ethers } from "ethers";

type WalletContextType = {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: number | null;
  connectWallet: (provider: string) => Promise<void>;
  disconnectWallet: () => void;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  isModalOpen: boolean;
  signMessage: (message: string) => Promise<string>;
  error: Error | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("walletAddress");
      const savedChainId = localStorage.getItem("walletChainId");
      if (savedAddress && savedChainId) {
        setAddress(savedAddress);
        setChainId(Number(savedChainId));
        setIsConnected(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Accounts changed:", accounts);
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        console.log("Chain changed:", chainId);
        setChainId(Number(chainId));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async (provider: string) => {
    console.log("Starting wallet connection...");
    setIsConnecting(true);
    setError(null);

    try {
      if (provider === "metamask") {
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found. Please install MetaMask.");
        }
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await ethersProvider.send("eth_requestAccounts", []);
        const network = await ethersProvider.getNetwork();

        if (Number(network.chainId) !== 1) {
          throw new Error("Please connect to the Ethereum Mainnet.");
        }

        setAddress(accounts[0]);
        setChainId(Number(network.chainId));
        setIsConnected(true);

        localStorage.setItem("walletAddress", accounts[0]);
        localStorage.setItem("walletChainId", network.chainId.toString());
        console.log("Wallet connected successfully.");
      } else if (provider === "walletconnect") {
        throw new Error("WalletConnect is not yet implemented.");
      } else {
        throw new Error("Unsupported wallet provider.");
      }

      closeConnectModal();
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err instanceof Error ? err : new Error("Failed to connect wallet"));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setChainId(null);
    setIsConnected(false);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletChainId");
    setError(null);
    console.log("Wallet disconnected.");
  };

  const openConnectModal = () => {
    console.log("Opening connect modal...");
    setIsModalOpen(true);
  };

  const closeConnectModal = () => {
    console.log("Closing connect modal...");
    setIsModalOpen(false);
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!window.ethereum || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      return await signer.signMessage(message);
    } catch (err) {
      console.error("Error signing message:", err);
      throw new Error("Failed to sign message");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        isConnected,
        chainId,
        connectWallet,
        disconnectWallet,
        openConnectModal,
        closeConnectModal,
        isModalOpen,
        signMessage,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}