"use client";
import { useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getProgram } from "../anchor";

interface ResellTicketProps {
  ticketKey: string;
  eventKey: string;
  currentPrice: number;
  onSuccess?: () => void;
}

export default function ResellTicket({ ticketKey, eventKey, currentPrice, onSuccess }: ResellTicketProps) {
  const wallet = useAnchorWallet();
  const [reselling, setReselling] = useState(false);
  const [newPrice, setNewPrice] = useState(currentPrice);

  const handleResellTicket = async () => {
    if (!wallet) return;
    
    setReselling(true);
    try {
      const program = getProgram(wallet);
      const ticketPubkey = new PublicKey(ticketKey);
      const eventPubkey = new PublicKey(eventKey);
      
      // Call resell_ticket instruction with BN conversion
      const tx = await program.methods
        .resellTicket(ticketPubkey, new BN(newPrice))
        .accounts({
          event: eventPubkey,
          seller: wallet.publicKey,
        })
        .rpc();
        
      console.log("Ticket resold successfully:", tx);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error reselling ticket:", error);
      alert("Error reselling ticket. Check console for details.");
    } finally {
      setReselling(false);
    }
  };

  if (!wallet) return <div>Connect wallet to resell tickets</div>;

  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-bold mb-2">Resell Ticket</h3>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">New Price:</label>
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Enter new price"
        />
      </div>
      <button
        onClick={handleResellTicket}
        disabled={reselling}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {reselling ? "Reselling..." : "Resell Ticket"}
      </button>
    </div>
  );
}
