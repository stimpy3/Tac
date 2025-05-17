import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./components/loginRegister/loginpage.jsx";
import HomePage from "./components/home/homePage.jsx";
import RegisterPage from "./components/loginRegister/registerpage.jsx";

function App() {
  return ( 
    // <LoginPage/>
    <Router>
      <Routes>
         <Route path="/" element={<LoginPage/>}/>
         <Route path="/home" element={<HomePage/>}/>
         <Route path="/register" element={<RegisterPage/>}/>  
       </Routes>
    </Router>
  );
}

export default App;
