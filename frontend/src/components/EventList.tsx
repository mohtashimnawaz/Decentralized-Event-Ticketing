"use client";
import { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../anchor";
import MintTicket from "./MintTicket";
import WalletConnectButton from "./WalletConnectButton";

export default function EventList() {
  const wallet = useAnchorWallet();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!wallet || !wallet.publicKey) {
      console.log("Wallet not connected, skipping fetch");
      return;
    }
    
    setLoading(true);
    try {
      const program = getProgram(wallet);
      console.log("Fetching events with program:", program.programId.toString());
      
      // Try to fetch all Event accounts
      let eventAccounts = [];
      try {
        eventAccounts = await (program.account as any).event.all();
      } catch (accountError) {
        console.log("No events found or account fetch failed:", accountError);
        setEvents([]);
        return;
      }
      
      console.log("Raw event accounts:", eventAccounts);
      
      const processedEvents = eventAccounts?.map((e: any) => ({ 
        ...e.account, 
        pubkey: e.publicKey 
      })) || [];
      
      console.log("Processed events:", processedEvents);
      setEvents(processedEvents);
    } catch (e) {
      console.error("Error fetching events:", e);
      console.error("Error details:", JSON.stringify(e, null, 2));
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [wallet]);

    if (!wallet) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="mr-3">🎟️</span>
          Live Events
        </h2>
        <div className="text-center py-8">
          <p className="text-white/70 mb-4">Connect your wallet to view events</p>
          <WalletConnectButton />
        </div>
      </div>
    );
  }
  
  if (loading) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
        <span className="text-2xl">⚡</span>
      </div>
      <p className="text-gray-300">Loading events...</p>
    </div>
  );
  
  if (events.length === 0) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📅</span>
      </div>
      <p className="text-gray-300">No events found</p>
      <p className="text-sm text-gray-400 mt-2">Create your first event to get started!</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {events.map((event: any, i: number) => (
          <div key={`event-${i}-${event.organizer?.toString()}`} 
               className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🎪</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{event.name}</h4>
                  <p className="text-sm text-gray-400">
                    {event.organizer.toString().slice(0, 8)}...{event.organizer.toString().slice(-4)}
                  </p>
                  {event.venue && (
                    <p className="text-sm text-blue-400 flex items-center mt-1">
                      📍 {event.venue}
                    </p>
                  )}
                  {event.eventDate && event.eventDate.toNumber() > 0 && (
                    <p className="text-sm text-green-400 flex items-center mt-1">
                      📅 {new Date(event.eventDate.toNumber() * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                Live
              </span>
            </div>
            
            {event.description && (
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-gray-300 text-sm">{event.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{event.totalTickets}</p>
                <p className="text-sm text-gray-400">Total Tickets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{event.ticketsSold}</p>
                <p className="text-sm text-gray-400">Sold</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{(event.ticketPrice / 1000000000).toFixed(3)}</p>
                <p className="text-sm text-gray-400">SOL</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{event.royaltyBps / 100}%</p>
                <p className="text-sm text-gray-400">Royalty</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <MintTicket 
                eventKey={event.pubkey.toString()} 
                onSuccess={fetchEvents}
              />
              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-white/20">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
