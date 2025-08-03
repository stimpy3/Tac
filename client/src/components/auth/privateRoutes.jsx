import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, verifyToken } from "../../utils/auth";
import LoadingSpinner from "../LoadingSpinner";
//children is our prop
//children is a keyword , its like a prop, you dont need to pass it from parent to access elsewhere
const PrivateRoute = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // First check if token exists and is valid format
      if (!isAuthenticated()) {
        // If no token or invalid format, redirect immediately
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      // If token exists and looks valid, verify with server
      try {
        const isValid = await verifyToken();
        setIsValidToken(isValid);
      } catch (error) {
        console.error('Token verification error:', error);
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="medium" />;
  }

  return isValidToken ? children : <Navigate to="/login" />;
};
/*
  <Route path="/home" element={
  <PrivateRoute>
    <HomePage />
  </PrivateRoute>
  }/>

  Then: children = <HomePage />, If the user is logged in: it renders <HomePage />
                                 If not: it redirects to /
*/
export default PrivateRoute;

/*Navigate vs useNavigate
------------------------------------------------------------------------------------------------------------------
|             |              useNavigate                |              	Navigate                                 |
--------------|-----------------------------------------|--------------------------------------------------------|
|What it is	  |     A hook	                            |  A component                                           |
--------------|-----------------------------------------|--------------------------------------------------------|
| Use when    |     You want to redirect using JS logic |  You want to redirect immediately during rendering     |
|             |     inside a function (like onClick)    |	                                                     |
--------------|-----------------------------------------|--------------------------------------------------------|
| Returns     |    A function (you call like            | JSX that triggers navigation when rendered             |
|             |     navigate("/home"))                  |                                                        |
------------------------------------------------------------------------------------------------------------------
*/