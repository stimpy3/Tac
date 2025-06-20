import React, { useState,useEffect,useRef } from 'react';
import Calendar from '../../calendar'; // Import the separated Calendar component

const RightSide=()=>{
  const [events,setEvents]=useState([]);
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

 
  //VISUALLY ADD EVENT DEADLINE
  const createEvent=()=>{
    const selectedCategory=categoryRef.current.value;
    const selectedName=nameRef.current.value;
    const selectedDate=(dateRef.current.value).slice(8);
    const selectedMonth=(dateRef.current.value).slice(5,-3);
    const monthMap={
      "01":"Jan",
      "02":"Feb",
      "03":"Mar",
      "04":"Apr",
      "05":"May",
      "06":"Jun",
      "07":"Jul",
      "08":"Aug",
      "09":"Sep",
      "10":"Oct",
      "11":"Nov",
      "12":"Dec",
    };
    const monthName=monthMap[selectedMonth];
    let daysArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let monthsArray=["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const date=new Date(dateRef.current.value);//convert dte string to date object
    const dayName=daysArray[date.getDay()];
    const newEvent = {
     icon:categoryData[selectedCategory].icon,
     color:categoryData[selectedCategory].color,
     name:selectedName,
     date:selectedDate,
     month:monthName,
     day:dayName,
      // you can add other properties here like title, date, etc.
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShow(false);
  };

  //list of icons for deadline category
  const categoryData={
    academic: {
      icon: "fa-solid fa-graduation-cap",
      color: "bg-[#9ebee1]",
    },
    health: {
      icon: "fa-regular fa-heart",
      color: "bg-[#dcbcdc]",
    },
    career: {
      icon: "fa-solid fa-list",
      color: "bg-[#BBD2C5]",
    },
    personal: {
      icon: "fa-solid fa-user",
      color: "bg-[#f3c4d5]",
    },
    other: {
      icon: "fa-solid fa-hashtag",
      color: "bg-[#9f9aec]",
    }
  };

  
  const renderPopup=()=>{
    if(show){
      return (
  
        <div className='fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50'>
          <div className='bg-gray-100 bg-opacity-85 h-[70%] w-[40%] max-h-[400px] max-w-[700px] rounded-lg shadow-lg overflow-hidden'>
            <div className='bg-gradient-to-r  from-blue-400 to-purple-400 bg-opacity-100  px-[12px] h-[60px] flex items-center justify-between border-b-gray-500 border-b-[1px]'>
                  <div className='flex'>
                  <div>
                  <p className='text-[1.2rem] text-white font-bold'>Add a Deadline</p>
                  <p className='text-[0.7rem] text-gray-100'>Deadlines track what your brain drops</p>
                  </div>
                  </div>
                  <button onClick={closePopup} className='text-white text-[1.6rem]'>x</button>
            </div>
            <div data-label='DeadlineEventInputContainer' className=' px-[10px] py-[20px] w-full h-[70%] flex flex-col justify-around'>
              <div className='flex flex-col'>
                <label>event name:</label>
                <input type='text' placeholder='Max 15 characters' className='px-[5px] border-[1px] border-gray-500 bg-white bg-opacity-50 rounded' 
                ref={nameRef} maxlength="16" required></input>
              </div>

              <div className='flex flex-col'>
                 <label>event details:</label>
                 <textarea className='border-[1px] px-[5px] border-gray-500 bg-white bg-opacity-50 rounded'></textarea> 
              </div>

              <div className='flex justify-between'>
                  <div className='flex'>
                     <label>date:</label>
                     <input type='date' className='ml-[5px] px-[5px] border-[1px] border-gray-500 rounded'
                     ref={dateRef}></input>
                  </div>
                  <div className='flex'>
                    <label>Category:</label>
                    <select id="my-dropdown" name="fruits" className=' ml-[5px] border-[1px] border-gray-500 rounded'
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
            <div className='flex px-[12px] h-[15%] text-[1.1rem] space-x-5 justify-center items-center '>
                <button onClick={createEvent} className='bg-gradient-to-r  from-blue-400 to-purple-400 w-full text-white px-4 py-2 rounded'>Create</button>
                <button onClick={closePopup} className=' w-full text-gray-800 px-4 py-2 rounded border-[1px] border-gray-600 bg-white bg-opacity-50 '>Cancel</button>
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
  */
  return () => {
    document.body.style.overflowY= 'auto';
  };
  },[show]); //useeffect will run if anything in the dependency array changes

  //DELETE EVENT DEADLINE
  //filter syntax array.filter((element, index, array)=>{});
  //return true to keep the element
  //return false to remove it
  const deleteEvent=(indexDelete)=>{
    setEvents(events.filter((_,index)=>{return index!=indexDelete;}));
  };

  const [sunmoon,setSunmoon]=useState("");
  const [sky,setSky]=useState("");

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
    }
    else if(now.getHours()>=4 && now.getHours()<6){ //early early morn 4am-6am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=6 && now.getHours()<9){ //early morn 6am-9am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=9 && now.getHours()<12){//morn  9am-12pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
    }
    else if(now.getHours()>=12 && now.getHours()<15){ //afternoon 12pm-3pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#adc6ed)]");
      setSunmoon("bg-[#fffee2]");
    }
    else if(now.getHours()>=15 && now.getHours()<17){//after afternoon 3pm-5pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
    }
    else if(now.getHours()>=17 && now.getHours()<19){//eve 5pm-7pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=19 && now.getHours()<21){//early night 7pm-9pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=21 && now.getHours()<=23){//night 9pm-12am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#3d3d3d,black)]");
      setSunmoon("bg-[url('/moon.png')]");
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
    }
    else if(now.getHours()>=4 && now.getHours()<6){ //early early morn 4am-6am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=6 && now.getHours()<9){ //early morn 6am-9am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=9 && now.getHours()<12){//morn  9am-12pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
    }
    else if(now.getHours()>=12 && now.getHours()<15){ //afternoon 12pm-3pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#adc6ed)]");
      setSunmoon("bg-[#fffee2]");
    }
    else if(now.getHours()>=15 && now.getHours()<17){//after afternoon 3pm-5pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]");
      setSunmoon("bg-[#fffee2]");
    }
    else if(now.getHours()>=17 && now.getHours()<19){//eve 5pm-7pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#b663bf,#3c72c9)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=19 && now.getHours()<21){//early night 7pm-9pm
      setSky("bg-[radial-gradient(circle_at_50%_100%,#2e2a4f,#463366)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    else if(now.getHours()>=21 && now.getHours()<=23){//night 9pm-12am
      setSky("bg-[radial-gradient(circle_at_50%_100%,#3d3d3d,black)]");
      setSunmoon("bg-[url('/moon.png')]");
    }
    
    }, 30000);
  
  return ()=> clearInterval(interval);
},[]); 
 /* bg-[radial-gradient(circle_at_50%_100%,#8f4d96,#75c7fa)]  bg-[url("/moon.png")] early morn 4-8
    bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#749acf)]  bg-[#fffee2] morning             8-12    
    bg-[radial-gradient(circle_at_50%_100%,#d4d6bc,#7accff)]  bg-[#fffee2] afternoon           12-16
    bg-[radial-gradient(circle_at_50%_100%,#8f4d96,#2c6695)]  bg-[url("/moon.png")] eve        16-20
    bg-[radial-gradient(circle_at_50%_100%,#3d3d3d,black)]    bg-[url("/moon.png")] night      20-4
  */

return(
<div data-label='rightSide' className="flex flex-col w-[265px] h-fit min-w-[265px] items-center">
     {/*Progress Bar*/}
      <div data-label='progressOuterDiv' className=' min-w-[265px] w-full h-[110px] pl-[15px] py-[0px] flex'>
        <div className='w-[250px] h-full bg-white shadow-lg border-[1px] border-gray-400 rounded-lg p-[5px]'>
           <div className={`relative ${sky} text-white w-full h-full rounded-md
           overflow-hidden`}>
              <p className='absolute top-[2px] left-[5px] text-[1.2rem] inter'>{time}</p>
              <div className={`absolute bottom-[-50%] left-[50%] translate-x-[-50%] h-[90px] aspect-square ${sunmoon} bg-cover bg-no-repeat rounded-full shadow-xl
              centered-shadow`}></div>
           </div>
       </div>
      </div>

     {/* Calendar Component - separated from original code */}
     <Calendar />

      <div data-label='deadlineContainer' className=' min-w-[265px] w-full h-fit p-[15px] pr-[0px]'>
        {renderPopup()}
        <div data-label='innerDeadlineContainer' className='w-full min-h-[50px] h-fit rounded-lg bg-white shadow-lg border-[1px] border-b-[0px] border-gray-400 overflow-hidden'>
           <section data-label='headingSection' className='w-full h-[50px] bg-black text-white flex items-center justify-between px-[10px]'>
            <p>Upcoming Events</p><button onClick={openPopup} className='text-[1.5rem]'>+</button>
           </section>
           <section data-label='eventsSection' className='flex flex-col h-fit max-h-[150px] overflow-x-hidden overflow-y-auto'>
             {
              /*onClick={deleteEvent(index)}
              This immediately calls deleteEvent(index) during rendering—
              which you don't want because it isnt created yet (the deadline div)
              
              You need to pass a function, not call it: 
              onClick={() => deleteEvent(index)}...
              */
              events.map((event,index)=>(                                                                                                                                                                                                                  
               <div key={index} className='w-full min-h-[50px] border-b-[1px] border-gray-400 p-[5px] flex items-center'>
                  <section data-label='contentOfDeadine' className='h-full w-[95%] flex'>
                     
                      <div data-label='categoryIcon' className={`w-[40px] h-[40px] rounded flex justify-center items-center text-white ${event.color}`}>
                          <i className={event.icon}></i>
                      </div>
                      
                      <div data-label='date&Event' className='w-full h-[40px] flex'>
                        <div className="w-[40px] h-[40px] flex flex-col justify-center items-center border-r-[1.5px] border-r-gray-300">
                          <div className='text-[0.9rem]'>{event.day}</div>
                          <p className='text-[0.6rem] text-black'>{event.date} {event.month}</p>
                        </div>
                        <div className='pl-[10px]'>
                          <p className='h-fit'>{event.name}</p>
                          <div className='text-[0.7rem] text-gray-800'>{((parseInt(event.date) - new Date().getDate())>=0)?`${(parseInt(event.date) - new Date().getDate())} days left`:"deadline has passed"}</div>
                        </div> 
                      </div>

                  </section>
                  <button className='hover:text-bluePurple text-[1.2rem]'  onClick={()=>deleteEvent(index)}>x</button>
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