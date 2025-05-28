import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./components/loginRegister/loginpage.jsx";
import HomePage from "./components/home/homePage.jsx";
import RegisterPage from "./components/loginRegister/registerpage.jsx";
import LandingPage from "./components/landingPage/landingpage.jsx";
import TimeTable from "./components/timeTable/timeTable.jsx";

function App() {
  return ( 
    // <LoginPage/>
    <Router>
      <Routes>
         <Route path="/" element={<LandingPage/>}/>
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/register" element={<RegisterPage/>}/> 
         <Route path="/home" element={<HomePage/>}/>
         <Route path="/timetable" element={<TimeTable/>}/>  
       </Routes>
    </Router>
  );
}

export default App;
