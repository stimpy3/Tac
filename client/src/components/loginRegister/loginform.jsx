import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { Eye,EyeOff } from 'lucide-react';

const LoginForm=() => {

  const navigate= useNavigate();//hook in react
    const handleLogin=()=>{
      e.preventDefault();
      navigate("/home");
    };

    const handleRegister=()=>{
      navigate("/register");
    }

    const [showFlag,setShowFlag]=useState(false);
    const handleShowPass=(e)=>{
        e.preventDefault();
        setShowFlag(!showFlag);
      };
    

  return (
    <div className="pl-[20px]  w-1/2 h-full flex flex-col justify-center items-center bg-inherit text-black max-mobXL:h-[70%] max-mobXL:w-full  max-mobXL:p-0">
      <p className="max-mobXL:text-[2rem] max-mobXL:font-thin max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold ">Login</p>
      <form className="flex flex-col justify-center w-full max-w-sm space-y-7 max-mobXL:space-y-3">
        <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label>enter username / email:</label>
            <input
             type="text"
             placeholder="e.g jack" name="username"
             className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-[2px] px-[5px] mt-[2px] rounded border-[2px] border-gray-400 bg-gray-300 text-black outline-none focus:outline-none"
             />
        </div>

        <div className="max-mobL:text-[.9rem]">
              <label>enter password:</label>
               <div className="flex border-[2px] border-gray-400  bg-gray-300 rounded ">
              <input
               type={(showFlag)?"text":"password"}
               name="password"
               placeholder="Password"
               className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-[2px] px-[10px] bg-gray-300 text-black outline-none focus:outline-none"
              />
              <button className="w-[30px] text-gray-500" onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
        </div>


        <button onClick={handleLogin} className="max-mobXL:py-2 w-full py-3 bg-gray-600 text-white text-[1rem] font-bold transition-colors duration-200 hover:bg-mainBlue rounded">
          Login
        </button>

        <p className="w-full text-center text-gray-500 max-mobL:text-[0.7rem] ">don't have an account? <button onClick={handleRegister} className="text-mainBlue hover:text-mainBlue">Register</button></p>
      </form>
    </div>
  );
};

export default LoginForm;
