import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import AppRouter from './routes/AppRouter'
import './index.css'

function ThemeSync() {
  React.useEffect(() => {
    const root = document.documentElement;

    // Initial set on load
    const theme = store.getState().theme.mode;
    root.classList.toggle('dark', theme === 'dark');

    // Listen for changes in Redux store
    const unsubscribe = store.subscribe(() => {
      const theme = store.getState().theme.mode;
      root.classList.toggle('dark', theme === 'dark');
    });

    return () => unsubscribe();
  }, []);

  return null;
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeSync />
      <AppRouter />
    </Provider>
  </React.StrictMode>
)
