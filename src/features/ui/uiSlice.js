import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  search: '',
  filter: { tier: 'all', change: 'all' },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => { state.theme = action.payload },
    setSearch: (state, action) => { state.search = action.payload },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },
  },
})

export const { setTheme, setSearch, setFilter } = uiSlice.actions
export default uiSlice.reducer
