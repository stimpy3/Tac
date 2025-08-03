/* Virtaul DOM need when we have A real DOM
Efficiency: Manipulating the real DOM is slow because the browser has to reflow
 and repaint the page after every update. This process can be time-consuming,
  especially when updating multiple elements or complex UIs.

Avoiding Unnecessary Re-renders: The Virtual DOM helps minimize unnecessary updates
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

    

  const [showTask,setShowTask]=useState(false);
  const [tasks, setTasks] = useState([]);
  const [tempTask, setTempTask] = useState({
    id:"",
    name:"",
    description:"",
    streak: 0,
    lastMarkedDate: null,
    startDate: null,
    frequency: "",
    problemsSolved: 0,
  });

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const startDateRef = useRef(null);
  const frequencyRef = useRef(null);

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
    setTempTask({ id: "", name: "", description: "", streak: 0, lastMarkedDate: null, startDate: null, frequency: "", problemsSolved: 0 }); //Clear it
    
    // Reset border colors
    if (nameRef.current) {
      nameRef.current.classList.remove("border-red-500");
      nameRef.current.classList.add("border-gray-500");
    }
    if (descriptionRef.current) {
      descriptionRef.current.classList.remove("border-red-500");
      descriptionRef.current.classList.add("border-gray-500");
    }
    if (startDateRef.current) {
      startDateRef.current.classList.remove("border-red-500");
      startDateRef.current.classList.add("border-gray-500");
    }
    if (frequencyRef.current) {
      frequencyRef.current.classList.remove("border-red-500");
      frequencyRef.current.classList.add("border-gray-500");
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
 



    
  const addTask=()=>{  //confirming changes(when create button pressed) temp task added to tasks
    const selectedName = nameRef.current.value;
    const selectedDescription = descriptionRef.current.value;
    const selectedStartDate = startDateRef.current.value;
    const selectedFrequency = frequencyRef.current.value;
    
    // Validation checks
    if(selectedName == "" && selectedDescription == "" && selectedStartDate == "" && selectedFrequency == ""){
      // All fields empty
      nameRef.current.classList.remove("border-gray-500");
      nameRef.current.classList.add("border-red-500");
      descriptionRef.current.classList.remove("border-gray-500");
      descriptionRef.current.classList.add("border-red-500");
      startDateRef.current.classList.remove("border-gray-500");
      startDateRef.current.classList.add("border-red-500");
      frequencyRef.current.classList.remove("border-gray-500");
      frequencyRef.current.classList.add("border-red-500");
      return;
    }
    else if(selectedName == ""){
      // Only name missing
      nameRef.current.classList.remove("border-gray-500");
      nameRef.current.classList.add("border-red-500");
      descriptionRef.current.classList.remove("border-red-500");
      descriptionRef.current.classList.add("border-gray-500");
      startDateRef.current.classList.remove("border-red-500");
      startDateRef.current.classList.add("border-gray-500");
      frequencyRef.current.classList.remove("border-red-500");
      frequencyRef.current.classList.add("border-gray-500");
      return;
    }
    else if(selectedDescription == ""){
      // Only description missing
      nameRef.current.classList.remove("border-red-500");
      nameRef.current.classList.add("border-gray-500");
      descriptionRef.current.classList.remove("border-gray-500");
      descriptionRef.current.classList.add("border-red-500");
      startDateRef.current.classList.remove("border-red-500");
      startDateRef.current.classList.add("border-gray-500");
      frequencyRef.current.classList.remove("border-red-500");
      frequencyRef.current.classList.add("border-gray-500");
      return;
    }
    else if(selectedStartDate == ""){
      // Only start date missing
      nameRef.current.classList.remove("border-red-500");
      nameRef.current.classList.add("border-gray-500");
      descriptionRef.current.classList.remove("border-red-500");
      descriptionRef.current.classList.add("border-gray-500");
      startDateRef.current.classList.remove("border-gray-500");
      startDateRef.current.classList.add("border-red-500");
      frequencyRef.current.classList.remove("border-red-500");
      frequencyRef.current.classList.add("border-gray-500");
      return;
    }
    else if(selectedFrequency == ""){
      // Only frequency missing
      nameRef.current.classList.remove("border-red-500");
      nameRef.current.classList.add("border-gray-500");
      descriptionRef.current.classList.remove("border-red-500");
      descriptionRef.current.classList.add("border-gray-500");
      startDateRef.current.classList.remove("border-red-500");
      startDateRef.current.classList.add("border-gray-500");
      frequencyRef.current.classList.remove("border-gray-500");
      frequencyRef.current.classList.add("border-red-500");
      return;
    }
    else if(isNaN(selectedFrequency) || selectedFrequency <= 0){
      // Frequency is not a valid number
      nameRef.current.classList.remove("border-red-500");
      nameRef.current.classList.add("border-gray-500");
      descriptionRef.current.classList.remove("border-red-500");
      descriptionRef.current.classList.add("border-gray-500");
      startDateRef.current.classList.remove("border-red-500");
      startDateRef.current.classList.add("border-gray-500");
      frequencyRef.current.classList.remove("border-gray-500");
      frequencyRef.current.classList.add("border-red-500");
      return;
    }
    
    // All validations passed
    const newTask = {
    id: Date.now(),
    name: selectedName,
    description: selectedDescription,
    streak: 0,
    lastMarkedDate: null,
    startDate: selectedStartDate,
    frequency: parseInt(selectedFrequency),
    problemsSolved: 0,
  };
   setTasks((prev) => [...prev, newTask]);
   setTempTask({ id: "", name: "", description: "", streak: 0, lastMarkedDate: null, startDate: null, frequency: "", problemsSolved: 0 }); //Clear it
   setShowTask(false);
   };

   const markToday = (taskId) => {
    const today = new Date().toDateString();
    console.log('Marking today for task:', taskId, 'Date:', today);
    
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        console.log('Current task:', task.name, 'Problems solved:', task.problemsSolved, 'Last marked:', task.lastMarkedDate);
        
        const lastMarked = task.lastMarkedDate ? new Date(task.lastMarkedDate).toDateString() : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        console.log('Last marked:', lastMarked, 'Today:', today, 'Yesterday:', yesterdayString);
        
        // Always increment problems solved
        let newProblemsSolved = task.problemsSolved + 1;
        let newStreak = task.streak;
        let newLastMarkedDate = task.lastMarkedDate;
        
        // Handle streak logic
        if (lastMarked === today) {
          // Already marked today, just increment problems solved, keep same streak
          console.log('Already marked today, incrementing problems only');
        } else if (lastMarked === yesterdayString) {
          // Marked yesterday, increment streak and problems solved
          console.log('Marked yesterday, incrementing streak and problems');
          newStreak = task.streak + 1;
          newLastMarkedDate = today;
        } else {
          // Not marked yesterday, reset streak to 1 and add problems solved
          console.log('Not marked yesterday, resetting streak to 1 and adding problems');
          newStreak = 1;
          newLastMarkedDate = today;
        }
        
        return { 
          ...task, 
          streak: newStreak, 
          lastMarkedDate: newLastMarkedDate,
          problemsSolved: newProblemsSolved
        };
      }
      return task;
    }));
   };

   const removeTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
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
      <div className='fixed z-[10] inset-0 bg-black  bg-opacity-20 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute inset-0' onClick={closeTaskPopup}></div>
        <div className='bg-gray-100 dark:bg-daccentS h-[70%] w-[40%] max-h-[400px] max-w-[700px] rounded-lg shadow-lg overflow-hidden relative z-10'>
          <div className='bg-[url("/modalBG.png")] bg-cover bg-no-repeat px-[12px] h-[60px] flex items-center justify-between border-b-gray-500 border-b-[1px]'>
            <div className='flex'>
              <div>
                <p className='text-[1.2rem] text-white font-bold'>Add a Task</p>
                <p className='text-[0.7rem] text-gray-100'>Track your progress and build streaks.</p>
              </div>
            </div>
            <button onClick={closeTaskPopup} className='text-white text-[1.6rem]'><X/></button>
          </div>
          <div data-label='TaskInputContainer' className='px-[10px] py-[20px] w-full h-[70%] flex flex-col justify-between'>
            <div className='flex flex-col h-[20%]'>
              <label className='text-accentTxt dark:text-daccentTxt mb-2'>Task Name:</label>
              <input 
                type="text" 
                className='border-[1px] px-[5px] py-2 bg-white dark:bg-daccentS text-black dark:text-white border-gray-500 rounded h-[60%]' 
                placeholder="e.g., LEETCODE"
                ref={nameRef}
                required
              />
            </div>
            <div className='flex flex-col h-[35%]'>
              <label className='text-accentTxt dark:text-daccentTxt mb-2'>Description:</label>
              <textarea 
                className='border-[1px] px-[5px] py-2 bg-white dark:bg-daccentS text-black dark:text-white border-gray-500 rounded resize-none h-[80%]' 
                placeholder="Brief description of your task..."
                ref={descriptionRef}
                required
              ></textarea>
            </div>
            <div className='flex items-center h-[15%]'>
              <label className='text-accentTxt dark:text-daccentTxt mr-[5px]'>Start Date:</label>
              <input 
                type="date" 
                className='border-[1px] px-[5px] py-2 bg-white dark:bg-daccentS text-black dark:text-white border-gray-500 rounded w-fit h-[60%]' 
                ref={startDateRef}
                required
              />
            </div>
            <div className='flex items-center h-[15%]'>
              <label className='text-accentTxt dark:text-daccentTxt mr-[5px]'>Frequency:</label>
              <input 
                type="number" 
                className='border-[1px] px-[5px] py-2 bg-white dark:bg-daccentS text-black dark:text-white border-gray-500 rounded w-fit h-[60%]' 
                placeholder="e.g.,20 (frequency per 30days)"
                ref={frequencyRef}
                min="1"
                required
              />
            </div>
          </div>
          <div className='flex px-[12px] h-[15%] text-[1.1rem] space-x-[10px] justify-center items-center border-t-[1px] border-gray-500'>
            <button onClick={addTask} className='bg-gradient-to-r from-accent0 via-accent1 to-accent0 w-full text-white px-4 py-2 rounded'>Create</button>
            <button onClick={closeTaskPopup} className='bg-black w-full text-white px-4 py-2 rounded border-[1px] border-gray-600'>Cancel</button>
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
  strokeBoxRef.current.addEventListener("mousemove", (e) => {
  const rect = strokeBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // relative X inside strokeBoxRef.current
    const y = e.clientY - rect.top; // 0 → 80
    const vx =  (x/ rect.width) * 100    //if viewBox width is set to scale of 0 to 100
     const vy = (y / rect.height) * 80; // if viewBox height is set to scale of 0 to 80
  path=`M 0 40 Q ${vx} ${vy}, 100 40`;
  gsap.to(".pathName",{
    attr:{d:path}
   });
  });

  strokeBoxRef.current.addEventListener("mouseleave", (dets) => {
  gsap.to(".pathName",{
     attr: { d: "M 0 40 Q 50 40, 100 40" },
      duration: 1,
      ease: "elastic.out(3, 0.2)", //3 is amplitude , 0.2 smalle the value tighter and more bounces more elastic
   });
  });
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
        <p className='flex items-center text-[1.5rem] text-accentTxt dark:text-daccentTxt w-fit h-full whitespace-nowrap'>
          {monthNames[month]} Activity
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
          <div data-label='task' key={task.id} className="relative flex flex-col rounded-xl bg-accentM dark:bg-daccentM h-full aspect-[4/5] text-accentTxt dark:text-daccentTxt p-[10px] mr-[20px] bg-cover bg-no-repeat">
            <div data-label='graphContainer' className='w-full h-[65%] flex items-center justify-center'>
               <div className="absolute top-[10px] left-[10px] text-[1rem] bebas-neue-regular">{task.streak}🔥</div>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="absolute top-[10px] right-[10px] text-accentTxt dark:text-daccentTxt hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button> 
                <ResponsiveContainer width="90%" height="90%">
                  <LineChart data={generateActualData(task.frequency, task.problemsSolved, getElapsedDays(task.startDate))}
                   margin={{ top: 0, right: 40, bottom: 0, left: 0 }} >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9CA3AF"
                      fontSize={10}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={10}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB',
                        opacity: 0.7 ,
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#9CA3AF', fontSize: '10px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projected" 
                      stroke="#6B7280" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        const day = payload.day;
                        // Only show dots every 5 days
                        if ([0, 5, 10, 15, 20, 25, 30].includes(day)) {
                          return <circle cx={cx} cy={cy} r={3} fill="#6B7280" />;
                        }
                        return null;
                      }}
                      name="Projected"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#60A5FA" 
                      strokeWidth={1.5}
                      dot={{ fill: '#60A5FA', strokeWidth: 1, r: 3 }}
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
                  text-accentTxt dark:text-daccentTxt leading-none'>{task.description.length > 35 ? task.description.slice(0, 35) + "..."  : task.description}</p>
              </div>
              <div className='flex items-center justify-between w-full h-[30%]'>
                  <div className='text-[1rem] bebas-neue-regular'>DAY: {getElapsedDays(task.startDate)}/30</div>
                  <button 
                    onClick={() => markToday(task.id)}
                    className='text-[1rem] bebas-neue-regular bg-accent1 text-white p-[2px] px-[5px] rounded hover:bg-accent0 transition-colors'
                  >
                    MARK TODAY +
                  </button>
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