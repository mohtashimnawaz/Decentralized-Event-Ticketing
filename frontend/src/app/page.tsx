import WalletConnectButton from "../components/WalletConnectButton";
import CreateEvent from "../components/CreateEvent";
import EventList from "../components/EventList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Decentralized Event
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Ticketing Platform
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create events, mint NFT tickets, and trade securely on Solana blockchain. 
              Anti-scalping protection and automatic royalties for organizers.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Event Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 h-fit">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-3">
                    ✨
                  </span>
                  Create Event
                </h3>
                <CreateEvent />
              </div>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                    🎫
                  </span>
                  Live Events
                </h3>
                <EventList />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Anti-Scalping</h4>
              <p className="text-gray-300">Built-in protection against ticket scalping and bot purchases</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Creator Royalties</h4>
              <p className="text-gray-300">Automatic royalty payments to event organizers on resales</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">NFT Tickets</h4>
              <p className="text-gray-300">Each ticket is a unique NFT stored securely on Solana blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
