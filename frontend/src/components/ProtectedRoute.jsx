// components/ProtectedRoute.jsx
import React, { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/auth.context.jsx';
import { Navigate } from 'react-router-dom';
import { useAccessToken } from '../hooks/useAuth.js';

function ProtectedRoute({ children }) {
  const { User, setUser } = useContext(AuthContext);

  // 1. Call custom hook at top level


  
      const { data, isLoading, isError, error } = useAccessToken();
      
      console.log("Query State ->", { data, isLoading, isError, error });

   

  // 2. Sync fetched data into AuthContext safely AFTER render
  useEffect(() => {
    if (data && !User && setUser) {
      setUser(data);
    }
  }, [data, User, setUser]);


  // 2. Show a loading state while fetching the token/user state
  if (isLoading) {
    return <div>Loading...</div>; // Or return a spinner
  }

  // 3. Check for authentication once loading is complete
  if (!User && !data) {
    console.log("User is not authenticated. Redirecting to login page.");
    return <Navigate to="/login" replace />;
  }
  // 4. Render protected content if authenticated
  return <div>{children}</div>;
}

export default ProtectedRoute;