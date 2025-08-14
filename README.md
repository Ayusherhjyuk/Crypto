# 🚀 Crypto Portfolio Dashboard

**Live Demo:** [https://crypto-silk.vercel.app/](https://crypto-silk.vercel.app/)

## 📌 Overview
The **Crypto Portfolio Dashboard** is a responsive and interactive web application built with **React.js** and **Redux Toolkit**.  
It fetches live cryptocurrency market data from the [CoinGecko API](https://www.coingecko.com/en/api) and provides tools to monitor market trends, prices, and your personal portfolio.

---

## ✨ Features

### **1. Dashboard**
- Displays cryptocurrency market data with:
  - Name, Symbol, Logo
  - Current Price (USD)
  - 24h % Change
  - Market Cap
  - 7-day Sparkline Chart
- Data refreshes automatically every **30 seconds**.
- Click a coin to view a modal with a detailed 7-day price chart.

### **2. Search & Filter**
- Search coins by **name** or **symbol**.
- Apply filters:
  - **Top 10** / **Top 50** by market cap
  - **Positive** or **Negative** price change in the last 24h
- Search & filter settings are stored in Redux, so they persist.

### **3. Portfolio Management**
- Enter the amount of each coin you own.
- Displays:
  - **Total portfolio value**
  - **24h change** in portfolio value
- Portfolio values update automatically when prices refresh.

### **4. Real-Time Updates**
- Prices update automatically every **30 seconds** via Redux async actions.
- Optimized for performance with `React.memo` and `useCallback`.

---

## 🛠 Tech Stack
- **React.js** (Functional Components + Hooks)
- **Redux Toolkit**
  - `createSlice`
  - `createAsyncThunk` for API calls
- **React Router** for routing
- **Tailwind CSS** for styling
- **react-sparklines** for sparkline charts
- **Heroicons** for up/down icons
- **CoinGecko API** for crypto market data

---
## 🔄 API Usage
-GET https://api.coingecko.com/api/v3/coins/markets

---

## 📦 Installation & Setup
```bash
git clone https://github.com/yourusername/crypto-portfolio.git
cd crypto-portfolio
npm install
npm run dev
npm run build

