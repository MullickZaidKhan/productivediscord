import { Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuth.js";
import AppSkeleton from './ui/AppSkeleton.jsx'
const PublicRoute = ({ children }) => {
  const status = useAuthStatus();

  if (status === "loading") return <AppSkeleton/>;
  if (status === "authenticated") return <Navigate to="/" replace />;
  return children;
};

export default PublicRoute;