import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setHolding, removeHolding } from "../features/portfolio/portfolioSlice";
import { fetchTopCoins } from "../features/coins/coinsThunks";
import { setSearch, setFilter } from "../features/ui/uiSlice";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import CoinChart from "../components/CoinChart";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function PortfolioPage() {
  const dispatch = useAppDispatch();
  const { search, filter } = useAppSelector((state) => state.ui);
  const coins = useAppSelector((state) => Object.values(state.coins.entities));
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const coinsState = useAppSelector((state) => state.coins);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    dispatch(fetchTopCoins());
    const interval = setInterval(() => {
      dispatch(fetchTopCoins());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const { totalValue, totalChange } = useMemo(() => {
    let value = 0;
    let change = 0;
    coins.forEach((coin) => {
      const amount = holdings[coin.id] || 0;
      const coinValue = amount * coin.current_price;
      const coinChange = (coin.price_change_percentage_24h / 100) * coinValue;
      value += coinValue;
      change += coinChange;
    });
    const changePercent = value ? (change / value) * 100 : 0;
    return { totalValue: value, totalChange: changePercent };
  }, [coins, holdings]);

  const filteredHoldings = useMemo(() => {
    let list = coins.filter((coin) => holdings[coin.id]);
    if (filter.change === "positive") {
      list = list.filter((c) => c.price_change_percentage_24h > 0);
    } else if (filter.change === "negative") {
      list = list.filter((c) => c.price_change_percentage_24h < 0);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.symbol.toLowerCase().includes(s)
      );
    }
    return list;
  }, [coins, holdings, search, filter]);

  if (coinsState.status === "loading")
    return <p className="text-blue-500 text-xl p-4">Loading...</p>;
  if (coinsState.error)
    return <p className="text-red-500 p-4">Error: {coinsState.error}</p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <div className="absolute inset-0 bg-[url('/crypto-pattern.png')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <div className="text-center py-12 px-4">
          <h1 className="text-5xl font-extrabold text-white mb-4">📊 My Portfolio</h1>
          <p className="text-gray-300 italic text-lg">
            Tracking your assets in style.
          </p>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="bg-white/10 px-6 py-4 rounded-xl shadow-lg text-center">
            <p className="text-gray-300">Total Value</p>
            <p className="text-3xl font-bold text-white">
              ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-xl shadow-lg text-center">
            <p className="text-gray-300">24h Change</p>
            <p
              className={`text-3xl font-bold flex items-center justify-center gap-2 ${
                totalChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {totalChange >= 0 ? (
                <ArrowTrendingUpIcon className="w-6 h-6" />
              ) : (
                <ArrowTrendingDownIcon className="w-6 h-6" />
              )}
              {totalChange.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="sticky top-0 z-20 flex flex-wrap gap-4 justify-center mb-6 p-4 backdrop-blur-lg rounded-2xl shadow-lg shadow-pink-500/30">
          <input
            type="text"
            placeholder="🔍 Search holdings..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="px-4 py-2 w-64 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-pink-500"
          />
          <select
            value={filter.change}
            onChange={(e) => dispatch(setFilter({ change: e.target.value }))}
            className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/30 focus:ring-2 focus:ring-indigo-500
                       [&>option]:bg-gray-900 [&>option]:text-white"
          >
            <option value="all">All Changes</option>
            <option value="positive">Positive 24h</option>
            <option value="negative">Negative 24h</option>
          </select>
        </div>

        {/* Holdings Cards */}
        <div className="px-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHoldings.map((coin) => {
            const amount = holdings[coin.id];
            return (
              <div
                key={coin.id}
                className={`rounded-2xl p-5 flex flex-col justify-between border backdrop-blur-xl transition-all duration-300 cursor-pointer 
                  ${coin.price_change_percentage_24h > 0 ? "border-green-400" : "border-red-400"} hover:scale-105 hover:shadow-xl`}
                onClick={() => setSelectedCoin(coin)}
              >
                {/* Coin Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <p className="font-semibold">{coin.name}</p>
                    <p className="text-xs text-gray-300">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>

                {/* Price & Change */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-lg font-bold">${coin.current_price.toLocaleString()}</p>
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
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>

                {/* Amount */}
                <div className="mb-3">
                  <label className="text-xs text-gray-400">Amount Held</label>
                  <input
                    type="number"
                    value={amount}
                    min="0"
                    step="any"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      dispatch(
                        setHolding({
                          coinId: coin.id,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      )
                    }
                    className="w-full mt-1 px-2 py-1 border rounded bg-white/10 border-white/30 text-white"
                  />
                </div>

                {/* Value */}
                <p className="text-sm text-gray-300">
                  Value: $
                  {(amount * coin.current_price).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>

                {/* Sparkline */}
                {coin.sparkline_in_7d && (
                  <div className="h-12 mt-3">
                    <Sparklines data={coin.sparkline_in_7d.price} limit={20}>
                      <SparklinesLine
                        color={coin.price_change_percentage_24h > 0 ? "lime" : "red"}
                      />
                    </Sparklines>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeHolding(coin.id));
                  }}
                  className="mt-4 flex items-center justify-center gap-1 px-3 py-1 text-red-400 border border-red-400 rounded hover:bg-red-400/20"
                >
                  <TrashIcon className="w-4 h-4" /> Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* All Coins Section */}
        <div className="mt-16 px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">🌐 All Coins</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coins
              .filter((coin) => !holdings[coin.id]) // exclude coins already in portfolio
              .map((coin) => (
                <div
                  key={coin.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between border backdrop-blur-xl transition-all duration-300 cursor-pointer 
                    ${coin.price_change_percentage_24h > 0 ? "border-green-400" : "border-red-400"} hover:scale-105 hover:shadow-xl`}
                  onClick={() => setSelectedCoin(coin)}
                >
                  {/* Coin Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                    <div>
                      <p className="font-semibold">{coin.name}</p>
                      <p className="text-xs text-gray-300">{coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-lg font-bold">${coin.current_price.toLocaleString()}</p>
                    <span
                      className={`flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-lg ${
                        coin.price_change_percentage_24h > 0
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {coin.price_change_percentage_24h > 0 ? "↑" : "↓"}{" "}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setHolding({ coinId: coin.id, amount: 1 }));
                    }}
                    className="mt-4 px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-lg"
                  >
                    ➕ Add to Portfolio
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal for Chart */}
      <Modal isOpen={!!selectedCoin} onClose={() => setSelectedCoin(null)}>
        {selectedCoin && (
          <>
            <h2 className="text-xl font-bold mb-4">{selectedCoin.name} Price Trend</h2>
            <CoinChart coinId={selectedCoin.id} />
          </>
        )}
      </Modal>
    </div>
  );
}
