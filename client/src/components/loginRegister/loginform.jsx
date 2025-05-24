import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { Eye,EyeOff } from 'lucide-react';
import axios from "axios";

const LoginForm=() => {
   const [email,setEmail]=useState("");
   const [password,setPassword]=useState("");

  const navigate= useNavigate();//hook in react

  const handleLogin=(e)=>{
      e.preventDefault();
      axios.post("http://localhost:3001/login", { email, password })
      .then(result => {
      console.log(result)
      if(result.data==="Success"){
        navigate('/home');
      }
      else if(result.data==="password Incorrect"){
        alert("wrong password");
      }
      else if(result.data==="no such record exists"){
         alert("no such record");
      }
      })
      .catch((err) => {
        console.error(err);
        alert("Login failed");
      });
    };


    //If no account login
    const handleRegister=()=>{
      navigate("/register");
    }

    //show password
    const [showFlag,setShowFlag]=useState(false);
    const handleShowPass=(e)=>{
        e.preventDefault();
        setShowFlag(!showFlag);
      };
    

  return (
    <div className="pl-[20px]  w-1/2 h-full flex flex-col justify-center items-center bg-inherit text-black max-mobXL:h-[70%] max-mobXL:w-full  max-mobXL:p-0">
      <p className="max-mobXL:text-[2rem] max-mobXL:font-thin max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold ">Login</p>
      <form onSubmit={handleLogin} className="flex flex-col justify-center w-full max-w-sm space-y-7 max-mobXL:space-y-3">
        <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label>enter email:</label>
            <input
             type="email"
             placeholder="e.g jack@gmail.com" name="email"
             className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-[2px] px-[10px] mt-[2px] rounded border-[2px] border-gray-400 bg-gray-300 text-black outline-none focus:outline-none"
             onChange={(e)=>{setEmail(e.target.value)}}
             required
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
               onChange={(e)=>{setPassword(e.target.value)}}
               required
              />
              <button className="w-[30px] text-gray-500" onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
        </div>


        <button type="submit" className="max-mobXL:py-2 w-full py-3 bg-gray-600 text-white text-[1rem] font-bold transition-colors duration-200 hover:bg-mainBlue rounded">
          Login
        </button>

        <p className="w-full text-center text-gray-500 max-mobL:text-[0.7rem] ">don't have an account? <button onClick={handleRegister} className="text-mainBlue hover:text-mainBlue">Register</button></p>
      </form>
    </div>
  );
};

export default LoginForm;
