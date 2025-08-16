"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectButton() {
  return (
    <div className="wallet-adapter-button-container">
      <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 hover:!from-purple-600 hover:!to-pink-600 !rounded-xl !font-bold !transition-all !duration-200 !transform hover:!scale-105 !shadow-lg" />
    </div>
  );
}
