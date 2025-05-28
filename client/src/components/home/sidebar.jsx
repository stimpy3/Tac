import React from 'react';
import { CalendarClock } from 'lucide-react';

const Sidebar=()=>{
return(
    <section className=" w-[100px] h-screen bg-gray-200 p-[15px] fixed border-box ">
       <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border-[1px] border-gray-400 shadow-lg p-[5px]">
             <div data-label='logoContainer' className="bg-[url('/logo2white.png')] bg-contain w-[95%] h-[70px] my-[20px] bg-no-repeat"></div>
             <section className="flex flex-col items-start w-full h-full">
             <button className="mb-[30px] text-[1.2rem] bg-gray-700 text-white w-full p-[5px] rounded"><i class="fa-solid fa-house"></i></button>
             <button className="mb-[30px] text-[1.2rem] text-white w-full p-[5px] rounded"><i class="fa-solid fa-chart-line"></i></button>
             <button className="mb-[30px] text-[1.2rem]  text-white w-full p-[5px] rounded"><i class="fa-regular fa-message"></i></button>
              <button className="mb-[30px] text-[1.2rem]  text-white w-full p-[5px] rounded flex items-center justify-center"><CalendarClock /></button>
             <button className="mb-[30px] text-[1.2rem]  text-white w-full p-[5px] rounded"><i class="fa-solid fa-clock-rotate-left"></i></button>
             </section>
             <section className='text-white text-[1.2rem] w-full justify-center my-[15px] flex flex-col items-center'><i class="fa-solid fa-right-from-bracket"></i><p className="text-[0.6rem]">logout</p></section>
        </div>  
    </section>
);
};

export default Sidebar;