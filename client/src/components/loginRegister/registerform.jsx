import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye } from "lucide-react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google"; //oauth

const RegisterForm = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showFlag, setShowFlag] = useState(false);

  const handleShowPass = (e) => {
    e.preventDefault();
    setShowFlag(!showFlag);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === "" || email === "" || username === "") return;

    axios
      .post("http://localhost:3001/register", { username, email, password })
      .then((result) => {
        if (result.data.message === "User registered successfully") {
          // Store JWT token and user data
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          navigate("/home");
        } else {
          alert(result.data.message || "Registration failed");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("Registration failed");
        }
      });
  };

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

  // Google register
  //oauth
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const { name, email, picture } = res.data;

        // Send Google user data to our server to get JWT token
        const serverResponse = await axios.post("http://localhost:3001/google-login", {
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
          alert("Google registration failed");
        }
      } catch (err) {
        console.error("Failed to fetch Google user:", err);
        alert("Google registration failed");
      }
    },
    onError: () => {
      alert("Google register failed");
    },
  });
  
  return (
  <div className="p-[20px] w-1/2 h-full flex flex-col justify-center items-center bg-white text-black max-mobXL:h-full max-mobXL:w-full max-mobXL:rounded-t-[50px]">
    <p className="max-mobXL:text-[2rem] max-mobXL:pb-[20px] max-mobXL:mb-0 text-[3rem] md:text-[4rem] font-bold inter">
      Register
    </p>

    <div className="w-full max-w-[450px]">
      <form onSubmit={handleSubmit} className="flex flex-col w-full items-center">

        {/* First Name */}
        <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
          <label className="lato">enter your first name:</label>
          <input
            type="text"
            placeholder="e.g jack"
            name="username"
            className="lato w-full py-[5px] px-[5px] mt-[2px] text-[1rem] rounded-lg border-[2px] border-accentS2 bg-white text-black outline-none"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
          <label className="lato">enter email:</label>
          <input
            type="email"
            placeholder="e.g jack@gmail.com"
            name="email"
            className="lato w-full py-[5px] px-[5px] mt-[2px] text-[1rem] rounded-lg border-[2px] border-accentS2 bg-white text-black outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="max-mobL:text-[.9rem] mb-[20px] w-full">
          <label className="lato">enter password:</label>
          <div className="flex border-[2px] border-accentS2 bg-white p-[2px] pl-[5px] rounded-lg">
            <input
              type={showFlag ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="lato w-full py-[5px] text-[1rem] bg-white text-black outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="w-[30px] text-gray-500" onClick={handleShowPass}>
              {showFlag ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        {/* Divider + Google */}
        <div className="flex flex-col max-mobL:text-[.9rem] mb-[20px] w-full">
          <section className="flex w-full items-center">
            <div className="h-[2px] w-full bg-accentS2"></div>
            <p className="text-gray-400 text-[0.9rem] px-2">OR</p>
            <div className="h-[2px] w-full bg-accentS2"></div>
          </section>
          <button
            type="button"
            onClick={loginWithGoogle}
            className="mt-[20px] p-[5px] border-[2px] border-accentS2 rounded-lg flex items-center justify-center text-[1.1rem]"
          >
            <div className="bg-[url('/googleLogo.svg')] bg-contain bg-no-repeat h-[22px] aspect-square"></div>
            &nbsp;&nbsp;&nbsp;Continue with Google
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="rounded-lg lato w-full py-[5px] text-[1.2rem] bg-gradient-to-r from-accent0 via-accent1 to-accent0 text-white font-bold transition-colors duration-200 max-mobXL:text-[1.2rem]"
        >
          Register
        </button>

        {/* Login link */}
        <p className="lato mt-[10px] w-full text-center text-gray-500 max-mobL:text-[0.9rem]">
          already have an account?{" "}
          <button onClick={handleLogin} className="text-accent1 hover:text-accent1">
            Login
          </button>
        </p>
      </form>
    </div>
  </div>
);


};

export default RegisterForm;
