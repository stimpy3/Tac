import React, { useState } from 'react';
/*Older React (before React 17)
You always had to import React, because:
JSX (<div>) gets compiled to React.createElement(...)
So without React, your code would throw an error. */

const TopBar=() =>{
    const username = localStorage.getItem("username")||"";
   const today=new Date();
   const day=today.toLocaleDateString("en-US", {
    weekday: "short",
  });
   const date=today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // Optional: makes it "Apr"
    day: "numeric",
  });
  const randomColor=["bg-blue-500","bg-[#a1cbcf]","bg-[#8ca3dc]","bg-[#b4b4e4]","bg-[#9d91c2]"];
  const[userColor,setUserColor]=useState([randomColor[Math.floor(Math.random() * 5)]]);
 


   return(
    <div className="w-100% h-[100px] bg-gray-200 flex py-[0px] px-[15px] pl-[0px] justify-between">
        {/*label and date*/}
        <div className="flex flex-col justify-center">
            <h1 className="text-[1.5rem]">Welcome {username} 👋</h1>
            <p className="text-[1rem] text-gry-500"><span className="text-gray-500 text-[0.9rem]">{date}</span></p>
        </div>

        {/*profile
         <i class="fa-solid fa-laptop-file"></i> <i class="fa-solid fa-person-rays"></i> <i class="fa-solid fa-hashtag"></i>
        */
        }
        <div className="h-full w-10% flex items-center ">
            <i className="fa-solid fa-bell text-gray-400  text-[1.4rem]"></i>
            <div className="h-[60px] w-[220px] bg-white flex ml-[20px] items-center rounded-full pl-[5px] border-[1px] border-gray-400">
                <div data-label="UserIcon" className={`flex overflow-hidden items-center justify-center text-[1.4rem] shadow-lg text-white w-[50px] h-[50px] ${userColor} rounded-full 
                 border-[1px] border-gray-400 shadow-lg `}>
                 {username && username[0] ? username[0].toUpperCase() : <i className="fa-solid fa-user"></i>}
                </div>
                <section className="w-[150px] h-full flex justify-center items-center">
                     <section className="pl-[5px] w-full h-full flex flex-col justify-center items-start overflow-hidden"> 
                       <p className="mr-[5px]">{username}</p>
                       <p className="text-gray-500 text-[0.6rem]">sohanbhadalkar@gmail.com</p>
                     </section> 
                    <button><i class="fa-solid fa-angle-down"></i></button>
                </section>
            </div>
        </div>
    </div>
   );
};

export default TopBar;