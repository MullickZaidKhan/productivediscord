// components/ProtectedRoute.jsx
import React, { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/auth.context.jsx';
import { Navigate } from 'react-router-dom';
import { useAccessToken } from '../hooks/useAuth.js';
import { useSelector, useDispatch } from 'react-redux'
import { setLogin, setUser } from '../redux/authSlice.js'
import AppSkeleton from './ui/AppSkeleton.jsx'
function ProtectedRoute({ children }) {

  const dispatch = useDispatch();
  // 1. Call custom hook at top level



  const { data, isLoading, isError, error } = useAccessToken();

  console.log("Query State ->", { data, isLoading, isError, error });

  const login = useSelector((state) => state.authinfoSlice.login);
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);

  // 2. Sync fetched data into AuthContext safely AFTER render
  useEffect(() => {
    if (data && !isError) {
      dispatch(setLogin(true));
      dispatch(setUser(data));

    }
  }, [data, isError,dispatch]);


  // 2. Show a loading state while fetching the token/user state
  if (!login) {
    return <AppSkeleton />;
  }

  // 3. Check for authentication once loading is complete
  if (!login && !userinfo) {
    console.log("User is not authenticated. Redirecting to login page.");
    return <Navigate to="/login" replace />;
  }
  // 4. Render protected content if authenticated
  return <div>{children}</div>;
}

export default ProtectedRoute;