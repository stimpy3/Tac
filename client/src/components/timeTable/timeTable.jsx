import React,{useState,useRef,useEffect} from 'react';
import Sidebar from '../home/sidebar'; 
import Calendar from '../calendar';
import {CalendarDays,CalendarOff,ChevronRight,ChevronLeft,Plus,X} from 'lucide-react';

const TimeTable=()=>{
  const [showCalender,setShowCalendar]=useState(false);
  const [leftDistance, setLeftDistance] = useState(0);
  const contentRef=useRef(null);

  const handleCalender=()=>{
      setShowCalendar(prev=>!prev);
  };//pok
  let width=100;

  const lines = Array.from({ length: 23 }, (_, i) => (
                     <div key={i} data-label="verticalLines" className="absolute z-[5px] min-w-[0.5px] h-[calc(100%+40px)] bg-gray-400"
                      style={{ left: `${(i+1) * width - 1}px` }}/>));


  const handleLeftScroll=()=>{
    if(contentRef.current){
      contentRef.current.scrollBy({
        left:-360,
        behavior:'smooth',
      });
    }
  };

  const handleRightScroll=()=>{
    if(contentRef.current){
      contentRef.current.scrollBy({
        left:360,
        behavior:'smooth',
      });
    }
  };

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const minsSinceMidnight = hours * 60 + minutes;
    const left = +(minsSinceMidnight * (width / 60)).toFixed(2);
    setLeftDistance(left); //cant just write set state in body gotta wrap it in a function or useEfect
    /*If you do setState directly in the body of a React component (outside of hooks like useEffect),
     it causes an infinite render loop. Here’s why:
      -React renders your component.
      -In the component body, you call setState.
      -Calling setState schedules a re-render.
      -React renders again.
      -Again, setState is called in the component body.
      -This repeats endlessly until React stops it with an error: "Too many re-renders."
      useEffect(() => { ... }) runs after every render (initial + updates).
      useEffect(() => { ... }, []) runs only once after first render. */
  }, []);

  useEffect(() => {
  if (contentRef.current) {
    contentRef.current.scrollLeft=leftDistance-200;
  }
}, [leftDistance]);
const[showTaskModal,setShowTaskModal]=useState(false);
const [tasks, setTasks] = useState([]);
const [tempTask, setTempTask] = useState({
    name:"",
    day:"Monday",
    tstart:"",
    timeend:"",
  })

const handleTaskModal=()=>{
  setTempTask({ name: "", day: "Monday", tstart: "", timeend:"" }); //Clear it
  setShowTaskModal(prev=>!prev);
};

const handleNameTemp=(e)=>{
    setTempTask((prev)=>({...prev,name: e.target.value}));
}
const handleDayTemp=(e)=>{
    setTempTask((prev)=>({...prev,day: e.target.value}));
}
const handleStartTemp=(e)=>{
    setTempTask((prev)=>({...prev,tstart: e.target.value}));
}
const handleEndTemp=(e)=>{
    setTempTask((prev)=>({...prev,timeend: e.target.value}));
}

const handleCreateTask=()=>{
  const newTask={
    name: tempTask.name,
    day: tempTask.day,
    tstart: tempTask.tstart,
    timeend: tempTask.timeend,
  };
  setTasks((prev)=>[...prev,newTask]);
  setTempTask({ name: "", day: "Monday", tstart: "", timeend:"" }); //Clear it
  setShowTaskModal(prev=>!prev);
}

const mondayTasks = () => {
  const colors = ["#81c2e3","#7d7ff0","#ba7df0","#e87df0", "#f07d96","#f09f7d","#f0de7d","#b2f07d","#7df0b8"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Monday")
        .map((task, index) => {
          const [shours, sminutes] = task.tstart.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.timeend.split(':').map(Number);
          const endTimeInMins = ehours * 60 + eminutes;

          const widthPx = (endTimeInMins - startTimeInMins) * (100/60);
          const leftPx = startTimeInMins * (100/60);

          return(   
            <div key={index} className="relative group"
                style={{ position: 'absolute',
                         left: `${leftPx}px`,
                         width: `${widthPx}px`,
                         height: "40px",
                         zIndex: 2,
                       }}>
            
                   <div data-label="visual" className="h-full rounded-lg" style={{ backgroundColor: colors[index % colors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-black p-[5px] text-white text-[0.5rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.timeend+" AM")
                                         :
                                         (((ehours==12)?ehours:ehours-12)+":"+String(eminutes).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
            </div>

          );
        })}
    </>
  );
};


const tuesdayTasks=()=>{
   const colors = ["#81c2e3","#7d7ff0","#ba7df0","#e87df0", "#f07d96","#f09f7d","#f0de7d","#b2f07d","#7df0b8"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Tuesday")
        .map((task, index) => {
          const [shours, sminutes] = task.tstart.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.timeend.split(':').map(Number);
          const endTimeInMins = ehours * 60 + eminutes;

          const widthPx = (endTimeInMins - startTimeInMins) * (100/60);
          const leftPx = startTimeInMins * (100/60);

          return(   
            <div key={index} className="absolute group"
                style={{
                         left: `${leftPx}px`,
                         width: `${widthPx}px`,
                         height: "40px",
                         zIndex: 2,
                       }}>
            
                   <div data-label="visual" className="h-full rounded-lg" style={{ backgroundColor: colors[index % colors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-black p-[5px] text-white text-[0.5rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.timeend+" AM")
                                         :
                                         (((ehours==12)?ehours:ehours-12)+":"+String(eminutes).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
            </div>

          );
        })}
    </>
  );
}

const wednesdayTasks=()=>{
   const colors = ["#81c2e3","#7d7ff0","#ba7df0","#e87df0", "#f07d96","#f09f7d","#f0de7d","#b2f07d","#7df0b8"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Wednesday")
        .map((task, index) => {
          const [shours, sminutes] = task.tstart.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.timeend.split(':').map(Number);
          const endTimeInMins = ehours * 60 + eminutes;

          const widthPx = (endTimeInMins - startTimeInMins) * (100/60);
          const leftPx = startTimeInMins * (100/60);

          return(   
            <div key={index} className="absolute group"
                style={{
                         left: `${leftPx}px`,
                         width: `${widthPx}px`,
                         height: "40px",
                         zIndex: 2,
                       }}>
            
                   <div data-label="visual" className="h-full rounded-lg" style={{ backgroundColor: colors[index % colors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-black p-[5px] text-white text-[0.5rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.timeend+" AM")
                                         :
                                         (((ehours==12)?ehours:ehours-12)+":"+String(eminutes).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
            </div>

          );
        })}
    </>
  );
}

const thursdayTasks=()=>{
   const colors = ["#81c2e3","#7d7ff0","#ba7df0","#e87df0", "#f07d96","#f09f7d","#f0de7d","#b2f07d","#7df0b8"];
  return (
    <>
      {tasks
        .filter(task => task.day === "Thursday")
        .map((task, index) => {
          const [shours, sminutes] = task.tstart.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.timeend.split(':').map(Number);
          const endTimeInMins = ehours * 60 + eminutes;

          const widthPx = (endTimeInMins - startTimeInMins) * (100/60);
          const leftPx = startTimeInMins * (100/60);

          return(   
            <div key={index} className="absolute group"
                style={{
                         left: `${leftPx}px`,
                         width: `${widthPx}px`,
                         height: "40px",
                         zIndex: 2,
                       }}>
            
                   <div data-label="visual" className="h-full rounded-lg" style={{ backgroundColor: colors[index % colors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-black p-[5px] text-white text-[0.5rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.timeend+" AM")
                                         :
                                         (((ehours==12)?ehours:ehours-12)+":"+String(eminutes).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
            </div>

          );
        })}
    </>
  );
}

const fridayTasks=()=>{
  const colors = ["#81c2e3","#7d7ff0","#ba7df0","#e87df0", "#f07d96","#f09f7d","#f0de7d","#b2f07d","#7df0b8"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Friday")
        .map((task, index) => {
          const [shours, sminutes] = task.tstart.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.timeend.split(':').map(Number);
          const endTimeInMins = ehours * 60 + eminutes;

          const widthPx = (endTimeInMins - startTimeInMins) * (100/60);
          const leftPx = startTimeInMins * (100/60);

          return(   
            <div key={index} className="absolute group"
                style={{
                         left: `${leftPx}px`,
                         width: `${widthPx}px`,
                         height: "40px",
                         zIndex: 2,
                       }}>
            
                   <div data-label="visual" className="h-full rounded-lg" style={{ backgroundColor: colors[index % colors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-black p-[5px] text-white text-[0.5rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.timeend+" AM")
                                         :
                                         (((ehours==12)?ehours:ehours-12)+":"+String(eminutes).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
            </div>

          );
        })}
    </>
  );
}

const saturdayTasks=()=>{
 const colors = ["#81c2e3","#7d7ff0","#ba7df0","#e87df0", "#f07d96","#f09f7d","#f0de7d","#b2f07d","#7df0b8"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Saturday")
        .map((task, index) => {
          const [shours, sminutes] = task.tstart.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.timeend.split(':').map(Number);
          const endTimeInMins = ehours * 60 + eminutes;

          const widthPx = (endTimeInMins - startTimeInMins) * (100/60);
          const leftPx = startTimeInMins * (100/60);

          return(   
            <div key={index} className="absolute group"
                style={{
                         left: `${leftPx}px`,
                         width: `${widthPx}px`,
                         height: "40px",
                         zIndex: 2,
                       }}>
            
                   <div data-label="visual" className="h-full rounded-lg" style={{ backgroundColor: colors[index % colors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-black p-[5px] text-white text-[0.5rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.timeend+" AM")
                                         :
                                         (((ehours==12)?ehours:ehours-12)+":"+String(eminutes).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
            </div>

          );
        })}
    </>
  );
}

const sundayTasks=()=>{
 const colors = ["#81c2e3","#7d7ff0","#ba7df0","#e87df0", "#f07d96","#f09f7d","#f0de7d","#b2f07d","#7df0b8"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Sunday")
        .map((task, index) => {
          const [shours, sminutes] = task.tstart.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.timeend.split(':').map(Number);
          const endTimeInMins = ehours * 60 + eminutes;

          const widthPx = (endTimeInMins - startTimeInMins) * (100/60);
          const leftPx = startTimeInMins * (100/60);

          return(   
            <div key={index} className="absolute group"
                style={{
                         left: `${leftPx}px`,
                         width: `${widthPx}px`,
                         height: "40px",
                         zIndex: 2,
                       }}>
            
                   <div data-label="visual" className="h-full rounded-lg" style={{ backgroundColor: colors[index % colors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-black p-[5px] text-white text-[0.5rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.timeend+" AM")
                                         :
                                         (((ehours==12)?ehours:ehours-12)+":"+String(eminutes).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
            </div>

          );
        })}
    </>
  );
}


const renderTaskModal=()=>{
return (showTaskModal)?  //gotta return where called
    <div className="absolute w-full h-full bg-gray-800 z-[50] bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
        <div className='bg-gray-100 h-[70%] w-[40%] max-h-[400px] max-w-[700px] rounded-lg shadow-lg overflow-hidden'>
            <div className='bg-[url("/modalBG.png")] bg-cover  bg-no-repeat  px-[12px] h-[60px] flex items-center justify-between border-b-gray-500 border-b-[1px]'>
                  <div className='flex'>
                  <div>
                  <p className='text-[1.2rem] text-white font-bold'>Add Event</p>
                  <p className='text-[0.7rem] text-gray-100'> turn intention into action.</p>
                  </div>
                  </div>
                  <button onClick={handleTaskModal} className='text-white text-[1.6rem]'><X /></button>
            </div>
            <div data-label='timetableInputContainer' className=' bg-gray-100 px-[15px] py-[15px] w-full h-[65%] flex flex-col justify-around'>
               <div>
                 <label>Task name:</label>
                 <input type="text" onChange={handleNameTemp} className="border-[1px] min-h-[27px] py-[2px] px-[5px] rounded-sm w-full border-gray-400"/>
               </div>

               <div className='flex justify-between'>
                <div  className='flex'>
                 <label>Day:</label>
                 <select type="text" onChange={handleDayTemp} className="ml-[5px] max-h-[27px] p-[2px] border-[1px] rounded-sm border-gray-400">
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                 </select>
                </div>
                 
                <div data-label="timeInputcontainer" className="w-fit flex flex-col h-[90px] justify-between">
                  <div className="flex justify-between">
                    <label>Start Time:</label>
                    <input type="time" onChange={handleStartTemp} className="ml-[5px] border-[1px] rounded-sm border-gray-400"/>
                 </div>
                 <div className="flex justify-between">
                    <label>End time:</label>
                    <input type="time" onChange={handleEndTemp} className="border-[1px] rounded-sm border-gray-400"/>
                 </div>
               </div>

             </div>
               
            </div>
            <div className= 'bg-gray-100 flex px-[15px] py-[15px] h-fit text-[1.1rem] space-x-5 justify-center items-center border-[1px] border-gray-300'>
                <button  onClick={handleTaskModal} className=' bg-white w-full px-4 py-2 rounded border-[1px] border-gray-400'>Cancel</button>
                <button onClick={handleCreateTask} className='bg-accent2 w-full border-[1px] border-accent2 text-accent0 px-4 py-2 rounded '>Create</button>
            </div>

          </div>
    </div>
    :
    <div className="hidden absolute w-full h-full bg-gray-800 opacity-50 blur-lg z-[15]">
    </div>     
};

    return(
        <div data-label='masterContainer' className='w-screen h-screen bg-gray-500 flex relative'>
          {renderTaskModal()}
          <button data-label='addTaskBtn' onClick={handleTaskModal} className="absolute z-[10] h-[60px] w-[60px] text-[2rem] flex items-center justify-center bg-black text-white rounded-full shadow-lg right-5 bottom-5 hover:bg-accent1 hover:rotate-90 transition-all duration-300"><Plus className="scale-110"/></button>
          <Sidebar/>
          <div data-label='outerRightContainer' className=' w-[calc(100%-85px)] ml-[85px] bg-gray-200  p-[15px] flex justify-center '>
              <div data-label='timeTableContainer'  className='h-[516px] w-[98%] flex relative border-[1px] border-black'>
              <div className={`min-w-[130px] h-full  flex flex-col items-center border-r-[1px] border-black`}> 
                <section className='flex justify-betweenitems-center w-full min-h-[40px] bg-gray-300'>
                   <button className='text-[#929292]  bg-black w-full h-full flex items-center justify-center px-[10px]' onClick={handleCalender}>{(showCalender)?<CalendarOff/>:<CalendarDays/>}</button>
                   <section data-label='scrollContainer' className='bg-gray-300 px-[5px] border-b-[1px] border-black w-[90px] h-full flex items-center justify-around text-[1.6rem]'>
                      <button onClick={handleLeftScroll} className='mr-[5px] rounded-full h-[80%] aspect-square bg-white text-accent1 hover:bg-black hover:text-accent2 transition-all duration-300 flex items-center justify-center border-[1px] border-gray-400 shadow-lg'><ChevronLeft/></button>
                      <button onClick={handleRightScroll} className='rounded-full h-[80%] aspect-square bg-white text-accent1 hover:bg-black hover:text-accent2 transition-all duration-300 flex items-center justify-center border-[1px] border-gray-400 shadow-lg'><ChevronRight/></button>
                   </section>
                </section>

                 { (showCalender)? 
                 <div className='absolute top-[40px] left-[-5px] z-10'>
                   <Calendar/>
                 </div>
                 :
                 <div className='hidden'>
                   <Calendar/>
                 </div>
                 }
                 <section data-label='daysNameContainer' className='h-[476px] w-full bg-[#BAB3F9] flex flex-col items-center text-accent0 text-[1.2rem]'>
                    <div className='h-[68px] text-[1.3rem] w-full flex items-center justify-center'>Mon</div>
                    <div className='h-[68px] text-[1.3rem] w-full flex items-center justify-center border-t-[1px] border-accent1'>Tue</div>
                    <div className='h-[68px] text-[1.3rem] w-full flex items-center justify-center border-t-[1px] border-accent1'>Wed</div>
                    <div className='h-[68px] text-[1.3rem] w-full flex items-center justify-center border-t-[1px] border-accent1'>Thu</div>
                    <div className='h-[68px] text-[1.3rem] w-full flex items-center justify-center border-t-[1px] border-accent1'>Fri</div>
                    <div className='h-[68px] text-[1.3rem] w-full flex items-center justify-center border-t-[1px] border-accent1'>Sat</div>
                    <div className='h-[68px] text-[1.3rem] w-full flex items-center justify-center border-y-[1px] border-accent1'>Sun</div>
                 </section>
              </div>

              <div data-label='contentContainer' ref={contentRef} className='min-w-[900px] overflow-y-hidden overflow-x-hidden h-full bg-gray-200 flex flex-col relative'>
                <div data-label="currentLineContainer" className="absolute z-[6] w-fit h-[480px] bottom-0 flex flex-col items-center"   style={{ left: `${leftDistance-6.5}px` }}>
                   <div data-label="currentLineCircle" className="w-[12px] h-[12px] border-[3px] border-accent1 bg-transparent rounded-full"></div>
                   <div data-label="currentLine" className="h-full w-[3px] bg-accent1"></div>
                </div>    
                {lines}
                <section data-label='timeContainer' className='overflow-y-clip w-[2400px] min-h-[40px] bg-accent3 text-white flex border-black border-b-[1px]'>
                    <div className='w-[100px] text-[1rem] flex flex-col items-center justify-center'>12-1<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>1-2<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>2-3<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>3-4<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>4-5<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>5-6<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>6-7<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>7-8<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>8-9<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>9-10<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>10-11<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>11-12<span className='text-[0.6rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>12-1<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>1-2<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>2-3<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>3-4<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>4-5<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>5-6<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>6-7<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>7-8<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>8-9<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>9-10<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>10-11<span className='text-[0.6rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center '>11-12<span className='text-[0.6rem]'>PM</span></div>

                </section>
                <section data-label='planContainer' className='flex flex-col w-[2400px] h-[476px] border-b-[1px]'>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px] relative'>
                      {mondayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px] relative'>
                      {tuesdayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px] relative'>
                      {wednesdayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px] relative'>
                      {thursdayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px] relative'>
                      {fridayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px] relative'>
                      {saturdayTasks()}        
                    </div>
                    <div className='h-[68px] w-full flex items-center py-[10px] relative'>
                      {sundayTasks()} 
                    </div>
                    
                </section>
              </div>
              
               
          </div>
          </div>
      </div>
    );
    
};

export default TimeTable;