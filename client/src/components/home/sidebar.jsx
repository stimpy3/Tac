import React from 'react';
import { CalendarClock } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const baseClasses = "mb-[30px] text-[1.2rem]  w-full p-[5px] rounded-full";
  const isActive = (path) => location.pathname === path ? "text-blue-500" : "text-white";
   //if isActive("/home") then path is /home

  return (
    <section className="w-[100px] h-screen bg-gray-200 p-[15px] fixed border-box">
      <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border-[1px] border-gray-400 shadow-lg p-[5px] items-center">
        <div
          data-label="logoContainer"
          className="bg-[url('/logo2white.png')] bg-contain w-[40px] aspect-square my-[20px] bg-no-repeat"
        >
        </div>
        <section className="flex flex-col items-start w-full h-full">
          <button
            onClick={() => navigate("/home")}
            className={`${baseClasses} ${isActive("/home")}`}
          >
            <i className="fa-solid fa-house"></i>
          </button>
          <button
            className={`${baseClasses} text-white`}
          >
            <i className="fa-solid fa-chart-line"></i>
          </button>
          <button
            className={`${baseClasses} text-white`}
          >
            <i className="fa-regular fa-message"></i>
          </button>
          <button
            onClick={() => navigate("/timetable")}
            className={`${baseClasses} ${isActive("/timetable")} flex items-center justify-center`}
          >
            <CalendarClock />
          </button>
         
        </section>
        <section className="text-white text-[1.2rem] w-full justify-center my-[15px] flex flex-col items-center">
          <i className="fa-solid fa-right-from-bracket"></i>
          <p className="text-[0.6rem]">logout</p>
        </section>
      </div>
    </section>
  );
};

export default Sidebar;
