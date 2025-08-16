"use client";
import { useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getProgram } from "../anchor";

interface MintTicketProps {
  eventKey: string;
  onSuccess?: () => void;
}

export default function MintTicket({ eventKey, onSuccess }: MintTicketProps) {
  const wallet = useAnchorWallet();
  const [minting, setMinting] = useState(false);

  const handleMintTicket = async () => {
    if (!wallet) return;
    
    setMinting(true);
    try {
      const program = getProgram(wallet);
      const eventPubkey = new PublicKey(eventKey);
      
      // Call mint_ticket instruction
      const tx = await program.methods
        .mintTicket(eventPubkey)
        .accounts({
          event: eventPubkey,
          buyer: wallet.publicKey,
        })
        .rpc();
        
      console.log("Ticket minted successfully:", tx);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error minting ticket:", error);
      alert("Error minting ticket. Check console for details.");
    } finally {
      setMinting(false);
    }
  };

  if (!wallet) return (
    <button disabled className="flex-1 bg-gray-500/20 text-gray-400 font-medium py-3 px-4 rounded-xl cursor-not-allowed">
      Connect Wallet
    </button>
  );

  return (
    <button
      onClick={handleMintTicket}
      disabled={minting}
      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
    >
      {minting ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Minting...
        </span>
      ) : (
        "🎫 Mint Ticket"
      )}
    </button>
  );
}
