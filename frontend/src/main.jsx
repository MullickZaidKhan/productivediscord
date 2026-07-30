import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { authstor } from "./redux/authstor.js";
import './index.css'
import App from './App.jsx'

export const queryClient = new QueryClient({})

createRoot(document.getElementById('root')).render(

  <QueryClientProvider client={queryClient}>
    <Provider store={authstor}>
      <App />
    </Provider>

  </QueryClientProvider>
)
