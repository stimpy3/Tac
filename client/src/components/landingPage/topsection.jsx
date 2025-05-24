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
        
        <div className="flex items-center justify-between w-full h-[50px] fixed pl-[5px] pr-[15px]">
            <div data-label="logaContainer" className="flex min-w-[40px] h-[40px] bg-no-repeat bg-[url('/logo2.png')] bg-contain"></div>
            <div data-label="SignupLoginRedirectDiv" className="flex w-fit h-[40px]">
                <button className="w-[70px] text-white bg-black rounded mr-[10px] hover:translate-y-[5px] transition duration-300" onClick={loginRedirect}>Login</button>
                <button className="w-[70px] text-black border-[2px] border-black rounded hover:translate-y-[5px] transition duration-300" onClick={registerRedirect}>Signup</button>
            </div>
        </div>
    );
};
export default TopSection;