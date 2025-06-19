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
        localStorage.setItem("username", result.data.username);
        localStorage.setItem("useremail", result.data.username);
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
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

        localStorage.setItem("user", JSON.stringify({ name, email, picture }));
        navigate("/home");
      } catch (err) {
        console.error("Failed to fetch Google user:", err);
      }
    },
    onError: () => {
      alert("Google register failed");
    },
  });

  return (
    <div className="p-[20px] w-1/2 h-full flex flex-col justify-center items-center bg-inherit text-black max-mobXL:h-full max-mobXL:w-full bg-white max-mobXL:rounded-t-[50px]">
      <p className="max-mobXL:text-[2rem] max-mobXL:pb-[20px] max-mobXL:mb-0 text-[3rem] md:text-[4rem] font-bold inter">Register</p>
      <div className="w-full max-w-[450px]">
        <form onSubmit={handleSubmit} className="flex flex-col w-full items-center">
          <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label className="lato">enter your first name:</label>
            <input
              type="text"
              placeholder="e.g jack"
              name="username"
              className="lato max-mobXL:mt-[0px] py-[5px] text-[1rem] w-full p-[2px] px-[5px] mt-[2px] rounded-lg border-[2px] bg-white border-gray-300 text-black outline-none focus:outline-none"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="max-mobL:text-[.9rem] mb-[10px] w-full">
            <label className="lato">enter email:</label>
            <input
              type="email"
              placeholder="e.g jack@gmail.com"
              name="email"
              className="lato max-mobXL:mt-[0px] py-[5px] text-[1rem] w-full p-[2px] px-[5px] mt-[2px] rounded-lg border-[2px] bg-white border-gray-300 text-black outline-none focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="max-mobL:text-[.9rem] mb-[20px] w-full">
            <label className="lato">enter password:</label>
            <div className="flex border-[2px] bg-white border-gray-300 p-[2px] pl-[5px] rounded-lg">
              <input
                type={showFlag ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="lato w-full bg-white py-[5px] text-[1rem] text-black outline-none focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="w-[30px] text-gray-500" onClick={handleShowPass}>
                {showFlag ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <div className="flex flex-col max-mobL:text-[.9rem] mb-[20px] w-full">
            <section className="flex w-full h-fit items-center">
              <div className="h-[2px] w-full bg-gray-300"></div>
              <p className="text-gray-400 text-[0.9rem]">&nbsp;&nbsp;OR&nbsp;&nbsp;</p>
              <div className="h-[2px] w-full bg-gray-300"></div>
            </section>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="border-[2px] border-gray-300 p-[5px] mt-[20px] rounded-lg flex items-center justify-center text-[1.1rem]"
            >
              <div className="bg-[url('/googleLogo.svg')] bg-contain bg-no-repeat h-[22px] aspect-square"></div>
              &nbsp;&nbsp;&nbsp;Continue with Google
            </button>
          </div>

          <button
            type="submit"
            className="rounded-lg lato w-full py-[5px] text-[1.2rem] bg-gradient-to-r from-accent0 via-accent1 to-accent0 text-white max-mobXL:text-[1.2rem] font-bold transition-colors duration-200"
          >
            Register
          </button>

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
