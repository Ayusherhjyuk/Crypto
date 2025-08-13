// src/components/CoinChart.jsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CoinChart({ coinId = "bitcoin" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`
      );
      const json = await res.json();

      const chartData = json.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: Number(price.toFixed(2))
      }));

      setData(chartData);
    };

    fetchHistory();
  }, [coinId]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
        {coinId.toUpperCase()} Price Trend (7 Days)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
