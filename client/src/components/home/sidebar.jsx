import React,{useState} from 'react';
import { CalendarClock,House } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ modal, setModal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const baseClasses = "mb-[30px] text-[1.2rem] flex justify-center w-full p-[5px] rounded-full";
  const isActive = (path) => location.pathname === path ? "text-accent1" : "text-gray-400";
   //if isActive("/home") then path is /home

  return (
    <section className="w-[100px] h-screen bg-gray-200 pr-[15px] fixed border-box">
      <div className="flex flex-col h-full w-full bg-white shadow-lg p-[5px] items-center border-r-[1px] border-gray-400">
        <div
          data-label="logoContainer"
          className="bg-[url('/logo2.png')] bg-contain w-[40px] aspect-square my-[20px] bg-no-repeat"
        >
        </div>
        <section className="flex flex-col items-start w-full h-full">
          <button
            onClick={() => navigate("/home")}
            className={`${baseClasses} ${isActive("/home")}`}
          >
            <House />
          </button>
          <button
            className={`${baseClasses} text-gray-400`}
          >
            <i className="fa-solid fa-chart-line"></i>
          </button>
          <button
            className={`${baseClasses} text-gray-400`}
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
        <section className="text-gray-400 text-[1.2rem] w-full justify-center my-[15px] flex flex-col items-center">
          <button  onClick={() => setModal(true)}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <p className="text-[0.6rem]">logout</p>
          </button>
        </section>
      </div>
    </section>
  );
};

export default Sidebar;
