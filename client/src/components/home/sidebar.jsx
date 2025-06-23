import React,{useState} from 'react';
import { CalendarClock, House } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ modal, setModal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const baseClasses = "text-[1.2rem] flex justify-center w-full p-[5px] rounded-full";
const isActive = (path) => location.pathname === path ? "text-accent1" : "text-accentS3 dark:text-daccentS3";

return (
  <section className="w-[70px] h-screen pr-[15px] fixed border-box">
    <div className="flex flex-col h-full w-full bg-accentM dark:bg-daccentM shadow-lg px-[0px] py-[5px] items-center border-r-[1px] border-accentBorder2 dark:border-daccentBorder2">
      <div
        data-label="logoContainer"
        className="bg-[url('/logo2.png')] dark:bg-[url('/logo2white.png')] bg-contain w-[40px] aspect-square my-[20px] bg-no-repeat"
      >
      </div>
      <section className="flex flex-col items-center justify-center w-full h-full">
        <section className="flex flex-col w-full h-[70%] max-h-[480px] justify-evenly">
          <button
            onClick={() => navigate("/home")}
            className={`${baseClasses} ${isActive("/home")}`}
          >
            <House />
          </button>
          <button
            className={`${baseClasses} text-accentS3 dark:text-daccentS3`}
          >
            <i className="fa-solid fa-chart-line"></i>
          </button>
          <button
            className={`${baseClasses} text-accentS3 dark:text-daccentS3`}
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
      </section>
      <section className="text-accentS3 dark:text-daccentS3 text-[1.2rem] w-full justify-center my-[15px] flex flex-col items-center">
        <button onClick={() => setModal(true)}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <p className="text-[0.6rem]">logout</p>
        </button>
      </section>
    </div>
  </section>
);

};

export default Sidebar;
