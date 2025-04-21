import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm=()=>{
 const navigate= useNavigate();//hook in react
    const handleRegister=()=>{
      navigate("/home");
    };

    const handleLogin=()=>{
      navigate("/");
    }

  return (
    <div className="pl-[20px]  w-1/2 h-full flex flex-col justify-center items-center bg-inherit text-black max-mobXL:h-[60%] max-mobXL:w-full  max-mobXL:p-0">
      <p className="max-mobXL:text-[2rem] max-mobXL:font-thin max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold ">Register</p>
      <form className="flex flex-col justify-center w-full max-w-sm space-y-7 max-mobXL:space-y-3">
        <div className="max-mobL:text-[.9rem]">
            <label>enter username:</label>
            <input
             type="text"
             placeholder="e.g john spink"
             className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-2 mt-[5px] rounded border-[2px] border-gray-400 bg-gray-200 text-black outline-none focus:outline-none"
             />
        </div>

        <div className="max-mobL:text-[.9rem]">
              <label>enter password:</label>
              <input
               type="password"
               placeholder="Password"
               className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-2 mt-[5px] rounded border-[2px] border-gray-400 bg-gray-200 text-black outline-none focus:outline-none"
              />
        </div>

        <button onClick={handleRegister} className="max-mobXL:py-2 w-full py-3 bg-gray-600 text-white text-[1rem] font-bold transition-colors duration-200 hover:bg-mainBlue rounded">
          Register
        </button>

        <p className="w-full text-center text-gray-500 max-mobL:text-[0.7rem] ">already have an account? <button onClick={handleLogin} className="text-mainBlue hover:text-mainBlue">Login</button></p>
      </form>
    </div>
  );
};

export default RegisterForm;