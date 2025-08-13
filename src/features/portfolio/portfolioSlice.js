import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if available
const savedHoldings = JSON.parse(localStorage.getItem("portfolioHoldings")) || {};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    holdings: savedHoldings
  },
  reducers: {
    setHolding: (state, action) => {
      const { coinId, amount } = action.payload;
      state.holdings[coinId] = amount;
      localStorage.setItem("portfolioHoldings", JSON.stringify(state.holdings));
    },
    removeHolding: (state, action) => {
      delete state.holdings[action.payload];
      localStorage.setItem("portfolioHoldings", JSON.stringify(state.holdings));
    },
  },
});

export const { setHolding, removeHolding } = portfolioSlice.actions;
export default portfolioSlice.reducer;
