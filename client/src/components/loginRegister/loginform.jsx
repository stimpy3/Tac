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
    <div className="bg-white p-[15px] w-1/2 h-full flex flex-col justify-center items-center  bg-inherit text-black max-mobXL:h-full max-mobXL:w-full
    max-mobXL:rounded-t-[50px]">
      <p className="inter max-mobXL:text-[2rem] max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold ">Login</p>
      <form onSubmit={handleLogin} className="flex flex-col justify-center w-full max-w-sm space-y-7 max-mobXL:space-y-3">
        <div className="max-mobL:text-[.9rem] w-full">
            <label className="lato">enter email:</label>
            <input
             type="email"
             placeholder="e.g jack@gmail.com" name="email"
             className="lato max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-[2px] px-[10px] mt-[2px] rounded border-[2px] border-gray-300 bg-gray-100 text-black outline-none focus:outline-none"
             onChange={(e)=>{setEmail(e.target.value)}}
             required
             />
        </div>

        <div className="max-mobL:text-[.9rem] ">
              <label className="lato">enter password:</label>
               <div className="flex border-[2px] bg-gray-100 rounded border-gray-300 ">
              <input
               type={(showFlag)?"text":"password"}
               name="password"
               placeholder="Password"
               className="lato max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-[2px] px-[10px] bg-gray-100 text-black outline-none focus:outline-none"
               onChange={(e)=>{setPassword(e.target.value)}}
               required
              />
              <button className=" w-[30px] text-gray-500" onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
        </div>


        <button type="submit" className=" lato w-full py-[5px] text-[1.5rem] bg-accent1 text-white max-mobXL:text-[1.2rem] font-bold transition-colors duration-200 hover:bg-accent0 rounded">
          Login
        </button>

        <p className="lato w-full  text-center text-gray-500 max-mobL:text-[0.7rem] ">don't have an account? <button onClick={handleRegister} className="text-accent1 hover:text-accent1">Register</button></p>
      </form>
    </div>
  );
};

export default LoginForm;
