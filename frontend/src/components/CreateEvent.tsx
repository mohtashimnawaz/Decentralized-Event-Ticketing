"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getProgram } from "../anchor";
import WalletConnectButton from "./WalletConnectButton";

export default function CreateEvent() {
  const wallet = useAnchorWallet();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalTickets: 100,
    ticketPrice: 1000000, // 0.001 SOL in lamports
    royaltyBps: 500, // 5%
  });

  const handleCreateEvent = async () => {
    if (!wallet || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }
    
    if (!formData.name.trim()) {
      alert("Please enter an event name");
      return;
    }
    
    setCreating(true);
    try {
      console.log("Creating event with wallet:", wallet.publicKey.toString());
      
      const program = getProgram(wallet);
      console.log("Program ID:", program.programId.toString());
      
      const eventKeypair = Keypair.generate();
      console.log("Event keypair:", eventKeypair.publicKey.toString());
      
      // Call create_event instruction with proper BN conversion
      const tx = await program.methods
        .createEvent(
          formData.name,
          new BN(formData.totalTickets),
          new BN(formData.ticketPrice),
          new BN(formData.royaltyBps)
        )
        .accounts({
          event: eventKeypair.publicKey,
          organizer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([eventKeypair])
        .rpc();
        
      console.log("Event created successfully:", tx);
      console.log("Event address:", eventKeypair.publicKey.toString());
      alert(`Event created successfully! Address: ${eventKeypair.publicKey.toString()}`);
      
      // Reset form
      setFormData({
        name: "",
        totalTickets: 100,
        ticketPrice: 1000000,
        royaltyBps: 500,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Error creating event. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Check console for details.";
      }
      alert(errorMessage);
    } finally {
      setCreating(false);
    }
  };

    if (!wallet) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="mr-3">🎭</span>
          Create Event
        </h2>
        <div className="text-center py-8">
          <p className="text-white/70 mb-4">Connect your wallet to create events</p>
          <WalletConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Event Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="Enter event name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Total Tickets:</label>
          <input
            type="number"
            value={formData.totalTickets}
            onChange={(e) => setFormData({...formData, totalTickets: Number(e.target.value)})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Ticket Price (lamports):</label>
          <input
            type="number"
            value={formData.ticketPrice}
            onChange={(e) => setFormData({...formData, ticketPrice: Number(e.target.value)})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="1000000 (≈ 0.001 SOL)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Royalty (basis points, 500 = 5%):</label>
          <input
            type="number"
            value={formData.royaltyBps}
            onChange={(e) => setFormData({...formData, royaltyBps: Number(e.target.value)})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="500"
          />
        </div>
        
        <button
          onClick={handleCreateEvent}
          disabled={creating || !formData.name}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {creating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Event...
            </span>
          ) : (
            "Create Event"
          )}
        </button>
      </div>
    </div>
  );
}
