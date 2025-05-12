import React from 'react';

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
   return(
    <div className="w-100% h-[100px] bg-gray-200 flex pb-[0px] py-[15px] px-[15px] pl-[0px] justify-between">
        {/*label and date*/}
        <div className="flex flex-col justify-center">
            <h1 className="text-[1.5rem]">Welcome back Sohan 👋</h1>
            <p className="text-[1rem] text-gry-500">{day} <span className="text-gray-500 text-[0.9rem]">{date}</span></p>
        </div>

        {/*profile
        <i class="fa-regular fa-heart"></i> <i class="fa-solid fa-graduation-cap"></i> <i class="fa-solid fa-laptop-file"></i> <i class="fa-solid fa-person-rays"></i> <i class="fa-solid fa-hashtag"></i>
        */
        }
        <div className="h-full w-10% flex items-center">
        <i className="fa-solid fa-bell text-gray-400  text-[1.4rem]"></i>
            <div className="w-[50px] h-[50px] rounded-full bg-white m-[5px] ml-[40px]"></div>
        </div>
    </div>
   );
};

export default TopBar;