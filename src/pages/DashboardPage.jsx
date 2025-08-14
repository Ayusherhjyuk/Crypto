import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTopCoins } from "../features/coins/coinsThunks";
import { setSearch, setFilter } from "../features/ui/uiSlice";
import Navbar from "../components/Navbar";
import CoinChart from "../components/CoinChart";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { Sparklines, SparklinesLine } from "react-sparklines";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";

export default function DashboardPage() {
   const dispatch = useAppDispatch();
  const { search, filter } = useAppSelector((state) => state.ui);
  const coinsState = useAppSelector((state) => state.coins);
  const coins = useAppSelector((state) => Object.values(state.coins.entities));
  const [selectedCoin, setSelectedCoin] = useState(null);

  // NEW: loader visibility control
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    dispatch(fetchTopCoins());

    // Auto-hide loader after 3 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    const interval = setInterval(() => {
      dispatch(fetchTopCoins());
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [dispatch]);

  const filteredCoins = useMemo(() => {
    let list = [...coins].sort((a, b) => b.current_price - a.current_price);

    if (filter.tier === "top10") list = list.slice(0, 10);
    else if (filter.tier === "top50") list = list.slice(0, 50);

    if (filter.change === "positive") {
      list = list.filter((c) => c.price_change_percentage_24h > 0);
    } else if (filter.change === "negative") {
      list = list.filter((c) => c.price_change_percentage_24h < 0);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.symbol.toLowerCase().includes(s)
      );
    }
    return list;
  }, [coins, search, filter]);

  // Show loader for first 3 seconds regardless of API speed
  if (showLoader) {
    return <Loader />;
  }

  if (coinsState.error) {
    return <p className="text-red-500 p-4">Error: {coinsState.error}</p>;
  }
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-[url('/crypto-pattern.png')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <div className="text-center py-12 px-4">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            🚀 Crypto Dashboard
          </h1>
          <p className="text-gray-300 italic text-lg">
            "In crypto, the sky isn't the limit—it's the starting point.."
          </p>
        </div>

        {/* Search & Filters */}
        <div
          className="sticky top-0 z-20 flex flex-wrap gap-4 justify-center mb-6 p-4
          backdrop-blur-lg  rounded-2xl shadow-lg
          
          shadow-pink-500/30  hover:shadow-pink-700 transition-all duration-300"
        >
          <input
            type="text"
            placeholder="🔍 Search by name or symbol..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="px-4 py-2 w-64 rounded-lg bg-white/10 text-white placeholder-gray-300 
              border border-white/30 focus:ring-2 focus:ring-pink-500 backdrop-blur-md"
          />

          <select
  value={filter.tier}
  onChange={(e) => dispatch(setFilter({ tier: e.target.value }))}
  className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/30 
    focus:ring-2 focus:ring-purple-500"
>
  <option value="all">All Coins</option>
  <option value="top10">Top 10</option>
  <option value="top50">Top 50</option>
</select>

          <select
  value={filter.change}
  onChange={(e) => dispatch(setFilter({ change: e.target.value }))}
  className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/30 
    focus:ring-2 focus:ring-indigo-500"
>
  <option value="all">All Changes</option>
  <option value="positive">Positive 24h</option>
  <option value="negative">Negative 24h</option>
</select>
        </div>

        {/* Coin Cards */}
        <div className="px-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCoins.map((coin, index) => {
            const bgVariants = [
              "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
              "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
              "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
              "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
            ];
            const cardBg = bgVariants[index % bgVariants.length];

            return (
              <div
                key={coin.id}
                className={`rounded-2xl p-5 flex flex-col justify-between border transition-all duration-300 cursor-pointer backdrop-blur-xl 
                  ${cardBg}
                  ${
                    coin.price_change_percentage_24h > 0
                      ? "border-green-400"
                      : "border-red-400"
                  }
                  hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20`}
                onClick={() => setSelectedCoin(coin)}
              >
                {/* Top Section */}
                <div className="flex items-center gap-3 mb-4">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <p className="font-semibold text-white">{coin.name}</p>
                    <p className="text-xs text-gray-300">
                      {coin.symbol.toUpperCase()}
                    </p>
                  </div>
                  
                </div>

                {/* Price & Change */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-lg font-bold text-white">
                    ${coin.current_price.toLocaleString()}
                  </p>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-lg ${
                      coin.price_change_percentage_24h > 0
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {coin.price_change_percentage_24h > 0 ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>

                {/* Sparkline */}
                {coin.sparkline_in_7d && (
                  <div className="h-12">
                    <Sparklines data={coin.sparkline_in_7d.price} limit={20}>
                      <SparklinesLine
                        color={
                          coin.price_change_percentage_24h > 0 ? "lime" : "red"
                        }
                      />
                    </Sparklines>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Chart */}
      <Modal isOpen={!!selectedCoin} onClose={() => setSelectedCoin(null)}>
        {selectedCoin && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-200">
              {selectedCoin.name} Price Trend (7 Days)
            </h2>
            <CoinChart coinId={selectedCoin.id} />
          </>
        )}
      </Modal>
    </div>
  );
}
