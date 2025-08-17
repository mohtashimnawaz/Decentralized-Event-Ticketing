'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button3D from './Button3D';
import { useState } from 'react';

interface TicketData {
  eventName: string;
  eventDate: Date;
  venue: string;
  ticketId: string;
  mintAddress: string;
  eventKey: string;
  seat?: string;
  price: number;
  image?: string;
}

interface TicketNFTProps {
  ticket: TicketData;
  onClose: () => void;
  onDownload: () => void;
}

export default function TicketNFT({ ticket, onClose, onDownload }: TicketNFTProps) {
  const [copied, setCopied] = useState(false);

  const copyMintAddress = async () => {
    await navigator.clipboard.writeText(ticket.mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${ticket.eventName} - NFT Ticket`,
          text: `Check out my NFT ticket for ${ticket.eventName}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `🎫 I own an NFT ticket for ${ticket.eventName}! 
📍 ${ticket.venue}
📅 ${ticket.eventDate.toLocaleDateString()}
🎯 Ticket ID: ${ticket.ticketId}
🔗 Mint Address: ${ticket.mintAddress}`;
      
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const viewOnExplorer = () => {
    // Open Solana explorer for the NFT on devnet
    window.open(`https://explorer.solana.com/address/${ticket.mintAddress}?cluster=devnet`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
          style={{ transformStyle: 'preserve-3d' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">🎫 NFT Ticket</h2>
              <p className="text-purple-200">Your digital event pass on Solana Devnet</p>
            </div>
            <Button3D
              size="sm"
              variant="secondary"
              onClick={onClose}
              className="!px-3 !py-2"
            >
              ✕
            </Button3D>
          </div>

          {/* Ticket Visual */}
          <div className="relative mb-8">
            <motion.div
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-1 rounded-xl"
              animate={{ 
                background: [
                  'linear-gradient(45deg, #8B5CF6, #EC4899, #F59E0B)',
                  'linear-gradient(45deg, #EC4899, #F59E0B, #8B5CF6)',
                  'linear-gradient(45deg, #F59E0B, #8B5CF6, #EC4899)',
                  'linear-gradient(45deg, #8B5CF6, #EC4899, #F59E0B)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{ticket.eventName}</h3>
                    <p className="text-purple-200">📍 {ticket.venue}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                      VERIFIED NFT
                    </div>
                    <p className="text-sm text-gray-300">#{ticket.ticketId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-semibold">{ticket.eventDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-white font-semibold">{ticket.eventDate.toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Price Paid</p>
                    <p className="text-green-400 font-semibold">{ticket.price} SOL</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Seat</p>
                    <p className="text-white font-semibold">{ticket.seat || 'General Admission'}</p>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">QR</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-400">Scan for event entry</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* NFT Details */}
          <div className="space-y-4 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">🔗 Blockchain Details</h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mint Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200 font-mono text-sm">
                      {ticket.mintAddress.slice(0, 8)}...{ticket.mintAddress.slice(-8)}
                    </span>
                    <Button3D
                      size="sm"
                      variant="accent"
                      onClick={copyMintAddress}
                      className="!px-2 !py-1 !text-xs"
                    >
                      {copied ? '✓' : '📋'}
                    </Button3D>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-green-400">Solana Devnet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Standard:</span>
                  <span className="text-blue-400">SPL Token</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">🎯 Ticket Features</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                  <span className="text-green-400 text-sm">✓ Anti-Scalping</span>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
                  <span className="text-blue-400 text-sm">✓ Transferable</span>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-center">
                  <span className="text-purple-400 text-sm">✓ Collectible</span>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 text-center">
                  <span className="text-orange-400 text-sm">✓ Royalties</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button3D
              variant="primary"
              onClick={onDownload}
              className="w-full"
            >
              📥 Download Ticket
            </Button3D>
            <Button3D
              variant="secondary"
              onClick={viewOnExplorer}
              className="w-full"
            >
              🔍 View on Explorer
            </Button3D>
            <Button3D
              variant="accent"
              onClick={shareTicket}
              className="w-full"
            >
              📤 Share Ticket
            </Button3D>
            <Button3D
              variant="secondary"
              onClick={copyMintAddress}
              className="w-full"
            >
              {copied ? '✓ Copied!' : '📋 Copy Address'}
            </Button3D>
          </div>

          {/* Status Indicator */}
          <div className="mt-6 text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm font-semibold">Stored on Solana Devnet</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
