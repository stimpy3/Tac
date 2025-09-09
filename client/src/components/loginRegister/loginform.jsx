import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { Eye,EyeOff } from 'lucide-react';
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google"; //oauth
import { jwtDecode } from "jwt-decode"; //to extract user info like emil pfp etc, GOTTA DO THIS IN LOGIN /REGISTER PAGE
import LoadingSpinner from "../LoadingSpinner";
//NOT IN HOMEPAGE -REASON(EXPLORE LATER)

const LoginForm=() => {
  //npm install @react-oauth/google needed to be done in client folder
   const [email,setEmail]=useState("");
   const [password,setPassword]=useState("");
   const [isLoading, setIsLoading] = useState(false);
   
  const navigate= useNavigate();//hook in react
  /*
  Why import.meta.env and not process.env?
   -In Node.js backend, you use process.env to get env vars.
   -In modern frontend setups using Vite, process.env isn’t available by default because
   frontend code runs in browsers, not Node.js.
   -So Vite provides import.meta.env as a safe way to inject env vars into your frontend bundle during build time.
   */
  /*
  Vite injecting env vars starting with VITE_
   -Vite is your frontend build tool. It takes your React code and turns it into stuff browsers can understand.
   -Env vars (environment variables) are like secret settings you don’t wanna hardcode in your code. Stuff like API URLs, keys, etc.
   -When you run vite build, Vite looks for env vars in your system or .env files.
   -But Vite only passes (injects) env vars starting with VITE_ into the frontend bundle — this means only variables like VITE_BACKEND_URL become visible to your React app code.
   */
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
  const handleLogin=(e)=>{
      e.preventDefault();
      setIsLoading(true);
      axios.post(`${BACKEND_URL}/login`, { email, password })
      .then(result => {
      console.log(result)
      if(result.data.message === "Login successful"){
        // Store JWT token and user data
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        navigate('/home');
      } else {
        alert(result.data.message || "Login failed");
      }
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("Login failed");
        }
      })
      .finally(() => {
        setIsLoading(false);
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
    setIsLoading(true);
    try {
      // Use the access token to fetch profile info
      const res = await axios.get( //This makes a GET request to Google's User Info API and waits for response
       //axios.get(url, config) syntax...url: The endpoint config:(Optional) An object for headers, params, etc.
        'https://www.googleapis.com/oauth2/v3/userinfo', //This is the URL Google provides to get user profile info using the token.
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            //Google requires a Bearer token in the request header to prove you're authorized.
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

      // Send Google user data to our server to get JWT token
      /*
       Why import.meta.env and not process.env?
        -In Node.js backend, you use process.env to get env vars.
        -In modern frontend setups using Vite, process.env isn’t available by default because
        frontend code runs in browsers, not Node.js.
        -So Vite provides import.meta.env as a safe way to inject env vars into your frontend bundle during build time.
      */
      const serverResponse = await axios.post(`${BACKEND_URL}/google-login`, {
        email,
        name,
        picture
      });

      if (serverResponse.data.message === "Google login successful") {
        // Store JWT token and user data
        localStorage.setItem("token", serverResponse.data.token);
        localStorage.setItem("user", JSON.stringify(serverResponse.data.user));
        navigate("/home");
      } else {
        alert("Google login failed");
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      alert("Google login failed");
    } finally {
      setIsLoading(false);
    }
  },
  onError: () => {
    alert("Google login failed");
    setIsLoading(false);
  },
});

    

 if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
  <div className="bg-white p-[20px] w-1/2 h-full flex flex-col justify-evenly items-center text-black max-mobXL:h-full max-mobXL:w-full max-mobXL:rounded-t-[50px]">
    <p className="inter text-[3rem] md:text-[4rem] font-bold text-center mb-4 max-mobXL:text-[2rem] max-mobXL:mb-0">
      Welcome Back
    </p>

    <div className="w-full max-w-[450px]">
      <form onSubmit={handleLogin} className="flex flex-col justify-center w-full">
        
        {/* Email input */}
        <div className="w-full mb-[10px] max-mobL:text-[.9rem]">
          <label className="lato">enter email:</label>
          <input
            type="email"
            placeholder="e.g jack@gmail.com"
            name="email"
            className="lato w-full text-[1rem] py-[5px] px-[5px] mt-[2px] rounded-lg border-[2px] border-accentS2 bg-white text-black outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-[20px] max-mobL:text-[.9rem]">
          <label className="lato">enter password:</label>
          <div className="flex border-[2px] border-accentS2 bg-white rounded-lg">
            <input
              type={showFlag ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="lato text-[1rem] py-[5px] px-[5px] w-full bg-white text-black outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="w-[30px] text-accentS2" onClick={handleShowPass}>
              {showFlag ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        {/* Divider & Google login */}
        <div className="flex flex-col mb-[20px] max-mobL:text-[.9rem]">
          <section className="flex w-full items-center">
            <div className="h-[2px] w-full bg-accentS2"></div>
            <p className="text-gray-400 text-[0.9rem] px-2">OR</p>
            <div className="h-[2px] w-full bg-accentS2"></div>
          </section>
          <div className="mt-[20px] w-full">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full border-[2px] border-accentS2 p-[5px] rounded-lg flex items-center justify-center text-[1.1rem]"
            >
              <div className="bg-[url('/googleLogo.svg')] bg-contain bg-no-repeat h-[22px] aspect-square"></div>
              &nbsp;&nbsp;&nbsp;Continue with Google
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="rounded-lg lato w-full py-[5px] text-[1.2rem] bg-gradient-to-r from-accent0 via-accent1 to-accent0 text-white font-bold transition-colors duration-200 max-mobXL:text-[1.2rem]"
        >
          Login
        </button>

        {/* Register link */}
        <p className="lato w-full mt-[10px] text-center text-gray-500 max-mobL:text-[0.9rem]">
          don't have an account?{" "}
          <button onClick={handleRegister} className="text-accent1 hover:text-accent1">
            Register
          </button>
        </p>
      </form>
      <div className="hidden"></div>
    </div>
  </div>
);


};

export default LoginForm;
