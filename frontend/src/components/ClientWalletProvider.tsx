"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamically import the wallet provider to ensure it only loads on client
const WalletContextProvider = dynamic(
  () => import("../wallet").then((mod) => ({ default: mod.WalletContextProvider })),
  {
    ssr: false,
    loading: () => <div>Loading wallet...</div>,
  }
);

interface ClientWalletProviderProps {
  children: ReactNode;
}

export default function ClientWalletProvider({ children }: ClientWalletProviderProps) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}
