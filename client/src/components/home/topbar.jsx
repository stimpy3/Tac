import React, { useState, useEffect, useRef } from "react";
import { Sun, MoonStar,CalendarDays, CalendarOff } from "lucide-react";
import { useDarkMode } from "../../darkModeContext";
import { getCurrentUser } from "../../utils/auth";
import { useNotif } from "../../notifContext";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from '../calendar';

const TopBar = ({modal,setModal}) => {
  const user = getCurrentUser();
  const username = user?.username || user?.name || "";
  const useremail = user?.email || "";

  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const randomColor = ["bg-accent1", "bg-[#a1cbcf]", "bg-[#8ca3dc]", "bg-[#b4b4e4]", "bg-[#9d91c2]"];
  const [userColor] = useState(randomColor[Math.floor(Math.random() * randomColor.length)]);

  const { mode, setMode } = useDarkMode();
  const { notifCount, setNotifCount, notifArr, fetchNotif } = useNotif(); // bring fetchNotif to refresh
  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef(null);
  const bellRef = useRef(null);

  // handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        if (showNotif) {
          setNotifCount(0); // mark seen
          setShowNotif(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif]);//Including showNotif ensures the latest value is used in the click handler.
  
  const [showMenu,setShowMenu]=useState(false);
  const toggleMenu=()=>{
    setShowMenu(prev=>!prev);
  };

  
   const handleCalender = () => {
    setShowCalendar(prev => !prev);
  };
  const [showCalender, setShowCalendar] = useState(false);

 useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 675) {
        setShowMenu(false);
      }
      if (window.innerWidth > 565) {
        setShowCalendar(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 const navigate = useNavigate();
 const location = useLocation();
 const baseClasses = "w-full h-fit px-[5px] py-[5px] border-b border-b-accentBorder2 dark:border-b-daccentBorder2";
 const isActive = (path) => location.pathname === path ? "text-accent1" : "text-accentTxt dark:text-daccentTxt";

  return (
    <div className="w-full h-[120px] pl-[20px] flex justify-between items-center max-[675px]:pl-[0px]">
      {/* greeting + menu */}
        <div className="flex h-full justify-center">
        <button onClick={toggleMenu} className="hidden relative mr-[20px] flex h-full items-center justify-center text-accentTxt dark:text-daccentTxt max-[675px]:flex">
           <i class="fa-solid fa-bars text-[1.5rem] text-accentS3 dark:text-daccentS3 hover:text-accentTxt hover:dark:text-daccentTxt"></i>
        </button>
        {(showMenu)?<div className="absolute botrtom-0 w-[100px] h-fit
        bg-accentM/60 dark:bg-daccentM/60 backdrop-blur-sm border border-accentBorder2 dark:border-daccentBorder2
        rounded-lg z-[10] top-[80px] left-[20px]">
          <button onClick={() => navigate("/home")} 
             className={`${baseClasses} ${isActive("/home")}`}>Home</button>
          <button className='w-full h-fit px-[5px] py-[5px] text-accentTxt hover:text-accent2 dark:text-daccentTxt 
                           border-b border-b-accentBorder2 dark:border-b-daccentBorder2'>Analytics</button>
          <button onClick={() => navigate("/timetable")} 
             className={`${baseClasses} ${isActive("/timetable")}`}>TimeTable</button>
          <button onClick={() => {setModal(true); setShowMenu(false);}} 
           className={`${baseClasses} text-accentTxt dark:text-daccentTxt`}>logout</button>
        </div>:<></>}
        <div className="flex flex-col items-center justify-center w-fit h-full">
           <h1 className="text-[1.5rem] max-[515px]:text-[1.1rem] text-accentTxt dark:text-daccentTxt">Welcome {username ? (username.split(" ")[0].length > 10 ? "" : username.split(" ")[0]) : ""}</h1>
           <p className="text-[1rem] text-gray-500">
             <span className="text-accentS3 text-[0.9rem] dark:text-daccentS3">{date}</span>
           </p>
        </div>
      </div>

      {/* Right side icons + profile */}
      <div className="h-full flex items-center gap-[20px]">
        {/* Theme toggle */}
        <button onClick={() => setMode((prev) => !prev)}>
          {mode ? <MoonStar className="text-accentS3 dark:text-daccentS3 hover:text-accent1" /> : <Sun className="text-accentS3 dark:text-daccentS3 hover:text-accent1" />}
        </button>

         <button className='hidden relative max-[565px]:inline text-accentS3 dark:text-daccentS3 w-full h-full flex items-center justify-center px-[20px]' onClick={handleCalender}>{(showCalender) ? <CalendarOff /> : <CalendarDays />}</button>
          {(showCalender) ?
              <div className='absolute top-[70px] right-[60px] z-10'>
                <Calendar />
              </div>
              :
              <div className='hidden'>
                <Calendar />
              </div>
            }

        {/* Notifications */}
        <button ref={bellRef} className="pl-[15px] relative w-[50px] h-[40px]"
          onClick={() => {
            setShowNotif((prev) => !prev);
          }}>
          <i className="fa-solid fa-bell text-[1.3rem] text-accentS3 dark:text-daccentS3 hover:text-accent1"></i>
          {notifCount > 0 && (
            <div
              data-label="notifCount"
              className="absolute top-0 right-0 translate-x-4/5 -translate-y-4/5  
                         min-w-[20px] h-[20px] bg-red-500 text-white z-[5] text-[0.8rem] 
                         flex items-center justify-center rounded-full"
            >
              {notifCount > 5 ? "5+" : notifCount}
            </div>
          )}
        </button>

        {/* Notification dropdown */}
        {notifArr.length > 0 && showNotif && (
          <div
            ref={notifRef}
            className="absolute top-[80px] right-[50px] w-[250px] max-h-[300px] overflow-y-auto 
                       bg-accentM/60 dark:bg-daccentM/60 backdrop-blur-md 
                       border border-accentBorder2 dark:border-daccentBorder2 
                       shadow-lg rounded-lg z-[10]"
          >
            {notifArr.map((notifName, idx) => (
              <div
                key={idx}
                className="p-[8px] rounded-lg text-[0.9rem] text-accentTxt dark:text-daccentTxt 
                           border-b border-b-accentBorder2 dark:border-b-daccentBorder2"
              >
                {notifName} is due Today
              </div>
            ))}
          </div>
        )}

        {/* Profile */}
        <div className="max-[675px]:hidden h-[60px] w-[220px] bg-accentM  dark:bg-daccentM flex items-center rounded-full pl-[5px] border-[1px] border-accentBorder2 dark:border-daccentBorder2">
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

        <div className="hidden max-[675px]:flex">
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
        </div>

      </div>
    </div>
  );
};

export default TopBar;
