import WalletConnectButton from "../components/WalletConnectButton";
import AnimatedLanding from "../components/AnimatedLanding";

export default function Home() {
  return (
    <div className="relative">
      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎟️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Dex<span className="text-purple-400">Tik</span>
              </h1>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </nav>

      {/* Animated Landing Content */}
      <AnimatedLanding />
    </div>
  );
}
