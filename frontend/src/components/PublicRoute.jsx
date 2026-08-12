import { Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuth.js";

const PublicRoute = ({ children }) => {
  const status = useAuthStatus();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "authenticated") return <Navigate to="/" replace />;
  return children;
};

export default PublicRoute;