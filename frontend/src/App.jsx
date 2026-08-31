import React from 'react'
import { router } from "./app.routes";
import { RouterProvider } from "react-router";
// import {AuthProvider} from "./context/auth.context.jsx"
function App() {
  return (
    // <AuthProvider>
      <RouterProvider router={router} />
    // </AuthProvider>
  )
}

export default App
