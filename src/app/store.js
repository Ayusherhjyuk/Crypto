import { configureStore } from '@reduxjs/toolkit'
import coinsReducer from '../features/coins/coinsSlice'
import uiReducer from '../features/ui/uiSlice'
import portfolioReducer from '../features/portfolio/portfolioSlice'
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    ui: uiReducer,
    portfolio: portfolioReducer,
    theme: themeReducer
  },
})
