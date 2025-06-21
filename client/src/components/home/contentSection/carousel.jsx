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

If you mistakenly try to use useState for things that don’t need re-rendering
(like DOM elements or non-UI data), you could end up in a situation where the
 component re-renders more often than needed, causing unnecessary re-computation or UI updates.

React may re-render the component, but if you're modifying the DOM directly(document.queryselector etc)
outside React’s control, it could lead to unexpected behavior,like styles not being updated,
or DOM elements being out of sync with the state
 */

import React,{useState,useRef,useEffect} from 'react' //go inside one pair of curly braces, separated by commas
import EmptyPlaceholder from './emptyPlaceholder';
import {ChevronRight,ChevronLeft,SquarePen} from 'lucide-react';
import gsap from "gsap";

const Carousel=()=>{
  const [showVision,setShowVision]=useState(false);
  const [visions, setVisions] = useState([]);
  const [tempVision, setTempVision] = useState({
    id:"",
    details:"",
    image:null,
  });


  const carouselRef=useRef(null); /*useRef(null) initializes the reference with
   null because, initially, there’s no DOM element assigned to the reference
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

   const openVisionPopup=()=>{
    setShowVision(true);
  };
  
  const closeVisionPopup=()=>{
    setShowVision(false);
     setTempVision({ id: "", image: null, details: "" }); //Clear it
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
    if(showVision){
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
    },[showVision]); //useeffect will run if anything in the dependency array changes
 

  const handleUpload=(e)=>{ //adding image to tempVision reason is we dont wanna
    //directly update vision till e have confirmed the change after pressing create
    const file=e.target.files[0];
    const reader= new FileReader();
    reader.onload=()=>{ //asynchronous operation
       setTempVision((prev) => ({ ...prev, image: `url(${reader.result})` }));
       //...prev is used to keep the attributes:- id and details same but change only image
    };
    if (file) reader.readAsDataURL(file); //SHOULD BE WRITTEN AFTER onload 
    //if written before onload it start reading the file, then onload wont run as file already read
    //reader.readAsDataURL(file) tells the browser to convert the uploaded file into a Base64 string. 
    //Once done, reader.result holds that string so you can display the image instantly in an <img> tag.
    /*If you write reader.readAsDataURL(file); before setting reader.onload, it's like saying:
      "Clap when the video ends!" but you say this after the video has already ended — so there's no clapping.
      Set reader.onload before reading, or the "clap" (code) won't happen. */
  };

  const handleVisionDetails=(e)=>{//adding details part to tempVision
    setTempVision((prev) => ({ ...prev, details: e.target.value }));
    //...prev is used to keep the attributes:- id and image same but change only details   
  };

    
  const addVision=()=>{  //confirming changes(when create button pressed) temp vision added to visions
    const newVision = {
    id: Date.now(),
    image: tempVision.image,
    details: tempVision.details,
  };
   setVisions((prev) => [...prev, newVision]);
   setTempVision({ id: "", image: null, details: "" }); //Clear it
   setShowVision(false);
   };

   const renderVisionPopup=()=>{
    if(showVision){
      return (
  
        <div className='fixed z-[10] inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center'>
           <div className='bg-gray-100 h-[70%] w-[40%] max-h-[400px] max-w-[700px] rounded-lg shadow-lg overflow-hidden'>
            <div className='bg-[url("/modalBG.png")] bg-cover  bg-no-repeat  px-[12px] h-[60px] flex items-center justify-between border-b-gray-500 border-b-[1px]'>
                  <div className='flex'>
                  <div>
                  <p className='text-[1.2rem] text-white font-bold'>Add a Vision</p>
                  <p className='text-[0.7rem] text-gray-100'>Visualization reminds your mind where it needs to go.</p>
                  </div>
                  </div>
                  <button onClick={closeVisionPopup} className='text-white text-[1.6rem]'>x</button>
            </div>
            <div data-label='VisonInputContainer' className=' px-[10px] py-[20px] w-full h-[70%] flex flex-col justify-around'>
               <input type="file" accept="image/*" onChange={handleUpload} />
              <div className='flex flex-col'>
                 <label>vision details:</label>
                 <textarea className='border-[1px] px-[5px ]bg-white border-gray-500 rounded' onChange={handleVisionDetails}></textarea> 
              </div>
            </div>
            <div className= 'flex px-[12px] h-[15%] text-[1.1rem] space-x-[10px] justify-center items-center border-t-[1px] border-gray-500'>
                <button onClick={addVision} className='bg-gradient-to-r from-accent0 via-accent1 to-accent0 w-full text-white px-4 py-2 rounded'>Create</button>
                <button onClick={closeVisionPopup} className='bg-black w-full text-white px-4 py-2 rounded border-[1px] border-gray-600'>Cancel</button>
            </div>

          </div>
        </div>
      );
    }
    
    else{
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
  return(
    <div className="flex flex-col h-[40%] mb-[20px] my-[10px] w-full p-0">{/* heading(buttons and headin)+items */}
      <div className='flex items-center w-full h-fit justify-between'>
         <div className='flex mr-[10px] h-[80px]'><p className='flex items-center text-[1.5rem] text-accentTxt w-fit h-full whitespace-nowrap'>{ monthNames[month]} Activity</p><button onClick={openVisionPopup} className='flex items-center justify-cente ml-[5px]  h-full text-[1.5rem] text-accent1 hover:text-[2rem] hover:rotate-90 transition-all duration-300'>+</button></div>
           <svg  ref={strokeBoxRef} className=" w-full h-[80px]" viewBox="0 0 100 80" preserveAspectRatio="none">
             {/*viewBox="0 0 100 80" viewBox="minX minY width height"
              (minX, minY) → top-left corner of the viewBox 
              (0,0)=minx miny
              ●────────────► x (increasing right)
              │
              │
              ▼ y (increasing down)
              
               preserveAspectRatio="none" to stretch and shape any way you like, really important to shape it
              */}
              <path d="M 0 40 Q 50 40, 100 40" className="pathName stroke-accentBorder2 stroke-[1.5]" fill="transparent" />
           </svg>
         <div className='ml-[10px] min-w-[80px] h-[80px] flex items-center'> {/* left right button container */}
         <button onClick={scrollLeft} className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 text-accentTxt mr-[5px] hover:bg-accent1 hover:border-none hover:text-white transition-colors duration-400'><ChevronLeft/></button>
         <button onClick={scrollRight} className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 text-accentTxt hover:bg-accent1 hover:border-none hover:text-white transition-colors duration-400'><ChevronRight/></button>
         </div>
       </div>
       
        {renderVisionPopup()}
       {/*SCROLLBAR HIDE:- WE USED scroll-hide but this isnt inbuilt we defined this in our css*/}
       <div ref={carouselRef} data-label='carouselContainer' className='overflow-x-auto scrollbar-hide flex rounded-xl items-center w-full h-[350px] p-[20px] border-[3px] border-accentBorder2 border-dashed'>
           {visions.length === 0 ? (
             <div className="text-gray-500 h-full  flex items-center justify-center w-full">
              <EmptyPlaceholder />
              </div> ) 
              : ( visions.map((vision) => (
                            
                             //You can't use template literals (`${imageSrc}`) inside Tailwind className strings like that.
                             // Tailwind is a utility-first CSS framework that only 
                             // works with static class names, and won't recognize or compile dynamic values in strings.
                           <div data-label='vison' key={vision.id} className="relative flex flex-col rounded-xl pt-[30px]  shadow-purple-500/50 shadow-lg bg-[#333333]
                            h-full aspect-[4/5] text-white p-[10px] mr-[20px] bg-[url('/gradient5.png')] bg-cover bg-no-repeat">  
                             <button className="absolute bottom-[7px] left-[7px]"><SquarePen /></button>
                             <div className="absolute bottom-[5px] right-[10px] bebas-neue-regular text-[1.2rem]">day 20/30</div>         
                             <div className='w-full h-fit flex  flex-col items-center justify-center'>
                               <p  className='flex items-center justify-center w-full bebas-neue-regular text-[3rem] h-fit text-white leading-none'>Leetcode</p>
                               <p  className='text-center w-full cookie text-[1rem] h-fit text-white leading-none '>Lorem, . Magnam beatae quibusdam provident rem a nemo corporis!</p>
                             </div>
                             <div className='h-full w-full flex flex-col items-center justify-center'>
                                <p className='text-[5rem] bebas-neue-regular leading-none'>20</p>
                                <p className='text-[1rem] lobster'>tracked</p>
                             </div>
                           </div> 
                           ))
           )}
      </div>
       
    </div>
  );
};

export default Carousel;