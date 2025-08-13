import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/coingecko'

export const fetchTopCoins = createAsyncThunk(
  'coins/fetchTop',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          price_change_percentage: '24h',
          sparkline: false,
        },
      })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)
