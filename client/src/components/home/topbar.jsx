import React, { useState,useEffect } from 'react';
import { Sun,MoonStar } from 'lucide-react';
import { useDarkMode } from "../../darkModeContext"; //context useContext
import { getCurrentUser } from "../../utils/auth";
import axios from 'axios';

/* Older React (before React 17)
You always had to import React, because:
JSX (<div>) gets compiled to React.createElement(...)
So without React, your code would throw an error. */
//lightmode darkmode
const TopBar = () => {
  // Get user from auth utility
  const user = getCurrentUser();
  const useremail = user?.email || "";
  const username = user?.username || user?.name || "";
  
  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const randomColor = ["bg-accent1", "bg-[#a1cbcf]", "bg-[#8ca3dc]", "bg-[#b4b4e4]", "bg-[#9d91c2]"];
  const [userColor] = useState(randomColor[Math.floor(Math.random() * 5)]);
 
  const { mode, setMode } = useDarkMode(); //context useContext
  const [notifCount, setNotifCount] = useState(0);
  const [notifArr, setNotifArr] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL||"http://localhost:5000";
  useEffect(()=>{
    // Simulate fetching notification count from an API
    const fetchNotif = async () => {
        const token = localStorage.getItem("token");
        if (!token) return; // wait for login to set token first

        try {
          const res = await axios.get(`${BACKEND_URL}/deadlines`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          const data = res.data; // deadlines array from backend
          const today = new Date();
      
          // Filter only deadlines due today, then map to their names
          const notif = data
            .filter((event) => {
              const eventDate = new Date(event.date);
              return (
                today.getFullYear() === eventDate.getFullYear() &&
                today.getMonth() === eventDate.getMonth() &&
                today.getDate() === eventDate.getDate()
              );
            })
            .map((event) => event.name);
      
          setNotifArr(notif);
          setNotifCount(notif.length);
        } catch (err) {
          console.error("Failed to fetch deadlines:", err);
        }
      
    };
    fetchNotif();
  },[]);

  return (
    <div className="w-full h-[120px] pl-[20px] flex justify-between items-center">
      {/* Label and date */}
      <div className="flex flex-col justify-center">
        <h1 className="text-[1.5rem] text-accentTxt dark:text-daccentTxt">Welcome {username.split(" ")[0]} 👋</h1>
        <p className="text-[1rem] text-gray-500">
          <span className="text-accentS3 text-[0.9rem] dark:text-daccentS3">{date}</span>
        </p>
      </div>

      {/* Profile and top icons */}
      <div className="h-full flex items-center gap-[20px]">
        <div className="min-w-[70px] flex justify-between items-center h-full text-accentS3 dark:text-daccentS3 ">
          <button onClick={()=>setMode(prev=>!prev)}>
            {mode?<MoonStar className="hover:text-accent1"/>:<Sun className="hover:text-accent1"/>}
          </button>
          <button className="pl-[15px] relative w-[50px] h-[40px]" onClick={() => setShowNotif(prev => !prev)}>
            <i className="fa-solid fa-bell text-[1.3rem] hover:text-accent1"></i>
            {notifCount>0?
            <div data-label="notifCount" className="absolute  top-0 right-0 translate-x-4/5 -translate-y-4/5  min-w-[20px] h-[20px] bg-red-500 text-white z-[5] text-[0.8rem] rounded-full ">{notifCount>5?"5+":notifCount}</div>
            :
            ""}
          </button>
          {/*better than  ternary ()?xyz:"" */}
          {notifCount > 0 && showNotif && (
                <div className="absolute top-[80px] right-[20px] w-[250px] max-h-[300px] overflow-y-auto bg-accentM dark:bg-daccentM 
                 border border-accentBorder2 dark:border-daccentBorder2 shadow-lg rounded-lg p-[10px] z-[10]">
                  {notifArr.map((notifName, idx) => (
                    <div key={idx} className="mb-[8px] p-[8px] bg-accentS3 dark:bg-daccentS3 rounded-lg text-[0.9rem] text-accentTxt dark:text-daccentTxt">
                      {notifName} is due Today
                    </div>
                  ))}
                </div>
              )}  
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
              <div className={`flex items-center justify-center text-[1.4rem] text-white w-[50px] h-[50px] ${userColor} rounded-full border border-accentS3 dark:border-accentS3 shadow-lg`}>
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
