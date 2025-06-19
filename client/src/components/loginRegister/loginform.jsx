import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { Eye,EyeOff } from 'lucide-react';
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google"; //oauth
import { jwtDecode } from "jwt-decode"; //to extract user info like emil pfp etc, GOTTA DO THIS IN LOGIN /REGISTER PAGE
//NOT IN HOMEPAGE -REASON(EXPLORE LATER)

const LoginForm=() => {
  //npm install @react-oauth/google needed to be done in client folder
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
/*WHEN NOT TO USE LOCAL STORAGE
Access Token	Can be used to access a user's private Google data
Refresh Token	Can get new access tokens, long-lived, very sensitive
Passwords	Obvious risk — never store these client-side
API Keys (unprotected)	If they access backend services or databases
*/


  //ACCESS TOKEN 
  /*
    🔐 What is an Access Token?
    -An access token is a short-lived credential issued by an authentication server (like Google)
     that authorizes a user to access protected resources (APIs, user data, etc.). It typically:
    -Has an expiry (like 1 hour)

Is a bearer token — whoever holds it, can use it
   ⚠️ If It Falls in the Wrong Hands:
    -An attacker who gets your token can:
    -Impersonate you on APIs (like Google Drive, Gmail, YouTube)
    -Steal private user data
    -Cause data loss or corruption if write access is allowed
    -Bypass login if your app accepts the token without check
   */


//google login and accessing info and storing it
const loginWithGoogle = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    //async makes the function capable of using await.
    //await pauses the code until the Google API sends back user data.
    //So Google gives your app a tokenResponse object when login succeeds.
    try {
      // Use the access token to fetch profile info
      const res = await axios.get( //This makes a GET request to Google’s User Info API and waits for response
       //axios.get(url, config) syntax...url: The endpoint config:(Optional) An object for headers, params, etc.
        'https://www.googleapis.com/oauth2/v3/userinfo', //This is the URL Google provides to get user profile info using the token.
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            //Google requires a Bearer token in the request header to prove you’re authorized.
          },
        }
      );

       /* Sample res.data will look like: 
        {
          "sub": "1058...",
          "name": "Sohan Bhadalkar",
          "given_name": "Sohan",
          "family_name": "Bhadalkar",
          "picture": "https://lh3.googleusercontent.com/a/...",
          "email": "sohanbhadalkar@gmail.com",
          "email_verified": true,
          "locale": "en"
        } 
          
      ✅ Only storing public info not entire res.data, as it might contain access tokens etc
      need to pevent XXS attacks
        */
      const { name, email, picture }=res.data;

      // ✅ Clean old auth info first
      localStorage.removeItem("user");
      localStorage.removeItem("username"); // if you use this elsewhere
      localStorage.removeItem("useremail");

      // Store or use user info
      //JSON.stringify(...) is needed because localStorage only stores strings
      localStorage.setItem("user", JSON.stringify({ name, email, picture }));
      
      navigate("/home");
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      alert("Google login succeeded but fetching user data failed");
    }
  },
  onError: () => {
    alert("Google login failed");
  },
});

    

  return (
    <div className="bg-white p-[20px] w-1/2 h-full flex flex-col justify-evenly items-center  bg-inherit text-black max-mobXL:h-full max-mobXL:w-full
    max-mobXL:rounded-t-[50px]">
      <p className="inter max-mobXL:text-[2rem] max-mobXL:mb-0 text-[3rem] md:text-[4rem] mb-4 font-bold text-center ">Welcome Back</p>
      <div className="w-full max-w-[450px]">
      <form onSubmit={handleLogin} className="flex flex-col justify-center w-full">
        <div className="max-mobL:text-[.9rem] w-full mb-[10px] ">
            <label className="lato">enter email:</label>
            <input
             type="email"
             placeholder="e.g jack@gmail.com" name="email"
             className="lato  max-mobXL:mt-[0px]  w-full text-[1rem] py-[5px] p-[2px] px-[5px] mt-[2px] rounded-lg border-[2px] bg-white border-gray-300 text-black outline-none focus:outline-none"
             onChange={(e)=>{setEmail(e.target.value)}}
             required
             />
        </div>

        <div className="max-mobL:text-[.9rem] mb-[20px]">
              <label className="lato">enter password:</label>
               <div className="flex border-[2px] bg-white rounded-lg border-gray-300 ">
              <input
               type={(showFlag)?"text":"password"}
               name="password"
               placeholder="Password"
               className="lato max-mobXL:mt-[0px] text-[1rem] py-[5px] w-full p-[2px] px-[5px] bg-white text-black outline-none focus:outline-none"
               onChange={(e)=>{setPassword(e.target.value)}}
               required
              />
              <button className=" w-[30px] text-gray-300" onClick={handleShowPass}>{(showFlag)?<Eye/>:<EyeOff/>}</button>
              </div>
        </div>

        <div className="flex flex-col max-mobL:text-[.9rem] mb-[20px]">
          <section className="flex w-full h-fit items-center">
            <div className="h-[2px] w-full bg-gray-300"></div><p className="text-gray-400 text-[0.9rem]">&nbsp;&nbsp;OR&nbsp;&nbsp;</p><div className="h-[2px] w-full bg-gray-300"></div>
          </section>
          <div className="mt-[20px] w-full">
             <button type="button" onClick={loginWithGoogle} className="w-full border-[2px] border-gray-300 p-[5px] rounded-lg flex items-center justify-center text-[1.1rem]">
                <div className="bg-[url('/googleLogo.svg')] bg-contain bg-no-repeat h-[22px] aspect-square"></div>
                 &nbsp;&nbsp;&nbsp;Continue with Google
             </button>
          </div>
        </div>


        <button type="submit" className="rounded-lg lato w-full py-[5px] text-[1.2rem] bg-gradient-to-r from-accent0 via-accent1 to-accent0 text-white max-mobXL:text-[1.2rem] font-bold transition-colors duration-200">
          Login
        </button>

        <p className="lato w-full mt-[10px]  text-center text-gray-500 max-mobL:text-[0.9rem] ">don't have an account? <button onClick={handleRegister} className="text-accent1 hover:text-accent1">Register</button></p>
      </form>
      </div>
    </div>
  );
};

export default LoginForm;
