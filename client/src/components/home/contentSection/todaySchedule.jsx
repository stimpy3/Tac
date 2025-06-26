import React,{useState,useRef,useEffect} from 'react';
import {ChevronRight,ChevronLeft,SquarePen} from 'lucide-react';
import gsap from "gsap";

const TodaySchedule =()=>{
 
return(
     <div className="relative todaysScheduleContainer flex flex-col w-full h-fit mt-[30px] overflow-hidden rounded-xl bg-accentS2 dark:bg-daccentS2 shadow-none">
       <div className='absolute w-fit h-[90px]'>
          <div className='flex items-center w-fit h-[60px] bg-accentS dark:bg-daccentS rounded-br-xl pb-[5px] pr-[20px]'>
              <div className='flex mr-[10px] h-full'>{/*HEADING */}
                   <p className='flex items-center text-[1.5rem] text-accentTxt dark:text-daccentTxt w-fit h-full whitespace-nowrap'>
                    Today's Schedule
                   </p>
              </div>  
              <div className='ml-[10px] min-w-[80px] h-full flex items-center'>{/*BUTTONS*/}
                 <button className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt mr-[5px] hover:bg-accent1 dark:hover:bg-accent1 hover:text-white transition-colors duration-400'><ChevronLeft /></button>
                 <button className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt hover:bg-accent1 dark:hover:bg-accent1 hover:text-white transition-colors duration-400'><ChevronRight /></button>
              </div>

           </div>
        </div>
        <button data-lable="editBtn" className="absolute top-[10px] right-[10px] text-accentTxt2  dark:text-daccentS3 "><SquarePen /></button>
        <div className="bg-accentS dark:bg-daccentS w-[15px] h-[15px] absolute left-[305px]">
          <div className="w-[15px] h-[15px] rounded-tl-xl bg-accentS2 dark:bg-daccentS2"></div>
        </div>
        <div  className="bg-accentS dark:bg-daccentS w-[15px] h-[15px] absolute top-[60px] left-[0px]">
          <div className="w-[15px] h-[15px] rounded-tl-xl  bg-accentS2 dark:bg-daccentS2"></div>
        </div>
        <div className="h-[150px] w-full mt-[10px]">           
        </div>
       
     </div>
);
}
export default TodaySchedule;