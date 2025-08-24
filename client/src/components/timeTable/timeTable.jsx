import React,{useState,useRef,useEffect} from 'react';
import Sidebar from '../home/sidebar'; 
import Calendar from '../calendar';
import {CalendarDays,CalendarOff,ChevronRight,ChevronLeft,Plus,X,Trash} from 'lucide-react';
import Tooltip from "../tooltip";
import axios from 'axios';
import { useContext } from 'react';
import { TasksContext } from '../../contexts/tasksContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; 

// Helper to get JWT token (adjust as needed)
const getToken = () => localStorage.getItem('token');

const TimeTable=()=>{
  const { tasks } = useContext(TasksContext);
  const hoursCurr=new Date().getHours();
  const minutesCurr=new Date().getMinutes();

  const [showCalender,setShowCalendar]=useState(false);
  const [leftDistance, setLeftDistance] = useState(0);
  const contentRef=useRef(null);

  const handleCalender=()=>{
      setShowCalendar(prev=>!prev);
  };//pok
  let width=100;

  const lines = Array.from({ length: 23 }, (_, i) => (
                     <div key={i} data-label="verticalLines" className="absolute z-[5px] min-w-[0.5px] h-[calc(100%+40px)] bg-accentS3 dark:bg-accentTxt2 "
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
const [errorModal,setErrorModal]=useState(0);
const [tempTask, setTempTask] = useState({
    name:"",
    day:"Monday",
    startTime:"",
    endTime:"",
  })

const handleTaskModal=()=>{
  setTempTask({ name: "", day: "Monday", startTime: "", endTime:"" }); //Clear it
  setShowTaskModal(prev=>!prev);
  setErrorModal(0);
};

const handleNameTemp=(e)=>{
    setTempTask((prev)=>({...prev,name: e.target.value}));
}
const handleDayTemp=(e)=>{
    setTempTask((prev)=>({...prev,day: e.target.value}));
}
const handleStartTemp=(e)=>{
    setTempTask((prev)=>({...prev,startTime: e.target.value}));
}
const handleEndTemp=(e)=>{
    setTempTask((prev)=>({...prev,endTime: e.target.value}));
}


const handleCreateTask = async () => {
  const [starthours, startminutes] = tempTask.startTime.split(':').map(Number);
  const startInMins = starthours * 60 + startminutes;
  const [endhours, endminutes] = tempTask.endTime.split(':').map(Number);
  const endInMins = endhours * 60 + endminutes;

  // Check for overlaps with existing tasks on the same day
  const overlappingTask = tasks.find(existingTask => {
    if (existingTask.day !== tempTask.day) return false; // Different day, no overlap
    
    const [exStartHours, exStartMinutes] = existingTask.startTime.split(':').map(Number);
    const exStartInMins = exStartHours * 60 + exStartMinutes;
    const [exEndHours, exEndMinutes] = existingTask.endTime.split(':').map(Number);
    const exEndInMins = exEndHours * 60 + exEndMinutes;
    
    // Overlap condition: new task starts before existing ends AND new task ends after existing starts
    return (startInMins < exEndInMins && endInMins > exStartInMins);
  });

  const hasOverlap = !!overlappingTask; //Convert to boolean for easier checks

  if(tempTask.name=="" || (endInMins<startInMins) || isNaN(endInMins) || isNaN(startInMins) || hasOverlap){
    // Multiple error conditions
    if(tempTask.name=="" && ((endInMins<startInMins) || isNaN(endInMins) || isNaN(startInMins) || hasOverlap)){
      if(hasOverlap) {
        setErrorModal(5); // Name missing + overlap
      } else {
        setErrorModal(1); // Name missing + timing wrong (original)
      }
    }
    else{ 
      if(tempTask.name==""){
        setErrorModal(2); // Only name missing (original)
      }
      else if(hasOverlap) {
        setErrorModal(4); // Only overlap error
      }
      else{
        setErrorModal(3); // Only timing wrong (original)
      }
    }
  }
  else{ 
    setErrorModal(0);
    // Optimistically add task to UI
    const optimisticTask = {
      _id: Math.random().toString(36).substr(2, 9), // temp id
      name: tempTask.name,
      day: tempTask.day,
      startTime: tempTask.startTime,
      endTime: tempTask.endTime
    };
    setTasks(prev => [...prev, optimisticTask]);
    setTempTask({ name: "", day: "Monday", startTime: "", endTime:"" });
    setShowTaskModal(prev=>!prev);
    try {
      const res = await axios.post(`${BACKEND_URL}/schedules`, {
        day: tempTask.day,
        startTime: tempTask.startTime,
        endTime: tempTask.endTime,
        name: tempTask.name
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // Replace optimistic task with real one from backend
      setTasks(prev => prev.map(task =>
               task._id === optimisticTask._id
                 ? { ...res.data, startTime: res.data.startTime, endTime: res.data.endTime }
                 : task
             ));
    } catch (err) {
      // Rollback optimistic update if failed
      setTasks(prev => prev.filter(task => task._id !== optimisticTask._id));
      console.error('Failed to create schedule:', err);
    }
  }
};

const handleDeleteTask = async (id) => {
  // Optimistically remove from UI
  const deletedTask = tasks.find(task => task._id === id);
  setTasks(prev => prev.filter(task => task._id !== id));
  try {
    await axios.delete(`${BACKEND_URL}/schedules/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    // No further action needed, already removed
  } catch (err) {
    // Rollback: re-add the task if delete failed
    setTasks(prev => [...prev, deletedTask]);
    console.error('Failed to delete schedule:', err);
  }
};

// Error message function
const getErrorMessage = () => {
  switch(errorModal) {
    case 1:
      return "Please fill in the task name and fix the time inputs";
    case 2:
      return "Please enter a task name";
    case 3:
      return "End time must be after start time";
    case 4:
  // Only calculate overlapping task if we have valid time inputs
  if (!tempTask.startTime || !tempTask.endTime) {
    return "Please select valid start and end times";
  }
  
  // Check if start time is after end time
  const [starthours, startminutes] = tempTask.startTime.split(':').map(Number);
  const startInMins = starthours * 60 + startminutes;
  const [endhours, endminutes] = tempTask.endTime.split(':').map(Number);
  const endInMins = endhours * 60 + endminutes;
  
  if (endInMins <= startInMins) {
    return "End time must be after start time";
  }
  
  const overlappingTask = tasks.find(task => {
    if (task.day !== tempTask.day) return false;
    
    const [exStartHours, exStartMinutes] = task.startTime.split(':').map(Number);
    const exStartInMins = exStartHours * 60 + exStartMinutes;
    const [exEndHours, exEndMinutes] = task.endTime.split(':').map(Number);
    const exEndInMins = exEndHours * 60 + exEndMinutes;
    
    return (startInMins < exEndInMins && endInMins > exStartInMins);
  });
  
  if (overlappingTask) {
    return `Time slot conflicts with "${overlappingTask.name}" (${overlappingTask.startTime} - ${overlappingTask.endTime})`;
  } else {
    return "Time slot conflict detected";
  }

    case 5:
      return "Please fill in the task name and choose a non-conflicting time slot";
    default:
      return "";
  }
};

const mondayTasks = () => {
  const monColors = ["#8B7CB6","#B084C7","#E8A5C4","#F4D1E8","#A8D0F0","#9BB5E6","#D3E4CD","#F6EAC2","#FAD9C1"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Monday")
        .map((task, index) => {
          const [shours, sminutes] = task.startTime.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.endTime.split(':').map(Number);
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
            
                   <div data-label="visual" className="h-full rounded-lg  border-[1px] border-accentS3 dark:divide-accentTxt2" style={{ backgroundColor: monColors[index % monColors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.8rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.endTime+" AM")
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
   const tueColors =  ["#D3E4CD", "#9BB5E6", "#FAD9C1", "#F6EAC2", "#8B7CB6", "#E8A5C4", "#B084C7", "#A8D0F0", "#F4D1E8"];


  return (
    <>
      {tasks
        .filter(task => task.day === "Tuesday")
        .map((task, index) => {
          const [shours, sminutes] = task.startTime.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.endTime.split(':').map(Number);
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
            
                   <div data-label="visual" className="h-full rounded-lg border-[1px] border-accentS3 dark:divide-accentTxt2" style={{ backgroundColor: tueColors[index % tueColors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.8rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.endTime+" AM")
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
  const wedColors =   ["#FAD9C1", "#B084C7", "#F6EAC2", "#A8D0F0", "#E8A5C4", "#F4D1E8", "#9BB5E6", "#8B7CB6", "#D3E4CD"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Wednesday")
        .map((task, index) => {
          const [shours, sminutes] = task.startTime.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.endTime.split(':').map(Number);
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
            
                   <div data-label="visual" className="h-full rounded-lg border-[1px] border-accentS3 dark:divide-accentTxt2" style={{ backgroundColor: wedColors[index % wedColors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.7rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p className="text-[0.5rem]">{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.endTime+" AM")
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
  const thuColors =  ["#8B7CB6", "#A8D0F0", "#F4D1E8", "#F6EAC2", "#B084C7", "#D3E4CD", "#E8A5C4", "#9BB5E6", "#FAD9C1"];
  return (
    <>
      {tasks
        .filter(task => task.day === "Thursday")
        .map((task, index) => {
          const [shours, sminutes] = task.startTime.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.endTime.split(':').map(Number);
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
            
                   <div data-label="visual" className="h-full rounded-lg border-[1px] border-accentS3 dark:divide-accentTxt2" style={{ backgroundColor: thuColors[index % thuColors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.8rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.endTime+" AM")
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
  const friColors = ["#B084C7", "#FAD9C1", "#F4D1E8", "#9BB5E6", "#E8A5C4", "#F6EAC2", "#A8D0F0", "#D3E4CD", "#8B7CB6"];

  return (
    <>
      {tasks
        .filter(task => task.day === "Friday")
        .map((task, index) => {
          const [shours, sminutes] = task.startTime.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.endTime.split(':').map(Number);
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
            
                   <div data-label="visual" className="h-full rounded-lg border-[1px] border-accentS3 dark:divide-accentTxt2" style={{ backgroundColor: friColors[index % friColors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.8rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.endTime+" AM")
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
  const satColors = ["#F4D1E8", "#E8A5C4", "#D3E4CD", "#A8D0F0", "#F6EAC2", "#9BB5E6", "#FAD9C1", "#8B7CB6", "#B084C7"];
  return (
    <>
      {tasks
        .filter(task => task.day === "Saturday")
        .map((task, index) => {
          const [shours, sminutes] = task.startTime.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.endTime.split(':').map(Number);
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
            
                   <div data-label="visual" className="h-full rounded-lg border-[1px] border-accentBorder2 dark:border-daccentBorder2 " style={{ backgroundColor: satColors[index % satColors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute bg-daccentM dark:bg-accentM p-[5px] text-accentTxt dark:text-daccentTxt text-[0.8rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.endTime+" AM")
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
 const sunColors = ["#9BB5E6", "#FAD9C1", "#B084C7", "#D3E4CD", "#F6EAC2", "#A8D0F0", "#8B7CB6", "#E8A5C4", "#F4D1E8"];
  return (
    <>
      {tasks
        .filter(task => task.day === "Sunday")
        .map((task, index) => {
          const [shours, sminutes] = task.startTime.split(':').map(Number);
          const startTimeInMins = shours * 60 + sminutes;

          const [ehours, eminutes] = task.endTime.split(':').map(Number);
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
            
                   <div data-label="visual" className="h-full rounded-lg border-[1px] border-accentS3 dark:divide-accentTxt2" style={{ backgroundColor: sunColors[index % sunColors.length] }}>
                   </div>
                   <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.8rem] flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                     style={{ left:0, top: -20}}>
                               <p>{(task.name.length>15)?(task.name.slice(0,15)+"..."):task.name+":"}</p>
                               <p>{((Number(shours)<12)? 
                                         (((shours==0)?shours+12:shours)+":"+String(sminutes).padStart(2, '0')+" AM")
                                         :
                                         (((shours==12)?shours:shours-12)+":"+String(sminutes).padStart(2, '0')+" PM"))
                                         +"-"+
                                    ((Number(ehours)<12)? 
                                         (task.endTime+" AM")
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

//PERSONALISED ERROR CODE DEFINED AS:
  //0 for all correct
  //1 for wrong
const renderTaskModal = () => {
  return (showTaskModal) ?
    <div className="absolute w-full h-full inset-0 bg-black bg-opacity-20 z-[50] backdrop-blur-lg flex items-center justify-center">
      
      {/* Top error message for overlap */}
      {errorModal !== 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[60] font-medium">
          {getErrorMessage()}
        </div>
      )}
      
      <div className='absolute inset-0' onClick={handleTaskModal}></div>
      <div className='bg-accentS dark:bg-daccentS min-w-[450px] h-[70%] w-[40%] max-h-[400px] max-w-[700px] rounded-lg shadow-lg overflow-hidden relative z-10'>
        <div className='bg-[url("/modalBG.png")] bg-cover bg-no-repeat px-[12px] h-[60px] flex items-center justify-between border-b-gray-500 dark:border-b-daccentBorder2 border-b-[1px]'>
          <div className='flex'>
            <div>
              <p className='text-[1.2rem] text-white font-bold'>Add Event</p>
              <p className='text-[0.7rem] text-gray-100'> turn intention into action.</p>
            </div>
          </div>
          <button onClick={handleTaskModal} className='text-white text-[1.6rem]'><X /></button>
        </div>
        
        <div data-label='timetableInputContainer' className='bg-accentS dark:bg-daccentS2 px-[15px] py-[15px] w-full h-[65%] flex flex-col justify-around'>
          <div>
            <label className="text-accentTxt dark:text-daccentTxt">Task name:</label>
            <input type="text" onChange={handleNameTemp}
              className={(errorModal === 1 || errorModal === 2 || errorModal === 5) ? 
                "border-[1.5px] min-h-[27px] py-[2px] px-[5px] bg-accentS dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt placeholder-red-500 placeholder:text-[0.9rem] rounded-md w-full border-red-500"
                :
                "border-[1px] min-h-[27px] py-[2px] px-[5px] bg-accentS dark:bg-daccentS2 dark:border-daccentBorder2 text-accentTxt dark:text-daccentTxt rounded-md w-full border-accentS3"
              }
              placeholder={(errorModal === 1 || errorModal === 2 || errorModal === 5) ? "task needs to be named" : "e.g. meditation"}
            />
          </div>

          <div className='flex justify-between'>
            <div className='flex'>
              <label className="text-accentTxt dark:text-daccentTxt">Day:&nbsp;</label>
              <select type="text" onChange={handleDayTemp} className="ml-[5px] text-accentTxt dark:text-daccentTxt bg-accentS dark:bg-daccentS2 max-h-[27px] p-[2px] border-[1px] rounded-md border-accentS3 dark:border-daccentBorder2">
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
                <label className="text-accentTxt dark:text-daccentTxt">Start Time:&nbsp;</label>
                <input type="time" step="300" onChange={handleStartTemp} 
                  className={(errorModal === 0 || errorModal === 2) ? 
                    "ml-[5px] border-[1px] rounded-md bg-accentS dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt border-accentS3 dark:border-daccentBorder2"
                    :
                    "ml-[5px] border-[1.5px] rounded-md bg-accentS dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt border-red-500"
                  }/>
              </div>
              <div className="flex justify-between">
                <label className="text-accentTxt dark:text-daccentTxt">End time:&nbsp;</label>
                <input type="time" step="300" onChange={handleEndTemp} 
                  className={(errorModal === 0 || errorModal === 2) ?
                    "ml-[5px] border-[1px] rounded-md bg-accentS dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt border-accentS3 dark:border-daccentBorder2"
                    :
                    "ml-[5px] border-[1.5px] rounded-md bg-accentS dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt border-red-500"
                  }
                />
              </div>
            </div>
          </div>

          {/* Remove the error message from here since it's now at the top */}

        </div>
               
        <div className='bg-accentS dark:bg-daccentS2 flex px-[15px] py-[15px] h-fit text-[1.1rem] space-x-5 justify-center items-center border-t-[1px] border-accentS3 dark:border-daccentBorder2'>
          <button onClick={handleCreateTask} className='bg-gradient-to-r from-accent0 via-accent1 to-accent0 w-full text-white px-4 py-2 rounded'>Create</button>
          <button onClick={handleTaskModal} className='bg-black text-white w-full px-4 py-2 rounded border-[1px] border-black'>Cancel</button>
        </div>
      </div>
    </div>
    :
    <div className="hidden absolute w-full h-full bg-gray-800 opacity-50 blur-lg z-[15]">
    </div>;
};

    return(
        <div data-label='masterContainer' className='w-screen h-screen flex relative bg-accentS dark:bg-daccentS'>
          {renderTaskModal()}
          <button data-label='addTaskBtn' onClick={handleTaskModal} className="absolute z-[10] h-[60px] w-[60px] text-[2rem] flex items-center justify-center dark:bg-accentM bg-daccentM text-daccentTxt dark:text-accentTxt  rounded-full shadow-lg right-5 bottom-5 hover:bg-accent1 dark:hover:bg-accent2 hover:rotate-90 transition-all duration-300"><Plus className="scale-110"/></button>
          <Sidebar/>
          <div data-label='outerRightContainer' className=' w-[calc(100%-55px)] ml-[55px] p-[15px] flex justify-center '>
              <div data-label='timeTableContainer'  className='h-[516px] w-[98%] flex relative border-[1px] border-black'>
              <div className={`min-w-[130px] h-full  flex flex-col items-center border-r-[1px] border-black`}> 
                <section className='flex justify-betweenitems-center w-full min-h-[40px] bg-accentS2'>
                   <button className='text-accentS3 dark:text-daccentS3  bg-daccentM w-full h-full flex items-center justify-center px-[10px]' onClick={handleCalender}>{(showCalender)?<CalendarOff/>:<CalendarDays/>}</button>
                   <section data-label='scrollContainer' className='bg-accentS2 dark:bg-daccentS2 px-[5px] border-b-[1px] border-black w-[90px] h-full flex items-center justify-around text-[1.6rem]'>
                      <button onClick={handleLeftScroll} className='mr-[5px] rounded-full h-[80%] aspect-square bg-accentM  text-accent0 hover:bg-black hover:text-accent2 transition-all duration-300 flex items-center justify-center border-[1px] border-accentS3  shadow-lg'><ChevronLeft/></button>
                      <button onClick={handleRightScroll} className='rounded-full h-[80%] aspect-square bg-accentM text-accent0 hover:bg-black hover:text-accent2 transition-all duration-300 flex items-center justify-center border-[1px] border-accentS3 shadow-lg'><ChevronRight/></button>
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
                 <section data-label='daysNameContainer' className='h-[476px] w-full bg-accent2 dark:bg-daccent2 flex flex-col items-center text-accent0 text-[1.2rem]'>
                    <div className='h-[68px] text-[1.3rem] w-full flex border-t-[1px] border-accent0 justify-between'><div className="h-full bg-black text-accent2 hover:bg-red-500 hover:w-[20%] hover:text-white transition-all duration-300"><Trash className="scale-[0.7] h-full"/></div><p className="h-full w-[90%] justify-center flex items-center">Mon</p></div>
                    <div className='h-[68px] text-[1.3rem] w-full flex border-t-[1px] border-accent0 justify-between'><div className="h-full bg-black text-accent2 hover:bg-red-500 hover:text-white transition-all duration-300"><Trash className="scale-[0.7] h-full"/></div><p className="h-full w-[90%] justify-center flex items-center">Tue</p></div>
                    <div className='h-[68px] text-[1.3rem] w-full flex border-t-[1px] border-accent0 justify-between'><div className="h-full bg-black text-accent2 hover:bg-red-500 hover:text-white  transition-all duration-300"><Trash className="scale-[0.7] h-full"/></div><p className="h-full w-[90%] justify-center flex items-center">Wed</p></div>
                    <div className='h-[68px] text-[1.3rem] w-full flex border-t-[1px] border-accent0 justify-between'><div className="h-full bg-black text-accent2 hover:bg-red-500 hover:text-white transition-all duration-300"><Trash className="scale-[0.7] h-full"/></div><p className="h-full w-[90%] justify-center flex items-center">Thu</p></div>
                    <div className='h-[68px] text-[1.3rem] w-full flex border-t-[1px] border-accent0 justify-between'><div className="h-full bg-black text-accent2 hover:bg-red-500 hover:text-white transition-all duration-300"><Trash className="scale-[0.7] h-full"/></div><p className="h-full w-[90%] justify-center flex items-center">Fri</p></div>
                    <div className='h-[68px] text-[1.3rem] w-full flex border-t-[1px] border-accent0 justify-between'><div className="h-full bg-black text-accent2 hover:bg-red-500 hover:text-white transition-all duration-300"><Trash className="scale-[0.7] h-full"/></div><p className="h-full w-[90%] justify-center flex items-center">Sat</p></div>
                    <div className='h-[68px] text-[1.3rem] w-full flex border-t-[1px] border-accent0 justify-between'><div className="h-full bg-black text-accent2 hover:bg-red-500 hover:text-white transition-all duration-300"><Trash className="scale-[0.7] h-full"/></div><p className="h-full w-[90%] justify-center flex items-center">Sun</p></div>
                 </section>
              </div>

              <div data-label='contentContainer' ref={contentRef} className='min-w-[900px] overflow-y-hidden overflow-x-hidden h-full bg-accentS flex flex-col relative'>
               
                <div data-label="currentLineContainer" className=" group absolute z-[6] w-fit h-[480px] bottom-0 flex flex-col items-center"   style={{ left: `${leftDistance-6.5}px` }}>
                   <div data-label="currentLineCircle" className="w-[12px] h-[12px] border-[3px] border-accent2 bg-transparent rounded-full"></div>
                   <div data-label="currentLine" className="h-full w-[3px] bg-accent2"></div>
                   <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.7rem] whitespace-nowrap flex flex-col rounded-sm
                     z-[10] opacity-0 group-hover:opacity-70 pointer-events-none transition-opacity"
                     style={{ left:6, top: 12}}>
                               <p className="text-[0.7rem]">{((Number(hoursCurr)<12)? 
                                         (((hoursCurr==0)?hoursCurr+12:hoursCurr)+":"+String(minutesCurr).padStart(2, '0')+" AM")
                                         :
                                         (((hoursCurr==12)?hoursCurr:hoursCurr-12)+":"+String(minutesCurr).padStart(2, '0')+" PM"))
                                  }
                               </p>
                   </div>
                </div>
                   
                {lines}
                <section data-label='timeContainer' className='overflow-y-clip w-[2400px] min-h-[40px] bg-accent4 text-white flex border-black border-b-[1px]'>
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
                <section data-label='planContainer' className='flex flex-col w-[2400px] h-[476px] border-b-[1px] bg-accentS dark:bg-daccentM'>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-accentS3 dark:border-accentTxt2 py-[10px] relative'>
                      {mondayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-accentS3 dark:border-accentTxt2 py-[10px] relative'>
                      {tuesdayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-accentS3 dark:border-accentTxt2 py-[10px] relative'>
                      {wednesdayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-accentS3 dark:border-accentTxt2 py-[10px] relative'>
                      {thursdayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-accentS3 dark:border-accentTxt2 py-[10px] relative'>
                      {fridayTasks()}
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-accentS3 dark:border-accentTxt2 py-[10px] relative'>
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