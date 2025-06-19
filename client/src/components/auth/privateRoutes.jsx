import React from "react";
import { Navigate } from "react-router-dom";
//children is our prop
//children is a keyword , its like a prop, you dont need to pass it from parent to access elsewhere
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("user"); // to check if person is logged (if user obj empty its logged out)
  return (user ? children : <Navigate to="/login" />);
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