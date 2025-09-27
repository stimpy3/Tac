/* Virtaul DOM need when we have A real DOM
Efficiency: Manipulating the real DOM is slow because the browser has to reflow
 and repaint the page after every update. This process can be time-consuming,
  especially when updating multiple elements or complex UIs.

Avoiding Unnecessary Re-renders: The Virtual DOM helps minimize unn              <select 
                ref={categoryRef}
                className='border-[1px] border-gray-500 px-[5px] py-2 bg-white dark:bg-daccentS text-black dark:text-white rounded w-fit h-[60%]'
                requiredsary updates
 by performing a "diffing" process to check which part of the UI needs to change.
  It allows React to update only the parts of the real DOM that actually need it.

useState vs useRef
useState: Displays the value on screen and triggers re-render when updated.
Example: setCount(count + 1);

useRef: Stores the value silently without re-rendering.
Example: refCount.current += 1;
Use useRef() when you want to store something across renders...
without causing re-renders, making it ideal for storing things like DOM references, 
timers, or other mutable values that don't require a UI update

If you mistakenly try to use useState for things that don't need re-rendering
(like DOM elements or non-UI data), you could end up in a situation where the
 component re-renders more often than needed, causing unnecessary re-computation or UI updates.

React may re-render the component, but if you're modifying the DOM directly(document.queryselector etc)
outside React's control, it could lead to unexpected behavior,like styles not being updated,
or DOM elements being out of sync with the state
 */

import React,{useState,useRef,useEffect} from 'react' //go inside one pair of curly braces, separated by commas
import EmptyPlaceholder from './emptyPlaceholder';
import {ChevronRight,ChevronLeft,SquarePen,X} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import gsap from "gsap";

const Carousel=()=>{
  //list of icons for task category
  const categoryData = {
    academic: {
      icon: "fa-solid fa-graduation-cap",
      color: "bg-[#4592ff]",
    },
    health: {
      icon: "fa-regular fa-heart",
      color: "bg-[#e872e8]",
    },
    career: {
      icon: "fa-solid fa-list",
      color: "bg-[#62b035]",
    },
    personal: {
      icon: "fa-solid fa-user",
      color: "bg-[#fc357d]",
    },
    other: {
      icon: "fa-solid fa-hashtag",
      color: "bg-[#685ffa]",
    }
  };

  const [showTask,setShowTask]=useState(false);
  const [tasks, setTasks] = useState([]);
  const [tempTask, setTempTask] = useState({
    id:"",
    name:"",
    description:"",
    lastMarkedDate: null,
    startDate: null,
    frequency: "",
    problemsSolved: 0,
    category: "academic"
  });

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const frequencyRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  // Function to generate projected data
  const generateProjectedData = (frequency) => {
    const data = [];
    for (let day = 0; day <= 30; day++) {
      data.push({
        day: day,
        projected: Math.floor((day / 30) * frequency),
        actual: 0
      });
    }
    return data;
  };

  // Function to generate actual data based on problems solved
  const generateActualData = (frequency, problemsSolved, elapsedDays) => {
    const data = [];
    for (let day = 0; day <= 30; day++) {
      // Calculate linear projected line: distribute weekly frequency across days
      const projected = Math.floor((day / 30) * frequency); 
      
      data.push({
        day: day,
        projected: projected,
        actual: day === elapsedDays ? problemsSolved : (day < elapsedDays ? 0 : null)
      });
    }
    return data;
  };


  const carouselRef=useRef(null); /*useRef(null) initializes the reference with
   null because, initially, there's no DOM element assigned to the reference
   Initially, carouselRef.current is null because the div hasn't been rendered yet
   */
  // Scroll left function
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -360, //scrollBy() method requires an object with left, top theres no such right or bottom
        behavior: 'smooth', // Smooth scrolling effect
      });
    }
  };

  // Scroll right function
  const scrollRight = () => {
    if (carouselRef.current) { /*If you attempt to use carouselRef.current.scrollBy(...) before 
      React has updated carouselRef.current (i.e., before the component is mounted), 
      it will be null, and trying to call methods on null would result in an error. */
      carouselRef.current.scrollBy({
        left: 360, // Adjust this value to control how much it scrolls
        behavior: 'smooth', // Smooth scrolling effect
      });
    }
  };

   const openTaskPopup=()=>{
    setShowTask(true);
  };
  
  const closeTaskPopup=()=>{
    setShowTask(false);
    setTempTask({ id: "", name: "", description: "", lastMarkedDate: null, startDate: null, frequency: "", problemsSolved: 0, category: "academic" }); //Clear it
    
    // Reset border colors
    if (nameRef.current) {
      nameRef.current.classList.remove("border-red-500");
      nameRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }
    if (descriptionRef.current) {
      descriptionRef.current.classList.remove("border-red-500");
      descriptionRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }
    if (frequencyRef.current) {
      frequencyRef.current.classList.remove("border-red-500");
      frequencyRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }
    if (categoryRef.current) {
      categoryRef.current.classList.remove("border-red-500");
      categoryRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }
  };


    //used usEffect to remove scroll feature from body when overlay present
    //syntax useEffect(,[]);
    /*The flow is:
      > show is true → sets overflowY = hidden
      > show becomes false
      > React first runs the cleanup from the previous effect (where show was true)
      > Then React runs the effect again with show = false and sets overflowY = auto
      > So you're thinking: "Well, both the cleanup and the else do the same thing." 
        That's true in this specific case. But here's the catch:
  
        In React, the cleanup function in useEffect runs when a component is removed
        from the page (unmounted). It undoes side effects like scroll locking. 
        For example, if a popup disables scrolling, the cleanup re-enables it when the popup closes.
     */
    useEffect(()=>{
    if(showTask){
       document.body.style.overflowY='hidden';
    }
    else{
      document.body.style.overflowY='auto';
    }
  
    //cleanup!!!!!!
    /*With cleanup: FIXED
    Open overlay → scroll is locked
    Close overlay → cleanup runs → scroll is restored
    */
    return () => {
      document.body.style.overflowY= 'auto';
    };
    },[showTask]); //useeffect will run if anything in the dependency array changes
 



    
  const addTask= async ()=>{  //confirming changes(when create button pressed) temp task added to tasks
    const selectedName = nameRef.current ? nameRef.current.value.trim() : "";
    const selectedDescription = descriptionRef.current ? descriptionRef.current.value.trim() : "";
  const selectedFrequency = frequencyRef.current ? frequencyRef.current.value : "";
  const selectedCategory = categoryRef.current ? categoryRef.current.value : "academic";
  const today = new Date().toISOString().split('T')[0]; // still use today for startDate but no date input
    
    // Reset all borders first
    if (nameRef.current) {
      nameRef.current.classList.remove("border-red-500");
      nameRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }
    if (descriptionRef.current) {
      descriptionRef.current.classList.remove("border-red-500");
      descriptionRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }
    if (frequencyRef.current) {
      frequencyRef.current.classList.remove("border-red-500");
      frequencyRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }
    if (categoryRef.current) {
      categoryRef.current.classList.remove("border-red-500");
      categoryRef.current.classList.add("border-accentBorder2","dark:border-daccentBorder2");
    }

    let hasError = false;

    // Check required fields
    if(selectedName === ""){
      if (nameRef.current) {
        nameRef.current.classList.remove("border-accentBorder2","dark:border-daccentBorder2");
        nameRef.current.classList.add("border-red-500");
      }
      hasError = true;
    }

    const freqNum = selectedFrequency === "" ? NaN : parseInt(selectedFrequency, 10);
    if(isNaN(freqNum) || freqNum <= 0){
      if (frequencyRef.current) {
        frequencyRef.current.classList.remove("border-accentBorder2","dark:border-daccentBorder2");
        frequencyRef.current.classList.add("border-red-500");
      }
      hasError = true;
    }

    if(!selectedCategory){
      if (categoryRef.current) {
        categoryRef.current.classList.remove("border-accentBorder2","dark:border-daccentBorder2");
        categoryRef.current.classList.add("border-red-500");
      }
      hasError = true;
    }

    if(hasError) return;
    
    // All validations passed
    const tempId = `temp-${Date.now()}`;
    const newTask = {
      id: tempId,
      name: selectedName,
      description: selectedDescription,
      lastMarkedDate: null,
      startDate: today,
      frequency: isNaN(freqNum) ? 7 : freqNum,
      problemsSolved: 0,
      category: selectedCategory,
      icon: categoryData[selectedCategory]?.icon || categoryData["other"].icon,
      color: categoryData[selectedCategory]?.color || categoryData["other"].color,
    };

    // Optimistically add to UI
    setTasks((prev) => [...prev, newTask]);
    setTempTask({ id: "", name: "", description: "", lastMarkedDate: null, startDate: null, frequency: "", problemsSolved: 0 }); //Clear it
    setShowTask(false);

    // Persist to backend
    try {
      const res = await fetch(`${BACKEND_URL}/graphtracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newTask.name,
          description: newTask.description,
          startDate: newTask.startDate,
          frequency: newTask.frequency,
          category: newTask.category,
          icon: newTask.icon,
          color: newTask.color,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create task failed');

      // Replace optimistic task with server task
      setTasks((prev) => prev.map((t) => (t.id === tempId ? {
        id: data._id || data.id || tempId,
        name: data.name,
        description: data.description,
        lastMarkedDate: data.lastMarkedDate || null,
        startDate: data.startDate || newTask.startDate,
        frequency: data.frequency,
        problemsSolved: data.problemsSolved || 0,
        category: data.category || newTask.category,
        icon: data.icon || newTask.icon,
        color: data.color || newTask.color,
      } : t)));
    } catch (err) {
      console.error('Failed to persist task:', err);
      // rollback optimistic add
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      // Optional: show toast or error
    }
   };

   const incrementCount = (taskId) => {
    // Optimistic UI: increment locally, then persist
    const today = new Date().toDateString();

    // Snapshot for rollback
    setTasks(prev => {
      const snapshot = prev.map(t => ({ ...t }));
      // apply optimistic update
      const updated = prev.map(task => task.id === taskId ? { ...task, lastMarkedDate: today, problemsSolved: (task.problemsSolved || 0) + 1 } : task);

      // Fire-and-forget async call (but handle rollback inside)
      (async () => {
        try {
          // only call backend for persisted tasks (those without temp- prefix)
          if (String(taskId).startsWith('temp-')) return;
          const res = await fetch(`${BACKEND_URL}/graphtracker/${taskId}/increment`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
          });
          if (!res.ok) throw new Error('Increment failed');
          // Optionally you could replace with server document if returned
        } catch (err) {
          console.error('Increment persist failed', err);
          // rollback by restoring snapshot
          setTasks(snapshot);
        }
      })();

      return updated;
    });
   };

   const decrementCount = (taskId) => {
    // Optimistic UI: decrement locally, then persist
    const today = new Date().toDateString();

    setTasks(prev => {
      const snapshot = prev.map(t => ({ ...t }));
      const updated = prev.map(task => task.id === taskId ? { ...task, lastMarkedDate: today, problemsSolved: Math.max(0, (task.problemsSolved || 0) - 1) } : task);

      (async () => {
        try {
          if (String(taskId).startsWith('temp-')) return;
          const res = await fetch(`${BACKEND_URL}/graphtracker/${taskId}/decrement`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
          });
          if (!res.ok) throw new Error('Decrement failed');
        } catch (err) {
          console.error('Decrement persist failed', err);
          setTasks(snapshot);
        }
      })();

      return updated;
    });
   };

   const removeTask = (taskId) => {
    // Optimistic UI: remove locally, then request delete on backend
    setTasks(prev => {
      const snapshot = prev.map(t => ({ ...t }));
      const updated = prev.filter(task => task.id !== taskId);

      (async () => {
        try {
          if (!String(taskId).startsWith('temp-')) {
            const res = await fetch(`${BACKEND_URL}/graphtracker/${taskId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              }
            });
            if (!res.ok) throw new Error('Delete failed');
          }
        } catch (err) {
          console.error('Delete persist failed', err);
          // rollback
          setTasks(snapshot);
        }
      })();

      return updated;
    });
   };

   const getElapsedDays = (startDate) => {
    if (!startDate) return 1;
    const start = new Date(startDate);
    const today = new Date();
    
    // Reset time to start of day for accurate calculation
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to start from day 1
    
    return Math.min(Math.max(diffDays, 1), 30); // Ensure minimum 1, maximum 30
   };

  const renderTaskPopup = () => {
  if (showTask) {
    return (
       <div className='fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50'>
          <div className='absolute inset-0' onClick={closeTaskPopup}></div>
          <div className='bg-accentS dark:bg-daccentS2 h-[70%] min-w-[250px] w-[40%] max-w-[800px] max-h-[400px] rounded-lg shadow-lg overflow-hidden relative z-10'>
            <div className='bg-[url("/modalBG.png")] bg-cover bg-no-repeat  px-[12px] h-[60px] flex items-center justify-between border-accentBorder2 dark:border-daccentBorder2 border-b-[1px]'>
                  <div className='flex'>
                  <div>
                  <p className='text-[1.2rem] text-white font-bold'>Add a task to track</p>
                  <p className='text-[0.7rem] text-gray-100'>Projected vs Actual: where ambition meets reality</p>
                  </div>
                  </div>
                  <button onClick={closeTaskPopup} className='text-white text-[1.6rem]'><X/></button>
            </div>
            <div data-label='DeadlineEventInputContainer' className=' px-[10px] py-[20px] w-full h-[70%] flex flex-col justify-around'>
              <div className='flex flex-col'>
                <label  className="text-accentTxt dark:text-daccentTxt">event name:</label>
                <input type='text' placeholder='Max 13 characters' className='px-[5px] border-[1px] border-accentBorder2 dark:border-daccentBorder2 bg-accentS dark:bg-daccentS2 rounded text-accentTxt dark:text-daccentTxt' 
                ref={nameRef} maxLength={13} required></input>
              </div>

              <div className='flex flex-col'>
                 <label className="text-accentTxt dark:text-daccentTxt">event details:</label>
                 <textarea ref={descriptionRef} className='border-[1px] px-[5px] border-accentBorder2 dark:border-daccentBorder2 bg-accentS dark:bg-daccentS2 rounded text-accentTxt dark:text-daccentTxt'></textarea> 
              </div>

              <div className='flex flex-col maxjustify-between'>
            {/* Date input removed intentionally; startDate will use current date automatically */}
                  <div className='flex mt-2 items-center'>
                    <label className="text-accentTxt dark:text-daccentTxt">Frequency:</label>
                    <input type='number' min='1' placeholder='e.g. 7' className='ml-[8px] w-[80px] px-[5px] border-[1px] border-accentBorder2 dark:border-daccentBorder2 rounded bg-accentS dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt' ref={frequencyRef} />
                  </div>
                  <div className='flex'>
                    <label  className="text-accentTxt dark:text-daccentTxt">Category:</label>
                    <select id="my-dropdown" name="fruits" className=' ml-[5px] border-[1px] border-accentBorder2 dark:border-daccentBorder2 bg-accentS dark:bg-daccentS2 rounded text-accentTxt dark:text-daccentTxt'
                    ref={categoryRef}>
                           <option value="academic">Academic</option>
                           <option value="health">Health & Wellness</option>
                           <option value="career">Work & Career</option>
                           <option value="personal">Personal Life</option>
                           <option value="other">Other</option>
                     </select>
                  </div>
              </div>
            </div>
            <div className='flex px-[12px] h-[15%] text-[1.1rem] space-x-5 justify-center items-center border-t-[1px] border-accentBorder2 dark:border-daccentBorder2'>
                <button onClick={addTask} className='bg-gradient-to-r from-accent0 via-accent1 to-accent0 w-full text-white px-4 py-2 rounded'>Create</button>
                <button onClick={closeTaskPopup} className=' w-full px-4 py-2 rounded text-white bg-black '>Cancel</button>
            </div>

          </div>
        </div>
    );
  } else {
    return null;
  }
};

  /*animate svg*/
  const strokeBoxRef=useRef(null);
  let path="M 0 40 Q 50 40, 100 40";
  let finalPath="M 0 40 Q 50 80, 100 40";

  useEffect(()=>{
  const el = strokeBoxRef.current;
  if (!el) return;

  const handleMove = (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // relative X inside el
    const y = e.clientY - rect.top; // 0 → 80
    const vx = (x / rect.width) * 100; //if viewBox width is set to scale of 0 to 100
    const vy = (y / rect.height) * 80; // if viewBox height is set to scale of 0 to 80
    const newPath = `M 0 40 Q ${vx} ${vy}, 100 40`;
    gsap.to(".pathName",{
      attr:{d:newPath},
      overwrite: true,
      duration: 0.2
    });
  };

  const handleLeave = () => {
    gsap.to(".pathName",{
      attr: { d: "M 0 40 Q 50 40, 100 40" },
      duration: 1,
      ease: "elastic.out(3, 0.2)",
    });
  };

  el.addEventListener("mousemove", handleMove);
  el.addEventListener("mouseleave", handleLeave);

  return () => {
    el.removeEventListener("mousemove", handleMove);
    el.removeEventListener("mouseleave", handleLeave);
  };
  },[]);
  //[] means it runs once, so it is good for setting up event listeners
  //why we needed useEffect, and why we didnt set up event listeners without useEffect
  /*strokeBoxRef.current === null;
    You're trying to attach an event listener to null. that's why it fails silently or crashes.
    Why useEffect fixes this
    React renders your component first, and after rendering, it calls useEffect.
    At that point, strokeBoxRef.current is defined
*/

  const date = new Date();
  let month = date.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return (
  <div className="flex flex-col h-[40%] mb-[20px] my-[10px] w-full p-0">{/* heading(buttons and headin)+items */}
    <div className='flex items-center w-full h-fit justify-between'>
      <div className='flex mr-[10px] h-[120px]'>
        <p className='max-[410px]:hidden flex items-center text-[1.5rem] text-accentTxt dark:text-daccentTxt w-fit h-full whitespace-nowrap'>
          {monthNames[month]} Activity
        </p>
        <p className='hidden max-[410px]:flex items-center text-[1.5rem] text-accentTxt dark:text-daccentTxt w-fit h-full whitespace-nowrap'>
          {monthNames[month].slice(0,3)} Activity
        </p>
        <button onClick={openTaskPopup} className='flex items-center justify-cente h-full text-[1.5rem] text-accent1 hover:text-[2rem] hover:rotate-90 transition-all duration-300 font-bold w-[30px] justify-center '>+</button>
      </div>
      <svg ref={strokeBoxRef} className="w-full h-[80px]" viewBox="0 0 100 80" preserveAspectRatio="none">
        <path d="M 0 40 Q 50 40, 100 40" className="pathName stroke-accentBorder2 dark:stroke-daccentBorder2 stroke-[1.5]" fill="transparent" />
      </svg>
      <div className='ml-[10px] min-w-[80px] h-[120px] flex items-center'>
        <button onClick={scrollLeft} className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt mr-[5px] hover:bg-accent1 dark:hover:bg-accent1 hover:text-white transition-colors duration-400'><ChevronLeft /></button>
        <button onClick={scrollRight} className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt hover:bg-accent1 dark:hover:bg-accent1 hover:text-white transition-colors duration-400'><ChevronRight /></button>
      </div>
    </div>

    {renderTaskPopup()}

    <div ref={carouselRef} data-label='carouselContainer' className='overflow-x-auto scrollbar-hide flex rounded-xl items-center w-full h-[350px] p-[20px] border-[3px] border-accentS2 dark:border-daccentS2 border-dashed'>
      {tasks.length === 0 ? (
        <div className="text-gray-500 h-full flex items-center justify-center w-full">
          <EmptyPlaceholder />
        </div>
      ) : ( //bg-[url('/gradient5.png')] shadow-purple-500/50 shadow-lg
        tasks.map((task) => (
          <div data-label='task' key={task.id} className="relative flex flex-col rounded-xl bg-accentM dark:bg-daccentM h-full aspect-[4/5] text-accentTxt dark:text-daccentTxt p-[10px] mr-[20px] bg-cover bg-no-repeat border-[1px] border-accentBorder2 dark:border-daccentBorder2 ">
            <div data-label='graphContainer' className='w-full h-[65%] flex items-center justify-center'>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="absolute top-[10px] right-[10px] text-accentTxt dark:text-daccentTxt hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button> 
                <ResponsiveContainer width="90%" height="90%">
                  {/*data={...} → the dataset used. Each object in your array needs keys(day, actual, projected)*/}
                  <LineChart
                    data={generateActualData(
                      task.frequency,
                      task.problemsSolved,
                      getElapsedDays(task.startDate)
                    )}
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                  >{/*margin={{...}} → padding around the chart area.
                    Example:
                    top: 0 → no extra space at the top.
                    right: 40 → adds breathing space on right.
                    storkeDasharray="3 6" means 3px dash with 6px gap */}
                    <CartesianGrid strokeDasharray="3 6" stroke="#323232ff" />
                    {/*dataKey="day" → X-axis values will be taken from data.day*/}
                    <XAxis
                      dataKey="day"
                      stroke="#818181ff" //color of Xaxis line
                      fontSize={10}
                      tick={{ fill: '#818181ff' }}//to style tick labels, fill is text color of ticks
                    />
                    <YAxis
                      stroke="#818181ff"
                      fontSize={10}
                      tick={{ fill: '#818181ff' }}
                      interval={0} // Show all ticks
                    />
                    <Tooltip
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         return (
                           <div
                             style={{
                               backgroundColor: "#2f3030ff",
                               border: "none",
                               borderRadius: "8px",
                               color: "#F9FAFB",
                               padding: "3px 3px",
                               fontSize: "1rem",   //smaller font size
                             }}
                           >
                             {payload.map((entry, index) => (
                               <div key={`item-${index}`} style={{ margin: "2px 0" }}>
                                 {entry.name}: {entry.value}
                               </div>
                             ))}
                           </div>
                         );
                       }
                       return null;
                     }}/>
                    <Legend
                      wrapperStyle={{
                        fontSize: "0.8rem",
                      }}
                      formatter={(value) => {
                        if (value === "Projected") {
                          return (
                            <span style={{ color: "#1281efff" }}>
                              Projected
                            </span>
                          );
                        }
                        if (value === "Actual") {
                          return (
                            <span style={{ color: "#680cb3" }}>
                              Actual
                            </span>
                          );
                        }
                        return value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      stroke="#1281efff"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        const day = payload.day;
                        // Only show dots every 5 days
                        if ([0, 5, 10, 15, 20, 25, 30].includes(day)) {
                          return <circle cx={cx} cy={cy} r={3} fill="#1281efff" />;
                        }
                        return null;
                      }}
                      name="Projected"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#680cb3"
                      strokeWidth={3}
                      dot={{ fill: "#680cb3", strokeWidth: 2, r: 3 }}
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
            </div>
            <div data-label='taskDescriptionContainer' className='p-[5px] h-[35%] rounded-lg bg-accentS2 dark:bg-daccentS2 w-full flex flex-col items-center justify-center'>
              <div className='w-full h-[70%]'>
                  <p className='mt-[5px] flex items-center justify-start w-full bebas-neue-regular text-[1.5rem] h-fit 
                  text-accentTxt dark:text-daccentTxt leading-none'>{task.name.length > 20 ? task.name.slice(0, 20) + "..."  : task.name}</p>
                  <p className='mt-[5px] w-full inter text-[0.8rem] h-fit 
                  text-accentTxt2 dark:text-daccentTxt  leading-none'>{task.description.length > 35 ? task.description.slice(0, 35) + "..."  : task.description}</p>
              </div>
              <div className='flex items-center justify-between w-full h-[30%]'>
                  <div className='text-[1rem] bebas-neue-regular text-accentTxt2 dark:text-daccentTxt '>DAY: {getElapsedDays(task.startDate)}/30</div>
                  <div className='flex items-center w-fit h-fit mb-[10px] justify-between'>
                    <button 
                      onClick={() => decrementCount(task.id)}
                      className='text-[0.9rem] text-red-500 bebas-neue-regular w-[26px] aspect-square mr-[8px] rounded-full border-[2px] border-red-500'
                    >
                      <i className="fa-solid fa-chevron-down"></i>
                    </button>
                    <button 
                      onClick={() => incrementCount(task.id)}
                      className='text-[0.9rem] text-blue-500 bebas-neue-regular w-[26px] aspect-square rounded-full border-blue-500 border-[2px] border-blue-500'
                    >
                      <i className="fa-solid fa-chevron-up"></i>
                    </button>
                  </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
};

export default Carousel;