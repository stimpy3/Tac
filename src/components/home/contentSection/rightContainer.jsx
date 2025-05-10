import React, { useState } from 'react';


const RightSide=()=>{
  const daysInMonth = 31; // Adjust this for the month
  const startDay = 2; // 0 = Monday, so 2 = Wednesday

  const blanks = Array.from({ length: startDay }).map((_, i) => (
    <div key={`blank-${i}`} />
  ));

  const days = Array.from({ length: daysInMonth }).map((_, i) => (
    <div
      key={`day-${i}`}
      className="flex items-center justify-center h-12 text-sm font-medium"
    >
      {i + 1}
    </div>
  ));


  
  const [events,setEvents]=useState([]);

  //adding deadline events
  const createEvent=()=>{
    setEvents([...events,{}]);
  };

  //delete deadline event
  //filter syntax array.filter((element, index, array)=>{});
  //return true to keep the element
  //return false to remove it
  const deleteEvent=(indexDelete)=>{
    setEvents(events.filter((_,index)=>{return index!=indexDelete;}));
  };

return(
<div data-label='rightSide' className="flex flex-col w-[25%] h-fit min-w-[250px] items-center">

      {/*Progress Bar*/}
      <div data-label='progressOuterDiv' className='w-full h-[110px] px-[15px] py-[0px] flex rounded-lg'>
        <div className='flex flex-col w-full h-full rounded-lg bg-white shadow-lg border-[1px] border-gray-400 p-[10px]'>
        <p className='text-blue-500 mb-[5px] text-[0.9rem]'>Your Progress</p>
        <div>
          <p className='text-[1.2rem] mb-[5px]'>55% Completed</p>
          <div className='w-full h-[20px] rounded-full bg-gray-100 overflow-hidden border-[1px] border-gray-400'>
            <div className='w-[60%] h-full bg-gradient-to-r from-blue-300 to-bluePurple rounded-full'></div>
          </div>
        </div>
       </div>
      </div>

     <div className='w-full h-[225px] p-[15px] pb-[0px]'>
        <article data-label='calendarContainer' className='flex flex-col w-full h-full rounded-lg bg-white shadow-lg border-[1px] border-gray-400 items-center p-[5px] pb-[15px]'>  
           <div data-label='weekContainer' className='mb-[5px] grid grid-cols-7 w-full h-[15%] bg-mainBlue text-white rounded-md p-[5px]'>
                       {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                                   <p key={i} className='text-[0.8rem] text-center flex items-center justify-center'>
                                     {day}
                                   </p>
                         ))
                      }
      </div>

      <div data-label='daysContainer' className='px-[5px] pt-[0px] grid grid-cols-7 grid-rows-5 gap-2 w-full h-[85%] rounded-lg'>
        {  
          //(() => { ... })()
          //This is a fancy way to write a function and run it immediately. 
          // It's called an Immediately Invoked Function Expression (IIFE).
            (() => {
                     const today = new Date();
                     const currentDay = today.getDate();
                     const currentMonth = today.getMonth(); // 0 to 11 months
                     const currentYear = today.getFullYear();
       
                      //example:- April 0, 2025, which means March 31, 2025 — the last day of March.
                     const daysInMonth =  new Date(currentYear, currentMonth + 1, 0).getDate();

                     const startDay = new Date(currentYear, currentMonth, 1).getDay();

                     //example Array.from({length:3}); would create [undefined,undefined,undefined]
                     // _ is the item (in this case, undefined, so we ignore it)
                     //key tells React which list items are which, so it can update only the parts
                     //that changed without breaking or re-rendering everything.
                     const blanks = Array.from({ length: startDay }).map((_, i) => (
                     <div className='h-fit flex items-center justify-center text-gray-400' key={`b-${i}`}>-</div>
                     ));

                     //x => ( <JSX /> )	 No return statement needed  -	Returns JSX directly
                     //x => { return <JSX />; } return statement needed  -		Explicit return needed

                     const days = Array.from({ length: daysInMonth }).map((_, i) => {
                     const dayNum = i + 1;
                     const isToday =
                     dayNum === currentDay &&
                     today.getMonth() === currentMonth &&
                     today.getFullYear() === currentYear;
                     return( //this return is for map
                     <div key={i} className={`py-[2px] h-fit flex items-center justify-center rounded-sm ${isToday ? ' text-mainBlue font-bold' : '' }`}>
                          {dayNum}
                     </div>
                     );
                  });
                      /*new Array(5): Creates an array with 5 empty slots (not undefined),
                      and you can't use .map() directly on it because the empty slots are not actual values.
                       Array.from({ length: 5 }): Creates an array with 5 undefined elements,
                      and you can use .map() to iterate and fill it with values. */
                      const bottomBlanks=Array.from({length:35-(daysInMonth+startDay)}).map((_,i)=>{
                      return(
                      <div className='h-fit flex items-center justify-center text-gray-400' key={`bb-${i}`}>-</div>
                       );
                });

                 return [...blanks, ...days,...bottomBlanks]; //returns an array of divs    
                 })() //IIFE Immediately Invoked Function Expression (IIFE).
              }
             </div>

         </article>
      </div>

      <div data-label='deadlineContainer' className='w-full h-fit p-[15px]'>
        <div data-label='innerDeadlineContainer' className='w-full min-h-[50px] h-fit rounded-lg bg-white shadow-lg border-[1px] border-b-[0px] border-gray-400 overflow-hidden'>
           <section data-label='headingSection' className='w-full h-[50px] bg-gray-800 text-white flex items-center justify-between px-[10px]'>
            <p>Upcoming Events</p><button onClick={createEvent} className='text-[1.5rem]'>+</button>
           </section>
           <section data-label='eventsSection' className='flex flex-col h-fit'>
             {
              /*onClick={deleteEvent(index)}
              This immediately calls deleteEvent(index) during rendering—
              which you don’t want because it isnt created yet (the deadline div)
              
              You need to pass a function, not call it:
              onClick={() => deleteEvent(index)}
              */
              events.map((_,index)=>(                                                                                                                                                                                                                  
               <div key={index} className='w-full h-[47px] border-b-[1px] border-gray-400 bg-white p-[5px] flex items-center'><section data-label='contentOfDeadine' className='h-full w-[95%]'></section><button className='hover:text-red-700 p-[5px]'  onClick={()=>deleteEvent(index)}>x</button></div>
              ))
             }
           </section>
        </div>
      </div>

    </div>

  );
};

export default RightSide;