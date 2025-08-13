import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
  timeout: 15000,
})
