import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  holdings: {}, // { coinId: amount }
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setHolding(state, action) {
      const { coinId, amount } = action.payload
      state.holdings[coinId] = amount
    },
    removeHolding(state, action) {
      delete state.holdings[action.payload]
    },
  },
})

export const { setHolding, removeHolding } = portfolioSlice.actions
export default portfolioSlice.reducer
