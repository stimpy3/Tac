import React, { useState,useEffect,useRef } from 'react';
import Calendar from '../../calendar'; // Import the separated Calendar component
import { X } from 'lucide-react';

const RightSide=()=>{
  const [events,setEvents]=useState([]);
  const [eventCount,setEventCount]=useState(0);
  const [show,setShow]=useState(false);
  const [selectedCategory, setSelectedCategory] = useState("academic");
  const [time,setTime]=useState("");
  const categoryRef= useRef(null);
  const nameRef=useRef(null);
  const dateRef=useRef(null);

  const openPopup=()=>{
    setShow(true);
  };
  
  const closePopup=()=>{
    setShow(false);
  };



  //list of icons for deadline category
  const categoryData={
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

  
  const renderPopup=()=>{
    if(show){
      return (
  
        <div className='fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50'>
          <div className='absolute inset-0' onClick={closePopup}></div>
          <div className='bg-accentS dark:bg-daccentS2 h-[70%] w-[40%] min-w-[450px] max-h-[400px] max-w-[700px] rounded-lg shadow-lg overflow-hidden relative z-10'>
            <div className='bg-[url("/modalBG.png")] bg-cover bg-no-repeat  px-[12px] h-[60px] flex items-center justify-between border-accentBorder2 dark:border-daccentBorder2 border-b-[1px]'>
                  <div className='flex'>
                  <div>
                  <p className='text-[1.2rem] text-white font-bold'>Add a Deadline</p>
                  <p className='text-[0.7rem] text-gray-100'>Deadlines track what your brain drops</p>
                  </div>
                  </div>
                  <button onClick={closePopup} className='text-white text-[1.6rem]'><X/></button>
            </div>
            <div data-label='DeadlineEventInputContainer' className=' px-[10px] py-[20px] w-full h-[70%] flex flex-col justify-around'>
              <div className='flex flex-col'>
                <label  className="text-accentTxt dark:text-daccentTxt">event name:</label>
                <input type='text' placeholder='Max 13 characters' className='px-[5px] border-[1px] border-accentBorder2 dark:border-daccentBorder2 bg-accentS dark:bg-daccentS2 rounded text-accentTxt dark:text-daccentTxt' 
                ref={nameRef} maxlength="13" required></input>
              </div>

              <div className='flex flex-col'>
                 <label className="text-accentTxt dark:text-daccentTxt">event details:</label>
                 <textarea className='border-[1px] px-[5px] border-accentBorder2 dark:border-daccentBorder2 bg-accentS dark:bg-daccentS2 rounded text-accentTxt dark:text-daccentTxt'></textarea> 
              </div>

              <div className='flex justify-between'>
                  <div className='flex'>
                     <label className="text-accentTxt dark:text-daccentTxt">date:</label>
                     <input type='date' className='ml-[5px] px-[5px] border-[1px] border-accentBorder2 dark:border-daccentBorder2 rounded bg-accentS dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt'
                     ref={dateRef}></input>
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
                <button onClick={createEvent} className='bg-gradient-to-r from-accent0 via-accent1 to-accent0 w-full text-white px-4 py-2 rounded'>Create</button>
                <button onClick={closePopup} className=' w-full px-4 py-2 rounded text-white bg-black '>Cancel</button>
            </div>

          </div>
        </div>
      );
    }
    
    else{
      return null;
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
  if(show){
     document.body.style.overflowY='hidden';
  }
  else{
    document.body.style.overflowY='auto';
  }

  //cleanup!!!!!!
  /*With cleanup: FIXED
  Open overlay → scroll is locked
  Close overlay → cleanup runs → scroll is restored
  Problem scenario:
   User opens modal (show = true) → scroll gets disabled
   User navigates to different page → ModalComponent gets completely destroyed
   useEffect never runs again because component is gone!
  */
  return () => {
    document.body.style.overflowY= 'auto';
  };
  },[show]); //useeffect will run if anything in the dependency array changes



  const [sunmoon,setSunmoon]=useState("");
  const [sky,setSky]=useState("");
  const [text,setText]=useState("");
  const [daystate,setDaystate]=useState("");

useEffect(()=>{
  const now =new Date();
    
    let hours24 = (now.getHours()).toString(); // 0-23
    let hours12 = (hours24 % 12 || 12).toString();// 0-12 clock
    let min = now.getMinutes();
    let ampm=(now.getHours()<12)?"AM":"PM";
    let formattedMin=((min<10)?min.toString().padStart(2,"0"):min.toString());
    setTime(hours12+":"+formattedMin+" "+ampm);

    if(now.getHours()>=0 && now.getHours()<4){ //night 12am-4am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#3d3d3d,black)]"); 
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Night");
    }
    else if(now.getHours()>=4 && now.getHours()<6){ //early early morn 4am-6am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Morning");
    }
    else if(now.getHours()>=6 && now.getHours()<9){ //early morn 6am-9am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Morning");
    }
    else if(now.getHours()>=9 && now.getHours()<12){//morn  9am-12pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
      setText("text-white");
      setDaystate("Morning");
    }
    else if(now.getHours()>=12 && now.getHours()<15){ //afternoon 12pm-3pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#adc6ed)]");
      setSunmoon("bg-[#fffee2]");
      setText("text-black");
      setDaystate("Afternoon");
    }
    else if(now.getHours()>=15 && now.getHours()<17){//after afternoon 3pm-5pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
      setText("text-white");
      setDaystate("Afternoon");
    }
    else if(now.getHours()>=17 && now.getHours()<19){//eve 5pm-7pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Evening");
    }
    else if(now.getHours()>=19 && now.getHours()<21){//early night 7pm-9pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Night");
      
    }
    else if(now.getHours()>=21 && now.getHours()<=23){//night 9pm-12am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#3d3d3d,black)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Night");
    }
 
    

  const interval = setInterval(() => {
    const now =new Date();
    let hours24 = (now.getHours()).toString(); // 0-23
    let hours12 = (hours24 % 12 || 12).toString();// 0-12 clock
    let min = now.getMinutes();
    let ampm=(now.getHours()<12)?"AM":"PM";
    let formattedMin=((min<10)?min.toString().padStart(2,"0"):min.toString());
    setTime(hours12+":"+formattedMin+" "+ampm);
    
    if(now.getHours()>=0 && now.getHours()<4){ //night 12am-4am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#3d3d3d,black)]"); 
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Night");
    }
    else if(now.getHours()>=4 && now.getHours()<6){ //early early morn 4am-6am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Morning");
    }
    else if(now.getHours()>=6 && now.getHours()<9){ //early morn 6am-9am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Morning");
    }
    else if(now.getHours()>=9 && now.getHours()<12){//morn  9am-12pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
      setText("text-white");
      setDaystate("Morning");
    }
    else if(now.getHours()>=12 && now.getHours()<15){ //afternoon 12pm-3pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#adc6ed)]");
      setSunmoon("bg-[#fffee2]");
      setText("text-black");
      setDaystate("Afternoon");
    }
    else if(now.getHours()>=15 && now.getHours()<17){//after afternoon 3pm-5pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
      setText("text-white");
      setDaystate("Afternoon");
    }
    else if(now.getHours()>=17 && now.getHours()<19){//eve 5pm-7pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Evening");
    }
    else if(now.getHours()>=19 && now.getHours()<21){//early night 7pm-9pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Night");
      
    }
    else if(now.getHours()>=21 && now.getHours()<=23){//night 9pm-12am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#3d3d3d,black)]");
      setSunmoon("bg-[url('/moon.png')]");
      setText("text-white");
      setDaystate("Night");
    }
 
    
    }, 30000);
  
  return ()=> clearInterval(interval);
},[]); 

//-----------------------------------------------------------------------------------------------
//CRUD----------------------------------------------------------------------------------

//RED FLAG
//token for authentication
//This token is used to authenticate the user when making requests to the backend
//It is stored in localStorage after the user logs in
//The token is retrieved from localStorage when the component mounts
//If the token is not present, it will be an empty string
//we need tokens so only authenticated users can create or fetch deadlines.
//Without a token, the backend has no way to know which user is making the request.
//token contains the user ID and email in its payload,so your server can associate the new deadline with that user


//------------------------------------------------------------------------------------------------------
//This section is responsible for fetching all deadlines for the logged-in user when the component mounts
const [token, setToken] = useState(localStorage.getItem("token") || "");
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; //Fetch deadlines on mount
useEffect(() => {
  if (!token) return; // wait for login to set token first

  fetch(`${BACKEND_URL}/deadlines`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch deadlines");
      return res.json();
    })
    .then((data) => {
      const monthMap = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
        "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
      };
      const daysArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const eventsUI = data.map((event) => {
        const dateObj = new Date(event.date); // convert string → Date object
        const dayNumber = dateObj.getDate();
        const dayName = daysArray[dateObj.getDay()];
        const monthName = monthMap[String(dateObj.getMonth() + 1).padStart(2, "0")];

        return {
          ...event, // keep all backend fields (_id, name, date, category, etc.)
          icon: categoryData[event.category]?.icon || categoryData["other"].icon,
          color: categoryData[event.category]?.color || categoryData["other"].color,
          day: dayName,
          month: monthName,
          dayNumber: dayNumber,
        };
      });

      setEvents(eventsUI); // ✅ now events have icons/colors/dates ready for UI
      setEventCount(eventsUI.length);
    })
    .catch((err) => console.error(err));
}, [token]);


const monthMap = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
};

// Create new deadline
const createEvent = async () => {
  // 1. Get form values
  const selectedCategory = categoryRef.current.value;
  const selectedName = nameRef.current.value;
  const dateValue = dateRef.current.value; // full date string, e.g., "2025-08-16" 

  // 2. Validation
  if (!selectedName && !dateValue) {
    nameRef.current.classList.add("border-red-500");
    dateRef.current.classList.add("border-red-500");
    return;
  }
  if (!dateValue) {
    dateRef.current.classList.add("border-red-500");
    nameRef.current.classList.remove("border-red-500");
    return;
  }
  if (!selectedName) {
    nameRef.current.classList.add("border-red-500");
    dateRef.current.classList.remove("border-red-500");
    return;
  }

  // 3. Parse date info
  const dateObj = new Date(dateValue); 
  const dayNumber = dateObj.getDate(); // 16, 24, etc.
  const daysArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = daysArray[dateObj.getDay()];
  const monthName = monthMap[dateValue.slice(5, 7)];

  // 4. Prepare object to send to backend (matches schema)
  const newEventBackend = {
    name: selectedName,
    date: dateObj,            // full Date object
    category: selectedCategory,
    details: "",              // optional
  };

  // 🔹 Prepare object for frontend display (optimistic placeholder)
  const tempId = `temp-${Date.now()}`; // temporary ID until backend responds
  const newEventUI = {
    _id: tempId, // fake id for UI
    ...newEventBackend,
    icon: categoryData[selectedCategory]?.icon || categoryData["other"].icon,
    color: categoryData[selectedCategory]?.color || categoryData["other"].color,
    day: dayName,
    month: monthName,
    dayNumber: dayNumber,
  };

  // 🔹 Optimistically add to UI immediately
  setEvents((prev) => [...prev, newEventUI]);
  setEventCount((prev) => prev + 1);
  setShow(false);

  try {
    // 5. Send request to backend
    const res = await fetch(`${BACKEND_URL}/deadlines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEventBackend), // Send the backend object
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to create deadline");
    }

    // 6. Replace optimistic temp event with real backend response
    setEvents((prev) =>
      prev.map((e) =>
        e._id === tempId
          ? {
              ...data, // backend response includes real _id
              icon: categoryData[data.category]?.icon || categoryData["other"].icon,
              color: categoryData[data.category]?.color || categoryData["other"].color,
              day: dayName,
              month: monthName,
              dayNumber: dayNumber,
            }
          : e
      )
    );
  } catch (err) {
    console.error(err);

    // 🔹 Rollback UI if request failed
    setEvents((prev) => prev.filter((e) => e._id !== tempId));
    setEventCount((prev) => prev - 1);
  }
};

// Delete deadline
//DELETE EVENT DEADLINE
//filter syntax array.filter((element, index, array)=>{});
//return true to keep the element
//return false to remove it
const deleteEvent = async (id) => {
  // 🔹 Optimistically remove event from UI first
  const deletedEvent = events.find((e) => e._id === id); // keep backup for rollback
  setEvents((prev) => prev.filter((e) => e._id !== id));
  setEventCount((prev) => prev - 1);

  try {
    const res = await fetch(`${BACKEND_URL}/deadlines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /*
      Every HTTP request usually returns something from the server. For example:
      { "success": true }
      
      res.json() reads that response and turns it into a JavaScript object.
      If you don’t call res.json(), the response body stays “unread” — technically it won’t break the UI immediately
      but: You cannot see what the server said. Some browsers may give warnings about unused response bodies.
      If the server sends an error message in JSON, you won’t know what it said
     */
    const data = await res.json();  // consume response
    console.log(data); // log the response from the server

    // Check if the response was successful
    //res.ok ensures you don’t remove from UI if deletion failed
    if (!res.ok) throw new Error("Failed to delete deadline");

  } catch (err) {
    console.error(err);

    // 🔹 Rollback UI if deletion failed
    setEvents((prev) => [...prev, deletedEvent]);
    setEventCount((prev) => prev + 1);
    return; // stop execution here
    //without return, any code after catch runs, even though deletion failed
  }
};
  //-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------


return(
<div data-label='rightSide' className="flex flex-col w-[265px] h-fit min-w-[265px] items-center max-[985px]:flex-row ">
      <div data-label='timeOuterDiv' className=' min-w-[265px] w-full h-[170px] pl-[15px] pb-[40px] py-[0px] flex max-[985px]:hidden'>
        <div className='w-[250px] h-full rounded-xl bg-white shadow-lg border-[1px] border-accentBorder2 dark:border-daccentBorder2 overflow-hidden'>
           <div className={`relative ${sky} text-white w-full h-full 
           overflow-hidden`}>
              <div className="absolute top-[5px] left-[7px] flex flex-col">
                  <p className={` text-[1.3rem] ${text} inter`}>{time}</p>
                  <p className={`text-[0.9rem] ${text} inter`}>{daystate}</p>
              </div>
              <div className={`absolute bottom-[-25%] left-[50%] translate-x-[-50%] h-[90px] aspect-square ${sunmoon} bg-cover bg-no-repeat rounded-full shadow-xl
              centered-shadow`}></div>
           </div>
       </div>
      </div>

     {/* Calendar Component - separated from original code */}
     <Calendar />

      <div data-label='deadlineContainer' className='mt-[40px] min-w-[265px] w-full h-fit p-[15px] pr-[0px] max-[985px]:pr-[15px]'>
        {renderPopup()}
        <div data-label='innerDeadlineContainer' className='w-full min-h-[50px] h-fit rounded-lg bg-accentM dark:bg-daccentS2 shadow-lg border-[1px] border-b-[0px] border-accentBorder2 dark:border-daccentBorder2 overflow-hidden'>
           <section data-label='headingSection' className='w-full h-[50px] bg-accentS2 dark:bg-daccentM text-accentTxt2 font-medium dark:text-daccentTxt flex items-center justify-between px-[10px]'>
            <p>Upcoming Events ({eventCount})</p><button onClick={openPopup} className='text-[1.5rem] text-accent1'>+</button>
           </section>
           <section data-label='eventsSection' className='flex flex-col h-fit max-h-[300px] overflow-x-hidden overflow-y-auto'>
             {
              /*onClick={deleteEvent(index)}
              This immediately calls deleteEvent(index) during rendering—
              which you don't want because it isnt created yet (the deadline div)
              
              You need to pass a function, not call it: 
              onClick={() => deleteEvent(index)}...
              */
              events.map((event,index)=>(                                                                                                                                                                                                                  
               <div key={index} className='w-full min-h-[50px] border-b-[1px] border-accentS3 p-[5px] flex items-center'>
                  <section data-label='contentOfDeadine' className='h-full w-[95%] flex'>
                     
                      <div data-label='categoryIcon' className={`w-[40px] h-[40px] rounded flex justify-center items-center text-white ${event.color}`}>
                          <i className={event.icon}></i>
                      </div>
                      
                      <div data-label='date&Event' className='w-full h-[40px] flex'>
                        <div className="w-[40px] h-[40px] flex flex-col justify-center items-center border-r-[1.5px] border-r-accentS2 dark:border-r-daccentS3">
                          <div className='text-[0.9rem] text-accentTxt dark:text-daccentTxt'>{event.day}</div>
                          <p className='text-[0.6rem] text-accentTxt dark:text-daccentTxt'>{event.dayNumber} {event.month}</p>
                        </div>
                        <div className='pl-[10px]'>
                          <p className='h-fit text-accentTxt dark:text-daccentTxt'>{event.name}</p>
                          <div className='text-[0.7rem] text-accent2 font-bold'>
                            {(() => {
                             const today = new Date();
                             const eventDate = new Date(event.date);  // use full date from DB
                             
                             const diffTime = eventDate - today;
                             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                             
                             if (diffDays > 1) return `${diffDays} days left`;
                             if (diffDays === 1) return "1 day left";
                             if (diffDays === 0) return "Today!";
                             return "Deadline has passed";
                            })()}
                          </div>
                        </div> 
                      </div>

                  </section>
                  <button className='hover:text-bluePurple text-[1.2rem] text-accentTxt dark:text-daccentTxt' onClick={()=>deleteEvent(event._id)}><X/></button>
                  {/* event._id is id defined by mongoose when the event is created
                  It is a unique identifier for each event, so we use it to delete the correct event 
                  */}
              </div>
              ))
             }
           </section>
        </div>
      </div>


    </div>

  );
};

export default RightSide;