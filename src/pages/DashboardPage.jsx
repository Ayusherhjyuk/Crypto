import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchTopCoins } from '../features/coins/coinsThunks'
import { setSearch, setFilter } from '../features/ui/uiSlice'
import Navbar from '../components/Navbar'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { search, filter } = useAppSelector((state) => state.ui)
  const coinsState = useAppSelector((state) => state.coins)
  const coins = useAppSelector((state) =>
    Object.values(state.coins.entities)
  )

  useEffect(() => {
    dispatch(fetchTopCoins())
    const interval = setInterval(() => {
      dispatch(fetchTopCoins())
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch])

  const filteredCoins = useMemo(() => {
    let list = coins
    if (filter.tier === 'top10') {
      list = list.slice(0, 10)
    } else if (filter.tier === 'top50') {
      list = list.slice(0, 50)
    }
    if (filter.change === 'positive') {
      list = list.filter((c) => c.price_change_percentage_24h > 0)
    } else if (filter.change === 'negative') {
      list = list.filter((c) => c.price_change_percentage_24h < 0)
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase()
      list = list.filter(
        (c) => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s)
      )
    }
    return list
  }, [coins, search, filter])

  if (coinsState.status === 'loading')
    return <p className="text-blue-500 text-xl p-4">Loading...</p>
  if (coinsState.error)
    return <p className="text-red-500 p-4">Error: {coinsState.error}</p>

  return (
    <div>
    <Navbar/>
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Crypto Dashboard
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="px-4 py-2 border rounded-lg w-64 dark:bg-gray-800 dark:text-white"
        />
        <select
          value={filter.tier}
          onChange={(e) => dispatch(setFilter({ tier: e.target.value }))}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Coins</option>
          <option value="top10">Top 10</option>
          <option value="top50">Top 50</option>
        </select>
        <select
          value={filter.change}
          onChange={(e) => dispatch(setFilter({ change: e.target.value }))}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Changes</option>
          <option value="positive">Positive 24h</option>
          <option value="negative">Negative 24h</option>
        </select>
      </div>

      {/* Coins Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
              <th className="px-4 py-3 text-left">Coin</th>
              <th className="px-4 py-3 text-right">Price (USD)</th>
              <th className="px-4 py-3 text-right">24h %</th>
              <th className="px-4 py-3 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => (
              <tr
                key={coin.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {coin.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({coin.symbol.toUpperCase()})
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    coin.price_change_percentage_24h > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                  ${coin.market_cap.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}
