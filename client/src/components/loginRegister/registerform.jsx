import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye } from 'lucide-react';
import axios from "axios";


const RegisterForm=()=>{
 const navigate= useNavigate();//hook in react

    const handleLogin=()=>{
      navigate("/login");
    }

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [showFlag,setShowFlag]=useState(false);
    const [paswdFlag,setPaswdFlag]=useState(false);
  const handleShowPass=(e)=>{
    e.preventDefault();
    setShowFlag(!showFlag);
    
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if(password!==confirmPassword){
   setPaswdFlag(!paswdFlag);
  }
  //Axios is a JavaScript library (a helper tool) that makes it easy to send HTTP 
  // requests from your frontend (browser) to your backend (server).

  /*Is this related to React Router /register?
Not directly, but it’s common to use the same naming for clarity.
React Router /register is the frontend page URL — the URL your user visits to see the registration form.
Backend /register is the API endpoint — where the frontend sends registration data.
 */
  else{
  if(password=="" && email=="" && username=="" && confirmPassword==""){

  }

  else{
  axios.post('http://localhost:3001/register', { username,email,password })
    .then((result) => {
      localStorage.setItem("username",result.data.username);
      navigate("/home");  // Navigate only after successful registration
    })
    .catch((err) => {
      console.log(err);
    });
  }}
};

    /*Why pevent default??
    Answer) It prevents the default behavior of the event from happening.
    Normally, when a form is submitted, the page reloads. That’s the browser's default behavior for forms.
    You want to handle the form data with JavaScript (e.g., send it to a server using fetch() 
     or update the UI), without reloading the page.It gives you full control over what happens 
     next after the user submits the form. */

  return (
    <div className="p-[20px]  w-1/2 h-full flex flex-col justify-center items-center bg-inherit text-black max-mobXL:h-full max-mobXL:w-full
    bg-white max-mobXL:rounded-t-[50px]">
      <p className="max-mobXL:text-[2rem] max-mobXL:pb-[20px] max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold inter">Register</p>
      <div className="w-full max-w-[450px]">
      <form onSubmit={handleSubmit} className="flex flex-col w-full items-center">
        
        <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label className="lato">enter your first name:</label>
            <input
             type="text"
             placeholder="e.g jack" name="username"
             className="lato max-mobXL:mt-[0px] py-[5px] text-[1rem] w-full p-[2px] px-[5px] mt-[2px] rounded-lg border-[2px] bg-white border-gray-300 text-black outline-none focus:outline-none"
             onChange={(e)=>{setUsername(e.target.value)}}
             required
             />
        </div>
        
         <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label className="lato">enter email:</label>
            <input
             type="email"
             placeholder="e.g jack@gmail.com" name="email"
             className="lato  max-mobXL:mt-[0px] py-[5px] text-[1rem] w-full p-[2px] px-[5px] mt-[2px] rounded-lg border-[2px] bg-white border-gray-300 text-black outline-none focus:outline-none"
             onChange={(e)=>{setEmail(e.target.value)}}
             required
             />
        </div>

        <div className="max-mobL:text-[.9rem] mb-[10px] w-full ">
              <label className="lato">enter password:</label>
               <div className= {(paswdFlag)?"flex border-[2px] border-red-500 bg-white p-[2px] pl-[5px] rounded-lg":"flex border-[2px] bg-white border-gray-300 p-[2px] pl-[5px] rounded-lg"}>
              <input
               type={(showFlag)?"text":"password"}
               name="password"
               placeholder="Password"
               className="lato w-full bg-white py-[5px] text-[1rem] text-black outline-none focus:outline-none"
               onChange={(e)=>{setPassword(e.target.value)}}
               required
              />
              <button className="w-[30px] text-gray-500"onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
        </div>

        <div className="max-mobL:text-[.9rem] mb-[20px] w-full ">
              <label className="lato">confirm password:</label>
               <div className= {(paswdFlag)?"flex border-[2px] border-red-500  bg-white  p-[2px] pl-[5px] rounded-lg":"flex border-[2px] bg-white border-gray-300 p-[2px] pl-[5px] rounded-lg"}>
              <input
               type={(showFlag)?"text":"password"}
               name="password"
               placeholder="Password"
               className="lato w-full bg-wihte text-black text-[1rem] py-[5px] outline-none focus:outline-none"
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
              required
              />
              <button className="w-[30px] text-gray-500"onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
              {(paswdFlag)?<p className="text-[0.9rem] text-red-500 font-medium">Passwords do not match</p>:<p className="text-[0.7rem] hidden text-red-500 font-medium">Passwords do not match</p>}
        </div>    

        <button  type="submit" className="lato w-full py-[7px] text-[1.5rem] rounded-full bg-accent1 text-white max-mobXL:text-[1.2rem] font-bold transition-colors duration-200 hover:bg-accent0">
          Register
        </button>

        <p className="lato mt-[10px] w-full text-center text-gray-500 max-mobL:text-[0.9rem] ">already have an account? <button onClick={handleLogin} className="text-accent1 hover:text-accent1">Login</button></p>
      </form>
      </div>
    </div>
  );
};

export default RegisterForm;