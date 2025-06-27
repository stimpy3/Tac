import React,{useState,useEffect} from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';//oauth
import LoginPage from "./components/loginRegister/loginpage.jsx";
import HomePage from "./components/home/homePage.jsx";
import RegisterPage from "./components/loginRegister/registerpage.jsx";
import LandingPage from "./components/landingPage/landingpage.jsx";
import TimeTable from "./components/timeTable/timeTable.jsx";
import PrivateRoute from "./components/auth/privateRoutes.jsx"; //Import it for protection
import { DarkModeProvider } from "./darkModeContext.jsx"; //context useContext

function App() {
  
  return ( 
    //useGoogleLogin(...) hook can be used anywhere
    //or any other Google OAuth functionality — because those rely on having the OAuth context initialized.
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <DarkModeProvider> {/*context useContext*/}
    <Router>
      <Routes>
         <Route path="/" element={<LandingPage/>}/>
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/register" element={<RegisterPage/>}/> 
         <Route path="/home" element={
              <PrivateRoute>
                 <HomePage />
              </PrivateRoute>
         }/>
         <Route path="/timetable" element={
              <PrivateRoute>
                 <TimeTable />
              </PrivateRoute>
         }/> 
       </Routes>
    </Router>
    </DarkModeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
