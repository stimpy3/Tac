import React from 'react';
import { useNavigate } from "react-router-dom";

const TopSection=()=>{
    const navigate=useNavigate();
    const loginRedirect=()=>{
            navigate("/login");
        };

    const registerRedirect=()=>{
            navigate("/register");
        };

    return(
        
        <div className="flex w-full h-[40px] fixed bg-gray-500">
            <button onClick={loginRedirect}>Login</button>
            <button onClick={registerRedirect}>Signup</button>
        </div>
    );
};
export default TopSection;