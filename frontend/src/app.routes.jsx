import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import RootLayout from "./components/layout/RootLayout.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Chat from "./components/chat/Chat.jsx";
import ServerPage from "./components/server_discord/serverpage.jsx";
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Chat />,
          },
          {
            path: "Online",
            element: <Chat />,
          },
          {
            path: "All",
            element: <Chat />,
          },
          {
            path: "Add_Friend",
            element: <Chat />,
          },
          {
            path: "Pending",
            element: <Chat />,
          },
          {
            path: "channels/@me/:userId",
            element: <Chat />,
          },
          {
            path: "servers/:serverId",
            element: <ServerPage />,
          },
        ],
      },

      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
    ],
  },
]);
