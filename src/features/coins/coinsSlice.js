import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchTopCoins } from './coinsThunks'

const coinsAdapter = createEntityAdapter({
  selectId: (coin) => coin.id,
  sortComparer: (a, b) => a.market_cap_rank - b.market_cap_rank,
})

const initialState = coinsAdapter.getInitialState({
  status: 'idle',
  error: null,
  lastUpdated: 0,
})

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopCoins.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTopCoins.fulfilled, (state, action) => {
        coinsAdapter.setAll(state, action.payload)
        state.status = 'succeeded'
        state.lastUpdated = Date.now()
      })
      .addCase(fetchTopCoins.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default coinsSlice.reducer
export const coinsSelectors = coinsAdapter.getSelectors((state) => state.coins)
