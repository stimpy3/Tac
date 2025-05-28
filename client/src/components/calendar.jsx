import React, { useState } from 'react';

const Calendar = () => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 0 to 11 months
  const currentYear = today.getFullYear();

  const year = today.getFullYear();
  const monthsArray = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  //calendar body states and values////////////////////////////////////////////////////////////////////////////

                    //example:- April 0, 2025, which means March 31, 2025 — the last day of March.
                    //  const daysInMonth =  new Date(currentYear, currentMonth + 1, 0).getDate();
                    //  const startDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
                    //const daysInMonthPrev =  new Date(currentYear, currentMonth, 0).getDate();

                     //.getDay() returnsday of week as 0,1....6 for sun,mon...sat 
                     // But why + 6) % 7? You're converting from Sunday-based week (JS default) 
                     //to a Monday-based week
                     // instead of sunday as 0 you get sunday as 0+6%7==> 6
                     //monday is 1 so 6+1 % 7 so it becomes 0
  const[daysInMonths,setDaysInMonths]=useState(new Date(currentYear, currentMonth + 1, 0).getDate());
  const[startDays,setStartDays]=useState((new Date(currentYear, currentMonth, 1).getDay() + 6) % 7);
  const[daysInMonthsPrev,setDaysInMonthsPrev]=useState(new Date(currentYear, currentMonth, 0).getDate());
  const [month,setMonthState]=useState(today.toLocaleString("en-US", { month: "long" }));
  const [monthNum,setMonthNumState]=useState(today.getMonth());
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const fwdBtnCalendar=()=>{
    let index = monthsArray.indexOf(month);
    let nextIndex = (index + 1) % 12;
  setMonthState(monthsArray[nextIndex]);
  setMonthNumState(nextIndex); // use nextIndex, not monthNum + 1

  setDaysInMonths(new Date(currentYear, nextIndex + 1, 0).getDate());
  setStartDays((new Date(currentYear, nextIndex, 1).getDay() + 6) % 7);
  setDaysInMonthsPrev(new Date(currentYear, nextIndex, 0).getDate());
  };

   const revBtnCalendar=()=>{
    let index = monthsArray.indexOf(month);
    let prevIndex = index - 1;

  if (prevIndex === -1) {
    prevIndex = 11; //wrap around to December
  }
  setMonthState(monthsArray[prevIndex]);
  setMonthNumState(prevIndex);
  setDaysInMonths(new Date(currentYear, prevIndex + 1, 0).getDate());
  setStartDays((new Date(currentYear, prevIndex, 1).getDay() + 6) % 7);
  setDaysInMonthsPrev(new Date(currentYear, prevIndex, 0).getDate());
   };

  return (
    <div className='w-full h-[300px] p-[15px] pb-[0px]'>
        <article data-label='calendarContainer' className='flex flex-col w-[250px] h-full rounded-lg bg-white shadow-lg border-[1px] border-gray-400 items-center pb-[5px] overflow-hidden'>  
           <div className="w-full h-[1000px] flex justify-between px-[10px]  mb-[5px] bg-gray-800">
             <p className="h-full flex items-center font-bold text-[1.2rem] text-white">{month}, {year}</p>
             <section data-label="leftRightButtonContainer" className="w-[40px] h-[15%] flex text-white text-[1.2rem]">
                <button onClick={revBtnCalendar} className=" h-[45px] w-[50%] flex items-center justify-center ">&lt;</button>
                <button onClick={fwdBtnCalendar} className=" h-[45px] w-[50%] flex items-center justify-center">&gt;</button>
             </section>
           </div>
           <div data-label='weekContainer' className='mb-[5px] grid grid-cols-7 w-full h-[15%] text-blue-500 font-bold rounded-md p-[5px]'>
                       {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                                   <p key={i} className='text-[0.8rem] text-center flex items-center justify-center'>
                                     {day}
                                   </p>
                         ))
                      }
           </div>

           <div data-label='daysContainer' className='px-[5px] pt-[0px] grid grid-cols-7 grid-rows-6 gap-2 w-full h-[70%] rounded-lg'>
            {  
              //(() => { ... })()
              //This is a fancy way to write a function and run it immediately. 
              // It's called an Immediately Invoked Function Expression (IIFE).
               (() => {          
                     //example Array.from({length:3}); would create [undefined,undefined,undefined]
                     // _ is the item (in this case, undefined, so we ignore it)
                     //key tells React which list items are which, so it can update only the parts
                     //that changed without breaking or re-rendering everything.
                     const blanks = Array.from({ length: startDays }).map((_, i) => (
                     <div className='h-full flex items-center justify-center text-gray-400 text-[0.8rem]' key={`b-${i}`}>{daysInMonthsPrev-((startDays-1)-i)}</div>
                     ));

                     //x => ( <JSX /> )	 No return statement needed  -	Returns JSX directly
                     //x => { return <JSX />; } return statement needed  -		Explicit return needed
////
                     const days = Array.from({ length: daysInMonths }).map((_, i) => {
                     const dayNum = i + 1;
                     const isToday =
                     dayNum === currentDay &&
                     today.getMonth() === monthNum &&
                     today.getFullYear() === currentYear;
                     return( //this return is for map
                     <div key={i} className={`py-[2px] h-full flex items-center justify-center rounded-sm ${isToday ? ' text-mainBlue font-bold' : '' }`}>
                          {dayNum}
                     </div>
                     );
                  });
                      /*new Array(5): Creates an array with 5 empty slots (not undefined),
                      and you can't use .map() directly on it because the empty slots are not actual values.
                       Array.from({ length: 5 }): Creates an array with 5 undefined elements,
                      and you can use .map() to iterate and fill it with values. */
                      const bottomBlanks=Array.from({length:42-(daysInMonths+startDays)}).map((_,i)=>{
                      return(
                      <div className='h-full flex items-center justify-center text-gray-400 text-[0.8rem]' key={`bb-${i}`}>{i+1}</div>
                       );
                });

                 return [...blanks, ...days,...bottomBlanks]; //returns an array of divs    
                 })() //IIFE Immediately Invoked Function Expression (IIFE).
              }
             </div>

         </article>
      </div>
  );
};

export default Calendar;