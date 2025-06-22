import React, { useState,useEffect } from 'react';
import { Sun,Moon } from 'lucide-react';

/* Older React (before React 17)
You always had to import React, because:
JSX (<div>) gets compiled to React.createElement(...)
So without React, your code would throw an error. */

const TopBar = () => {
  // Google sign-in accessing from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const useremail = localStorage.getItem("useremail") || (user?.email ?? "");
  const username = localStorage.getItem("username") || (user?.name ?? "");
  const [mode,setMode]=useState(() => {
  const saved = localStorage.getItem("mode");
  if (saved){
    return saved === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
  //window.matchMedia(...) is a browser API that lets you query things like screen size, color scheme, etc.
  //"(prefers-color-scheme: dark)" is a special media query that returns true if the system is set to dark mode.
  //.matches gives the actual result: true or false
  });//returns true or false

  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const randomColor = ["bg-accent1", "bg-[#a1cbcf]", "bg-[#8ca3dc]", "bg-[#b4b4e4]", "bg-[#9d91c2]"];
  const [userColor] = useState(randomColor[Math.floor(Math.random() * 5)]);

   useEffect(()=>{
    localStorage.setItem("mode", mode ? "dark" : "light");
    if(mode){
     document.documentElement.classList.add("dark");
    }
    else{
     document.documentElement.classList.remove("dark");
    }
  },[mode]);


  return (
    <div className="w-full h-[100px] pl-[20px] flex justify-between items-center">
      {/* Label and date */}
      <div className="flex flex-col justify-center">
        <h1 className="text-[1.5rem] text-accentTxt dark:text-daccentTxt">Welcome {username.split(" ")[0]} 👋</h1>
        <p className="text-[1rem] text-gray-500">
          <span className="text-accentS3 text-[0.9rem] dark:text-daccentS3">{date}</span>
        </p>
      </div>

      {/* Profile and top icons */}
      <div className="h-full flex items-center gap-[20px]">
        <div className="min-w-[70px] flex justify-between items-center h-full text-accentS3 dark:text-daccentS3">
          <button onClick={()=>setMode(prev=>!prev)}>
            {mode?<Moon/>:<Sun/>}
          </button>
          <button><i className="fa-solid fa-bell text-[1.3rem]"></i></button>
        </div>

        <div className="h-[60px] w-[220px] bg-accentM  dark:bg-daccentM flex items-center rounded-full pl-[5px] border-[1px] border-accentBorder2 dark:border-daccentBorder2">
          {
            (user && user?.picture && !user.picture.includes("default-user")) ? (
              <div className="w-[50px] h-[50px] rounded-full border-[1px] border-accentBorder2 dark:border-daccentBorder2 shadow-lg overflow-hidden">
                <img
                  src={user.picture}
                  alt="User"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="flex items-center justify-center text-[1.4rem] text-white w-full h-full ${userColor}">
                        ${username && username[0] ? username[0].toUpperCase() : `<i class='fa-solid fa-user'></i>`}
                      </div>`;
                  }}
                />
              </div>
            ) : (
              <div className={`flex items-center justify-center text-[1.4rem] text-white w-[50px] h-[50px] ${userColor} rounded-full border border-accentS3 dark:border-daccentS3 shadow-lg`}>
                {username && username[0] ? username[0].toUpperCase() : <i className="fa-solid fa-user"></i>}
              </div>
            )
          }

          <section className="w-[150px] h-full flex justify-center items-center">
            <section className="pl-[5px] w-full h-full flex flex-col justify-center items-start overflow-hidden">
              <p className="text-[0.9rem] mb-[2px] text-accentTxt dark:text-daccentTxt">
                {(username.length > 15) ? username.slice(0, 10) + "..." : username}
              </p>
              <p className="text-accentS3 dark:text-daccentS3 text-[0.6rem]">{useremail}</p>
            </section>
            <button><i className="fa-solid fa-angle-down dark:text-daccentTxt"></i></button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
