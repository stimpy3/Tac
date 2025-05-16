import React, { useState } from 'react';
/*Older React (before React 17)
You always had to import React, because:
JSX (<div>) gets compiled to React.createElement(...)
So without React, your code would throw an error. */

const TopBar=() =>{
   const today=new Date();
   const day=today.toLocaleDateString("en-US", {
    weekday: "short",
  });;
   const date=today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // Optional: makes it "Apr"
    day: "numeric",
  });;
  const randomColor=["bg-blue-500","bg-[#863ec9]","bg-[#84868a]","bg-[#cf9c3e]","bg-[#3e51cf]","bg-[#c33ecf]"];
  const[userColor,setUserColor]=useState([randomColor[Math.floor(Math.random() * 6)]]);
 


   return(
    <div className="w-100% h-[100px] bg-gray-200 flex py-[0px] px-[15px] pl-[0px] justify-between">
        {/*label and date*/}
        <div className="flex flex-col justify-center">
            <h1 className="text-[1.5rem]">Welcome back Sohan 👋</h1>
            <p className="text-[1rem] text-gry-500">{day} <span className="text-gray-500 text-[0.9rem]">{date}</span></p>
        </div>

        {/*profile
         <i class="fa-solid fa-laptop-file"></i> <i class="fa-solid fa-person-rays"></i> <i class="fa-solid fa-hashtag"></i>
        */
        }
        <div className="h-full w-10% flex items-center">
        <i className="fa-solid fa-bell text-gray-400  text-[1.4rem]"></i>
            <div data-label="UserIcon" className={`flex overflow-hidden items-center justify-center text-[1.4rem] shadow-lg text-white w-[50px] h-[50px] ${userColor} rounded-full  m-[5px] ml-[20px]`}>S</div>
        </div>
    </div>
   );
};

export default TopBar;