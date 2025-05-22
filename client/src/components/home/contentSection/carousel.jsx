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

import React,{useState,useRef} from 'react' //go inside one pair of curly braces, separated by commas
import EmptyPlaceholder from './emptyPlaceholder';


const Carousel=()=>{
  const [topics,setTopics]=useState([]);//default hold empty array like useState(0) sets default 0
  const addTopic=()=>{
    setTopics([...topics,{title:"New Topic"}]); 
    /*Without the {}, you might be trying to add undefined or just an empty element,
     which doesn't have the expected structure for your rendering logic (e.g., 
     mapping over topics.map).
     React expects something valid to update the UI correctly, 
     so setTopics([...topics]) will not update the state properly 
     without adding a value like {} or something valid.

     example setTopics([...topics, "New Topic"]);This would add a string
     But using {} (an empty object) is often preferred because:
     It's a valid object and is more flexible. You can later add properties 
     (like title, progress, etc.) to that object.
     Strings or other types like numbers are harder to work with because they don't
    allow for expansion (like adding title or progress).
  */
   };

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
  let start=56; let current=58;  let max=70;
  let currentString=current+"Kg"
  let per=100-((((max-current)*1.0)/(max-start))*100)
  const[percentage,setPercentage]=useState(Number(per.toFixed(0)));
  const badges={
    1: "./badges/bronze.png",

    2:"./badges/silver.png",

    3: "./badges/frost.png",

    4:"./badges/orilith.png",

    5: "./badges/solite.png",
  };
  let badgeIndex=-1;
  if(percentage>=0 && percentage<20){
    badgeIndex=1;
  }
  else if(percentage>=20 && percentage<40){
    badgeIndex=2;
  }
  else if(percentage>=40 && percentage<60){
    badgeIndex=3;
  }
  else if(percentage>=60 && percentage<80){
    badgeIndex=4;
  }
  else if(percentage>=80 && percentage<100){
     badgeIndex=5;
  }
  


  return(
    <div className="flex flex-col h-[40%] w-full p-0">{/* heading(buttons and headin)+items */}
      <div className='flex items-center w-full h-fit justify-between'>
         <div className='flex mr-[10px] h-[30px]'><p className='flex items-center text-[1.5rem] w-fit h-full whitespace-nowrap'>Progress Tracker</p><button onClick={addTopic} className='flex items-center justify-cente ml-[5px]  h-full text-[1.5rem] text-gray-700 hover:text-blue-500'>+</button></div>
         <div className="h-[2px] w-full bg-gray-300"></div> {/* partition line */}
         <div className='ml-[10px] min-w-[60px]'> {/* left right button container */}
         <button onClick={scrollLeft} className='border-[1px] border-gray-500 shadow-lg w-[25px] rounded-full bg-gray-300 mr-[5px] hover:bg-blue-500 hover:border-none hover:text-white transition-colors duration-400'>&lt;</button>
         <button onClick={scrollRight} className='border-[1px] border-gray-500 shadow-lg w-[25px] rounded-full bg-gray-300 hover:bg-blue-500 hover:border-none hover:text-white transition-colors duration-400'>&gt;</button>
         </div>
       </div>
       <div ref={carouselRef} data-label='carouselContainer'className='carousel-container overflow-x-auto scrollbar-hide flex items-center w-full h-[calc(100vh-280px)] pb-[20px]'>
           {topics.length === 0 ? (
             <div className="text-gray-500 pt-[0px] p-[10px] flex items-start justify-center w-full">
              <EmptyPlaceholder />
              </div> ) 
              : ( topics.map((topic, index) => (
                           <div data-label='progresspage' key={index} className="flex flex-col card-base bg-white w-[350px] text-black p-[10px] mr-[20px] h-[210px] rounded">
                                <section  data-label="badge&TitleContainer" className="flex h-[55%] pb-[10px]">
                                    <div data-label="contentContainer" className="h-full w-full p-[10px] flex flex-col justify-center"> 
                                      <p className="w-full h-fit text-[1.5rem]">Weight</p>
                                      <p className="w-full h-fit  text-gray-400 text-[0.9rem]">Goal: 70kg</p>
                                   </div>
                                   <div data-label="badgeContainer" className={`h-full aspect-square rounded flex items-center justify-center`}> 
                                       <div className="h-[60%] w-[60%] bg-contain bg-center" style={{ backgroundImage: `url(${badges[badgeIndex]})` }}></div>
                                   </div>
                                </section>
                                 <section  data-label="GrowthInfoContainer" className="flex w-full h-[20%] justify-between">
                                   <div data-label="StartTime" className="w-[90px] h-[30px] bg-gray-200 text-gray-700 rounded text-[0.8rem] flex justify-center items-center">179 days</div>
                                   <div data-label="StartTime" className="w-[90px] h-[30px] bg-gray-200 text-gray-700 rounded text-[0.8rem] flex justify-center items-center">Avg: 1.56</div>
                                   <div data-label="StartTime" className="w-[90px] h-[30px] bg-gray-200 text-gray-700 rounded text-[0.8rem] flex justify-center items-center">Max Avg: 1.79</div>
                                 </section>
                                <section data-label="progressBarContainer" className="w-full h-[25%]  flex flex-col justify-center items-center">
                                   <div data-label="progressBarForTask" className="w-full h-[10px] rounded-full bg-gray-200 border-[1px] border-gray-400"> 
                                      <div data-label="completed" className="group  relative h-full rounded-full bg-gradient-to-r from-blue-400 to-bluePurple"  style={{ width: `${percentage}%` }}>
                                            <div className="absolute hidden group-hover:flex bg-gray-800 text-white h-[25px] w-[100px] text-xs px-2 py-1  -top-[30px] left-[0%] rounded items-center justify-center z-10 ">
                                             current: {currentString}
                                            </div>
                                      </div>
                                   </div>
                                   <p className="mt-[5px] w-full text-gray-500 text-[0.9rem]">Completed {percentage}%</p>
                                </section>
                           <div className="w-full h-fit"></div>
             </div> ))
           )}
      </div>
       <div className="h-[2px] w-full bg-gray-300"></div> {/* partition line */}  
    </div>
  );
};

export default Carousel;