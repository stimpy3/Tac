import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye } from 'lucide-react';
import axios from "axios";


const RegisterForm=()=>{
 const navigate= useNavigate();//hook in react
    const handleRegister=()=>{
      navigate("/home");
    };

    const handleLogin=()=>{
      navigate("/");
    }

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showFlag,setShowFlag]=useState(false);
  const handleShowPass=(e)=>{
    e.preventDefault();
    setShowFlag(!showFlag);
    
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  //Axios is a JavaScript library (a helper tool) that makes it easy to send HTTP 
  // requests from your frontend (browser) to your backend (server).

  /*Is this related to React Router /register?
Not directly, but it’s common to use the same naming for clarity.
React Router /register is the frontend page URL — the URL your user visits to see the registration form.
Backend /register is the API endpoint — where the frontend sends registration data.
 */
  axios.post('http://localhost:3001/register', { username, password })
    .then((result) => {
      localStorage.setItem("username",result.data.username);
      navigate("/home");  // Navigate only after successful registration
    })
    .catch((err) => {
      console.log(err);
    });
};

    /*Why pevent default??
    Answer) It prevents the default behavior of the event from happening.
    Normally, when a form is submitted, the page reloads. That’s the browser's default behavior for forms.
    You want to handle the form data with JavaScript (e.g., send it to a server using fetch() 
     or update the UI), without reloading the page.It gives you full control over what happens 
     next after the user submits the form. */

  return (
    <div className="pl-[20px]  w-1/2 h-full flex flex-col justify-center items-center bg-inherit text-black max-mobXL:h-[60%] max-mobXL:w-full  max-mobXL:p-0">
      <p className="max-mobXL:hidden max-mobXL:font-thin max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold ">Register</p>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm items-center">
        
        <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label>enter your first name:</label>
            <input
             type="text"
             placeholder="e.g jack" name="username"
             className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-[2px] px-[5px] mt-[2px] rounded border-[2px] border-gray-400 bg-gray-300 text-black outline-none focus:outline-none"
             onChange={(e)=>{setUsername(e.target.value)}}
             />
        </div>
        
         <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label>enter email:</label>
            <input
             type="email"
             placeholder="e.g john@gmail.com" name="email"
             className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-[2px] px-[5px] mt-[2px] rounded border-[2px] border-gray-400 bg-gray-300 text-black outline-none focus:outline-none"
             onChange={(e)=>{setEmail(e.target.value)}}
             />
        </div>

        <div className="max-mobL:text-[.9rem] mb-[10px] w-full ">
              <label>enter password:</label>
               <div className="flex border-[2px] border-gray-400  bg-gray-300  p-[2px] pl-[5px] rounded">
              <input
               type={(showFlag)?"text":"password"}
               name="password"
               placeholder="Password"
               className="w-full bg-gray-300 text-black outline-none focus:outline-none"
               onChange={(e)=>{setPassword(e.target.value)}}
              />
              <button className="w-[30px] text-gray-500"onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
        </div>

        <div className="max-mobL:text-[.9rem] mb-[10px] w-full ">
              <label>confirm password:</label>
               <div className="flex border-[2px] border-gray-400  bg-gray-300  p-[2px] pl-[5px] rounded">
              <input
               type={(showFlag)?"text":"password"}
               name="password"
               placeholder="Password"
               className="w-full bg-gray-300 text-black outline-none focus:outline-none"
              />
              <button className="w-[30px] text-gray-500"onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
        </div>

        <button  type="submit" className="max-mobXL:py-2 mb-[10px] w-full py-3 bg-gray-600 text-white text-[1rem] font-bold transition-colors duration-200 hover:bg-mainBlue rounded">
          Register
        </button>

        <p className="w-full text-center text-gray-500 max-mobL:text-[0.7rem] ">already have an account? <button onClick={handleLogin} className="text-mainBlue hover:text-mainBlue">Login</button></p>
      </form>
    </div>
  );
};

export default RegisterForm;