import React,{useState} from 'react';
import Sidebar from '../home/sidebar'; 
import Calendar from '../calendar';
import { ChevronDown } from 'lucide-react';

const TimeTable=()=>{
  const [showCalender,setShowCalendar]=useState(false);
  const handleCalender=()=>{
      setShowCalendar(prev=>!prev);
  };//pok

    return(
        <div className='w-screen h-screen bg-gray-500 flex'>
          <Sidebar/>
          <div className='w-[calc(100%-85px)] ml-[85px] bg-gray-200 relative p-[15px]'>
              <div className='w-[100px] h-full  flex flex-col items-center border-[1px] border-gray-400'> 
                <section className='flex justify-center items-center w-full h-[40px] border-b-[1px] border-gray-400'>Calendar<button onClick={handleCalender}>{(showCalender)?<ChevronDown  className='rotate-[-180] transition-transform duration-300 '/>:<ChevronDown className='rotate-180 transition-transform duration-300'/>}</button></section>
                 { (showCalender)? 
                 <div className='absolute top-[40px] left-[5px] z-10'>
                   <Calendar/>
                 </div>
                 :
                 <div className='hidden'>
                   <Calendar/>
                 </div>
                 }
                 <section className='h-full w-full bg-blue-500 flex flex-col items-center text-white text-[1.2rem]'>
                    <div className='flex-1 w-full flex items-center justify-center border-b-[1px] border-white'>Mon</div>
                    <div className='flex-1 w-full flex items-center justify-center border-b-[1px] border-white'>Tue</div>
                    <div className='flex-1 w-full flex items-center justify-center border-b-[1px] border-white'>Wed</div>
                    <div className='flex-1 w-full flex items-center justify-center border-b-[1px] border-white'>Tue</div>
                    <div className='flex-1 w-full flex items-center justify-center border-b-[1px] border-white'>Fri</div>
                    <div className='flex-1 w-full flex items-center justify-center  border-b-[1px] border-white'>Sat</div>
                    <div className='flex-1 w-full flex items-center justify-center'>Sun</div>
                 </section>
              </div>
              
               
          </div>
      </div>
    );
    
};

export default TimeTable;