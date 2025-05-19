import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
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
    const [password,setPassword]=useState("");

    
    const handleSubmit = (e) => {
  e.preventDefault();
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
      <p className="max-mobXL:text-[2rem] max-mobXL:font-thin max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold ">Register</p>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full max-w-sm space-y-7 max-mobXL:space-y-3">
        <div className="max-mobL:text-[.9rem]">
            <label>enter username:</label>
            <input
             type="text"
             placeholder="e.g john spink" name="username"
             className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-2 mt-[5px] rounded border-[2px] border-gray-400 bg-gray-200 text-black outline-none focus:outline-none"
             onChange={(e)=>{setUsername(e.target.value)}}
             />
        </div>

        <div className="max-mobL:text-[.9rem]">
              <label>enter password:</label>
              <input
               type="password" name="password"
               placeholder="Password"
               className="max-mobXL:p-1 max-mobXL:mt-[0px] w-full p-2 mt-[5px] rounded border-[2px] border-gray-400 bg-gray-200 text-black outline-none focus:outline-none"
               onChange={(e)=>{setPassword(e.target.value)}}
              />
        </div>

        <button  type="submit" className="max-mobXL:py-2 w-full py-3 bg-gray-600 text-white text-[1rem] font-bold transition-colors duration-200 hover:bg-mainBlue rounded">
          Register
        </button>

        <p className="w-full text-center text-gray-500 max-mobL:text-[0.7rem] ">already have an account? <button onClick={handleLogin} className="text-mainBlue hover:text-mainBlue">Login</button></p>
      </form>
    </div>
  );
};

export default RegisterForm;