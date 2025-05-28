import React,{useState} from 'react';
import Sidebar from '../home/sidebar'; 
import Calendar from '../calendar';

const TimeTable=()=>{
  const [showCalender,setShowCalendar]=useState(false);
  const handleCalender=()=>{
      setShowCalendar(prev=>!prev);
  };

    return(
        <div className='w-screen h-screen bg-gray-500 flex'>
          <Sidebar/>
          <div className='w-[280px] ml-[85px] bg-gray-200 relative'>
             <div><button onClick={handleCalender}>calendar{sign}</button>
             <p>jkckjv kjj</p>
             <p>jkckjv kjj</p>
             <p>jkckjv kjj</p>
             <p>jkckjv kjj</p>
             <p>jkckjv kjj</p>
             </div>
                 { (showCalender)? 
                 <div className='absolute top-5 z-10'>
                   <Calendar/>
                 </div>
                 :
                 <div className='hidden'>
                   <Calendar/>
                 </div>
                 }
          </div>
          <div className=' border-l-[1px] border-gray-400 min-w-[calc(100%-365px)] max-w-fit h-screen bg-gray-300'>

          </div>
        </div>
    );
    
};

export default TimeTable;