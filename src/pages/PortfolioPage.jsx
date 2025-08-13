import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setHolding, removeHolding } from '../features/portfolio/portfolioSlice'
import { fetchTopCoins } from '../features/coins/coinsThunks'
import Navbar from '../components/Navbar'

export default function PortfolioPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Fetch coins initially
    dispatch(fetchTopCoins())

    // Auto-refresh every 30s
    const interval = setInterval(() => {
      dispatch(fetchTopCoins())
    }, 30000)

    return () => clearInterval(interval) // Cleanup
  }, [dispatch])

  const coins = useAppSelector((state) => Object.values(state.coins.entities))
  const holdings = useAppSelector((state) => state.portfolio.holdings)

  const { totalValue, totalChange } = useMemo(() => {
    let value = 0
    let change = 0
    coins.forEach((coin) => {
      const amount = holdings[coin.id] || 0
      const coinValue = amount * coin.current_price
      const coinChange = (coin.price_change_percentage_24h / 100) * coinValue
      value += coinValue
      change += coinChange
    })
    const changePercent = value ? (change / value) * 100 : 0
    return { totalValue: value, totalChange: changePercent }
  }, [coins, holdings])

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <Navbar/>
      <h1 className="text-3xl font-bold mb-6 text-center">My Portfolio</h1>

      {/* Summary */}
      <div className="mb-6 flex gap-6 justify-center">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p>Total Value</p>
          <p className="text-2xl font-bold">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p>24h Change</p>
          <p
            className={`text-2xl font-bold ${
              totalChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {totalChange.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-900">
              <th className="px-4 py-3 text-left">Coin</th>
              <th className="px-4 py-3 text-right">Price (USD)</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Value (USD)</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const amount = holdings[coin.id] || 0
              return (
                <tr key={coin.id} className="border-b border-gray-200">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                    {coin.name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${coin.current_price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={amount}
                      min="0"
                      step="any"
                      onChange={(e) =>
                        dispatch(
                          setHolding({
                            coinId: coin.id,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        )
                      }
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${(amount * coin.current_price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => dispatch(removeHolding(coin.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
